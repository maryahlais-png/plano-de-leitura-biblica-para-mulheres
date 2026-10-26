/* Estado não sensível: compatível com as duas chaves já usadas pelo guia. */
(function (root) {
  'use strict';
  const STORE_KEY = 'leitura-biblica-mulheres-v1';
  const LEGACY_KEY = 'plano-biblia-estudo-reflexao-v2';
  const versions = Object.freeze({ NVI:129, NAA:1840, ARA:1608, ARC:212, NVT:1930, NTLH:211 });
  const palettes = Object.freeze([
    ['lavanda','Lavanda'], ['salvia','Sálvia'], ['areia','Areia'],
    ['azul','Azul Névoa'], ['rose','Rosé']
  ]);
  const defaults = () => ({ read: [], version:'NVI', palette:'lavanda', mode:'light', acknowledged:false, current:0 });
  const isValidIndex = (value, total) => Number.isInteger(value) && value >= 0 && value < total;
  function sanitize(saved, total) {
    const d = defaults();
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return d;
    return {
      read: Array.isArray(saved.read) ? [...new Set(saved.read.filter(i => isValidIndex(i,total)))].sort((a,b)=>a-b) : [],
      version: typeof saved.version === 'string' && Object.hasOwn(versions,saved.version) ? saved.version : d.version,
      palette: palettes.some(([name])=>name===saved.palette) ? saved.palette : d.palette,
      mode: ['light','dark','system'].includes(saved.mode) ? saved.mode : d.mode,
      acknowledged: saved.acknowledged === true,
      current: isValidIndex(saved.current,total) ? saved.current : d.current
    };
  }
  function readState(storage, total, onError = () => {}) {
    // Um registro inválido não impede tentar a chave anterior, que nunca é apagada.
    for (const key of [STORE_KEY, LEGACY_KEY]) {
      try {
        const raw = storage.getItem(key);
        if (!raw) continue;
        const saved = JSON.parse(raw);
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) return sanitize(saved,total);
      } catch (error) { onError(error); }
    }
    return defaults();
  }
  function writeState(storage, state, onError = () => {}) {
    try { storage.setItem(STORE_KEY,JSON.stringify(state)); return true; }
    catch (error) { onError(error); return false; }
  }
  const nextPending = (state, total) => Array.from({length:total},(_,i)=>i).find(i=>!state.read.includes(i)) ?? null;
  function toggleRead(state, index, plan) {
    if (!isValidIndex(index,plan.length)) return {state, celebration:null};
    const wasRead = state.read.includes(index);
    const read = wasRead ? state.read.filter(i=>i!==index) : [...state.read,index].sort((a,b)=>a-b);
    const weekComplete = plan.every((entry,i)=>entry.week!==plan[index].week || read.includes(i));
    const celebration = wasRead ? null : read.length===plan.length ? 'plan' : weekComplete ? 'week' : null;
    return {state:{...state,read}, celebration};
  }
  const api = Object.freeze({ STORE_KEY, LEGACY_KEY, versions, palettes, defaults, isValidIndex, sanitize, readState, writeState, nextPending, toggleRead });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.READING_STATE = api;
})(typeof window === 'undefined' ? globalThis : window);
