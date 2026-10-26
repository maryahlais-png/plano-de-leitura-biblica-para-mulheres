/*
 * Guia estático sem autenticação e sem integração com servidores.
 * Política de DOM: nunca inserir dados do navegador com innerHTML.
 */
(() => {
  'use strict';
  const plan = window.READING_PLAN.encounters;
  const weeks = window.READING_PLAN.weeks;
  const { versions, palettes, isValidIndex, readState, writeState, nextPending, toggleRead } = window.READING_STATE;
  const overlays = window.READING_OVERLAYS;
  const $ = id => document.getElementById(id);
  const storageError = () => { $('storage-notice').hidden = false; };
  // O próprio acesso ao localStorage pode ser recusado pelo navegador.
  let storage;
  try { storage = window.localStorage; } catch (_error) { storageError(); }
  let state = readState(storage,plan.length,storageError);
  const save = () => writeState(storage,state,storageError);
  const text = (id,value) => { $(id).textContent = value; };
  const total = plan.length;
  const reference = d => d.review ? 'Revisão — sem passagem nova' : `${d.book} ${d.ch}:${d.a}–${d.b}`;
  const linkFor = d => `https://www.bible.com/pt/bible/${versions[state.version]}/${d.code}.${d.ch}.${d.a}-${d.b}.${state.version}`;
  function applyAppearance(){
    const choice = state.mode === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : state.mode;
    document.documentElement.dataset.palette = state.palette;
    document.documentElement.dataset.mode = choice;
    document.querySelectorAll('[data-mode-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.modeChoice === state.mode));
    });
    document.querySelectorAll('[data-palette-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.paletteChoice === state.palette));
    });
  }
  function buildPalettes(){
    const container=$('palette-options');
    palettes.forEach(([name,label]) => {
      const button=document.createElement('button');
      button.type='button';button.className='swatch';button.dataset.paletteChoice=name;
      button.setAttribute('aria-label', `Tema ${label}`);
      button.setAttribute('title',label);
      const dot=document.createElement('span');dot.className='swatch-dot';dot.dataset.color=name;dot.setAttribute('aria-hidden','true');
      const labelText=document.createElement('span');labelText.className='swatch-caption';labelText.textContent=label;
      button.append(dot,labelText);
      button.addEventListener('click',()=>{state.palette=name;save();applyAppearance();});
      container.append(button);
    });
  }
  function createWeeks(){
    const root=$('week-list');
    weeks.forEach(([name],weekIndex)=>{
      const details=document.createElement('details');details.className='week';details.dataset.week=weekIndex;
      const sum=document.createElement('summary');
      const left=document.createElement('span');
      const title=document.createElement('span');title.className='week-name';title.textContent=`Semana ${weekIndex+1} · ${name}`;
      const count=document.createElement('span');count.className='week-count';count.textContent='0 de 7 concluídos';
      left.append(title,count);
      const arrow=document.createElement('span');arrow.className='chevron';arrow.setAttribute('aria-hidden','true');arrow.textContent='›';
      sum.append(left,arrow);details.append(sum);
      const list=document.createElement('div');list.className='day-list';
      plan.forEach((d,i)=>{
        if(d.week!==weekIndex) return;
        const button=document.createElement('button');button.type='button';button.className='day';button.dataset.index=i;
        const tick=document.createElement('span');tick.className='tick';tick.setAttribute('aria-hidden','true');
        const label=document.createElement('span');label.className='day-label';
        const pre=document.createElement('strong');pre.textContent=d.review?'Revisão':`Leitura ${String(i+1-weekIndex*7).padStart(2,'0')}`;
        const name=document.createElement('span');name.textContent=d.title;
        label.append(pre,name);button.append(tick,label);
        button.addEventListener('click',()=>navigate(i));list.append(button);
      });
      details.append(list);root.append(details);
    });
  }
  function updateProgress(){
    text('progress-label',`${state.read.length} de ${total}`);
    text('mobile-progress',`${state.read.length} de ${total} concluídos`);
    $('progress').setAttribute('aria-valuenow',String(state.read.length));
    $('progress-fill').style.width=`${Math.round(100*state.read.length/total)}%`;
    document.querySelectorAll('.week').forEach((details,wi)=>{
      const n=state.read.filter(i=>plan[i].week===wi).length;
      details.querySelector('.week-count').textContent=`${n} de 7 concluídos`;
    });
    document.querySelectorAll('.day').forEach(button=>{
      const i=Number(button.dataset.index);const isRead=state.read.includes(i);
      button.dataset.read=String(isRead);
      button.setAttribute('aria-current',i===state.current?'step':'false');
      button.setAttribute('aria-label', `${plan[i].title}, ${isRead?'concluída':'pendente'}`);
      button.querySelector('.tick').textContent=isRead?'✓':'';
    });
  }
  function render(){
    const d=plan[state.current],read=state.read.includes(state.current);
    text('encounter-number',`Encontro ${String(state.current+1).padStart(2,'0')} de ${total}`);
    text('week-number',`Semana ${String(d.week+1).padStart(2,'0')}`);
    text('lesson-title',d.title);text('passage-reference',reference(d));text('lesson-lead',d.lead);
    const questions=$('questions');questions.replaceChildren();
    d.questions.forEach(q=>{const li=document.createElement('li');li.textContent=q;questions.append(li);});
    text('context-text',d.context);$('context-details').open=false;
    $('reading-box').hidden=Boolean(d.review);
    text('reading-note',d.review?'Releia os trechos que mais fizeram você refletir nesta semana.':'A leitura principal acontece na Bíblia física ou no link digital.');
    if (!d.review) $('bible-link').href=linkFor(d);
    text('mark-read',read?(d.review?'Revisão concluída':'Leitura concluída'):(d.review?'Concluir revisão':'Marcar como lida'));
    $('mark-read').setAttribute('aria-pressed',String(read));
    $('previous').disabled=state.current===0;$('next').disabled=state.current===total-1;
    const pending = nextPending(state,total);
    $('resume-reading').hidden = pending === null || pending === state.current;
    if (pending !== null) text('resume-reading',`Continuar no encontro ${String(pending+1).padStart(2,'0')}`);
    updateProgress();
  }
  const routeViewport = window.matchMedia('(max-width:690px)');
  const routePanel = $('route-panel');
  const routeTab = $('route-tab');
  function syncRoute() {
    if (overlays.isOpen(routePanel)) overlays.close(false);
    routeTab.setAttribute('aria-expanded','false');
    routePanel.inert = routeViewport.matches;
    if (routeViewport.matches) {
      routePanel.setAttribute('role','dialog');
      routePanel.setAttribute('aria-hidden','true');
    } else {
      routePanel.removeAttribute('role');
      routePanel.removeAttribute('aria-hidden');
    }
    // Ao mudar para celular, não deixe o foco em conteúdo que acabou de ser ocultado.
    if (routeViewport.matches && routePanel.contains(document.activeElement)) routeTab.focus({preventScroll:true});
  }
  function openRoute() {
    if (!routeViewport.matches) return;
    overlays.close(false);
    routeTab.setAttribute('aria-expanded','true');
    routePanel.removeAttribute('aria-hidden');
    document.body.classList.add('route-open');
    overlays.open(routePanel, {trigger:routeTab,initialFocus:$('close-route'),onClose:()=>{
      document.body.classList.remove('route-open');
      routeTab.setAttribute('aria-expanded','false');
      routePanel.inert = routeViewport.matches;
      if (routeViewport.matches) routePanel.setAttribute('aria-hidden','true');
    }});
  }
  function navigate(i) {
    if (!isValidIndex(i,total)) return;
    overlays.close(false);
    state.current=i;save();render();
    document.querySelectorAll('.week').forEach(week=>{if(Number(week.dataset.week)===plan[i].week)week.open=true;});
    $('leitura').scrollIntoView({block:'start',behavior:'instant'});
    $('leitura').focus({preventScroll:true});
  }
  function showCelebration(kind) {
    const field=document.querySelector('.crystal-field');field.replaceChildren();
    const xs=[9,18,25,36,44,54,65,72,81,91,13,31,60,85,50,77];
    const ys=[22,63,30,79,17,67,28,74,37,63,84,48,12,87,45,18];
    for(let i=0;i<xs.length;i++) {
      const particle=document.createElement('span');particle.className='crystal';
      particle.style.setProperty('--x',`${xs[i]}%`);particle.style.setProperty('--y',`${ys[i]}%`);
      particle.style.setProperty('--size',`${(i%3)+2}px`);
      particle.style.setProperty('--delay',`${(i%6)*.16}s`);field.append(particle);
    }
    text('celebration-title',kind==='plan'?'Seu plano foi concluído':'Semana concluída');
    text('celebration-message',kind==='plan'
      ?'Que o que você aprendeu ao longo destes encontros continue acompanhando sua caminhada com Deus.'
      :'Você concluiu mais uma etapa da sua caminhada pela Palavra.');
    overlays.open($('celebration'), {trigger:$('mark-read'),initialFocus:$('dismiss-celebration'),onClose:()=>{
      $('celebration').hidden=true;field.replaceChildren();
    }});
  }
  $('mark-read').addEventListener('click',()=>{
    const result = toggleRead(state,state.current,plan);
    state = result.state;save();render();
    if (result.celebration) showCelebration(result.celebration);
  });
  $('previous').addEventListener('click',()=>navigate(state.current-1));
  $('next').addEventListener('click',()=>navigate(state.current+1));
  $('dismiss-celebration').addEventListener('click',()=>overlays.close());
  $('translation').addEventListener('change',event=>{if(Object.hasOwn(versions,event.target.value)){state.version=event.target.value;save();render();}});
  function setGuideVisible(visible) {
    $('guide-notice').hidden=!visible;
    $('show-guide').setAttribute('aria-expanded',String(visible));
  }
  $('dismiss-guide').addEventListener('click',()=>{
    state.acknowledged=true;save();setGuideVisible(false);$('show-guide').focus({preventScroll:true});
  });
  $('show-guide').addEventListener('click',()=>{
    const visible=$('guide-notice').hidden;setGuideVisible(visible);
    if (visible) { $('guide-notice').scrollIntoView({block:'start',behavior:'instant'});$('dismiss-guide').focus({preventScroll:true}); }
  });
  $('resume-reading').addEventListener('click',()=>navigate(nextPending(state,total)));
  routeTab.addEventListener('click',openRoute);
  $('close-route').addEventListener('click',()=>overlays.close());
  routeViewport.addEventListener('change',syncRoute);
  $('theme-toggle').addEventListener('click',()=>{
    $('theme-toggle').setAttribute('aria-expanded','true');
    overlays.open($('theme-panel'),{trigger:$('theme-toggle'),initialFocus:$('close-theme'),onClose:()=>{
      $('theme-panel').hidden=true;$('theme-toggle').setAttribute('aria-expanded','false');
    }});
  });
  $('close-theme').addEventListener('click',()=>overlays.close());
  document.querySelectorAll('[data-mode-choice]').forEach(button=>button.addEventListener('click',()=>{state.mode=button.dataset.modeChoice;save();applyAppearance();}));
  const darkPreference=window.matchMedia('(prefers-color-scheme: dark)');
  if(darkPreference.addEventListener)darkPreference.addEventListener('change',()=>{if(state.mode==='system')applyAppearance();});
  buildPalettes();createWeeks();
  syncRoute();
  $('translation').value=state.version;
  setGuideVisible(!state.acknowledged);
  applyAppearance();
  document.querySelectorAll('.week').forEach(week=>{if(Number(week.dataset.week)===plan[state.current].week)week.open=true;});
  render();
})();