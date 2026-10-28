/* Auditoria opcional; axe-core e Playwright são usados somente no processo de teste. */
'use strict';
const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:390,height:844}});
 await p.addInitScript(()=>{
  Object.defineProperty(navigator,'share',{configurable:true,value:undefined});
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('Denied','NotAllowedError');}}});
 });
 await p.goto(process.env.BASE_URL || 'http://127.0.0.1:8000/');
 const axe=require('axe-core').source;
 const results=[];
 async function audit(name){await p.evaluate(axe);const r=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));results.push({name,passes:r.passes.length,incomplete:r.incomplete.map(i=>({id:i.id,description:i.description,nodes:i.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
 await audit('primeiro acesso');
 await p.locator('#dismiss-guide').click();
 for(const palette of ['lavanda','salvia','areia','azul','rose'])for(const mode of ['light','dark']){
  await p.locator('#theme-toggle').click();await p.locator(`[data-palette-choice="${palette}"]`).click();await p.locator(`[data-mode-choice="${mode}"]`).click();await audit(`aparencia ${palette} ${mode}`);await p.keyboard.press('Escape');await audit(`leitura ${palette} ${mode}`);
  for(const summary of await p.locator('#questions .question-help summary').all())await summary.click();
  await p.locator('#questions').evaluate(node=>Promise.all(node.getAnimations({subtree:true}).map(animation=>animation.finished)));
  await audit(`ajudas perguntas ${palette} ${mode}`);
  await p.locator('#questions details.question-help').evaluateAll(nodes=>nodes.forEach(node=>{node.open=false;}));
  await p.locator('#tools-toggle').click();await audit(`opcoes ${palette} ${mode}`);
  await p.locator('#share-site').click();await p.locator('#copy-link').click();
  await p.locator('#share-link').waitFor({state:'visible'});await audit(`compartilhar manual ${palette} ${mode}`);
  if(await p.locator('#install-help').getAttribute('open')===null)await p.locator('#install-help summary').click();
  await audit(`orientacoes instalacao ${palette} ${mode}`);await p.keyboard.press('Escape');
 }
 await p.locator('#route-tab').click();await p.waitForTimeout(250);await audit('roteiro móvel');await p.keyboard.press('Escape');
 await p.evaluate(()=>{localStorage.setItem('leitura-biblica-mulheres-v1',JSON.stringify({current:6,read:[0,1,2,3,4,5],acknowledged:true}));});await p.reload();await p.locator('#mark-read').click();await audit('celebração');
 await p.keyboard.press('Escape');
 for(const summary of await p.locator('#questions .question-help summary').all())await summary.click();
 await p.locator('#questions').evaluate(node=>Promise.all(node.getAnimations({subtree:true}).map(animation=>animation.finished)));
 await audit('ajudas revisao semanal');
 await p.setViewportSize({width:1440,height:1000});await audit('desktop');
 const path=require('node:path');
 const output=process.env.ARTIFACT_DIR || '/tmp/devotional-days-results';
 fs.mkdirSync(output,{recursive:true});
 fs.writeFileSync(path.join(output,'acessibilidade.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results.filter(r=>r.violations.length),null,2));console.log(`${results.length} cenários; ${results.reduce((n,r)=>n+r.violations.length,0)} violações`);
 await b.close();
 if(results.some(r=>r.violations.length)) process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
