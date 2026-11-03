const {test,expect}=require('@playwright/test');
const {revealPanels}=require('./helpers.cjs');
const routes=['inicio','secretaria','crm','marketing','agenda','whatsapp','financeiro','juridico','identidade','aprovacoes','configuracoes'];
for(const width of [320,390,768,1024]) test(`abas abertas, leitura e toque a ${width}px`,async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height:960});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
    await page.goto(`/#${route}`);await revealPanels(page);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBe(true);
    for(const button of await page.locator('.section-disclosure-toggle:visible').all()){
      expect((await button.boundingBox()).height,route).toBeGreaterThanOrEqual(44);
      await expect(button.locator('.section-disclosure-action')).toHaveText('Fechar');
      const ids=(await button.getAttribute('aria-controls')).split(' ');
      for(const id of ids) expect(await page.locator(`[id="${id}"]`).count()).toBe(1);
    }
    if(['marketing','juridico','financeiro','secretaria'].includes(route))
      await page.screenshot({path:`.cache/visual/access-${width}-${route}.png`,fullPage:true});
    if(route==='marketing') {
      await page.locator('[data-model="primeira-conversa"]').first().click();await revealPanels(page);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'editor').toBe(true);
      await page.screenshot({path:`.cache/visual/access-${width}-editor.png`,fullPage:true});
    }
  }
  expect(errors).toEqual([]);
});
test('brilho, foco visível, estado e movimento reduzido',async({page})=>{
  await page.goto('/#crm');
  const button=page.getByRole('button',{name:'Clientes',exact:true});
  const panel=button.locator('xpath=ancestor::*[@data-disclosure-panel][1]');
  await page.mouse.move(0,0);
  const before=await panel.evaluate(el=>getComputedStyle(el).boxShadow);
  await button.hover();
  await expect.poll(()=>panel.evaluate(el=>getComputedStyle(el).boxShadow)).not.toBe(before);
  await page.mouse.move(0,0);await button.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
  expect(await button.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-expanded','true');
  await expect(button.locator('.section-disclosure-action')).toHaveText('Fechar');
  await page.keyboard.press('Space');await expect(button).toHaveAttribute('aria-expanded','false');
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await panel.evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.emulateMedia({forcedColors:'active'});
  await button.focus();
  expect(await button.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
});
test('toque, menu, atalho de conteúdo e foco no diálogo',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();await page.goto('/#crm');
  const button=page.getByRole('button',{name:'Clientes',exact:true});
  await button.tap();await expect(button.locator('.section-disclosure-action')).toHaveText('Fechar');
  await button.tap();await expect(button.locator('.section-disclosure-action')).toHaveText('Abrir');
  const menu=page.locator('.mobile-menu');await menu.tap();await expect(menu).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');await expect(menu).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#sidebar')).toBeHidden();
  await page.locator('.skip-link').focus();await page.keyboard.press('Enter');
  await expect(page.locator('#page-title')).toBeFocused();await expect(page).toHaveURL(/#crm$/);
  const account=page.getByRole('button',{name:'Entrar na conta',exact:true});await account.tap();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  const controls=dialog.locator('button,input,select,textarea,a[href]').filter({visible:true});
  await controls.first().focus();await page.keyboard.press('Shift+Tab');await expect(controls.last()).toBeFocused();
  await page.keyboard.press('Tab');await expect(controls.first()).toBeFocused();
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(account).toBeFocused();
  await context.close();
});
