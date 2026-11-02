/* Regras administrativas; sem acesso a rede ou armazenamento. */
(function (root) {
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const cents = (v) => Math.round(Number(v || 0) * 100);
  const sum = (items, field) => items.reduce((n, r) => n + cents(r[field]), 0) / 100;
  function period(mode = 'month', anchor = iso(new Date()), start = '', end = '') {
    const d = new Date(`${anchor}T12:00:00`);
    if (mode === 'all') return { mode, start: '', end: '' };
    if (mode === 'custom') return { mode, start, end };
    if (mode === 'week') {
      d.setDate(d.getDate() - (d.getDay() + 6) % 7);
      const first = iso(d); d.setDate(d.getDate() + 6);
      return { mode, start: first, end: iso(d) };
    }
    return { mode: 'month', start: iso(new Date(d.getFullYear(), d.getMonth(), 1, 12)), end: iso(new Date(d.getFullYear(), d.getMonth() + 1, 0, 12)) };
  }
  function receiptsFor(visit, transactions) {
    const seen = new Set();
    return transactions.filter(r => r.type === 'receita' && r.status !== 'Cancelado' && !seen.has(r.id) && (r.sourceVisitId === visit.id || visit.paymentIds?.includes(r.id)) && seen.add(r.id));
  }
  const received = (v, t) => sum(receiptsFor(v, t), 'value');
  function finance(data, range) {
    const includes = (r) => (!range.start || r.date >= range.start) && (!range.end || r.date <= range.end);
    const visits = data.clientVisits.filter(v => !v.demo && includes(v));
    const rows = data.transactions.filter(t => !t.demo && includes(t));
    const active = rows.filter(t => t.status !== 'Cancelado');
    const income = sum(active.filter(t => t.type === 'receita'), 'value');
    const expense = sum(active.filter(t => t.type === 'despesa'), 'value');
    const room = sum(visits, 'roomCost'), materials = sum(visits, 'materialCostSnapshot');
    const missing = visits.filter(v => v.roomCost == null || v.materialCostSnapshot == null).length;
    const visitIncome = visits.reduce((n, v) => n + cents(received(v, data.transactions)), 0) / 100;
    const pending = visits.reduce((n, v) => n + Math.max(0, cents(v.chargedTotal) - cents(received(v, data.transactions))), 0) / 100;
    return { visits, rows, income, expense, room, materials, missing, pending, visitIncome, net: (cents(visitIncome) - cents(room) - cents(materials)) / 100, cash: (cents(income) - cents(expense)) / 100 };
  }
  function tasks(data, today, forecast) {
    const result = [];
    for (const client of data.clients.filter(c => !c.demo)) {
      const next = forecast(client, data.clientVisits.filter(v => !v.demo));
      if (next.date && next.date <= today) result.push({ kind: 'return', id: client.id, title: client.name, detail: `Retorno ${next.source === 'estimated' ? 'estimado' : 'informado'}: ${next.date}`, date: next.date });
    }
    for (const visit of data.clientVisits.filter(v => !v.demo)) {
      const client = data.clients.find(c => c.id === visit.clientId);
      const title = `${client?.name || 'Cliente'} · ${visit.procedure}`;
      const pending = Math.max(0, cents(visit.chargedTotal) - cents(received(visit, data.transactions))) / 100;
      if (pending) result.push({ kind: 'payment', id: visit.id, title, amount: pending, detail: 'Valor combinado ainda não recebido', date: visit.date });
      else if (visit.paymentConfirmed === false && !receiptsFor(visit, data.transactions).length) result.push({ kind: 'payment', id: visit.id, title, detail: 'Pagamento ainda não informado', date: visit.date });
      if (visit.roomCost == null || visit.materialCostSnapshot == null) result.push({ kind: 'cost', id: visit.id, title, detail: 'Preencher custos para conferir o resultado', date: visit.date });
    }
    for (const item of data.approvals.filter(a => a.status === 'Pendente')) result.push({ kind: 'approval', id: item.id, title: item.title, detail: 'Aguardando revisão', date: '' });
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }
  root.WorkflowLocal = Object.freeze({ period, finance, tasks, received, receiptsFor });
})(typeof window === 'undefined' ? globalThis : window);
