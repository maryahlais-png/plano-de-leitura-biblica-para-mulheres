/* Compartilhamento e impressão com APIs de dispositivo simuladas, sem enviar mensagens reais. */
'use strict';
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const BASE=process.env.BASE_URL || 'http://127.0.0.1:8002';
const artifacts=process.env.ARTIFACT_DIR || '/tmp/devotional-features-results';
const CANONICAL='https://maryahlais-png.github.io/plano-de-leitura-biblica-para-mulheres/';
const MESSAGE='Conheça o Devotional Days, um plano gratuito de 35 encontros para leitura e reflexão bíblica. Um convite para estudar a Palavra com calma, no seu ritmo.';
const KEY='leitura-biblica-mulheres-v1';
const saved={read:[0,6,7],current:9,palette:'azul',mode:'dark',version:'NAA',acknowledged:true};
const errors=[];
let browser;
before(async()=>{
 fs.mkdirSync(artifacts,{recursive:true});
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
});
after(async()=>{await browser?.close();assert.deepEqual(errors,[], 'erros de execução, console ou recursos locais');});
async function pageFor({share='absent',clipboard='success',state=saved,width=390}={}) {
 const context=await browser.newContext({viewport:{width,height:844}});
 await context.addInitScript(({share,clipboard,state,key})=>{
  if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(state));
  window.__shareCalls=[];window.__clipboardCalls=[];window.__printCalls=[];
  Object.defineProperty(navigator,'share',{configurable:true,value:share==='absent'?undefined:async data=>{
   window.__shareCalls.push(data);
   if(share==='cancel')throw new DOMException('Canceled','AbortError');
   if(share==='failure')throw new DOMException('Unavailable','NotAllowedError');
  }});
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:clipboard==='absent'?undefined:{writeText:async text=>{
   window.__clipboardCalls.push(text);
   if(clipboard==='failure')throw new DOMException('Denied','NotAllowedError');
   if(clipboard==='pending')return new Promise((resolve,reject)=>{window.__resolveCopy=resolve;window.__rejectCopy=reject;});
  }}});
  window.print=()=>window.__printCalls.push({modalOpen:document.body.classList.contains('modal-open')});
 },{share,clipboard,state,key:KEY});
 const p=await context.newPage();p.setDefaultTimeout(7000);
 p.on('pageerror',error=>errors.push(error.message));
 p.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 p.on('response',response=>{if(response.status()>=400 && response.url().startsWith(BASE))errors.push(`${response.status()} ${response.url()}`);});
 await p.goto(BASE);await p.waitForFunction(()=>document.getElementById('tools-toggle') && window.READING_PRINT);
 return p;
}
async function snapshot(p) {return p.evaluate(key=>({saved:localStorage.getItem(key),encounter:document.getElementById('encounter-number').textContent,read:document.getElementById('mark-read').getAttribute('aria-pressed')}),KEY);}
async function openTools(p) {
 await p.locator('#tools-toggle').click();
 assert.equal(await p.locator('#tools-panel').getAttribute('aria-modal'),'true');
 assert.equal(await p.locator('#close-tools').evaluate(node=>node===document.activeElement),true);
}
async function showFallback(p) {await openTools(p);await p.locator('#share-site').click();await p.locator('#share-fallback').waitFor({state:'visible'});}
async function shot(p,name,fullPage=false) {await p.waitForTimeout(260);await p.screenshot({path:path.join(artifacts,name),fullPage});}

test('Web Share recebe só o endereço canônico e a mensagem, sem alterar o devocional',async()=>{
 const p=await pageFor({share:'success'});const before=await snapshot(p);
 await openTools(p);assert.deepEqual(await p.evaluate(()=>window.__shareCalls),[]);
 await p.locator('#share-site').click();
 const calls=await p.evaluate(()=>window.__shareCalls);assert.equal(calls.length,1);
 assert.equal(calls[0].url,CANONICAL);assert.equal(calls[0].text,MESSAGE);assert.match(calls[0].title,/Devotional Days/);
 assert.deepEqual(Object.keys(calls[0]).sort(),['text','title','url']);
 assert.equal(new URL(calls[0].url).search,'');
 assert.equal(await p.locator('#share-fallback').isVisible(),false);
 assert.equal(await p.locator('#share-site').isEnabled(),true);
 assert.deepEqual(await snapshot(p),before);
 await p.context().close();
});

test('cancelar o compartilhamento nativo é silencioso e não abre alternativas insistentes',async()=>{
 const p=await pageFor({share:'cancel'});const before=await snapshot(p);
 await openTools(p);await p.locator('#share-site').click();
 assert.equal(await p.evaluate(()=>window.__shareCalls.length),1);
 assert.equal(await p.locator('#share-fallback').isVisible(),false);
 assert.equal(await p.locator('#share-status').textContent(),'');
 assert.equal(await p.locator('#share-site').isEnabled(),true);
 assert.deepEqual(await snapshot(p),before);
 await p.context().close();
});

test('falha da Web Share oferece alternativas sem enviar ou registrar o compartilhamento',async()=>{
 const p=await pageFor({share:'failure'});const before=await snapshot(p);
 await showFallback(p);
 assert.equal(await p.evaluate(()=>window.__shareCalls.length),1);
 assert.equal(await p.locator('#copy-link').isVisible(),true);
 assert.equal(await p.locator('#share-whatsapp').isVisible(),true);
 assert.equal(p.context().pages().length,1);
 assert.deepEqual(await snapshot(p),before);
 await p.context().close();
});

test('sem Web Share, a cópia só anuncia sucesso depois da confirmação da Clipboard API',async()=>{
 const p=await pageFor({clipboard:'pending'});const before=await snapshot(p);
 await showFallback(p);await p.locator('#copy-link').click();
 assert.deepEqual(await p.evaluate(()=>window.__clipboardCalls),[CANONICAL]);
 assert.equal(await p.locator('#copy-link').isDisabled(),true);
 assert.doesNotMatch(await p.locator('#share-status').textContent(),/copiado/i);
 await p.evaluate(()=>window.__resolveCopy());
 await p.waitForFunction(()=>document.getElementById('share-status').textContent.includes('Link copiado.'));
 assert.equal(await p.locator('#copy-link').isEnabled(),true);
 assert.equal(await p.locator('#share-status').getAttribute('role'),'status');
 assert.equal(await p.locator('#share-manual').isVisible(),false);
 assert.deepEqual(await snapshot(p),before);
 await p.context().close();
});

test('cópia recusada ou indisponível oferece campo readonly selecionável e inclui o campo no teclado',async()=>{
 for(const clipboard of ['absent','failure']) {
  const p=await pageFor({clipboard});const before=await snapshot(p);
  await showFallback(p);await p.locator('#copy-link').click();
  const input=p.locator('#share-link');await input.waitFor({state:'visible'});
  assert.equal(await input.inputValue(),CANONICAL);assert.equal(await input.getAttribute('readonly'),'');
  assert.equal(await input.evaluate(node=>node===document.activeElement),true);
  assert.deepEqual(await input.evaluate(node=>[node.selectionStart,node.selectionEnd]),[0,CANONICAL.length]);
  assert.doesNotMatch(await p.locator('#share-status').textContent(),/link copiado/i);
  await p.locator('#share-whatsapp').focus();await p.keyboard.press('Tab');
  assert.equal(await input.evaluate(node=>node===document.activeElement),true);
  await p.keyboard.press('Tab');assert.equal(await p.locator('#print-plan').evaluate(node=>node===document.activeElement),true);
  await p.keyboard.press('Shift+Tab');assert.equal(await input.evaluate(node=>node===document.activeElement),true);
  await p.keyboard.press('Escape');assert.equal(await p.locator('#tools-toggle').evaluate(node=>node===document.activeElement),true);
  assert.deepEqual(await snapshot(p),before);
  await p.context().close();
 }
});

test('WhatsApp abre somente após o clique e transmite mensagem sem parâmetros de rastreamento',async()=>{
 const p=await pageFor();const before=await snapshot(p);await showFallback(p);
 const link=p.locator('#share-whatsapp'),url=new URL(await link.getAttribute('href'));
 assert.equal(url.origin,'https://wa.me');assert.deepEqual([...url.searchParams.keys()],['text']);
 assert.equal(url.searchParams.get('text'),`${MESSAGE}\n\n${CANONICAL}`);
 assert.equal(await link.getAttribute('target'),'_blank');assert.match(await link.getAttribute('rel'),/noopener/);assert.match(await link.getAttribute('rel'),/noreferrer/);
 assert.equal(await link.getAttribute('referrerpolicy'),'no-referrer');
 assert.equal(p.context().pages().length,1);
 const requests=[];
 await p.context().route('https://wa.me/**',route=>{
  const request=route.request();if(!request.isNavigationRequest())return route.fulfill({status:204,body:''});
  requests.push({url:request.url(),referrer:request.headers().referer});
  return route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><title>Destino simulado</title><link rel="icon" href="data:,"></head><body>Teste de navegação, sem envio de mensagem.</body></html>'});
 });
 const popupPromise=p.waitForEvent('popup');await link.click();const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded');
 assert.equal(popup.url(),url.href);assert.equal(await popup.evaluate(()=>window.opener===null),true);
 assert.deepEqual(requests,[{url:url.href,referrer:undefined}]);assert.deepEqual(await snapshot(p),before);
 await popup.close();await p.context().close();
});

test('Mais opções preserva foco, Escape, clique fora e instruções de instalação não invasivas',async()=>{
 const p=await pageFor();const before=await snapshot(p);await openTools(p);
 assert.equal(await p.locator('main').evaluate(node=>node.inert),true);
 await p.keyboard.press('Shift+Tab');assert.equal(await p.locator('#install-help summary').evaluate(node=>node===document.activeElement),true);
 await p.keyboard.press('Tab');assert.equal(await p.locator('#close-tools').evaluate(node=>node===document.activeElement),true);
 assert.equal(await p.locator('#install-app').isVisible(),false);
 await p.locator('#install-help summary').click();
 const help=await p.locator('#install-help').innerText();
 assert.match(help,/Safari/);assert.match(help,/Tela de Início/i);assert.match(help,/progresso|armazenamento/i);
 await shot(p,'mais-opcoes-ajuda-mobile.png');
 await p.keyboard.press('Escape');assert.equal(await p.locator('#tools-panel').isVisible(),false);
 assert.equal(await p.locator('#tools-toggle').evaluate(node=>node===document.activeElement),true);
 await openTools(p);await p.locator('#overlay-backdrop').click({position:{x:3,y:700}});
 assert.equal(await p.locator('#tools-panel').isVisible(),false);
 assert.equal(await p.locator('#tools-toggle').evaluate(node=>node===document.activeElement),true);
 assert.deepEqual(await snapshot(p),before);await p.context().close();
});

test('Imprimir roteiro chama o diálogo explicitamente e mostra os mesmos 35 encontros com caixas vazias',async()=>{
 const state={...saved,read:Array.from({length:35},(_,i)=>i),current:34,palette:'rose'};
 const p=await pageFor({state});const before=await snapshot(p);
 assert.equal(await p.locator('#print-plan-content').isVisible(),false);
 assert.deepEqual(await p.evaluate(()=>window.__printCalls),[]);
 await openTools(p);await p.locator('#print-plan').click();
 assert.deepEqual(await p.evaluate(()=>window.__printCalls),[{modalOpen:false}]);
 assert.equal(await p.locator('#tools-panel').isVisible(),false);
 assert.equal(await p.locator('#tools-toggle').evaluate(node=>node===document.activeElement),true);
 const plan=await p.evaluate(()=>window.READING_PLAN);
 assert.equal(await p.locator('.print-week').count(),5);assert.equal(await p.locator('.print-encounter').count(),35);
 assert.equal(await p.locator('.print-encounter[data-kind="review"]').count(),5);
 assert.equal(await p.locator('.print-encounter[data-kind="reading"]').count(),30);
 for(let index=0;index<35;index++) {
  const entry=plan.encounters[index],row=p.locator(`.print-encounter[data-encounter="${index+1}"]`);
  assert.equal(await row.locator('.print-encounter-title').textContent(),entry.title);
  assert.equal(await row.locator('.print-reference').textContent(),entry.review?'Revisão · sem passagem nova':`${entry.book} ${entry.ch}:${entry.a}–${entry.b}`);
  assert.equal(await row.locator('.print-checkbox').textContent(),'');
 }
 for(let week=1;week<=5;week++) {
  const section=p.locator(`.print-week[data-week="${week}"]`);
  assert.equal(await section.locator('.print-encounter').count(),7);
  assert.ok((await section.locator('.print-week-title').textContent()).includes(plan.weeks[week-1][0]));
 }
 await p.emulateMedia({media:'print'});assert.equal(await p.locator('#print-plan-content').isVisible(),true);
 assert.equal(await p.locator('#leitura').isVisible(),false);assert.equal(await p.locator('#tools-toggle').isVisible(),false);
 assert.equal(await p.locator('#questions').isVisible(),false);assert.equal(await p.locator('#context-details').isVisible(),false);
 assert.match(await p.locator('#print-plan-content').innerText(),/Com fé e carinho, Lais Fernandes\./);
 const paper=await p.locator('body').evaluate(node=>getComputedStyle(node).backgroundColor);assert.equal(paper,'rgb(255, 255, 255)');
 const boxes=await p.locator('.print-checkbox').evaluateAll(nodes=>nodes.map(node=>{const s=getComputedStyle(node);return {background:s.backgroundColor,width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height};}));
 assert.ok(boxes.every(box=>box.background==='rgb(255, 255, 255)' && box.width>=14 && box.height>=14));
 const printed=await p.locator('#print-plan-content').textContent();
 for(const entry of plan.encounters) {for(const question of entry.questions)assert.equal(printed.includes(question),false);assert.equal(printed.includes(entry.context),false);}
 await p.emulateMedia({media:'screen'});assert.equal(await p.locator('#print-plan-content').isVisible(),false);
 assert.deepEqual(await snapshot(p),before);await p.context().close();
});

test('a área auxiliar cabe com e sem retomada, sem encobrir a leitura',async()=>{
 for(const resume of [false,true]) {
  const p=await pageFor({state:{read:[],current:resume?4:0,acknowledged:true,mode:'light',palette:'lavanda'}});
  assert.equal(await p.locator('#resume-reading').isVisible(),resume);
  for(const width of [320,360,375,390,430,768,1024,1440]) {
   await p.setViewportSize({width,height:900});
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   const box=await p.locator('#tools-toggle').boundingBox();
   assert.ok(box.x>=0 && box.x+box.width<=width && box.width>=44 && box.height>=44);
  }
  await p.setViewportSize({width:320,height:780});
  await shot(p,resume?'main-320-claro-retomar.png':'main-320-claro.png',true);
  if(resume){await p.setViewportSize({width:1440,height:1000});await shot(p,'main-desktop-1440.png',true);}
  await p.context().close();
 }
});

test('novos controles cabem nas oito larguras e nos dez temas com alternativa manual e ajuda abertas',async()=>{
 const p=await pageFor({clipboard:'failure'});const report=[];
 for(const palette of ['lavanda','salvia','areia','azul','rose'])for(const mode of ['light','dark']) {
  await p.locator('#theme-toggle').click();await p.locator(`[data-palette-choice="${palette}"]`).click();await p.locator(`[data-mode-choice="${mode}"]`).click();await p.keyboard.press('Escape');
  await showFallback(p);await p.locator('#copy-link').click();await p.locator('#share-link').waitFor({state:'visible'});
  const details=p.locator('#install-help');if(await details.getAttribute('open')===null)await details.locator('summary').click();
  for(const width of [320,360,375,390,430,768,1024,1440]) {
   await p.setViewportSize({width,height:900});
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${palette}/${mode}/${width}: sem overflow`);
   const box=await p.locator('#tools-panel').boundingBox();
   assert.ok(box.x>=0 && box.x+box.width<=width && box.y>=0 && box.y+box.height<=900,`${palette}/${mode}/${width}: painel dentro da tela`);
   assert.equal(await p.locator('#tools-panel').getAttribute('aria-modal'),'true');
   for(const id of ['share-site','copy-link','share-whatsapp','share-link','print-plan','close-tools']) {
    const control=p.locator(`#${id}`);
    await control.evaluate(node=>Promise.all(node.getAnimations().map(animation=>animation.finished)));
    const target=await control.boundingBox();
    assert.ok(target.width>=44 && target.height>=44,`${palette}/${mode}/${width} ${id}: alvo ${target.width} × ${target.height}`);
   }
  }
  await p.setViewportSize({width:320,height:780});await shot(p,`mais-opcoes-${palette}-${mode}-320.png`);
  await p.keyboard.press('Escape');report.push({palette,mode,widths:[320,360,375,390,430,768,1024,1440]});
 }
 fs.writeFileSync(path.join(artifacts,'novos-recursos-responsividade.json'),JSON.stringify(report,null,2));
 await p.context().close();
});
