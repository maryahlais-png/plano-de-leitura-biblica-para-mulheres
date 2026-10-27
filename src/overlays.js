/* Um único painel modal por vez: foco, fundo inerte e rolagem compartilhados. */
(() => {
  'use strict';
  const backdrop = document.getElementById('overlay-backdrop');
  let active = null;
  let inerted = [];
  let scrollY = 0;
  function disableBackground(panel) {
    let branch = panel;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && sibling !== backdrop && !sibling.inert) {
          sibling.inert = true;
          inerted.push(sibling);
        }
      }
      branch = branch.parentElement;
    }
  }
  function close(restoreFocus = true) {
    if (!active) return;
    const previous = active;
    active = null;
    inerted.forEach(node=>{node.inert=false;});
    inerted = [];
    previous.panel.removeAttribute('aria-modal');
    previous.onClose();
    backdrop.hidden = true;
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('top');
    window.scrollTo({top:scrollY,behavior:'instant'});
    if (restoreFocus && previous.trigger?.isConnected && !previous.trigger.inert) previous.trigger.focus({preventScroll:true});
  }
  function open(panel, {trigger = document.activeElement, initialFocus = panel, onClose = () => {}} = {}) {
    close(false);
    active = {panel,trigger,onClose};
    scrollY = window.scrollY;
    panel.hidden = false;
    panel.inert = false;
    panel.setAttribute('aria-modal','true');
    backdrop.hidden = false;
    disableBackground(panel);
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('modal-open');
    initialFocus.focus({preventScroll:true});
  }
  function focusable(panel) {
    return [...panel.querySelectorAll('button:not(:disabled),summary,a[href],select,input:not(:disabled):not([type="hidden"]),[tabindex="0"]')]
      .filter(node=>{
        // Filhos de <details> fechado podem manter retângulos de layout no Chromium.
        const closed = node.closest('details:not([open])');
        return !node.closest('[inert]') && node.getClientRects().length>0
          && (!closed || closed.querySelector('summary').contains(node));
      });
  }
  document.addEventListener('keydown', event=>{
    if (!active) return;
    if (event.key==='Escape') { event.preventDefault(); close(); return; }
    if (event.key!=='Tab') return;
    const nodes = focusable(active.panel), first = nodes[0], last = nodes.at(-1);
    if (!first) { event.preventDefault(); active.panel.focus(); return; }
    if (!nodes.includes(document.activeElement)) { event.preventDefault(); (event.shiftKey?last:first).focus(); }
    else if (event.shiftKey && document.activeElement===first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement===last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('focusin', event=>{
    if (active && !active.panel.contains(event.target)) active.panel.focus({preventScroll:true});
  });
  backdrop.addEventListener('click',()=>close());
  window.READING_OVERLAYS = Object.freeze({open,close,isOpen: panel=>active?.panel===panel});
})();
