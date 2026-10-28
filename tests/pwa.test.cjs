'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const source = fs.readFileSync(path.join(root,'sw.js'),'utf8');
const scope = 'https://example.test/plano-de-leitura-biblica-para-mulheres/';
function harness({failInstall=false,active=false}={}) {
  const listeners = {}, names = new Set(), deleted = [], intercepted = [], stored = [];
  let skipped = 0;
  const context = {
    URL, Request, Set, Promise,
    self: {registration:{scope,active:active?{}:null},addEventListener:(type,fn)=>{listeners[type]=fn;},skipWaiting:async()=>{skipped++;}},
    caches:{
      open:async name=>{names.add(name);return {
        addAll:async requests=>{stored.push(...requests);if(failInstall)throw new Error('network failure');},
        match:async url=>stored.some(request=>request.url===url)?{fromCache:url}:undefined
      };},
      keys:async()=>[...names],
      delete:async name=>{deleted.push(name);return names.delete(name);}
    },
    fetch:async request=>({network:request.url})
  };
  vm.runInNewContext(source,context);
  async function dispatch(type,event={}) {
    let work;
    listeners[type]({...event,waitUntil:p=>{work=p;},respondWith:p=>{intercepted.push(p);work=p;}});
    return await work;
  }
  return {dispatch,names,deleted,stored,intercepted,skipCount:()=>skipped};
}
test('manifesto mantém identidade e todos os caminhos no subdiretório do GitHub Pages',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
  assert.equal(manifest.name,'Devotional Days');assert.equal(manifest.short_name,'Devotional Days');
  assert.equal(manifest.description,'35 dias de leitura e reflexão bíblica, feito para mulheres.');
  assert.equal(manifest.lang,'pt-BR');assert.equal(manifest.display,'standalone');
  for(const key of ['id','scope','start_url'])assert.equal(new URL(manifest[key],scope).href,scope);
  assert.match(manifest.theme_color,/^#[\da-f]{6}$/i);assert.match(manifest.background_color,/^#[\da-f]{6}$/i);
  for(const [size,purpose] of [[192,'any'],[512,'any'],[512,'maskable']]) {
    const icon=manifest.icons.find(i=>i.sizes===`${size}x${size}`&&i.purpose===purpose);
    assert.ok(icon);assert.equal(icon.type,'image/png');
    assert.ok(new URL(icon.src,scope).href.startsWith(scope));
    const bytes=fs.readFileSync(path.join(root,icon.src));
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16),size);assert.equal(bytes.readUInt32BE(20),size);
  }
  const apple=fs.readFileSync(path.join(root,'src/icons/apple-touch-icon.png'));
  assert.equal(apple.readUInt32BE(16),180);assert.equal(apple.readUInt32BE(20),180);
});
test('precache cobre somente os arquivos essenciais existentes, sem dados de terceiros',async()=>{
  const h=harness();await h.dispatch('install');
  assert.ok([...h.names].every(name=>name.endsWith(':v3')),'a revisão editorial deve usar um cache diferente do v1 já publicado');
  assert.ok(h.stored.length>=16);
  for(const request of h.stored) {
    assert.ok(request.url.startsWith(scope));assert.equal(new URL(request.url).search,'');
    assert.equal(request.cache,'reload');assert.equal(request.credentials,'omit');assert.equal(request.redirect,'error');
    const local=new URL(request.url).pathname.slice(new URL(scope).pathname.length)||'index.html';
    assert.ok(fs.statSync(path.join(root,local)).isFile(),local);
  }
  assert.ok(h.stored.some(r=>r.url.endsWith('/src/data.js')));
  assert.ok(h.stored.some(r=>r.url.endsWith('/src/print.css')));
  assert.equal(h.skipCount(),0,'instalação não deve ativar atualização silenciosamente');
});
test('cache responde offline ao shell e ignora terceiros, outros projetos, queries e métodos de escrita',async()=>{
  const h=harness();await h.dispatch('install');
  const cached=await h.dispatch('fetch',{request:new Request(`${scope}src/data.js`)});
  assert.deepEqual(cached,{fromCache:`${scope}src/data.js`});
  const n=h.intercepted.length;
  for(const request of [
    new Request('https://www.bible.com/pt/bible/129/MRK.1.14-20.NVI'),
    new Request('https://example.test/outro-projeto/index.html'),
    new Request(`${scope}?tracking=1`),new Request(`${scope}docs/TESTES.md`),
    new Request(`${scope}src/data.js`,{method:'POST'})
  ])assert.equal(await h.dispatch('fetch',{request}),undefined);
  assert.equal(h.intercepted.length,n);
});
test('ativação remove apenas versões do próprio escopo e falha de precache é descartada',async()=>{
  const h=harness();await h.dispatch('install');
  const current=[...h.names][0];
  h.names.add('devotional-days:/plano-de-leitura-biblica-para-mulheres/:anterior');
  h.names.add('devotional-days:/outro-projeto/:v1');h.names.add('outro-cache');
  await h.dispatch('activate');
  assert.deepEqual([...h.names].sort(),[current,'devotional-days:/outro-projeto/:v1','outro-cache'].sort());
  const broken=harness({failInstall:true});
  await assert.rejects(broken.dispatch('install'),/network failure/);
  assert.equal(broken.names.size,0);assert.equal(broken.deleted.length,1);
});
test('atualização só ignora espera após mensagem explícita de uma página do guia',async()=>{
  const h=harness();await h.dispatch('install');
  await h.dispatch('message',{data:{type:'ACTIVATE_UPDATE'},source:{url:'https://example.test/outro/'}});
  await h.dispatch('message',{data:{type:'OTHER'},source:{url:scope}});
  assert.equal(h.skipCount(),0);
  await h.dispatch('message',{data:{type:'ACTIVATE_UPDATE'},source:{url:scope}});
  assert.equal(h.skipCount(),1);
});
test('candidato que reutiliza a versão ativa não sobrescreve nem remove o cache anterior',async()=>{
  const h=harness({active:true});await h.dispatch('install');
  const original=h.stored.map(r=>r.url);const names=[...h.names];
  await assert.rejects(h.dispatch('install'),/Incremente VERSION/);
  assert.deepEqual(h.stored.map(r=>r.url),original);
  assert.deepEqual([...h.names],names);assert.deepEqual(h.deleted,[]);
});
