const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'secretaria-engine.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context, { filename: 'secretaria-engine.js' });
const secretary = context.window.SecretariaLocal;
const now = new Date(2026, 9, 31, 12);
const fixtures = {
  appointments: [
    { title: 'Avaliação demonstrativa', date: '2026-10-31', time: '09:00', status: 'Confirmado' },
    { title: 'Retorno fictício', date: '2026-11-01', time: '13:00', status: 'A confirmar' }
  ],
  transactions: [
    { type: 'receita', description: 'Receita teste', value: 850, date: '2026-10-31' },
    { type: 'despesa', description: 'Material teste', value: 125, date: '2026-10-30' }
  ],
  approvals: [
    { title: 'Post educativo', type: 'Publicação', status: 'Pendente' },
    { title: 'Campanha antiga', type: 'Campanha', status: 'Aprovado' }
  ],
  drafts: [{ title: 'Bastidores do espaço', type: 'Ideia de Reels' }]
};

test('agenda responde com os compromissos reais do estado recebido, sem criar nomes', () => {
  const answer = secretary.reply('Como está minha agenda hoje?', fixtures, now);
  assert.match(answer, /Avaliação demonstrativa/);
  assert.doesNotMatch(answer, /Retorno fictício/);
  assert.doesNotMatch(answer, /Cliente demonstração|Paciente [A-Z]/i);
  const empty = secretary.reply('Tenho horário amanhã?', { ...fixtures, appointments: [] }, now);
  assert.match(empty, /Não encontrei compromissos fictícios/);
});

test('financeiro calcula totais dos lançamentos recebidos e explica sua origem', () => {
  const answer = secretary.reply('Qual é meu saldo financeiro?', fixtures, now);
  assert.match(answer, /R\$\s?850,00/);
  assert.match(answer, /R\$\s?125,00/);
  assert.match(answer, /R\$\s?725,00/);
  assert.match(answer, /lançamentos locais fictícios/);
});

test('aprovações e marketing usam os registros existentes', () => {
  const approvals = secretary.reply('Quais aprovações estão pendentes?', fixtures, now);
  assert.match(approvals, /1 item pendente/);
  assert.match(approvals, /Post educativo/);
  assert.doesNotMatch(approvals, /Campanha antiga/);
  const marketing = secretary.reply('Que rascunhos tenho no marketing?', fixtures, now);
  assert.match(marketing, /Bastidores do espaço/);
  assert.match(marketing, /sem IA conectada/);
});

test('preços e procedimentos não inventam tabela nem dão orientação clínica', () => {
  const price = secretary.reply('Quanto custa Botox?', fixtures, now);
  assert.match(price, /Não há uma tabela de preços/);
  assert.doesNotMatch(price, /R\$\s?850/);
  const clinical = secretary.reply('Qual dose devo aplicar?', fixtures, now);
  assert.match(clinical, /não avalia casos/);
  assert.match(clinical, /recomenda procedimentos, doses/);
});

test('contexto da conversa permite perguntas de seguimento e desconhecidas pedem esclarecimento', () => {
  const history = [{ from: 'you', text: 'Como está minha agenda hoje?' }, { from: 'assistant', text: 'Encontrei horários.' }];
  const followUp = secretary.reply('E amanhã?', { ...fixtures, chat: history }, now);
  assert.match(followUp, /Retorno fictício/);
  const unknown = secretary.reply('Xq7 plim zor?', fixtures, now);
  assert.match(unknown, /Não consegui identificar o assunto/);
  const general = secretary.reply('Oi, como funciona?', fixtures, now);
  assert.match(general, /Qual dessas áreas você quer ver/);
});
