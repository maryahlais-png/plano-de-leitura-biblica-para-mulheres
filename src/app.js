/*
 * Guia estático sem autenticação e sem integração com servidores.
 * Política de DOM: nunca inserir dados do navegador com innerHTML.
 */
(() => {
  'use strict';
  const plan = window.READING_PLAN.encounters;
  const weeks = window.READING_PLAN.weeks;
  const STORE_KEY = 'leitura-biblica-mulheres-v1';
  const LEGACY_KEY = 'plano-biblia-estudo-reflexao-v2';
  const versions = Object.freeze({ NVI:129, NAA:1840, ARA:1608, ARC:212, NVT:1930, NTLH:211 });
  const palettes = Object.freeze([
    ['lavanda','Lavanda','#bfa2db'], ['salvia','Sálvia','#a7c7c5'],
    ['areia','Areia','#d4bfae'], ['azul','Azul névoa','#a8bed3'],
    ['rose','Rosé','#d5a0b5']
  ]);
  const $ = (id) => document.getElementById(id);
  const isValidIndex = value => Number.isInteger(value) && value >= 0 && value < plan.length;
  const defaults = () => ({ read: [], version:'NVI', palette:'lavanda', mode:'light', acknowledged:false, current:0 });
  const safeMode = value => ['light','dark','system'].includes(value) ? value : 'light';
  const safePalette = value => palettes.some(item => item[0] === value) ? value : 'lavanda';
  function sanitize(saved) {
    const d = defaults();
    if (!saved || typeof saved !== 'object') return d;
    return {
      read: Array.isArray(saved.read) ? Array.from(new Set(saved.read.filter(isValidIndex))).sort((a,b)=>a-b) : [],
      version: Object.hasOwn(versions,saved.version) ? saved.version : d.version,
      palette: safePalette(saved.palette), mode: safeMode(saved.mode),
      acknowledged: saved.acknowledged === true,
      current: isValidIndex(saved.current) ? saved.current : 0
    };
  }
  function readState(){
    try {
      const v = localStorage.getItem(STORE_KEY);
      if (v) return sanitize(JSON.parse(v));
      const old = localStorage.getItem(LEGACY_KEY);
      if (old) return sanitize(JSON.parse(old));
    } catch (_e) { /* modo privado e bloqueios do navegador */ }
    return defaults();
  }
  let state = readState();
  if (state.read.length && !state.read.includes(state.current)) {
    state.current = Math.min(plan.findIndex((_,i)=>!state.read.includes(i)) < 0 ? plan.length - 1 : plan.findIndex((_,i)=>!state.read.includes(i)),plan.length - 1);
  }
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_e) { /* app continua sem persistência */ } };
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
    palettes.forEach(([name,label,color]) => {
      const button=document.createElement('button');
      button.type='button';button.className='swatch';button.dataset.paletteChoice=name;
      button.setAttribute('aria-label', `Tema ${label}`);
      button.setAttribute('title',label);
      const dot=document.createElement('span');dot.className='swatch-dot';dot.style.setProperty('--swatch-color',color);
      button.append(dot);
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
    updateProgress();
  }
  function navigate(i){
    if(!isValidIndex(i))return;
    state.current=i;save();render();
    document.querySelectorAll('.week').forEach(week=>{if(Number(week.dataset.week)===plan[i].week)week.open=true;});
    if(window.matchMedia('(max-width:690px)').matches) $('leitura').scrollIntoView({block:'start',behavior:'auto'});
    $('leitura').focus({preventScroll:true});
  }
  function showCelebration(week){
    const field=document.querySelector('.crystal-field');field.replaceChildren();
    const xs=[9,18,25,36,44,54,65,72,81,91,13,31,60,85,50,77];
    const ys=[22,63,30,79,17,67,28,74,37,63,84,48,12,87,45,18];
    for(let i=0;i<xs.length;i++){
      const particle=document.createElement('span');particle.className='crystal';
      particle.style.setProperty('--x',`${xs[i]}%`);particle.style.setProperty('--y',`${ys[i]}%`);
      particle.style.setProperty('--size',`${(i%3)+3}px`);
      particle.style.setProperty('--delay',`${(i%6)*.12}s`);field.append(particle);
    }
    text('celebration-title',`Semana ${week+1} concluída`);
    $('celebration').hidden=false;
    $('celebration').scrollIntoView({block:'nearest',behavior:'auto'});
  }
  $('mark-read').addEventListener('click',()=>{
    const index=state.current,wasRead=state.read.includes(index),week=plan[index].week;
    if(wasRead) state.read=state.read.filter(i=>i!==index);
    else state.read.push(index);
    state.read.sort((a,b)=>a-b);save();render();
    if(!wasRead && plan.filter(d=>d.week===week).every(d=>state.read.includes(plan.indexOf(d)))) showCelebration(week);
  });
  $('previous').addEventListener('click',()=>navigate(state.current-1));
  $('next').addEventListener('click',()=>navigate(state.current+1));
  $('dismiss-celebration').addEventListener('click',()=>{$('celebration').hidden=true;});
  $('translation').addEventListener('change',event=>{if(Object.hasOwn(versions,event.target.value)){state.version=event.target.value;save();render();}});
  $('dismiss-guide').addEventListener('click',()=>{state.acknowledged=true;save();$('guide-notice').hidden=true;});
  $('theme-toggle').addEventListener('click',()=>{
    const panel=$('theme-panel');panel.hidden=!panel.hidden;
    $('theme-toggle').setAttribute('aria-expanded',String(!panel.hidden));
  });
  document.querySelectorAll('[data-mode-choice]').forEach(button=>button.addEventListener('click',()=>{state.mode=button.dataset.modeChoice;save();applyAppearance();}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){$('theme-panel').hidden=true;$('theme-toggle').setAttribute('aria-expanded','false');}});
  document.addEventListener('click',event=>{if(!event.target.closest('.appearance-area')){$('theme-panel').hidden=true;$('theme-toggle').setAttribute('aria-expanded','false');}});
  const darkPreference=window.matchMedia('(prefers-color-scheme: dark)');
  if(darkPreference.addEventListener)darkPreference.addEventListener('change',()=>{if(state.mode==='system')applyAppearance();});
  buildPalettes();createWeeks();
  $('translation').value=state.version;
  $('guide-notice').hidden=state.acknowledged;
  applyAppearance();
  document.querySelectorAll('.week').forEach(week=>{if(Number(week.dataset.week)===plan[state.current].week)week.open=true;});
  render();
})();