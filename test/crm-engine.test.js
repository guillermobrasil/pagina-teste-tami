const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'crm-engine.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context, { filename: 'crm-engine.js' });
const crm = context.window.CrmLocal;
const today = '2026-10-31';
const clients = [
  { id: 'a', name: 'Cliente A', firstVisit: '2024-01-01', nextReturnDate: '2026-10-30' },
  { id: 'b', name: 'Cliente B', firstVisit: '2026-10-03', nextReturnDate: '' },
  { id: 'c', name: 'Cliente C', firstVisit: '2025-01-01', nextReturnDate: '' }
];
const visits = [
  { id: 'v1', clientId: 'a', date: '2026-10-01' },
  { id: 'v2', clientId: 'b', date: '2026-10-01' },
  { id: 'v3', clientId: 'b', date: '2026-10-21' }
];
const transactions = [
  { id: 't1', clientId: 'a', type: 'receita', value: 500, date: '2026-10-05', sourceVisitId: 'v1' },
  { id: 't2', clientId: 'a', type: 'receita', value: 500, date: '2026-10-05', sourceVisitId: 'v1' },
  { id: 't3', clientId: 'b', type: 'receita', value: 250, date: '2026-10-21' },
  { id: 't4', clientId: 'b', type: 'despesa', value: 90, date: '2026-10-21' }
];

test('indicadores contam cada recebimento distinto ligado ao mesmo atendimento', () => {
  const result = crm.summary({ clients, visits, transactions, today });
  assert.equal(result.total, 3);
  assert.equal(result.active, 2);
  assert.equal(result.newThisMonth, 1);
  assert.equal(result.revenue, 1250);
  assert.equal(result.oldest.id, 'a');
  assert.equal(result.returns[0].source, 'manual');
  assert.equal(result.returns[0].daysUntil, -1);
  assert.equal(crm.clientPayments(clients, transactions).length, 3);
});

test('previsão manual tem prioridade e estimativa usa intervalo médio registrado', () => {
  const manual = crm.forecast(clients[0], visits);
  assert.deepEqual({ date: manual.date, source: manual.source }, { date: '2026-10-30', source: 'manual' });
  const estimated = crm.forecast(clients[1], visits);
  assert.equal(estimated.source, 'estimated');
  assert.equal(estimated.averageDays, 20);
  assert.equal(estimated.date, '2026-11-10');
  assert.equal(crm.forecast(clients[2], visits).source, 'insufficient-data');
});

test('rankings filtram o período e usam critérios diferentes', () => {
  const result = crm.rankings({ clients, visits, transactions, period: '90', today });
  assert.equal(result.spending[0].client.id, 'a');
  assert.equal(result.attendance[0].client.id, 'b');
  assert.equal(result.frequency[0].client.id, 'b');
  assert.equal(result.spending.find((item) => item.client.id === 'a').charged, 0, 'não infere valor cobrado quando o atendimento não tem campo de cobrança');
  assert.equal(result.received.find((item) => item.client.id === 'a').received, 1000);
  assert.equal(result.tenure.some((item) => item.client.id === 'c'), false, 'cliente sem atividade no período não entra no ranking de permanência');
});

test('estado vazio não inventa métricas nem previsões', () => {
  const result = crm.summary({ clients: [], visits: [], transactions: [], today });
  assert.equal(result.total, 0);
  assert.equal(result.active, 0);
  assert.equal(result.revenue, 0);
  assert.equal(result.oldest, null);
  assert.deepEqual(result.returns, []);
});
