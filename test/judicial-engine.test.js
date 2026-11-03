const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../assets/juridico-base.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../judicial-engine.js'),'utf8'),context);
const engine=context.window.EsteticaJudicialEngine;
test('arquivo normativo preserva origem, integridade e busca local sem acentos',()=>{
  const archive=context.window.JuridicoArchive;
  assert.equal(archive.sections.length,43);
  assert.ok(archive.text.includes('Art. 41'));
  assert.equal(require('node:crypto').createHash('sha256').update(archive.text).digest('hex'),archive.textSha256);
  assert.equal(archive.source,'https://cfbm.gov.br/legislacao/codigo-de-etica/');
  assert.ok(engine.searchArchive('publicidade').length);
  assert.ok(engine.searchArchive('SIGILO').length);
  assert.equal(engine.searchArchive('xyzinexistente').length,0);
  assert.equal(engine.searchArchive('').length,0);
  assert.ok(fs.readFileSync(require('node:path').join(__dirname,'../assets/codigo-etica-cfbm-330-2020.txt'),'utf8').replace(/\r\n/g,'\n').includes(archive.text));
});
test('casos exigem vínculo coerente e data conferida, sem inferir prazo',()=>{
  const values={clientId:'c1',visitId:'v1',kind:'notice',status:'Em triagem',date:'2026-11-02',summary:'Exemplo de notificação fictícia'};
  const clients=[{id:'c1'},{id:'c2'}],visits=[{id:'v1',clientId:'c1'}];
  assert.equal(engine.validateCase(values,clients,visits).visitId,'v1');
  assert.throws(()=>engine.validateCase({...values,clientId:'c2'},clients,visits),/pertencer/);
  assert.throws(()=>engine.validateCase({...values,deadline:'2026-11-10'},clients,visits),/confirme/);
  assert.throws(()=>engine.validateCase({...values,date:'2026-02-30'},clients,visits),/válida/);
  assert.equal(engine.validateCase({...values,deadline:'2026-11-10',deadlineChecked:true},clients,visits).deadline,'2026-11-10');
});
test('apoio de casos diferencia saúde, processo e documentos faltantes',()=>{
  const routine=engine.casePlan({kind:'dissatisfaction',documents:{record:true}});
  assert.ok(!routine.missing.includes('record'));assert.ok(!routine.missing.includes('notification'));
  const formal=engine.casePlan({kind:'lawsuit'});
  assert.ok(formal.missing.includes('notification'));assert.match(formal.steps.join(' '),/não calcula prazo/);
  const health=engine.casePlan({kind:'complication',healthConcern:true});
  assert.equal(health.priority,'Prioridade assistencial');assert.match(health.steps[0],/não avalia sintomas/);
});
test('base regional identifica escopo, data e fontes oficiais de cada assunto',()=>{
  const base=engine.regional;
  assert.equal(base.jurisdiction,'Paraná'); assert.equal(base.city,'Curitiba');
  assert.equal(base.reviewedAt,'2026-11-02');
  for(const topic of base.topics){
    assert.ok(topic.items.length); assert.ok(topic.sources.length);
    for(const key of topic.sources){
      const url=new URL(base.sources[key].url);
      assert.equal(url.protocol,'https:');
      assert.match(url.hostname,/(^|\.)(crbm6\.gov\.br|cfbm\.gov\.br|trf1\.jus\.br|curitiba\.pr\.gov\.br|gov\.br)$/);
    }
  }
});
test('roteiros relacionam fontes sem decidir autorização ou prazo',()=>{
  assert.ok(engine.createGuide('advertising').topics.some(t=>t.id==='advertising'));
  assert.ok(engine.createGuide('sanitary').topics.some(t=>t.id==='sanitary'));
  const topic=engine.regional.topics.find(t=>t.id==='practice');
  assert.ok(topic.sources.includes('court') && topic.sources.includes('councilNote'));
  assert.match(topic.items.join(' '),/não consultou o andamento atual/);
  assert.equal(engine.createGuide('unknown','  exemplo  ').context,'exemplo');
  assert.ok(engine.createGuide('unknown').topics.some(t=>t.id==='response'));
});
