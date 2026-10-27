'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const scope = {window:{}};
vm.runInNewContext(read('src/data.js'), scope);
const plan = scope.window.READING_PLAN;

// DOM mínimo para conferir o documento produzido, sem dependência de runtime.
function render(source = plan) {
  const node = tag => ({tag, className:'', textContent:'', dataset:{}, attributes:{}, children:[],
    append(...children) { this.children.push(...children); },
    setAttribute(name, value) { this.attributes[name] = value; }
  });
  const root = node('section');
  let prints = 0;
  const window = {READING_PLAN:source, print() { prints++; }};
  Object.defineProperty(window, 'localStorage', {get() { throw new Error('A impressão não deve ler progresso.'); }});
  vm.runInNewContext(read('src/print.js'), {window, document:{
    getElementById(id) { assert.equal(id, 'print-plan-content'); return root; },
    createElement:node
  }});
  return {root, window, printed:() => prints};
}
function all(node) { return [node, ...node.children.flatMap(all)]; }
function text(node) { return [node.textContent, ...node.children.map(text)].filter(Boolean).join(' '); }

test('roteiro reutiliza os 35 encontros na ordem e com suas referências atuais', () => {
  const {root} = render();
  const sections = root.children.filter(node => node.className === 'print-week');
  assert.equal(sections.length, 5);
  const rows = all(root).filter(node => node.className === 'print-encounter');
  assert.equal(rows.length, 35);
  assert.equal(rows.filter(node => node.dataset.kind === 'reading').length, 30);
  assert.equal(rows.filter(node => node.dataset.kind === 'review').length, 5);
  sections.forEach((section, week) => {
    assert.match(text(section.children[0]), new RegExp(plan.weeks[week][0]));
    assert.equal(all(section).filter(node => node.className === 'print-encounter').length, 7);
  });
  rows.forEach((row, index) => {
    const entry = plan.encounters[index];
    assert.equal(row.dataset.encounter, String(index + 1));
    assert.equal(row.children.find(node => node.className === 'print-encounter-title').textContent, entry.title);
    assert.equal(row.children.find(node => node.className === 'print-reference').textContent,
      entry.review ? 'Revisão · sem passagem nova' : `${entry.book} ${entry.ch}:${entry.a}–${entry.b}`);
  });
  const alternative = structuredClone(plan);
  alternative.encounters[0].title = 'Título atualizado na fonte editorial';
  alternative.encounters[0].b = 19;
  const changed = text(render(alternative).root);
  assert.ok(changed.includes('Título atualizado na fonte editorial'));
  assert.ok(changed.includes('Marcos 1:14–19'));
});

test('impressão mantém autoria, quadradinhos vazios e exclui perguntas e contexto', () => {
  const {root, window, printed} = render();
  const nodes = all(root), content = text(root);
  for (const value of ['Devotional Days', '35 dias de leitura e reflexão bíblica', 'feito para mulheres', 'Com fé e carinho, Lais Fernandes.']) assert.ok(content.includes(value));
  const boxes = nodes.filter(node => node.className === 'print-checkbox');
  assert.equal(boxes.length, 35);
  assert.ok(boxes.every(node => node.textContent === '' && node.children.length === 0));
  assert.ok(nodes.every(node => !['button','input','select','a'].includes(node.tag)));
  for (const entry of plan.encounters) {
    assert.ok(!content.includes(entry.context));
    for (const question of entry.questions) assert.ok(!content.includes(question));
  }
  assert.equal(printed(), 0, 'não abre diálogo durante o carregamento');
  window.READING_PRINT.print();
  assert.equal(printed(), 1, 'somente o comando explícito abre o diálogo nativo');
});

test('estilo A4 usa duas páginas, semanas indivisíveis e caixas sem preenchimento', () => {
  const css = read('src/print.css');
  assert.match(css, /@page\s*\{\s*size:A4 portrait/);
  assert.match(css, /\.print-week\[data-week="4"\]\s*\{[^}]*break-before:page/);
  assert.match(css, /\.print-week\s*\{[^}]*break-inside:avoid-page/);
  assert.match(css, /\.print-checkbox\s*\{[^}]*background:#fff/);
  assert.match(css, /#print-plan-content\[hidden\]\s*\{\s*display:block!important/);
  assert.match(css, /body > :not\(#print-plan-content\)\s*\{\s*display:none!important/);
});
