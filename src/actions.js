/* Ações locais e compartilhamento iniciado somente pela leitora. Sem métricas. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const overlays = window.READING_OVERLAYS;
  const canonical = 'https://maryahlais-png.github.io/plano-de-leitura-biblica-para-mulheres/';
  const message = 'Conheça o Devotional Days, um plano gratuito de 35 encontros para leitura e reflexão bíblica. Um convite para estudar a Palavra com calma, no seu ritmo.';
  const payload = {title:'Devotional Days', text:message, url:canonical};
  const trigger = $('tools-toggle');
  const panel = $('tools-panel');
  $('share-link').value = canonical;
  $('share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`${message}\n\n${canonical}`)}`;
  trigger.addEventListener('click', () => {
    trigger.setAttribute('aria-expanded','true');
    overlays.open(panel, {trigger,initialFocus:$('close-tools'),onClose:() => {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded','false');
    }});
  });
  $('close-tools').addEventListener('click', () => overlays.close());
  function alternatives(status = '') {
    $('share-fallback').hidden = false;
    $('share-status').textContent = status;
  }
  $('share-site').addEventListener('click', async () => {
    $('share-status').textContent = '';
    if (typeof navigator.share !== 'function') { alternatives(); return; }
    const button = $('share-site');
    button.disabled = true;
    try {
      await navigator.share(payload);
    } catch (error) {
      if (error?.name !== 'AbortError') alternatives('O compartilhamento do dispositivo não ficou disponível. Escolha uma opção abaixo.');
    } finally { button.disabled = false; }
  });
  $('copy-link').addEventListener('click', async () => {
    const button = $('copy-link');
    button.disabled = true;
    $('share-status').textContent = '';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Cópia indisponível');
      await navigator.clipboard.writeText(canonical);
      $('share-status').textContent = 'Link copiado.';
    } catch (_error) {
      $('share-manual').hidden = false;
      $('share-status').textContent = 'Não foi possível copiar automaticamente. Selecione e copie o link abaixo.';
      if (overlays.isOpen(panel)) {
        $('share-link').focus({preventScroll:true});
        $('share-link').select();
      }
    } finally { button.disabled = false; }
  });
  $('print-plan').addEventListener('click', () => {
    overlays.close();
    window.READING_PRINT.print();
  });
})();
