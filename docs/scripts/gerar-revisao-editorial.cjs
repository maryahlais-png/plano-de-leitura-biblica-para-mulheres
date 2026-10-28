/* Documento de revisão: comparação imutável com a base, sem modificar o aplicativo. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname,'../..');
const base = '78e663756d4d4ca28fc41920bdcbe7b8e2a41d28';
const target = path.join(root,'docs/REVISAO-EDITORIAL-PERGUNTAS.md');
const args = process.argv.slice(2);
const noteFiles = [];
for (let index = 0; index < args.length; index++) {
  if (args[index] === '--help') {
    process.stdout.write('Uso: node docs/scripts/gerar-revisao-editorial.cjs [--notes arquivo.json]...\n');
    process.exit(0);
  }
  assert.equal(args[index],'--notes','Use somente --notes seguido de um arquivo JSON.');
  assert.ok(args[index+1],'Informe o arquivo JSON de notas após --notes.');
  noteFiles.push(path.resolve(args[++index]));
}
function readPlan(source) {
  const scope = {window:{}};
  vm.runInNewContext(source,scope,{timeout:1000});
  return JSON.parse(JSON.stringify(scope.window.READING_PLAN));
}
let originalSource;
try {
  originalSource = execFileSync('git',['show',`${base}:src/data.js`],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']});
} catch (_error) {
  throw new Error(`A base editorial não está no checkout. Execute git fetch origin ${base} e tente novamente. O gerador não busca dados da rede.`);
}
const original = readPlan(originalSource);
const revised = readPlan(fs.readFileSync(path.join(root,'src/data.js'),'utf8'));
assert.equal(original.encounters.length,35,'A base deve conter os 35 encontros.');
assert.equal(revised.encounters.length,35,'A revisão deve preservar os 35 encontros.');
const {encounters:oldEntries,...oldPlanMetadata} = original;
const {encounters:newEntries,...newPlanMetadata} = revised;
assert.deepEqual(newPlanMetadata,oldPlanMetadata,'Metadados do plano e ordem das semanas precisam permanecer idênticos.');
const readingRoles = ['Observe a passagem','Entenda o texto','Reflita sobre sua vida'];
const reviewRoles = ['Recorde as leituras','Compare e aprofunde','Continue o estudo'];
let questionCount = 0;
original.encounters.forEach((entry,index) => {
  const current = revised.encounters[index];
  const {questions:oldQuestions,...oldMetadata} = entry;
  const {questions:newQuestions,...newMetadata} = current;
  assert.deepEqual(newMetadata,oldMetadata,`Metadados alterados no encontro ${index+1}.`);
  assert.equal(oldQuestions.length,3);
  assert.equal(newQuestions.length,3);
  oldQuestions.forEach(question => assert.equal(typeof question,'string'));
  newQuestions.forEach((question,position) => {
    assert.deepEqual(Object.keys(question).sort(),['help','text'],`Formato incorreto em ${index+1}.${position+1}.`);
    assert.ok(typeof question.text === 'string' && question.text.trim(),`Pergunta vazia em ${index+1}.${position+1}.`);
    assert.ok(typeof question.help === 'string' && question.help.trim(),`Ajuda vazia em ${index+1}.${position+1}.`);
    assert.notEqual(question.text,oldQuestions[position],`Pergunta não reformulada em ${index+1}.${position+1}.`);
    questionCount++;
  });
});
assert.equal(questionCount,105);
const notes = new Map();
for (const filename of noteFiles) {
  const entries = JSON.parse(fs.readFileSync(filename,'utf8'));
  assert.ok(Array.isArray(entries),`Notas precisam ser uma lista: ${filename}.`);
  for (const entry of entries) {
    assert.ok(Number.isInteger(entry.encounter) && entry.encounter>=1 && entry.encounter<=35,'Identificador de encontro inválido nas notas.');
    assert.equal(entry.questions.length,3,'Cada encontro de notas deve ter três perguntas.');
    entry.questions.forEach((question,index) => {
      const current = revised.encounters[entry.encounter-1].questions[index];
      const key = `${entry.encounter}.${index+1}`;
      assert.equal(question.text,current.text,`Pergunta das notas desatualizada: ${key}.`);
      assert.equal(question.help,current.help,`Ajuda das notas desatualizada: ${key}.`);
      if (question.note) {
        assert.equal(typeof question.note,'string');
        assert.ok(!notes.has(key),`Nota duplicada: ${key}.`);
        notes.set(key,question.note);
      }
    });
  }
}
const lines = [
  '# Revisão editorial das 105 perguntas',
  '',
  'Comparativo para revisão da autora: 35 encontros, três perguntas por encontro e uma explicação individual para cada pergunta. As leituras mantêm a sequência de observar a passagem, entender o texto e refletir sobre a vida; as cinco revisões usam objetivos de recordar, comparar/aprofundar e continuar o estudo.',
  '',
  `A redação original vem da base publicada no commit \`${base}\`. A nova redação e a ajuda vêm diretamente de \`src/data.js\` desta proposta. O gerador verifica as correspondências, as 105 perguntas e a preservação de todos os demais metadados, referências, títulos e semanas antes de produzir este documento.`,
  '',
  'O objetivo editorial é tornar a pergunta clara e oferecer pistas para a reflexão própria, preservando a distinção entre o que a passagem afirma, sua interpretação e a aplicação pessoal. A comparação automatizada não certifica a interpretação bíblica nem substitui a avaliação da autora e de pessoa qualificada. A proposta depende de aprovação; este documento não autoriza publicação.',
  '',
  '## Como reproduzir a comparação',
  '',
  '```bash',
  "node docs/scripts/gerar-revisao-editorial.cjs --notes docs/evidencias/revisao-perguntas/semanas-1-2.json --notes docs/evidencias/revisao-perguntas/semanas-3-4.json --notes docs/evidencias/revisao-perguntas/semana-5.json",
  '```',
  '',
  'O comando sem opções regenera os pares de texto e ajuda. Para incluir também as notas editoriais, use `--notes arquivo.json` (opção repetível). Elas só são aceitas quando a pergunta e a ajuda do arquivo coincidem exatamente com o conteúdo final, evitando justificativas ligadas a rascunhos anteriores. As notas não fazem parte do conteúdo do aplicativo.',
  ''
];
function quote(text) { return text.split('\n').map(line=>`> ${line}`).join('\n'); }
revised.weeks.forEach(([name],week) => {
  lines.push(`## Semana ${week+1} · ${name}`,'');
  revised.encounters.forEach((entry,index) => {
    if (entry.week!==week) return;
    const number = String(index+1).padStart(2,'0');
    const reference = entry.review ? 'Revisão semanal · sem passagem nova' : `${entry.book} ${entry.ch}:${entry.a}–${entry.b}`;
    lines.push(`### Encontro ${number} · ${entry.title}`,'',`**Identificação:** ${reference}.`,'');
    entry.questions.forEach((question,position) => {
      const roles = entry.review ? reviewRoles : readingRoles;
      lines.push(`#### ${String(position+1).padStart(2,'0')} · ${roles[position]}`,'',
        '**Pergunta original**','',quote(original.encounters[index].questions[position]),'',
        '**Nova pergunta**','',quote(question.text),'',
        '**Entenda essa pergunta**','',quote(question.help),'');
      const note = notes.get(`${index+1}.${position+1}`);
      if (note) lines.push('**Nota editorial**','',quote(note),'');
    });
  });
});
fs.writeFileSync(target,`${lines.join('\n').trimEnd()}\n`);
process.stdout.write(`Comparativo gerado: ${revised.encounters.length} encontros, ${questionCount} perguntas e ajudas; ${notes.size} notas editoriais.\n`);
