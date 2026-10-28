/* Reflexões e ajudas nativas: dados sintéticos de progresso, sem respostas pessoais. */
'use strict';
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const BASE=process.env.BASE_URL || 'http://127.0.0.1:8002';
const artifacts=process.env.ARTIFACT_DIR || '/tmp/devotional-questions-results';
const KEY='leitura-biblica-mulheres-v1',LEGACY='plano-biblia-estudo-reflexao-v2';
const widths=[320,360,375,390,430,768,1024,1440];
const goals=['Observe a passagem','Entenda o texto','Reflita sobre sua vida'];
const reviewGoals=['Recorde as leituras','Compare e aprofunde','Continue o estudo'];
const errors=[];
let browser;
before(async()=>{
 fs.mkdirSync(artifacts,{recursive:true});
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
});
after(async()=>{await browser?.close();assert.deepEqual(errors,[], 'erros de execução, console ou recursos');});
async function pageFor({saved={acknowledged:true},storageKey=KEY,width=390,reducedMotion='no-preference',blocked=false}={}) {
 const context=await browser.newContext({viewport:{width,height:844},reducedMotion});
 if(blocked)await context.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}});});
 else await context.addInitScript(({saved,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(saved));},{saved,key:storageKey});
 const p=await context.newPage();p.setDefaultTimeout(7000);
 p.on('pageerror',error=>errors.push(error.message));
 p.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 p.on('response',response=>{if(response.status()>=400 && response.url().startsWith(BASE))errors.push(`${response.status()} ${response.url()}`);});
 await p.goto(BASE);await p.waitForFunction(()=>document.querySelectorAll('#questions > li').length===3);
 return p;
}
const items=p=>p.locator('#questions > li');
async function state(p) {return p.evaluate(({key,legacy})=>({primary:localStorage.getItem(key),legacy:localStorage.getItem(legacy),current:document.getElementById('encounter-number').textContent,progress:document.getElementById('progress').getAttribute('aria-valuenow')}),{key:KEY,legacy:LEGACY});}
async function openAll(p) {
 for(const details of await p.locator('#questions details.question-help').all())if(await details.getAttribute('open')===null)await details.locator('summary').click();
 await p.waitForTimeout(220);
}
async function shot(p,name) {await p.waitForTimeout(260);await p.screenshot({path:path.join(artifacts,name),fullPage:true});}

test('os 35 encontros exibem os 105 pares corretos, fechados inicialmente e associados à sua pergunta',async()=>{
 const p=await pageFor({width:1440});const plan=await p.evaluate(()=>window.READING_PLAN.encounters);const ids=new Set();
 for(let index=0;index<35;index++) {
  const entry=plan[index],expectedGoals=entry.review?reviewGoals:goals;
  assert.equal(await p.locator('#lesson-title').textContent(),entry.title);assert.equal(await items(p).count(),3);
  for(let questionIndex=0;questionIndex<3;questionIndex++) {
   const row=items(p).nth(questionIndex),question=entry.questions[questionIndex];
   const purpose=(await row.locator('.question-purpose').textContent()).replace(/^\s*\d{2}\s*[·—-]\s*/,'').trim();
   assert.equal(purpose,expectedGoals[questionIndex]);
   const text=row.locator('.question-text'),expectedId=`question-e${index+1}-q${questionIndex+1}`;
   assert.equal(await text.getAttribute('id'),expectedId);assert.equal(await text.textContent(),question.text);
   ids.add(expectedId);
   const details=row.locator('details.question-help'),summary=details.locator('summary');
   assert.equal(await summary.textContent(),'Entenda essa pergunta');
   assert.equal(await summary.getAttribute('aria-describedby'),expectedId);
   assert.equal(await details.getAttribute('open'),null);
   assert.equal(await details.locator('.question-help-text').textContent(),question.help);
   assert.equal(await details.locator('.question-help-text').isVisible(),false);
  }
  assert.equal(await p.locator('#reading-box').isVisible(),!entry.review);
  if(entry.review)assert.match(await p.locator('#passage-reference').textContent(),/Revisão/);
  else assert.equal(await p.locator('#passage-reference').textContent(),`${entry.book} ${entry.ch}:${entry.a}–${entry.b}`);
  if(index<34)await p.locator('#next').click();
 }
 assert.equal(ids.size,105);assert.equal(await p.locator('#next').isDisabled(),true);
 fs.writeFileSync(path.join(artifacts,'perguntas-pareamento.json'),JSON.stringify({encounters:35,questions:ids.size,helps:ids.size,collapsedInitially:true,ids:[...ids]},null,2));
 await p.context().close();
});

test('Enter, Espaço e Tab operam ajudas independentes; navegar ou renderizar novamente fecha todas',async()=>{
 const p=await pageFor();const before=await state(p);
 const first=items(p).nth(0).locator('details'),second=items(p).nth(1).locator('details');
 await first.locator('summary').focus();await p.keyboard.press('Enter');assert.equal(await first.getAttribute('open'),'');
 await p.keyboard.press('Tab');assert.equal(await second.locator('summary').evaluate(node=>node===document.activeElement),true);
 await p.keyboard.press('Space');assert.equal(await second.getAttribute('open'),'');assert.equal(await first.getAttribute('open'),'');
 await first.locator('summary').focus();await p.keyboard.press('Space');assert.equal(await first.getAttribute('open'),null);
 assert.equal(await second.getAttribute('open'),'');assert.deepEqual(await state(p),before);
 await p.locator('#translation').selectOption('NAA');
 assert.equal(await p.locator('#questions details[open]').count(),0,'renderizar a tradução fecha as ajudas');
 await openAll(p);await p.locator('#next').click();assert.equal(await p.locator('#questions details[open]').count(),0);
 await p.locator('#previous').click();assert.equal(await p.locator('#questions details[open]').count(),0);
 await openAll(p);const stored=await p.evaluate(key=>localStorage.getItem(key),KEY);await p.reload();
 assert.equal(await p.locator('#questions details[open]').count(),0);
 assert.equal(await p.evaluate(key=>localStorage.getItem(key),KEY),stored);
 assert.deepEqual(Object.keys(JSON.parse(stored)).sort(),['acknowledged','current','mode','palette','read','version']);
 await items(p).nth(0).locator('summary').focus();await p.keyboard.press('Tab');
 const focus=await items(p).nth(1).locator('summary').evaluate(node=>{const style=getComputedStyle(node);return {active:node===document.activeElement,width:parseFloat(style.outlineWidth),style:style.outlineStyle};});
 assert.equal(focus.active,true);assert.ok(focus.width>=2 && focus.style!=='none');
 await p.context().close();
});

test('as duas chaves antigas preservam progresso parcial ou completo, tradução, aparência e encontro',async()=>{
 for(const storageKey of [KEY,LEGACY])for(const complete of [false,true]) {
  const saved={read:complete?Array.from({length:35},(_,i)=>i):[0,6,17,34],current:complete?34:18,palette:'rose',mode:'dark',version:'NTLH',acknowledged:true};
  const p=await pageFor({saved,storageKey});const before=await state(p);
  assert.equal(before.progress,complete?'35':'4');
  assert.equal(await p.locator('#translation').inputValue(),'NTLH');assert.equal(await p.locator('html').getAttribute('data-palette'),'rose');
  assert.equal(await p.locator('html').getAttribute('data-mode'),'dark');
  assert.equal(await p.locator('#guide-notice').isVisible(),false);
  assert.equal(await p.locator('#questions details[open]').count(),0);await openAll(p);
  assert.deepEqual(await state(p),before);await p.reload();
  assert.deepEqual(await state(p),before);assert.equal(await p.locator('#questions details[open]').count(),0);
  if(complete){assert.equal(await p.locator('#mark-read').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('#celebration').isVisible(),false);}
  await p.context().close();
 }
});

test('a ajuda permanece utilizável sem armazenamento e respeita movimento reduzido',async()=>{
 const blocked=await pageFor({blocked:true});assert.equal(await blocked.locator('#storage-notice').isVisible(),true);
 await openAll(blocked);assert.equal(await blocked.locator('#questions details[open]').count(),3);
 await blocked.locator('#next').click();assert.equal(await blocked.locator('#questions details[open]').count(),0);
 await blocked.context().close();
 const p=await pageFor({reducedMotion:'reduce'});await openAll(p);
 const motions=await p.locator('#questions details, #questions summary, #questions .question-help-text').evaluateAll(nodes=>nodes.map(node=>{
  const style=getComputedStyle(node),after=getComputedStyle(node,'::after');return {animation:style.animationName,durations:style.transitionDuration.split(',').map(Number.parseFloat),afterAnimation:after.animationName,afterDurations:after.transitionDuration.split(',').map(Number.parseFloat)};
 }));
 assert.ok(motions.every(motion=>motion.animation==='none' && motion.afterAnimation==='none' && motion.durations.every(duration=>duration===0) && motion.afterDurations.every(duration=>duration===0)));
 assert.equal(await items(p).nth(0).locator('.question-help-text').isVisible(),true);
 await p.context().close();
});

test('perguntas e explicações usam texto seguro mesmo com sinais de marcação no conteúdo',async()=>{
 const p=await pageFor();const text='<img src=x onerror="window.__questionExecuted=true">';const help='<script>window.__questionExecuted=true</script>';
 await p.evaluate(({text,help})=>{window.__questionExecuted=false;window.READING_PLAN.encounters[0].questions[0]={text,help};},{text,help});
 await p.locator('#next').click();await p.locator('#previous').click();
 const row=items(p).nth(0);assert.equal(await row.locator('.question-text').textContent(),text);
 await row.locator('summary').click();assert.equal(await row.locator('.question-help-text').textContent(),help);
 assert.equal(await p.locator('#questions img, #questions script').count(),0);
 assert.equal(await p.evaluate(()=>window.__questionExecuted),false);
 await p.context().close();
});

test('os dez temas mantêm ajudas abertas legíveis e sem cortes nas oito larguras',async()=>{
 const p=await pageFor();const report=[];
 for(const palette of ['lavanda','salvia','areia','azul','rose'])for(const mode of ['light','dark']) {
  await p.locator('#theme-toggle').click();await p.locator(`[data-palette-choice="${palette}"]`).click();await p.locator(`[data-mode-choice="${mode}"]`).click();await p.keyboard.press('Escape');
  await openAll(p);
  for(const width of widths) {
   await p.setViewportSize({width,height:900});
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${palette}/${mode}/${width}: sem overflow`);
   for(const row of await items(p).all()) {
    const summary=row.locator('summary');await summary.evaluate(node=>Promise.all(node.getAnimations().map(animation=>animation.finished)));
    const box=await summary.boundingBox();assert.ok(box.width>=44 && box.height>=44,`${palette}/${mode}/${width}: área de toque`);
    const text=await row.locator('.question-help-text').evaluate(node=>({scrollHeight:node.scrollHeight,height:node.clientHeight,width:node.getBoundingClientRect().width}));
    assert.ok(text.scrollHeight<=text.height+1,`${palette}/${mode}/${width}: ajuda sem corte vertical`);
    assert.ok(text.width>0 && text.width<=width,`${palette}/${mode}/${width}: ajuda dentro da tela`);
   }
  }
  await p.setViewportSize({width:390,height:844});await shot(p,`perguntas-${palette}-${mode}-mobile.png`);
  await p.setViewportSize({width:1440,height:1000});await shot(p,`perguntas-${palette}-${mode}-desktop.png`);
  report.push({palette,mode,widths,openedHelps:3});
 }
 fs.writeFileSync(path.join(artifacts,'perguntas-responsividade.json'),JSON.stringify(report,null,2));
 await p.context().close();
});
