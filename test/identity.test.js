const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

const workflowSource = fs.readFileSync(path.join(__dirname, '..', 'workflow-engine.js'), 'utf8');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const engineSource = fs.readFileSync(path.join(__dirname, '..', 'marketing-engine.js'), 'utf8');
const secretarySource = fs.readFileSync(path.join(__dirname, '..', 'secretaria-engine.js'), 'utf8');
const crmSource = fs.readFileSync(path.join(__dirname, '..', 'crm-engine.js'), 'utf8');

class FakeElement {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.attributes = {};
    this.hidden = false;
    this.disabled = false;
    this.innerHTML = '';
    this.textContent = '';
    this.style = { setProperty(name, value) { this[name] = value; } };
    this.classNames = new Set();
    this.classList = {
      add: (name) => this.classNames.add(name),
      remove: (name) => this.classNames.delete(name),
      toggle: (name, force) => force ? this.classNames.add(name) : this.classNames.delete(name),
      contains: (name) => this.classNames.has(name)
    };
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
    if (name === 'style') for (const part of String(value).split(';')) { const [key, ...rest] = part.split(':'); if (key && rest.length) this.style[key.trim()] = rest.join(':').trim(); }
  }
  removeAttribute(name) { delete this.attributes[name]; }
  querySelector(selector) { const child = this.children?.[selector] || new FakeElement(); child.propagateTo = this; return child; }
  querySelectorAll() { return this.logoSlots || []; }
  insertAdjacentHTML(_position, html) { this.insertedHTML = `${this.insertedHTML || ''}${html}`; if (this.propagateTo) this.propagateTo.innerHTML += html; }
  matches(selector) { return this.selectorMatches?.includes(selector) || false; }
  focus() {}
  addEventListener() {}
}

function createApp(store = new Map()) {
  const events = {};
  const windows = {};
  const ids = new Map();
  const nav = ['inicio', 'secretaria', 'crm', 'marketing', 'identidade', 'agenda', 'whatsapp', 'financeiro', 'juridico', 'aprovacoes', 'configuracoes'].map((page) => new FakeElement({ page }));
  for (const id of ['toast', 'nav-back', 'nav-forward', 'breadcrumb-current', 'page-title', 'page-subtitle', 'sidebar', 'overview-view', 'workspace-view', 'page-primary-action', 'draft-count', 'pending-count', 'approval-summary-count', 'today-label', 'today-appointments-count', 'month-revenue', 'new-contacts-count', 'today-date-chip', 'today-appointments-list', 'overview-pending-count', 'overview-approval-list', 'footer-year', 'identity-feedback', 'identity-preview', 'modal-host']) ids.set(`#${id}`, new FakeElement());
  ids.get('#identity-preview').logoSlots = [new FakeElement(), new FakeElement({ carousel: 'true' })];
  ids.get('#identity-preview').logoSlots[1].classList.add('carousel-brand');

  const document = {
    addEventListener(type, callback) { (events[type] ||= []).push(callback); },
    querySelector(selector) { return ids.get(selector) || new FakeElement(); },
    querySelectorAll(selector) { return selector.includes('.nav-item[data-page]') ? nav : []; },
    createElement(tag) {
      if (tag === 'canvas') {
        const context = { fillRect() {}, beginPath() {}, arc() {}, stroke() {}, moveTo() {}, lineTo() {}, fillText() {}, measureText(text) { return { width: String(text).length * 12 }; }, drawImage() {}, save() {}, restore() {}, clip() {}, setLineDash() {} };
        return { width: 0, height: 0, getContext() { return context; }, toBlob(callback) { callback(new Blob(['png-demo'], { type: 'image/png' })); } };
      }
      const element = new FakeElement();
      element.click = () => { document.downloads.push(element.download); };
      element.remove = () => {};
      return element;
    },
    body: { appendChild() {} },
    downloads: []
  };
  const location = { hash: '' };
  let historyStack = [{ state: null, hash: '' }];
  let historyIndex = 0;
  const history = {
    get state() { return historyStack[historyIndex].state; },
    pushState(state, _title, url) { historyStack = historyStack.slice(0, historyIndex + 1); const hash = String(url).startsWith('#') ? String(url) : ''; historyStack.push({ state, hash }); historyIndex++; location.hash = hash; },
    replaceState(state, _title, url) { const hash = String(url).startsWith('#') ? String(url) : ''; historyStack[historyIndex] = { state, hash }; location.hash = hash; },
    back() { if (historyIndex > 0) { historyIndex--; location.hash = historyStack[historyIndex].hash; windows.popstate?.(); } },
    forward() { if (historyIndex < historyStack.length - 1) { historyIndex++; location.hash = historyStack[historyIndex].hash; windows.popstate?.(); } }
  };
  const sandbox = {
    document, localStorage: { getItem(key) { return store.get(key) || null; }, setItem(key, value) { store.set(key, value); } },
    location, history, crypto: webcrypto, Intl, Date, JSON, Math, Number, String, Object, Array, RegExp, Promise, Blob,
    URL: class extends URL { static createObjectURL() { return 'blob:demo'; } static revokeObjectURL() {} },
    Image: class { constructor() { this.width = 100; this.height = 100; } set src(_value) { this.onload?.(); } },
    FileReader: class {
      readAsDataURL() { this.result = 'data:image/png;base64,aGVsbG8='; this.onload(); }
    },
    FormData: class { constructor(form) { this.values = form.values || {}; } [Symbol.iterator]() { return Object.entries(this.values)[Symbol.iterator](); } },
    setTimeout() { return 1; }, clearTimeout() {}, console,
    window: { EsteticaMarketingEngine: store.engine || null, SecretariaLocal: store.secretary || null, CrmLocal: store.crm || null, confirm() { return true; }, addEventListener(type, callback) { windows[type] = callback; } }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'tami-collection.js'), 'utf8'), sandbox);
  vm.runInNewContext(workflowSource, sandbox, { filename: 'workflow-engine.js' });
  vm.runInNewContext(source, sandbox, { filename: 'app.js' });

  function emit(type, target, extra = {}) {
    const event = { target, preventDefault() {}, ...extra };
    for (const callback of events[type] || []) callback(event);
  }
  async function emitAsync(type, target, extra = {}) {
    const event = { target, preventDefault() {}, ...extra };
    for (const callback of events[type] || []) await callback(event);
  }
  function button(action, properties = {}) {
    const target = new FakeElement({ action, ...properties });
    target.closest = (selector) => selector === '[data-action]' && target.dataset.action ? target : null;
    emit('click', target);
    return target;
  }
  function navigate(page) {
    const target = new FakeElement({ page });
    target.closest = (selector) => selector === '[data-page]' ? target : null;
    emit('click', target);
  }
  return { document, store, events, nav, emit, emitAsync, button, navigate, sandbox, windows };
}

test('identity preferences persist, preview, reset, and seed new marketing art', async () => {
  const app = createApp();
  app.navigate('identidade');
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Pré-visualização/);
  assert.equal(app.nav.find((item) => item.dataset.page === 'identidade').attributes['aria-current'], 'page');

  const color = new FakeElement({ identityField: 'color-primary' });
  color.value = '#123456';
  color.parentElement = { querySelector: () => ({ textContent: '' }) };
  color.closest = (selector) => selector === '[data-identity-field]' ? color : null;
  app.emit('input', color);
  app.button('identity-preview');
  assert.match(app.document.querySelector('#identity-preview').style['--brand-primary'], /#123456/i);
  app.button('identity-save');
  const saved = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.equal(saved.identity.colors.primary, '#123456');

  const refreshed = createApp(app.store);
  refreshed.navigate('identidade');
  assert.match(refreshed.document.querySelector('#workspace-view').innerHTML, /#123456/i, 'preferências reaparecem ao abrir uma nova sessão');

  app.navigate('marketing');
  app.button('new-design', { format: 'carousel', kind: 'educativo' });
  const created = JSON.parse(app.store.get('estetica-pro-ia-demo-v1')).drafts[0];
  assert.equal(created.format, 'carousel');
  assert.equal(created.slides.length, 3);
  assert.equal(created.brand.colors.primary, '#123456');
  assert.equal(created.slides[0].primary, '#123456');
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Exportar PNG/);

  app.button('export-png');
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(app.document.downloads, ['estetica-pro-carousel-slide-1.png']);
  assert.match(app.document.querySelector('#toast').textContent, /1080 × 1350/);

  app.navigate('identidade');
  const logo = new FakeElement({ identityField: 'logo-file' });
  logo.files = [{ type: 'image/png', size: 128 }];
  logo.matches = (selector) => selector === '[data-identity-field="logo-file"]';
  app.emit('change', logo);
  app.button('identity-save');
  const withLogo = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.equal(withLogo.identity.logo, 'data:image/png;base64,aGVsbG8=');
  app.navigate('marketing');
  app.button('new-design', { format: 'post', kind: 'faq' });
  const logoDraft = JSON.parse(app.store.get('estetica-pro-ia-demo-v1')).drafts[0];
  assert.equal(logoDraft.brand.logo, 'data:image/png;base64,aGVsbG8=');

  app.navigate('identidade');
  app.button('identity-restore');
  const restored = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.equal(restored.identity.colors.primary, '#172B43');
  assert.equal(restored.drafts[1].brand.colors.primary, '#123456', 'restaurar a identidade não modifica artes já criadas');
  assert.equal(restored.drafts[1].brand.logo, 'assets/monograma-tc.png', 'o logotipo nos rascunhos anteriores permanece preservado');
});

test('browser-style back and forward keep the active page in sync', () => {
  const app = createApp();
  app.navigate('marketing');
  app.navigate('identidade');
  app.button('nav-back');
  assert.equal(app.document.querySelector('#breadcrumb-current').textContent, 'Marketing');
  assert.equal(app.nav.find((item) => item.dataset.page === 'marketing').attributes['aria-current'], 'page');
  app.button('nav-forward');
  assert.equal(app.document.querySelector('#breadcrumb-current').textContent, 'Identidade Visual');
});

test('ambiente público informa a demonstração e oferece backup e restauração local', () => {
  const app = createApp();
  app.navigate('configuracoes');
  const settings = app.document.querySelector('#workspace-view').innerHTML;
  assert.match(settings, /Ambiente público de demonstração/);
  assert.match(settings, /dados fictícios/);
  assert.match(settings, /export-local-backup/);
  assert.match(settings, /choose-backup-file/);
});

test('dados locais corrompidos tentam recuperar a última cópia válida', () => {
  const key = 'estetica-pro-ia-demo-v1';
  const backup = {
    appointments: [{ id: 'recover-1', title: 'Horário recuperado', date: '2026-11-02', time: '09:00', status: 'Confirmado' }],
    drafts: [], approvals: [], transactions: [], chat: [], clients: [], clientVisits: [], occurrences: [],
    whatsappDrafts: [], demoOccurrenceExamplesAdded: true
  };
  const store = new Map([[key, '{json inválido'], [`${key}-backup`, JSON.stringify(backup)]]);
  const app = createApp(store);
  assert.doesNotThrow(() => JSON.parse(store.get(key)));
  app.navigate('agenda');
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Horário recuperado/);
  app.navigate('configuracoes');
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /cópia local anterior foi recuperada/);
});

test('falha ao salvar avisa e pede confirmação antes de fechar a página', () => {
  const app = createApp();
  app.sandbox.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  app.button('save-design');
  assert.match(app.document.querySelector('#toast').textContent, /Não foi possível confirmar o salvamento/);
  let prevented = false;
  const unloadEvent = { preventDefault() { prevented = true; } };
  app.windows.beforeunload(unloadEvent);
  assert.equal(prevented, true);
});

test('todos os menus carregam uma tela identificada e o resumo usa dados atuais', () => {
  const crmWindow = {}; vm.runInNewContext(crmSource, { window: crmWindow }, { filename: 'crm-engine.js' });
  const store = new Map(); store.crm = crmWindow.CrmLocal;
  const app = createApp(store);
  for (const item of app.nav) {
    app.navigate(item.dataset.page);
    assert.ok(app.document.querySelector('#page-title').innerHTML.length, `título da aba ${item.dataset.page}`);
    assert.equal(item.attributes['aria-current'], 'page', `aba ativa ${item.dataset.page}`);
    if (item.dataset.page !== 'inicio') assert.ok(app.document.querySelector('#workspace-view').innerHTML.length, `conteúdo da aba ${item.dataset.page}`);
  }
  app.navigate('inicio');
  assert.equal(app.document.querySelector('#today-appointments-count').textContent, '4');
  assert.equal(app.document.querySelector('#month-revenue').textContent, 'R$ 0,00');
  assert.equal(app.document.querySelector('#overview-pending-count').textContent, '03');
  assert.equal(app.document.querySelector('#footer-year').textContent, String(new Date().getFullYear()));
});

test('agenda rejeita sobreposição e aceita um horário adjacente sem conflito', async () => {
  const app = createApp();
  const form = new FakeElement(); form.id = 'appointment-form'; form.selectorMatches = ['form'];
  form.values = { title: 'Compromisso em conflito', date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0'), time: '09:30', durationMinutes: '30', status: 'Confirmado', clientId: '' };
  await app.emitAsync('submit', form);
  assert.match(app.document.querySelector('#toast').textContent, /conflita com/);
  assert.equal(app.store.has('estetica-pro-ia-demo-v1'), false, 'nenhum registro conflitante foi persistido');

  form.values = { ...form.values, title: 'Compromisso adjacente', time: '16:30' };
  await app.emitAsync('submit', form);
  const state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.ok(state.appointments.some((item) => item.title === 'Compromisso adjacente'));
});

test('editor de carrossel permite duplicar, reorganizar, excluir e persistir slides', () => {
  const app = createApp();
  app.navigate('marketing');
  app.button('new-design', { format: 'carousel', kind: 'educativo' });
  let draft = JSON.parse(app.store.get('estetica-pro-ia-demo-v1')).drafts[0];
  assert.equal(draft.slides.length, 3);
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Exportar PNG/);

  app.button('duplicate-slide');
  draft = JSON.parse(app.store.get('estetica-pro-ia-demo-v1')).drafts[0];
  assert.equal(draft.slides.length, 4);
  assert.match(draft.slides[1].title, /cópia/);

  app.button('move-slide', { direction: 'up' });
  draft = JSON.parse(app.store.get('estetica-pro-ia-demo-v1')).drafts[0];
  assert.match(draft.slides[0].title, /cópia/);
  app.button('delete-slide');
  draft = JSON.parse(app.store.get('estetica-pro-ia-demo-v1')).drafts[0];
  assert.equal(draft.slides.length, 3);

  const refreshed = createApp(app.store);
  refreshed.navigate('marketing');
  assert.match(refreshed.document.querySelector('#workspace-view').innerHTML, /Continuar editando/);
  assert.equal(JSON.parse(refreshed.store.get('estetica-pro-ia-demo-v1')).drafts[0].slides.length, 3);
});

test('fluxo local de estrategista com Botox chega ao editor e à aprovação profissional', async () => {
  const engineWindow = {};
  vm.runInNewContext(engineSource, { window: engineWindow }, { filename: 'marketing-engine.js' });
  const store = new Map();
  store.engine = engineWindow.EsteticaMarketingEngine;
  const app = createApp(store);
  app.navigate('marketing');
  assert.match(app.document.querySelector('#page-primary-action').innerHTML, /Planejar marketing/);
  app.button('new-strategist');
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Modo demonstração local/);

  const form = new FakeElement();
  form.id = 'strategy-input-form';
  form.selectorMatches = ['form'];
  form.values = { topic: 'Botox', audience: 'Pessoas conhecendo o tema', goal: 'educacao', stage: 'descobrindo', format: 'auto', period: 'semanal' };
  await app.emitAsync('submit', form);
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /ASSUNTO: Botox/);
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Educativo/);
  app.button('choose-strategy', { strategy: 'educativo' });
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Texto dos slides/);
  const before = JSON.parse(app.store.get('estetica-pro-ia-demo-v1')).strategyPlans[0];
  assert.equal(before.context.topic, 'Botox');
  app.button('regenerate-plan-title');
  const regenerated = JSON.parse(app.store.get('estetica-pro-ia-demo-v1')).strategyPlans[0];
  assert.notEqual(regenerated.title, before.title);
  assert.equal(regenerated.caption, before.caption, 'regenerar título conserva legenda e demais campos');
  app.button('transfer-strategy-to-editor');
  const editorState = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  const draft = editorState.drafts[0];
  assert.equal(draft.strategyContext.topic, 'Botox');
  assert.ok(draft.slides.length >= 2);
  assert.ok(draft.slides.every((slide) => slide.composition && slide.altText));
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Regenerar legenda/);
  app.button('submit-to-approval');
  const approvalState = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.equal(approvalState.approvals[0].requiresProfessionalReview, true);
  assert.equal(approvalState.approvals[0].status, 'Pendente');
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Revisão profissional necessária/);
});

test('chat da secretária responde a várias intenções e mantém contexto somente na sessão', async () => {
  const secretaryWindow = {};
  vm.runInNewContext(secretarySource, { window: secretaryWindow }, { filename: 'secretaria-engine.js' });
  const store = new Map();
  store.secretary = secretaryWindow.SecretariaLocal;
  const app = createApp(store);
  app.navigate('secretaria');
  const form = new FakeElement();
  form.id = 'chat-form'; form.selectorMatches = ['form']; form.values = { message: '' };
  const send = async (message) => {
    form.values.message = message;
    await app.emitAsync('submit', form);
    return app.document.querySelector('#workspace-view').innerHTML;
  };

  let view = await send('Como está minha agenda hoje?');
  assert.match(view, /Avaliação demonstrativa/);
  view = await send('E amanhã?');
  assert.match(view, /Não encontrei compromissos fictícios amanhã/);
  view = await send('Qual é meu saldo financeiro?');
  assert.match(view, /lançamentos locais fictícios/);
  view = await send('Quais aprovações estão pendentes?');
  assert.match(view, /3 itens pendentes/);
  view = await send('Que rascunhos tenho no marketing?');
  assert.match(view, /Bastidores do espaço/);
  view = await send('Quanto custa Botox?');
  assert.match(view, /Não há uma tabela de preços/);
  const saved = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.equal(saved.chat.length, 0, 'mensagens não são persistidas no navegador');
  assert.match(view, /Não há IA generativa/);
});

test('CRM integra atendimento e pagamentos com o financeiro sem duplicar e persiste', async () => {
  const crmWindow = {};
  vm.runInNewContext(crmSource, { window: crmWindow }, { filename: 'crm-engine.js' });
  const store = new Map(); store.crm = crmWindow.CrmLocal;
  const app = createApp(store);
  app.navigate('crm');
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /Clientes e Relacionamento/);
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /dados fictícios identificados/);
  assert.equal(app.nav.find((item) => item.dataset.page === 'crm').attributes['aria-current'], 'page');

  const clientForm = new FakeElement();
  clientForm.id = 'crm-client-form'; clientForm.selectorMatches = ['form'];
  clientForm.values = { name: 'Cliente de teste', contact: '', firstVisit: new Date().toISOString().slice(0, 10), nextReturnDate: '', notes: 'Preferência administrativa de contato.' };
  await app.emitAsync('submit', clientForm);
  let state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  const client = state.clients.find((item) => item.name === 'Cliente de teste');
  assert.ok(client);
  app.button('open-crm-client', { id: client.id });
  assert.match(app.document.querySelector('#workspace-view').innerHTML, /FICHA ADMINISTRATIVA/);

  const visitForm = new FakeElement();
  visitForm.id = 'crm-visit-form'; visitForm.selectorMatches = ['form']; visitForm.dataset.clientId = client.id;
  visitForm.values = { procedure: 'Serviço demonstrativo de teste', date: new Date().toISOString().slice(0, 10), durationMinutes: '60', appointmentId: '', chargedTotal: '120,00', paymentStatus: 'pago', paymentMethod: 'pix', installments: '1', receivedValue: '120,00', adminNotes: '' };
  await app.emitAsync('submit', visitForm);
  state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  const visit = state.clientVisits.find((item) => item.clientId === client.id);
  assert.ok(visit);
  let payments = state.transactions.filter((item) => item.sourceVisitId === visit.id);
  assert.equal(payments.length, 1);
  assert.equal(payments[0].value, 120);

  const editVisit = new FakeElement();
  editVisit.id = 'crm-visit-form'; editVisit.selectorMatches = ['form']; editVisit.dataset.id = visit.id; editVisit.dataset.clientId = client.id;
  editVisit.values = { procedure: 'Serviço demonstrativo corrigido', date: visit.date, durationMinutes: '60', appointmentId: '', chargedTotal: '140,00', paymentStatus: 'pago', paymentMethod: 'pix', installments: '1', receivedValue: '140,00', adminNotes: '' };
  await app.emitAsync('submit', editVisit);
  state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  payments = state.transactions.filter((item) => item.sourceVisitId === visit.id);
  assert.equal(payments.length, 1, 'editar atendimento atualiza o pagamento existente sem duplicar');
  assert.equal(payments[0].value, 140);
  assert.equal(visit.paymentIds.length, 1, 'o atendimento mantém um ID de recebimento, sem criar outro lançamento ao editar');

  const occurrenceForm = new FakeElement();
  occurrenceForm.id = 'crm-occurrence-form'; occurrenceForm.selectorMatches = ['form'];
  occurrenceForm.values = { clientId: client.id, date: visit.date, category: 'Pendência de pagamento', description: 'Pagamento combinado não registrado na data informada.', actions: 'Contato administrativo preparado para revisão.', status: 'Pendente', responsible: 'Tami' };
  await app.emitAsync('submit', occurrenceForm);
  state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  let occurrence = state.occurrences.find((item) => item.clientId === client.id);
  assert.ok(occurrence);
  assert.equal(occurrence.responsible, 'Tami');
  app.button('toggle-occurrence-status', { id: occurrence.id, status: 'Resolvida' });
  state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  occurrence = state.occurrences.find((item) => item.id === occurrence.id);
  assert.equal(occurrence.status, 'Resolvida');
  const editOccurrence = new FakeElement();
  editOccurrence.id = 'crm-occurrence-form'; editOccurrence.selectorMatches = ['form']; editOccurrence.dataset.id = state.occurrences[0].id;
  editOccurrence.values = { clientId: client.id, date: visit.date, category: 'Pendência de pagamento', description: 'Descrição factual corrigida após conferência.', actions: 'Providência registrada e conferida.', status: 'Resolvida', responsible: 'Tami' };
  await app.emitAsync('submit', editOccurrence);
  state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  assert.equal(state.occurrences.filter((item) => item.clientId === client.id).length, 1, 'corrigir ocorrência não cria duplicata');
  assert.match(state.occurrences.find((item) => item.clientId === client.id).description, /corrigida/);

  const refreshed = createApp(store);
  refreshed.navigate('crm');
  refreshed.button('open-crm-client', { id: client.id });
  assert.match(refreshed.document.querySelector('#workspace-view').innerHTML, /Serviço demonstrativo corrigido/);
  assert.match(refreshed.document.querySelector('#workspace-view').innerHTML, /R\$\s?140,00/);
  assert.match(refreshed.document.querySelector('#workspace-view').innerHTML, /Total cobrado/);
  refreshed.button('crm-occurrences-tab');
  assert.match(refreshed.document.querySelector('#workspace-view').innerHTML, /Descrição factual corrigida/);
});

test('casos de pagamento, parcelas futuras, edição sem duplicidade e recarga local', async () => {
  const win = {}; vm.runInNewContext(crmSource, { window: win }, { filename: 'crm-engine.js' });
  const store = new Map(); store.crm = win.CrmLocal;
  const app = createApp(store); app.navigate('crm');
  const clientForm = new FakeElement(); clientForm.id = 'crm-client-form'; clientForm.selectorMatches = ['form'];
  clientForm.values = { name: 'Cliente fictício para pagamentos', contact: '', firstVisit: new Date().toISOString().slice(0, 10), nextReturnDate: '', notes: '' };
  await app.emitAsync('submit', clientForm);
  const client = JSON.parse(store.get('estetica-pro-ia-demo-v1')).clients.find((row) => row.name === 'Cliente fictício para pagamentos');
  const today = new Date().toISOString().slice(0, 10);
  const cases = [
    { procedure: 'PIX 650', chargedTotal: '650,00', paymentStatus: 'pago', paymentMethod: 'pix', installments: '1', receivedValue: '650,00', expected: 650, pending: 0 },
    { procedure: 'Dinheiro 650', chargedTotal: '650,00', paymentStatus: 'pago', paymentMethod: 'dinheiro', installments: '1', receivedValue: '650,00', expected: 650, pending: 0 },
    { procedure: 'Recebimento cartão', chargedTotal: '300,00', paymentStatus: 'pago', paymentMethod: 'cartao', installments: '3', receivedValue: '300,00', expected: 300, pending: 0 },
    { procedure: 'Recebimento parcial informado', chargedTotal: '200,00', paymentStatus: 'pago', paymentMethod: 'pix', installments: '1', receivedValue: '200,00', expected: 200, pending: 0 }
  ];
  const savedIds = [];
  for (const item of cases) {
    const form = new FakeElement(); form.id = 'crm-visit-form'; form.selectorMatches = ['form']; form.dataset.clientId = client.id;
    form.values = { ...item, durationMinutes: '60', date: today, appointmentId: '', adminNotes: '' };
    await app.emitAsync('submit', form);
    const state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
    const visit = state.clientVisits.find((row) => row.procedure === item.procedure);
    assert.ok(visit, `${item.procedure} salvo`);
    const receipts = state.transactions.filter((row) => row.sourceVisitId === visit.id && row.status !== 'Cancelado');
    assert.equal(receipts.reduce((sum, row) => sum + row.value, 0), item.expected, `${item.procedure}: somente o efetivamente recebido conta`);
    assert.equal(Math.max(0, visit.chargedTotal - receipts.reduce((sum, row) => sum + row.value, 0)), item.pending);
    assert.equal(receipts.length, item.expected ? 1 : 0);
    savedIds.push(visit.id);
  }
  let state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  const target = state.clientVisits.find((row) => row.id === savedIds[0]);
  const edit = new FakeElement(); edit.id = 'crm-visit-form'; edit.selectorMatches = ['form']; edit.dataset.clientId = client.id; edit.dataset.id = target.id;
  edit.values = { procedure: target.procedure, date: today, durationMinutes: '60', appointmentId: '', chargedTotal: '700,00', paymentStatus: 'pago', paymentMethod: 'pix', installments: '1', receivedValue: '700,00', adminNotes: '' };
  await app.emitAsync('submit', edit);
  state = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  assert.equal(state.transactions.filter((row) => row.sourceVisitId === target.id && row.status !== 'Cancelado').length, 1, 'editar cobrança preserva ID/quantidade do pagamento');
  assert.equal(state.clientVisits.find((row) => row.id === target.id).chargedTotal, 700);
  const refreshed = createApp(store); refreshed.navigate('crm');
  const reloaded = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  assert.equal(reloaded.clientVisits.filter((row) => savedIds.includes(row.id)).length, 4, 'os atendimentos continuam no armazenamento após nova carga');
  assert.equal(reloaded.transactions.filter((row) => row.sourceVisitId === target.id).length, 1);
  const creditVisit = reloaded.clientVisits.find((row) => row.procedure === 'Recebimento cartão');
  const additionalReceipt = new FakeElement(); additionalReceipt.id = 'transaction-form'; additionalReceipt.selectorMatches = ['form']; additionalReceipt.dataset.sourceVisit = creditVisit.id;
  const futureDay = new Date(`${today}T12:00:00`); futureDay.setDate(futureDay.getDate() + 1);
  additionalReceipt.values = { value: '300,00', grossAmount: '310,00', fees: '10,00', date: futureDay.toISOString().slice(0, 10), paymentMethod: 'cartao', installments: '3' };
  await refreshed.emitAsync('submit', additionalReceipt);
  const afterSecondReceipt = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  const receipts = afterSecondReceipt.transactions.filter((row) => row.sourceVisitId === creditVisit.id && row.status !== 'Cancelado');
  assert.equal(receipts.length, 2, 'permite recebimentos separados em datas diferentes');
  assert.equal(receipts.reduce((sum, row) => sum + row.value, 0), 600);
  assert.equal(receipts.find((row) => row.date !== today).date, futureDay.toISOString().slice(0, 10));
  assert.equal(receipts.find((row) => row.date !== today).grossAmount, 310);
  assert.equal(receipts.find((row) => row.date !== today).fees, 10);
  assert.equal(afterSecondReceipt.clientVisits.find((row) => row.id === creditVisit.id).paymentStatus, 'pago');
  assert.equal(afterSecondReceipt.clientVisits.find((row) => row.id === creditVisit.id).chargedTotal, 600, 'total conhecido acompanha apenas os valores efetivamente recebidos');

  const expense = new FakeElement(); expense.id = 'transaction-form'; expense.selectorMatches = ['form'];
  expense.values = { type: 'despesa', description: 'Despesa editável fictícia', clientId: '', value: '45,90', date: today };
  await refreshed.emitAsync('submit', expense);
  let expenseState = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  const expenseRow = expenseState.transactions.find((row) => row.description === 'Despesa editável fictícia');
  assert.equal(expenseRow.value, 45.9);
  const editExpense = new FakeElement(); editExpense.id = 'transaction-form'; editExpense.selectorMatches = ['form']; editExpense.dataset.id = expenseRow.id;
  editExpense.values = { type: 'despesa', description: 'Despesa editada fictícia', clientId: '', value: '50,25', date: today };
  await refreshed.emitAsync('submit', editExpense);
  expenseState = JSON.parse(store.get('estetica-pro-ia-demo-v1'));
  assert.equal(expenseState.transactions.filter((row) => row.id === expenseRow.id).length, 1, 'editar despesa mantém o mesmo lançamento');
  assert.equal(expenseState.transactions.find((row) => row.id === expenseRow.id).value, 50.25);
});


test('financeiro edita atendimento, custos e recebimento juntos sem duplicar', async () => {
  const crmWindow = {}; vm.runInNewContext(crmSource, {window: crmWindow});
  const store = new Map(); store.crm = crmWindow.CrmLocal;
  const app = createApp(store);
  const submit = async (id, dataset, values) => {
    const form = new FakeElement(dataset); form.id = id; form.selectorMatches = ['form']; form.values = values;
    await app.emitAsync('submit', form);
  };
  await submit('crm-client-form', {}, {name: 'Teste unificado', contact: '', firstVisit: '2026-11-02', nextReturnDate: '', notes: ''});
  let state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  const client = state.clients.find(c => c.name === 'Teste unificado');
  const values = {procedure: 'Botox', date: '2026-11-02', durationMinutes: '60', appointmentId: '', receivedValue: '500,00', paymentMethod: 'pix', installments: '1'};
  await submit('crm-visit-form', {clientId: client.id}, values);
  state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  const visit = state.clientVisits.find(v => v.clientId === client.id);
  const receipt = state.transactions.find(r => r.sourceVisitId === visit.id);
  app.navigate('financeiro');
  assert.doesNotMatch(app.document.querySelector('#workspace-view').innerHTML, /data-action="edit-visit-costs"/);
  app.button('edit-finance-visit', {id: visit.id});
  assert.match(app.document.querySelector('#modal-host').innerHTML, /name="roomCost"/);
  assert.match(app.document.querySelector('#modal-host').innerHTML, /name="receiptValue"/);
  const edit = {...values, roomCost: '100,00', materialCost: '50,00', receiptId: receipt.id, receiptValue: '400,00', receiptDate: '2026-11-01', receiptTime: '14:20', receiptDescription: 'Recebimento corrigido', receiptGross: '400,00', receiptFees: '0,00', receiptMethod: 'dinheiro', receiptInstallments: '1'};
  const dataset = {id: visit.id, clientId: client.id, returnPage: 'financeiro'};
  await submit('crm-visit-form', dataset, {...edit, materialCost: '-1'});
  state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.equal(state.transactions.find(r => r.id === receipt.id).value, 500);
  await submit('crm-visit-form', dataset, edit);
  state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  const updated = state.clientVisits.find(v => v.id === visit.id);
  assert.equal(updated.roomCost, 100); assert.equal(updated.materialCostSnapshot, 50);
  const receipts = state.transactions.filter(r => r.sourceVisitId === visit.id);
  assert.equal(receipts.length, 1); assert.equal(receipts[0].id, receipt.id);
  assert.equal(receipts[0].value, 400); assert.equal(receipts[0].time, '14:20');
  assert.equal(receipts[0].description, 'Recebimento corrigido');
  assert.equal(receipts[0].paymentMethod, 'dinheiro');
});

test('coleção Tami cria rascunhos separados e leva apenas links Canva válidos à revisão', async () => {
  const app = createApp(); app.navigate('marketing');
  assert.match(app.document.querySelector('#workspace-view').innerHTML,/Uma identidade. Muitas conversas/);
  app.button('new-tami-model',{model:'primeira-conversa'});
  let state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  const draft = state.drafts.find(d=>d.collectionKey==='primeira-conversa');
  assert.equal(draft.slides.length,4); assert.equal(draft.requiresProfessionalReview,true);
  assert.equal(draft.brand.logo,'assets/monograma-tc.png');
  const form = new FakeElement({id:draft.id}); form.id='canva-link-form'; form.selectorMatches=['form'];
  form.values={canvaUrl:'https://www.canva.com.evil.example/design/TEST123/edit'};
  await app.emitAsync('submit',form);
  state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.equal(state.drafts.find(d=>d.id===draft.id).canvaUrl,'');
  form.values={canvaUrl:'https://www.canva.com/design/TEST123/edit'};
  await app.emitAsync('submit',form);
  app.button('submit-to-approval');
  state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  const approval = state.approvals.find(a=>a.title===draft.title);
  assert.equal(approval.canvaUrl,form.values.canvaUrl);
  assert.equal(approval.status,'Pendente'); assert.equal(approval.requiresProfessionalReview,true);
  app.navigate('marketing'); app.button('new-tami-model',{model:'primeira-conversa'});
  state = JSON.parse(app.store.get('estetica-pro-ia-demo-v1'));
  assert.equal(state.drafts.filter(d=>d.collectionKey==='primeira-conversa').length,2);
  assert.notEqual(state.drafts[0].id,draft.id);
});
