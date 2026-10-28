/* Chromium real em um servidor isolado com o mesmo subcaminho usado pelo GitHub Pages. */
'use strict';
const {test,before,after} = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const {chromium} = require('playwright');
const root = path.resolve(__dirname,'..');
const artifacts = process.env.ARTIFACT_DIR || '/tmp/devotional-days-pwa';
const mount = '/plano-de-leitura-biblica-para-mulheres/';
const key = 'leitura-biblica-mulheres-v1';
const legacyKey = 'plano-biblia-estudo-reflexao-v2';
const publishedCommit = '78e663756d4d4ca28fc41920bdcbe7b8e2a41d28';
const saved = {read:[0,2],current:4,palette:'rose',mode:'dark',version:'NAA',acknowledged:true};
let browser, server, base, release='v1', failAsset=false, reuseVersion=false, publishedFiles, exactSnapshot=false;
const errors=[];
before(async()=>{
 fs.mkdirSync(artifacts,{recursive:true});
 // A comparação usa os bytes da publicação anterior, não uma reconstituição do código novo.
 // Em clone raso: git fetch origin <publishedCommit> antes de executar esta suíte opcional.
 try {
  const files=execFileSync('git',['ls-tree','-r','--name-only',publishedCommit,'--','index.html','manifest.webmanifest','sw.js','src'],{cwd:root,encoding:'utf8'}).trim().split('\n');
  publishedFiles=new Map(files.map(file=>[file,execFileSync('git',['show',`${publishedCommit}:${file}`],{cwd:root})]));
 } catch (error) {
  throw new Error(`O teste de migração precisa do commit publicado ${publishedCommit}. Execute git fetch origin ${publishedCommit} antes da suíte. ${error.message}`);
 }
 server=http.createServer((request,response)=>{
  const pathname=new URL(request.url,'http://localhost').pathname;
  if(!pathname.startsWith(mount)){response.writeHead(404);response.end();return;}
  const relative=decodeURIComponent(pathname.slice(mount.length))||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(`${root}/`)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);response.end();return;}
  if(failAsset&&relative==='src/print.css'){response.writeHead(503);response.end('temporary failure');return;}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
  let body=exactSnapshot&&release==='published' ? publishedFiles.get(relative) : fs.readFileSync(file);
  if(!body){response.writeHead(404);response.end();return;}
  if(!exactSnapshot) {
   if(relative==='sw.js')body=Buffer.from(`${body.toString().replace(/const VERSION = '[^']+';/,`const VERSION = '${reuseVersion?'v1':release}';`)}\n// Candidato de teste: ${release}\n`);
   if(relative==='index.html')body=Buffer.from(body.toString().replace('<head>',`<head><meta name="test-release" content="${release}">`));
   if(relative==='src/styles.css')body=Buffer.from(`${body.toString()}\n:root { --test-release: ${release}; }\n`);
  }
  response.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});response.end(body);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base=`http://127.0.0.1:${server.address().port}${mount}`;
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox'],headless:true});
});
after(async()=>{
 await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));
 assert.deepEqual(errors,[],'erros inesperados de JavaScript/console/CSP');
});
async function pageFor({init,standalone=false,seed=saved,storageKey=key,legacySaved}={}) {
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.addInitScript(({key,saved,standalone,legacyKey,legacySaved})=>{
  if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(saved));
  if(legacySaved&&!localStorage.getItem(legacyKey))localStorage.setItem(legacyKey,JSON.stringify(legacySaved));
  if(standalone)Object.defineProperty(navigator,'standalone',{value:true});
 },{key:storageKey,saved:seed,standalone,legacyKey,legacySaved});
 if(init)await context.addInitScript(init);
 const page=await context.newPage();page.setDefaultTimeout(10000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(base);await page.waitForFunction(()=>document.querySelectorAll('.day').length===35);
 return page;
}
async function controlled(page) {
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.reload();
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
}
async function state(page) {return page.evaluate(key=>localStorage.getItem(key),key);}
async function markers(page) {
 return page.evaluate(()=>({html:document.querySelector('meta[name="test-release"]').content,css:getComputedStyle(document.documentElement).getPropertyValue('--test-release').trim()}));
}
async function waitForWaiting(page) {
 await page.waitForFunction(async()=>Boolean((await navigator.serviceWorker.getRegistration())?.waiting));
 await page.waitForFunction(()=>!document.getElementById('pwa-update').hidden);
}

test('manifesto, ícones e registro respeitam o subcaminho; shell completo funciona offline e mantém progresso',async()=>{
 release='v1';failAsset=false;
 const page=await pageFor();await controlled(page);
 const before=await state(page);
 const info=await page.evaluate(async()=>{
  const link=document.querySelector('link[rel="manifest"]');
  const response=await fetch(link.href);const manifest=await response.json();
  const registration=await navigator.serviceWorker.getRegistration();
  const names=await caches.keys();const entries=[];
  for(const name of names)for(const request of await (await caches.open(name)).keys())entries.push({cache:name,url:request.url});
  return {manifest,url:link.href,scope:registration.scope,script:registration.active.scriptURL,entries};
 });
 assert.equal(info.scope,base);assert.equal(info.script,`${base}sw.js`);
 assert.equal(new URL(info.manifest.start_url,info.url).href,base);
 assert.equal(new URL(info.manifest.scope,info.url).href,base);
 for(const icon of info.manifest.icons){const response=await page.request.get(new URL(icon.src,info.url).href);assert.equal(response.status(),200);}
 assert.ok(info.entries.length>=16);
 assert.ok(info.entries.every(entry=>entry.url.startsWith(base)&&!new URL(entry.url).search));
 fs.writeFileSync(path.join(artifacts,'pwa-cache.json'),JSON.stringify(info,null,2));
 await page.context().setOffline(true);await page.reload();
 assert.equal(await state(page),before);
 assert.equal(await page.locator('#progress').getAttribute('aria-valuenow'),'2');
 assert.equal(await page.locator('html').getAttribute('data-palette'),'rose');
 assert.equal(await page.locator('#translation').inputValue(),'NAA');
 // As 35 atividades e o roteiro de papel usam somente o catálogo original local.
 await page.locator('#route-tab').click();
 await page.locator('.day[data-index="0"]').click();
 for(let i=0;i<35;i++){
  assert.equal(await page.locator('#lesson-title').innerText(),await page.evaluate(i=>READING_PLAN.encounters[i].title,i));
  if(i<34)await page.locator('#next').click();
 }
 assert.equal(await page.locator('#print-plan-content .print-encounter').count(),35);
 await page.locator('#mark-read').click();const marked=await state(page);
 await page.reload();assert.equal(await state(page),marked);
 assert.equal(await page.locator('#mark-read').getAttribute('aria-pressed'),'true');
 assert.match(await page.locator('#bible-link').getAttribute('href'),/^https:\/\/www\.bible\.com\//);
 await page.screenshot({path:path.join(artifacts,'pwa-offline-mobile.png'),fullPage:true});
 await page.context().close();
});

test('instalação depende de ação explícita e suporte; recusa e estado instalado não geram insistência',async()=>{
 const page=await pageFor();
 assert.equal(await page.locator('#install-app').isVisible(),false);
 await page.evaluate(()=>{
  window.__installCalls=0;
  const event=new Event('beforeinstallprompt',{cancelable:true});
  event.prompt=async()=>{window.__installCalls++;};
  event.userChoice=Promise.resolve({outcome:'dismissed',platform:'web'});
  window.dispatchEvent(event);window.__installPrevented=event.defaultPrevented;
 });
 await page.locator('#tools-toggle').click();
 assert.equal(await page.locator('#install-app').isVisible(),true);
 assert.equal(await page.evaluate(()=>window.__installCalls),0);
 await page.locator('#install-app').click();
 assert.equal(await page.evaluate(()=>window.__installCalls),1);
 assert.equal(await page.evaluate(()=>window.__installPrevented),true);
 assert.equal(await page.locator('#install-app').isVisible(),false);
 await page.keyboard.press('Escape');await page.locator('#tools-toggle').click();
 assert.equal(await page.locator('#install-app').isVisible(),false);
 await page.evaluate(()=>window.dispatchEvent(new Event('appinstalled')));
 assert.equal(await page.locator('#install-app').isVisible(),false);
 assert.deepEqual(JSON.parse(await state(page)),saved);
 await page.context().close();
 const installed=await pageFor({standalone:true});
 await installed.evaluate(()=>{const event=new Event('beforeinstallprompt',{cancelable:true});event.prompt=()=>{throw new Error('não deve abrir');};window.dispatchEvent(event);});
 await installed.locator('#tools-toggle').click();assert.equal(await installed.locator('#install-app').isVisible(),false);
 await installed.context().close();
});

test('falha de registro mantém o guia online utilizável e informa o limite do offline',async()=>{
 const page=await pageFor({init:()=>{
  Object.defineProperty(navigator.serviceWorker,'register',{value:async()=>{throw new DOMException('Blocked','SecurityError');}});
 }});
 await page.waitForFunction(()=>document.getElementById('pwa-status').textContent.includes('não está disponível'));
 await page.locator('#next').click();await page.locator('#mark-read').click();await page.reload();
 assert.equal(await page.locator('#mark-read').getAttribute('aria-pressed'),'true');
 assert.equal(await page.evaluate(()=>navigator.serviceWorker.controller),null);
 await page.context().close();
});

test('nova versão aguarda consentimento sem misturar recursos e atualiza preservando estado e caches alheios',async()=>{
 release='v1';failAsset=false;
 const page=await pageFor();await controlled(page);
 await page.evaluate(async()=>{await caches.open('outro-projeto:v1');});
 const original=await state(page);assert.deepEqual(await markers(page),{html:'v1',css:'v1'});
 release='v2';await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});
 await waitForWaiting(page);
 assert.equal(await page.locator('#update-notice').isVisible(),true);
 assert.deepEqual(await markers(page),{html:'v1',css:'v1'});
 assert.equal(await state(page),original);
 await page.reload();
 assert.deepEqual(await markers(page),{html:'v1',css:'v1'},'reload sem consentimento mantém o conjunto ativo coerente');
 await waitForWaiting(page);await page.locator('#tools-toggle').click();
 await Promise.all([page.waitForEvent('load'),page.locator('#apply-update').click()]);
 await page.waitForFunction(()=>document.querySelectorAll('.day').length===35);
 assert.deepEqual(await markers(page),{html:'v2',css:'v2'});assert.equal(await state(page),original);
 const names=await page.evaluate(()=>caches.keys());
 assert.ok(names.includes('outro-projeto:v1'));assert.ok(names.some(name=>name.endsWith(':v2')));
 assert.ok(!names.some(name=>name.startsWith(`devotional-days:${mount}:`)&&name.endsWith(':v1')));
 await page.context().setOffline(true);await page.reload();assert.deepEqual(await markers(page),{html:'v2',css:'v2'});
 fs.writeFileSync(path.join(artifacts,'pwa-update.json'),JSON.stringify({before:'v1',waiting:'v2',after:'v2',progressPreserved:true,caches:names},null,2));
 await page.context().close();release='v1';
});

test('precache incompleto rejeita a atualização e mantém a versão anterior disponível offline',async()=>{
 release='v1';failAsset=false;
 // O erro HTTP 503 é deliberadamente criado apenas para o SW candidato desta verificação.
 const page=await pageFor();await controlled(page);
 const original=await state(page);
 release='broken';failAsset=true;
 await page.evaluate(async()=>{
  const registration=await navigator.serviceWorker.getRegistration();
  window.__candidateRedundant=false;
  registration.addEventListener('updatefound',()=>{
   const candidate=registration.installing;
   candidate.addEventListener('statechange',()=>{if(candidate.state==='redundant')window.__candidateRedundant=true;});
  });
  await registration.update();
 });
 await page.waitForFunction(()=>window.__candidateRedundant);
 assert.equal(await page.evaluate(async()=>Boolean((await navigator.serviceWorker.getRegistration()).waiting)),false);
 const names=await page.evaluate(()=>caches.keys());assert.ok(!names.some(name=>name.endsWith(':broken')));
 await page.context().setOffline(true);await page.reload();
 assert.deepEqual(await markers(page),{html:'v1',css:'v1'});assert.equal(await state(page),original);
 await page.context().close();release='v1';failAsset=false;
});

test('candidato sem incremento de VERSION é rejeitado sem alterar ou apagar o cache ativo',async()=>{
 release='v1';failAsset=false;reuseVersion=false;
 const page=await pageFor();await controlled(page);const original=await state(page);
 const cacheBefore=await page.evaluate(async()=>{
  const cache=await caches.open((await caches.keys())[0]);
  return (await cache.keys()).map(r=>r.url);
 });
 release='v2';reuseVersion=true;
 await page.evaluate(async()=>{
  const registration=await navigator.serviceWorker.getRegistration();window.__candidateRedundant=false;
  registration.addEventListener('updatefound',()=>{
   const candidate=registration.installing;
   candidate.addEventListener('statechange',()=>{if(candidate.state==='redundant')window.__candidateRedundant=true;});
  });
  await registration.update();
 });
 await page.waitForFunction(()=>window.__candidateRedundant);
 const cacheAfter=await page.evaluate(async()=>{
  const cache=await caches.open((await caches.keys())[0]);
  return (await cache.keys()).map(r=>r.url);
 });
 assert.deepEqual(cacheAfter,cacheBefore);
 await page.context().setOffline(true);await page.reload();
 assert.deepEqual(await markers(page),{html:'v1',css:'v1'});assert.equal(await state(page),original);
 await page.context().close();release='v1';reuseVersion=false;
});

test('migração dos bytes publicados v1 para as 105 perguntas e ajudas v2 preserva ambas as chaves e só ocorre após consentimento',async()=>{
 const historical={window:{}};
 vm.runInNewContext(publishedFiles.get('src/data.js').toString(),historical);
 const oldPlan=JSON.parse(JSON.stringify(historical.window.READING_PLAN));
 const oldQuestions=oldPlan.encounters.flatMap(entry=>entry.questions);
 assert.equal(oldQuestions.length,105);assert.ok(oldQuestions.every(q=>typeof q==='string'));
 const seed={read:[0,1,2,3,4,5,6,12,21,34],current:9,palette:'salvia',mode:'dark',version:'ARC',acknowledged:true};
 const previousLegacy={read:[3,10],current:10,palette:'azul',mode:'system',version:'NTLH',acknowledged:true};
 const result=[];
 async function storageSnapshot(page){return page.evaluate(({key,legacyKey})=>({current:localStorage.getItem(key),legacy:localStorage.getItem(legacyKey)}),{key,legacyKey});}
 for(const storageCase of ['both','legacy-only']) {
  exactSnapshot=true;release='published';failAsset=false;reuseVersion=false;
  const page=await pageFor({seed,storageKey:storageCase==='both'?key:legacyKey,legacySaved:storageCase==='both'?previousLegacy:undefined});
  await controlled(page);
  const original=await storageSnapshot(page);
  assert.deepEqual(await page.evaluate(()=>READING_PLAN.encounters.flatMap(entry=>entry.questions)),oldQuestions);
  assert.equal(await page.locator('#questions details').count(),0);
  assert.equal(await page.locator('#celebration').isVisible(),false);
  assert.equal(await page.locator('#progress').getAttribute('aria-valuenow'),String(seed.read.length));
  assert.equal(await page.locator('#translation').inputValue(),seed.version);
  const initialText=await page.locator('#questions').innerText();
  await page.evaluate(async()=>{
   const cache=await caches.open('outro-projeto:v1');
   await cache.put(new Request(`${location.origin}/outro-projeto/example.txt`),new Response('preservado'));
  });
  assert.deepEqual(await page.evaluate(()=>caches.keys()),[`devotional-days:${mount}:v1`,'outro-projeto:v1']);
  // O servidor passa a oferecer exatamente os arquivos atuais, sem trocar VERSION por um stub.
  release='current';
  await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});
  await waitForWaiting(page);
  assert.equal(await page.locator('#questions').innerText(),initialText);
  assert.equal(await page.locator('#questions details').count(),0,'conteúdo publicado mantém o renderer publicado enquanto aguarda');
  assert.deepEqual(await storageSnapshot(page),original);
  assert.equal(await page.locator('#celebration').isVisible(),false);
  // Uma recarga offline, antes da escolha, ainda usa apenas o conjunto publicado v1.
  await page.context().setOffline(true);await page.reload();
  assert.deepEqual(await page.evaluate(()=>READING_PLAN.encounters.flatMap(entry=>entry.questions)),oldQuestions);
  assert.equal(await page.locator('#questions').innerText(),initialText);
  assert.equal(await page.locator('#questions details').count(),0);
  assert.deepEqual(await storageSnapshot(page),original);
  await waitForWaiting(page);await page.locator('#tools-toggle').click();
  await Promise.all([page.waitForEvent('load'),page.locator('#apply-update').click()]);
  await page.waitForFunction(()=>document.querySelectorAll('.day').length===35);
  assert.deepEqual(await storageSnapshot(page),original,'o aceite e o carregamento offline não regravam nem migram preferências/progresso');
  assert.equal(await page.locator('#celebration').isVisible(),false);
  const newPlan=await page.evaluate(()=>READING_PLAN);
  const newQuestions=newPlan.encounters.flatMap(entry=>entry.questions);
  assert.equal(newQuestions.length,105);
  assert.ok(newQuestions.every(q=>q&&typeof q.text==='string'&&typeof q.help==='string'&&q.text&&q.help));
  assert.equal(new Set(newQuestions.map(q=>q.help)).size,105);
  for(let i=0;i<105;i++)assert.notEqual(newQuestions[i].text,oldQuestions[i],`a pergunta ${i+1} deve pertencer à revisão`);
  const metadata=plan=>({weeks:plan.weeks,encounters:plan.encounters.map(({questions,...rest})=>rest)});
  assert.deepEqual(metadata(newPlan),metadata(oldPlan),'referências, ordem, títulos e demais dados permanecem iguais');
  assert.equal(await page.locator('#translation').inputValue(),seed.version);
  assert.equal(await page.locator('html').getAttribute('data-palette'),seed.palette);
  assert.equal(await page.locator('html').getAttribute('data-mode'),seed.mode);
  assert.equal(await page.locator('#progress').getAttribute('aria-valuenow'),String(seed.read.length));
  const names=await page.evaluate(()=>caches.keys());
  assert.ok(names.includes(`devotional-days:${mount}:v2`));
  assert.ok(!names.includes(`devotional-days:${mount}:v1`));
  assert.equal(await page.evaluate(async()=>{const r=await(await caches.open('outro-projeto:v1')).match(`${location.origin}/outro-projeto/example.txt`);return r.text();}),'preservado');
  const entries=await page.evaluate(async()=>{
   const cache=await caches.open(`devotional-days:${location.pathname}:v2`);
   return(await cache.keys()).map(request=>request.url);
  });
  assert.ok(entries.length>=16);assert.ok(entries.every(url=>url.startsWith(base)&&!new URL(url).search));
  await page.locator('#route-tab').click();
  const firstWeek=page.locator('.week[data-week="0"]');
  if(await firstWeek.getAttribute('open')===null)await firstWeek.locator('summary').click();
  await page.locator('.day[data-index="0"]').click();
  let verified=0;
  for(let i=0;i<35;i++){
   const rows=page.locator('#questions > li');assert.equal(await rows.count(),3);
   for(let q=0;q<3;q++){
    const row=rows.nth(q);const detail=row.locator('details');
    assert.equal(await detail.count(),1);assert.equal(await detail.getAttribute('open'),null);
    assert.equal(await row.locator('.question-text').innerText(),newPlan.encounters[i].questions[q].text);
    await detail.getByText('Entenda essa pergunta',{exact:true}).click();
    assert.equal(await detail.getAttribute('open'),'');
    assert.equal(await detail.locator('p').innerText(),newPlan.encounters[i].questions[q].help);
    verified++;
   }
   const progress=JSON.parse(await state(page));
   assert.deepEqual(progress.read,seed.read);assert.equal(progress.palette,seed.palette);assert.equal(progress.mode,seed.mode);assert.equal(progress.version,seed.version);
   if(i<34)await page.locator('#next').click();
  }
  assert.equal(verified,105);
  assert.equal(await page.locator('#mark-read').getAttribute('aria-pressed'),'true','encontro concluído antes da revisão continua concluído');
  await page.reload();assert.equal(await page.locator('#celebration').isVisible(),false);
  assert.equal(await page.locator('#mark-read').getAttribute('aria-pressed'),'true');
  const final=JSON.parse(await state(page));assert.deepEqual(final.read,seed.read);
  assert.equal((await storageSnapshot(page)).legacy,original.legacy,'a chave antiga não é apagada nem regravada');
  await page.screenshot({path:path.join(artifacts,`pwa-migracao-${storageCase}-offline.png`),fullPage:true});
  result.push({storageCase,publishedCommit,from:'v1',to:'v2',offlineDuringConsent:true,storageByteExactBeforeNavigation:true,verifiedQuestionsAndHelps:verified,oldCompletedEncountersPreserved:seed.read,caches:names,onlyLocalResourcesCached:true});
  await page.context().close();
 }
 fs.writeFileSync(path.join(artifacts,'pwa-migracao-publicada.json'),JSON.stringify(result,null,2));
 exactSnapshot=false;release='v1';
});
