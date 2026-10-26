'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const S = require('../src/state.js');
const scope = {window:{}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../src/data.js'),'utf8'),scope);
const plan = scope.window.READING_PLAN.encounters;
function memory(values={}) {
 return { getItem:key=>values[key]??null, setItem:(key,value)=>{values[key]=value;}, values };
}
test('dados inválidos são filtrados sem perder progresso ou preferências válidas',()=>{
 const state=S.sanitize({read:[0,6,6,34,-1,35,'2',null,1.5],current:22,palette:'rose',mode:'system',version:'NAA',acknowledged:true},35);
 assert.deepEqual(state,{read:[0,6,34],current:22,palette:'rose',mode:'system',version:'NAA',acknowledged:true});
 assert.deepEqual(S.sanitize(null,35),S.defaults());
 const invalid=S.sanitize({read:'bad',current:Infinity,palette:'constructor',mode:'evil',version:'__proto__',acknowledged:'true'},35);
 assert.deepEqual(invalid,S.defaults());
 const hostile=JSON.parse('{"version":{"toString":null,"valueOf":null},"read":[2],"current":3}');
 assert.equal(S.sanitize(hostile,35).version,'NVI');
 assert.deepEqual(S.sanitize(hostile,35).read,[2]);
});
test('as duas chaves existentes são lidas e salvas sem apagar a anterior',()=>{
 for(const key of [S.STORE_KEY,S.LEGACY_KEY]) {
  const saved={...S.defaults(),read:[0,2,5],current:18,palette:'salvia',mode:'dark',version:'ARC',acknowledged:true};
  const storage=memory({[key]:JSON.stringify(saved)});
  const loaded=S.readState(storage,35);
  assert.deepEqual(loaded,saved);
  assert.equal(S.writeState(storage,loaded),true);
  assert.deepEqual(JSON.parse(storage.values[S.STORE_KEY]),saved);
  assert.ok(storage.values[key]);
 }
});
test('registro atual tem prioridade e registro malformado permite recuperar a chave antiga',()=>{
 const old={...S.defaults(),read:[1,2],current:3};
 const latest={...S.defaults(),read:[4],current:9};
 const storage=memory({[S.STORE_KEY]:JSON.stringify(latest),[S.LEGACY_KEY]:JSON.stringify(old)});
 assert.deepEqual(S.readState(storage,35),latest);
 storage.values[S.STORE_KEY]='{invalid';
 assert.deepEqual(S.readState(storage,35),old);
});
test('falhas de acesso e de cota não interrompem o uso',()=>{
 let errors=0;
 const storage={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};
 assert.deepEqual(S.readState(storage,35,()=>errors++),S.defaults());
 assert.equal(S.writeState(storage,S.defaults(),()=>errors++),false);
 assert.equal(errors,3);
 assert.deepEqual(S.readState(undefined,35),S.defaults());
});
test('próxima pendência não substitui a leitura escolhida',()=>{
 const state={...S.defaults(),read:[0,1,3],current:22};
 assert.equal(S.nextPending(state,35),2);
 assert.equal(state.current,22);
 assert.equal(S.nextPending({...state,read:Array.from({length:35},(_,i)=>i)},35),null);
});
test('marcar e desmarcar preserva as demais preferências',()=>{
 const initial={...S.defaults(),current:4,palette:'azul',read:[1]};
 const result=S.toggleRead(initial,4,plan);
 assert.deepEqual(result.state.read,[1,4]);assert.deepEqual(initial.read,[1]);
 assert.equal(result.state.palette,'azul');assert.equal(result.celebration,null);
 assert.deepEqual(S.toggleRead(result.state,4,plan).state,initial);
 assert.equal(S.toggleRead(initial,-1,plan).state,initial);
});
test('celebração exige os sete encontros, inclusive revisão, em cada semana',()=>{
 for(let week=0;week<5;week++) {
  const read=Array.from({length:6},(_,i)=>week*7+i);
  const state={...S.defaults(),read,current:week*7+6};
  assert.equal(S.toggleRead({...state,read:read.slice(0,5)},week*7+6,plan).celebration,null);
  const result=S.toggleRead(state,week*7+6,plan);
  assert.equal(result.celebration,'week');
  assert.equal(S.toggleRead(result.state,week*7+6,plan).celebration,null);
 }
});
test('conclusão integral usa uma única mensagem e mantém todos os estudos disponíveis',()=>{
 for(const last of [0,6,34]) {
  const state={...S.defaults(),read:Array.from({length:35},(_,i)=>i).filter(i=>i!==last),current:last};
  const result=S.toggleRead(state,last,plan);
  assert.equal(result.celebration,'plan');assert.equal(result.state.read.length,35);
  assert.equal(S.toggleRead(result.state,last,plan).celebration,null);
  assert.equal(S.readState(memory({[S.STORE_KEY]:JSON.stringify(result.state)}),35).read.length,35);
 }
});
