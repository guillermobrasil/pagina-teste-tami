/* Cálculos locais do CRM. O módulo não acessa rede nem envia dados. */
(function attachCrmEngine(root) {
  const dayMs = 86400000;
  const parseDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? new Date(`${value}T12:00:00`) : null;
  const dateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const daysBetween = (a, b) => Math.round((parseDate(b) - parseDate(a)) / dayMs);
  const formatDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—';
  const money = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function forecast(client, visits = []) {
    if (client.nextReturnDate) return { date: client.nextReturnDate, source: 'manual' };
    const dates = visits.filter((item) => item.clientId === client.id && item.date).map((item) => item.date).sort();
    if (dates.length < 2) return { date: '', source: 'insufficient-data' };
    const intervals = dates.slice(1).map((date, index) => daysBetween(dates[index], date)).filter((days) => days > 0);
    if (!intervals.length) return { date: '', source: 'insufficient-data' };
    const average = Math.round(intervals.reduce((sum, days) => sum + days, 0) / intervals.length);
    const next = parseDate(dates[dates.length - 1]);
    next.setDate(next.getDate() + average);
    return { date: dateISO(next), source: 'estimated', averageDays: average };
  }

  function clientPayments(clients = [], transactions = []) {
    const known = new Set(clients.map((client) => client.id));
    const seenIds = new Set();
    return transactions.filter((transaction) => {
      if (transaction.type !== 'receita' || transaction.status === 'Cancelado' || !transaction.clientId || !known.has(transaction.clientId) || seenIds.has(transaction.id)) return false;
      seenIds.add(transaction.id);
      return true;
    });
  }

  function summary({ clients = [], visits = [], transactions = [], today = dateISO(new Date()) } = {}) {
    const activeFrom = new Date(`${today}T12:00:00`); activeFrom.setDate(activeFrom.getDate() - 365);
    const currentMonth = today.slice(0, 7);
    const payments = clientPayments(clients, transactions);
    const visitedIds = new Set(visits.filter((visit) => visit.date >= dateISO(activeFrom) && visit.date <= today).map((visit) => visit.clientId));
    const oldest = [...clients].filter((client) => client.firstVisit).sort((a, b) => a.firstVisit.localeCompare(b.firstVisit))[0] || null;
    const returns = clients.map((client) => ({ client, ...forecast(client, visits) }))
      .filter((item) => item.date)
      .map((item) => ({ ...item, daysUntil: daysBetween(today, item.date) }))
      .filter((item) => item.daysUntil <= 30)
      .sort((a, b) => a.date.localeCompare(b.date));
    return {
      total: clients.length,
      active: clients.filter((client) => visitedIds.has(client.id)).length,
      newThisMonth: clients.filter((client) => client.firstVisit?.slice(0, 7) === currentMonth).length,
      revenue: payments.reduce((sum, item) => sum + Number(item.value || 0), 0),
      charged: visits.reduce((sum, item) => sum + Number(item.chargedTotal ?? 0), 0),
      oldest,
      returns,
      payments
    };
  }

  function rankings({ clients = [], visits = [], transactions = [], period = 'all', today = dateISO(new Date()) } = {}) {
    const days = ({ '30': 30, '90': 90, '365': 365 })[period];
    const start = days ? new Date(`${today}T12:00:00`) : null;
    if (start) start.setDate(start.getDate() - days + 1);
    const startISO = start ? dateISO(start) : '0000-01-01';
    const inPeriod = (item) => item.date >= startISO && item.date <= today;
    const recentVisits = visits.filter(inPeriod);
    const recentTransactions = clientPayments(clients, transactions).filter(inPeriod);
    const received = new Map(); recentTransactions.forEach((item) => received.set(item.clientId, (received.get(item.clientId) || 0) + Number(item.value || 0)));
    const charged = new Map(); visits.filter(inPeriod).forEach((item) => charged.set(item.clientId, (charged.get(item.clientId) || 0) + Number(item.chargedTotal ?? item.value ?? 0)));
    const counts = new Map(); recentVisits.forEach((item) => counts.set(item.clientId, (counts.get(item.clientId) || 0) + 1));
    const visitsInPeriod = new Set(recentVisits.map((item) => item.clientId));
    const base = clients.map((client) => {
      const clientVisits = recentVisits.filter((item) => item.clientId === client.id).sort((a, b) => a.date.localeCompare(b.date));
      const span = clientVisits.length > 1 ? Math.max(1, daysBetween(clientVisits[0].date, clientVisits[clientVisits.length - 1].date)) : 0;
      const monthlyFrequency = span ? ((clientVisits.length - 1) / span) * 30 : 0;
      return { client, spend: charged.get(client.id) || 0, charged: charged.get(client.id) || 0, received: received.get(client.id) || 0, visits: counts.get(client.id) || 0, monthlyFrequency, hasVisits: visitsInPeriod.has(client.id) };
    });
    const ordered = (key, condition = () => true) => [...base].filter(condition).sort((a, b) => b[key] - a[key] || a.client.name.localeCompare(b.client.name, 'pt-BR'));
    return {
      spending: ordered('spend'),
      received: ordered('received'),
      tenure: base.filter((item) => item.hasVisits).sort((a, b) => a.client.firstVisit.localeCompare(b.client.firstVisit)),
      attendance: ordered('visits'),
      frequency: ordered('monthlyFrequency', (item) => item.visits >= 2)
    };
  }

  root.CrmLocal = Object.freeze({ forecast, clientPayments, summary, rankings, formatDate, money });
})(window);
