/* Instalação opcional e atualização consentida; nenhum dado pessoal ou preferência adicional. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const installButton = $('install-app');
  const updateNotice = $('pwa-update');
  const updateHint = $('update-notice');
  const updateButton = $('apply-update');
  const bannerUpdateButton = $('apply-update-banner');
  const status = $('pwa-status');
  const standalone = window.matchMedia('(display-mode: standalone)');
  let installPrompt = null;
  let registration = null;
  let updating = false;
  let lastCheck = 0;
  const installed = () => standalone.matches || window.navigator.standalone === true;
  function hideInstall() { installPrompt = null; installButton.hidden = true; }
  function offerUpdate() {
    if (!registration?.waiting || !navigator.serviceWorker.controller) return;
    updateNotice.hidden = false;
    if (updateHint) updateHint.hidden = false;
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    if (installed()) return;
    installPrompt = event;
    installButton.hidden = false;
  });
  window.addEventListener('appinstalled', hideInstall);
  standalone.addEventListener?.('change', () => { if (installed()) hideInstall(); });
  installButton.addEventListener('click', async () => {
    const prompt = installPrompt;
    hideInstall();
    if (!prompt || installed()) return;
    try {
      await prompt.prompt();
      await prompt.userChoice;
      // Aceite e recusa encerram esta oferta. Outra instalação depende do navegador.
    } catch (_error) {
      status.textContent = 'Você também pode usar o menu do navegador para adicionar o guia à tela inicial.';
    }
  });
  if (!('serviceWorker' in navigator) || !window.isSecureContext || !/^https?:$/.test(location.protocol)) return;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (updating) location.reload();
  });
  function applyUpdate() {
    if (!registration?.waiting || updating) return;
    updating = true;
    updateButton.disabled = true;
    if (bannerUpdateButton) {
      bannerUpdateButton.disabled = true;
      bannerUpdateButton.textContent = 'Atualizando...';
    }
    if (updateHint) {
      const description = $('update-banner-description');
      if (description) description.textContent = 'Atualizando o guia. Suas marcações neste navegador serão mantidas.';
    }
    status.textContent = 'Atualizando o guia. Seu progresso neste navegador será mantido.';
    registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});
  }
  updateButton.addEventListener('click',applyUpdate);
  bannerUpdateButton?.addEventListener('click',applyUpdate);
  async function checkUpdate() {
    if (!registration || document.visibilityState === 'hidden' || Date.now() - lastCheck < 60000) return;
    lastCheck = Date.now();
    try { await registration.update(); offerUpdate(); }
    catch (_error) { /* Sem rede: continue usando o conjunto local já carregado. */ }
  }
  async function register() {
    try {
      registration = await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
      offerUpdate();
      function watchInstall(worker) {
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') offerUpdate();
          if (worker.state === 'redundant') status.textContent = 'Não foi possível preparar esta versão para uso offline. Continue no guia com internet e tente novamente depois.';
        });
      }
      registration.addEventListener('updatefound', () => watchInstall(registration.installing));
      watchInstall(registration.installing);
      window.addEventListener('online', checkUpdate);
      document.addEventListener('visibilitychange', checkUpdate);
      window.addEventListener('pageshow', checkUpdate);
    } catch (_error) {
      status.textContent = 'O uso offline não está disponível neste navegador agora. Você pode continuar com internet.';
    }
  }
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register,{once:true});
})();
