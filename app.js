const pageNames = {
  inicio: 'Visão geral', secretaria: 'Secretária virtual', crm: 'CRM de Clientes', marketing: 'Marketing', identidade: 'Identidade Visual',
  agenda: 'Agenda', aprovacoes: 'Aprovações', financeiro: 'Financeiro'
};
const pageCopy = {
  inicio: ['Bom dia, Tami Linda', 'Aqui está o resumo do seu espaço hoje.'],
  secretaria: ['Secretária virtual', 'Uma conversa simulada para organizar tarefas administrativas.'],
  crm: ['CRM de Clientes', 'Organize históricos e retornos com dados demonstrativos ou autorizados.'],
  marketing: ['Marketing do seu espaço', 'Planeje conteúdos e edite suas peças em um fluxo só.'],
  identidade: ['Identidade Visual', 'Configure as cores, fontes e o logotipo da sua marca.'],
  agenda: ['Sua agenda', 'Gerencie compromissos de demonstração neste navegador.'],
  aprovacoes: ['Central de aprovações', 'Aprovar ou rejeitar só altera o status nesta demonstração.'],
  financeiro: ['Seu financeiro', 'Lançamentos e saldo fictícios, salvos neste navegador.']
};
const storageKey = 'estetica-pro-ia-demo-v1';
const defaultIdentity = {
  colors: { primary: '#172B43', secondary: '#D9CDB9', background: '#F3EEE4', text: '#393B3E', highlight: '#B6975A' },
  titleFont: 'serif', bodyFont: 'sans', logo: ''
};
const localDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const offsetDate = (days) => {
  const date = new Date(); date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
function makeCRMExamples() {
  const clients = [
    { id: 'crm-demo-client-01', name: 'Exemplo demonstrativo 01', contact: '', firstVisit: offsetDate(-540), nextReturnDate: offsetDate(-4), notes: 'Registro fictício para demonstração.', demo: true, active: true },
    { id: 'crm-demo-client-02', name: 'Exemplo demonstrativo 02', contact: '', firstVisit: offsetDate(-240), nextReturnDate: offsetDate(12), notes: 'Registro fictício para demonstração.', demo: true, active: true },
    { id: 'crm-demo-client-03', name: 'Exemplo demonstrativo 03', contact: '', firstVisit: `${localDate().slice(0, 7)}-01`, nextReturnDate: '', notes: 'Registro fictício para demonstração.', demo: true, active: true }
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
  return { clients, visits, transactions, occurrences: [] };
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
    { id: crypto.randomUUID(), type: 'receita', description: 'Receita demonstrativa', value: 850, date: localDate() },
    { id: crypto.randomUUID(), type: 'despesa', description: 'Despesa demonstrativa', value: 125, date: localDate() },
    ...crm.transactions
  ],
  clients: crm.clients, clientVisits: crm.visits, occurrences: crm.occurrences,
  chat: [], strategyPlans: []
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
      return saved;
    }
  } catch (error) { console.warn('Dados locais de demonstração inválidos; serão recriados.', error); }
  return makeInitialData();
}
let data = loadData();
// A conversa existe apenas durante esta sessão e nunca fica no armazenamento local.
data.chat = [];
if (!data.identity) data.identity = JSON.parse(JSON.stringify(defaultIdentity));
data.identity = normalizeIdentity(data.identity);
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
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const money = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const parseMoney = (value) => {
  const raw = String(value ?? '').trim().replace(/R\$\s?/gi, '').replace(/\s/g, '');
  if (!raw || !/^(\d{1,3}(\.\d{3})*|\d+)?(,\d{0,2})?$/.test(raw)) return NaN;
  return Number(raw.replace(/\./g, '').replace(',', '.'));
};
const moneyInput = (value) => Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  document.querySelectorAll('.nav-item[data-page]').forEach((item) => {
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
    primary.innerHTML = '<span>✦</span> Criar post com IA';
  } else if (name === 'inicio' || name === 'agenda') {
    primary.hidden = false; primary.dataset.action = 'new-appointment'; primary.removeAttribute('data-format');
    primary.innerHTML = '<span>＋</span> Novo agendamento';
  } else primary.hidden = true;
  const overview = name === 'inicio';
  document.querySelector('#overview-view').hidden = !overview;
  const view = document.querySelector('#workspace-view');
  view.hidden = overview;
  if (!overview) renderPage(name);
  updateHistoryButtons();
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
  if (page === 'financeiro') view.innerHTML = renderFinance();
}
function renderChat() {
  const messages = data.chat.map((item) => `<div class="chat-message ${item.from === 'you' ? 'from-you' : 'from-assistant'}"><small>${item.from === 'you' ? 'Você' : 'Secretária demonstrativa'} · ${escapeHTML(item.time)}</small><p>${escapeHTML(item.text)}</p></div>`).join('');
  return `<section class="panel module-panel"><div class="panel-heading"><div><p class="eyebrow">CONVERSA LOCAL</p><h2>Secretária virtual</h2></div><span class="ai-tag">SIMULAÇÃO</span></div><div class="notice-box">Respostas gratuitas por regras locais. Não há IA generativa, WhatsApp ou serviço externo conectado. A conversa fica disponível nesta sessão e é apagada ao atualizar a página.</div><div class="chat-log" id="chat-log">${messages || '<div class="chat-empty">Olá, Tami! Posso consultar seus compromissos e lançamentos demonstrativos, além de orientar sobre Marketing e Aprovações. Escreva uma mensagem para começar. ✨</div>'}</div><form class="inline-form chat-form" id="chat-form"><label class="sr-only" for="chat-input">Sua mensagem</label><input id="chat-input" name="message" maxlength="500" placeholder="Pergunte sobre agenda, marketing ou financeiro…" required><button class="primary-button">Enviar <span>→</span></button></form><p class="form-hint">Use apenas dados fictícios. Não informe dados de pacientes ou clientes.</p></section>`;
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
  return `<section class="strategist-launch"><div class="strategist-launch-copy"><span class="strategist-spark">✦</span><div><p class="eyebrow">PLANEJAMENTO DE CONTEÚDO · MODO DEMONSTRATIVO</p><h2>Criar post com IA</h2><p>Comece com um assunto. Compare estratégias e leve a publicação completa para o Estúdio Visual.</p></div></div><button class="primary-button" data-action="new-strategist">✦ Criar post com IA</button><div class="strategist-local-note"><span class="demo-badge"><i></i> SUGESTÕES LOCAIS</span><span>Não há IA conectada. Nada será publicado automaticamente.</span></div>${savedPlans ? `<div class="strategy-saved-list"><div class="strategy-saved-heading"><strong>Planejamentos salvos</strong><small>${(data.strategyPlans || []).length} no navegador</small></div><div class="strategy-saved-grid">${savedPlans}</div></div>` : ''}</section>`;
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
    logo: typeof value?.logo === 'string' && /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value.logo) ? value.logo : ''
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
  return `<section class="identity-page"><div class="identity-intro"><div><p class="eyebrow">MARCA · CONFIGURAÇÃO LOCAL</p><h2>Uma identidade que parece sua.</h2><p>Ajuste a paleta, as fontes e o logotipo. As mudanças salvas serão usadas em novos modelos de marketing.</p></div><span class="identity-seal">e<span>✦</span></span></div><div class="notice-box identity-notice">Sua marca e seu logotipo ficam neste navegador. As artes antigas não são alteradas automaticamente.</div><div class="identity-workspace"><section class="panel identity-controls"><div class="panel-heading"><div><p class="eyebrow">SISTEMA VISUAL</p><h2>Personalize sua marca</h2></div><span class="identity-local-tag">SALVO LOCALMENTE</span></div><div class="identity-color-grid">${colorFields.map(([key, label]) => `<label class="identity-color-field"><span>${label}</span><span class="color-input-wrap"><input type="color" data-identity-field="color-${key}" value="${identity.colors[key]}"><code>${identity.colors[key].toUpperCase()}</code></span></label>`).join('')}</div><div class="identity-font-grid">${fontSelect('titleFont', 'Fonte dos títulos', identity.titleFont)}${fontSelect('bodyFont', 'Fonte dos textos', identity.bodyFont)}</div><div class="identity-logo-box"><div><strong>Logotipo da marca</strong><p>PNG, JPG ou WebP · até 400 KB</p></div>${identity.logo ? `<img class="identity-logo-thumb" src="${escapeHTML(identity.logo)}" alt="Logotipo carregado">` : '<span class="logo-empty">LOGO</span>'}<label class="logo-upload-button">${identity.logo ? 'Trocar arquivo' : 'Carregar logotipo'}<input type="file" data-identity-field="logo-file" accept="image/png,image/jpeg,image/webp"></label>${identity.logo ? '<button class="secondary-button danger" data-action="identity-remove-logo">Remover</button>' : ''}<small>O arquivo fica no armazenamento local do navegador; o espaço é limitado e compartilhado com os rascunhos.</small></div><div class="identity-actions"><button class="secondary-button" data-action="identity-restore">Restaurar padrão</button><button class="secondary-button" data-action="identity-preview">Visualizar alterações</button><button class="primary-button" data-action="identity-save">Salvar identidade</button></div><p class="identity-feedback" id="identity-feedback">Prévia mostra as configurações salvas.</p></section><section class="panel identity-preview-panel"><div class="panel-heading"><div><p class="eyebrow">APLICAÇÃO DA MARCA</p><h2>Pré-visualização</h2></div><span class="type-label">ARTE DEMONSTRATIVA</span></div><div class="identity-preview-stack title-${identity.titleFont} body-${identity.bodyFont}" id="identity-preview" style="${brandStyle(identity)}"><article class="identity-post"><div class="identity-post-top"><span class="identity-logo-slot">${identity.logo ? `<img src="${escapeHTML(identity.logo)}" alt="Logotipo">` : 'TAMI LINDA'}</span><span class="identity-post-mark">✦</span></div><div class="identity-post-copy"><small>INFORMAÇÃO & CUIDADO</small><h3>O cuidado começa<br>com uma boa conversa.</h3><p>Conteúdo educativo feito com escuta, clareza e responsabilidade.</p></div><div class="identity-post-bottom"><span>ESTÉTICA · BEM-ESTAR</span><i></i></div></article><article class="identity-carousel"><div class="identity-carousel-side"><span>02 / 03</span><div class="carousel-line"></div><strong>Informação<br>também é<br>acolhimento.</strong><small>CADA HISTÓRIA É ÚNICA</small></div><div class="carousel-brand">${identity.logo ? `<img src="${escapeHTML(identity.logo)}" alt="Logotipo">` : 'TAMI LINDA'}<span>✦</span></div></article></div><p class="preview-caption">Exemplos originais de um post e um slide de carrossel.</p></section></div></section>`;
}
function updateIdentityPreviews() {
  const container = document.querySelector('#identity-preview');
  const feedback = document.querySelector('#identity-feedback');
  if (!container) return;
  container.className = `identity-preview-stack title-${identityWorking.titleFont} body-${identityWorking.bodyFont}`;
  container.setAttribute('style', brandStyle(identityWorking));
  container.querySelectorAll('.identity-logo-slot,.carousel-brand').forEach((slot) => {
    if (identityWorking.logo) slot.innerHTML = `<img src="${escapeHTML(identityWorking.logo)}" alt="Logotipo">${slot.classList.contains('carousel-brand') ? '<span>✦</span>' : ''}`;
    else slot.textContent = slot.classList.contains('carousel-brand') ? 'TAMI LINDA ✦' : 'TAMI LINDA';
  });
  if (feedback) feedback.textContent = 'Prévia atualizada. Salve para aplicar aos novos modelos.';
}
function renderDesignEditor(draft) {
  const slide = draft.slides[Math.min(activeSlideIndex, draft.slides.length - 1)];
  activeSlideIndex = Math.min(activeSlideIndex, draft.slides.length - 1);
  const format = artFormats.find((item) => item.key === draft.format) || artFormats[0];
  return `<section class="design-editor"><div class="editor-toolbar"><button class="secondary-button" data-action="back-to-gallery">← Galeria</button><div><span class="type-label">${format.label} · ${format.size} px</span><span class="saved-indicator" id="saved-indicator">Rascunho salvo</span></div><div class="toolbar-actions"><button class="secondary-button" data-action="save-design">Salvar</button><button class="primary-button" data-action="export-png">↓ Exportar PNG</button></div></div><div class="editor-grid"><section class="editor-panel panel"><div class="editor-panel-heading"><div><p class="eyebrow">CONTEÚDO DA ARTE</p><h3>Slide ${activeSlideIndex + 1} de ${draft.slides.length}</h3></div><span class="record-date">${escapeHTML(draft.type)}</span></div><div class="slide-manager">${draft.slides.map((entry, index) => `<button class="slide-thumb ${index === activeSlideIndex ? 'selected' : ''}" data-action="select-slide" data-index="${index}" aria-label="Selecionar slide ${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHTML(entry.title || 'Slide sem título')}</b></button>`).join('')}<button class="slide-add" data-action="add-slide">＋ Adicionar slide</button></div><div class="slide-tools"><button class="secondary-button" data-action="move-slide" data-direction="up" ${activeSlideIndex === 0 ? 'disabled' : ''}>↑ Mover</button><button class="secondary-button" data-action="move-slide" data-direction="down" ${activeSlideIndex === draft.slides.length - 1 ? 'disabled' : ''}>↓ Mover</button><button class="secondary-button" data-action="duplicate-slide">Duplicar</button><button class="secondary-button danger" data-action="delete-slide" ${draft.slides.length <= 1 ? 'disabled title="O modelo precisa manter ao menos um slide"' : ''}>Excluir</button></div><div class="editor-fields"><label>Título<input data-editor-field="title" maxlength="80" value="${escapeHTML(slide.title)}"></label><label>Subtítulo<input data-editor-field="subtitle" maxlength="100" value="${escapeHTML(slide.subtitle)}"></label><label>Texto da arte<textarea data-editor-field="body" rows="4" maxlength="700">${escapeHTML(slide.body)}</textarea></label><div class="field-pair"><label>Fundo<input data-editor-field="bg" type="color" value="${safeColor(slide.bg, '#f3eee4')}"></label><label>Texto<input data-editor-field="textColor" type="color" value="${safeColor(slide.textColor, '#172b43')}"></label><label>Detalhe<input data-editor-field="accent" type="color" value="${safeColor(slide.accent, '#b6975a')}"></label></div><div class="field-pair"><label>Fonte do título<select data-editor-field="font"><option value="serif" ${slide.font === 'serif' ? 'selected' : ''}>Editorial</option><option value="sans" ${slide.font === 'sans' ? 'selected' : ''}>Sem serifa</option><option value="classic" ${slide.font === 'classic' ? 'selected' : ''}>Clássica</option></select></label><label>Fonte do texto<select data-editor-field="bodyFont"><option value="sans" ${slide.bodyFont === 'sans' ? 'selected' : ''}>Moderna</option><option value="serif" ${slide.bodyFont === 'serif' ? 'selected' : ''}>Editorial</option><option value="classic" ${slide.bodyFont === 'classic' ? 'selected' : ''}>Clássica</option></select></label><label>Alinhamento<select data-editor-field="align"><option value="left" ${slide.align === 'left' ? 'selected' : ''}>Esquerda</option><option value="center" ${slide.align === 'center' ? 'selected' : ''}>Centro</option><option value="right" ${slide.align === 'right' ? 'selected' : ''}>Direita</option></select></label></div><label>Imagem da arte<input data-editor-field="image-file" type="file" accept="image/png,image/jpeg,image/webp"><small>Imagem local de até 1 MB. Use fotos próprias ou com autorização.</small></label>${slide.image ? '<button class="secondary-button" data-action="remove-image">Remover imagem</button>' : ''}</div></section><section class="preview-panel"><div class="preview-heading"><div><p class="eyebrow">PRÉ-VISUALIZAÇÃO</p><h3>Arte ${activeSlideIndex + 1}</h3></div><span>Atualiza enquanto você edita</span></div><div class="preview-stage"><div id="art-preview" class="art-preview format-${draft.format}" style="--art-bg:${safeColor(slide.bg, '#f3eee4')};--art-text:${safeColor(slide.textColor, '#172b43')};--art-primary:${safeColor(slide.primary, '#172b43')};--art-secondary:${safeColor(slide.secondary, '#d9cdb9')};--art-accent:${safeColor(slide.accent, '#b6975a')};--art-align:${slide.align};--art-image:${slide.image ? `url('${slide.image}')` : 'none'}"><div class="art-image ${slide.image ? 'has-image' : ''}"></div><div class="art-decoration"></div><div class="art-copy font-${slide.font} body-${slide.bodyFont}"><span class="art-kicker">ESTÉTICA · INFORMAÇÃO & CUIDADO</span><h2 id="preview-title">${escapeHTML(slide.title)}</h2><h3 id="preview-subtitle">${escapeHTML(slide.subtitle)}</h3><p id="preview-body">${escapeHTML(slide.body)}</p><span class="art-signature">${draft.brand.logo ? `<img src="${draft.brand.logo}" alt="Logotipo">` : 'TAMI LINDA'} <i>✦</i></span></div></div></div><div class="caption-fields"><label>Legenda (separada da arte)<textarea data-editor-field="caption" rows="3" maxlength="2000">${escapeHTML(draft.caption)}</textarea></label><label>Hashtags editáveis<input data-editor-field="hashtags" maxlength="300" value="${escapeHTML(draft.hashtags)}"></label></div></section></div><div class="notice-box editor-safety-note">Estrutura demonstrativa de conteúdo. Revise informações profissionais antes de usar. Não inclua promessas de resultado nem dados de pacientes.</div></section>`;
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
    return `<tr class="crm-client-row" data-search="${escapeHTML(search)}" data-status="${active ? 'ativo' : 'inativo'}"><td><button class="crm-name-button" data-action="open-crm-client" data-id="${client.id}">${escapeHTML(client.name)}</button>${client.demo ? '<small class="crm-demo-label">Registro fictício de demonstração</small>' : ''}</td><td>${displayDate(client.firstVisit)}</td><td>${visitsByClient.get(client.id) || 0}</td><td><small>Cobrado</small> ${money(chargedByClient.get(client.id) || 0)}<small>Recebido</small> ${money(paymentByClient.get(client.id) || 0)}</td><td>${escapeHTML(returnText)}</td><td><button class="secondary-button" data-action="open-crm-client" data-id="${client.id}">Abrir ficha</button></td></tr>`;
  }).join('') : '';
  const returns = summary.returns;
  return `<section class="crm-page"><div class="crm-heading"><div><p class="eyebrow">RELACIONAMENTO · DADOS LOCAIS</p><h2>CRM de Clientes</h2><p>Históricos administrativos, pagamentos associados e previsões revisáveis.</p></div><button class="primary-button" data-action="new-crm-client">＋ Cadastrar cliente</button></div><div class="notice-box crm-privacy-note"><strong>Demonstração local · dados fictícios identificados.</strong> Os registros de exemplo são sintéticos. Este protótipo não tem login nem controle de acesso por usuário; qualquer pessoa com acesso a este navegador pode ver os dados locais. Registre apenas informações necessárias e autorizadas. Não inclua detalhes clínicos.</div><div class="crm-metrics"><article class="crm-metric"><span>Total cadastrados</span><strong>${summary.total}</strong><small>Inclui registros demonstrativos claramente marcados</small></article><article class="crm-metric"><span>Ativos</span><strong>${activeLabel}</strong><small>Definição: atendimento registrado nos últimos 12 meses</small></article><article class="crm-metric"><span>Novos neste mês</span><strong>${summary.newThisMonth}</strong><small>Pela data do primeiro atendimento</small></article><article class="crm-metric"><span>Total cobrado</span><strong>${money(summary.charged)}</strong><small>Valor informado nos atendimentos</small></article><article class="crm-metric"><span>Total recebido</span><strong>${money(summary.revenue)}</strong><small>Recebimentos efetivos ativos no Financeiro</small></article><article class="crm-metric crm-oldest"><span>Mais tempo na base</span><strong>${oldestLabel}</strong><small>Ordenado pelo primeiro atendimento</small></article><article class="crm-metric"><span>Retornos próximos ou vencidos</span><strong>${returns.length}</strong><small>Manual ou estimado · revise antes de entrar em contato</small></article></div><div class="crm-columns"><section class="panel crm-panel"><div class="panel-heading"><div><p class="eyebrow">BASE LOCAL</p><h3>Clientes</h3></div><span class="record-date">${clients.length} registro(s)</span></div><div class="crm-filters"><label class="crm-search-label">Pesquisar<input id="crm-search" type="search" value="${escapeHTML(crmSearchTerm)}" placeholder="Nome ou contato"></label><label>Situação<select id="crm-status-filter"><option value="todos" ${crmStatusFilter === 'todos' ? 'selected' : ''}>Todos</option><option value="ativo" ${crmStatusFilter === 'ativo' ? 'selected' : ''}>Ativos</option><option value="inativo" ${crmStatusFilter === 'inativo' ? 'selected' : ''}>Sem atendimento no último ano</option></select></label></div>${list ? `<div class="table-wrap crm-table-wrap"><table class="crm-table"><thead><tr><th>Nome</th><th>Primeiro atendimento</th><th>Atendimentos</th><th>Cobrado / recebido</th><th>Próximo retorno</th><th></th></tr></thead><tbody>${list}</tbody></table></div>` : '<div class="empty-state"><strong>Nenhum cliente cadastrado</strong><p>Cadastre apenas dados necessários e autorizados. Use nomes fictícios para testar.</p><button class="primary-button" data-action="new-crm-client">＋ Cadastrar primeiro cliente</button></div>'}</section><section class="panel crm-panel crm-return-panel"><div class="panel-heading"><div><p class="eyebrow">ACOMPANHAMENTO</p><h3>Retornos</h3></div><span class="record-date">Até 30 dias</span></div>${returns.length ? `<div class="crm-return-list">${returns.map((item) => `<article class="crm-return-row"><div><strong>${escapeHTML(item.client.name)}</strong><span>${item.daysUntil < 0 ? `Vencido há ${Math.abs(item.daysUntil)} dia(s)` : item.daysUntil === 0 ? 'Previsto para hoje' : `Em ${item.daysUntil} dia(s)`} · ${displayDate(item.date)}</span><small class="${item.source === 'estimated' ? 'crm-estimated' : 'crm-manual'}">${item.source === 'estimated' ? `Estimativa pela média de ${item.averageDays} dias entre atendimentos` : 'Data informada manualmente'}</small></div><div class="crm-return-actions"><button class="secondary-button" data-action="open-crm-client" data-id="${item.client.id}">Ficha</button><button class="secondary-button" data-action="prepare-return-message" data-id="${item.client.id}">Preparar mensagem</button></div></article>`).join('')}</div>` : '<div class="empty-state compact"><strong>Nenhum retorno próximo</strong><p>Previsões aparecem aqui quando vencidas ou nos próximos 30 dias.</p></div>'}</section></div>${renderCRMRankings()}`;
}
function renderCRMRankings() {
  const rankings = window.CrmLocal.rankings({ clients: data.clients, visits: data.clientVisits, transactions: data.transactions, period: crmRankPeriod, today: localDate() });
  const periodOptions = [['all', 'Todo o histórico'], ['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias'], ['365', 'Últimos 12 meses']].map(([value, label]) => `<option value="${value}" ${crmRankPeriod === value ? 'selected' : ''}>${label}</option>`).join('');
  const rankList = (title, criterion, items, value) => `<article class="panel crm-rank-card"><div><h4>${title}</h4><small>${criterion}</small></div>${items.length ? `<ol>${items.slice(0, 5).map((item) => `<li><span>${escapeHTML(item.client.name)}</span><strong>${escapeHTML(value(item))}</strong></li>`).join('')}</ol>` : '<div class="empty-state compact"><p>Sem dados suficientes neste período.</p></div>'}</article>`;
  const tenure = [...rankings.tenure].sort((a, b) => a.client.firstVisit.localeCompare(b.client.firstVisit));
  const oldestLabel = (item) => `${displayDate(item.client.firstVisit)} · ${Math.max(0, Math.floor((new Date(`${localDate()}T12:00:00`) - new Date(`${item.client.firstVisit}T12:00:00`)) / 86400000))} dias`;
  return `<section class="crm-rankings"><div class="crm-section-heading"><div><p class="eyebrow">VISÃO DA BASE</p><h3>Rankings de relacionamento</h3><p>Os rankings mostram somente nome e critério, sem contato ou ocorrências.</p></div><label>Período<select id="crm-rank-period">${periodOptions}</select></label></div><div class="crm-rank-grid">${rankList('Maior valor cobrado', 'Soma do total cobrado por atendimento no período', rankings.spending, (item) => money(item.charged))}${rankList('Maior valor recebido', 'Soma dos recebimentos efetivos registrados no período', rankings.received, (item) => money(item.received))}${rankList('Mais tempo na base', 'Primeiro atendimento entre clientes com atividade no período', tenure, oldestLabel)}${rankList('Mais atendimentos', 'Quantidade de históricos de atendimento no período', rankings.attendance, (item) => `${item.visits} atendimento(s)`)}${rankList('Maior frequência de retorno', 'Intervalo médio equivalente a atendimentos por mês; exige pelo menos dois registros no período', rankings.frequency, (item) => `${item.monthlyFrequency.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}/mês`)}</div><p class="crm-method-note">Cobrado vem dos atendimentos; recebido vem somente dos lançamentos de pagamento ativos no Financeiro.</p></section>`;
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
  return `<section class="crm-page crm-profile"><div class="crm-profile-top"><button class="secondary-button" data-action="crm-back-to-list">← Lista e indicadores</button><div class="crm-heading"><div><p class="eyebrow">FICHA ADMINISTRATIVA</p><h2>${escapeHTML(client.name)} ${client.demo ? '<span class="crm-demo-label">Demonstração</span>' : ''}</h2><p>Dados mínimos para acompanhamento de relacionamento.</p></div><div class="crm-profile-actions"><button class="secondary-button" data-action="prepare-return-message" data-id="${client.id}">Preparar contato</button><button class="secondary-button" data-action="edit-crm-client" data-id="${client.id}">Editar ficha</button><button class="secondary-button danger" data-action="delete-crm-client" data-id="${client.id}">Excluir cadastro</button></div></div></div><div class="notice-box crm-privacy-note">Sem controle de acesso por usuário nesta versão local. Não inclua dados sensíveis ou clínicos nas observações.</div><div class="crm-profile-metrics"><article><span>Primeiro atendimento</span><strong>${displayDate(client.firstVisit)}</strong></article><article><span>Atendimentos registrados</span><strong>${visits.length}</strong></article><article><span>Total cobrado</span><strong>${money(charged)}</strong></article><article><span>Total efetivamente recebido</span><strong>${money(total)}</strong></article><article><span>Saldo pendente</span><strong>${money(pending)}</strong></article><article><span>Ticket médio recebido</span><strong>${money(average)}</strong></article><article><span>Último procedimento</span><strong>${last ? `${displayDate(last.date)} · ${escapeHTML(last.procedure)}` : 'Sem histórico'}</strong></article><article><span>Próximo retorno</span><strong>${forecast.date ? `${displayDate(forecast.date)} · ${forecast.source === 'estimated' ? 'estimado' : 'manual'}` : 'Sem previsão'}</strong><small>${forecast.source === 'estimated' ? `Média de ${forecast.averageDays} dias entre atendimentos. Corrija no cadastro quando necessário.` : forecast.source === 'manual' ? 'Data informada manualmente; edite para corrigir.' : 'Ainda não há atendimentos suficientes para estimar.'}</small></article></div><div class="crm-profile-grid"><section class="panel crm-panel"><div class="panel-heading"><div><p class="eyebrow">HISTÓRICO</p><h3>Atendimentos e pagamentos</h3></div><button class="primary-button" data-action="new-crm-visit" data-id="${client.id}">＋ Registrar atendimento</button></div>${visits.length ? `<div class="table-wrap"><table class="crm-table"><thead><tr><th>Data</th><th>Procedimento/serviço</th><th>Cobrado</th><th>Recebido / saldo</th><th>Agenda</th><th></th></tr></thead><tbody>${visits.map((visit) => { const receipts = data.transactions.filter((item) => item.sourceVisitId === visit.id && item.type === 'receita'); const received = receivedForVisit(visit); const linkedAppointment = data.appointments.find((item) => item.id === visit.appointmentId); return `<tr><td>${displayDate(visit.date)}${visit.demo ? '<small class="crm-demo-label">Fictício</small>' : ''}</td><td>${escapeHTML(visit.procedure)}${visit.adminNotes ? `<small>${escapeHTML(visit.adminNotes)}</small>` : ''}<small>${escapeHTML(visit.paymentStatus || 'pendente')} · ${escapeHTML(visit.paymentMethod || '—')}${visit.paymentMethod === 'cartao' ? ` · ${visit.installments || 1}x` : ''}</small></td><td>${money(visit.chargedTotal || 0)}</td><td>${money(received)} / ${money(Math.max(0, Number(visit.chargedTotal || 0) - received))}${receipts.map((receipt) => `<small>${displayDate(receipt.date)} · recebido ${money(receipt.value)}${receipt.paymentMethod === 'cartao' ? ` · ${receipt.installments || 1}x` : ''} <button class="secondary-button" data-action="edit-transaction" data-id="${receipt.id}">Editar</button></small>`).join('')}<button class="secondary-button" data-action="add-visit-receipt" data-id="${visit.id}">＋ Recebimento</button></td><td>${linkedAppointment ? 'Compromisso vinculado' : '—'}</td><td><button class="secondary-button" data-action="edit-crm-visit" data-id="${visit.id}">Editar</button><button class="secondary-button danger" data-action="delete-crm-visit" data-id="${visit.id}">Excluir</button></td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty-state compact"><strong>Sem atendimentos registrados</strong><p>O histórico começa quando você adiciona um atendimento.</p></div>'}</section><section class="panel crm-panel"><div class="panel-heading"><div><p class="eyebrow">OBSERVAÇÕES</p><h3>Notas administrativas</h3></div></div><p class="crm-notes">${client.notes ? escapeHTML(client.notes) : 'Nenhuma observação administrativa cadastrada.'}</p><p class="form-hint">Use apenas informação administrativa necessária; não registre detalhes clínicos.</p></section></div></section>`;
}
function renderCRMOccurrences() {
  const records = [...data.occurrences].sort((a, b) => b.date.localeCompare(a.date));
  return `<section class="crm-page"><div class="crm-heading"><div><p class="eyebrow">REGISTRO INTERNO</p><h2>Ocorrências e pendências</h2><p>Descrições factuais e providências administrativas.</p></div><button class="primary-button" data-action="new-crm-occurrence">＋ Registrar ocorrência</button></div><div class="notice-box crm-privacy-note"><strong>Acesso e privacidade:</strong> este protótipo não possui login nem permissões por usuário, portanto não pode restringir tecnicamente esta área. Use somente registros fictícios ou autorizados. Evite detalhes clínicos, dados sensíveis, julgamentos pessoais e rótulos ofensivos.</div>${records.length ? `<div class="crm-occurrence-list">${records.map((record) => { const client = data.clients.find((item) => item.id === record.clientId); return `<article class="panel crm-occurrence"><div class="crm-occurrence-head"><div><span class="crm-category">${escapeHTML(record.category)}</span><h3>${client ? escapeHTML(client.name) : 'Registro sem cliente associado'}</h3></div><span class="status ${record.status === 'Resolvida' ? 'confirmed' : 'pending'}">${escapeHTML(record.status)}</span></div><div class="crm-occurrence-meta"><span>Data: ${displayDate(record.date)}</span><span>Responsável pelo registro: ${escapeHTML(record.responsible)}</span></div><p><strong>Descrição factual</strong><br>${escapeHTML(record.description)}</p><p><strong>Providências</strong><br>${escapeHTML(record.actions || 'Nenhuma providência registrada.')}</p><div class="record-actions"><button class="secondary-button" data-action="edit-crm-occurrence" data-id="${record.id}">Corrigir / editar</button><button class="secondary-button" data-action="toggle-occurrence-status" data-id="${record.id}" data-status="${record.status === 'Resolvida' ? 'Pendente' : 'Resolvida'}">${record.status === 'Resolvida' ? 'Reabrir' : 'Marcar resolvida'}</button><button class="secondary-button danger" data-action="delete-crm-occurrence" data-id="${record.id}">Excluir</button></div></article>`; }).join('')}</div>` : '<div class="empty-state"><strong>Nenhuma ocorrência registrada</strong><p>Registre apenas fatos administrativos relevantes e necessários.</p><button class="primary-button" data-action="new-crm-occurrence">＋ Registrar ocorrência</button></div>'}</section>`;
}

function renderAgenda() {
  const sorted = [...data.appointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  return `<section class="panel module-panel"><div class="panel-heading"><div><p class="eyebrow">COMPROMISSOS FICTÍCIOS</p><h2>Agenda demonstrativa</h2></div><button class="primary-button" data-action="new-appointment">＋ Novo compromisso</button></div><div class="notice-box">Agenda apenas local. Não conectada a calendários externos. Use descrições fictícias, sem dados de clientes.</div>${sorted.length ? `<div class="table-wrap"><table><thead><tr><th>Data</th><th>Horário</th><th>Descrição</th><th>Status</th><th>Ações</th></tr></thead><tbody>${sorted.map((item) => `<tr><td>${displayDate(item.date)}</td><td>${escapeHTML(item.time)}</td><td>${escapeHTML(item.title)}</td><td><span class="status ${item.status === 'Cancelado' ? 'rejected' : item.status === 'A confirmar' ? 'pending' : 'confirmed'}">${escapeHTML(item.status)}</span></td><td class="table-actions"><button class="secondary-button" data-action="edit-appointment" data-id="${item.id}">Editar</button><button class="secondary-button danger" data-action="cancel-appointment" data-id="${item.id}">Cancelar</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state"><span>▦</span><strong>Nenhum compromisso cadastrado</strong><p>Adicione um horário fictício para experimentar a agenda.</p><button class="primary-button" data-action="new-appointment">＋ Adicionar compromisso</button></div>'}</section>`;
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
  const active = data.transactions.filter((item) => item.status !== 'Cancelado');
  const income = active.filter((item) => item.type === 'receita').reduce((sum, item) => sum + Number(item.value), 0);
  const expense = active.filter((item) => item.type === 'despesa').reduce((sum, item) => sum + Number(item.value), 0);
  const pending = data.clientVisits.reduce((sum, visit) => sum + Math.max(0, Number(visit.chargedTotal || 0) - receivedForVisit(visit)), 0);
  return `<section class="panel module-panel"><div class="panel-heading"><div><p class="eyebrow">CONTROLE SIMULADO</p><h2>Financeiro demonstrativo</h2></div><button class="primary-button" data-action="new-transaction">＋ Novo lançamento</button></div><div class="notice-box">Valores fictícios para demonstração. Parcelas futuras não são consideradas recebidas até o registro de cada recebimento.</div><div class="finance-summary"><article><span>Recebido</span><strong class="positive">${money(income)}</strong></article><article><span>Despesas</span><strong class="negative">${money(expense)}</strong></article><article><span>Saldo demonstrativo</span><strong>${money(income - expense)}</strong></article><article><span>Saldo pendente do CRM</span><strong>${money(pending)}</strong></article></div>${data.transactions.length ? `<div class="table-wrap"><table><thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor recebido</th><th>Forma / parcela</th><th>Ação</th></tr></thead><tbody>${[...data.transactions].sort((a, b) => b.date.localeCompare(a.date)).map((item) => `<tr><td>${displayDate(item.date)}</td><td>${escapeHTML(item.description)}${item.sourceVisitId ? '<small>Vinculado ao CRM</small>' : ''}${item.status === 'Cancelado' ? '<small>Cancelado</small>' : ''}</td><td><span class="type-label ${item.type}">${item.type === 'receita' ? 'Receita' : 'Despesa'}</span></td><td class="${item.type === 'receita' ? 'positive' : 'negative'}">${money(item.value)}</td><td>${item.paymentMethod ? `${escapeHTML(item.paymentMethod)}${item.paymentMethod === 'cartao' ? ` · ${item.installments || 1}x` : ''}` : '—'}</td><td><button class="secondary-button" data-action="edit-transaction" data-id="${item.id}" ${item.status === 'Cancelado' ? 'disabled' : ''}>Editar</button><button class="secondary-button danger" data-action="delete-transaction" data-id="${item.id}" ${item.status === 'Cancelado' ? 'disabled' : ''}>Cancelar</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty-state"><span>R$</span><strong>Nenhum lançamento cadastrado</strong><p>Adicione receitas e despesas fictícias para ver o saldo.</p><button class="primary-button" data-action="new-transaction">＋ Novo lançamento</button></div>'}</section>`;
}
function openModal(title, content) {
  const host = document.querySelector('#modal-host');
  host.innerHTML = `<div class="modal-backdrop"><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="panel-heading"><h2 id="modal-title">${title}</h2><button type="button" class="modal-close" data-action="close-modal" aria-label="Fechar">×</button></div>${content}</section></div>`;
  host.querySelector('.modal-backdrop').addEventListener('click', (event) => { if (event.target === event.currentTarget) host.innerHTML = ''; });
  host.querySelector('input, textarea, select')?.focus();
}
function appointmentForm(item = {}) {
  const clients = data.clients.map((client) => `<option value="${client.id}" ${item.clientId === client.id ? 'selected' : ''}>${escapeHTML(client.name)}${client.demo ? ' · demonstração' : ''}</option>`).join('');
  openModal(item.id ? 'Editar compromisso' : 'Novo compromisso', `<form id="appointment-form" data-id="${item.id || ''}" class="modal-form"><label>Descrição fictícia<input name="title" required maxlength="80" value="${escapeHTML(item.title || '')}" placeholder="Ex.: horário demonstrativo"></label><label>Cliente associado (opcional)<select name="clientId"><option value="">Sem associação com o CRM</option>${clients}</select></label><div class="form-row"><label>Data<input name="date" type="date" required value="${item.date || localDate()}"></label><label>Horário<input name="time" type="time" required value="${item.time || '09:00'}"></label></div><label>Status<select name="status"><option ${item.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option><option ${item.status === 'A confirmar' ? 'selected' : ''}>A confirmar</option><option ${item.status === 'Realizado' ? 'selected' : ''}>Realizado</option></select></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Salvar compromisso</button></div></form>`);
}
function draftForm(item = {}) {
  openModal(item.id ? 'Editar rascunho' : 'Novo rascunho', `<form id="draft-form" data-id="${item.id || ''}" class="modal-form"><label>Tipo<select name="type" required>${['Legenda para Instagram', 'Ideia de Reels', 'Campanha'].map((type) => `<option ${item.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label><label>Título<input name="title" required maxlength="80" value="${escapeHTML(item.title || '')}" placeholder="Dê um nome para sua ideia"></label><label>Texto<textarea name="body" required maxlength="1500" rows="5" placeholder="Escreva seu rascunho…">${escapeHTML(item.body || '')}</textarea></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Salvar rascunho</button></div></form>`);
}
function transactionForm(item = {}) {
  const clients = data.clients.map((client) => `<option value="${client.id}" ${item.clientId === client.id ? 'selected' : ''}>${escapeHTML(client.name)}${client.demo ? ' · demonstração' : ''}</option>`).join('');
  openModal(item.id ? 'Editar lançamento' : 'Novo lançamento', `<form id="transaction-form" data-id="${item.id || ''}" class="modal-form"><label>Tipo<select name="type" ${item.sourceVisitId ? 'disabled' : ''}><option value="receita" ${item.type !== 'despesa' ? 'selected' : ''}>Receita</option><option value="despesa" ${item.type === 'despesa' ? 'selected' : ''}>Despesa</option></select></label><label>Descrição<input name="description" required maxlength="80" value="${escapeHTML(item.description || '')}" placeholder="Ex.: material demonstrativo"></label><label>Associar ao CRM (opcional)<select name="clientId" ${item.sourceVisitId ? 'disabled' : ''}><option value="">Sem cliente associado</option>${clients}</select></label><div class="form-row"><label>Valor recebido / despesa (R$)<input name="value" type="text" inputmode="decimal" required value="${item.id ? moneyInput(item.value) : ''}" placeholder="0,00"></label><label>Data<input name="date" type="date" required value="${item.date || localDate()}"></label></div>${item.sourceVisitId ? `<p class="form-hint">Recebimento vinculado ao atendimento. Valor cobrado do cliente: ${money(data.clientVisits.find(v => v.id === item.sourceVisitId)?.chargedTotal || 0)}. ${item.paymentMethod === 'cartao' ? `<label>Valor bruto desta parcela<input name="grossAmount" type="text" inputmode="decimal" value="${moneyInput(item.grossAmount ?? item.value)}"></label><label>Taxas/juros desta parcela<input name="fees" type="text" inputmode="decimal" value="${moneyInput(item.fees)}"></label><label>Forma<select name="paymentMethod"><option value="cartao" selected>Cartão de crédito</option><option value="pix">PIX</option><option value="dinheiro">Dinheiro</option></select></label><label>Parcelamento original<select name="installments">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${Number(item.installments||1)===i+1?'selected':''}>${i+1}x</option>`).join('')}</select></label>` : ''}</p>` : ''}<p class="form-hint">Valores demonstrativos editáveis em reais. Um recebimento não representa parcelas futuras.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Voltar</button><button class="primary-button">Salvar lançamento</button></div></form>`);
}
function receiptForm(visit) {
  const client = data.clients.find((item) => item.id === visit.clientId);
  const remaining = Math.max(0, Number(visit.chargedTotal || 0) - receivedForVisit(visit));
  openModal('Registrar recebimento', `<form id="transaction-form" data-source-visit="${visit.id}" class="modal-form"><label>Cliente<input value="${escapeHTML(client?.name || 'Cliente')} · ${escapeHTML(visit.procedure)}" readonly></label><label>Valor efetivamente recebido (R$)<input name="value" type="text" inputmode="decimal" required value="${moneyInput(remaining)}" placeholder="0,00"></label><div class="form-row"><label>Valor bruto deste recebimento<input name="grossAmount" type="text" inputmode="decimal" value="${moneyInput(remaining)}"></label><label>Taxas/juros deste recebimento<input name="fees" type="text" inputmode="decimal" value="0,00"></label></div><label>Data do recebimento<input name="date" type="date" required value="${localDate()}"></label><label>Forma<select name="paymentMethod"><option value="${visit.paymentMethod || 'pix'}">${visit.paymentMethod === 'cartao' ? 'Cartão de crédito' : visit.paymentMethod === 'dinheiro' ? 'Dinheiro' : 'PIX'}</option><option value="pix">PIX</option><option value="dinheiro">Dinheiro</option><option value="cartao">Cartão de crédito</option></select></label><label>Parcelamento original (se cartão)<select name="installments">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${Number(visit.installments||1)===i+1?'selected':''}>${i+1}x</option>`).join('')}</select></label><p class="form-hint">Saldo atual do atendimento: ${money(remaining)}. Registre somente o valor recebido nesta data; parcelas futuras não entram automaticamente.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="primary-button">Registrar recebimento</button></div></form>`);
}
function crmClientForm(client = {}) {
  openModal(client.id ? 'Editar ficha de cliente' : 'Cadastrar cliente', `<form id="crm-client-form" data-id="${client.id || ''}" class="modal-form"><label>Nome ou identificador<input name="name" required maxlength="80" value="${escapeHTML(client.name || '')}" placeholder="Use dados necessários e autorizados"></label><label>Contato (opcional)<input name="contact" maxlength="120" value="${escapeHTML(client.contact || '')}" placeholder="Telefone ou e-mail, se necessário"></label><label>Data do primeiro atendimento<input name="firstVisit" type="date" required value="${client.firstVisit || localDate()}"></label><label>Previsão manual do próximo retorno (opcional)<input name="nextReturnDate" type="date" value="${client.nextReturnDate || ''}"><small>Se deixar vazio, o sistema poderá estimar pela média dos atendimentos registrados.</small></label><label>Observações administrativas<textarea name="notes" rows="3" maxlength="600" placeholder="Somente informações administrativas necessárias; não inclua detalhes clínicos.">${escapeHTML(client.notes || '')}</textarea></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="primary-button">Salvar ficha</button></div></form>`);
}
function crmVisitForm(client, visit = {}) {
  const appointments = data.appointments.filter((item) => item.clientId === client.id && item.status !== 'Cancelado' && (!data.clientVisits.some((other) => other.appointmentId === item.id && other.id !== visit.id) || item.id === visit.appointmentId));
  const appointmentOptions = appointments.map((item) => `<option value="${item.id}" ${visit.appointmentId === item.id ? 'selected' : ''}>${displayDate(item.date)} às ${escapeHTML(item.time)} · ${escapeHTML(item.title)}</option>`).join('');
  const received = visit.id ? receivedForVisit(visit) : 0;
  openModal(visit.id ? 'Editar atendimento' : 'Registrar atendimento', `<form id="crm-visit-form" data-id="${visit.id || ''}" data-client-id="${client.id}" class="modal-form"><label>Cliente<input value="${escapeHTML(client.name)}" readonly></label><label>Procedimento / serviço registrado<input name="procedure" required maxlength="100" value="${escapeHTML(visit.procedure || '')}" placeholder="Descrição objetiva e mínima"></label><label>Data do atendimento<input name="date" type="date" required value="${visit.date || localDate()}"></label><label>Valor total cobrado (R$)<input name="chargedTotal" type="text" inputmode="decimal" required value="${visit.id ? moneyInput(visit.chargedTotal) : ''}" placeholder="0,00"></label><div class="form-row"><label>Status do pagamento<select name="paymentStatus"><option value="pago" ${visit.paymentStatus==='pago'?'selected':''}>Pago</option><option value="parcialmente-pago" ${visit.paymentStatus==='parcialmente-pago'?'selected':''}>Parcialmente pago</option><option value="pendente" ${!visit.id||visit.paymentStatus==='pendente'?'selected':''}>Pendente</option></select></label><label>Forma de pagamento<select name="paymentMethod"><option value="pix" ${visit.paymentMethod==='pix'?'selected':''}>PIX</option><option value="dinheiro" ${visit.paymentMethod==='dinheiro'?'selected':''}>Dinheiro</option><option value="cartao" ${visit.paymentMethod==='cartao'?'selected':''}>Cartão de crédito</option></select></label></div><label>Parcelas do cartão<select name="installments">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${Number(visit.installments||1)===i+1?'selected':''}>${i+1}x</option>`).join('')}</select></label><label>Total efetivamente recebido (R$)<input name="receivedValue" type="text" inputmode="decimal" required value="${visit.id ? moneyInput(received) : '0,00'}" placeholder="0,00"></label><label>Compromisso da agenda (opcional)<select name="appointmentId"><option value="">Sem compromisso vinculado</option>${appointmentOptions}</select></label><label>Observações administrativas<textarea name="adminNotes" maxlength="500" rows="2" placeholder="Sem detalhes clínicos">${escapeHTML(visit.adminNotes || '')}</textarea></label><p class="form-hint">Crédito parcelado não conta parcelas futuras como recebidas. Recebimentos adicionais em outras datas podem ser registrados no histórico financeiro.</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="primary-button">Salvar atendimento</button></div></form>`);
}
function crmOccurrenceForm(record = {}) {
  const categories = ['Falta sem aviso', 'Pendência de pagamento', 'Reclamação ou conflito', 'Cancelamento recorrente', 'Outra ocorrência'];
  const options = data.clients.map((client) => `<option value="${client.id}" ${record.clientId === client.id ? 'selected' : ''}>${escapeHTML(client.name)}${client.demo ? ' · demonstração' : ''}</option>`).join('');
  openModal(record.id ? 'Corrigir ocorrência' : 'Registrar ocorrência', `<form id="crm-occurrence-form" data-id="${record.id || ''}" class="modal-form"><label>Cliente associado (opcional)<select name="clientId"><option value="">Sem associação</option>${options}</select></label><label>Data<input name="date" type="date" required value="${record.date || localDate()}"></label><label>Categoria<select name="category">${categories.map((category) => `<option ${record.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></label><label>Descrição factual<textarea name="description" required maxlength="500" rows="3" placeholder="Relate fatos observáveis, sem julgamentos ou informações clínicas.">${escapeHTML(record.description || '')}</textarea></label><label>Providências tomadas<textarea name="actions" maxlength="500" rows="3" placeholder="Descreva ações administrativas adotadas.">${escapeHTML(record.actions || '')}</textarea></label><label>Situação<select name="status"><option ${record.status === 'Pendente' || !record.id ? 'selected' : ''}>Pendente</option><option ${record.status === 'Resolvida' ? 'selected' : ''}>Resolvida</option></select></label><label>Responsável pelo registro<input name="responsible" required maxlength="80" value="${escapeHTML(record.responsible || 'Tami Linda')}"></label><div class="notice-box crm-privacy-note">Área sem autenticação nesta versão. Evite dados sensíveis, clínicos, julgamentos pessoais ou conteúdo desnecessário.</div><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancelar</button><button class="primary-button">Salvar registro</button></div></form>`);
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
  } else ctx.fillText('TAMI LINDA', 100, canvas.height - 95);
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
  if (action === 'menu') { document.querySelector('#sidebar').classList.toggle('open'); return; }
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
  if (action === 'new-appointment') { setPage('agenda'); appointmentForm(); return; }
  if (action === 'edit-appointment') { appointmentForm(data.appointments.find((item) => item.id === id)); return; }
  if (action === 'crm-clients-tab') { crmCurrentTab = 'clientes'; crmActiveClientId = null; renderPage('crm'); return; }
  if (action === 'crm-occurrences-tab') { crmCurrentTab = 'ocorrencias'; crmActiveClientId = null; renderPage('crm'); return; }
  if (action === 'crm-back-to-list') { crmActiveClientId = null; renderPage('crm'); return; }
  if (action === 'new-crm-client') { crmClientForm(); return; }
  if (action === 'edit-crm-client') { const client = data.clients.find((item) => item.id === id); if (client) crmClientForm(client); return; }
  if (action === 'open-crm-client') { crmActiveClientId = id; crmCurrentTab = 'clientes'; renderPage('crm'); return; }
  if (action === 'delete-crm-client') {
    const client = data.clients.find((item) => item.id === id); if (!client) return;
    if (!window.confirm(`Excluir ${client.name}? O histórico do CRM será removido, os pagamentos permanecerão no Financeiro sem vínculo e compromissos/ocorrências serão desassociados.`)) return;
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
    openModal('Preparar contato · não enviado', `<p>Revise e copie manualmente se desejar. O sistema não enviará mensagens.</p><label>Mensagem editável<textarea id="return-message" rows="5">Olá, ${escapeHTML(client.name)}! Aqui é Tami Linda. Estou passando para saber se gostaria de conversar sobre um próximo atendimento. Se preferir, posso informar os horários disponíveis. ✨</textarea></label><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Fechar</button><button type="button" class="primary-button" data-action="copy-return-message">Copiar mensagem</button></div>`); return;
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
    if (!window.confirm('Deseja cancelar este compromisso fictício?')) return;
    data.appointments = data.appointments.filter((item) => item.id !== id); save(); renderPage('agenda'); showToast('Compromisso cancelado.'); return;
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
    if (!window.confirm('Cancelar este lançamento? Ele permanecerá no histórico, mas deixará de compor os totais.')) return;
    item.status = 'Cancelado';
    const linkedVisit = data.clientVisits.find((visit) => visit.id === item.sourceVisitId);
    if (linkedVisit) { const received = receivedForVisit(linkedVisit); linkedVisit.paymentStatus = received >= Number(linkedVisit.chargedTotal || 0) ? 'pago' : received > 0 ? 'parcialmente-pago' : 'pendente'; }
    save(); renderPage(activePage); showToast('Lançamento cancelado e preservado no histórico.'); return;
  }
  const messages = { notifications: 'Você está em um ambiente de demonstração.', help: 'Explore as áreas pelo menu lateral.', settings: 'Configurações não disponíveis nesta demonstração.', profile: 'Perfil de demonstração: Tami Linda.' };
  showToast(messages[action] || 'Esta ação não está disponível nesta demonstração.', action === 'settings' ? 'error' : 'success');
});
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!form.matches('form')) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
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
    const chargedTotal = parseMoney(values.chargedTotal);
    const receivedValue = parseMoney(values.receivedValue);
    if (!client || procedure.length < 2 || !values.date || !Number.isFinite(chargedTotal) || chargedTotal <= 0 || !Number.isFinite(receivedValue) || receivedValue < 0 || receivedValue > chargedTotal) return showToast('Confira a descrição, data e valores. O recebido deve estar entre zero e o total cobrado.', 'error');
    const paymentStatus = values.paymentStatus;
    if ((paymentStatus === 'pago' && receivedValue !== chargedTotal) || (paymentStatus === 'parcialmente-pago' && !(receivedValue > 0 && receivedValue < chargedTotal)) || (paymentStatus === 'pendente' && receivedValue !== 0)) return showToast('O status precisa corresponder ao valor recebido: pago = total, parcial = parte, pendente = zero.', 'error');
    if (values.paymentMethod === 'cartao' && (!/^([1-9]|1[0-2])$/.test(values.installments))) return showToast('Escolha de 1 a 12 parcelas.', 'error');
    const old = data.clientVisits.find((item) => item.id === form.dataset.id);
    const visit = { ...(old || {}), id: old?.id || crypto.randomUUID(), clientId: client.id, date: values.date, procedure, chargedTotal, paymentStatus, paymentMethod: values.paymentMethod, installments: values.paymentMethod === 'cartao' ? Number(values.installments) : 1, adminNotes: values.adminNotes.trim(), demo: old?.demo || false };
    const appointmentId = values.appointmentId || '';
    if (old?.appointmentId && old.appointmentId !== appointmentId) releaseVisitAppointment(old);
    if (appointmentId) {
      const appointment = data.appointments.find((item) => item.id === appointmentId);
      if (!appointment || (appointment.clientId && appointment.clientId !== client.id)) return showToast('Esse compromisso não está disponível para vínculo com esta ficha.', 'error');
      if (old?.appointmentId !== appointmentId) { visit.previousAppointmentStatus = appointment.status; visit.previousAppointmentClientId = appointment.clientId || ''; }
      visit.appointmentId = appointmentId; appointment.clientId = client.id; appointment.status = 'Realizado';
    } else { visit.appointmentId = ''; visit.previousAppointmentStatus = ''; visit.previousAppointmentClientId = ''; }

    const existingReceipts = data.transactions.filter((item) => item.type === 'receita' && item.sourceVisitId === visit.id && item.status !== 'Cancelado').sort((a,b) => a.date.localeCompare(b.date));
    const currentReceived = existingReceipts.reduce((sum, item) => sum + Number(item.value || 0), 0);
    if (receivedValue < currentReceived && old) return showToast('Para reduzir o total recebido, edite ou cancele os recebimentos individuais no Financeiro. O histórico não foi alterado.', 'error');
    if (receivedValue > currentReceived) {
      const delta = Math.round((receivedValue - currentReceived) * 100) / 100;
      const lastReceipt = existingReceipts[existingReceipts.length - 1];
      if (old && lastReceipt) { lastReceipt.value = Math.round((Number(lastReceipt.value) + delta) * 100) / 100; lastReceipt.grossAmount = Number(lastReceipt.grossAmount ?? lastReceipt.value); lastReceipt.date = values.date; lastReceipt.paymentMethod = visit.paymentMethod; lastReceipt.installments = visit.installments; lastReceipt.description = `${procedure} · recebimento`; }
      else data.transactions.unshift({ id: crypto.randomUUID(), type: 'receita', description: `${procedure} · recebimento`, value: delta, grossAmount: delta, fees: 0, date: values.date, clientId: client.id, sourceVisitId: visit.id, paymentMethod: visit.paymentMethod, installments: visit.installments, crmGenerated: true });
    }
    const latestReceipt = data.transactions.filter((item) => item.type === 'receita' && item.status !== 'Cancelado' && item.sourceVisitId === visit.id).sort((a,b) => b.date.localeCompare(a.date))[0];
    if (latestReceipt) { latestReceipt.paymentMethod = visit.paymentMethod; latestReceipt.installments = visit.installments; }
    visit.paymentIds = data.transactions.filter((item) => item.sourceVisitId === visit.id).map((item) => item.id);
    visit.transactionId = visit.paymentIds[0] || '';
    if (old) data.clientVisits = data.clientVisits.map((item) => item.id === visit.id ? visit : item);
    else data.clientVisits.unshift(visit);
    crmActiveClientId = client.id;
    if (!save()) return;
    document.querySelector('#modal-host').innerHTML = ''; renderPage('crm'); showToast('Atendimento e recebimentos vinculados salvos no Financeiro.'); return;
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
    const item = { id: form.dataset.id || crypto.randomUUID(), title: values.title.trim(), date: values.date, time: values.time, status: values.status, clientId: values.clientId || '' };
    if (form.dataset.id) data.appointments = data.appointments.map((record) => record.id === item.id ? item : record);
    else data.appointments.push(item);
    save(); document.querySelector('#modal-host').innerHTML = ''; renderPage('agenda'); showToast('Compromisso salvo na agenda demonstrativa.'); return;
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
    if (visit) {
      const otherTotal = data.transactions.filter((item) => item.type === 'receita' && item.status !== 'Cancelado' && item.sourceVisitId === visit.id && item.id !== editing?.id).reduce((sum, item) => sum + Number(item.value || 0), 0);
      if (otherTotal + value > Number(visit.chargedTotal || 0) + 0.001) return showToast('A soma dos recebimentos não pode ultrapassar o total cobrado no atendimento.', 'error');
    }
    const type = editing?.sourceVisitId ? 'receita' : (values.type || editing?.type || 'receita');
    const method = values.paymentMethod || editing?.paymentMethod || '';
    const grossAmount = values.grossAmount === undefined || String(values.grossAmount).trim() === '' ? Number(editing?.grossAmount ?? value) : parseMoney(values.grossAmount);
    const fees = values.fees === undefined || String(values.fees).trim() === '' ? Number(editing?.fees || 0) : parseMoney(values.fees);
    if (!Number.isFinite(grossAmount) || grossAmount < 0 || !Number.isFinite(fees) || fees < 0) return showToast('Confira o valor bruto e as taxas; use valores iguais ou maiores que zero.', 'error');
    const record = { ...(editing || {}), id: editing?.id || crypto.randomUUID(), type, description: visit ? (editing?.description || `${visit.procedure} · recebimento`) : values.description.trim(), value, date: values.date, clientId: visit?.clientId || (values.clientId || editing?.clientId || ''), ...(visit ? { sourceVisitId: visit.id, paymentMethod: method || visit.paymentMethod, installments: Number(values.installments || editing?.installments || visit.installments || 1), grossAmount, fees, crmGenerated: true } : {}) };
    if (editing) data.transactions = data.transactions.map((item) => item.id === editing.id ? record : item);
    else data.transactions.unshift(record);
    if (visit) { visit.paymentIds = data.transactions.filter((item) => item.sourceVisitId === visit.id).map((item) => item.id); visit.transactionId = visit.paymentIds[0] || ''; visit.paymentStatus = receivedForVisit(visit) >= Number(visit.chargedTotal) ? 'pago' : receivedForVisit(visit) > 0 ? 'parcialmente-pago' : 'pendente'; visit.paymentMethod = record.paymentMethod || visit.paymentMethod; visit.installments = record.installments || visit.installments; }
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
