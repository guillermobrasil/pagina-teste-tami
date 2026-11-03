/* Estado visual somente em memória; os registros e a Visão geral não são alterados. */
(function () {
  const states = new Map();
  const entries = new WeakMap();
  let sequence = 0;
  const candidates = '.panel, .tami-collection, .strategist-launch, .studio-intro, .preview-panel, .judicial-resources, .record-card, fieldset.procedure-settings';
  const headers = '.panel-heading, .crm-rank-card-heading, .agenda-daily-heading, .agenda-google-heading, .editor-panel-heading, .preview-heading, .collection-heading, .strategist-launch-copy, .strategist-flow-heading, .editor-brief-heading, .judicial-section-heading, .agent-scaffold-top, .crm-occurrence-head, .studio-drafts-heading';
  const drawings = {
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-4-5.65"/>',
    repeat:'<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
    chart:'<path d="M3 3v18h18M7 16v-4M12 16V7M17 16v-7"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-14 5 2 2 5-4"/>',
    wallet:'<path d="M20 8V5a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h15v11H6a3 3 0 0 1-3-3V6M21 12h-5v5h5"/><path d="M18 14.5h.01"/>',
    receipt:'<path d="M5 3l3 2 4-2 4 2 3-2v18l-3-2-4 2-4-2-3 2V3M9 9h6M9 13h6M9 17h3"/>',
    trend:'<path d="M3 20h18M4 15l5-5 4 3 7-8M15 5h5v5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert:'<path d="m12 3 10 18H2L12 3ZM12 9v4M12 17h.01"/>',
    brush:'<path d="m14 5 5-3 3 3-3 5-7 7-5-5 7-7ZM7 14c-4-1-4 3-5 7 4-1 8-1 7-5"/>',
    palette:'<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.3-3.5 1.5 1.5 0 0 1 1-2.5H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z"/><circle cx="7.5" cy="10" r=".7"/><circle cx="10" cy="6.5" r=".7"/><circle cx="15" cy="7" r=".7"/><circle cx="17.5" cy="11" r=".7"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m21 15-5-5L5 21"/>',
    folder:'<path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
    bulb:'<path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z"/>',
    message:'<path d="M21 12a8 8 0 0 1-8 8H7l-5 2 2-5v-5a8 8 0 0 1 8-8h1a8 8 0 0 1 8 8Z"/><path d="M8 10h8M8 14h5"/>',
    shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
    scales:'<path d="M12 3v18M7 21h10M4 7h16M6 7l-4 8h8L6 7ZM18 7l-4 8h8l-4-8Z"/>',
    book:'<path d="M12 5v16M12 5C8 2 5 3 2 4v16c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-6-2-10 1Z"/>',
    settings:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
    box:'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5"/>',
    clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="m8 14 3 3 5-6"/>',
    building:'<path d="M4 21V5l8-3 8 3v16H4ZM9 21v-5h6v5M8 7h.01M16 7h.01M8 11h.01M16 11h.01"/>',
    calculator:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h1M15 11h1M8 15h1M15 15h1M8 19h1M15 19h1"/>',
    document:'<path d="M14 2H5v20h14V7l-5-5ZM14 2v5h5M8 12h8M8 16h6"/>',
    backup:'<path d="M7 18a5 5 0 0 1-1-10 7 7 0 0 1 13-1 5 5 0 0 1 0 10M12 12v10m-4-4 4 4 4-4"/>'
  };
  function iconFor(box, name, page) {
    if (box.classList.contains('crm-occurrence')) return 'alert';
    for (const [tone,icon] of [['spending','receipt'],['received','wallet'],['tenure','clock'],['attendance','calendar'],['frequency','repeat'],['occurrences','alert']]) {
      if (box.classList.contains(`crm-rank-tone-${tone}`)) return icon;
    }
    const text=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if (box.matches('fieldset.procedure-settings')) return 'box';
    if (/backup|recupera/.test(text)) return 'backup';
    if (/retorno/.test(text)) return 'repeat';
    if (/indicador/.test(text)) return 'chart';
    if (/clientes|resumo do cliente/.test(text)) return 'users';
    if (/despesas|lancamentos/.test(text)) return 'receipt';
    if (/resultado por atendimento/.test(text)) return 'trend';
    if (/financeiro e tributa/.test(text)) return 'calculator';
    if (/resumo financeiro/.test(text)) return 'wallet';
    if (/materiais|custos de materiais/.test(text)) return 'box';
    if (/regras|limites/.test(text)) return 'shield';
    if (/fontes/.test(text)) return 'book';
    if (/pre.visualiza|^arte \d/.test(text)) return 'image';
    if (/rascunhos|trabalhos|respostas preparadas/.test(text)) return 'folder';
    if (/conteudo da arte|^slide \d/.test(text)) return 'brush';
    if (/colecao|uma identidade|personalize sua marca|nova arte/.test(text)) return 'palette';
    if (/planeja|estrategia|comece por um tema/.test(text)) return 'bulb';
    if (/modelos de conteudo|escolha um formato/.test(text)) return 'image';
    if (/canva|a arte e o planejamento/.test(text)) return 'brush';
    if (text==='geral') return 'building';
    return ({secretaria:'message',crm:'users',agenda:'calendar',financeiro:'wallet',marketing:'brush',whatsapp:'message',juridico:'scales',identidade:'palette',aprovacoes:'clipboard',configuracoes:'settings'})[page] || 'document';
  }
  function addIcon(box, header, button, name, page) {
    const icon=iconFor(box,name,page);
    const existing=header.querySelector('.crm-rank-icon, .agent-scaffold-symbol, .strategist-spark, .judicial-result-icon');
    const visual=existing || document.createElement('span');
    visual.classList.add('section-disclosure-icon'); visual.setAttribute('aria-hidden','true');
    visual.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">${drawings[icon]}</svg>`;
    if (!existing) button.prepend(visual);
    box.dataset.disclosureIcon=icon;
  }

  function section(title) {
    const box = document.createElement('section'); box.className = 'panel disclosure-section';
    const header = document.createElement('div'); header.className = 'panel-heading';
    const heading = document.createElement('h3'); heading.textContent = title;
    header.append(heading); box.append(header);
    return box;
  }
  function groupHeadings(parent) {
    for (const title of [...parent.children].filter(n => n.matches('h3'))) {
      const box = section(title.textContent);
      parent.insertBefore(box, title);
      let node = title.nextElementSibling;
      title.remove();
      while (node && !node.matches('h3, .modal-actions')) {
        const next = node.nextElementSibling; box.append(node); node = next;
      }
    }
  }
  function prepare(view, page) {
    for (const [selector,title] of [['.crm-metrics','Indicadores da base'],['.crm-profile-metrics','Resumo do cliente'],['.agenda-summary','Resumo da agenda']]) {
      const metrics = view.querySelector(selector);
      if (metrics && !metrics.parentElement.classList.contains('metric-disclosure')) {
        const box = section(title); box.classList.add('metric-disclosure');
        metrics.before(box); box.append(metrics);
      }
    }
    if (page === 'financeiro') {
      const finance = view.querySelector('.finance-page');
      if (finance && !finance.dataset.disclosurePrepared) {
        finance.dataset.disclosurePrepared = 'true'; finance.dataset.disclosureContainer = 'true';
        groupHeadings(finance);
        const summary = section('Resumo financeiro');
        const heading = finance.querySelector(':scope > .panel-heading');
        heading.after(summary);
        let node = summary.nextElementSibling;
        while (node && !node.matches('.disclosure-section')) {
          const next = node.nextElementSibling; summary.append(node); node = next;
        }
      }
    }
    if (page === 'configuracoes') {
      const form = view.querySelector('#settings-form');
      if (form && !form.dataset.disclosurePrepared) {
        form.dataset.disclosurePrepared = 'true'; groupHeadings(form);
        form.closest('.module-panel').dataset.disclosureContainer = 'true';
      }
    }
    if (page === 'marketing') {
      const gallery = view.querySelector('.template-gallery');
      const title = gallery?.previousElementSibling;
      if (gallery && title?.matches('h3')) {
        const box = section(title.textContent); title.before(box); title.remove(); box.append(gallery);
      }
      const heading = view.querySelector('.studio-drafts-heading');
      if (heading && !heading.parentElement.classList.contains('drafts-disclosure')) {
        const box = document.createElement('section'); box.className = 'panel drafts-disclosure';
        heading.before(box);
        const body = heading.nextElementSibling; box.append(heading);
        if (body) box.append(body);
      }
    }
    if (page === 'aprovacoes') {
      const panel = view.querySelector('.module-panel');
      if (panel?.querySelector('.record-card')) panel.dataset.disclosureContainer = 'true';
    }
  }
  function makeHeader(box) {
    let header = [...box.children].find(n => n.matches(headers));
    if (header) return header;
    const title = [...box.children].find(n => n.matches('h2,h3,h4,legend'));
    if (!title) return null;
    if (title.matches('legend')) return title;
    header = document.createElement('div'); header.className = 'panel-heading disclosure-generated-heading';
    const eyebrow = title.previousElementSibling;
    box.insertBefore(header, title);
    if (eyebrow?.matches('.eyebrow, .record-top')) header.append(eyebrow);
    header.append(title); return header;
  }
  function setOpen(entry, open) {
    entry.button.setAttribute('aria-expanded', String(open));
    entry.button.title = open ? 'Recolher informações' : 'Expandir informações';
    entry.button.querySelector('.section-disclosure-action').textContent = open ? 'Fechar' : 'Abrir';
    entry.box.classList.toggle('is-collapsed', !open);
    for (const {node, hidden} of entry.body) node.hidden = !open || hidden;
    states.set(entry.key, open);
  }
  function enhance(view, page) {
    for (const wrapper of view.querySelectorAll('.table-wrap')) {
      wrapper.setAttribute('tabindex','0'); wrapper.setAttribute('role','region');
      if (!wrapper.hasAttribute('aria-label')) wrapper.setAttribute('aria-label','Tabela: use as setas para rolar horizontalmente');
    }
    if (page === 'inicio') return;
    prepare(view, page);
    const occurrences = new Map();
    for (const box of view.querySelectorAll(candidates)) {
      if (entries.has(box) || box.dataset.disclosureContainer) continue;
      const header = makeHeader(box);
      const title = header?.matches('legend') ? header : header?.querySelector('h2,h3,h4');
      if (!header || !title || title.querySelector('button,a,input,select')) continue;
      const body = [...box.children].filter(n => n !== header);
      // Direct action buttons stay available beside the heading.
      const content = body.filter(n => !n.matches('button[data-action], a[data-action]'));
      if (!content.length) continue;
      const name = title.textContent.trim().replace(/\s+/g,' ');
      const base = `${page}:${box.className}:${name}`;
      const count = occurrences.get(base) || 0; occurrences.set(base, count + 1);
      const key = `${base}:${count}`;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'section-disclosure-toggle';
      const label=document.createElement('span'); label.className='section-disclosure-label';
      while (title.firstChild) label.append(title.firstChild);
      button.append(label); addIcon(box,header,button,name,page);
      const indicator = document.createElement('span'); indicator.className = 'section-disclosure-indicator'; indicator.setAttribute('aria-hidden','true'); indicator.textContent = '›';
      const action = document.createElement('span'); action.className = 'section-disclosure-action'; action.setAttribute('aria-hidden','true');
      const affordance = document.createElement('span'); affordance.className = 'section-disclosure-affordance'; affordance.setAttribute('aria-hidden','true');
      affordance.append(action,indicator); button.append(affordance); title.append(button);
      const uid = ++sequence;
      const items = content.map((node,index) => { node.id ||= `section-content-${uid}-${index}`; return {node,hidden:node.hidden}; });
      button.setAttribute('aria-controls', items.map(({node})=>node.id).join(' '));
      box.dataset.disclosurePanel = ''; box.classList.add('disclosure-panel'); header.classList.add('disclosure-heading');
      const entry = {box,button,body:items,key}; entries.set(box,entry);
      header.addEventListener('click', event => {
        const control = event.target.closest('button,a,input,select,textarea,label');
        if (control && control !== button && !button.contains(control)) return;
        setOpen(entry,button.getAttribute('aria-expanded') !== 'true');
      });
      setOpen(entry, states.get(key) === true);
    }
  }
  document.addEventListener('invalid', event => {
    if (!event.target.closest('#workspace-view')) return;
    for (let node = event.target.parentElement; node; node = node.parentElement) {
      const entry = entries.get(node); if (entry) setOpen(entry,true);
    }
  },true);
  function reveal(target) {
    for (let node=target;node;node=node.parentElement) {
      const entry=entries.get(node); if (entry) setOpen(entry,true);
    }
  }
  window.SectionDisclosures = Object.freeze({enhance,reveal});
})();
