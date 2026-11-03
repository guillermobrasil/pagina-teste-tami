async function revealPanels(page) {
  for (let i=0;i<100;i++) {
    const closed=page.locator('#workspace-view .section-disclosure-toggle[aria-expanded="false"]:visible');
    if (!await closed.count()) return;
    await closed.first().click();
  }
  throw new Error('Alguma caixa não respondeu ao comando de expansão.');
}
module.exports={revealPanels};
