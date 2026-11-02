const {test} = require('node:test');
const assert = require('node:assert/strict');
require('../workflow-engine.js');
const engine = globalThis.WorkflowLocal;
test('períodos respeitam semana segunda-domingo e meses de virada e bissextos', () => {
  assert.deepEqual(engine.period('week','2027-01-03'),{mode:'week',start:'2026-12-28',end:'2027-01-03'});
  assert.equal(engine.period('month','2028-02-20').end,'2028-02-29');
});
test('financeiro distingue caixa do período e resultado dos atendimentos sem duplicar custos', () => {
  const data = {clientVisits:[{id:'v',date:'2026-10-31',roomCost:0.1,materialCostSnapshot:0.2,chargedTotal:10}],transactions:[{id:'a',sourceVisitId:'v',type:'receita',date:'2026-11-01',value:10},{id:'b',type:'despesa',date:'2026-11-02',value:2},{id:'c',type:'receita',date:'2026-11-03',value:999,demo:true},{id:'d',type:'receita',date:'2026-11-03',value:99,status:'Cancelado'}]};
  const november = engine.finance(data,engine.period('month','2026-11-02'));
  assert.equal(november.income,10); assert.equal(november.cash,8); assert.equal(november.visits.length,0); assert.equal(november.net,0);
  const october = engine.finance(data,engine.period('month','2026-10-02'));
  assert.equal(october.income,0); assert.equal(october.net,9.7);
  data.clientVisits[0].roomCost = null;
  assert.equal(engine.finance(data,engine.period('all')).missing,1);
});
test('pendências excluem exemplos e não inventam dívida para pagamento desconhecido', () => {
  const data = {clients:[{id:'c',name:'Teste',nextReturnDate:'2026-11-01'}],clientVisits:[{id:'v',clientId:'c',procedure:'Botox',date:'2026-11-02',roomCost:null,materialCostSnapshot:0,paymentConfirmed:false,chargedTotal:0},{id:'demo',demo:true,chargedTotal:500}],transactions:[],approvals:[{id:'a',title:'Revisar',status:'Pendente'}]};
  const tasks = engine.tasks(data,'2026-11-02',c=>({date:c.nextReturnDate,source:'manual'}));
  assert.equal(tasks.length,4); assert.equal(tasks.find(t=>t.kind==='payment').amount,undefined);
  data.clientVisits[0].chargedTotal=500;
  assert.equal(engine.tasks(data,'2026-11-02',()=>({})).find(t=>t.kind==='payment').amount,500);
});
