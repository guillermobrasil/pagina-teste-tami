const pageNames = {
  inicio: 'Visão geral', secretaria: 'Secretária virtual', crm: 'Clientes e Relacionamento', marketing: 'Marketing', identidade: 'Identidade Visual',
  agenda: 'Agenda', aprovacoes: 'Aprovações', whatsapp: 'WhatsApp', financeiro: 'Financeiro', juridico: 'Agente Jurídico', configuracoes: 'Configurações'
};
const pageCopy = {
  inicio: ['Bom dia, Tami', 'Aqui está o resumo do seu espaço hoje.'],
  secretaria: ['Secretária virtual', 'Uma conversa simulada para organizar tarefas administrativas.'],
  crm: ['Clientes e Relacionamento', 'Consulte fichas, atendimentos, pagamentos associados e retornos.'],
  marketing: ['Marketing do seu espaço', 'Planeje conteúdos e edite suas peças em um fluxo só.'],
  identidade: ['Identidade Visual', 'Configure as cores, fontes e o logotipo da sua marca.'],
  agenda: ['Sua agenda', 'Gerencie compromissos de demonstração neste navegador.'],
  aprovacoes: ['Central de aprovações', 'Aprovar ou rejeitar só altera o status nesta demonstração.'],
  financeiro: ['Seu financeiro', 'Lançamentos e saldo fictícios, salvos neste navegador.'],
  juridico: ['Agente Jurídico', 'Organize temas judiciais e regulatórios da Biomedicina Estética.'],
  whatsapp: ['WhatsApp da Tami', 'Prepare respostas com revisão obrigatória antes de qualquer envio futuro.'],
  configuracoes: ['Configurações do sistema', 'Cadastre os custos e informações usados nos atendimentos e cálculos financeiros.']
};
const storageKey = 'estetica-pro-ia-demo-v1';
const defaultIdentity = {
  colors: { primary: '#172B43', secondary: '#D9CDB9', background: '#F3EEE4', text: '#393B3E', highlight: '#B6975A' },
  titleFont: 'serif', bodyFont: 'sans', logo: 'assets/monograma-tc.png'
};
const localDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const localTime = () => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
const offsetDate = (days) => {
  const date = new Date(); date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
function makeCRMExamples() {
  const clients = [
    { id: 'crm-demo-client-01', name: 'Maria', contact: '', firstVisit: offsetDate(-540), nextReturnDate: offsetDate(-4), notes: 'Registro fictício para demonstração.', demo: true, active: true },
    { id: 'crm-demo-client-02', name: 'João', contact: '', firstVisit: offsetDate(-240), nextReturnDate: offsetDate(12), notes: 'Registro fictício para demonstração.', demo: true, active: true },
    { id: 'crm-demo-client-03', name: 'Ana', contact: '', firstVisit: `${localDate().slice(0, 7)}-01`, nextReturnDate: '', notes: 'Registro fictício para demonstração.', demo: true, active: true },
    { id: 'crm-demo-client-04', name: 'Camila', contact: '', firstVisit: offsetDate(-120), nextReturnDate: offsetDate(15), notes: 'Registro fictício para demonstração.', demo: true, active: true },
    { id: 'crm-demo-client-05', name: 'Pedro', contact: '', firstVisit: offsetDate(-75), nextReturnDate: '', notes: 'Registro fictício para demonstração.', demo: true, active: true }
  ];
  const visits = [
    { id: 'crm-demo-visit-01', clientId: clients[0].id, date: offsetDate(-540), procedure: 'Atendimento demonstrativo 01', appointmentId: '', transactionId: 'crm-demo-payment-01', paymentIds: ['crm-demo-payment-01'], chargedTotal: 650, paymentStatus: 'pago', paymentMethod: 'pix', installments: 1, adminNotes: '', demo: true },
    { id: 'crm-demo-visit-02', clientId: clients[0].id, date: offsetDate(-180), procedure: 'Atendimento demonstrativo 02', appointmentId: '', transactionId: 'crm-demo-payment-02', demo: true },
    { id: 'crm-demo-visit-03', clientId: clients[0].id, date: offsetDate(-30), procedure: 'Atendimento demonstrativo 03', appointmentId: '', transactionId: 'crm-demo-payment-03', demo: true },
    { id: 'crm-demo-visit-04', clientId: clients[1].id, date: offsetDate(-240), procedure: 'Atendimento demonstrativo 04', appointmentId: '', transactionId: 'crm-demo-payment-04', demo: true },
    { id: 'crm-demo-visit-05', clientId: clients[1].id, date: offsetDate(-60), procedure: 'Atendimento demonstrativo 05', appointmentId: '', transactionId: 'crm-demo-payment-05', demo: true },
    { id: 'crm-demo-visit-06', clientId: clients[2].id, date: `${localDate().slice(0, 7)}-01`, procedure: 'Atendimento demonstrativo 06', appointmentId: '', transactionId: 'crm-demo-payment-06', demo: true },
    { id: 'crm-demo-visit-07', clientId: clients[2].id, date: localDate(), procedure: 'Atendimento demonstrativo 07', appointmentId: '', transactionId: 'crm-demo-payment-07', demo: true }
  ];
  const amounts = [650, 400, 300, 375, 450, 220, 180];
  visits.forEach((visit, index) => { if (index) { visit.paymentIds = [visit.transactionId]; visit.chargedTotal = amounts[index]; visit.paymentStatus = 'pago'; visit.paymentMethod = index % 3 === 0 ? 'dinheiro' : index % 3 === 1 ? 'cartao' : 'pix'; visit.installments = visit.paymentMethod === 'cartao' ? 3 : 1; visit.adminNotes = ''; } });
  const transactions = visits.map((visit, index) => ({ id: visit.transactionId, type: 'receita', description: `${visit.procedure} · fictício`, value: amounts[index], grossAmount: amounts[index], fees: 0, date: visit.date, clientId: visit.clientId, sourceVisitId: visit.id, paymentMethod: visit.paymentMethod, installments: visit.installments, demo: true }));
  const occurrences = [
    { id: 'crm-demo-occurrence-01', clientId: clients[3].id, date: offsetDate(-7), category: 'Pendência de pagamento', description: 'Exemplo fictício: conferir se o recebimento do atendimento foi registrado.', actions: 'Verificar a ficha e o Financeiro antes de qualquer contato.', status: 'Pendente', responsible: 'Tami', demo: true },
    { id: 'crm-demo-occurrence-02', clientId: clients[3].id, date: offsetDate(-3), category: 'Cancelamento recorrente', description: 'Exemplo fictício: revisar os registros de remarcação próximos ao horário reservado.', actions: 'Conferir as datas e combinar com clareza as condições para novas marcações.', status: 'Pendente', responsible: 'Tami', demo: true },
    { id: 'crm-demo-occurrence-03', clientId: clients[3].id, date: offsetDate(-2), category: 'Outra ocorrência', description: 'Exemplo fictício: concluir a conferência das condições de remarcação registradas.', actions: 'Revisar a anotação administrativa e atualizar a ficha.', status: 'Pendente', responsible: 'Tami', demo: true },
    { id: 'crm-demo-occurrence-04', clientId: clients[4].id, date: offsetDate(-1), category: 'Outra ocorrência', description: 'Exemplo fictício: retorno solicitado, ainda sem data combinada.', actions: 'Consultar a agenda e registrar o próximo passo acordado.', status: 'Pendente', responsible: 'Tami', demo: true }
  ];
  return { clients, visits, transactions, occurrences };
}
const makeInitialData = () => {
  const crm = makeCRMExamples();
  return ({
  appointments: [
    { id: crypto.randomUUID(), title: 'Avaliação demonstrativa', date: localDate(), time: '09:00', status: 'Confirmado' },
    { id: crypto.randomUUID(), title: 'Rotina de demonstração', date: localDate(), time: '10:30', status: 'Confirmado' },
    { id: crypto.randomUUID(), title: 'Retorno fictício', date: localDate(), time: '13:00', status: 'A confirmar' },
    { id: crypto.randomUUID(), title: 'Horário demonstrativo', date: localDate(), time: '15:30', status: 'Confirmado' }
  ],
  drafts: [
    { id: crypto.randomUUID(), type: 'Legenda para Instagram', title: 'Uma pausa na rotina', body: 'Uma pausa na rotina também é cuidado. Reserve um momento para você. ✨', updatedAt: new Date().toISOString() },
    { id: crypto.randomUUID(), type: 'Ideia de Reels', title: 'Bastidores do espaço', body: 'Mostrar a preparação do ambiente e pequenos detalhes da rotina do estúdio.', updatedAt: new Date().toISOString() }
  ],
  approvals: [
    { id: crypto.randomUUID(), type: 'Publicação', title: 'Post para Instagram', body: 'Uma pausa na rotina também é cuidado. Reserve um momento para você. ✨', status: 'Pendente' },
    { id: crypto.randomUUID(), type: 'Mensagem', title: 'Lembrete de agenda', body: 'Olá! Este é um lembrete fictício do seu horário demonstrativo. Responda apenas no ambiente de teste.', status: 'Pendente' },
    { id: crypto.randomUUID(), type: 'Campanha', title: 'Ideia da semana', body: 'Seu momento de autocuidado: uma ideia de campanha de demonstração.', status: 'Pendente' }
  ],
  transactions: [
    { id: crypto.randomUUID(), type: 'receita', description: 'Receita demonstrativa', value: 850, date: localDate(), demo: true },
    { id: crypto.randomUUID(), type: 'despesa', description: 'Despesa demonstrativa', value: 125, date: localDate(), demo: true },
    ...crm.transactions
  ],
  clients: crm.clients, clientVisits: crm.visits, occurrences: crm.occurrences,
  chat: [], strategyPlans: [], whatsappSettings: { monthlyMessageCap: '', monthlyAiCap: '', requireApproval: true }, whatsappDrafts: [], demoOccurrenceExamplesAdded: true
  });
};
function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && ['appointments', 'drafts', 'approvals', 'transactions', 'chat'].every((key) => Array.isArray(saved[key]))) {
      if (!Array.isArray(saved.strategyPlans)) saved.strategyPlans = [];
      if (!Array.isArray(saved.clients)) {
        const crm = makeCRMExamples();
        saved.clients = crm.clients; saved.clientVisits = crm.visits; saved.occurrences = crm.occurrences;
        const existingIds = new Set(saved.transactions.map((item) => item.id));
        saved.transactions.push(...crm.transactions.filter((item) => !existingIds.has(item.id)));
      }
      if (!Array.isArray(saved.clientVisits)) saved.clientVisits = [];
      if (!Array.isArray(saved.occurrences)) saved.occurrences = [];
      saved.whatsappSettings ||= { monthlyMessageCap: '', monthlyAiCap: '', requireApproval: true };
      if (!Array.isArray(saved.whatsappDrafts)) saved.whatsappDrafts = [];
      saved.settings ||= defaultSettings();
      if (!saved.demoOccurrenceExamplesAdded) {
        const examples = makeCRMExamples();
        const clientIds = new Set(saved.clients.map((item) => item.id));
        saved.clients.push(...examples.clients.filter((item) => item.demo && !clientIds.has(item.id)));
        const occurrenceIds = new Set(saved.occurrences.map((item) => item.id));
        saved.occurrences.push(...examples.occurrences.filter((item) => !occurrenceIds.has(item.id)));
        saved.demoOccurrenceExamplesAdded = true;
      }
      saved.clientVisits.forEach((visit) => {
        if (!Array.isArray(visit.paymentIds)) visit.paymentIds = visit.transactionId ? [visit.transactionId] : [];
        const legacyReceipt = saved.transactions.find((item) => item.id === visit.transactionId);
        visit.paymentIds.forEach((paymentId) => {
          const receipt = saved.transactions.find((item) => item.id === paymentId);
          if (receipt) { receipt.clientId ||= visit.clientId; receipt.sourceVisitId ||= visit.id; receipt.grossAmount ??= Number(receipt.value || 0); receipt.fees ??= 0; receipt.paymentMethod ||= visit.paymentMethod || 'pix'; receipt.installments ||= visit.installments || 1; }
        });
        visit.chargedTotal ??= Number(legacyReceipt?.value || 0);
        visit.paymentMethod ||= legacyReceipt?.paymentMethod || 'pix';
        visit.installments ||= legacyReceipt?.installments || 1;
        visit.adminNotes ??= '';
        visit.paymentStatus ||= Number(legacyReceipt?.value || 0) >= Number(visit.chargedTotal || 0) && visit.chargedTotal ? 'pago' : Number(legacyReceipt?.value || 0) > 0 ? 'parcialmente-pago' : 'pendente';
      });
      const demoVisitIds = new Set(saved.clientVisits.filter((visit) => visit.demo).map((visit) => visit.id));
      saved.transactions.forEach((item) => {
        if (demoVisitIds.has(item.sourceVisitId) || /demonstrativ|fict[ií]ci/i.test(item.description || '')) item.demo = true;
      });
      if (saved.demoOccurrenceExamplesAdded) localStorage.setItem(storageKey, JSON.stringify(saved));
      return saved;
    }
  } catch (error) { console.warn('Dados locais de demonstração inválidos; serão recriados.', error); }
  return makeInitialData();
}
let data = loadData();
function defaultSettings() {
  return { businessName: 'Tami', taxRegime: 'nao-confirmado', hourlyRoomCost: 120, defaultDuration: 1, roomBillingMode: 'proporcional', procedures: [
    { id: 'botox', name: 'Botox', materialCost: '', materials: '' },
    { id: 'preenchimento', name: 'Preenchimento', materialCost: '', materials: '' },
    { id: 'luz-pulsada', name: 'Luz pulsada', materialCost: '', materials: '' },
    { id: 'outro', name: 'Outro', materialCost: '', materials: '' }
  ] };
}
data.settings ||= defaultSettings();
data.whatsappSettings ||= { monthlyMessageCap: '', monthlyAiCap: '', requireApproval: true };
data.whatsappDrafts ||= [];
if (data.settings.hourlyRoomCost === '' || data.settings.hourlyRoomCost == null) data.settings.hourlyRoomCost = 120;
if (data.settings.defaultDuration === '' || data.settings.defaultDuration == null) data.settings.defaultDuration = 1;
data.settings.roomBillingMode ||= 'proporcional';
const demoClientNames = new Map([
  ['crm-demo-client-01', 'Maria'],
  ['crm-demo-client-02', 'João'],
  ['crm-demo-client-03', 'Ana'],
  ['crm-demo-client-04', 'Camila'],
  ['crm-demo-client-05', 'Pedro']
]);
data.clients.forEach((client) => {
  if (client.demo && demoClientNames.has(client.id)) client.name = demoClientNames.get(client.id);
});
// A conversa existe apenas durante esta sessão e nunca fica no armazenamento local.
data.chat = [];
if (!data.identity) data.identity = JSON.parse(JSON.stringify(defaultIdentity));
data.identity = normalizeIdentity(data.identity);
if (!data.identityLogoMigrationDone) {
  if (!data.identity.logo) data.identity.logo = defaultIdentity.logo;
  data.identityLogoMigrationDone = true;
}
const toast = document.querySelector('#toast');
let toastTimer;
let activePage = pageNames[location.hash.slice(1)] ? location.hash.slice(1) : 'inicio';
let routeStack = [activePage];
let routeCursor = 0;
let activeDraftId = null;
let activeSlideIndex = 0;
let identityWorking = JSON.parse(JSON.stringify(data.identity));
let strategyFlow = null;
let crmActiveClientId = null;
let crmRankPeriod = 'all';
let crmSearchTerm = '';
let crmStatusFilter = 'todos';
let crmCurrentTab = 'clientes';
let agendaWeekOffset = 0;
let agendaSelectedDate = localDate();
let chatSuggestionsDismissed = false;
let submittingSuggestedQuestion = false;
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const money = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const parseMoney = (value) => {
  const raw = String(value ?? '').trim().replace(/R\$\s?/gi, '').replace(/\s/g, '');
  if (!raw || !/^(\d{1,3}(\.\d{3})*|\d+)?(,\d{0,2})?$/.test(raw)) return NaN;
  return Number(raw.replace(/\./g, '').replace(',', '.'));
};
const moneyInput = (value) => Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const roomCharge = (ratePerHour, durationMinutes, mode = data.settings.roomBillingMode) => {
  const hours = Number(durationMinutes) / 60;
  const billableHours = mode === 'hora-cheia' ? Math.ceil(hours) : hours;
  return Math.round(Number(ratePerHour) * billableHours * 100) / 100;
};
const formatDuration = (minutes) => {
  const total = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(total / 60); const remainder = total % 60;
  if (hours && remainder) return `${hours} h ${remainder} min`;
  if (hours) return `${hours} h`;
  return `${remainder} min`;
};
const receivedForVisit = (visit) => data.transactions.filter((item) => item.type === 'receita' && item.status !== 'Cancelado' && (item.sourceVisitId === visit.id || (Array.isArray(visit.paymentIds) && visit.paymentIds.includes(item.id)))).reduce((sum, item) => sum + Number(item.value || 0), 0);
const displayDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : '—';
const save = () => {
  try { localStorage.setItem(storageKey, JSON.stringify({ ...data, chat: [] })); updateCounts(); return true; }
  catch (error) { showToast('Não foi possível salvar neste navegador. Verifique o espaço disponível.'); return false; }
};
function updateCounts() {
  const drafts = document.querySelector('#draft-count');
  const pending = document.querySelector('#pending-count');
  const summary = document.querySelector('#approval-summary-count');
  if (drafts) drafts.textContent = data.drafts.length;
  const pendingTotal = data.approvals.filter((item) => item.status === 'Pendente').length;
  if (pending) pending.textContent = pendingTotal;
  if (summary) summary.textContent = String(pendingTotal).padStart(2, '0');
}
function showToast(message, kind = 'success') {
  toast.textContent = message;
  toast.dataset.kind = kind;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}
function updateHistoryButtons() {
  document.querySelector('#nav-back').disabled = routeCursor === 0;
  document.querySelector('#nav-forward').disabled = routeCursor >= routeStack.length - 1;
}
function setPage(page, updateHash = true) {
  const name = pageNames[page] ? page : 'inicio';
  if (updateHash && name !== activePage) {
    routeStack = routeStack.slice(0, routeCursor + 1);
    routeStack.push(name);
    routeCursor = routeStack.length - 1;
    history.pushState({ appPage: name }, '', `#${name}`);
  }
  if (name === 'marketing') activeDraftId = null;
  activePage = name;
  document.querySelectorAll('.nav-item[data-page], .settings-top[data-page]').forEach((item) => {
    const selected = item.dataset.page === name;
    item.classList.toggle('active', selected);
    if (selected) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  document.querySelector('#breadcrumb-current').textContent = pageNames[name];
  document.querySelector('#page-title').innerHTML = `${pageCopy[name][0]} <span class="wave">✳</span>`;
  document.querySelector('#page-subtitle').textContent = pageCopy[name][1];
  document.querySelector('#sidebar').classList.remove('open');
  const primary = document.querySelector('#page-primary-action');
  if (name === 'marketing') {
    primary.hidden = false; primary.dataset.action = 'new-strategist'; primary.removeAttribute('data-format');
    primary.innerHTML = '<span>✦</span> Planejar marketing';
  } else if (name === 'inicio' || name === 'agenda') {
    primary.hidden = false; primary.dataset.action = 'new-appointment'; primary.removeAttribute('data-format');
    primary.innerHTML = '<span>＋</span> Novo agendamento';
  } else primary.hidden = true;
  const overview = name === 'inicio';
  document.querySelector('#overview-view').hidden = !overview;
  const view = document.querySelector('#workspace-view');
  view.hidden = overview;
  if (!overview) renderPage(name);
  else document.querySelector('#home-agent-scaffold').innerHTML = renderAgentScaffold('inicio');
  updateHistoryButtons();
}
function renderAgentScaffold(page) {
  const agent = window.EsteticaAgentPlan?.[page];
  if (!agent) return '';
  const list = (items) => items.map((item) => `<span class="agent-chip">${escapeHTML(item)}</span>`).join('');
  return `<section class="panel agent-scaffold"><div class="agent-scaffold-top"><span class="agent-scaffold-symbol" aria-hidden="true">${escapeHTML(agent.symbol)}</span><div class="agent-scaffold-title"><p class="eyebrow">${escapeHTML(agent.area)}</p><h2>${escapeHTML(agent.name)}</h2><p>${escapeHTML(agent.purpose)}</p></div><span class="agent-scaffold-status">ESTRUTURA PLANEJADA</span></div><div class="agent-scaffold-grid"><div class="agent-scaffold-block"><span>O QUE FUNCIONA AGORA</span><p>${escapeHTML(agent.current)}</p></div><div class="agent-scaffold-block"><span>ESCOPO DO AGENTE</span><div class="agent-chip-list">${list(agent.scopes)}</div></div><div class="agent-scaffold-block agent-scaffold-integrations"><span>INTEGRAÇÕES FUTURAS · DESATIVADAS</span><div class="agent-chip-list">${list(agent.integrations)}</div></div></div><div class="agent-scaffold-footer"><span>LOCAL · SEM CUSTO ADICIONAL NESTA VERSÃO</span><small>Nenhum agente externo ou serviço pago está conectado.</small></div></section>`;
}
function renderPage(page) {
  const view = document.querySelector('#workspace-view');
  if (page === 'secretaria') view.innerHTML = renderChat();
  if (page === 'marketing') {
    if (activeDraftId) {
      view.innerHTML = renderMarketing();
      const strategicDraft = data.drafts.find((item) => item.id === activeDraftId);
      if (strategicDraft?.strategy) {
        view.querySelector('.design-editor')?.insertAdjacentHTML('afterbegin', renderStrategistEditorBrief(strategicDraft));
        view.querySelector('.editor-fields')?.insertAdjacentHTML('beforeend', renderStrategistSlideFields(strategicDraft.slides[activeSlideIndex]));
        view.querySelector('.caption-fields')?.insertAdjacentHTML('beforeend', renderStrategistMetaFields(strategicDraft));
        updateArtPreview();
      }
    }
    else if (strategyFlow) view.innerHTML = renderStrategistFlow();
    else {
      view.innerHTML = renderMarketing();
      view.querySelector('.studio-home')?.insertAdjacentHTML('afterbegin', renderStrategistEntry());
    }
  }
  if (page === 'crm') view.innerHTML = renderCRM();
  if (page === 'identidade') view.innerHTML = renderIdentity();
  if (page === 'agenda') view.innerHTML = renderAgenda();
  if (page === 'aprovacoes') view.innerHTML = renderApprovals();
  if (page === 'whatsapp') view.innerHTML = renderWhatsApp();
  if (page === 'financeiro') view.innerHTML = renderFinance();
  if (page === 'juridico') view.innerHTML = renderJudicialAgent();
  if (page === 'configuracoes') view.innerHTML = renderSettings();
  const agentScaffold = renderAgentScaffold(page);
  if (agentScaffold && page === 'agenda' && view.querySelector('.agenda-google-panel')) view.querySelector('.agenda-google-panel').insertAdjacentHTML('beforebegin', agentScaffold);
  else if (agentScaffold) view.insertAdjacentHTML('beforeend', agentScaffold);
}
function renderWhatsApp() {
  const drafts = [...data.whatsappDrafts].reverse();
  const cards = drafts.length ? drafts.map((draft) => `<article class="whatsapp-draft"><div class="whatsapp-draft-head"><span class="whatsapp-category">${escapeHTML(draft.category)}</span><span class="whatsapp-status">${escapeHTML(draft.status)}</span></div><p>${escapeHTML(draft.body)}</p><small>${new Date(draft.createdAt).toLocaleString('pt-BR')}</small>${draft.status === 'Aguardando aprovação da Tami' ? `<div class="whatsapp-actions"><button class="secondary-button" type="button" data-action="whatsapp-approve" data-id="${escapeHTML(draft.id)}">Marcar revisado</button><button class="secondary-button" type="button" data-action="whatsapp-adjust" data-id="${escapeHTML(draft.id)}">Pedir ajuste</button></div>` : ''}</article>`).join('') : '<div class="empty-state"><strong>Nenhum rascunho ainda</strong><p>Salve uma resposta de exemplo para ver como funciona a revisão.</p></div>';
  return `<div class="whatsapp-page"><section class="whatsapp-hero"><div><p class="eyebrow">CANAIS · ESTRUTURA FUTURA</p><h2>WhatsApp da Tami</h2><p>Prepare respostas com calma. Esta tela não se conecta ao WhatsApp nem envia mensagens.</p></div><div class="whatsapp-state"><span>NÃO CONECTADO</span><span>IA DESATIVADA</span><span>ENVIO BLOQUEADO</span></div></section><div class="notice-box whatsapp-notice"><strong>Aprovação da Tami sempre obrigatória.</strong> “Marcar revisado” só muda o status deste rascunho salvo no navegador; não envia nada. Não há integração, IA externa ou cobrança criada por esta tela.</div><div class="whatsapp-grid"><section class="panel"><div class="panel-heading"><div><p class="eyebrow">RASCUNHO LOCAL</p><h2>Preparar uma resposta</h2></div></div><form id="whatsapp-draft-form" class="whatsapp-form"><label for="whatsapp-category">Assunto</label><select id="whatsapp-category" name="category"><option>Agendamento</option><option>Informação administrativa</option><option>Retorno</option></select><label for="whatsapp-body">Mensagem sem dados de cliente</label><textarea id="whatsapp-body" name="body" rows="4" maxlength="1000" placeholder="Escreva um exemplo genérico para revisar…" required></textarea><button class="primary-button" type="submit">Salvar para revisão</button><p class="form-hint">Não inclua nomes, telefones, dados de saúde ou informações de pacientes.</p></form></section><section class="panel"><div class="panel-heading"><div><p class="eyebrow">CONTROLE DE CUSTOS</p><h2>Limites para planejar</h2></div></div><form id="whatsapp-guardrails-form" class="whatsapp-form"><label for="whatsapp-message-cap">Orçamento mensal para mensagens (R$)</label><input id="whatsapp-message-cap" name="monthlyMessageCap" inputmode="decimal" placeholder="Deixe vazio se ainda não decidiu" value="${escapeHTML(data.whatsappSettings.monthlyMessageCap)}"><label for="whatsapp-ai-cap">Orçamento mensal para IA (R$)</label><input id="whatsapp-ai-cap" name="monthlyAiCap" inputmode="decimal" placeholder="Deixe vazio se ainda não decidiu" value="${escapeHTML(data.whatsappSettings.monthlyAiCap)}"><button class="secondary-button" type="submit">Salvar planejamento</button><p class="form-hint">São anotações locais. Ainda não bloqueiam cobranças; isso só será possível quando houver integração e limite real configurados.</p></form></section></div><section class="panel"><div class="panel-heading"><div><p class="eyebrow">FILA DE REVISÃO</p><h2>Respostas preparadas</h2></div><span class="whatsapp-status">${drafts.length} ${drafts.length === 1 ? 'rascunho' : 'rascunhos'}</span></div><div class="whatsapp-drafts">${cards}</div></section><section class="panel whatsapp-safety"><div class="panel-heading"><div><p class="eyebrow">QUANDO FOR CONECTAR</p><h2>Regras simples para evitar surpresa</h2></div></div><ul><li>Peça e registre autorização explícita antes de falar com alguém pelo WhatsApp.</li><li>Mensagens iniciadas pela empresa podem exigir modelos aprovados pela Meta; as respostas dependem da janela de atendimento.</li><li>Meta e fornecedor de IA podem cobrar separadamente. O preço depende do tipo e destino da mensagem; não conte com respostas gratuitas como garantia.</li><li>Perguntas clínicas, queixas ou situações delicadas devem ser encaminhadas à Tami para resposta humana.</li></ul><p><a href="https://whatsappbusiness.com/products/platform-pricing/" target="_blank" rel="noopener noreferrer">Consultar preços oficiais da Meta ↗</a> · <a href="https://business.whatsapp.com/policy/preview?lang=pt_BR" target="_blank" rel="noopener noreferrer">Política oficial de mensagens ↗</a></p></section></div>`;
}
function renderJudicialAgent(result = null) {
  const contextHtml = result?.context ? `<div class="judicial-user-summary"><strong>Resumo para sua consulta</strong><p>${escapeHTML(result.context)}</p></div>` : '';
  const resultHtml = result ? `<section class="judicial-result panel" aria-live="polite"><div class="panel-heading"><div><p class="eyebrow">ROTEIRO INICIAL · ${escapeHTML(result.categoryLabel)}</p><h2>${escapeHTML(result.title)}</h2></div><span class="judicial-result-icon">✓</span></div>${contextHtml}<p class="judicial-summary">${escapeHTML(result.summary)}</p><div class="judicial-columns"><div><h3>Separe para análise</h3><ul>${result.documents.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul></div><div><h3>Próximos passos</h3><ul>${result.steps.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul></div></div><div class="judicial-caution"><strong>Atenção ao prazo e à estratégia.</strong> Se recebeu intimação, notificação formal ou há risco imediato, confira o prazo no documento original e procure advogado habilitado na área. Este roteiro não avalia o mérito nem define uma defesa.</div><button class="secondary-button" type="button" data-action="judicial-clear">Organizar outra situação</button></section>` : '';
  return `<div class="judicial-page"><section class="judicial-hero"><div><p class="eyebrow">BIOMEDICINA ESTÉTICA · APOIO JURÍDICO</p><h2>Entenda o cenário. Organize os documentos. Prepare a conversa com seu advogado.</h2><p>Um roteiro inicial para questões profissionais, éticas, sanitárias e judiciais da atuação em estética avançada.</p></div><span class="judicial-mark">§</span></section><div class="notice-box judicial-notice"><strong>Protótipo demonstrativo:</strong> as respostas são roteiros locais e gerais, não são parecer jurídico nem análise de legislação por IA. Não informe nomes, dados de pacientes, números de processo ou documentos sigilosos.</div><section class="panel judicial-intake"><div class="panel-heading"><div><p class="eyebrow">ORGANIZADOR DE CASOS</p><h2>O que você precisa organizar?</h2></div><span class="ai-tag">LOCAL · SEM ENVIO</span></div><form id="judicial-intake-form" class="judicial-form"><label for="judicial-category">Tipo de situação</label><select id="judicial-category" name="category" required><option value="">Selecione uma opção</option><option value="ethical">Conselho profissional ou processo ético</option><option value="complaint">Reclamação, dano ou notificação extrajudicial</option><option value="records">Consentimento, prontuário ou privacidade</option><option value="advertising">Publicidade profissional e redes sociais</option><option value="sanitary">Fiscalização sanitária ou regularização do espaço</option><option value="contract">Contrato, parceria ou prestação de serviços</option><option value="other">Outra questão judicial ou regulatória</option></select><label for="judicial-context">Resumo sem dados identificáveis <small>Opcional · não inclua nomes, contatos, dados de saúde ou número de processo</small></label><textarea id="judicial-context" name="context" rows="4" maxlength="700" placeholder="Ex.: recebi uma solicitação formal do conselho e preciso organizar os documentos e os prazos."></textarea><div class="judicial-form-footer"><p>O resumo fica somente nesta tela: não é salvo nem enviado a um serviço externo.</p><button class="primary-button" type="submit"><span>✦</span> Montar roteiro</button></div></form></section>${resultHtml}<section class="judicial-resources"><div class="judicial-section-heading"><div><p class="eyebrow">CONSULTA DIRETA</p><h2>Fontes oficiais para conferir</h2></div><p>Confira atualizações e regras do seu CRBM antes de tomar decisões.</p></div><div class="judicial-source-grid"><a class="panel judicial-source" href="https://cfbm.gov.br/resolucoes-cfbm/" target="_blank" rel="noopener noreferrer"><span>CFBM</span><strong>Resoluções do Conselho Federal de Biomedicina</strong><small>Ver legislação profissional ↗</small></a><a class="panel judicial-source" href="https://cfbm.gov.br/duvidas-frequentes/" target="_blank" rel="noopener noreferrer"><span>CFBM</span><strong>Dúvidas frequentes sobre habilitação e atuação</strong><small>Consultar orientações ↗</small></a><a class="panel judicial-source" href="https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/servicosdesaude/notas-tecnicas/notas-tecnicas-vigentes/nota-tecnica-no-2-2024-sei-ggtes-dire3-anvisa-esclarecimentos-sobre-os-servicos-de-estetica-e-atendimento-as-normas-sanitarias-aplicaveis-a-esses-servicos" target="_blank" rel="noopener noreferrer"><span>ANVISA</span><strong>Nota Técnica 2/2024 sobre serviços de estética</strong><small>Ver orientação sanitária ↗</small></a><a class="panel judicial-source" href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer"><span>LEGISLAÇÃO FEDERAL</span><strong>Lei Geral de Proteção de Dados (LGPD)</strong><small>Ler texto oficial ↗</small></a></div></section><p class="judicial-disclaimer">Informação geral para organização. Regras podem mudar e também dependem do CRBM, da Vigilância Sanitária local e dos fatos concretos. Procure orientação jurídica individual antes de responder a notificações ou adotar uma estratégia.</p></div>`;
}
function renderChat() {
  const messages = data.chat.map((item) => `<div class="chat-message ${item.from === 'you' ? 'from-you' : 'from-assistant'}"><small>${item.from === 'you' ? 'Você' : 'Secretária demonstrativa'} · ${escapeHTML(item.time)}</small><p>${escapeHTML(item.text)}</p></div>`).join('');
  const suggestedQuestions = [
    'Quais são meus próximos compromissos?',
    'Como está o financeiro do meu espaço?',
    'Há algo aguardando aprovação?',
    'Quais conteúdos estão salvos em Marketing?'
  ];
  const welcome = `<div class="chat-welcome"><div class="chat-empty">Olá, Tami! Posso ajudar com o sistema. Toque em uma pergunta para começar:</div><div class="chat-suggestions">${suggestedQuestions.map((question) => `<button type="button" data-action="chat-prompt" data-prompt="${escapeHTML(question)}"><span>✦</span>${escapeHTML(question)}</button>`).join('')}</div></div>`;
  const suggestions = chatSuggestionsDismissed ? '' : `<div class="chat-suggestion-panel">${welcome}</div>`;
  const emptyHistory = chatSuggestionsDismissed ? '<div class="chat-empty">Escreva uma pergunta para continuar a conversa.</div>' : '';
  return `<section class="panel module-panel"><div class="panel-heading"><div><p class="eyebrow">CONVERSA LOCAL</p><h2>Secretária virtual</h2></div><span class="ai-tag">LOCAL</span></div><div class="notice-box">Respostas gratuitas por regras locais. Não há IA generativa, WhatsApp ou serviço externo conectado. A conversa fica disponível nesta sessão e é apagada ao atualizar a página.</div>${suggestions}<div class="chat-log" id="chat-log">${messages || emptyHistory}</div><form class="inline-form chat-form" id="chat-form"><label class="sr-only" for="chat-input">Sua mensagem</label><input id="chat-input" name="message" maxlength="500" placeholder="Pergunte sobre agenda, marketing ou financeiro…" required><button class="primary-button">Enviar <span>→</span></button></form><div class="secretary-voice-plan"><button class="secondary-button" type="button" disabled aria-describedby="voice-future-note">🎙 Falar com a secretária · futuro</button><small id="voice-future-note">Opção de voz planejada e desligada. Antes de ativar qualquer API, vamos conferir o custo e configurar limites.</small></div><p class="form-hint">Use apenas dados fictícios. Não informe dados de pacientes ou clientes.</p></section>`;
}
const artFormats = [
  { key: 'post', label: 'Post único', size: '1080 × 1350', icon: '▣' },
  { key: 'carousel', label: 'Carrossel', size: '1080 × 1350', icon: '▤' },
  { key: 'reel', label: 'Capa de Reels', size: '1080 × 1920', icon: '▶' },
  { key: 'story', label: 'Stories', size: '1080 × 1920', icon: '▯' }
];
const contentKinds = [
  { key: 'educativo', label: 'Conteúdo educativo' }, { key: 'servicos', label: 'Apresentação de serviços' },
  { key: 'faq', label: 'Dúvidas frequentes' }, { key: 'bastidores', label: 'Bastidores' }, { key: 'campanha', label: 'Campanha' }
];
function normalizeDraft(draft) {
  if (!draft.format) draft.format = draft.type === 'Ideia de Reels' ? 'reel' : 'post';
  if (!draft.category) draft.category = 'educativo';
  if (!draft.caption) draft.caption = draft.body || '';
  if (!draft.hashtags) draft.hashtags = '#autocuidado #esteticacomresponsabilidade';
  if (!Array.isArray(draft.slides) || !draft.slides.length) draft.slides = [{
    title: draft.title || 'Seu título aqui', subtitle: 'Informação clara, cuidado consciente', body: draft.body || 'Escreva uma mensagem acolhedora e informativa para sua comunidade.',
    bg: '#f3eee4', textColor: '#172b43', accent: '#b6975a', font: 'serif', align: 'left', image: ''
  }];
  if (!draft.brand) draft.brand = { colors: { primary: draft.slides[0].textColor || '#172b43', secondary: draft.slides[0].bg || '#f3eee4', background: draft.slides[0].bg || '#f3eee4', text: draft.slides[0].textColor || '#393b3e', highlight: draft.slides[0].accent || '#b6975a' }, titleFont: draft.slides[0].font || 'serif', bodyFont: 'sans', logo: '' };
  draft.slides.forEach((slide) => {
    if (!slide.primary) slide.primary = draft.brand.colors.primary;
    if (!slide.secondary) slide.secondary = draft.brand.colors.secondary;
    if (!slide.bodyFont) slide.bodyFont = draft.brand.bodyFont;
  });
  return draft;
}
function newDesignDraft(format = 'post', category = 'educativo', topic = '') {
  const kind = contentKinds.find((entry) => entry.key === category) || contentKinds[0];
  const title = topic.trim() || ({ educativo: 'Um cuidado de cada vez', servicos: 'Conheça meu trabalho', faq: 'Vamos conversar?', bastidores: 'Um pouco dos bastidores', campanha: 'Uma pausa para você' }[kind.key]);
  const subtitle = ({ educativo: 'Informação também é cuidado', servicos: 'Atendimento com escuta e responsabilidade', faq: 'Uma dúvida comum merece uma boa conversa', bastidores: 'O cuidado mora nos detalhes', campanha: 'Seu momento começa com uma escolha' }[kind.key]);
  const body = ({ educativo: 'Neste conteúdo, vamos falar sobre o tema com clareza, responsabilidade e sem promessas de resultado.', servicos: 'Apresente o serviço, explique como funciona a conversa inicial e convide a pessoa a tirar dúvidas.', faq: 'Explique a dúvida em linguagem simples e lembre que cada caso precisa de avaliação profissional.', bastidores: 'Mostre detalhes do espaço, preparação dos materiais e organização da rotina — sem imagens de pacientes.', campanha: 'Uma oportunidade para conhecer o espaço e conversar sobre possibilidades com tranquilidade.' }[kind.key]);
  const brand = JSON.parse(JSON.stringify(normalizeIdentity(data.identity)));
  const draft = normalizeDraft({ id: crypto.randomUUID(), title, type: kind.label, format, category, brand, body, caption: `${title}. Informação acolhedora, individualidade e cuidado responsável.`, hashtags: '#biomedicinaestetica #autocuidado #informacaocomresponsabilidade', updatedAt: new Date().toISOString(), slides: [{ title, subtitle, body, bg: brand.colors.background, textColor: brand.colors.text, primary: brand.colors.primary, secondary: brand.colors.secondary, accent: brand.colors.highlight, font: brand.titleFont, bodyFont: brand.bodyFont, align: 'left', image: '' }] });
  if (format === 'carousel') draft.slides.push({ title: 'O que vale saber', subtitle: 'Cada pessoa tem uma história', body: 'Use este slide para apresentar informações gerais e acolhedoras, sem indicar resultados garantidos.', bg: brand.colors.secondary, textColor: brand.colors.text, primary: brand.colors.primary, secondary: brand.colors.background, accent: brand.colors.highlight, font: brand.titleFont, bodyFont: brand.bodyFont, align: 'left', image: '' }, { title: 'Converse com profissional', subtitle: 'Dúvidas merecem escuta', body: 'Convide sua comunidade a buscar orientação individual e esclarecer dúvidas com responsabilidade.', bg: brand.colors.primary, textColor: brand.colors.background, primary: brand.colors.background, secondary: brand.colors.secondary, accent: brand.colors.highlight, font: brand.titleFont, bodyFont: brand.bodyFont, align: 'left', image: '' });
  data.drafts.unshift(draft);
  activeDraftId = draft.id;
  activeSlideIndex = 0;
  save();
  pushEditorHistory(draft.id);
  renderPage('marketing');
  showToast('Novo modelo criado. Edite o conteúdo e salve seu rascunho.');
}
function pushEditorHistory(id) {
  if (history.state?.editorId === id) return;
  routeStack = routeStack.slice(0, routeCursor + 1);
  routeStack.push('marketing');
  routeCursor = routeStack.length - 1;
  history.pushState({ appPage: 'marketing', editorId: id }, '', '#marketing');
  updateHistoryButtons();
}
function renderMarketing() {
  if (activeDraftId) {
    const draft = data.drafts.find((item) => item.id === activeDraftId);
    if (draft) return renderDesignEditor(normalizeDraft(draft));
    activeDraftId = null;
  }
  return `<section class="studio-home"><div class="studio-intro"><div><p class="eyebrow">ESTÚDIO VISUAL · MODELOS EDITÁVEIS</p><h2>Uma ideia bonita começa com uma boa conversa.</h2><p>Monte artes originais para sua comunicação. Os modelos são estruturas de conteúdo, não recomendações clínicas.</p></div><span class="studio-mark">T<span>✦</span></span></div><div class="notice-box">Demonstração local. Nada será publicado. Use imagens próprias ou licenciadas; não use fotos de pacientes sem autorização.</div><h3 class="studio-section-title">Escolha um formato</h3><div class="template-gallery">${artFormats.map((format) => `<button class="template-card" data-action="new-design" data-format="${format.key}" data-kind="educativo"><span class="template-art ${format.key}"><i>${format.icon}</i><b>ESTÉTICA<br>COM CUIDADO</b><small>${format.label.toUpperCase()}</small></span><strong>${format.label}</strong><small>${format.size} px</small></button>`).join('')}</div><div class="studio-columns"><section class="studio-idea panel"><p class="eyebrow">SUGESTÃO DE ESTRUTURA</p><h3>Comece por um tema</h3><p>Gera uma estrutura local com título, pontos e convite — sem IA conectada.</p><form id="theme-form" class="theme-form"><label class="sr-only" for="theme-input">Tema do conteúdo</label><input id="theme-input" name="theme" maxlength="100" required placeholder="Ex.: cuidados antes de uma avaliação"><select name="format" aria-label="Formato"><option value="carousel">Carrossel</option><option value="post">Post único</option><option value="reel">Capa de Reels</option><option value="story">Stories</option></select><select name="kind" aria-label="Tipo de conteúdo">${contentKinds.map((kind) => `<option value="${kind.key}">${kind.label}</option>`).join('')}</select><button class="secondary-button">Montar estrutura</button></form></section><section class="studio-kinds panel"><p class="eyebrow">PAUTAS PARA SUA ROTINA</p><h3>Modelos de conteúdo</h3><div class="kind-chips">${contentKinds.map((kind) => `<button class="kind-chip" data-action="new-design" data-format="post" data-kind="${kind.key}">${kind.label}</button>`).join('')}</div></section></div><div class="studio-drafts-heading"><div><p class="eyebrow">SEUS TRABALHOS</p><h3>Rascunhos salvos <span>${data.drafts.length}</span></h3></div><span class="record-date">Salvos somente neste navegador</span></div>${data.drafts.length ? `<div class="draft-gallery">${data.drafts.map((raw) => { const draft = normalizeDraft(raw); const format = artFormats.find((item) => item.key === draft.format) || artFormats[0]; return `<article class="saved-design"><button class="saved-design-preview" data-action="open-design" data-id="${draft.id}" aria-label="Continuar editando ${escapeHTML(draft.title)}"><span class="mini-art" style="--mini-bg:${safeColor(draft.slides[0].bg, '#f3eee4')};--mini-fg:${safeColor(draft.slides[0].textColor, '#172b43')}"><b>${escapeHTML(draft.slides[0].title)}</b><small>${escapeHTML(draft.slides[0].subtitle)}</small></span></button><span class="type-label">${format.label} · ${escapeHTML(draft.type)}</span><h4>${escapeHTML(draft.title)}</h4><div class="record-actions"><button class="secondary-button" data-action="open-design" data-id="${draft.id}">Continuar editando</button><button class="secondary-button danger" data-action="delete-draft" data-id="${draft.id}">Excluir</button></div></article>`; }).join('')}</div>` : '<div class="empty-state"><strong>Seus rascunhos aparecerão aqui</strong><p>Escolha um formato acima para começar.</p></div>'}</section>`;
}
function renderStrategistEntry() {
  const savedPlans = (data.strategyPlans || []).map((plan) => `<article class="strategy-saved-card"><span class="type-label">${escapeHTML(plan.strategy?.name || 'Estratégia')}</span><h4>${escapeHTML(plan.context?.topic || plan.title)}</h4><p>${escapeHTML(plan.sourceLabel || 'Rascunho estratégico local')} · ${escapeHTML(plan.status || 'Salvo')}</p><div class="record-actions"><button class="secondary-button" data-action="resume-strategy" data-id="${plan.id}">${plan.editorDraftId ? 'Continuar no editor' : 'Continuar estratégia'}</button><button class="secondary-button danger" data-action="delete-strategy-plan" data-id="${plan.id}">Excluir</button></div></article>`).join('');
  return `<section class="strategist-launch"><div class="strategist-launch-copy"><span class="strategist-spark">✦</span><div><p class="eyebrow">PLANEJAMENTO DE CONTEÚDO · MODO DEMONSTRATIVO</p><h2>Planejar marketing</h2><p>Comece com um assunto. Compare estratégias e leve a publicação completa para o Estúdio Visual.</p></div></div><button class="primary-button" data-action="new-strategist">✦ Criar planejamento</button><div class="strategist-local-note"><span class="demo-badge"><i></i> SUGESTÕES LOCAIS</span><span>Não há IA conectada. Nada será publicado automaticamente.</span></div>${savedPlans ? `<div class="strategy-saved-list"><div class="strategy-saved-heading"><strong>Planejamentos salvos</strong><small>${(data.strategyPlans || []).length} no navegador</small></div><div class="strategy-saved-grid">${savedPlans}</div></div>` : ''}</section>`;
}
function renderStrategistFlow() {
  const flow = strategyFlow;
  if (!flow) return renderMarketing();
  const engine = window.EsteticaMarketingEngine;
  if (!engine) return `<section class="panel module-panel"><h2>Planejador indisponível</h2><p>O módulo local de estratégias não foi carregado. Atualize a página e tente novamente.</p><button class="secondary-button" data-action="exit-strategist">Voltar ao Estúdio</button></section>`;
  if (flow.step === 'input') return `<section class="strategist-flow panel"><div class="strategist-flow-heading"><button class="secondary-button" data-action="exit-strategist">← Estúdio de Marketing</button><span class="step-label">ETAPA 1 DE 4 · ASSUNTO</span></div><div class="strategist-heading"><p class="eyebrow">ESTRATEGISTA DE CONTEÚDO</p><h2>Qual assunto você quer abordar?</h2><p>O assunto é suficiente. Público, objetivo e formato são opcionais.</p></div><div class="notice-box strategist-demo-banner"><strong>Modo demonstração local.</strong> Não existe conexão com um modelo de IA nesta versão. As estratégias são estruturas editoriais revisáveis, não aconselhamento clínico.</div><form id="strategy-input-form" class="strategy-form"><label class="strategy-topic-field">Assunto<input name="topic" maxlength="100" required minlength="2" placeholder="Ex.: Botox" autocomplete="off"></label><div class="strategy-input-grid"><label>Público (opcional)<input name="audience" maxlength="100" placeholder="Ex.: pessoas que estão conhecendo o tema"></label><label>Objetivo comercial (opcional)<select name="goal"><option value="educacao">Educação e confiança</option><option value="alcance">Descoberta e alcance</option><option value="engajamento">Engajamento e conversa</option><option value="conversao">Contato ou avaliação</option><option value="oferta">Divulgar uma oferta autorizada</option></select></label><label>Estágio do público (opcional)<select name="stage"><option value="descobrindo">Conhecendo o assunto</option><option value="acompanha">Já acompanha o espaço</option><option value="considerando">Considera conversar ou agendar</option></select></label><label>Formato desejado (opcional)<select name="format"><option value="auto">Recomendado pela estratégia</option><option value="post">Post único</option><option value="carousel">Carrossel</option><option value="reel">Capa de Reels</option><option value="story">Stories</option></select></label><label>Cadência para calendário (opcional)<select name="period"><option value="semanal">Uma semana</option><option value="mensal">Um mês</option></select></label></div><details class="offer-details"><summary>Informar condição comercial (opcional)</summary><label>Condição informada e autorizada pela profissional<textarea name="authorizedOffer" rows="2" maxlength="240" placeholder="Só informe uma condição aprovada. Sem isso, não será inventado preço ou desconto."></textarea></label><label class="authorization-check"><input type="checkbox" name="offerAuthorized" value="yes">Confirmo que a condição foi informada e autorizada para divulgação.</label></details><div class="strategy-form-footer"><p id="strategy-loading" role="status">Nenhum dado será enviado. Os exemplos são montados no navegador.</p><button class="primary-button" type="submit"><span>✦</span> Ver estratégias</button></div></form></section>`;
  if (flow.step === 'strategies') return `<section class="strategist-flow"><div class="strategist-flow-heading"><button class="secondary-button" data-action="strategy-back-input">← Alterar assunto</button><span class="step-label">ETAPA 2 DE 4 · ESTRATÉGIA</span></div><div class="strategist-heading"><p class="eyebrow">ASSUNTO: ${escapeHTML(flow.input.topic)}</p><h2>Escolha o ângulo da publicação</h2><p>Recomendamos <strong>${escapeHTML(flow.recommendations.find((item) => item.recommended)?.name || 'uma estratégia')}</strong> conforme o objetivo e o estágio de público selecionados. Você pode escolher outra opção.</p></div><div class="notice-box strategist-demo-banner">${escapeHTML(flow.sourceLabel)}. A recomendação organiza possibilidades; não prevê alcance, vendas nem resultado clínico.</div><div class="strategy-cards">${flow.recommendations.map((item) => `<article class="strategy-option ${item.recommended ? 'recommended' : ''}"><div class="strategy-option-top"><span class="strategy-category">${escapeHTML(item.name)}</span>${item.recommended ? '<span class="recommended-label">✦ RECOMENDADA</span>' : ''}</div><h3>${escapeHTML(item.title)}</h3><dl><div><dt>Público-alvo</dt><dd>${escapeHTML(item.audience)}</dd></div><div><dt>Objetivo</dt><dd>${escapeHTML(item.objective)}</dd></div><div><dt>Formato recomendado</dt><dd>${escapeHTML(item.formatName)}</dd></div></dl><p>${escapeHTML(item.justification)}</p>${item.id === 'oferta' && !flow.input.authorizedOffer ? '<small class="offer-warning">Nenhuma condição foi informada; o modelo não criará preço ou desconto.</small>' : ''}<button class="${item.recommended ? 'primary-button' : 'secondary-button'}" data-action="choose-strategy" data-strategy="${item.id}">Escolher esta estratégia</button></article>`).join('')}</div></section>`;
  const plan = (data.strategyPlans || []).find((item) => item.id === flow.planId);
  if (!plan) { strategyFlow = { ...flow, step: 'input' }; return renderStrategistFlow(); }
  return renderStrategistPublication(plan);
}
function renderStrategistPublication(plan) {
  return `<section class="strategist-flow"><div class="strategist-flow-heading"><button class="secondary-button" data-action="strategy-back-options">← Estratégias</button><span class="step-label">ETAPA 3 DE 4 · CRIAÇÃO</span></div><div class="strategist-heading"><p class="eyebrow">${escapeHTML(plan.strategy.name)} · ${escapeHTML(plan.context.topic)}</p><h2>Publicação pronta para revisar</h2><p>Edite cada sugestão. Regenere só o elemento que quiser manter o restante intacto.</p></div><div class="notice-box strategist-demo-banner">${escapeHTML(plan.sourceLabel)}. Conteúdo de marketing, sem fatos clínicos gerados ou alegações de resultado. A revisão profissional é necessária antes de qualquer uso.</div><div class="publication-brief panel"><div><span class="eyebrow">CONCEITO CRIATIVO</span><p>${escapeHTML(plan.concept)}</p></div><div><span class="eyebrow">DIREÇÃO VISUAL DA SUA MARCA</span><p>${escapeHTML(plan.visualDirections)}</p></div><div class="brief-regenerate"><span class="eyebrow">TÍTULO PRINCIPAL</span><h3>${escapeHTML(plan.title)}</h3><button class="secondary-button" data-action="regenerate-plan-title">↻ Regenerar só o título</button></div></div><div class="generated-slides"><div class="generated-heading"><h3>${plan.slides.length > 1 ? `Texto dos slides (${plan.slides.length})` : 'Texto da publicação'}</h3><span>Textos editáveis no Estúdio Visual</span></div>${plan.slides.map((slide, index) => `<article class="generated-slide"><div class="generated-slide-title"><span>SLIDE ${String(index + 1).padStart(2, '0')}</span><button class="secondary-button" data-action="regenerate-plan-slide" data-index="${index}">↻ Regenerar só este slide</button></div><h4>${escapeHTML(slide.title)}</h4><strong>${escapeHTML(slide.subtitle)}</strong><p>${escapeHTML(slide.body)}</p><div class="generated-meta"><span><b>Composição:</b> ${escapeHTML(slide.composition)}</span><span><b>Texto alternativo:</b> ${escapeHTML(slide.altText)}</span></div></article>`).join('')}</div><section class="publication-copy panel"><div class="generated-heading"><h3>Legenda completa</h3><button class="secondary-button" data-action="regenerate-plan-caption">↻ Regenerar só a legenda</button></div><p>${escapeHTML(plan.caption)}</p><div class="copy-meta"><span><b>Chamada para ação:</b> ${escapeHTML(plan.cta)}</span><span><b>Hashtags moderadas:</b> ${escapeHTML(plan.hashtags)}</span></div></section><section class="publication-visuals panel"><h3>Capa e elementos gráficos</h3><p><b>Capa:</b> ${escapeHTML(plan.coverSuggestion)}</p><p><b>Elementos:</b> ${escapeHTML(plan.graphicElements)}</p></section>${plan.sequence?.length ? `<section class="publication-sequence panel"><h3>Sequência ${plan.context.period === 'mensal' ? 'mensal' : 'semanal'} sugerida</h3><ol>${plan.sequence.map((entry) => `<li>${escapeHTML(entry)}</li>`).join('')}</ol><small>Cadência editorial proposta; não é previsão de desempenho.</small></section>` : ''}<div class="strategy-next-step"><span class="step-label">ETAPA 4 DE 4 · EDITOR E REVISÃO</span><div><button class="secondary-button" data-action="save-strategy-plan">Salvar planejamento</button><button class="primary-button" data-action="transfer-strategy-to-editor">Abrir e editar no Estúdio Visual →</button></div></div></section>`;
}
function saveStrategistPlan(plan) {
  const index = (data.strategyPlans || []).findIndex((item) => item.id === plan.id);
  if (index < 0) data.strategyPlans.unshift(plan);
  else data.strategyPlans[index] = plan;
  data.strategyPlans.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  return save();
}
function chooseStrategistPlan(strategyId) {
  if (!strategyFlow?.input) return showToast('Volte e informe um assunto primeiro.', 'error');
  const engine = window.EsteticaMarketingEngine;
  const generated = engine.buildPublication(strategyFlow.input, strategyId, JSON.parse(JSON.stringify(data.identity)));
  const existing = strategyFlow.planId && data.strategyPlans.find((item) => item.id === strategyFlow.planId);
  const plan = {
    ...generated,
    id: existing?.id || crypto.randomUUID(),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: existing?.status || 'Planejamento salvo',
    editorDraftId: existing?.editorDraftId || '',
    approvalItemId: existing?.approvalItemId || ''
  };
  strategyFlow = { ...strategyFlow, planId: plan.id, step: 'content' };
  saveStrategistPlan(plan);
  renderPage('marketing');
  showToast('Estratégia local criada e salva como rascunho.');
}
function updateStrategistPlan(transform, message) {
  const plan = data.strategyPlans.find((item) => item.id === strategyFlow?.planId);
  if (!plan) return showToast('Este planejamento não está disponível.', 'error');
  const updated = transform(plan);
  updated.updatedAt = new Date().toISOString();
  saveStrategistPlan(updated);
  renderPage('marketing');
  showToast(message);
}
function transferStrategistPlanToEditor() {
  const plan = data.strategyPlans.find((item) => item.id === strategyFlow?.planId);
  if (!plan) return showToast('Salve uma estratégia antes de abrir o editor.', 'error');
  const existing = data.drafts.find((item) => item.id === plan.editorDraftId);
  strategyFlow = null;
  if (existing) {
    activeDraftId = existing.id;
    activeSlideIndex = 0;
    pushEditorHistory(existing.id);
    renderPage('marketing');
    showToast('Abrimos o rascunho existente para preservar suas edições.');
    return;
  }
  const identity = JSON.parse(JSON.stringify(plan.identity || data.identity));
  const format = plan.context.format || 'carousel';
  const draft = normalizeDraft({
    id: crypto.randomUUID(), title: plan.title, type: plan.strategy.name, category: plan.strategy.id, format,
    brand: identity, slides: plan.slides.map((slide) => ({ ...slide })),
    caption: plan.caption, hashtags: plan.hashtags, body: plan.slides.map((slide) => slide.body).join('\n\n'),
    cta: plan.cta, concept: plan.concept, coverSuggestion: plan.coverSuggestion,
    graphicElements: plan.graphicElements, visualDirections: plan.visualDirections,
    sequence: plan.sequence, strategy: plan.strategy, strategyContext: plan.context,
    context: plan.context, identity: { ...identity, logo: '' },
    revisions: plan.revisions, sourceLabel: plan.sourceLabel, strategyPlanId: plan.id,
    requiresProfessionalReview: true, approvalItemId: '', updatedAt: new Date().toISOString()
  });
  data.drafts.unshift(draft);
  plan.editorDraftId = draft.id;
  plan.status = 'No Estúdio Visual';
  plan.updatedAt = new Date().toISOString();
  if (!save()) { data.drafts.shift(); plan.editorDraftId = ''; return; }
  activeDraftId = draft.id;
  activeSlideIndex = 0;
  pushEditorHistory(draft.id);
  renderPage('marketing');
  showToast('Publicação transferida. Revise o conteúdo e solicite aprovação profissional antes de usar.');
}
function safeColor(value, fallback) { return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback; }
function normalizeIdentity(value) {
  const colors = value?.colors || {};
  const fonts = ['serif', 'sans', 'classic'];
  return {
    colors: {
      primary: safeColor(colors.primary, defaultIdentity.colors.primary),
      secondary: safeColor(colors.secondary, defaultIdentity.colors.secondary),
      background: safeColor(colors.background, defaultIdentity.colors.background),
      text: safeColor(colors.text, defaultIdentity.colors.text),
      highlight: safeColor(colors.highlight, defaultIdentity.colors.highlight)
    },
    titleFont: fonts.includes(value?.titleFont) ? value.titleFont : defaultIdentity.titleFont,
    bodyFont: fonts.includes(value?.bodyFont) ? value.bodyFont : defaultIdentity.bodyFont,
    logo: typeof value?.logo === 'string' && (value.logo === 'assets/monograma-tc.png' || /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value.logo)) ? value.logo : ''
  };
}
function brandStyle(identity) {
  const colors = identity.colors;
  return `--brand-primary:${safeColor(colors.primary, defaultIdentity.colors.primary)};--brand-secondary:${safeColor(colors.secondary, defaultIdentity.colors.secondary)};--brand-background:${safeColor(colors.background, defaultIdentity.colors.background)};--brand-text:${safeColor(colors.text, defaultIdentity.colors.text)};--brand-highlight:${safeColor(colors.highlight, defaultIdentity.colors.highlight)}`;
}
function renderIdentity() {
  identityWorking = normalizeIdentity(identityWorking || data.identity);
  const identity = identityWorking;
  const fontOptions = [{ key: 'serif', label: 'Editorial — Georgia' }, { key: 'sans', label: 'Moderna — DM Sans' }, { key: 'classic', label: 'Clássica — Manrope' }];
  const colorFields = [
    ['primary', 'Principal'], ['secondary', 'Secundária'], ['background', 'Fundo'], ['text', 'Texto'], ['highlight', 'Destaque']
  ];
  const fontSelect = (key, label, value) => `<label>${label}<select data-identity-field="${key}">${fontOptions.map((font) => `<option value="${font.key}" ${value === font.key ? 'selected' : ''}>${font.label}</option>`).join('')}</select></label>`;
  return `<section class="identity-page"><div class="identity-intro"><div><p class="eyebrow">MARCA · CONFIGURAÇÃO LOCAL</p><h2>Uma identidade que parece sua.</h2><p>Ajuste a paleta, as fontes e o logotipo. As mudanças salvas serão usadas em novos modelos de marketing.</p></div><span class="identity-seal">e<span>✦</span></span></div><div class="notice-box identity-notice">Sua marca e seu logotipo ficam neste navegador. As artes antigas não são alteradas automaticamente.</div><div class="identity-workspace"><section class="panel identity-controls"><div class="panel-heading"><div><p class="eyebrow">SISTEMA VISUAL</p><h2>Personalize sua marca</h2></div><span class="identity-local-tag">SALVO LOCALMENTE</span></div><div class="identity-color-grid">${colorFields.map(([key, label]) => `<label class="identity-color-field"><span>${label}</span><span class="color-input-wrap"><input type="color" data-identity-field="color-${key}" value="${identity.colors[key]}"><code>${identity.colors[key].toUpperCase()}</code></span></label>`).join('')}</div><div class="identity-font-grid">${fontSelect('titleFont', 'Fonte dos títulos', identity.titleFont)}${fontSelect('bodyFont', 'Fonte dos textos', identity.bodyFont)}</div><div class="identity-logo-box"><div><strong>Logotipo da marca</strong><p>PNG, JPG ou WebP · até 400 KB</p></div>${identity.logo ? `<img class="identity-logo-thumb" src="${escapeHTML(identity.logo)}" alt="Logotipo carregado">` : '<span class="logo-empty">LOGO</span>'}<label class="logo-upload-button">${identity.logo ? 'Trocar arquivo' : 'Carregar logotipo'}<input type="file" data-identity-field="logo-file" accept="image/png,image/jpeg,image/webp"></label>${identity.logo ? '<button class="secondary-button danger" data-action="identity-remove-logo">Remover</button>' : ''}<small>O arquivo fica no armazenamento local do navegador; o espaço é limitado e compartilhado com os rascunhos.</small></div><div class="identity-actions"><button class="secondary-button" data-action="identity-restore">Restaurar padrão</button><button class="secondary-button" data-action="identity-preview">Visualizar alterações</button><button class="primary-button" data-action="identity-save">Salvar identidade</button></div><p class="identity-feedback" id="identity-feedback">Prévia mostra as configurações salvas.</p></section><section class="panel identity-preview-panel"><div class="panel-heading"><div><p class="eyebrow">APLICAÇÃO DA MARCA</p><h2>Pré-visualização</h2></div><span class="type-label">ARTE DEMONSTRATIVA</span></div><div class="identity-preview-stack title-${identity.titleFont} body-${identity.bodyFont}" id="identity-preview" style="${brandStyle(identity)}"><article class="identity-post"><div class="identity-post-top"><span class="identity-logo-slot">${identity.logo ? `<img src="${escapeHTML(identity.logo)}" alt="Logotipo">` : 'TAMI'}</span><span class="identity-post-mark">✦</span></div><div class="identity-post-copy"><small>INFORMAÇÃO & CUIDADO</small><h3>O cuidado começa<br>com uma boa conversa.</h3><p>Conteúdo educativo feito com escuta, clareza e responsabilidade.</p></div><div class="identity-post-bottom"><span>ESTÉTICA · BEM-ESTAR</span><i></i></div></article><article class="identity-carousel"><div class="identity-carousel-side"><span>02 / 03</span><div class="carousel-line"></div><strong>Informação<br>também é<br>acolhimento.</strong><small>CADA HISTÓRIA É ÚNICA</small></div><div class="carousel-brand">${identity.logo ? `<img src="${escapeHTML(identity.logo)}" alt="Logotipo">` : 'TAMI'}<span>✦</span></div></article></div><p class="preview-caption">Exemplos originais de um post e um slide de carrossel.</p></section></div></section>`;
}
function updateIdentityPreviews() {
  const container = document.querySelector('#identity-preview');
  const feedback = document.querySelector('#identity-feedback');
  if (!container) return;
  container.className = `identity-preview-stack title-${identityWorking.titleFont} body-${identityWorking.bodyFont}`;
  container.setAttribute('style', brandStyle(identityWorking));
  container.querySelectorAll('.identity-logo-slot,.carousel-brand').forEach((slot) => {
    if (identityWorking.logo) slot.innerHTML = `<img src="${escapeHTML(identityWorking.logo)}" alt="Logotipo">${slot.classList.contains('carousel-brand') ? '<span>✦</span>' : ''}`;
    else slot.textContent = slot.classList.contains('carousel-brand') ? 'TAMI ✦' : 'TAMI';
  });
  if (feedback) feedback.textContent = 'Prévia atualizada. Salve para aplicar aos novos modelos.';
}
function renderDesignEditor(draft) {
  const slide = draft.slides[Math.min(activeSlideIndex, draft.slides.length - 1)];
  activeSlideIndex = Math.min(activeSlideIndex, draft.slides.length - 1);
  const format = artFormats.find((item) => item.key === draft.format) || artFormats[0];
  return `<section class="design-editor"><div class="editor-toolbar"><button class="secondary-button" data-action="back-to-gallery">← Galeria</button><div><span class="type-label">${format.label} · ${format.size} px</span><span class="saved-indicator" id="saved-indicator">Rascunho salvo</span></div><div class="toolbar-actions"><button class="secondary-button" data-action="save-design">Salvar</button><button class="primary-button" data-action="export-png">↓ Exportar PNG</button></div></div><div class="editor-grid"><section class="editor-panel panel"><div class="editor-panel-heading"><div><p class="eyebrow">CONTEÚDO DA ARTE</p><h3>Slide ${activeSlideIndex + 1} de ${draft.slides.length}</h3></div><span class="record-date">${escapeHTML(draft.type)}</span></div><div class="slide-manager">${draft.slides.map((entry, index) => `<button class="slide-thumb ${index === activeSlideIndex ? 'selected' : ''}" data-action="select-slide" data-index="${index}" aria-label="Selecionar slide ${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHTML(entry.title || 'Slide sem título')}</b></button>`).join('')}<button class="slide-add" data-action="add-slide">＋ Adicionar slide</button></div><div class="slide-tools"><button class="secondary-button" data-action="move-slide" data-direction="up" ${activeSlideIndex === 0 ? 'disabled' : ''}>↑ Mover</button><button class="secondary-button" data-action="move-slide" data-direction="down" ${activeSlideIndex === draft.slides.length - 1 ? 'disabled' : ''}>↓ Mover</button><button class="secondary-button" data-action="duplicate-slide">Duplicar</button><button class="secondary-button danger" data-action="delete-slide" ${draft.slides.length <= 1 ? 'disabled title="O modelo precisa manter ao menos um slide"' : ''}>Excluir</button></div><div class="editor-fields"><label>Título<input data-editor-field="title" maxlength="80" value="${escapeHTML(slide.title)}"></label><label>Subtítulo<input data-editor-field="subtitle" maxlength="100" value="${escapeHTML(slide.subtitle)}"></label><label>Texto da arte<textarea data-editor-field="body" rows="4" maxlength="700">${escapeHTML(slide.body)}</textarea></label><div class="field-pair"><label>Fundo<input data-editor-field="bg" type="color" value="${safeColor(slide.bg, '#f3eee4')}"></label><label>Texto<input data-editor-field="textColor" type="color" value="${safeColor(slide.textColor, '#172b43')}"></label><label>Detalhe<input data-editor-field="accent" type="color" value="${safeColor(slide.accent, '#b6975a')}"></label></div><div class="field-pair"><label>Fonte do título<select data-editor-field="font"><option value="serif" ${slide.font === 'serif' ? 'selected' : ''}>Editorial</option><option value="sans" ${slide.font === 'sans' ? 'selected' : ''}>Sem serifa</option><option value="classic" ${slide.font === 'classic' ? 'selected' : ''}>Clássica</option></select></label><label>Fonte do texto<select data-editor-field="bodyFont"><option value="sans" ${slide.bodyFont === 'sans' ? 'selected' : ''}>Moderna</option><option value="serif" ${slide.bodyFont === 'serif' ? 'selected' : ''}>Editorial</option><option value="classic" ${slide.bodyFont === 'classic' ? 'selected' : ''}>Clássica</option></select></label><label>Alinhamento<select data-editor-field="align"><option value="left" ${slide.align === 'left' ? 'selected' : ''}>Esquerda</option><option value="center" ${slide.align === 'center' ? 'selected' : ''}>Centro</option><option value="right" ${slide.align === 'right' ? 'selected' : ''}>Direita</option></select></label></div><label>Imagem da arte<input data-editor-field="image-file" type="file" accept="image/png,image/jpeg,image/webp"><small>Imagem local de até 1 MB. Use fotos próprias ou com autorização.</small></label>${slide.image ? '<button class="secondary-button" data-action="remove-image">Remover imagem</button>' : ''}</div></section><section class="preview-panel"><div class="preview-heading"><div><p class="eyebrow">PRÉ-VISUALIZAÇÃO</p><h3>Arte ${activeSlideIndex + 1}</h3></div><span>Atualiza enquanto você edita</span></div><div class="preview-stage"><div id="art-preview" class="art-preview format-${draft.format}" style="--art-bg:${safeColor(slide.bg, '#f3eee4')};--art-text:${safeColor(slide.textColor, '#172b43')};--art-primary:${safeColor(slide.primary, '#172b43')};--art-secondary:${safeColor(slide.secondary, '#d9cdb9')};--art-accent:${safeColor(slide.accent, '#b6975a')};--art-align:${slide.align};--art-image:${slide.image ? `url('${slide.image}')` : 'none'}"><div class="art-image ${slide.image ? 'has-image' : ''}"></div><div class="art-decoration"></div><div class="art-copy font-${slide.font} body-${slide.bodyFont}"><span class="art-kicker">ESTÉTICA · INFORMAÇÃO & CUIDADO</span><h2 id="preview-title">${escapeHTML(slide.title)}</h2><h3 id="preview-subtitle">${escapeHTML(slide.subtitle)}</h3><p id="preview-body">${escapeHTML(slide.body)}</p><span class="art-signature">${draft.brand.logo ? `<img src="${draft.brand.logo}" alt="Logotipo">` : 'TAMI'} <i>✦</i></span></div></div></div><div class="caption-fields"><label>Legenda (separada da arte)<textarea data-editor-field="caption" rows="3" maxlength="2000">${escapeHTML(draft.caption)}</textarea></label><label>Hashtags editáveis<input data-editor-field="hashtags" maxlength="300" value="${escapeHTML(draft.hashtags)}"></label></div></section></div><div class="notice-box editor-safety-note">Estrutura demonstrativa de conteúdo. Revise informações profissionais antes de usar. Não inclua promessas de resultado nem dados de pacientes.</div></section>`;
}
function renderStrategistEditorBrief(draft) {
  return `<section class="strategist-editor-brief panel"><div class="editor-brief-heading"><div><span class="step-label">ETAPA 4 DE 4 · EDITOR E REVISÃO</span><h3>${escapeHTML(draft.strategy.name)} · ${escapeHTML(draft.strategyContext.topic)}</h3><p>${escapeHTML(draft.sourceLabel || 'Sugestão demonstrativa local')}</p></div><span class="review-required">REVISÃO PROFISSIONAL NECESSÁRIA</span></div><p class="brief-concept">${escapeHTML(draft.concept)}</p><div class="editor-regen-actions"><button class="secondary-button" data-action="regenerate-editor-title">↻ Regenerar título</button><button class="secondary-button" data-action="regenerate-editor-slide" data-index="${activeSlideIndex}">↻ Regenerar slide atual</button><button class="secondary-button" data-action="regenerate-editor-caption">↻ Regenerar legenda</button><button class="primary-button" data-action="submit-to-approval">Enviar para aprovação profissional</button></div><small>Este botão envia o rascunho somente à Central de Aprovações local. Não publica, não envia mensagens e não conecta contas.</small></section>`;
}
function renderStrategistSlideFields(slide) {
  return `<label>Composição visual sugerida<textarea data-editor-field="composition" rows="3" maxlength="600">${escapeHTML(slide.composition || '')}</textarea></label><label>Texto alternativo acessível<textarea data-editor-field="altText" rows="2" maxlength="400">${escapeHTML(slide.altText || '')}</textarea></label>`;
}
function renderStrategistMetaFields(draft) {
  return `<label>Chamada para ação (CTA)<textarea data-editor-field="cta" rows="2" maxlength="400">${escapeHTML(draft.cta || '')}</textarea></label><label>Conceito criativo<textarea data-editor-field="concept" rows="2" maxlength="500">${escapeHTML(draft.concept || '')}</textarea></label><label>Sugestão de capa<textarea data-editor-field="coverSuggestion" rows="2" maxlength="400">${escapeHTML(draft.coverSuggestion || '')}</textarea></label><label>Elementos gráficos sugeridos<textarea data-editor-field="graphicElements" rows="2" maxlength="400">${escapeHTML(draft.graphicElements || '')}</textarea></label><label>Direção visual baseada na marca<textarea data-editor-field="visualDirections" rows="2" maxlength="400">${escapeHTML(draft.visualDirections || '')}</textarea></label>${draft.sequence?.length ? `<div class="editor-sequence"><strong>Sequência editorial complementar</strong><ol>${draft.sequence.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ol><small>Ideias de cadência, sem previsão de desempenho.</small></div>` : ''}`;
}
function updateArtPreview() {
  const draft = data.drafts.find((item) => item.id === activeDraftId);
  if (!draft) return;
  const slide = draft.slides[activeSlideIndex];
  const preview = document.querySelector('#art-preview');
  if (!preview || !slide) return;
  preview.style.setProperty('--art-bg', safeColor(slide.bg, '#f3eee4'));
  preview.style.setProperty('--art-text', safeColor(slide.textColor, '#172b43'));
  preview.style.setProperty('--art-primary', safeColor(slide.primary, '#172b43'));
  preview.style.setProperty('--art-secondary', safeColor(slide.secondary, '#d9cdb9'));
  preview.style.setProperty('--art-accent', safeColor(slide.accent, '#b6975a'));
  preview.style.setProperty('--art-align', slide.align);
  preview.style.setProperty('--art-image', slide.image ? `url("${slide.image}")` : 'none');
  preview.querySelector('.art-image').classList.toggle('has-image', Boolean(slide.image));
  preview.querySelector('.art-copy').className = `art-copy font-${slide.font} body-${slide.bodyFont}`;
  preview.setAttribute('aria-label', slide.altText || slide.title);
  preview.querySelector('#preview-title').textContent = slide.title;
  preview.querySelector('#preview-subtitle').textContent = slide.subtitle;
  preview.querySelector('#preview-body').textContent = slide.body;
}
function renderCRMReturn(item) {
  const overdue = item.daysUntil < 0;
  const today = item.daysUntil === 0;
  const urgency = overdue ? 'overdue' : today ? 'today' : 'upcoming';
  const label = overdue ? `Vencido há ${Math.abs(item.daysUntil)} dia(s)` : today ? 'Previsto para hoje' : `Em ${item.daysUntil} dia(s)`;
  const source = item.source === 'estimated'
    ? `Estimativa pela média de ${item.averageDays} dias entre atendimentos`
    : 'Data informada manualmente';
  return `<article class="crm-return-row ${overdue ? 'is-overdue' : ''}"><div class="crm-return-main"><span class="crm-return-icon" aria-hidden="true">↻</span><div class="crm-return-copy"><strong>${escapeHTML(item.client.name)}</strong><span class="crm-return-date">${displayDate(item.date)}</span><div class="crm-return-meta"><span class="crm-return-status ${urgency}">${label}</span><span class="crm-return-source ${item.source === 'estimated' ? 'crm-estimated' : 'crm-manual'}">${source}</span></div></div></div><div class="crm-return-actions"><button class="secondary-button" data-action="open-crm-client" data-id="${item.client.id}">Abrir ficha</button><button class="secondary-button" data-action="prepare-return-message" data-id="${item.client.id}">Preparar mensagem</button></div></article>`;
}

function renderCRM() {
  const tabs = `<div class="crm-tabs" role="tablist"><button class="${crmCurrentTab === 'clientes' ? 'selected' : ''}" data-action="crm-clients-tab">Clientes e indicadores</button><button class="${crmCurrentTab === 'ocorrencias' ? 'selected' : ''}" data-action="crm-occurrences-tab">Ocorrências e pendências <span>${data.occurrences.filter((item) => item.status !== 'Resolvida').length}</span></button></div>`;
  if (crmCurrentTab === 'ocorrencias') return `${tabs}${renderCRMOccurrences()}`;
  const client = data.clients.find((item) => item.id === crmActiveClientId);
  if (client) return `${tabs}${renderCRMProfile(client)}`;
  return `${tabs}${renderCRMOverview()}`;
}
function renderCRMOverview() {
  const clients = data.clients || [];
  const visits = data.clientVisits || [];
  const summary = window.CrmLocal.summary({ clients, visits, transactions: data.transactions, today: localDate() });
  const activeLabel = `${summary.active} ativos`;
  const oldestLabel = summary.oldest ? `${escapeHTML(summary.oldest.name)} · desde ${displayDate(summary.oldest.firstVisit)}` : 'Sem cadastros ainda';
  const paymentByClient = new Map();
  summary.payments.forEach((payment) => paymentByClient.set(payment.clientId, (paymentByClient.get(payment.clientId) || 0) + Number(payment.value || 0)));
  const chargedByClient = new Map();
  visits.forEach((visit) => chargedByClient.set(visit.clientId, (chargedByClient.get(visit.clientId) || 0) + Number(visit.chargedTotal || 0)));
  const visitsByClient = new Map();
  visits.forEach((visit) => visitsByClient.set(visit.clientId, (visitsByClient.get(visit.clientId) || 0) + 1));
  const list = clients.length ? clients.map((client) => {
    const forecast = window.CrmLocal.forecast(client, visits);
    const returnText = forecast.date ? `${displayDate(forecast.date)}${forecast.source === 'estimated' ? ' · estimada' : ' · manual'}` : 'Sem previsão';
    const search = `${client.name} ${client.contact || ''}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
    const active = visits.some((visit) => visit.clientId === client.id && visit.date >= offsetDate(-365) && visit.date <= localDate());
    return `<tr class="crm-client-row" data-search="${escapeHTML(search)}" data-status="${active ? 'ativo' : 'inativo'}"><td><button class="crm-name-button" data-action="open-crm-client" data-id="${client.id}">${escapeHTML(client.name)}</button>${client.demo ? '<small class="crm-demo-label">Demonstração</small>' : ''}</td><td>${displayDate(client.firstVisit)}</td><td>${visitsByClient.get(client.id) || 0}</td><td><small>Cobrado</small> ${money(chargedByClient.get(client.id) || 0)}<small>Recebido</small> ${money(paymentByClient.get(client.id) || 0)}</td><td>${escapeHTML(returnText)}</td><td><button class="secondary-button" data-action="open-crm-client" data-id="${client.id}">Abrir ficha</button></td></tr>`;
  }).join('') : '';
  const returns = summary.returns;
  const overdueReturns = returns.filter((item) => item.daysUntil < 0).length;
  return `<section class="crm-page"><div class="crm-heading"><div><p class="eyebrow">RELACIONAMENTO · DADOS LOCAIS</p><h2>Clientes e Relacionamento</h2><p>Fichas, atendimentos, pagamentos associados e retornos para acompanhar.</p></div><button class="primary-button" data-action="new-crm-client">＋ Cadastrar cliente</button></div><div class="notice-box crm-privacy-note"><strong>Demonstração local · dados fictícios identificados.</strong> Os registros de exemplo são sintéticos. Este protótipo não tem login nem controle de acesso por usuário; qualquer pessoa com acesso a este navegador pode ver os dados locais. Registre apenas informações necessárias e autorizadas. Não inclua detalhes clínicos.</div><div class="crm-metrics"><article class="crm-metric"><span>Total cadastrados</span><strong>${summary.total}</strong><small>Inclui registros demonstrativos claramente marcados</small></article><article class="crm-metric"><span>Ativos</span><strong>${activeLabel}</strong><small>Definição: atendimento registrado nos últimos 12 meses</small></article><article class="crm-metric"><span>Novos neste mês</span><strong>${summary.newThisMonth}</strong><small>Pela data do primeiro atendimento</small></article><article class="crm-metric"><span>Total cobrado</span><strong>${money(summary.charged)}</strong><small>Valor informado nos atendimentos</small></article><article class="crm-metric"><span>Total recebido</span><strong>${money(summary.revenue)}</strong><small>Recebimentos efetivos ativos no Financeiro</small></article><article class="crm-metric crm-oldest"><span>Mais tempo na base</span><strong>${oldestLabel}</strong><small>Ordenado pelo primeiro atendimento</small></article><article class="crm-metric"><span>Retornos próximos ou vencidos</span><strong>${returns.length}</strong><small>Manual ou estimado · revise antes de entrar em contato</small></article></div><div class="crm-columns"><section class="panel crm-panel"><div class="panel-heading"><div><p class="eyebrow">BASE LOCAL</p><h3>Clientes</h3></div><span class="record-date">${clients.length} registro(s)</span></div><div class="crm-filters"><label class="crm-search-label">Pesquisar<input id="crm-search" type="search" value="${escapeHTML(crmSearchTerm)}" placeholder="Nome ou contato"></label><label>Situação<select id="crm-status-filter"><option value="todos" ${crmStatusFilter === 'todos' ? 'selected' : ''}>Todos</option><option value="ativo" ${crmStatusFilter === 'ativo' ? 'selected' : ''}>Ativos</option><option value="inativo" ${crmStatusFilter === 'inativo' ? 'selected' : ''}>Sem atendimento no último ano</option></select></label></div>${list ? `<div class="table-wrap crm-table-wrap"><table class="crm-table"><thead><tr><th>Nome</th><th>Primeiro atendimento</th><th>Atendimentos</th><th>Cobrado / recebido</th><th>Próximo retorno</th><th></th></tr></thead><tbody>${list}</tbody></table></div>` : '<div class="empty-state"><strong>Nenhum cliente cadastrado</strong><p>Cadastre apenas dados necessários e autorizados. Use nomes fictícios para testar.</p><button class="primary-button" data-action="new-crm-client">＋ Cadastrar primeiro cliente</button></div>'}</section><section class="panel crm-panel crm-return-panel"><div class="panel-heading"><div><p class="eyebrow">ACOMPANHAMENTO</p><h3>Retornos</h3></div>${returns.length ? `<span class="crm-return-summary"><span><strong>${overdueReturns}</strong> vencido(s)</span><i></i><span><strong>${returns.length - overdueReturns}</strong> próximos</span></span>` : '<span class="crm-return-summary is-clear">Sem pendências</span>'}</div>${returns.length ? `<div class="crm-return-list">${returns.map(renderCRMReturn).join('')}</div>` : '<div class="empty-state compact"><strong>Nenhum retorno próximo</strong><p>Previsões aparecem aqui quando vencidas ou nos próximos 30 dias.</p></div>'}</section></div>${renderCRMRankings()}`;
}
function renderCRMRankings() {
  const rankings = window.CrmLocal.rankings({ clients: data.clients, visits: data.clientVisits, transactions: data.transactions, period: crmRankPeriod, today: localDate() });
  const periodOptions = [['all', 'Todo o histórico'], ['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias'], ['365', 'Últimos 12 meses']].map(([value, label]) => `<option value="${value}" ${crmRankPeriod === value ? 'selected' : ''}>${label}</option>`).join('');
  const rankPalette = {
    spending: { accent: '#b8cadb', wash: '#293039', track: '#586b7d' },
    received: { accent: '#b8cfb9', wash: '#2b332c', track: '#607762' },
    tenure: { accent: '#d7c39d', wash: '#353127', track: '#857247' },
    attendance: { accent: '#cabbdf', wash: '#312d37', track: '#75628f' },
    frequency: { accent: '#acd0cb', wash: '#283433', track: '#4f7b75' },
    occurrences: { accent: '#e1a69d', wash: '#372c2b', track: '#9b5e58' }
  };
  const titleTones = { 'Maior valor cobrado': 'spending', 'Maior valor recebido': 'received', 'Mais tempo na base': 'tenure', 'Mais atendimentos': 'attendance', 'Maior frequência de retorno': 'frequency' };
  const rankList = (title, criterion, items, value, score, icon, tone = '') => {
    const rankTone = tone || titleTones[title] || 'occurrences';
    const palette = rankPalette[rankTone];
    const topScore = Math.max(0, ...items.slice(0, 5).map(score));
    const rows = items.slice(0, 5).map((item, index) => {
      const ratio = topScore > 0 ? Math.round((score(item) / topScore) * 100) : 0;
      const priority = rankTone === 'occurrences' ? score(item) >= 3 ? 'priority-high' : score(item) >= 2 ? 'priority-medium' : 'priority-low' : '';
      return `<li class="crm-rank-item ${index === 0 ? 'is-leader' : ''} ${priority}"><div class="crm-rank-row"><span class="crm-rank-position">${String(index + 1).padStart(2, '0')}</span><span class="crm-rank-client"><span class="crm-rank-name">${escapeHTML(item.client.name)}</span>${item.client.demo ? '<small class="crm-rank-demo">EXEMPLO FICTÍCIO</small>' : ''}</span><strong>${escapeHTML(value(item))}</strong></div><div class="crm-rank-track" role="img" aria-label="${ratio}% do valor do primeiro lugar"><span style="width:${ratio}%"></span></div></li>`;
    }).join('');
    const action = rankTone === 'occurrences' ? '<button class="secondary-button crm-rank-open" data-action="crm-occurrences-tab">Ver ocorrências</button>' : '';
    return `<article class="panel crm-rank-card crm-rank-tone-${rankTone} ${rankTone === 'occurrences' ? 'crm-occurrence-ranking' : ''}" style="--rank-accent:${palette.accent};--rank-wash:${palette.wash};--rank-track:${palette.track}"><div class="crm-rank-card-heading"><span class="crm-rank-icon" aria-hidden="true">${icon}</span><div><h4>${title}</h4><small>${criterion}</small></div></div>${items.length ? `<ol>${rows}</ol>` : '<div class="empty-state compact"><p>Nenhuma ocorrência pendente para acompanhar.</p></div>'}${action}</article>`;
  };
  const tenure = [...rankings.tenure].sort((a, b) => a.client.firstVisit.localeCompare(b.client.firstVisit));
  const oldestLabel = (item) => `${displayDate(item.client.firstVisit)} · ${Math.max(0, Math.floor((new Date(`${localDate()}T12:00:00`) - new Date(`${item.client.firstVisit}T12:00:00`)) / 86400000))} dias`;
  const daysInBase = (item) => Math.max(0, Math.floor((new Date(`${localDate()}T12:00:00`) - new Date(`${item.client.firstVisit}T12:00:00`)) / 86400000));
  const openByClient = new Map();
  data.occurrences.filter((record) => record.clientId && record.status !== 'Resolvida').forEach((record) => openByClient.set(record.clientId, [...(openByClient.get(record.clientId) || []), record]));
  const occurrenceRanking = [...openByClient.entries()].map(([clientId, records]) => ({ client: data.clients.find((item) => item.id === clientId), count: records.length, latestDate: records.map((record) => record.date).sort().at(-1) })).filter((item) => item.client).sort((a, b) => b.count - a.count || b.latestDate.localeCompare(a.latestDate));
  return `<section class="crm-rankings"><div class="crm-section-heading"><div><p class="eyebrow">VISÃO DA BASE</p><h3>Rankings de relacionamento</h3><p>Compare os principais indicadores do período selecionado.</p></div><label>Período<select id="crm-rank-period">${periodOptions}</select></label></div><div class="crm-rank-grid">${rankList('Maior valor cobrado', 'Total cobrado no período', rankings.spending, (item) => money(item.charged), (item) => item.charged, 'R$')}${rankList('Maior valor recebido', 'Pagamentos registrados no período', rankings.received, (item) => money(item.received), (item) => item.received, '↗')}${rankList('Mais tempo na base', 'Clientes com atendimento no período', tenure, oldestLabel, daysInBase, '◷')}${rankList('Mais atendimentos', 'Históricos registrados no período', rankings.attendance, (item) => `${item.visits} atendimento(s)`, (item) => item.visits, '＋')}${rankList('Maior frequência de retorno', 'Média de atendimentos por mês · mínimo de dois registros', rankings.frequency, (item) => `${item.monthlyFrequency.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}/mês`, (item) => item.monthlyFrequency, '↻')}${rankList('Acompanhamento prioritário', 'Quantidade de ocorrências administrativas ainda pendentes', occurrenceRanking, (item) => `${item.count} ${item.count === 1 ? 'pendência' : 'pendências'}`, (item) => item.count, '!', 'occurrences')}</div><p class="crm-method-note">As barras comparam cada pessoa ao primeiro lugar do mesmo ranking. O acompanhamento prioritário conta apenas ocorrências em aberto e serve para organizar providências; não é uma avaliação do cliente.</p></section>`;
}
function renderCRMProfile(client) {
  const visits = data.clientVisits.filter((item) => item.clientId === client.id).sort((a, b) => b.date.localeCompare(a.date));
  const payments = window.CrmLocal.clientPayments(data.clients, data.transactions).filter((item) => item.clientId === client.id);
  const total = payments.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const charged = visits.reduce((sum, item) => sum + Number(item.chargedTotal || 0), 0);
  const pending = Math.max(0, charged - total);
  const average = payments.length ? total / payments.length : 0;
  const forecast = window.CrmLocal.forecast(client, data.clientVisits);
  const last = visits[0] || null;
  return `<section class="crm-page crm-profile"><div class="crm-profile-top"><button class="secondary-button" data-action="crm-back-to-list">← Lista e indicadores</button><div class="crm-heading"><div><p class="eyebrow">FICHA ADMINISTRATIVA</p><h2>${escapeHTML(client.name)} ${client.demo ? '<span class="crm-demo-label">Demonstração</span>' : ''}</h2><p>Dados mínimos para acompanhamento de relacionamento.</p></div><div class="crm-profile-actions"><button class="secondary-button" data-action="prepare-return-message" data-id="${client.id}">Preparar contato</button><button class="secondary-button" data-action="edit-crm-client" data-id="${client.id}">Editar ficha</button><button class="secondary-button danger" data-action="delete-crm-client" data-id="${client.id}">Excluir cadastro</button></div></div></div><div class="notice-box crm-privacy-note">Sem controle de acesso por usuário nesta versão local. Não inclua dados sensíveis ou clínicos nas observações.</div><div class="crm-profile-metrics"><article><span>Primeiro atendimento</span><strong>${displayDate(client.firstVisit)}</strong></article><article><span>Atendimentos registrados</span><strong>${visits.length}</strong></article><article><span>Total cobrado</span><strong>${money(charged)}</strong></article><article><span>Total efetivamente recebido</span><strong>${money(total)}</strong></article><article><span>Saldo pendente</span><strong>${money(pending)}</strong></article><article><span>Ticket médio recebido</span><strong>${money(average)}</strong></article><article><span>Último procedimento</span><strong>${last ? `${displayDate(last.date)} · ${escapeHTML(last.procedure)}` : 'Sem histórico'}</strong></article><article><span>Próximo retorno</span><strong>${forecast.date ? `${displayDate(forecast.date)} · ${forecast.source === 'estimated' ? 'estimado' : 'manual'}` : 'Sem previsão'}</strong><small>${forecast.source === 'estimated' ? `Média de ${forecast.averageDays} dias entre atendimentos. Corrija no cadastro quando necessário.` : forecast.source === 'manual' ? 'Data informada manualmente; edite para corrigir.' : 'Ainda não há atendimentos suficientes para estimar.'}</small></article></div><div class="crm-profile-grid"><section class="panel crm-panel"><div class="panel-heading"><div><p class="eyebrow">HISTÓRICO</p><h3>Atendimentos e pagamentos</h3></div><button class="primary-button" data-action="new-crm-visit" data-id="${client.id}">＋ Registrar atendimento</button></div>${visits.length ? `<div class="table-wrap"><table class="crm-table"><thead><tr><th>Data</th><th>Procedimento/serviço</th><th>Cobrado</th><th>Recebido / saldo</th><th>Agenda</th><th></th></tr></thead><tbody>${visits.map((visit) => { const receipts = data.transactions.filter((item) => item.sourceVisitId === visit.id && item.type === 'receita'); const received = receivedForVisit(visit); const linkedAppointment = data.appointments.find((item) => item.id === visit.appointmentId); return `<tr><td>${displayDate(visit.date)}${visit.demo ? '<small class="crm-demo-label">Fictício</small>' : ''}</td><td>${escapeHTML(visit.procedure)}${visit.adminNotes ? `<small>${escapeHTML(visit.adminNotes)}</small>` : ''}<small>${escapeHTML(visit.paymentStatus || 'pendente')} · ${escapeHTML(visit.paymentMethod || '—')}${visit.paymentMethod === 'cartao' ? ` · ${visit.installments || 1}x` : ''}</small></td><td>${money(visit.chargedTotal || 0)}</td><td>${money(received)} / ${money(Math.max(0, Number(visit.chargedTotal || 0) - received))}${receipts.map((receipt) => `<small>${displayDate(receipt.date)} · ${receipt.status === 'Cancelado' ? `CANCELADO: ${escapeHTML(receipt.cancellationReason || 'motivo não informado')} · valor ${money(receipt.value)}` : `recebido ${money(receipt.value)}`}${receipt.paymentMethod === 'cartao' ? ` · ${receipt.installments || 1}x` : ''} ${receipt.status === 'Cancelado' ? '' : `<button class="secondary-button" data-action="edit-transaction" data-id="${receipt.id}">Editar</button>`}</small>`).join('')}<button class="secondary-button" data-action="add-visit-receipt" data-id="${visit.id}">＋ Recebimento</button></td><td>${linkedAppointment ? 'Compromisso vinculado' : '—'}</td><td><button class="secondary-button" data-action="edit-crm-visit" data-id="${visit.id}">Editar</button><button class="secondary-button danger" data-action="delete-crm-visit" data-id="${visit.id}">Excluir</button></td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty-state compact"><strong>Sem atendimentos registrados</strong><p>O histórico começa quando você adiciona um atendimento.</p></div>'}</section><section class="panel crm-panel"><div class="panel-heading"><div><p class="eyebrow">OBSERVAÇÕES</p><h3>Notas administrativas</h3></div></div><p class="crm-notes">${client.notes ? escapeHTML(client.notes) : 'Nenhuma observação administrativa cadastrada.'}</p><p class="form-hint">Use apenas informação administrativa necessária; não registre detalhes clínicos.</p></section></div></section>`;
}
function renderCRMOccurrences() {
  const records = [...data.occurrences].sort((a, b) => b.date.localeCompare(a.date));
  return `<section class="crm-page"><div class="crm-heading"><div><p class="eyebrow">REGISTRO INTERNO</p><h2>Ocorrências e pendências</h2><p>Descrições factuais e providências administrativas.</p></div><button class="primary-button" data-action="new-crm-occurrence">＋ Registrar ocorrência</button></div><div class="notice-box crm-privacy-note"><strong>Acesso e privacidade:</strong> este protótipo não possui login nem permissões por usuário, portanto não pode restringir tecnicamente esta área. Use somente registros fictícios ou autorizados. Evite detalhes clínicos, dados sensíveis, julgamentos pessoais e rótulos ofensivos. Os exemplos de teste estão marcados como fictícios.</div>${records.length ? `<div class="crm-occurrence-list">${records.map((record) => { const client = data.clients.find((item) => item.id === record.clientId); return `<article class="panel crm-occurrence"><div class="crm-occurrence-head"><div><span class="crm-category">${escapeHTML(record.category)}</span><h3>${client ? escapeHTML(client.name) : 'Registro sem cliente associado'}</h3>${record.demo || client?.demo ? '<small class="crm-occurrence-demo">EXEMPLO FICTÍCIO</small>' : ''}</div><span class="status ${record.status === 'Resolvida' ? 'confirmed' : 'pending'}">${escapeHTML(record.status)}</span></div><div class="crm-occurrence-meta"><span>Data: ${displayDate(record.date)}</span><span>Responsável pelo registro: ${escapeHTML(record.responsible)}</span></div><p><strong>Descrição factual</strong><br>${escapeHTML(record.description)}</p><p><strong>Providências</strong><br>${escapeHTML(record.actions || 'Nenhuma providência registrada.')}</p><div class="record-actions"><button class="secondary-button" data-action="edit-crm-occurrence" data-id="${record.id}">Corrigir / editar</button><button class="secondary-button" data-action="toggle-occurrence-status" data-id="${record.id}" data-status="${record.status === 'Resolvida' ? 'Pendente' : 'Resolvida'}">${record.status === 'Resolvida' ? 'Reabrir' : 'Marcar resolvida'}</button><button class="secondary-button danger" data-action="delete-crm-occurrence" data-id="${record.id}">Excluir</button></div></article>`; }).join('')}</div>` : '<div class="empty-state"><strong>Nenhuma ocorrência registrada</strong><p>Registre apenas fatos administrativos relevantes e necessários.</p><button class="primary-button" data-action="new-crm-occurrence">＋ Registrar ocorrência</button></div>'}</section>`;
}

function agendaWeekDates() {
  const monday = new Date();
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + (agendaWeekOffset * 7));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { date, iso: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` };
  });
}
function agendaOffsetForDate(dateISO) {
  const monday = new Date(); monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return Math.round((new Date(`${dateISO}T12:00:00`) - monday) / (7 * 86400000));
}
function renderAgenda() {
  const week = agendaWeekDates();
  if (!week.some((day) => day.iso === agendaSelectedDate)) agendaSelectedDate = week[0].iso;
  const appointments = [...data.appointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const selectedAppointments = appointments.filter((item) => item.date === agendaSelectedDate);
  const pendingCount = appointments.filter((item) => item.status === 'A confirmar' && week.some((day) => day.iso === item.date)).length;
  const weekAppointments = appointments.filter((item) => week.some((day) => day.iso === item.date));
  const dateLabel = new Date(`${agendaSelectedDate}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const rangeLabel = `${week[0].date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} – ${week[6].date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  const eventCards = selectedAppointments.length ? selectedAppointments.map((item) => `<article class="agenda-event"><time>${escapeHTML(item.time)}</time><span class="agenda-event-marker ${item.status === 'A confirmar' ? 'is-pending' : ''}"></span><div class="agenda-event-copy"><strong>${escapeHTML(item.title)}</strong><span>${item.cancellationReason ? `${escapeHTML(item.cancellationReason)} · material ${item.cancellationMaterialUsed ? 'utilizado' : 'não utilizado'} · sala ${item.cancellationRoomUsed ?? (item.cancellationRoomOutcome === 'perdida') ? 'utilizada' : 'não utilizada'}` : (item.clientId ? 'Atendimento associado a uma ficha de cliente' : 'Compromisso local')}</span></div><span class="agenda-event-status ${item.status === 'Cancelado' ? 'is-cancelled' : item.status === 'A confirmar' ? 'is-pending' : 'is-confirmed'}">${escapeHTML(item.status)}</span><div class="agenda-event-actions"><button class="secondary-button" data-action="edit-appointment" data-id="${item.id}" ${item.status === 'Cancelado' ? 'disabled' : ''}>Editar</button>${item.status === 'Cancelado' ? '' : `<button class="secondary-button danger" data-action="cancel-appointment" data-id="${item.id}">Cancelar</button>`}</div></article>`).join('') : '<div class="agenda-empty"><span>◷</span><strong>Dia livre</strong><p>Nenhum compromisso para esta data. Você pode aproveitar o horário ou adicionar um compromisso demonstrativo.</p><button class="secondary-button" data-action="new-appointment">＋ Adicionar horário</button></div>';
  const dayTiles = week.map((day) => {
    const dayAppointments = appointments.filter((item) => item.date === day.iso);
    const isToday = day.iso === localDate();
    const selected = day.iso === agendaSelectedDate;
    const countLabel = dayAppointments.length === 1 ? '1 compromisso' : `${dayAppointments.length} compromissos`;
    return `<button class="agenda-day-tile ${selected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}" data-action="agenda-select-day" data-date="${day.iso}" aria-pressed="${selected}"><span>${day.date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span><strong>${day.date.getDate()}</strong><small>${dayAppointments.length ? countLabel : 'Livre'}</small><i class="${dayAppointments.length ? 'has-events' : ''}"></i></button>`;
  }).join('');
  const selectedCountLabel = selectedAppointments.length === 1 ? '1 horário' : `${selectedAppointments.length} horários`;
  return `<section class="agenda-page"><div class="agenda-heading"><div><p class="eyebrow">ORGANIZAÇÃO DA ROTINA</p><h2>Agenda da clínica</h2><p>Veja seus horários por dia e organize a semana em um só lugar.</p></div><button class="primary-button" data-action="new-appointment">＋ Novo compromisso</button></div><div class="agenda-summary"><article><span>Neste dia</span><strong>${selectedAppointments.length}</strong><small>${escapeHTML(dateLabel)}</small></article><article><span>Nesta semana</span><strong>${weekAppointments.length}</strong><small>Compromissos na agenda local</small></article><article><span>A confirmar</span><strong>${pendingCount}</strong><small>Confirmações pendentes na semana</small></article></div><section class="panel agenda-day-panel"><div class="agenda-week-toolbar"><button class="secondary-button" data-action="agenda-week" data-delta="-1" aria-label="Semana anterior">←</button><button class="secondary-button" data-action="agenda-today">Hoje</button><span>${escapeHTML(rangeLabel)}</span><button class="secondary-button" data-action="agenda-week" data-delta="1" aria-label="Próxima semana">→</button></div><div class="agenda-daily-heading"><div><p class="eyebrow">DIA SELECIONADO</p><h3>${escapeHTML(dateLabel)}</h3></div><span class="agenda-daily-count">${selectedCountLabel}</span></div><div class="agenda-event-list">${eventCards}</div></section><section class="panel agenda-google-panel"><div class="agenda-google-heading"><div><p class="eyebrow">VISÃO DA SEMANA</p><h3>Google Agenda</h3><p>Escolha um dia para ver os horários desta semana.</p></div><span class="agenda-connection-status"><i></i> Ainda não conectado</span></div><div class="agenda-week-days">${dayTiles}</div><div class="agenda-google-footer"><span>Integração planejada</span><small>Esta prévia mostra apenas compromissos salvos neste sistema. A sincronização com Google Agenda será adicionada depois; nenhuma conta foi conectada.</small></div></section></section>`;
}
function renderApprovals() {
  const pendingCount = data.approvals.filter((item) => item.status === 'Pendente').length;
  const cards = data.approvals.map((item) => {
    const review = item.requiresProfessionalReview ? `<div class="professional-review"><strong>Revisão profissional necessária antes de usar</strong><label><input type="checkbox" data-review-check> Revisei o texto e removi promessas ou informações não verificadas.</label><label><input type="checkbox" data-review-check> Conferi a adequação às regras profissionais e publicitárias aplicáveis.</label><label><input type="checkbox" data-review-check> Confirmei autorização e privacidade de imagens, se houver.</label></div>` : '';
    const actions = item.status === 'Pendente' ? `<div class="record-actions">${item.requiresProfessionalReview ? '<button class="secondary-button approve" data-action="approval-status" data-status="Aprovado" data-id="' + item.id + '" disabled>Confirmar revisão e aprovar</button>' : '<button class="secondary-button approve" data-action="approval-status" data-status="Aprovado" data-id="' + item.id + '">Aprovar</button>'}<button class="secondary-button danger" data-action="approval-status" data-status="Rejeitado" data-id="${item.id}">Rejeitar</button></div>` : '';
    return `<article class="record-card"><div class="record-top"><span class="type-label">${escapeHTML(item.type)}</span><span class="status ${item.status === 'Aprovado' ? 'confirmed' : item.status === 'Rejeitado' ? 'rejected' : 'pending'}">${escapeHTML(item.status)}</span></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.body)}</p>${review}${actions}</article>`;
  }).join('');
  return `<section class="panel module-panel"><div class="panel-heading"><div><p class="eyebrow">REVISÃO INTERNA</p><h2>Conteúdos e mensagens</h2></div><span class="approval-number">${String(pendingCount).padStart(2, '0')}</span></div><div class="notice-box">Aprovar ou rejeitar só altera o status neste painel local. Nada será enviado ou publicado.</div>${cards ? `<div class="record-list">${cards}</div>` : '<div class="empty-state"><span>✓</span><strong>Sem itens para revisar</strong><p>Os rascunhos enviados para aprovação aparecerão aqui.</p><button class="secondary-button" data-go="marketing">Ir para Marketing</button></div>'}</section>`;
}
function renderFinance() {
  const active = data.transactions.filter((item) => item.status !== 'Cancelado' && !item.demo);
  const income = active.filter((item) => item.type === 'receita').reduce((sum, item) => sum + Number(item.value), 0);
  const expense = active.filter((item) => item.type === 'despesa').reduce((sum, item) => sum + Number(item.value), 0);
  const visits = data.clientVisits.filter((visit) => !visit.demo);
  const missing = visits.filter((visit) => visit.roomCost == null || visit.materialCostSnapshot == null).length;
  const room = visits.reduce((sum, visit) => sum + Number(visit.roomCost || 0), 0);
  const materials = visits.reduce((sum, visit) => sum + Number(visit.materialCostSnapshot || 0), 0);
  const pending = visits.reduce((sum, visit) => sum + Math.max(0, Number(visit.chargedTotal || 0) - receivedForVisit(visit)), 0);
  const net = income - expense - room - materials;
  const rows = data.transactions.filter((item) => !item.demo);
  const visitRows = visits.map((visit) => {
    const client = data.clients.find((item) => item.id === visit.clientId);
    const received = receivedForVisit(visit);
    const visitReceipts = data.transactions.filter((item) => item.type === 'receita' && item.status !== 'Cancelado' && item.sourceVisitId === visit.id).sort((a, b) => `${b.date} ${b.time || ''}`.localeCompare(`${a.date} ${a.time || ''}`));
    const latestReceipt = visitReceipts[0];
    const complete = visit.roomCost != null && visit.materialCostSnapshot != null;
    const profit = complete ? received - Number(visit.roomCost) - Number(visit.materialCostSnapshot) : null;
    const procedureTone = ({ Botox: 'botox', Preenchimento: 'preenchimento', 'Luz pulsada': 'luz-pulsada' })[visit.procedure] || 'outro';
    return `<tr><td class="finance-date">${displayDate(visit.date)}${visit.appointmentTime ? `<small>Atendimento às ${escapeHTML(visit.appointmentTime)}</small>` : ''}${latestReceipt ? `<small>${latestReceipt.time ? `Último recebimento às ${escapeHTML(latestReceipt.time)}` : 'Hora do recebimento não registrada'}</small>` : ''}</td><td class="finance-client">${escapeHTML(client?.name || 'Cliente')}</td><td><span class="finance-procedure procedure-${procedureTone}">${escapeHTML(visit.procedure)}</span></td><td class="finance-amount is-income">${money(received)}</td><td class="finance-duration">${visit.durationMinutes || visit.durationHours ? formatDuration(visit.durationMinutes ?? Number(visit.durationHours) * 60) : '—'}</td><td class="finance-amount is-cost">${visit.roomCost == null ? 'Não informado' : money(visit.roomCost)}</td><td class="finance-amount is-cost">${visit.materialCostSnapshot == null ? 'Não informado' : money(visit.materialCostSnapshot)}</td><td class="finance-amount ${profit == null ? 'is-incomplete' : 'is-profit'}">${profit == null ? 'Incompleto' : money(profit)}</td><td class="finance-row-actions"><button class="secondary-button" data-action="edit-finance-visit" data-id="${visit.id}">Editar atendimento</button><button class="secondary-button" data-action="edit-visit-costs" data-id="${visit.id}">Editar custos</button>${latestReceipt ? `<button class="secondary-button" data-action="edit-transaction" data-id="${latestReceipt.id}">Editar último recebimento</button>` : ''}</td></tr>`;
  }).join('');
  return `<section class="panel module-panel finance-page"><div class="panel-heading"><div><p class="eyebrow">VALORES REGISTRADOS</p><h2>Financeiro</h2></div><button class="primary-button" data-action="new-transaction">＋ Registrar despesa</button></div><div class="notice-box">Receitas de demonstração são excluídas. O resultado é antes de tributos; atendimentos sem custo informado ficam sinalizados como incompletos. Impostos pagos devem ser lançados como despesa.</div><div class="finance-summary"><article><span>Recebido</span><strong class="positive">${money(income)}</strong></article><article><span>Outras despesas registradas</span><strong class="negative">${money(expense)}</strong></article><article><span>Custo da sala cadastrado</span><strong>${money(room)}</strong></article><article><span>Materiais cadastrados</span><strong>${money(materials)}</strong></article><article><span>Resultado antes de tributos</span><strong>${missing ? 'Incompleto' : money(net)}</strong></article><article><span>Saldo pendente de clientes</span><strong>${money(pending)}</strong></article></div>${missing ? `<div class="notice-box">${missing} atendimento(s) sem custo informado. Use “Editar custos” na linha do atendimento para preencher esse valor sem alterar os custos padrão das Configurações.</div>` : ''}${visits.length ? `<h3>Resultado por atendimento</h3><div class="table-wrap"><table><thead><tr><th>Data</th><th>Cliente</th><th>Procedimento</th><th>Recebido</th><th>Duração</th><th>Sala</th><th>Materiais</th><th>Antes de tributos</th><th>Ação</th></tr></thead><tbody>${visitRows}</tbody></table></div>` : ''}${rows.length ? `<h3>Despesas e lançamentos</h3><div class="table-wrap"><table><thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th><th>Ação</th></tr></thead><tbody>${[...rows].sort((a, b) => b.date.localeCompare(a.date)).map((item) => `<tr><td class="finance-date">${displayDate(item.date)}${item.time ? `<small>às ${escapeHTML(item.time)}</small>` : ''}</td><td class="finance-description ${item.status === 'Cancelado' || item.category?.includes('cancelamento') ? 'is-cancelled' : ''}">${escapeHTML(item.description)}${item.sourceVisitId ? '<small>Vinculado ao atendimento do cliente</small>' : ''}${item.status === 'Cancelado' ? '<small>Cancelado</small>' : ''}</td><td><span class="type-label ${item.type}">${item.type === 'receita' ? 'Receita' : 'Despesa'}</span>${item.category?.includes('cancelamento') ? '<small class="finance-cancel-tag">CANCELAMENTO</small>' : ''}</td><td class="finance-amount ${item.type === 'receita' ? 'is-income' : 'is-cost'}">${money(item.value)}</td><td><button class="secondary-button" data-action="edit-transaction" data-id="${item.id}" ${item.status === 'Cancelado' ? 'disabled' : ''}>Editar</button><button class="secondary-button danger" data-action="delete-transaction" data-id="${item.id}" ${item.status === 'Cancelado' ? 'disabled' : ''}>Cancelar</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state"><strong>Sem lançamentos reais</strong><p>Registre os atendimentos na área Clientes e Relacionamento. Cadastre custos e taxas em Configurações.</p><button class="secondary-button" data-go="configuracoes">Abrir configurações</button></div>'}</section>`;
}
function visitCostForm(visit) {
  const client = data.clients.find((item) => item.id === visit.clientId);
  openModal('Editar custos deste atendimento', `<form id="visit-cost-form" data-id="${visit.id}" class="modal-form"><div class="notice-box"><strong>${escapeHTML(client?.name || 'Cliente')} · ${escapeHTML(visit.procedure)}</strong><br>${displayDate(visit.date)} · Estes valores afetam somente este atendimento. As Configurações continuam como padrão para os próximos.</div><label>Custo da sala neste atendimento (R$)<input name="roomCost" inputmode="decimal" value="${visit.roomCost == null ? '' : moneyInput(visit.roomCost)}" placeholder="Deixe vazio se ainda não souber"></label><label>Custo dos materiais usados neste atendimento (R$)<input name="materialCost" inputmode="decimal" value="${visit.materialCostSnapshot == null ? '' : moneyInput(visit.materialCostSnapshot)}" placeholder="Deixe vazio se ainda não souber"></label><p class="form-hint">Deixar em branco mantém o resultado incompleto. Informe 0,00 somente se confirmou que não houve esse custo.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Salvar custos deste atendimento</button></div></form>`);
}
function renderSettings() {
  const s = data.settings || defaultSettings();
  return `<section class="panel module-panel"><div class="panel-heading"><div><p class="eyebrow">GERAL · FINANCEIRO · PROCEDIMENTOS</p><h2>Dados usados nos cálculos</h2></div></div><div class="notice-box">Os valores ficam salvos neste navegador. Custos em branco não são tratados como zero. Confirme custos e regime tributário com a contabilidade antes de usar para apuração oficial.</div><form id="settings-form" class="modal-form settings-form"><h3>Geral</h3><label>Nome do espaço<input name="businessName" maxlength="80" value="${escapeHTML(s.businessName || '')}"></label><label>Duração padrão de atendimento (horas)<input name="defaultDuration" type="number" min="0.25" step="0.25" value="${escapeHTML(s.defaultDuration || '')}" placeholder="Informe se costuma ser igual"></label><h3>Financeiro e tributação</h3><label>Aluguel da sala (R$ por hora) · valor provisório, confirme depois<input name="hourlyRoomCost" inputmode="decimal" value="${s.hourlyRoomCost === '' ? '' : moneyInput(s.hourlyRoomCost)}" placeholder="120,00"></label><label>Como cobrar o tempo da sala<select name="roomBillingMode"><option value="proporcional" ${s.roomBillingMode === 'proporcional' ? 'selected' : ''}>Proporcional aos minutos usados</option><option value="hora-cheia" ${s.roomBillingMode === 'hora-cheia' ? 'selected' : ''}>Arredondar para cada hora iniciada</option></select></label><p class="form-hint">Modo atual: ${s.roomBillingMode === 'hora-cheia' ? 'cada hora iniciada é cobrada por inteiro' : 'cálculo proporcional por minuto (${money(Number(s.hourlyRoomCost || 0) / 60)}/min nesta tarifa)'}. Você pode alterar esta opção quando quiser.</p><label>Regime tributário<select name="taxRegime"><option value="nao-confirmado" ${s.taxRegime === 'nao-confirmado' ? 'selected' : ''}>Não confirmado</option><option value="simples" ${s.taxRegime === 'simples' ? 'selected' : ''}>Simples Nacional (confirmado)</option><option value="presumido" ${s.taxRegime === 'presumido' ? 'selected' : ''}>Lucro Presumido</option><option value="real" ${s.taxRegime === 'real' ? 'selected' : ''}>Lucro Real</option><option value="outro" ${s.taxRegime === 'outro' ? 'selected' : ''}>Outro / confirmar</option></select></label><p class="form-hint">A seleção do regime é apenas informativa: o sistema não estima imposto nem aplica alíquota. Registre o tributo efetivamente pago em Financeiro.</p><h3>Procedimentos e custo de materiais</h3><p>Informe o custo total de materiais por atendimento e marcas usadas, se desejar. Estes valores são custos, não preços cobrados do cliente.</p>${s.procedures.map((p) => `<fieldset class="procedure-settings"><legend>${escapeHTML(p.name)}</legend><input type="hidden" name="procedureId" value="${escapeHTML(p.id)}"><label>Materiais / marcas<input name="materials" maxlength="160" value="${escapeHTML(p.materials || '')}" placeholder="Opcional"></label><label>Custo total de materiais por atendimento (R$)<input name="materialCost" inputmode="decimal" value="${p.materialCost === '' ? '' : moneyInput(p.materialCost)}" placeholder="Ainda não informado"></label></fieldset>`).join('')}<div class="modal-actions"><button class="primary-button">Salvar configurações</button></div></form></section>`;
}
function openModal(title, content) {
  const host = document.querySelector('#modal-host');
  host.innerHTML = `<div class="modal-backdrop"><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="panel-heading"><h2 id="modal-title">${title}</h2><button type="button" class="modal-close" data-action="close-modal" aria-label="Fechar">×</button></div>${content}</section></div>`;
  host.querySelector('.modal-backdrop').addEventListener('click', (event) => { if (event.target === event.currentTarget) host.innerHTML = ''; });
  host.querySelector('input, textarea, select')?.focus();
}
function appointmentForm(item = {}) {
  const clients = data.clients.map((client) => `<option value="${client.id}" ${item.clientId === client.id ? 'selected' : ''}>${escapeHTML(client.name)}${client.demo ? ' · demonstração' : ''}</option>`).join('');
  openModal(item.id ? 'Editar compromisso' : 'Novo compromisso', `<form id="appointment-form" data-id="${item.id || ''}" class="modal-form"><label>Descrição do atendimento<input name="title" required maxlength="80" value="${escapeHTML(item.title || '')}" placeholder="Ex.: Botox"></label><label>Cliente associado (opcional)<select name="clientId"><option value="">Sem associação com cliente</option>${clients}</select></label><div class="form-row"><label>Data<input name="date" type="date" required value="${item.date || localDate()}"></label><label>Horário<input name="time" type="time" required value="${item.time || '09:00'}"></label></div><label>Duração em minutos<input name="durationMinutes" type="number" min="1" step="1" value="${escapeHTML(item.durationMinutes || (item.durationHours ? Math.round(item.durationHours * 60) : Math.round(Number(data.settings.defaultDuration || 1) * 60)))}" placeholder="Ex.: 60"></label><label>Status<select name="status"><option ${item.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option><option ${item.status === 'A confirmar' ? 'selected' : ''}>A confirmar</option><option ${item.status === 'Realizado' ? 'selected' : ''}>Realizado</option></select></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Salvar compromisso</button></div></form>`);
}
function appointmentCancellationForm(appointment) {
  const linkedVisit = data.clientVisits.find((visit) => visit.appointmentId === appointment.id);
  const guessed = linkedVisit?.procedure || (data.settings.procedures || []).find((procedure) => appointment.title.toLocaleLowerCase('pt-BR').includes(procedure.name.toLocaleLowerCase('pt-BR')))?.name || '';
  const procedureOptions = (data.settings.procedures || []).map((procedure) => `<option value="${escapeHTML(procedure.name)}" ${guessed === procedure.name ? 'selected' : ''}>${escapeHTML(procedure.name)}</option>`).join('');
  const duration = appointment.durationMinutes || (appointment.durationHours ? Math.round(appointment.durationHours * 60) : linkedVisit?.durationMinutes || (linkedVisit?.durationHours ? Math.round(linkedVisit.durationHours * 60) : Math.round(Number(data.settings.defaultDuration || 1) * 60)));



  openModal('Cancelar atendimento', `<form id="appointment-cancellation-form" data-id="${appointment.id}" class="modal-form"><div class="notice-box">${escapeHTML(appointment.title)} · ${displayDate(appointment.date)} às ${escapeHTML(appointment.time || '—')}</div><label>Motivo do cancelamento<textarea name="reason" required minlength="3" maxlength="300" rows="2" placeholder="Por que a cliente cancelou?"></textarea></label><label>Procedimento<select name="procedure" required><option value="">Selecione o procedimento</option>${procedureOptions}</select></label><label>O material deste procedimento foi utilizado?<select name="materialUsed" required><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option></select></label><label>Duração reservada (minutos)<input name="durationMinutes" type="number" min="1" step="1" required value="${escapeHTML(duration)}" placeholder="Ex.: 60"></label><label>A sala alugada foi utilizada neste horário?<select name="roomUsed" required><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option></select></label><p class="form-hint">Responda Sim somente se o material foi gasto ou se a sala foi utilizada; só então o custo entra como despesa.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Confirmar cancelamento</button></div></form>`);
}
function draftForm(item = {}) {
  openModal(item.id ? 'Editar rascunho' : 'Novo rascunho', `<form id="draft-form" data-id="${item.id || ''}" class="modal-form"><label>Tipo<select name="type" required>${['Legenda para Instagram', 'Ideia de Reels', 'Campanha'].map((type) => `<option ${item.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label><label>Título<input name="title" required maxlength="80" value="${escapeHTML(item.title || '')}" placeholder="Dê um nome para sua ideia"></label><label>Texto<textarea name="body" required maxlength="1500" rows="5" placeholder="Escreva seu rascunho…">${escapeHTML(item.body || '')}</textarea></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Salvar rascunho</button></div></form>`);
}
function transactionForm(item = {}) {
  const clients = data.clients.map((client) => `<option value="${client.id}" ${item.clientId === client.id ? 'selected' : ''}>${escapeHTML(client.name)}${client.demo ? ' · demonstração' : ''}</option>`).join('');
  openModal(item.id ? 'Editar lançamento' : 'Registrar despesa', `<form id="transaction-form" data-id="${item.id || ''}" class="modal-form"><label>Tipo<select name="type" ${item.sourceVisitId ? 'disabled' : ''}><option value="receita" ${(item.id ? item.type !== 'despesa' : false) ? 'selected' : ''}>Receita</option><option value="despesa" ${(!item.id || item.type === 'despesa') ? 'selected' : ''}>Despesa</option></select></label><label>Descrição<input name="description" required maxlength="80" value="${escapeHTML(item.description || '')}" placeholder="Ex.: aluguel, imposto ou outra despesa"></label><label>Associar a cliente (opcional)<select name="clientId" ${item.sourceVisitId ? 'disabled' : ''}><option value="">Sem cliente associado</option>${clients}</select></label><div class="form-row"><label>Valor recebido / despesa (R$)<input name="value" type="text" inputmode="decimal" required value="${item.id ? moneyInput(item.value) : ''}" placeholder="0,00"></label><div class="finance-date-time"><label>Data<input name="date" type="date" required value="${item.date || localDate()}"></label><label>Hora<input name="time" type="time" value="${item.id ? escapeHTML(item.time || '') : localTime()}" aria-label="Hora do lançamento"></label></div></div>${item.sourceVisitId ? `<p class="form-hint">Recebimento vinculado ao atendimento. Valor cobrado do cliente: ${money(data.clientVisits.find(v => v.id === item.sourceVisitId)?.chargedTotal || 0)}. ${item.paymentMethod === 'cartao' ? `<label>Valor bruto desta parcela<input name="grossAmount" type="text" inputmode="decimal" value="${moneyInput(item.grossAmount ?? item.value)}"></label><label>Taxas/juros desta parcela<input name="fees" type="text" inputmode="decimal" value="${moneyInput(item.fees)}"></label><label>Forma<select name="paymentMethod"><option value="cartao" selected>Cartão de crédito</option><option value="pix">PIX</option><option value="dinheiro">Dinheiro</option></select></label><label>Parcelamento original<select name="installments">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${Number(item.installments||1)===i+1?'selected':''}>${i+1}x</option>`).join('')}</select></label>` : ''}</p>` : ''}<p class="form-hint">Em novos lançamentos, a hora atual é preenchida automaticamente e pode ser corrigida. Registre receitas na área Clientes e Relacionamento; aqui, normalmente, você lança as demais despesas e os impostos pagos.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Salvar lançamento</button></div></form>`);
}
function receiptForm(visit) {
  const client = data.clients.find((item) => item.id === visit.clientId);
  openModal('Registrar valor recebido', `<form id="transaction-form" data-source-visit="${visit.id}" class="modal-form"><label>Cliente e procedimento<input value="${escapeHTML(client?.name || 'Cliente')} · ${escapeHTML(visit.procedure)}" readonly></label><label>Valor recebido nesta data (R$)<input name="value" type="text" inputmode="decimal" required placeholder="0,00"></label><div class="finance-date-time"><label>Data do recebimento<input name="date" type="date" required value="${localDate()}"></label><label>Hora do recebimento<input name="time" type="time" value="${localTime()}" required></label></div><p class="form-hint">Informe o valor que a cliente pagou agora. Data e hora começam preenchidas com o momento atual e podem ser corrigidas.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="primary-button">Registrar recebimento</button></div></form>`);
}
function transactionCancellationForm(transaction) {
  const visit = data.clientVisits.find((item) => item.id === transaction.sourceVisitId);
  const usageQuestions = visit ? `<h3>Custos deste atendimento · ${escapeHTML(visit.procedure)}</h3><label>O material de ${escapeHTML(visit.procedure)} foi utilizado?<select name="materialUsed" required><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option></select></label><label>A sala alugada foi utilizada neste atendimento?<select name="roomUsed" required><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option></select></label><p class="form-hint">Se responder Não, o custo correspondente sai do resultado deste atendimento. Se responder Sim, o custo continua registrado.</p>` : '';
  openModal('Cancelar lançamento', `<form id="transaction-cancellation-form" data-id="${transaction.id}" class="modal-form"><div class="notice-box">${escapeHTML(transaction.description)} · ${money(transaction.value)}</div><label>Motivo do cancelamento<textarea name="reason" required minlength="3" maxlength="300" rows="2" placeholder="Por que este lançamento está sendo cancelado?"></textarea></label>${usageQuestions}<div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Confirmar cancelamento</button></div></form>`);
}
function crmClientForm(client = {}) {
  openModal(client.id ? 'Editar ficha de cliente' : 'Cadastrar cliente', `<form id="crm-client-form" data-id="${client.id || ''}" class="modal-form"><label>Nome ou identificador<input name="name" required maxlength="80" value="${escapeHTML(client.name || '')}" placeholder="Use dados necessários e autorizados"></label><label>Contato (opcional)<input name="contact" maxlength="120" value="${escapeHTML(client.contact || '')}" placeholder="Telefone ou e-mail, se necessário"></label><label>Data do primeiro atendimento<input name="firstVisit" type="date" required value="${client.firstVisit || localDate()}"></label><label>Previsão manual do próximo retorno (opcional)<input name="nextReturnDate" type="date" value="${client.nextReturnDate || ''}"><small>Se deixar vazio, o sistema poderá estimar pela média dos atendimentos registrados.</small></label><label>Observações administrativas<textarea name="notes" rows="3" maxlength="600" placeholder="Somente informações administrativas necessárias; não inclua detalhes clínicos.">${escapeHTML(client.notes || '')}</textarea></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="primary-button">Salvar ficha</button></div></form>`);
}
function crmVisitForm(client, visit = {}, returnPage = 'crm') {
  const appointments = data.appointments.filter((item) => item.clientId === client.id && item.status !== 'Cancelado' && (!data.clientVisits.some((other) => other.appointmentId === item.id && other.id !== visit.id) || item.id === visit.appointmentId));
  const appointmentOptions = appointments.map((item) => `<option value="${item.id}" ${visit.appointmentId === item.id ? 'selected' : ''}>${displayDate(item.date)} às ${escapeHTML(item.time)} · ${escapeHTML(item.title)}</option>`).join('');
  const received = visit.id ? receivedForVisit(visit) : 0;
  const procedures = data.settings.procedures || defaultSettings().procedures;
  const savedProcedure = procedures.some((p) => p.name === visit.procedure) ? visit.procedure : '';
  const duration = visit.durationMinutes || (visit.durationHours ? Math.round(visit.durationHours * 60) : Math.round(Number(data.settings.defaultDuration || 1) * 60));
  openModal(visit.id ? 'Editar atendimento' : 'Registrar atendimento', `<form id="crm-visit-form" data-id="${visit.id || ''}" data-client-id="${client.id}" data-return-page="${returnPage}" class="modal-form"><label>Cliente<input value="${escapeHTML(client.name)}" readonly></label><label>Procedimento<select name="procedure" required><option value="">Selecione</option>${procedures.map((p) => `<option value="${escapeHTML(p.name)}" ${savedProcedure === p.name ? 'selected' : ''}>${escapeHTML(p.name)}</option>`).join('')}${visit.procedure && !savedProcedure ? `<option selected value="${escapeHTML(visit.procedure)}">${escapeHTML(visit.procedure)} (registro anterior)</option>` : ''}</select></label><div class="form-row"><label>Data<input name="date" type="date" required value="${visit.date || localDate()}"></label><label>Duração (minutos)<input name="durationMinutes" type="number" min="1" step="1" required value="${escapeHTML(duration)}" placeholder="Ex.: 60"></label></div><label>Valor que a cliente pagou (R$)<input name="receivedValue" type="text" inputmode="decimal" required value="${visit.id ? moneyInput(received) : ''}" placeholder="0,00"></label><input type="hidden" name="chargedTotal" value="${visit.id ? moneyInput(visit.chargedTotal || received) : ''}"><input type="hidden" name="paymentStatus" value="pago"><input type="hidden" name="paymentMethod" value="pix"><input type="hidden" name="installments" value="1"><label>Horário de início (opcional)<input name="appointmentTime" type="time" value="${escapeHTML(visit.appointmentTime || '')}"></label><label>Compromisso da agenda (opcional)<select name="appointmentId"><option value="">Sem compromisso vinculado</option>${appointmentOptions}</select></label><p class="form-hint">A duração é informada em minutos. A sala usa a regra e a tarifa das Configurações; os materiais vêm do procedimento cadastrado.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="primary-button">Salvar atendimento</button></div></form>`);
}
function crmOccurrenceForm(record = {}) {
  const categories = ['Falta sem aviso', 'Pendência de pagamento', 'Reclamação ou conflito', 'Cancelamento recorrente', 'Outra ocorrência'];
  const options = data.clients.map((client) => `<option value="${client.id}" ${record.clientId === client.id ? 'selected' : ''}>${escapeHTML(client.name)}${client.demo ? ' · demonstração' : ''}</option>`).join('');
  openModal(record.id ? 'Corrigir ocorrência' : 'Registrar ocorrência', `<form id="crm-occurrence-form" data-id="${record.id || ''}" class="modal-form"><label>Cliente associado (opcional)<select name="clientId"><option value="">Sem associação</option>${options}</select></label><label>Data<input name="date" type="date" required value="${record.date || localDate()}"></label><label>Categoria<select name="category">${categories.map((category) => `<option ${record.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></label><label>Descrição factual<textarea name="description" required maxlength="500" rows="3" placeholder="Relate fatos observáveis, sem julgamentos ou informações clínicas.">${escapeHTML(record.description || '')}</textarea></label><label>Providências tomadas<textarea name="actions" maxlength="500" rows="3" placeholder="Descreva ações administrativas adotadas.">${escapeHTML(record.actions || '')}</textarea></label><label>Situação<select name="status"><option ${record.status === 'Pendente' || !record.id ? 'selected' : ''}>Pendente</option><option ${record.status === 'Resolvida' ? 'selected' : ''}>Resolvida</option></select></label><label>Responsável pelo registro<input name="responsible" required maxlength="80" value="${escapeHTML(record.responsible || 'Tami')}"></label><div class="notice-box crm-privacy-note">Área sem autenticação nesta versão. Evite dados sensíveis, clínicos, julgamentos pessoais ou conteúdo desnecessário.</div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="primary-button">Salvar registro</button></div></form>`);
}
function releaseVisitPayment(visit) {
  data.transactions.filter((item) => item.sourceVisitId === visit.id || (Array.isArray(visit.paymentIds) && visit.paymentIds.includes(item.id))).forEach((payment) => { delete payment.sourceVisitId; });
}
function releaseVisitAppointment(visit) {
  const appointment = data.appointments.find((item) => item.id === visit.appointmentId);
  if (!appointment || appointment.status !== 'Realizado') return;
  appointment.status = visit.previousAppointmentStatus || 'Confirmado';
  appointment.clientId = visit.previousAppointmentClientId || '';
}
function applyCRMFilters() {
  const query = crmSearchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  document.querySelectorAll('.crm-client-row').forEach((row) => {
    row.hidden = (query && !row.dataset.search.includes(query)) || (crmStatusFilter !== 'todos' && row.dataset.status !== crmStatusFilter);
  });
}
function suggestionOutline(topic, category) {
  const safeTopic = topic.trim();
  const structures = {
    educativo: `Tema: ${safeTopic}\n\n01 · Abertura: apresente uma pergunta acolhedora sobre o tema.\n02 · Contexto: compartilhe informação geral em linguagem simples.\n03 · Cuidado: explique limites e individualidades, sem prometer resultados.\n04 · Convite: incentive uma conversa individual com profissional habilitado.`,
    servicos: `Tema: ${safeTopic}\n\n01 · Apresentação: explique em termos gerais o serviço.\n02 · Como funciona: descreva as etapas informativas da conversa inicial.\n03 · Individualidade: lembre que indicações dependem de avaliação profissional.\n04 · Convite: abra espaço para dúvidas, sem promessas de resultado.`,
    faq: `Pergunta: ${safeTopic}\n\n01 · Resposta curta e clara, sem diagnóstico.\n02 · Contexto geral com linguagem acessível.\n03 · Lembrete: dúvidas pessoais precisam de avaliação profissional.\n04 · Convite para conversar com responsabilidade.`,
    bastidores: `Tema: ${safeTopic}\n\n01 · Mostre um detalhe do espaço ou da rotina.\n02 · Conte por que esse cuidado faz parte do atendimento.\n03 · Preserve privacidade: não mostre pacientes ou dados pessoais.\n04 · Encerre com uma mensagem de acolhimento.`,
    campanha: `Tema: ${safeTopic}\n\n01 · Apresente a ideia da campanha com clareza.\n02 · Explique as informações práticas e o período, se aplicável.\n03 · Evite garantias, pressão ou promessas clínicas.\n04 · Convide a pessoa a tirar dúvidas antes de decidir.`
  };
  return structures[category] || structures.educativo;
}
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 5) {
  let lines = [];
  for (const paragraph of String(text || '').split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = '';
    if (!words.length) { lines.push(''); continue; }
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = word; }
      else line = next;
    }
    if (line) lines.push(line);
  }
  if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.…]*$/, '')}…`; }
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return lines.length * lineHeight;
}
async function exportDesignPng() {
  const draft = data.drafts.find((item) => item.id === activeDraftId);
  if (!draft) return showToast('Abra um rascunho antes de exportar.', 'error');
  const slide = draft.slides[activeSlideIndex];
  const story = draft.format === 'story' || draft.format === 'reel';
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = story ? 1920 : 1350;
  const ctx = canvas.getContext('2d');
  const bg = safeColor(slide.bg, '#f3eee4');
  const fg = safeColor(slide.textColor, '#393b3e');
  const primary = safeColor(slide.primary, '#172b43');
  const secondary = safeColor(slide.secondary, '#d9cdb9');
  const accent = safeColor(slide.accent, '#b6975a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = secondary; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(940, 145, 88, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = accent; ctx.beginPath(); ctx.moveTo(86, 95); ctx.lineTo(190, 95); ctx.stroke();
  if (slide.image) {
    try {
      const img = new Image();
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = slide.image; });
      const box = { x: 90, y: story ? 190 : 150, w: 900, h: story ? 660 : 420 };
      const ratio = Math.max(box.w / img.width, box.h / img.height);
      const width = img.width * ratio, height = img.height * ratio;
      ctx.save(); ctx.beginPath(); ctx.roundRect(box.x, box.y, box.w, box.h, 22); ctx.clip();
      ctx.drawImage(img, box.x + (box.w - width) / 2, box.y + (box.h - height) / 2, width, height); ctx.restore();
    } catch { showToast('Não foi possível ler a imagem. Remova-a ou selecione outro arquivo.', 'error'); return; }
  }
  const align = ['left', 'center', 'right'].includes(slide.align) ? slide.align : 'left';
  const x = align === 'left' ? 100 : align === 'right' ? 980 : 540;
  const maxWidth = 850;
  const baseY = slide.image ? (story ? 970 : 670) : (story ? 560 : 380);
  ctx.textAlign = align; ctx.fillStyle = accent;
  ctx.font = '700 23px Arial, sans-serif';
  ctx.fillText('ESTÉTICA  ·  INFORMAÇÃO & CUIDADO', x, baseY);
  ctx.fillStyle = primary;
  const family = slide.font === 'sans' ? 'Arial, sans-serif' : slide.font === 'classic' ? 'Manrope, Arial, sans-serif' : 'Georgia, serif';
  const titleSize = story ? 82 : 76;
  ctx.font = `700 ${titleSize}px ${family}`;
  const titleHeight = wrapCanvasText(ctx, slide.title, x, baseY + 112, maxWidth, titleSize * 1.13, story ? 3 : 2);
  ctx.fillStyle = accent; ctx.font = '600 34px Arial, sans-serif';
  const subtitleHeight = wrapCanvasText(ctx, slide.subtitle, x, baseY + 130 + titleHeight, maxWidth, 46, 2);
  const bodyFamily = slide.bodyFont === 'serif' ? 'Georgia, serif' : slide.bodyFont === 'classic' ? 'Manrope, Arial, sans-serif' : 'Arial, sans-serif';
  ctx.fillStyle = fg; ctx.globalAlpha = .88; ctx.font = `400 30px ${bodyFamily}`;
  wrapCanvasText(ctx, slide.body, x, baseY + 160 + titleHeight + subtitleHeight, maxWidth, 43, story ? 7 : 5);
  ctx.globalAlpha = 1; ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(100, canvas.height - 135); ctx.lineTo(220, canvas.height - 135); ctx.stroke();
  ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.font = '700 20px Arial, sans-serif';
  if (draft.brand.logo) {
    try {
      const logo = new Image();
      await new Promise((resolve, reject) => { logo.onload = resolve; logo.onerror = reject; logo.src = draft.brand.logo; });
      const ratio = Math.min(170 / logo.width, 70 / logo.height);
      ctx.drawImage(logo, canvas.width - 100 - logo.width * ratio, canvas.height - 125, logo.width * ratio, logo.height * ratio);
    } catch { showToast('Não foi possível usar o logotipo na exportação.', 'error'); return; }
  } else ctx.fillText('TAMI', 100, canvas.height - 95);
  ctx.fillStyle = accent; ctx.fillText('✦', draft.brand.logo ? canvas.width - 85 : 244, canvas.height - 95);
  canvas.toBlob((blob) => {
    if (!blob) return showToast('Não foi possível exportar a arte. Tente novamente.', 'error');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `estetica-pro-${draft.format}-slide-${activeSlideIndex + 1}.png`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    showToast(`PNG exportado em ${canvas.width} × ${canvas.height} px.`);
  }, 'image/png');
}
document.addEventListener('click', (event) => {
  const nav = event.target.closest('[data-page]');
  if (nav) { event.preventDefault(); setPage(nav.dataset.page); return; }
  const go = event.target.closest('[data-go]');
  if (go) { event.preventDefault(); setPage(go.dataset.go); return; }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === 'edit-finance-visit') {
    const visit = data.clientVisits.find((item) => item.id === id);
    const client = data.clients.find((item) => item.id === visit?.clientId);
    if (visit && client) crmVisitForm(client, visit, 'financeiro');
    return;
  }
  if (action === 'edit-visit-costs') {
    const visit = data.clientVisits.find((item) => item.id === id);
    if (visit) visitCostForm(visit);
    return;
  }
  if (action === 'whatsapp-approve' || action === 'whatsapp-adjust') {
    const draft = data.whatsappDrafts.find((item) => item.id === id);
    if (!draft) return;
    draft.status = action === 'whatsapp-approve' ? 'Revisado · não enviado' : 'Precisa de ajuste';
    if (!save()) return;
    renderPage('whatsapp');
    showToast(action === 'whatsapp-approve' ? 'Marcado como revisado. Nenhuma mensagem foi enviada.' : 'Rascunho marcado para ajuste. Nenhuma mensagem foi enviada.');
    return;
  }
  if (action === 'agenda-week') {
    agendaWeekOffset += Number(button.dataset.delta || 0);
    agendaSelectedDate = agendaWeekDates()[0].iso;
    renderPage('agenda'); return;
  }
  if (action === 'agenda-today') { agendaWeekOffset = 0; agendaSelectedDate = localDate(); renderPage('agenda'); return; }
  if (action === 'agenda-select-day') { agendaSelectedDate = button.dataset.date || localDate(); renderPage('agenda'); return; }
  if (action === 'chat-prompt') {
    const form = document.querySelector('#chat-form');
    const input = document.querySelector('#chat-input');
    if (!form || !input) return;
    input.value = button.dataset.prompt || '';
    submittingSuggestedQuestion = true;
    form.requestSubmit();
    return;
  }
  if (action === 'menu') { document.querySelector('#sidebar').classList.toggle('open'); return; }
  if (action === 'judicial-clear') { renderPage('juridico'); return; }
  if (action === 'identity-preview') { updateIdentityPreviews(); showToast('Pré-visualização atualizada. Salve para usar nos novos modelos.'); return; }
  if (action === 'identity-save') {
    const previous = data.identity;
    data.identity = normalizeIdentity(identityWorking);
    if (!save()) { data.identity = previous; return; }
    identityWorking = JSON.parse(JSON.stringify(data.identity)); updateIdentityPreviews();
    document.querySelector('#identity-feedback').textContent = 'Identidade salva neste navegador.';
    showToast('Identidade visual salva. Ela será aplicada aos próximos modelos.'); return;
  }
  if (action === 'identity-restore') {
    if (!window.confirm('Restaurar a identidade visual padrão? Esta alteração será salva e poderá ser editada novamente.')) return;
    identityWorking = JSON.parse(JSON.stringify(defaultIdentity)); data.identity = JSON.parse(JSON.stringify(defaultIdentity));
    if (save()) { renderPage('identidade'); showToast('Identidade padrão restaurada.'); }
    return;
  }
  if (action === 'identity-remove-logo') { identityWorking.logo = ''; renderPage('identidade'); updateIdentityPreviews(); showToast('Logotipo removido da prévia. Salve para confirmar.'); return; }
  if (action === 'nav-back') { if (routeCursor > 0) history.back(); return; }
  if (action === 'nav-forward') { if (routeCursor < routeStack.length - 1) history.forward(); return; }
  if (action === 'close-modal') { document.querySelector('#modal-host').innerHTML = ''; return; }
  if (action === 'new-strategist') { strategyFlow = { step: 'input', input: null, recommendations: [], planId: null }; renderPage('marketing'); return; }
  if (action === 'exit-strategist') { strategyFlow = null; renderPage('marketing'); return; }
  if (action === 'strategy-back-input') { if (strategyFlow) strategyFlow.step = 'input'; renderPage('marketing'); return; }
  if (action === 'strategy-back-options') { if (strategyFlow) strategyFlow.step = 'strategies'; renderPage('marketing'); return; }
  if (action === 'choose-strategy') { chooseStrategistPlan(button.dataset.strategy); return; }
  if (action === 'regenerate-plan-title') { updateStrategistPlan((plan) => window.EsteticaMarketingEngine.regenerateTitle(plan), 'Somente o título foi regenerado; os demais textos foram mantidos.'); return; }
  if (action === 'regenerate-plan-slide') {
    const index = Number(button.dataset.index);
    updateStrategistPlan((plan) => window.EsteticaMarketingEngine.regenerateSlide(plan, index), `Somente o slide ${index + 1} foi regenerado.`); return;
  }
  if (action === 'regenerate-plan-caption') { updateStrategistPlan((plan) => window.EsteticaMarketingEngine.regenerateCaption(plan), 'Somente a legenda foi regenerada.'); return; }
  if (action === 'save-strategy-plan') { const plan = data.strategyPlans.find((item) => item.id === strategyFlow?.planId); if (plan && saveStrategistPlan(plan)) showToast('Planejamento estratégico salvo neste navegador.'); return; }
  if (action === 'transfer-strategy-to-editor') { transferStrategistPlanToEditor(); return; }
  if (action === 'resume-strategy') {
    const plan = data.strategyPlans.find((item) => item.id === id); if (!plan) return showToast('Planejamento não encontrado.', 'error');
    const existing = data.drafts.find((item) => item.id === plan.editorDraftId);
    if (existing) { strategyFlow = null; activeDraftId = existing.id; activeSlideIndex = 0; pushEditorHistory(existing.id); renderPage('marketing'); }
    else { strategyFlow = { step: 'content', input: plan.context, recommendations: [], planId: plan.id, sourceLabel: plan.sourceLabel }; renderPage('marketing'); }
    return;
  }
  if (action === 'delete-strategy-plan') {
    if (!window.confirm('Excluir este planejamento estratégico salvo? O rascunho do editor, se existir, será preservado.')) return;
    data.strategyPlans = data.strategyPlans.filter((item) => item.id !== id); if (strategyFlow?.planId === id) strategyFlow = null;
    save(); renderPage('marketing'); showToast('Planejamento excluído; artes do editor preservadas.'); return;
  }
  if (action === 'submit-to-approval') {
    const draft = data.drafts.find((item) => item.id === activeDraftId); if (!draft) return;
    let approval = data.approvals.find((item) => item.id === draft.approvalItemId);
    if (!approval) { approval = { id: crypto.randomUUID(), type: 'Publicação para revisão profissional', title: draft.title, body: `${draft.caption}\n\nRevisão requerida: confira conteúdo, informações profissionais, regras publicitárias e direitos de imagem. Nenhum conteúdo será publicado externamente.`, status: 'Pendente', requiresProfessionalReview: true, professionalReviewConfirmed: false }; data.approvals.unshift(approval); draft.approvalItemId = approval.id; }
    else { approval.title = draft.title; approval.body = `${draft.caption}\n\nRevisão requerida: confira conteúdo, informações profissionais, regras publicitárias e direitos de imagem. Nenhum conteúdo será publicado externamente.`; approval.status = 'Pendente'; approval.professionalReviewConfirmed = false; }
    save(); setPage('aprovacoes'); showToast('Enviado à Central de Aprovações para revisão local. Nada foi publicado.'); return;
  }
  if (action === 'regenerate-editor-title' || action === 'regenerate-editor-slide' || action === 'regenerate-editor-caption') {
    const draft = data.drafts.find((item) => item.id === activeDraftId);
    if (!draft?.strategy || !draft.strategyContext) return showToast('Este rascunho não tem um planejamento estratégico local para regenerar.', 'error');
    if (action === 'regenerate-editor-title') {
      const regenerated = window.EsteticaMarketingEngine.regenerateTitle(draft);
      draft.title = regenerated.title; draft.slides[0].title = regenerated.slides[0].title; draft.revisions = regenerated.revisions;
    } else if (action === 'regenerate-editor-slide') {
      const index = Number(button.dataset.index);
      const regenerated = window.EsteticaMarketingEngine.regenerateSlide(draft, index);
      ['title', 'subtitle', 'body', 'composition', 'altText'].forEach((key) => { draft.slides[index][key] = regenerated.slides[index][key]; });
      draft.revisions = regenerated.revisions;
    } else {
      const regenerated = window.EsteticaMarketingEngine.regenerateCaption(draft);
      draft.caption = regenerated.caption; draft.revisions = regenerated.revisions;
    }
    save(); renderPage('marketing'); showToast('Somente o campo escolhido foi regenerado; suas demais edições foram preservadas.'); return;
  }
  if (action === 'new-appointment') { setPage('agenda'); appointmentForm({ date: agendaSelectedDate }); return; }
  if (action === 'edit-appointment') { appointmentForm(data.appointments.find((item) => item.id === id)); return; }
  if (action === 'crm-clients-tab') { crmCurrentTab = 'clientes'; crmActiveClientId = null; renderPage('crm'); return; }
  if (action === 'crm-occurrences-tab') { crmCurrentTab = 'ocorrencias'; crmActiveClientId = null; renderPage('crm'); return; }
  if (action === 'crm-back-to-list') { crmActiveClientId = null; renderPage('crm'); return; }
  if (action === 'new-crm-client') { crmClientForm(); return; }
  if (action === 'edit-crm-client') { const client = data.clients.find((item) => item.id === id); if (client) crmClientForm(client); return; }
  if (action === 'open-crm-client') { crmActiveClientId = id; crmCurrentTab = 'clientes'; renderPage('crm'); return; }
  if (action === 'delete-crm-client') {
    const client = data.clients.find((item) => item.id === id); if (!client) return;
    if (!window.confirm(`Excluir ${client.name}? o histórico de atendimentos será removido, os pagamentos permanecerão no Financeiro sem vínculo e compromissos/ocorrências serão desassociados.`)) return;
    const visits = data.clientVisits.filter((item) => item.clientId === id);
    visits.forEach((visit) => { releaseVisitAppointment(visit); releaseVisitPayment(visit); });
    data.clientVisits = data.clientVisits.filter((item) => item.clientId !== id);
    data.appointments.forEach((item) => { if (item.clientId === id) item.clientId = ''; });
    data.occurrences.forEach((item) => { if (item.clientId === id) item.clientId = ''; });
    data.transactions.forEach((item) => { if (item.clientId === id) item.clientId = ''; });
    data.clients = data.clients.filter((item) => item.id !== id); crmActiveClientId = null;
    save(); renderPage('crm'); showToast('Cadastro removido; registros financeiros e agenda foram preservados sem vínculo.'); return;
  }
  if (action === 'new-crm-visit') { const client = data.clients.find((item) => item.id === id); if (client) crmVisitForm(client); return; }
  if (action === 'edit-crm-visit') { const visit = data.clientVisits.find((item) => item.id === id); const client = data.clients.find((item) => item.id === visit?.clientId); if (visit && client) crmVisitForm(client, visit); return; }
  if (action === 'delete-crm-visit') {
    const visit = data.clientVisits.find((item) => item.id === id); if (!visit) return;
    if (!window.confirm('Excluir este atendimento do histórico? Um lançamento de pagamento criado por ele também será removido; pagamentos financeiros vinculados manualmente serão preservados e desassociados.')) return;
    releaseVisitPayment(visit); releaseVisitAppointment(visit); data.clientVisits = data.clientVisits.filter((item) => item.id !== id);
    save(); renderPage('crm'); showToast('Atendimento removido do histórico; os vínculos foram atualizados.'); return;
  }
  if (action === 'prepare-return-message') {
    const client = data.clients.find((item) => item.id === id); if (!client) return;
    openModal('Preparar contato · não enviado', `<p>Revise e copie manualmente se desejar. O sistema não enviará mensagens.</p><label>Mensagem editável<textarea id="return-message" rows="5">Olá, ${escapeHTML(client.name)}! Aqui é Tami. Estou passando para saber se gostaria de conversar sobre um próximo atendimento. Se preferir, posso informar os horários disponíveis. ✨</textarea></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Fechar</button><button type="button" class="primary-button" data-action="copy-return-message">Copiar mensagem</button></div>`); return;
  }
  if (action === 'copy-return-message') {
    const field = document.querySelector('#return-message');
    if (!field) return;
    if (!navigator.clipboard?.writeText) { field.focus(); field.select(); showToast('Área de transferência indisponível; selecione e copie a mensagem manualmente.', 'error'); return; }
    navigator.clipboard.writeText(field.value).then(() => showToast('Mensagem copiada. Nada foi enviado.')).catch(() => { field.focus(); field.select(); showToast('Não foi possível copiar automaticamente. Selecione e copie manualmente.', 'error'); }); return;
  }
  if (action === 'new-crm-occurrence') { crmOccurrenceForm(); return; }
  if (action === 'edit-crm-occurrence') { const record = data.occurrences.find((item) => item.id === id); if (record) crmOccurrenceForm(record); return; }
  if (action === 'toggle-occurrence-status') {
    const record = data.occurrences.find((item) => item.id === id); if (!record) return;
    record.status = button.dataset.status; record.updatedAt = new Date().toISOString(); save(); renderPage('crm'); showToast(`Ocorrência marcada como ${record.status.toLocaleLowerCase('pt-BR')}.`); return;
  }
  if (action === 'delete-crm-occurrence') {
    if (!window.confirm('Excluir este registro de ocorrência? Esta ação não pode ser desfeita.')) return;
    data.occurrences = data.occurrences.filter((item) => item.id !== id); save(); renderPage('crm'); showToast('Ocorrência excluída.'); return;
  }
  if (action === 'cancel-appointment') {
    const appointment = data.appointments.find((item) => item.id === id);
    if (appointment && appointment.status !== 'Cancelado') appointmentCancellationForm(appointment);
    return;
  }
  if (action === 'new-design' || action === 'new-draft') { newDesignDraft(button.dataset.format || 'post', button.dataset.kind || 'educativo'); return; }
  if (action === 'open-design' || action === 'edit-draft') {
    activeDraftId = id; activeSlideIndex = 0;
    const item = data.drafts.find((draft) => draft.id === id);
    if (item) { normalizeDraft(item); if (activePage !== 'marketing') setPage('marketing'); pushEditorHistory(id); activeDraftId = id; renderPage('marketing'); }
    return;
  }
  if (action === 'back-to-gallery') { if (history.state?.editorId) history.back(); else { activeDraftId = null; renderPage('marketing'); } return; }
  if (action === 'save-design') { const saved = save(); if (saved) { document.querySelector('#saved-indicator').textContent = 'Salvo agora'; showToast('Rascunho salvo neste navegador.'); } return; }
  if (action === 'export-png') { exportDesignPng(); return; }
  if (action === 'select-slide') { activeSlideIndex = Number(button.dataset.index); renderPage('marketing'); return; }
  if (action === 'add-slide') {
    const draft = data.drafts.find((item) => item.id === activeDraftId); if (!draft) return;
    const colors = draft.brand.colors;
    draft.slides.push({ title: 'Novo título', subtitle: 'Subtítulo editável', body: 'Escreva aqui o conteúdo deste slide.', bg: colors.background, textColor: colors.text, primary: colors.primary, secondary: colors.secondary, accent: colors.highlight, font: draft.brand.titleFont, bodyFont: draft.brand.bodyFont, align: 'left', image: '' });
    activeSlideIndex = draft.slides.length - 1; save(); renderPage('marketing'); return;
  }
  if (action === 'duplicate-slide') {
    const draft = data.drafts.find((item) => item.id === activeDraftId); if (!draft) return;
    draft.slides.splice(activeSlideIndex + 1, 0, { ...draft.slides[activeSlideIndex], title: `${draft.slides[activeSlideIndex].title} (cópia)` });
    activeSlideIndex += 1; save(); renderPage('marketing'); showToast('Slide duplicado.'); return;
  }
  if (action === 'move-slide') {
    const draft = data.drafts.find((item) => item.id === activeDraftId); if (!draft) return;
    const offset = button.dataset.direction === 'up' ? -1 : 1;
    const target = activeSlideIndex + offset;
    if (target < 0 || target >= draft.slides.length) return;
    [draft.slides[activeSlideIndex], draft.slides[target]] = [draft.slides[target], draft.slides[activeSlideIndex]];
    activeSlideIndex = target; save(); renderPage('marketing'); return;
  }
  if (action === 'delete-slide') {
    const draft = data.drafts.find((item) => item.id === activeDraftId); if (!draft || draft.slides.length <= 1) return;
    if (!window.confirm('Excluir este slide do rascunho?')) return;
    draft.slides.splice(activeSlideIndex, 1); activeSlideIndex = Math.max(0, activeSlideIndex - 1); save(); renderPage('marketing'); showToast('Slide removido.'); return;
  }
  if (action === 'remove-image') {
    const draft = data.drafts.find((item) => item.id === activeDraftId); if (draft) { draft.slides[activeSlideIndex].image = ''; save(); renderPage('marketing'); showToast('Imagem removida da arte.'); } return;
  }
  if (action === 'delete-draft') {
    if (!window.confirm('Excluir este rascunho de demonstração? Esta ação não pode ser desfeita.')) return;
    data.drafts = data.drafts.filter((item) => item.id !== id); if (activeDraftId === id) activeDraftId = null; save(); renderPage('marketing'); showToast('Rascunho excluído.'); return;
  }
  if (action === 'send-approval') {
    const draft = data.drafts.find((item) => item.id === id);
    if (draft) data.approvals.unshift({ id: crypto.randomUUID(), type: draft.type, title: draft.title, body: draft.body, status: 'Pendente' });
    save(); renderPage('marketing'); showToast('Rascunho adicionado à Central de Aprovações.'); return;
  }
  if (action === 'approval-status') {
    const item = data.approvals.find((record) => record.id === id);
    if (item?.requiresProfessionalReview && button.dataset.status === 'Aprovado' && button.dataset.reviewed !== 'true') { showToast('Marque todos os itens de revisão profissional antes de aprovar.', 'error'); return; }
    if (item) item.status = button.dataset.status;
    if (item?.requiresProfessionalReview && button.dataset.status === 'Aprovado') item.professionalReviewConfirmed = true;
    save(); renderPage('aprovacoes'); showToast(`Status atualizado para ${button.dataset.status}. Nada foi enviado.`); return;
  }
  if (action === 'new-transaction') { transactionForm(); return; }
  if (action === 'edit-transaction') { const item = data.transactions.find((record) => record.id === id); if (item) transactionForm(item); return; }
  if (action === 'add-visit-receipt') { const visit = data.clientVisits.find((record) => record.id === id); if (visit) receiptForm(visit); return; }
  if (action === 'delete-transaction') {
    const item = data.transactions.find((record) => record.id === id); if (!item) return;
    transactionCancellationForm(item); return;
  }
  const messages = { notifications: 'Você está em um ambiente de demonstração.', help: 'Explore as áreas pelo menu lateral.', settings: 'Use a engrenagem no canto superior direito para abrir as configurações.', profile: 'Perfil de demonstração: Tami.' };
  showToast(messages[action] || 'Esta ação não está disponível nesta demonstração.', action === 'settings' ? 'error' : 'success');
});
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!form.matches('form')) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  if (form.id === 'visit-cost-form') {
    const visit = data.clientVisits.find((item) => item.id === form.dataset.id);
    if (!visit) return showToast('Atendimento não encontrado; nenhum custo foi alterado.', 'error');
    const roomCost = String(values.roomCost || '').trim() ? parseMoney(values.roomCost) : null;
    const materialCost = String(values.materialCost || '').trim() ? parseMoney(values.materialCost) : null;
    if ([roomCost, materialCost].some((amount) => amount !== null && (!Number.isFinite(amount) || amount < 0))) return showToast('Informe custos válidos ou deixe o campo em branco.', 'error');
    visit.roomCost = roomCost;
    visit.materialCostSnapshot = materialCost;
    visit.roomCostSource = roomCost === null ? '' : 'manual';
    visit.materialCostSource = materialCost === null ? '' : 'manual';
    visit.costsUpdatedAt = new Date().toISOString();
    if (!save()) return;
    document.querySelector('#modal-host').innerHTML = '';
    renderPage('financeiro');
    showToast('Custos deste atendimento atualizados. Os valores padrão não foram alterados.');
    return;
  }
  if (form.id === 'whatsapp-draft-form') {
    const body = String(values.body || '').trim();
    if (body.length < 3) return showToast('Escreva uma mensagem com pelo menos 3 caracteres.', 'error');
    data.whatsappDrafts.push({ id: crypto.randomUUID(), category: String(values.category || 'Informação administrativa'), body, status: 'Aguardando aprovação da Tami', createdAt: new Date().toISOString() });
    if (!save()) return;
    renderPage('whatsapp'); showToast('Rascunho salvo localmente; nada foi enviado.'); return;
  }
  if (form.id === 'whatsapp-guardrails-form') {
    const messageCap = values.monthlyMessageCap.trim() ? parseMoney(values.monthlyMessageCap) : '';
    const aiCap = values.monthlyAiCap.trim() ? parseMoney(values.monthlyAiCap) : '';
    if ([messageCap, aiCap].some((amount) => amount !== '' && (!Number.isFinite(amount) || amount < 0))) return showToast('Informe valores válidos ou deixe o campo vazio.', 'error');
    data.whatsappSettings = { monthlyMessageCap: messageCap, monthlyAiCap: aiCap, requireApproval: true };
    if (!save()) return;
    renderPage('whatsapp'); showToast('Limites de planejamento salvos neste navegador. Ainda não bloqueiam cobranças.'); return;
  }
  if (form.id === 'transaction-cancellation-form') {
    const item = data.transactions.find((record) => record.id === form.dataset.id);
    const linkedVisit = data.clientVisits.find((visit) => visit.id === item?.sourceVisitId);
    const reason = String(values.reason || '').trim();
    if (!item || item.status === 'Cancelado' || reason.length < 3) return showToast('Informe o motivo do cancelamento.', 'error');
    if (linkedVisit && (!['sim', 'nao'].includes(values.materialUsed) || !['sim', 'nao'].includes(values.roomUsed))) return showToast('Informe se o material e a sala foram utilizados.', 'error');
    item.originalDescription ||= item.description;
    item.cancellationReason = reason;
    item.cancelledAt = new Date().toISOString();
    item.description = `${item.originalDescription} · Cancelado: ${reason}`;
    item.status = 'Cancelado';
    if (linkedVisit) {
      linkedVisit.cancellationReason = reason;
      linkedVisit.cancellationMaterialUsed = values.materialUsed === 'sim';
      linkedVisit.cancellationRoomUsed = values.roomUsed === 'sim';
      if (!linkedVisit.cancellationMaterialUsed) { linkedVisit.cancelledMaterialCostSnapshot ??= linkedVisit.materialCostSnapshot; linkedVisit.materialCostSnapshot = 0; }
      if (!linkedVisit.cancellationRoomUsed) { linkedVisit.cancelledRoomCostSnapshot ??= linkedVisit.roomCost; linkedVisit.roomCost = 0; }
      const received = receivedForVisit(linkedVisit);
      linkedVisit.chargedTotal = received;
      linkedVisit.paymentStatus = received > 0 ? 'pago' : 'pendente';
    }
    save(); document.querySelector('#modal-host').innerHTML = ''; renderPage(activePage); showToast('Motivo e uso de material/sala salvos; lançamento cancelado no histórico.'); return;
  }
  if (form.id === 'settings-form') {
    const hourlyRoomCost = values.hourlyRoomCost.trim() ? parseMoney(values.hourlyRoomCost) : '';
    if (hourlyRoomCost !== '' && (!Number.isFinite(hourlyRoomCost) || hourlyRoomCost < 0)) return showToast('Confira o valor do aluguel por hora.', 'error');
    const defaultDuration = values.defaultDuration.trim() ? Number(values.defaultDuration) : '';
    if (defaultDuration !== '' && (!Number.isFinite(defaultDuration) || defaultDuration <= 0)) return showToast('Confira a duração padrão.', 'error');
    const prior = data.settings.procedures || defaultSettings().procedures;
    const procedures = prior.map((procedure, index) => {
      const costRaw = form.querySelectorAll('[name="materialCost"]')[index].value.trim();
      const cost = costRaw ? parseMoney(costRaw) : '';
      if (cost !== '' && (!Number.isFinite(cost) || cost < 0)) return null;
      return { ...procedure, materials: form.querySelectorAll('[name="materials"]')[index].value.trim(), materialCost: cost };
    });
    if (procedures.some((item) => item === null)) return showToast('Confira os custos de materiais cadastrados.', 'error');
    data.settings = { businessName: values.businessName.trim(), taxRegime: values.taxRegime, hourlyRoomCost, defaultDuration, roomBillingMode: values.roomBillingMode, procedures };
    if (!save()) return;
    renderPage('configuracoes'); showToast('Configurações salvas neste navegador.'); return;
  }
  if (form.id === 'judicial-intake-form') {
    const guide = window.EsteticaJudicialEngine?.createGuide(values.category, values.context || '');
    if (!guide) return showToast('Não foi possível montar o roteiro. Atualize a página e tente novamente.', 'error');
    document.querySelector('#workspace-view').innerHTML = renderJudicialAgent(guide);
    document.querySelector('.judicial-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (form.id === 'strategy-input-form') {
    const topic = values.topic.trim();
    if (topic.length < 2) return showToast('Digite um assunto com pelo menos 2 caracteres.', 'error');
    const submit = form.querySelector('[type="submit"]');
    const loading = document.querySelector('#strategy-loading');
    if (submit) submit.disabled = true;
    if (loading) loading.textContent = 'Organizando opções estratégicas locais…';
    try {
      const input = {
        topic, audience: values.audience.trim(), goal: values.goal || 'educacao', stage: values.stage || 'descobrindo',
        format: values.format || 'auto', period: values.period || 'semanal',
        authorizedOffer: values.offerAuthorized === 'yes' ? values.authorizedOffer.trim() : ''
      };
      const result = await window.EsteticaMarketingEngine.generateViaServerAdapter(input, null);
      strategyFlow = { step: 'strategies', input, recommendations: result.strategies, sourceLabel: result.sourceLabel, planId: null };
      renderPage('marketing');
      showToast('Oito estratégias demonstrativas prontas para comparar.');
    } catch (error) {
      if (submit) submit.disabled = false;
      if (loading) loading.textContent = 'Não foi possível preparar as estratégias. Revise os campos e tente novamente.';
      showToast(error.message || 'Erro ao montar estratégias locais.', 'error');
    }
    return;
  }
  if (form.id === 'crm-client-form') {
    const name = values.name.trim();
    if (name.length < 2 || !values.firstVisit) return showToast('Informe um nome ou identificador e a data do primeiro atendimento.', 'error');
    const old = data.clients.find((item) => item.id === form.dataset.id);
    const client = { id: old?.id || crypto.randomUUID(), name, contact: values.contact.trim(), firstVisit: values.firstVisit, nextReturnDate: values.nextReturnDate || '', notes: values.notes.trim(), demo: old?.demo || false };
    if (old) data.clients = data.clients.map((item) => item.id === client.id ? client : item);
    else data.clients.unshift(client);
    crmActiveClientId = client.id; crmCurrentTab = 'clientes';
    if (!save()) return;
    document.querySelector('#modal-host').innerHTML = ''; renderPage('crm'); showToast(old ? 'Ficha atualizada e salva neste navegador.' : 'Cadastro salvo neste navegador.'); return;
  }
  if (form.id === 'crm-visit-form') {
    const client = data.clients.find((item) => item.id === form.dataset.clientId);
    const procedure = values.procedure.trim();
    const receivedValue = parseMoney(values.receivedValue);
    const chargedTotal = receivedValue;
    const durationMinutes = Number(values.durationMinutes);
    const durationHours = durationMinutes / 60;
    if (!client || procedure.length < 2 || !values.date || !Number.isFinite(receivedValue) || receivedValue < 0 || !Number.isInteger(durationMinutes) || durationMinutes < 1) return showToast('Informe procedimento, data, duração em minutos e um valor recebido válido.', 'error');
    const paymentStatus = 'pago';
    if (values.paymentMethod === 'cartao' && (!/^([1-9]|1[0-2])$/.test(values.installments))) return showToast('Escolha de 1 a 12 parcelas.', 'error');
    const old = data.clientVisits.find((item) => item.id === form.dataset.id);
    const procedureConfig = data.settings.procedures.find((item) => item.name === procedure);
    const roomRate = data.settings.hourlyRoomCost === '' ? null : Number(data.settings.hourlyRoomCost);
    const materialCost = procedureConfig?.materialCost === '' || procedureConfig?.materialCost == null ? null : Number(procedureConfig.materialCost);
    const sameProcedure = old && old.procedure === procedure;
    const sameCostBasis = old && old.procedure === procedure && Number(old.durationMinutes ?? Number(old.durationHours || 0) * 60) === durationMinutes;
    const appliedRoomRate = old?.roomRateSnapshot != null ? old.roomRateSnapshot : roomRate;
    const appliedMaterialCost = sameProcedure && old.materialCostSnapshot != null ? old.materialCostSnapshot : materialCost;
    const keepManualRoomCost = sameCostBasis && old.roomCostSource === 'manual';
    const keepManualMaterialCost = sameProcedure && old.materialCostSource === 'manual';
    const appliedRoomBillingMode = old?.roomBillingModeSnapshot || data.settings.roomBillingMode;
    const visit = { ...(old || {}), id: old?.id || crypto.randomUUID(), clientId: client.id, date: values.date, procedure, chargedTotal, paymentStatus, paymentMethod: 'pix', installments: 1, durationMinutes, durationHours, appointmentTime: values.appointmentTime || '', roomRateSnapshot: appliedRoomRate, roomBillingModeSnapshot: appliedRoomBillingMode, roomCost: keepManualRoomCost ? old.roomCost : appliedRoomRate == null ? null : roomCharge(appliedRoomRate, durationMinutes, appliedRoomBillingMode), roomCostSource: keepManualRoomCost ? 'manual' : appliedRoomRate == null ? '' : 'configuracoes', materialCostSnapshot: keepManualMaterialCost ? old.materialCostSnapshot : appliedMaterialCost, materialCostSource: keepManualMaterialCost ? 'manual' : appliedMaterialCost == null ? '' : 'configuracoes', adminNotes: values.adminNotes?.trim() || '', demo: old?.demo || false };
    const appointmentId = values.appointmentId || '';
    if (old?.appointmentId && old.appointmentId !== appointmentId) releaseVisitAppointment(old);
    if (appointmentId) {
      const appointment = data.appointments.find((item) => item.id === appointmentId);
      if (!appointment || (appointment.clientId && appointment.clientId !== client.id)) return showToast('Esse compromisso não está disponível para vínculo com esta ficha.', 'error');
      if (old?.appointmentId !== appointmentId) { visit.previousAppointmentStatus = appointment.status; visit.previousAppointmentClientId = appointment.clientId || ''; }
      visit.appointmentId = appointmentId; appointment.clientId = client.id; appointment.date = values.date; appointment.time = values.appointmentTime || appointment.time; appointment.durationMinutes = durationMinutes; appointment.status = 'Realizado';
    } else { visit.appointmentId = ''; visit.previousAppointmentStatus = ''; visit.previousAppointmentClientId = ''; }

    const existingReceipts = data.transactions.filter((item) => item.type === 'receita' && item.sourceVisitId === visit.id && item.status !== 'Cancelado').sort((a,b) => a.date.localeCompare(b.date));
    const currentReceived = existingReceipts.reduce((sum, item) => sum + Number(item.value || 0), 0);
    if (receivedValue < currentReceived && old) return showToast('Para reduzir o total recebido, edite ou cancele os recebimentos individuais no Financeiro. O histórico não foi alterado.', 'error');
    if (receivedValue > currentReceived) {
      const delta = Math.round((receivedValue - currentReceived) * 100) / 100;
      const lastReceipt = existingReceipts[existingReceipts.length - 1];
      if (old && lastReceipt) { lastReceipt.value = Math.round((Number(lastReceipt.value) + delta) * 100) / 100; lastReceipt.grossAmount = Number(lastReceipt.grossAmount ?? lastReceipt.value); lastReceipt.date = values.date; lastReceipt.paymentMethod = visit.paymentMethod; lastReceipt.installments = visit.installments; lastReceipt.description = `${procedure} · recebimento`; }
      else data.transactions.unshift({ id: crypto.randomUUID(), type: 'receita', description: `${procedure} · recebimento`, value: delta, grossAmount: delta, fees: 0, date: values.date, time: localTime(), clientId: client.id, sourceVisitId: visit.id, paymentMethod: visit.paymentMethod, installments: visit.installments, crmGenerated: true });
    }
    const linkedReceipts = data.transactions.filter((item) => item.type === 'receita' && item.status !== 'Cancelado' && item.sourceVisitId === visit.id);
    linkedReceipts.forEach((receipt) => { receipt.clientId = client.id; if (receipt.crmGenerated) receipt.description = `${procedure} · recebimento`; });
    const latestReceipt = linkedReceipts.sort((a,b) => b.date.localeCompare(a.date))[0];
    if (latestReceipt) { latestReceipt.paymentMethod = visit.paymentMethod; latestReceipt.installments = visit.installments; }
    visit.paymentIds = data.transactions.filter((item) => item.sourceVisitId === visit.id).map((item) => item.id);
    visit.transactionId = visit.paymentIds[0] || '';
    if (old) data.clientVisits = data.clientVisits.map((item) => item.id === visit.id ? visit : item);
    else data.clientVisits.unshift(visit);
    crmActiveClientId = client.id;
    if (!save()) return;
    document.querySelector('#modal-host').innerHTML = ''; renderPage(form.dataset.returnPage || 'crm'); showToast('Atendimento salvo; custos e resultado foram atualizados quando necessário.'); return;
  }
  if (form.id === 'crm-occurrence-form') {
    const description = values.description.trim(); const responsible = values.responsible.trim();
    if (description.length < 5 || responsible.length < 2 || !values.date) return showToast('Informe uma descrição factual, responsável e data.', 'error');
    const old = data.occurrences.find((item) => item.id === form.dataset.id);
    const record = { id: old?.id || crypto.randomUUID(), clientId: values.clientId || '', date: values.date, category: values.category, description, actions: values.actions.trim(), status: values.status, responsible, updatedAt: new Date().toISOString() };
    if (old) data.occurrences = data.occurrences.map((item) => item.id === record.id ? record : item);
    else data.occurrences.unshift(record);
    if (!save()) return;
    document.querySelector('#modal-host').innerHTML = ''; crmCurrentTab = 'ocorrencias'; renderPage('crm'); showToast(old ? 'Ocorrência corrigida e salva.' : 'Ocorrência registrada neste navegador.'); return;
  }
  if (form.id === 'theme-form') {
    const theme = values.theme.trim();
    if (theme.length < 3) return showToast('Escreva um tema com pelo menos 3 caracteres.', 'error');
    newDesignDraft(values.format, values.kind, theme);
    const draft = data.drafts.find((item) => item.id === activeDraftId);
    if (draft) {
      draft.slides[0].subtitle = 'Sugestão de estrutura · revise antes de usar';
      draft.slides[0].body = suggestionOutline(theme, values.kind);
      draft.caption = `Uma conversa sobre ${theme}. Informação geral e cuidado responsável, respeitando a individualidade.`;
      save(); renderPage('marketing');
      showToast('Estrutura local criada a partir do tema. Não foi usada IA externa.');
    }
    return;
  }
  if (form.id === 'chat-form') {
    const message = values.message.trim();
    if (!message) return showToast('Digite uma mensagem antes de enviar.', 'error');
    if (!submittingSuggestedQuestion) chatSuggestionsDismissed = true;
    submittingSuggestedQuestion = false;
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const previousMessages = data.chat.slice(-12);
    const response = window.SecretariaLocal?.reply(message, { ...data, chat: previousMessages }, now)
      || 'O módulo de respostas locais não carregou. Atualize esta página e tente novamente; nenhum dado foi enviado.';
    data.chat.push({ from: 'you', text: message, time });
    data.chat.push({ from: 'assistant', text: response, time });
    save(); renderPage('secretaria');
    document.querySelector('#chat-log').scrollTop = document.querySelector('#chat-log').scrollHeight;
    document.querySelector('#chat-input').focus();
    return;
  }
  if (form.id === 'appointment-form') {
    const durationMinutes = String(values.durationMinutes || '').trim() ? Number(values.durationMinutes) : '';
    if (durationMinutes !== '' && (!Number.isInteger(durationMinutes) || durationMinutes < 1)) return showToast('Informe a duração em minutos como um número inteiro positivo.', 'error');
    const durationHours = durationMinutes === '' ? '' : durationMinutes / 60;
    const item = { ...(data.appointments.find((record) => record.id === form.dataset.id) || {}), id: form.dataset.id || crypto.randomUUID(), title: values.title.trim(), date: values.date, time: values.time, durationMinutes, durationHours, status: values.status, clientId: values.clientId || '' };
    if (form.dataset.id) data.appointments = data.appointments.map((record) => record.id === item.id ? item : record);
    else data.appointments.push(item);
    save(); agendaSelectedDate = values.date; agendaWeekOffset = agendaOffsetForDate(values.date); document.querySelector('#modal-host').innerHTML = ''; renderPage('agenda'); showToast('Compromisso salvo na agenda demonstrativa.'); return;
  }
  if (form.id === 'appointment-cancellation-form') {
    const appointment = data.appointments.find((item) => item.id === form.dataset.id);
    const procedure = data.settings.procedures.find((item) => item.name === values.procedure);
    const durationMinutes = Number(values.durationMinutes);
    const durationHours = durationMinutes / 60;
    if (!appointment || appointment.status === 'Cancelado' || !procedure || !values.reason.trim() || !Number.isInteger(durationMinutes) || durationMinutes < 1 || !['sim', 'nao'].includes(values.materialUsed) || !['sim', 'nao'].includes(values.roomUsed)) return showToast('Confira o motivo, procedimento, duração em minutos e situação da sala.', 'error');
    const materialCost = procedure.materialCost === '' || procedure.materialCost == null ? null : Number(procedure.materialCost);
    const roomRate = data.settings.hourlyRoomCost === '' ? null : Number(data.settings.hourlyRoomCost);
    if (values.materialUsed === 'sim' && materialCost == null) return showToast('Cadastre o custo de materiais desse procedimento em Configurações antes de registrar o gasto.', 'error');
    if (values.roomUsed === 'sim' && roomRate == null) return showToast('Cadastre o aluguel por hora em Configurações antes de registrar o prejuízo da sala.', 'error');
    const materialExpense = values.materialUsed === 'sim' ? Math.round(materialCost * 100) / 100 : 0;
    const roomExpense = values.roomUsed === 'sim' ? roomCharge(roomRate, durationMinutes) : 0;
    Object.assign(appointment, { status: 'Cancelado', cancellationReason: values.reason.trim(), cancelledAt: new Date().toISOString(), cancellationProcedure: procedure.name, cancellationMaterialUsed: values.materialUsed === 'sim', cancellationRoomUsed: values.roomUsed === 'sim', cancellationDurationMinutes: durationMinutes, cancellationDurationHours: durationHours, cancellationMaterialExpense: materialExpense, cancellationRoomExpense: roomExpense });
    const expenses = [];
    if (materialExpense > 0) expenses.push({ type: 'despesa', description: `Material utilizado em atendimento cancelado · ${procedure.name} · ${appointment.cancellationReason}`, value: materialExpense, category: 'material-cancelamento' });
    if (roomExpense > 0) expenses.push({ type: 'despesa', description: `Sala utilizada em atendimento cancelado · ${appointment.title} · ${appointment.cancellationReason}`, value: roomExpense, category: 'sala-cancelamento' });
    expenses.forEach((expense) => data.transactions.unshift({ id: crypto.randomUUID(), ...expense, date: localDate(), time: localTime(), appointmentId: appointment.id, clientId: appointment.clientId || '', cancellationReason: appointment.cancellationReason, demo: appointment.demo || false }));
    save(); agendaSelectedDate = appointment.date; agendaWeekOffset = agendaOffsetForDate(appointment.date); document.querySelector('#modal-host').innerHTML = ''; renderPage('agenda'); showToast('Cancelamento e custos registrados no histórico.'); return;
  }
  if (form.id === 'draft-form') {
    const item = { id: form.dataset.id || crypto.randomUUID(), type: values.type, title: values.title.trim(), body: values.body.trim(), updatedAt: new Date().toISOString() };
    if (form.dataset.id) data.drafts = data.drafts.map((record) => record.id === item.id ? item : record);
    else data.drafts.unshift(item);
    save(); document.querySelector('#modal-host').innerHTML = ''; renderPage('marketing'); showToast('Rascunho salvo neste navegador.'); return;
  }
  if (form.id === 'transaction-form') {
    const value = parseMoney(values.value);
    if (!Number.isFinite(value) || value <= 0 || !values.date) return showToast('Informe um valor positivo válido (ex.: 1.250,50) e uma data.', 'error');
    const editing = data.transactions.find((item) => item.id === form.dataset.id);
    const visitId = form.dataset.sourceVisit || editing?.sourceVisitId || '';
    const visit = data.clientVisits.find((item) => item.id === visitId);
    if (visitId && !visit) return showToast('Atendimento vinculado não encontrado; nenhum dado foi alterado.', 'error');
    const type = editing?.sourceVisitId ? 'receita' : (values.type || editing?.type || 'receita');
    const method = values.paymentMethod || editing?.paymentMethod || '';
    const grossAmount = values.grossAmount === undefined || String(values.grossAmount).trim() === '' ? Number(editing?.grossAmount ?? value) : parseMoney(values.grossAmount);
    const fees = values.fees === undefined || String(values.fees).trim() === '' ? Number(editing?.fees || 0) : parseMoney(values.fees);
    if (!Number.isFinite(grossAmount) || grossAmount < 0 || !Number.isFinite(fees) || fees < 0) return showToast('Confira o valor bruto e as taxas; use valores iguais ou maiores que zero.', 'error');
    const record = { ...(editing || {}), id: editing?.id || crypto.randomUUID(), type, description: visit ? (editing?.description || `${visit.procedure} · recebimento`) : values.description.trim(), value, date: values.date, time: values.time || editing?.time || (editing ? '' : localTime()), clientId: visit?.clientId || (values.clientId || editing?.clientId || ''), ...(visit ? { sourceVisitId: visit.id, paymentMethod: method || visit.paymentMethod, installments: Number(values.installments || editing?.installments || visit.installments || 1), grossAmount, fees, crmGenerated: true } : {}) };
    if (editing) data.transactions = data.transactions.map((item) => item.id === editing.id ? record : item);
    else data.transactions.unshift(record);
    if (visit) { visit.paymentIds = data.transactions.filter((item) => item.sourceVisitId === visit.id).map((item) => item.id); visit.transactionId = visit.paymentIds[0] || ''; visit.chargedTotal = receivedForVisit(visit); visit.paymentStatus = 'pago'; visit.paymentMethod = record.paymentMethod || visit.paymentMethod; visit.installments = record.installments || visit.installments; }
    save(); document.querySelector('#modal-host').innerHTML = ''; renderPage(activePage === 'crm' ? 'crm' : 'financeiro'); showToast(editing ? 'Lançamento atualizado sem criar duplicidade.' : visit ? 'Recebimento registrado e vinculado ao atendimento.' : 'Lançamento salvo e saldo atualizado.');
  }
});
document.addEventListener('input', (event) => {
  const visitForm = event.target.closest('#crm-visit-form');
  if (visitForm && ['chargedTotal', 'receivedValue'].includes(event.target.name)) {
    const charged = parseMoney(visitForm.elements?.chargedTotal?.value ?? visitForm.querySelector('[name="chargedTotal"]')?.value);
    const received = parseMoney(visitForm.elements?.receivedValue?.value ?? visitForm.querySelector('[name="receivedValue"]')?.value);
    const status = visitForm.querySelector('[name="paymentStatus"]');
    if (status && Number.isFinite(charged) && Number.isFinite(received) && charged > 0 && received >= 0 && received <= charged) status.value = received === 0 ? 'pendente' : received === charged ? 'pago' : 'parcialmente-pago';
  }
  if (event.target.id === 'crm-search') { crmSearchTerm = event.target.value; applyCRMFilters(); return; }
  const brandField = event.target.closest('[data-identity-field]');
  if (brandField && brandField.dataset.identityField !== 'logo-file') {
    const key = brandField.dataset.identityField;
    if (key.startsWith('color-')) {
      identityWorking.colors[key.slice(6)] = safeColor(brandField.value, defaultIdentity.colors[key.slice(6)]);
      const code = brandField.parentElement.querySelector('code');
      if (code) code.textContent = brandField.value.toUpperCase();
    }
    else identityWorking[key] = brandField.value;
    const feedback = document.querySelector('#identity-feedback');
    if (feedback) feedback.textContent = 'Alterações ainda não salvas. Use Visualizar alterações ou Salvar identidade.';
    return;
  }
  const field = event.target.closest('[data-editor-field]');
  if (!field || field.dataset.editorField === 'image-file') return;
  const draft = data.drafts.find((item) => item.id === activeDraftId);
  if (!draft) return;
  normalizeDraft(draft);
  const name = field.dataset.editorField;
  if (['caption', 'hashtags', 'cta', 'concept', 'coverSuggestion', 'graphicElements', 'visualDirections'].includes(name)) draft[name] = field.value;
  else {
    if (name === 'bg' || name === 'textColor' || name === 'accent') draft.slides[activeSlideIndex][name] = safeColor(field.value, '#f3eee4');
    else draft.slides[activeSlideIndex][name] = field.value;
    if (name === 'title' && activeSlideIndex === 0 && draft.strategy) draft.title = field.value;
  }
  save(); updateArtPreview();
  const indicator = document.querySelector('#saved-indicator');
  if (indicator) indicator.textContent = 'Salvo automaticamente';
});
document.addEventListener('change', (event) => {
  const field = event.target;
  if (field.name === 'paymentStatus' && field.closest('#crm-visit-form')) {
    const form = field.closest('#crm-visit-form');
    const charged = parseMoney(form.querySelector('[name="chargedTotal"]')?.value);
    const received = form.querySelector('[name="receivedValue"]');
    if (field.value === 'pago' && Number.isFinite(charged)) received.value = moneyInput(charged);
    if (field.value === 'pendente') received.value = '0,00';
    return;
  }
  if (field.id === 'crm-status-filter') { crmStatusFilter = field.value; applyCRMFilters(); return; }
  if (field.id === 'crm-rank-period') { crmRankPeriod = field.value; renderPage('crm'); return; }
  if (field.matches('[data-review-check]')) {
    const card = field.closest('.record-card');
    const checks = [...card.querySelectorAll('[data-review-check]')];
    const approve = card.querySelector('[data-status="Aprovado"]');
    const reviewed = checks.length > 0 && checks.every((item) => item.checked);
    if (approve) { approve.disabled = !reviewed; approve.dataset.reviewed = reviewed ? 'true' : 'false'; }
    return;
  }
  if (field.matches('[data-identity-field="logo-file"]')) {
    const logoFile = field.files?.[0];
    if (!logoFile) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(logoFile.type) || logoFile.size > 400 * 1024) {
      field.value = ''; showToast('Escolha um logotipo PNG, JPG ou WebP de até 400 KB.', 'error'); return;
    }
    const logoReader = new FileReader();
    logoReader.onload = () => {
      identityWorking.logo = String(logoReader.result);
      renderPage('identidade'); updateIdentityPreviews();
      showToast('Logotipo carregado localmente. Salve a identidade para persistir.');
    };
    logoReader.onerror = () => showToast('Não foi possível abrir o logotipo.', 'error');
    logoReader.readAsDataURL(logoFile);
    return;
  }
  if (!field.matches('[data-editor-field="image-file"]')) return;
  const file = field.files?.[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
    field.value = '';
    showToast('Escolha PNG, JPG ou WebP com até 1 MB.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const draft = data.drafts.find((item) => item.id === activeDraftId);
    if (!draft) return;
    draft.slides[activeSlideIndex].image = String(reader.result);
    const stored = save(); renderPage('marketing');
    showToast(stored ? 'Imagem adicionada à pré-visualização local.' : 'Imagem aberta na sessão, mas não foi possível salvá-la localmente.', stored ? 'success' : 'error');
  };
  reader.onerror = () => showToast('Não foi possível abrir essa imagem.', 'error');
  reader.readAsDataURL(file);
});
function syncRouteFromBrowser() {
  const state = history.state || {};
  const name = pageNames[state.appPage] ? state.appPage : pageNames[location.hash.slice(1)] ? location.hash.slice(1) : 'inicio';
  if (routeStack[routeCursor - 1] === name) routeCursor -= 1;
  else if (routeStack[routeCursor + 1] === name) routeCursor += 1;
  else if (routeStack[routeCursor] !== name) { routeStack = [...routeStack.slice(0, routeCursor + 1), name]; routeCursor = routeStack.length - 1; }
  setPage(name, false);
  if (state.editorId && data.drafts.some((draft) => draft.id === state.editorId)) {
    activeDraftId = state.editorId; activeSlideIndex = 0; renderPage('marketing');
  }
}
window.addEventListener('popstate', syncRouteFromBrowser);
window.addEventListener('hashchange', () => { if (location.hash.slice(1) !== activePage) syncRouteFromBrowser(); });
const day = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
document.querySelector('#today-label').textContent = day.format(new Date()).toLocaleUpperCase('pt-BR');
history.replaceState({ appPage: activePage }, '', `#${activePage}`);
setPage(activePage, false);
updateCounts();
