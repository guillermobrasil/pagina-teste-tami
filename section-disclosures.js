/* Estado visual somente em memória; os registros e a Visão geral não são alterados. */
(function () {
  const states = new Map();
  const entries = new WeakMap();
  let sequence = 0;
  const candidates = '.panel, .tami-collection, .strategist-launch, .studio-intro, .preview-panel, .judicial-resources, .record-card, fieldset.procedure-settings';
  const headers = '.panel-heading, .crm-rank-card-heading, .agenda-daily-heading, .agenda-google-heading, .editor-panel-heading, .preview-heading, .collection-heading, .strategist-launch-copy, .strategist-flow-heading, .editor-brief-heading, .judicial-section-heading, .agent-scaffold-top, .crm-occurrence-head, .studio-drafts-heading';

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
    entry.box.classList.toggle('is-collapsed', !open);
    for (const {node, hidden} of entry.body) node.hidden = !open || hidden;
    states.set(entry.key, open);
  }
  function enhance(view, page) {
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
      while (title.firstChild) button.append(title.firstChild);
      const indicator = document.createElement('span'); indicator.className = 'section-disclosure-indicator'; indicator.setAttribute('aria-hidden','true'); indicator.textContent = '›';
      button.append(indicator); title.append(button);
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
