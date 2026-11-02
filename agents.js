/* Manifesto local dos agentes planejados. Não inicializa serviços nem integrações externas. */
(function registerEsteticaAgents(root) {
  const profiles = {
    inicio: {
      name: 'Central de agentes', area: 'PAINEL DE OPERAÇÃO', symbol: '✦',
      purpose: 'Uma estrutura para reunir especialistas por área e, no futuro, coordenar tarefas entre eles com sua revisão.',
      current: 'O painel atual funciona localmente com dados demonstrativos. Não há IA generativa, chamadas externas nem cobrança por uso.',
      scopes: ['Secretária clínica', 'Relacionamento com clientes', 'Marketing estético', 'Agenda', 'Financeiro', 'Jurídico e regulatório'],
      integrations: ['Google Agenda', 'Agenda do coworking', 'Canva', 'Serviços externos opcionais']
    },
    secretaria: {
      name: 'Secretária de clínica estética', area: 'AGENTE DE ROTINA', symbol: '✳',
      purpose: 'Apoiar a rotina da clínica consultando o que for necessário e preparando tarefas para sua aprovação.',
      current: 'Responde por regras locais sobre agenda, lançamentos, aprovações e Marketing. Não envia mensagens, não altera dados por conta própria e não orienta condutas clínicas.',
      scopes: ['Agenda', 'Fichas de clientes', 'Aprovações', 'Resumo financeiro', 'Marketing'],
      integrations: ['Google Agenda', 'Agenda do coworking', 'Canais de mensagem (futuro)']
    },
    crm: {
      name: 'Estrategista de relacionamento', area: 'AGENTE DE RELACIONAMENTO', symbol: '◎',
      purpose: 'Transformar históricos administrativos em ideias de retorno e relacionamento mais úteis para a clínica.',
      current: 'Rankings e previsões de retorno são calculados localmente. Recomendações estratégicas com IA ainda não estão conectadas.',
      scopes: ['Atendimentos e retornos', 'Indicadores agregados', 'Agenda', 'Ações de relacionamento'],
      integrations: ['Agenda', 'Marketing', 'Secretária clínica']
    },
    marketing: {
      name: 'Estrategista de marketing estético', area: 'AGENTE DE MARKETING', symbol: '◈',
      purpose: 'Planejar divulgação para estética avançada e criar conteúdos educativos, campanhas e calendário editorial alinhados à sua marca.',
      current: 'O editor, os modelos e o planejamento local ajudam a estruturar peças sem IA externa. Revise informações profissionais antes de publicar.',
      scopes: ['Estratégia e calendário', 'Posts, Reels e Stories', 'Identidade visual', 'Fila de aprovação'],
      integrations: ['Canva', 'Biblioteca de marca', 'Publicação social (futuro)']
    },
    identidade: {
      name: 'Assistente de identidade da marca', area: 'AGENTE DE MARCA', symbol: '✦',
      purpose: 'Manter logo, cores e tipografia consistentes nos materiais da clínica.',
      current: 'A identidade e o monograma são usados localmente nas novas prévias e artes.',
      scopes: ['Logotipo e paleta', 'Tipografia', 'Modelos de Marketing'],
      integrations: ['Canva', 'Modelos e biblioteca de conteúdo']
    },
    agenda: {
      name: 'Agente de agenda', area: 'AGENTE DE AGENDAMENTO', symbol: '▦',
      purpose: 'Ajudar a organizar horários, identificar conflitos e preparar confirmações com sua revisão.',
      current: 'A agenda atual salva compromissos neste navegador e funciona sem sincronização externa.',
      scopes: ['Compromissos', 'Disponibilidade', 'Retornos', 'Aprovações de contato'],
      integrations: ['Google Agenda', 'Agenda do coworking', 'Secretária clínica']
    },
    aprovacoes: {
      name: 'Agente de revisão e aprovações', area: 'AGENTE DE REVISÃO', symbol: '✓',
      purpose: 'Reunir o que precisa da sua revisão e ajudar a conferir contexto, consistência e próximos passos.',
      current: 'A central mantém uma fila local. Aprovar ou rejeitar só altera o status demonstrativo; nada é enviado ou publicado.',
      scopes: ['Conteúdos de Marketing', 'Tarefas da secretária', 'Confirmações de agenda'],
      integrations: ['Secretária clínica', 'Marketing', 'Agenda']
    },
    whatsapp: {
      name: 'Assistente de relacionamento', area: 'AGENTE DE ATENDIMENTO', symbol: '◌',
      purpose: 'Preparar respostas administrativas para clientes, sempre para revisão explícita da Tami antes de qualquer envio futuro.',
      current: 'Somente rascunhos locais e status de revisão. WhatsApp, automação e IA externa permanecem desligados.',
      scopes: ['Agendamento', 'Informações administrativas', 'Encaminhamento de dúvidas clínicas à Tami'],
      integrations: ['WhatsApp Business Platform', 'Secretária clínica', 'Central de aprovações']
    },
    financeiro: {
      name: 'Copiloto financeiro', area: 'AGENTE FINANCEIRO', symbol: 'R$',
      purpose: 'Organizar receitas, despesas, conciliação e relatórios para apoiar a gestão do caixa da clínica.',
      current: 'O sistema soma lançamentos locais e recebimentos de clientes. Não substitui contador, escrituração ou orientação fiscal.',
      scopes: ['Receitas e despesas', 'Recebimentos de clientes', 'Relatórios de caixa'],
      integrations: ['Sistema contábil (futuro)', 'Exportação financeira', 'Secretária clínica · resumos']
    },
    juridico: {
      name: 'Assistente jurídico e regulatório', area: 'AGENTE JURÍDICO', symbol: '§',
      purpose: 'Ajudar a organizar documentos, temas regulatórios e perguntas para levar a profissionais habilitados.',
      current: 'O módulo monta roteiros locais e aponta fontes oficiais. Não oferece parecer nem acompanha prazos automaticamente.',
      scopes: ['Organização de documentos', 'Fontes oficiais', 'Lista de próximos passos'],
      integrations: ['Fontes oficiais', 'Revisão de profissional habilitado']
    }
  };
  Object.values(profiles).forEach((profile) => {
    Object.freeze(profile.scopes);
    Object.freeze(profile.integrations);
    Object.freeze(profile);
  });
  root.EsteticaAgentPlan = Object.freeze(profiles);
})(window);
