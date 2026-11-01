const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'marketing-engine.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context, { filename: 'marketing-engine.js' });
const engine = context.window.EsteticaMarketingEngine;

const identity = {
  colors: { primary: '#102A43', secondary: '#E3D4BE', background: '#F5EFE5', text: '#333333', highlight: '#B9975B' },
  titleFont: 'serif', bodyFont: 'sans', logo: ''
};

test('recomenda estratégias por objetivo e estágio, sem declarar IA conectada', async () => {
  const result = await engine.generateViaServerAdapter({ topic: 'Botox', goal: 'educacao', stage: 'descobrindo' }, null);
  assert.equal(engine.realAIConnected, false);
  assert.equal(result.mode, 'demo-local');
  assert.equal(result.strategies.length, 8);
  assert.equal(result.strategies[0].id, 'educativo');
  assert.equal(result.strategies[0].recommended, true);
  assert.ok(result.strategies.every((item) => item.audience && item.objective && item.formatName && item.justification));
});

test('publicação educativa herda marca e não promete resultado clínico', () => {
  const plan = engine.buildPublication({ topic: 'Botox', audience: 'Público interessado', goal: 'educacao', stage: 'descobrindo', format: 'auto', period: 'semanal' }, 'educativo', identity);
  assert.equal(plan.slides.length, 4);
  assert.equal(plan.slides[0].bg, identity.colors.background);
  assert.equal(plan.slides[0].primary, identity.colors.primary);
  assert.match(plan.caption, /avaliação profissional/i);
  assert.doesNotMatch(`${plan.caption} ${plan.slides.map((slide) => slide.body).join(' ')}`, /garantido|garantia|resultado certo/i);
  assert.ok(plan.slides.every((slide) => slide.composition && slide.altText));
  assert.ok(plan.cta && plan.hashtags && plan.coverSuggestion && plan.graphicElements && plan.visualDirections);
});

test('condição comercial só aparece quando informada e o calendário mensal sugere uma cadência', () => {
  const withoutOffer = engine.buildPublication({ topic: 'Botox', authorizedOffer: '', period: 'semanal' }, 'oferta', identity);
  assert.match(withoutOffer.slides.map((slide) => slide.body).join(' '), /nenhuma condição comercial foi informada/i);
  assert.doesNotMatch(withoutOffer.slides.map((slide) => slide.body).join(' '), /R\$|\d+%/);
  const withOffer = engine.buildPublication({ topic: 'Botox', authorizedOffer: 'Avaliação inicial por R$ 150 conforme regras do espaço', period: 'mensal' }, 'oferta', identity);
  assert.match(withOffer.slides[0].body, /Avaliação inicial por R\$ 150 conforme regras do espaço/);
  const calendar = engine.buildPublication({ topic: 'Botox', period: 'mensal' }, 'calendario', identity);
  assert.equal(calendar.slides.length, 5);
  assert.equal(calendar.sequence.length, 5);
  assert.match(calendar.sequence.join(' '), /Semana 1/);
});

test('regenerar título, slide ou legenda preserva os outros campos', () => {
  const plan = engine.buildPublication({ topic: 'Botox', goal: 'educacao' }, 'educativo', identity);
  const newTitle = engine.regenerateTitle(plan);
  assert.notEqual(newTitle.title, plan.title);
  assert.deepEqual(newTitle.slides.slice(1), plan.slides.slice(1));
  const newSlide = engine.regenerateSlide(plan, 1);
  assert.notEqual(newSlide.slides[1].body, plan.slides[1].body);
  assert.equal(newSlide.slides[0].body, plan.slides[0].body);
  assert.equal(newSlide.caption, plan.caption);
  const newCaption = engine.regenerateCaption(plan);
  assert.notEqual(newCaption.caption, plan.caption);
  assert.deepEqual(newCaption.slides, plan.slides);
});
