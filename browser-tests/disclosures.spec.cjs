const {test,expect}=require('@playwright/test');
for (const width of [390,1440]) test(`caixas independentes em todas as abas, exceto Visão geral, em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/#inicio');
  await expect(page.locator('#overview-view .section-disclosure-toggle')).toHaveCount(0);
  for(const route of ['secretaria','crm','marketing','agenda','whatsapp','financeiro','juridico','identidade','aprovacoes','configuracoes']) {
    await page.goto(`/#${route}`);
    const buttons=page.locator('#workspace-view .section-disclosure-toggle:visible');
    expect(await buttons.count(),route).toBeGreaterThan(0);
    const visuals=await page.locator('#workspace-view .disclosure-panel').evaluateAll(panels=>panels.map(panel=>({kind:panel.dataset.disclosureIcon,icons:panel.querySelector(':scope > .disclosure-heading').querySelectorAll('.section-disclosure-icon svg').length})));
    expect(visuals.every(panel=>panel.kind && panel.icons===1),route).toBe(true);
    await expect(page.locator('#workspace-view .section-disclosure-toggle[aria-expanded="true"]')).toHaveCount(0);
    const first=buttons.first();
    const ids=(await first.getAttribute('aria-controls')).split(' ');
    await first.click(); await expect(first).toHaveAttribute('aria-expanded','true');
    expect(await page.evaluate(ids=>ids.some(id=>!document.getElementById(id).hidden),ids)).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),route).toBe(true);
    await first.click(); await expect(first).toHaveAttribute('aria-expanded','false');
    expect(await page.evaluate(ids=>ids.every(id=>document.getElementById(id).hidden),ids)).toBe(true);
  }
  await page.goto('/#crm');
  const clients=page.getByRole('button',{name:'Clientes',exact:true});
  const returns=page.getByRole('button',{name:'Retornos',exact:true});
  await expect(clients).toHaveAttribute('aria-expanded','false');
  await expect(returns).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('.crm-panel').filter({has:clients})).toHaveAttribute('data-disclosure-icon','users');
  await expect(page.locator('.crm-panel').filter({has:returns})).toHaveAttribute('data-disclosure-icon','repeat');
  await page.screenshot({path:`.cache/visual/disclosures-${width}-crm-closed.png`,fullPage:true});
  // Clicar na faixa BASE LOCAL também expande, sem mexer na caixa vizinha.
  await page.locator('.crm-panel').filter({has:clients}).locator('.eyebrow').first().click();
  await expect(clients).toHaveAttribute('aria-expanded','true');
  await expect(returns).toHaveAttribute('aria-expanded','false');
  await returns.focus(); await page.keyboard.press('Enter');
  await expect(returns).toHaveAttribute('aria-expanded','true');
  await clients.focus(); await page.keyboard.press('Space');
  await expect(clients).toHaveAttribute('aria-expanded','false');
  await expect(returns).toHaveAttribute('aria-expanded','true');
  const ranking=page.locator('.crm-rank-card .section-disclosure-toggle').first();
  await ranking.click(); await expect(ranking).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.crm-rank-card .section-disclosure-toggle[aria-expanded="true"]')).toHaveCount(1);
  await page.screenshot({path:`.cache/visual/disclosures-${width}-crm-open.png`,fullPage:true});
  await page.goto('/#agenda'); await page.goto('/#crm');
  await expect(returns).toHaveAttribute('aria-expanded','true');
  // Ação do cabeçalho funciona mesmo com o conteúdo recolhido.
  await page.getByRole('button',{name:'＋ Cadastrar cliente',exact:true}).click();
  await expect(page.locator('#crm-client-form')).toBeVisible();
  expect(errors).toEqual([]);
});

test('validação revela o campo inválido e filtros continuam no mesmo formulário',async({page})=>{
  await page.goto('/#configuracoes');
  const general=page.getByRole('button',{name:'Geral',exact:true});
  await general.click();
  await page.locator('#settings-form [name=defaultDuration]').fill('0.1');
  await general.click();
  await page.getByRole('button',{name:'Salvar configurações',exact:true}).click();
  await expect(general).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#settings-form [name=defaultDuration]')).toBeVisible();
});
