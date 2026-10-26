/* Testes de integração opcionais: Playwright é ferramenta de teste, não dependência do site. */
'use strict';
const {test,before,after} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000';
const artifacts = process.env.ARTIFACT_DIR || '/tmp/devotional-days-results';
const key='leitura-biblica-mulheres-v1', legacy='plano-biblia-estudo-reflexao-v2';
let browser;
const errors=[];
before(async()=>{
 fs.mkdirSync(artifacts,{recursive:true});
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
});
after(async()=>{await browser?.close();assert.deepEqual(errors,[], 'erros de console, execução, CSP ou recursos');});
async function pageFor({width=390,height=844,saved,storageKey=key,blocked=false,reducedMotion='no-preference'}={}) {
 const context=await browser.newContext({viewport:{width,height},reducedMotion});
 if(saved) await context.addInitScript(({saved,storageKey})=>{if(!localStorage.getItem(storageKey))localStorage.setItem(storageKey,JSON.stringify(saved));},{saved,storageKey});
 if(blocked) await context.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Access denied','SecurityError');}});});
 const page=await context.newPage();
 page.setDefaultTimeout(7000);
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
 await page.goto(BASE);
 await page.waitForFunction(()=>document.querySelectorAll('.day').length===35);
 return page;
}
async function visible(page,id) { return page.locator(id).isVisible(); }
async function closed(page) { assert.equal(await visible(page,'#overlay-backdrop'),false);assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('modal-open')),false); }
async function screenshot(page,name) { await page.waitForTimeout(260);const modal=await page.locator('body').evaluate(n=>n.classList.contains('modal-open'));await page.screenshot({path:path.join(artifacts,name),fullPage:!modal}); }

test('primeiro acesso, consulta posterior, navegação, contexto, progresso e links',async()=>{
 const p=await pageFor();
 assert.equal(await p.title(),'Devotional Days — 35 dias de leitura e reflexão bíblica');
 assert.equal(await visible(p,'#guide-notice'),true);
 await screenshot(p,'depois-mobile.png');
 await p.locator('#dismiss-guide').click();await p.reload();
 assert.equal(await visible(p,'#guide-notice'),false);
 await p.locator('#show-guide').click();assert.equal(await visible(p,'#guide-notice'),true);
 await p.locator('#dismiss-guide').click();
 assert.equal(await p.locator('#previous').isDisabled(),true);
 await p.locator('#next').click();assert.match(await p.locator('#encounter-number').innerText(),/02/);
 await p.locator('#context-details summary').click();assert.equal(await p.locator('#context-details').getAttribute('open'),'');
 await p.locator('#previous').click();assert.equal(await p.locator('#context-details').getAttribute('open'),null);
 await p.locator('#mark-read').click();await p.reload();
 assert.equal(await p.locator('#mark-read').getAttribute('aria-pressed'),'true');
 assert.equal(await p.locator('#progress').getAttribute('aria-valuenow'),'1');
 await p.locator('#theme-toggle').click();await p.locator('[data-palette-choice="azul"]').click();await p.locator('[data-mode-choice="dark"]').click();await p.keyboard.press('Escape');
 await p.reload();assert.equal(await p.locator('html').getAttribute('data-palette'),'azul');
 assert.equal(await p.locator('#mark-read').getAttribute('aria-pressed'),'true');
 await p.locator('#mark-read').click();assert.equal(await p.locator('#progress').getAttribute('aria-valuenow'),'0');
 const versions={NVI:129,NAA:1840,ARA:1608,ARC:212,NVT:1930,NTLH:211};
 for(const [name,id] of Object.entries(versions)) {
  await p.locator('#translation').selectOption(name);
  assert.equal(await p.locator('#bible-link').getAttribute('href'),`https://www.bible.com/pt/bible/${id}/MRK.1.14-20.${name}`);
 }
 const links=await p.locator('a[target="_blank"]').evaluateAll(nodes=>nodes.map(n=>({href:n.href,rel:n.rel,policy:n.referrerPolicy})));
 for(const link of links) {assert.match(link.href,/^https:\/\//);assert.match(link.rel,/noopener/);assert.match(link.rel,/noreferrer/);assert.equal(link.policy,'no-referrer');}
 await p.context().close();
});

test('todos os encontros mantêm referência, questões e navegação de revisão',async()=>{
 const p=await pageFor({width:1440,saved:{acknowledged:true}});
 const plan=await p.evaluate(()=>window.READING_PLAN.encounters);
 for(let i=0;i<plan.length;i++) {
  const entry=plan[i];
  assert.equal(await p.locator('#lesson-title').innerText(),entry.title);
  assert.equal(await p.locator('#questions li').count(),3);
  assert.equal(await visible(p,'#reading-box'),!entry.review);
  if(!entry.review) assert.equal(await p.locator('#bible-link').getAttribute('href'),`https://www.bible.com/pt/bible/129/${entry.code}.${entry.ch}.${entry.a}-${entry.b}.NVI`);
  else assert.match(await p.locator('#passage-reference').innerText(),/Revisão/);
  if(i<34)await p.locator('#next').click();
 }
 assert.equal(await p.locator('#next').isDisabled(),true);
 await p.context().close();
});

test('roteiro e aparência: foco, teclado, clique fora, rolagem e troca de viewport',async()=>{
 const p=await pageFor({saved:{acknowledged:true,current:3}});
 const button=await p.locator('#route-tab').boundingBox();assert.ok(button.width>=44 && button.height>=44 && button.width<=48);
 await p.locator('#route-tab').click();await p.waitForTimeout(250);
 assert.equal(await p.locator('#route-panel').getAttribute('aria-modal'),'true');
 assert.equal(await p.locator('#close-route').evaluate(n=>n===document.activeElement),true);
 assert.equal(await p.locator('.site-header').evaluate(n=>n.inert),true);
 await screenshot(p,'roteiro-mobile.png');
 await p.keyboard.press('Shift+Tab');assert.equal(await p.locator('.week>summary').last().evaluate(n=>n===document.activeElement),true);
 await p.keyboard.press('Tab');assert.equal(await p.locator('#close-route').evaluate(n=>n===document.activeElement),true);
 const before=await p.evaluate(()=>scrollY);await p.mouse.wheel(0,600);assert.equal(await p.evaluate(()=>scrollY),before);
 await p.keyboard.press('Escape');await closed(p);
 assert.equal(await p.locator('#route-tab').evaluate(n=>n===document.activeElement),true);
 await p.locator('#route-tab').click();await p.locator('#overlay-backdrop').click({position:{x:380,y:100}});await closed(p);
 await p.locator('#route-tab').click();await p.locator('.day[data-index="5"]').click();await closed(p);
 assert.match(await p.locator('#encounter-number').innerText(),/06/);
 assert.equal(await p.locator('#leitura').evaluate(n=>n===document.activeElement),true);
 assert.ok((await p.locator('#leitura').boundingBox()).y>=0);
 await p.locator('#theme-toggle').click();await screenshot(p,'aparencia-mobile.png');
 assert.equal(await p.locator('#route-tab').evaluate(n=>!!n.closest('[inert]')),true);
 const top=await p.locator('#close-theme').evaluate(n=>{const b=n.getBoundingClientRect();return document.elementFromPoint(b.x+b.width/2,b.y+b.height/2).closest('button').id;});assert.equal(top,'close-theme');
 await p.keyboard.press('Shift+Tab');assert.equal(await p.locator('[data-mode-choice="system"]').evaluate(n=>n===document.activeElement),true);
 await p.keyboard.press('Tab');assert.equal(await p.locator('#close-theme').evaluate(n=>n===document.activeElement),true);
 await p.keyboard.press('Escape');assert.equal(await p.locator('#theme-toggle').evaluate(n=>n===document.activeElement),true);
 await p.locator('#theme-toggle').click();await p.locator('#overlay-backdrop').click({position:{x:10,y:500}});await closed(p);
 await p.locator('#route-tab').click();await p.setViewportSize({width:1024,height:900});await closed(p);
 assert.equal(await p.locator('#route-panel').getAttribute('role'),null);assert.equal(await p.locator('#route-panel').evaluate(n=>n.inert),false);
 await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>document.getElementById('route-panel').inert);
 // Abrir e fechar no fim da página não deve mudar a posição de leitura.
 await p.locator('#mark-read').scrollIntoViewIfNeeded();const pos=await p.evaluate(()=>scrollY);
 await p.evaluate(()=>document.getElementById('route-tab').click());await p.keyboard.press('Escape');
 assert.ok(Math.abs(await p.evaluate(()=>scrollY)-pos)<=1);
 await p.context().close();
});

test('dados anteriores, leitura atual preservada, retorno explícito e armazenamento recusado',async()=>{
 for(const storageKey of [key,legacy]) {
  const p=await pageFor({storageKey,saved:{read:[0,1,3],current:18,palette:'rose',mode:'dark',version:'NAA',acknowledged:true}});
  assert.match(await p.locator('#encounter-number').innerText(),/19/);
  assert.equal(await p.locator('html').getAttribute('data-palette'),'rose');
  assert.equal(await p.locator('#translation').inputValue(),'NAA');
  await p.locator('#resume-reading').click();assert.match(await p.locator('#encounter-number').innerText(),/03/);
  await p.reload();assert.match(await p.locator('#encounter-number').innerText(),/03/);
  assert.equal(await p.locator('#progress').getAttribute('aria-valuenow'),'3');
  await p.context().close();
 }
 const p=await pageFor({blocked:true});
 assert.equal(await visible(p,'#storage-notice'),true);
 await p.locator('#dismiss-guide').click();await p.locator('#mark-read').click();await p.locator('#next').click();
 assert.match(await p.locator('#encounter-number').innerText(),/02/);
 await p.context().close();
 const quota=await pageFor();
 await quota.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError');};});
 await quota.locator('#mark-read').click();assert.equal(await visible(quota,'#storage-notice'),true);
 assert.equal(await quota.locator('#progress').getAttribute('aria-valuenow'),'1');await quota.context().close();
});

test('celebração semanal, final, foco, Escape, movimento reduzido e nenhuma repetição ao recarregar',async()=>{
 for(const complete of [false,true]) {
  const p=await pageFor({saved:{read:Array.from({length:complete?34:6},(_,i)=>i),current:complete?34:6,acknowledged:true},reducedMotion:complete?'reduce':'no-preference'});
  assert.equal(await visible(p,'#reading-box'),false);
  if(complete)assert.equal(await p.locator('#next').isDisabled(),true);
  await p.locator('#mark-read').click();
  assert.equal(await p.locator('#celebration-title').innerText(),complete?'Seu plano foi concluído':'Semana concluída');
  const box=await p.locator('#celebration').boundingBox();assert.ok(box.y>=0 && box.y+box.height<=844);
  assert.equal(await p.locator('#dismiss-celebration').evaluate(n=>n===document.activeElement),true);
  assert.equal(await p.locator('main').evaluate(n=>n.inert),true);
  const crystal=await p.locator('.crystal').first().evaluate(n=>({bg:getComputedStyle(n).backgroundColor,animation:getComputedStyle(n).animationName,opacity:getComputedStyle(n).opacity}));
  assert.equal(crystal.bg,'rgb(255, 255, 255)');
  if(complete){assert.equal(crystal.animation,'none');assert.ok(Number(crystal.opacity)>0);}
  await screenshot(p,complete?'conclusao-mobile.png':'celebracao-mobile.png');
  await p.keyboard.press('Escape');await closed(p);
  assert.equal(await p.locator('#mark-read').evaluate(n=>n===document.activeElement),true);
  await p.reload();assert.equal(await visible(p,'#celebration'),false);
  assert.equal(await p.locator('#progress').getAttribute('aria-valuenow'),complete?'35':'7');
  await p.locator('#mark-read').click();assert.equal(await visible(p,'#celebration'),false);
  await p.locator('#mark-read').click();await p.locator('#dismiss-celebration').click();await closed(p);
  await p.context().close();
 }
});

// Cálculo sRGB da WCAG para os pares efetivamente usados pelos componentes.
function contrast(a,b) {
 const lum=hex=>{const v=hex.match(/[a-f\d]{2}/gi).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2];};
 const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
test('dez temas, contraste dos tokens, sete larguras, recursos, painel e modo automático',async()=>{
 const p=await pageFor({saved:{acknowledged:true}});
 const report=[];
 for(const palette of ['lavanda','salvia','areia','azul','rose'])for(const mode of ['light','dark']) {
  await p.locator('#theme-toggle').click();await p.locator(`[data-palette-choice="${palette}"]`).click();await p.locator(`[data-mode-choice="${mode}"]`).click();await p.locator('#close-theme').click();
  const tokens=await p.locator('html').evaluate(el=>{
   const cs=getComputedStyle(el);return Object.fromEntries(['bg','surface','surface-soft','surface-elevated','text','muted','accent','accent-fg','control-border','tint','hero-a','hero-b','hero-ink'].map(k=>[k,cs.getPropertyValue(`--${k}`).trim()]));
  });
  const pairs=[];
  for(const fg of ['text','muted','accent'])for(const bg of ['bg','surface','surface-soft','surface-elevated','tint'])pairs.push([fg,bg,4.5]);
  pairs.push(['accent-fg','accent',4.5],['hero-ink','hero-a',4.5],['hero-ink','hero-b',4.5],['control-border','surface',3],['control-border','surface-soft',3],['accent','surface',3]);
  let minimum=Infinity;
  for(const [fg,bg,required] of pairs){const ratio=contrast(tokens[fg],tokens[bg]);assert.ok(ratio>=required,`${palette} ${mode}: ${fg}/${bg} = ${ratio.toFixed(2)} < ${required}`);if(required===4.5)minimum=Math.min(minimum,ratio);}
  for(const width of [320,360,375,390,430,768,1440]) {
   await p.setViewportSize({width,height:900});
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${palette}/${mode}/${width}: overflow`);
   await p.locator('#theme-toggle').click();
   const panel=await p.locator('#theme-panel').boundingBox();assert.ok(panel.x>=0 && panel.x+panel.width<=width && panel.y>=0 && panel.y+panel.height<=900);
   await p.locator('#close-theme').click();
   if(width<=430){await p.locator('#route-tab').click();await p.waitForTimeout(230);const route=await p.locator('#route-panel').boundingBox();assert.ok(route.x>=-1 && route.x+route.width<=width);await p.keyboard.press('Escape');}
  }
  await p.setViewportSize({width:1440,height:1000});await p.locator('#theme-toggle').focus();await p.locator('#theme-toggle').evaluate(n=>n.blur());
  await screenshot(p,`desktop-${palette}-${mode}.png`);
  await p.setViewportSize({width:390,height:844});await screenshot(p,`mobile-${palette}-${mode}.png`);
  report.push({palette,mode,minimumTextContrast:Number(minimum.toFixed(2)),widths:[320,360,375,390,430,768,1440]});
 }
 await p.locator('#theme-toggle').click();await p.locator('[data-mode-choice="system"]').click();await p.locator('#close-theme').click();
 await p.emulateMedia({colorScheme:'dark'});await p.waitForFunction(()=>document.documentElement.dataset.mode==='dark');
 await p.emulateMedia({colorScheme:'light'});await p.waitForFunction(()=>document.documentElement.dataset.mode==='light');
 await p.reload();assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).mode,key),'system');
 // Reflow na largura CSS de 320px; zoom nativo deve ser conferido também no navegador pessoal.
 await p.setViewportSize({width:320,height:900});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 fs.writeFileSync(path.join(artifacts,'temas-contraste.json'),JSON.stringify(report,null,2));
 await p.context().close();
});
