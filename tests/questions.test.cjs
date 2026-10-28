'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const baseline=require('./fixtures/questions-original-hashes.json');
const source=fs.readFileSync(path.join(__dirname,'../src/data.js'),'utf8');
const scope={window:{}};vm.runInNewContext(source,scope);
const plan=JSON.parse(JSON.stringify(scope.window.READING_PLAN));
const allQuestions=plan.encounters.flatMap(entry=>entry.questions);
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const normalize=value=>value.normalize('NFC').replace(/\s+/g,' ').trim().toLocaleLowerCase('pt-BR');
function canonical(value) {
 if(Array.isArray(value))return value.map(canonical);
 if(value && typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
 return value;
}

test('os 35 encontros contêm exatamente 105 pares de pergunta e explicação',()=>{
 assert.equal(plan.encounters.length,35);assert.equal(allQuestions.length,105);
 assert.equal(plan.encounters.filter(entry=>entry.review).length,5);
 for(const [index,entry] of plan.encounters.entries()) {
  assert.equal(entry.questions.length,3,`encontro ${index+1}`);
  for(const question of entry.questions) {
   assert.deepEqual(Object.keys(question).sort(),['help','text']);
   for(const field of ['text','help']) {
    assert.equal(typeof question[field],'string');
    assert.ok(question[field].trim().length>0,`${field} não pode estar vazio`);
    assert.equal(question[field],question[field].trim(),`${field} sem espaços nas extremidades`);
   }
   assert.notEqual(normalize(question.text),normalize(question.help),'a ajuda explica a intenção, sem repetir a pergunta');
  }
 }
});

test('as 105 perguntas e as 105 explicações são individualizadas, sem duplicatas exatas',()=>{
 assert.equal(new Set(allQuestions.map(question=>normalize(question.text))).size,105);
 assert.equal(new Set(allQuestions.map(question=>normalize(question.help))).size,105);
});

test('todas as 105 perguntas diferem das respectivas perguntas publicadas',()=>{
 assert.equal(baseline.questionTextSha256.length,105);
 allQuestions.forEach((question,index)=>assert.notEqual(sha(question.text),baseline.questionTextSha256[index],`pergunta ${index+1} ainda é idêntica à publicada`));
});

test('a terceira pergunta aprovada do Encontro 01 é preservada exatamente',()=>{
 assert.equal(plan.encounters[0].questions[2].text,'Ao pensar no seu tempo, nas suas escolhas e nos seus compromissos, que prioridades o chamado de Jesus faz você repensar?');
});

test('semanas, referências, títulos, contextos e ordem são idênticos à main publicada',()=>{
 // Fixture contém somente hashes da main 78e6637, sem replicar todo o plano original.
 // O artefato de origem foi comparado byte a byte com git show desse commit ao gerar a fixture.
 const metadata={...plan,encounters:plan.encounters.map(({questions,...entry})=>entry)};
 assert.equal(sha(JSON.stringify(canonical(metadata))),baseline.metadataSha256);
 assert.equal(baseline.commit,'78e663756d4d4ca28fc41920bdcbe7b8e2a41d28');
});
