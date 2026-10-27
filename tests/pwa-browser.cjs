/* Chromium real em um servidor isolado com o mesmo subcaminho usado pelo GitHub Pages. */
'use strict';
const {test,before,after} = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const root = path.resolve(__dirname,'..');
const artifacts = process.env.ARTIFACT_DIR || '/tmp/devotional-days-pwa';
const mount = '/plano-de-leitura-biblica-para-mulheres/';
const key = 'leitura-biblica-mulheres-v1';
const saved = {read:[0,2],current:4,palette:'rose',mode:'dark',version:'NAA',acknowledged:true};
let browser, server, base, release='v1', failAsset=false, reuseVersion=false;
const errors=[];
before(async()=>{
 fs.mkdirSync(artifacts,{recursive:true});
 server=http.createServer((request,response)=>{
  const pathname=new URL(request.url,'http://localhost').pathname;
  if(!pathname.startsWith(mount)){response.writeHead(404);response.end();return;}
  const relative=decodeURIComponent(pathname.slice(mount.length))||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(`${root}/`)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);response.end();return;}
  if(failAsset&&relative==='src/print.css'){response.writeHead(503);response.end('temporary failure');return;}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
  let body=fs.readFileSync(file);
  if(relative==='sw.js')body=Buffer.from(`${body.toString().replace("const VERSION = 'v1';",`const VERSION = '${reuseVersion?'v1':release}';`)}\n// Candidato de teste: ${release}\n`);
  if(relative==='index.html')body=Buffer.from(body.toString().replace('<head>',`<head><meta name="test-release" content="${release}">`));
  if(relative==='src/styles.css')body=Buffer.from(`${body.toString()}\n:root { --test-release: ${release}; }\n`);
  response.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});response.end(body);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base=`http://127.0.0.1:${server.address().port}${mount}`;
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox'],headless:true});
});
after(async()=>{
 await browser?.close();await new Promise(resolve=>server.close(resolve));
 assert.deepEqual(errors,[],'erros inesperados de JavaScript/console/CSP');
});
async function pageFor({init,standalone=false}={}) {
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.addInitScript(({key,saved,standalone})=>{
  if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(saved));
  if(standalone)Object.defineProperty(navigator,'standalone',{value:true});
 },{key,saved,standalone});
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
