const {revealPanels} = require('./helpers.cjs');
const {test, expect} = require('@playwright/test');
test('agenda → atendimento → pagamento e custos → resultado, sem duplicidade', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#agenda');
  await page.getByRole('button',{name:'＋ Novo compromisso',exact:true}).click();
  const appointment = page.locator('#appointment-form');
  await appointment.locator('[name=title]').fill('Botox teste de rotina');
  await appointment.locator('[name=date]').fill('2026-11-02');
  await appointment.locator('[name=time]').fill('18:00');
  await appointment.getByRole('button',{name:'Salvar compromisso'}).click();
  await revealPanels(page);
  await page.locator('.agenda-event').filter({hasText:'Botox teste de rotina'}).getByRole('button',{name:'Registrar atendimento'}).click();
  await page.locator('[name=clientName]').fill('Cliente sintético da rotina');
  await page.getByRole('button',{name:'Continuar atendimento'}).click();
  const form = page.locator('#crm-visit-form');
  await expect(form.locator('[name=date]')).toHaveValue('2026-11-02');
  await expect(form.locator('[name=appointmentTime]')).toHaveValue('18:00');
  await expect(form.locator('[name=durationMinutes]')).toHaveValue('60');
  await form.locator('[name=receivedValue]').fill('200,00');
  await form.locator('[name=agreedTotal]').fill('500,00');
  await form.locator('[name=costMode]').selectOption('manual');
  await form.locator('[name=roomCost]').fill('120,00');
  await form.locator('[name=materialCost]').fill('50,00');
  await page.screenshot({path:'.cache/visual/390-atendimento.png',fullPage:true});
  await form.getByRole('button',{name:'Salvar atendimento'}).click();
  await revealPanels(page);
  await expect(page.locator('.finance-visits-table')).toContainText('Cliente sintético da rotina');
  await expect(page.locator('.finance-summary')).toContainText('R$ 300,00');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
  await page.screenshot({path:'.cache/visual/390-resultado-preenchido.png',fullPage:true});
  await page.locator('.finance-visits-table').getByRole('button',{name:'Editar',exact:true}).click();
  await expect(page.locator('#crm-visit-form [name=receiptValue]')).toHaveValue('200,00');
  await page.locator('#crm-visit-form').getByRole('button',{name:'Salvar atendimento'}).click();
  const state = await page.evaluate(()=>JSON.parse(localStorage.getItem('estetica-pro-ia-demo-v1')));
  const visit = state.clientVisits.find(v=>!v.demo);
  expect(state.clientVisits.filter(v=>v.appointmentId===visit.appointmentId)).toHaveLength(1);
  expect(state.transactions.filter(t=>t.sourceVisitId===visit.id)).toHaveLength(1);
  await page.goto('/#inicio');
  await expect(page.locator('#overview-tasks')).toContainText('R$ 300,00');
});

test('conta privada salva na nuvem sem copiar dados para a demonstração e trata conflito', async ({page}) => {
  const owner = '11111111-1111-4111-8111-111111111111';
  const user = {id:owner,email:'conta@example.invalid',aud:'authenticated',role:'authenticated'};
  const token = [Buffer.from('{}').toString('base64url'),Buffer.from(JSON.stringify({sub:owner,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test'].join('.');
  let document = null, version = 0, conflict = false;
  await page.route('**/cloud-config.json',r=>r.fulfill({json:{url:'https://cloud.test',publishableKey:'sb_publishable_test'}}));
  await page.route('https://cloud.test/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/token')) return route.fulfill({json:{access_token:token,refresh_token:'test-refresh',expires_in:3600,token_type:'bearer',user}});
    if (path.endsWith('/user')) return route.fulfill({json:user});
    if (path.endsWith('/logout')) return route.fulfill({json:{}});
    if (path.endsWith('/clinic_documents')) return route.fulfill({json:document ? {payload:document,version} : null});
    if (path.endsWith('/save_clinic_document')) {
      if (conflict) return route.fulfill({status:400,json:{code:'P0001',message:'VERSION_CONFLICT'}});
      const body = route.request().postDataJSON(); expect(body.p_expected_version).toBe(version);
      document = body.p_payload; version++; return route.fulfill({json:version});
    }
    return route.fulfill({json:[]});
  });
  await page.goto('/');
  const before = await page.evaluate(()=>localStorage.getItem('estetica-pro-ia-demo-v1'));
  await page.getByRole('button',{name:'Entrar na conta',exact:true}).click();
  await page.locator('#cloud-login-form [name=email]').fill('conta@example.invalid');
  await page.locator('#cloud-login-form [name=password]').fill('synthetic-password');
  await page.locator('#cloud-login-form').getByRole('button',{name:'Entrar',exact:true}).click();
  await expect(page.locator('#account-button')).toHaveText('Minha conta');
  await page.goto('/#configuracoes'); await revealPanels(page);
  await page.locator('#settings-form [name=businessName]').fill('Espaço privado de teste');
  await page.getByRole('button',{name:'Salvar configurações'}).click();
  await expect(page.locator('#account-status')).toHaveText('Alterações salvas na conta');
  expect(document.clients).toHaveLength(0);
  expect(await page.evaluate(()=>localStorage.getItem('estetica-pro-ia-demo-v1'))).toBe(before);
  conflict = true;
  await page.locator('#settings-form [name=businessName]').fill('Alteração concorrente');
  await page.getByRole('button',{name:'Salvar configurações'}).click();
  await expect(page.locator('#account-status')).toContainText('Alterações não enviadas');
  expect(document.settings.businessName).toBe('Espaço privado de teste');
  page.on('dialog',d=>d.accept());
  await page.getByRole('button',{name:'Minha conta'}).click();
  await page.getByRole('button',{name:'Recarregar da conta'}).click();
  await page.getByRole('button',{name:'Minha conta'}).click();
  await page.getByRole('button',{name:'Sair da conta'}).click();
  await expect(page.locator('#account-button')).toHaveText('Entrar na conta');
});

test('pagamento desconhecido permanece pendente ao editar custos e aceita recebimento depois', async ({page}) => {
  await page.goto('/');
  await page.evaluate(()=>{
    const snapshot = JSON.parse(JSON.stringify(data));
    snapshot.clients.push({id:'unknown-client',name:'Pagamento sintético'});
    snapshot.clientVisits.push({id:'unknown-visit',clientId:'unknown-client',procedure:'Botox',date:localDate(),durationMinutes:60,chargedTotal:0,paymentConfirmed:false,roomCost:null,materialCostSnapshot:null});
    localStorage.setItem('estetica-pro-ia-demo-v1',JSON.stringify(snapshot));
  });
  await page.reload(); await page.goto('/#financeiro'); await revealPanels(page);
  await page.locator('.finance-visits-table').getByRole('button',{name:'Editar',exact:true}).click();
  let form = page.locator('#crm-visit-form');
  await expect(form.locator('[name=receivedValue]')).toHaveValue('');
  await form.locator('[name=roomCost]').fill('0,00'); await form.locator('[name=materialCost]').fill('0,00');
  await form.getByRole('button',{name:'Salvar atendimento'}).click();
  await page.goto('/#inicio');
  await expect(page.locator('#overview-tasks')).toContainText('Pagamento ainda não informado');
  await page.goto('/#financeiro'); await revealPanels(page);
  await page.locator('.finance-visits-table').getByRole('button',{name:'Editar',exact:true}).click();
  form = page.locator('#crm-visit-form');
  await form.locator('[name=receivedValue]').fill('200,00');
  await form.getByRole('button',{name:'Salvar atendimento'}).click();
  const snapshot = await page.evaluate(()=>JSON.parse(localStorage.getItem('estetica-pro-ia-demo-v1')));
  expect(snapshot.transactions.filter(t=>t.sourceVisitId==='unknown-visit')).toHaveLength(1);
  expect(snapshot.clientVisits.find(v=>v.id==='unknown-visit').paymentConfirmed).toBe(true);
});
for (const width of [360,390,768,1440]) test(`telas e formulários sem transbordamento a ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900});
  await page.goto('/#inicio');
  for (const route of ['inicio','agenda','financeiro','crm','configuracoes']) {
    await page.goto(`/#${route}`);
    await expect(page.locator('#page-title')).not.toBeEmpty();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({path:`.cache/visual/${width}-${route}.png`,fullPage:true});
  }
  await page.getByRole('button',{name:'Entrar na conta',exact:true}).click();
  await expect(page.locator('#cloud-login-form')).toBeVisible();
  const box = await page.locator('.modal-card').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x+box.width).toBeLessThanOrEqual(width+1);
  await page.screenshot({path:`.cache/visual/${width}-login.png`,fullPage:true});
});
