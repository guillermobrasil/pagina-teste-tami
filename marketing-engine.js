/*
 * Camada de estratégia do Estética Pro IA.
 * Esta versão usa estruturas locais; não chama IA, rede ou serviços externos.
 * Uma integração futura deve receber apenas um adaptador do servidor, nunca uma chave no navegador.
 */
(function attachMarketingEngine(root) {
  const strategies = [
    { id: 'educativo', name: 'Educativo', purpose: 'Explicar o tema e organizar dúvidas para uma conversa informada.', format: 'carousel', reasons: 'Uma sequência curta permite introduzir o assunto, contextualizar e terminar com uma pergunta segura.' },
    { id: 'objecoes', name: 'Quebra de objeções', purpose: 'Acolher mitos, receios e perguntas sem pressionar ou prometer resultados.', format: 'carousel', reasons: 'Separar dúvida, contexto e convite à conversa ajuda a responder com calma e clareza.' },
    { id: 'autoridade', name: 'Autoridade profissional', purpose: 'Apresentar critérios de avaliação, conhecimentos e cuidados profissionais.', format: 'post', reasons: 'Um ponto de vista profissional pode demonstrar método sem depender de depoimentos ou promessas.' },
    { id: 'engajamento', name: 'Engajamento', purpose: 'Abrir uma conversa por meio de perguntas, enquetes e temas relacionados.', format: 'story', reasons: 'Uma pergunta simples reduz a barreira para a audiência compartilhar o que gostaria de entender.' },
    { id: 'conversao', name: 'Conversão', purpose: 'Convidar pessoas interessadas a entrar em contato ou agendar uma avaliação.', format: 'post', reasons: 'Uma chamada clara indica o próximo passo sem criar urgência artificial nem garantir resultados.' },
    { id: 'oferta', name: 'Oferta comercial', purpose: 'Comunicar uma condição comercial que a profissional informou e autorizou.', format: 'story', reasons: 'A peça deixa a condição visível e separada de alegações clínicas; sem condição informada, não inventa preço ou desconto.' },
    { id: 'bastidores', name: 'Bastidores e humanização', purpose: 'Apresentar a rotina profissional, o espaço e detalhes do atendimento.', format: 'reel', reasons: 'Cenas do ambiente e da preparação ajudam a mostrar a experiência sem expor pacientes.' },
    { id: 'calendario', name: 'Calendário estratégico', purpose: 'Distribuir conteúdos complementares ao longo de uma semana ou de um mês.', format: 'carousel', reasons: 'Uma sequência alterna descoberta, educação, confiança, conversa e convite, evitando repetir a mesma abordagem.' }
  ];
  const formatNames = { post: 'Post único', carousel: 'Carrossel', reel: 'Capa de Reels', story: 'Stories' };
  const goalWeights = {
    educacao: { educativo: 8, objecoes: 5, autoridade: 4, calendario: 3 },
    confianca: { autoridade: 7, bastidores: 4, educativo: 4, objecoes: 3 },
    engajamento: { engajamento: 8, bastidores: 3, objecoes: 2 },
    conversao: { conversao: 8, autoridade: 3, oferta: 2 },
    alcance: { educativo: 4, bastidores: 4, engajamento: 3, calendario: 2 },
    oferta: { oferta: 8, conversao: 4, calendario: 2 }
  };
  const titleIdeas = {
    educativo: ['O que conversar sobre {topic}?', 'Informação antes da decisão: {topic}', '{topic}: perguntas para levar à avaliação'],
    objecoes: ['Dúvidas sobre {topic}: vamos conversar?', 'O que você gostaria de entender sobre {topic}?', '{topic}: receios merecem escuta'],
    autoridade: ['Como uma avaliação organiza a conversa sobre {topic}', 'Critérios e cuidado ao falar sobre {topic}', 'O que observar numa conversa profissional sobre {topic}'],
    engajamento: ['O que você gostaria de saber sobre {topic}?', 'Qual é sua principal dúvida sobre {topic}?', 'Vamos conversar sobre {topic}?'],
    conversao: ['Pensando em {topic}? Comece com uma conversa', 'Seu próximo passo pode ser uma avaliação sobre {topic}', 'Quer entender se {topic} faz sentido para você?'],
    oferta: ['Uma condição especial para conversar sobre {topic}', 'Uma oportunidade informada pelo espaço', 'Conheça a condição comercial desta campanha'],
    bastidores: ['Um pouco da rotina por trás de {topic}', 'Cuidado também está nos detalhes', 'Conheça o espaço e a rotina profissional'],
    calendario: ['Uma pauta por etapa: conheça {topic}', '{topic} em uma conversa, passo a passo', 'Quatro ideias para falar sobre {topic}']
  };
  const safe = (value, fallback = '') => String(value || fallback).trim();
  const replaceTopic = (value, topic) => value.replaceAll('{topic}', topic);
  const score = (strategy, input) => {
    let value = (goalWeights[input.goal] || goalWeights.educacao)[strategy.id] || 0;
    if (input.stage === 'descobrindo' && ['educativo', 'bastidores', 'engajamento'].includes(strategy.id)) value += 2;
    if (input.stage === 'considerando' && ['conversao', 'autoridade', 'objecoes'].includes(strategy.id)) value += 2;
    if (input.stage === 'acompanha' && ['autoridade', 'engajamento', 'calendario'].includes(strategy.id)) value += 1;
    if (input.format && input.format !== 'auto' && input.format === strategy.format) value += 1;
    if (strategy.id === 'oferta' && !input.authorizedOffer) value -= 2;
    return value;
  };
  function recommend(input) {
    const topic = safe(input.topic);
    if (topic.length < 2) throw new Error('Informe um assunto com pelo menos 2 caracteres.');
    const audience = safe(input.audience, 'Pessoas interessadas no assunto');
    const sorted = strategies.map((strategy) => ({ ...strategy, score: score(strategy, input) })).sort((a, b) => b.score - a.score);
    const winner = sorted[0];
    return sorted.map((strategy) => ({
      id: strategy.id,
      name: strategy.name,
      title: replaceTopic(strategy.id === 'oferta' && !input.authorizedOffer ? 'Converse sobre {topic} sem compromisso' : titleIdeas[strategy.id][0], topic),
      audience,
      objective: strategy.purpose,
      format: input.format && input.format !== 'auto' ? input.format : strategy.format,
      formatName: formatNames[input.format && input.format !== 'auto' ? input.format : strategy.format],
      justification: strategy.reasons,
      recommended: strategy.id === winner.id,
      score: strategy.score,
      period: strategy.id === 'calendario' ? (input.period || 'semanal') : null
    }));
  }
  function paletteDirections(identity, index = 0) {
    const colors = identity?.colors || {};
    const background = colors.background || '#F3EEE4';
    const primary = colors.primary || '#172B43';
    const secondary = colors.secondary || '#D9CDB9';
    const highlight = colors.highlight || '#B6975A';
    if (index % 3 === 2) return `Fundo azul-marinho ${primary}, texto claro e detalhe dourado ${highlight}; use bege ${secondary} como apoio.`;
    return `Fundo creme ${background}, título azul-marinho ${primary}, formas bege ${secondary} e detalhe dourado discreto ${highlight}.`;
  }
  function buildPublication(input, strategyId, identity, revision = {}) {
    const strategy = strategies.find((item) => item.id === strategyId) || strategies[0];
    const topic = safe(input.topic);
    const offer = safe(input.authorizedOffer);
    const titleRevision = revision.title || 0;
    const title = replaceTopic(strategy.id === 'oferta' && !input.authorizedOffer ? 'Converse sobre {topic} sem compromisso' : titleIdeas[strategy.id][titleRevision % titleIdeas[strategy.id].length], topic);
    const requestedFormat = input.format && input.format !== 'auto' ? input.format : strategy.format;
    const selectedFormat = strategy.id === 'calendario' ? 'carousel' : requestedFormat;
    const count = strategy.id === 'calendario' ? (input.period === 'mensal' ? 5 : 4) : selectedFormat === 'carousel' ? 4 : 1;
    const slideTitles = [title, 'O que vale entender', 'Cada caso pede conversa', 'Leve suas perguntas', 'Um passo de cada vez'];
    const bodyByStrategy = {
      educativo: [
        `Quer conhecer melhor ${topic}? Comece reunindo as perguntas que gostaria de esclarecer.`,
        'Use este espaço para apresentar informações gerais e verificadas pela profissional. Não substitui avaliação individual.',
        'A conversa profissional considera contexto, expectativas e cuidados aplicáveis a cada pessoa.',
        'Anote suas dúvidas e converse com uma profissional habilitada antes de decidir.'
      ],
      objecoes: [
        `Tem dúvidas ou receios sobre ${topic}? Você não precisa decidir antes de conversar.`,
        'Mitos e informações incompletas podem gerar insegurança. Traga a dúvida para uma conversa responsável.',
        'A profissional pode explicar critérios, limites e cuidados pertinentes ao seu contexto.',
        'Uma conversa esclarecedora é um bom lugar para começar — sem pressão.'
      ],
      autoridade: [
        `Falar sobre ${topic} começa pela escuta e por critérios profissionais.`,
        'A avaliação individual ajuda a organizar objetivos e dúvidas antes de qualquer decisão.',
        'Transparência sobre limites e cuidados faz parte de uma comunicação responsável.',
        'Informação geral não substitui uma avaliação profissional.'
      ],
      engajamento: [
        `Qual é sua principal dúvida sobre ${topic}?`,
        'O que você gostaria que uma profissional explicasse com mais clareza?',
        'Responda à enquete ou envie uma pergunta geral. Evite compartilhar dados pessoais.',
        'As perguntas podem inspirar próximos conteúdos educativos.'
      ],
      conversao: [
        `Tem interesse em conversar sobre ${topic}?`,
        'Uma avaliação é um espaço para compartilhar expectativas e esclarecer dúvidas.',
        'A profissional explica possibilidades e limites de acordo com cada contexto.',
        'Se fizer sentido para você, entre em contato para saber como funciona a avaliação.'
      ],
      oferta: [
        offer ? `Condição informada pelo espaço: ${offer}` : 'Nenhuma condição comercial foi informada; esta publicação não divulgará preço ou desconto.',
        offer ? 'Confira o período, as regras e os detalhes diretamente com a profissional.' : 'Nenhuma condição comercial foi informada. Não inclua preço ou desconto nesta peça.',
        'Informações comerciais não representam promessa de resultado clínico.',
        'Entre em contato para tirar dúvidas sobre a condição informada.'
      ],
      bastidores: [
        'O cuidado também aparece na organização da rotina e do ambiente.',
        'Mostre detalhes do espaço, materiais ou preparação, sem identificar pessoas.',
        'Compartilhe o propósito de um cuidado profissional que faz parte da rotina.',
        'Privacidade e autorização vêm antes de qualquer imagem de paciente.'
      ],
      calendario: [
        `Semana 1 · Descoberta: uma pergunta inicial sobre ${topic}.`,
        'Semana 2 · Educação: responda uma dúvida geral com fontes revisadas.',
        'Semana 3 · Confiança: apresente critérios de avaliação e cuidados de comunicação.',
        'Semana 4 · Conversa: convide para uma avaliação, sem urgência artificial.'
      ]
    };
    const slideLabels = bodyByStrategy[strategy.id];
    const slides = Array.from({ length: count }, (_, index) => {
      const background = identity?.colors?.background || '#F3EEE4';
      const text = identity?.colors?.text || '#393B3E';
      const primary = identity?.colors?.primary || '#172B43';
      const secondary = identity?.colors?.secondary || '#D9CDB9';
      const highlight = identity?.colors?.highlight || '#B6975A';
      const textValue = revision.slides?.[index] || 0;
      return {
        title: index === 0 ? title : slideTitles[index],
        subtitle: index === 0 ? strategy.name : `Sobre ${topic} · ${index + 1}/${count}`,
        body: textValue ? `${slideLabels[index % slideLabels.length]}\n\nLembrete: revise o conteúdo antes de usar.` : slideLabels[index % slideLabels.length],
        composition: `Composição ${index + 1}: ${paletteDirections(identity, index)} ${index === 0 ? 'Título em destaque, margens generosas e um elemento editorial simples.' : 'Texto curto em blocos, hierarquia clara e bastante espaço em branco.'}`,
        altText: `Arte ${index + 1} de ${count}, estratégia ${strategy.name.toLocaleLowerCase('pt-BR')}. Título: ${index === 0 ? title : slideTitles[index]}. Texto em fundo de alto contraste.`,
        bg: index % 3 === 2 ? primary : index % 3 === 1 ? secondary : background,
        textColor: index % 3 === 2 ? background : text,
        primary: index % 3 === 2 ? background : primary,
        secondary, accent: highlight,
        font: identity?.titleFont || 'serif', bodyFont: identity?.bodyFont || 'sans',
        align: 'left', image: ''
      };
    });
    const ctas = {
      educativo: 'Salve este conteúdo e converse com uma profissional habilitada para dúvidas individuais.',
      objecoes: 'Envie uma pergunta geral ou converse com a profissional, sem compartilhar dados pessoais.',
      autoridade: 'Conheça como funciona uma avaliação profissional e tire suas dúvidas.',
      engajamento: 'Responda à enquete ou deixe uma pergunta para os próximos conteúdos.',
      conversao: 'Entre em contato para saber como funciona uma avaliação, sem compromisso.',
      oferta: offer ? 'Entre em contato para confirmar detalhes e condições da oferta informada.' : 'Converse com a profissional para conhecer os serviços e tirar dúvidas.',
      bastidores: 'Acompanhe os próximos conteúdos sobre a rotina profissional.',
      calendario: 'Acompanhe a sequência e guarde as perguntas que gostaria de esclarecer.'
    };
    const captionOpeners = [
      `Quando o assunto é ${topic}, informação clara e conversa responsável caminham juntas.`,
      `Vamos falar sobre ${topic} com calma, contexto e espaço para dúvidas.`,
      `Um conteúdo sobre ${topic}, preparado para informar sem prometer resultados.`
    ];
    const caption = `${captionOpeners[(revision.caption || 0) % captionOpeners.length]}\n\n${strategy.purpose}\n\n${ctas[strategy.id]}\n\nCada pessoa tem necessidades próprias. Conteúdo informativo não substitui avaliação profissional.`;
    const tags = ['#estetica', '#biomedicinaestetica', '#informacaoresponsavel', '#autocuidado', '#saudecomresponsabilidade'];
    const publication = {
      concept: `${strategy.name} sobre ${topic}: uma mensagem clara, acolhedora e sem garantias clínicas.`,
      title, slides, caption, cta: ctas[strategy.id], hashtags: tags.join(' '),
      altText: slides.map((slide) => slide.altText).join('\n'),
      coverSuggestion: `Capa com a pergunta “${title}”, fundo creme, contraste azul-marinho e um detalhe dourado discreto.`,
      graphicElements: 'Linhas editoriais finas, formas geométricas simples e ícones abstratos; sem selos de resultado ou antes/depois.',
      visualDirections: paletteDirections(identity),
      identity: identity ? JSON.parse(JSON.stringify(identity)) : null,
      sequence: strategy.id === 'calendario' ? (input.period === 'mensal' ? [
        'Semana 1 · Descoberta e pergunta aberta', 'Semana 2 · Educação e dúvida frequente', 'Semana 3 · Autoridade e bastidores profissionais', 'Semana 4 · Conversa e convite para avaliação', 'Semana 5 · Retomada das dúvidas mais recorrentes'
      ] : ['Dia 1 · Pergunta de descoberta', 'Dia 3 · Conteúdo educativo', 'Dia 5 · Critérios e cuidados profissionais', 'Dia 7 · Convite para conversar']) : [],
      strategy: { id: strategy.id, name: strategy.name, objective: strategy.purpose },
      context: { ...input, topic, format: selectedFormat },
      revisions: { title: titleRevision, caption: revision.caption || 0, slides: revision.slides || {} },
      source: 'demo-local', sourceLabel: 'Sugestão demonstrativa local · sem IA conectada'
    };
    return publication;
  }
  function regenerateTitle(publication) {
    const revisions = { ...publication.revisions, title: (publication.revisions?.title || 0) + 1 };
    const regenerated = buildPublication(publication.context, publication.strategy.id, publication.identity, revisions);
    return { ...publication, title: regenerated.title, slides: publication.slides.map((slide, index) => index ? slide : { ...slide, title: regenerated.title }), revisions };
  }
  function regenerateSlide(publication, index) {
    const revisions = { ...publication.revisions, slides: { ...(publication.revisions?.slides || {}), [index]: ((publication.revisions?.slides || {})[index] || 0) + 1 } };
    const regenerated = buildPublication(publication.context, publication.strategy.id, publication.identity, revisions).slides[index];
    return { ...publication, slides: publication.slides.map((slide, slideIndex) => slideIndex === index ? { ...slide, title: regenerated.title, subtitle: regenerated.subtitle, body: regenerated.body, composition: regenerated.composition, altText: regenerated.altText } : slide), altText: publication.slides.map((slide, slideIndex) => slideIndex === index ? regenerated.altText : slide.altText).join('\n'), revisions };
  }
  function regenerateCaption(publication) {
    const revisions = { ...publication.revisions, caption: (publication.revisions?.caption || 0) + 1 };
    const regenerated = buildPublication(publication.context, publication.strategy.id, publication.identity, revisions);
    const originalCTA = regenerated.cta;
    const preservedCTA = safe(publication.cta, originalCTA);
    return { ...publication, caption: regenerated.caption.replace(originalCTA, preservedCTA), revisions };
  }
  async function generateViaServerAdapter(input, serverAdapter) {
    if (serverAdapter && typeof serverAdapter.generateMarketingPackage === 'function') {
      return { ...await serverAdapter.generateMarketingPackage(input), source: 'server-ai', sourceLabel: 'Gerado por IA conectada via servidor' };
    }
    return { mode: 'demo-local', sourceLabel: 'Demonstração local · não há IA conectada', strategies: recommend(input) };
  }
  root.EsteticaMarketingEngine = Object.freeze({
    provider: 'demo-local', realAIConnected: false, strategies: recommend, buildPublication,
    regenerateTitle, regenerateSlide, regenerateCaption, generateViaServerAdapter,
    formats: Object.freeze(formatNames)
  });
})(window);
