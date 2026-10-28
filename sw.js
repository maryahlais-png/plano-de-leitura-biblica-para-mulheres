/* Somente o guia original e seus recursos locais. Mude VERSION ao publicar alterações no shell. */
'use strict';
const VERSION = 'v3';
const SCOPE = new URL(self.registration.scope);
const PREFIX = `devotional-days:${SCOPE.pathname}:`;
const CACHE = `${PREFIX}${VERSION}`;
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './src/styles.css', './src/data.js', './src/state.js', './src/overlays.js', './src/app.js',
  './src/actions.js', './src/print.js', './src/print.css', './src/pwa.js', './src/favicon.svg',
  './src/icons/icon-192.png', './src/icons/icon-512.png', './src/icons/maskable-512.png',
  './src/icons/apple-touch-icon.png'
];
const URLS = FILES.map(file => new URL(file,SCOPE).href);
const ALLOWED = new Set(URLS);

self.addEventListener('install', event => {
  // addAll só conclui com o conjunto completo. Uma falha não substitui a versão ativa.
  event.waitUntil((async () => {
    const alreadyCached = (await caches.keys()).includes(CACHE);
    if (alreadyCached && self.registration.active) {
      // Um candidato sem incremento de VERSION nunca pode sobrescrever o conjunto em uso.
      throw new Error('Incremente VERSION antes de atualizar os arquivos do guia.');
    }
    try {
      const cache = await caches.open(CACHE);
      await cache.addAll(URLS.map(url => new Request(url,{cache:'reload',credentials:'omit',redirect:'error'})));
    } catch (error) {
      if (!alreadyCached) await caches.delete(CACHE);
      throw error;
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(PREFIX) && name !== CACHE).map(name => caches.delete(name)));
    // Sem clients.claim(): o primeiro carregamento não é interrompido.
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !ALLOWED.has(request.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return await cache.match(request.url) || fetch(request);
  })());
});

self.addEventListener('message', event => {
  let source;
  try { source = new URL(event.source?.url); } catch (_error) { return; }
  source.search = ''; source.hash = '';
  if (event.data?.type === 'ACTIVATE_UPDATE' && ALLOWED.has(source.href)) {
    // Enviado somente após a ação explícita de atualizar a página.
    event.waitUntil(self.skipWaiting());
  }
});
