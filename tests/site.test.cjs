'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const read = (p) => fs.readFileSync(path.join(root,p),'utf8');
const scope = {window:{}};
vm.runInNewContext(read('src/data.js'),scope);
const { weeks,encounters } = scope.window.READING_PLAN;
const html = read('index.html'), app = ['src/app.js','src/state.js','src/overlays.js'].map(read).join('\n'), css = read('src/styles.css');
test('conteúdo editorial tem 35 encontros, 5 semanas e 5 revisões',()=>{
 assert.equal(weeks.length,5);assert.equal(encounters.length,35);
 assert.equal(encounters.filter(e=>e.review).length,5);
 for(let w=0;w<5;w++){
  const content=encounters.filter(e=>e.week===w);
  assert.equal(content.length,7);
  assert.equal(content.filter(e=>e.review).length,1);
  assert.equal(content[6].review,true);
 }
});
test('cada leitura possui referência e três questões; revisões não inventam versículos',()=>{
 for(const entry of encounters){
  assert.ok(entry.title && entry.lead && entry.context);
  assert.equal(entry.questions.length,3);
  for(const question of entry.questions)assert.ok(question.length>40);
  if(entry.review)assert.ok(!entry.book && !entry.code);
  else{
   assert.ok(entry.book && entry.code);
   assert.ok(Number.isInteger(entry.ch)&&Number.isInteger(entry.a)&&Number.isInteger(entry.b));
   assert.ok(entry.ch>0 && entry.a>0 && entry.b>=entry.a);
  }
 }
});
test('documento apresenta nome, créditos, método e controles necessários',()=>{
 assert.match(html,/<html lang="pt-BR"/);
 assert.match(html,/<h1 lang="en">Devotional Days<\/h1>/);
 assert.match(html,/35 dias de leitura e reflexão bíblica/);
 assert.match(html,/feito para mulheres/);
 assert.match(html,/Com fé e carinho, Lais Fernandes\./);
 for(const id of ['guide-notice','dismiss-guide','theme-panel','palette-options','translation','questions','context-details','mark-read','celebration'])assert.ok(html.includes(`id="${id}"`),id);
});
test('proteções de frontend documentadas e sem execução remota',()=>{
 assert.match(html,/Content-Security-Policy/);
 assert.match(html,/script-src 'self'/);
 assert.match(html,/connect-src 'none'/);
 assert.doesNotMatch(html,/<script[^>]+https?:\/\//i);
 assert.doesNotMatch(app,/\b(?:innerHTML|outerHTML|eval)\b(?=\s*(?:=|\())/);
 assert.match(app,/rel=.*noopener noreferrer|linkFor/);
 assert.match(app,/localStorage/);
 assert.match(app,/textContent/);
});
test('10 temas, responsividade, foco e movimento reduzido',()=>{
 const palettes=['lavanda','salvia','areia','azul','rose'];
 for(const p of palettes.filter(p=>p!=='lavanda'))assert.ok(css.includes(`[data-palette=${p}]`),p);
 assert.match(css, /:root\s*\{/);
 assert.match(css,/\[data-mode=dark\]/);
 assert.match(css,/@media\(max-width:690px\)/);
 assert.match(css, /prefers-reduced-motion:reduce/);
 assert.match(css, /:focus-visible/);
 assert.match(app, /prefers-color-scheme: dark/);
});

test('roteiro móvel e sobreposições têm controles acessíveis',()=>{
 for(const id of ['route-tab','route-panel','overlay-backdrop','close-route','mobile-progress','close-theme','dismiss-celebration'])assert.ok(html.includes(`id="${id}"`),id);
 assert.match(html,/aria-label="Abrir roteiro"/);
 assert.match(html,/aria-controls="route-panel" aria-expanded="false"/);
 assert.match(html,/id="celebration" role="dialog"/);
 assert.match(html,/id="theme-panel" role="dialog"/);
 assert.doesNotMatch(html,/class="mobile-nav"/);
});
