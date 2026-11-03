(() => {
  // Curadoria manual: links não equivalem a autorização ou acompanhamento processual.
  const regional = {
    council: 'CRBM-6', jurisdiction: 'Paraná', city: 'Curitiba', reviewedAt: '2026-11-02',
    sources: {
      council: { label: 'CRBM-6 · jurisdição e canais oficiais', url: 'https://crbm6.gov.br/' },
      inspection: { label: 'CRBM-6 · fiscalização profissional', url: 'https://crbm6.gov.br/departamento/' },
      ethics: { label: 'CFBM · Código de Ética, Resolução 330/2020', url: 'https://cfbm.gov.br/legislacao/codigo-de-etica/' },
      resolutions: { label: 'CFBM · catálogo de resoluções', url: 'https://cfbm.gov.br/resolucoes-cfbm/' },
      court: { label: 'TRF1 · notícia da decisão sobre a Resolução 241/2014', url: 'https://trf1.jus.br/trf1/noticias/turma-anula-resolucao-que-autorizava-biomedicos-a-fazerem-procedimentos-esteticos-invasivos' },
      councilNote: { label: 'CFBM · posicionamento e recurso informado em 24/02/2026', url: 'https://cfbm.gov.br/nota-de-esclarecimento-atuacao-do-biomedico-na-saude-estetica-e-decisao-do-trf1/' },
      license: { label: 'Curitiba · licenciamento sanitário digital', url: 'https://saude.curitiba.pr.gov.br/conteudo/licenca-sanitaria-digital/1496' },
      localRules: { label: 'Curitiba · legislação sanitária municipal', url: 'https://saude.curitiba.pr.gov.br/conteudo/legislacao-municipal/1633' },
      hygiene: { label: 'Anvisa · segurança do estabelecimento', url: 'https://www.gov.br/anvisa/pt-br/comunicacao/campanhas/estetica/estabelecimento-seguro' },
      privacy: { label: 'LGPD · texto oficial (Lei 13.709/2018)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm' }
    },
    topics: [
      { id: 'registration', title: 'Inscrição, habilitação e responsabilidade técnica', scope: 'CRBM-6 · fiscalização', categories: ['ethical','contract'], sources: ['inspection','council'], items: ['Separe comprovantes de inscrição, habilitações registradas, responsabilidade técnica, situação de anuidade e documentação da pessoa jurídica.', 'Confirme com o CRBM-6 se os registros correspondem à atividade e ao estabelecimento efetivos.'] },
      { id: 'practice', title: 'Limites de atuação e decisões judiciais', scope: 'REVISÃO JURÍDICA NECESSÁRIA', categories: ['ethical','other'], sources: ['court','councilNote','resolutions'], items: ['O TRF1 divulgou em 17/03/2026 decisão que manteve a anulação da Resolução CFBM 241/2014. O CFBM informou recurso em nota de 24/02/2026.', 'Esta base não consultou o andamento atual dos autos nem certifica trânsito em julgado, alcance ou efeito dos recursos. Antes de oferecer procedimentos, peça análise atual ao advogado e orientação formal ao CRBM-6.', 'Inscrição, habilitação, licença sanitária e um curso isoladamente não comprovam permissão para todo procedimento. Não há lista automática de procedimentos liberados nesta tela.'] },
      { id: 'advertising', title: 'Publicidade, redes sociais e imagens', scope: 'CFBM · Código de Ética, arts. 8–11', categories: ['advertising'], sources: ['ethics'], items: ['Confira a identificação profissional, registro no Conselho e habilitações registradas no material divulgado.', 'Revise alegações científicas e retire promessas de resultado ou mensagens enganosas. A responsabilidade também alcança a publicidade do estabelecimento.', 'Imagens de pacientes e resultados exigem conferência das condições do Código, consentimento específico e avisos aplicáveis. Uma autorização de imagem, sozinha, não aprova a publicação.'] },
      { id: 'records', title: 'Consentimento, prontuário e sigilo', scope: 'ÉTICA E PROTEÇÃO DE DADOS', categories: ['records','complaint'], sources: ['ethics','privacy'], items: ['Preserve prontuários e consentimentos íntegros, com acesso restrito. Não use casos identificáveis nesta demonstração.', 'Revise finalidade, base legal, acesso, retenção e resposta a pedidos de titulares com assessoria especializada; não confunda consentimento clínico com autorização de publicidade. O texto da LGPD foi mantido como referência; a leitura automatizada foi bloqueada nesta consulta.'] },
      { id: 'sanitary', title: 'Licenciamento e estrutura em Curitiba', scope: 'MUNICÍPIO · NÃO É REGRA DO CRBM', categories: ['sanitary','contract'], sources: ['license','localRules','hygiene'], items: ['Confira licença do endereço e atividade reais, enquadramento de risco e exigência de projeto com a Vigilância Sanitária municipal.', 'Consulte o processo de licenciamento da Resolução SMS 02/2018 e a análise prévia de atividades da Resolução SMS 05/2025 no portal municipal. Não presuma dispensa pelo nome comercial da atividade.', 'Revise higiene, conservação, armazenamento e processamento dos materiais reutilizáveis conforme o serviço. Licenciamento sanitário e habilitação profissional são verificações distintas.'] },
      { id: 'response', title: 'Fiscalização, notificações e reclamações', scope: 'ORGANIZAÇÃO PARA REVISÃO HUMANA', categories: ['ethical','complaint','other'], sources: ['inspection','ethics'], items: ['Preserve a comunicação original, prova de recebimento, cronologia e documentos do atendimento sem alterações retroativas.', 'Confira o prazo no documento original e o canal oficial do órgão. O sistema não calcula defesa, não protocola resposta e não substitui advogado.'] }
    ]
  };
  const guides = {
    ethical: {
      categoryLabel: 'Conselho profissional', title: 'Prepare uma resposta documentada',
      summary: 'Organize os fatos em ordem cronológica e confira o escopo exato da solicitação recebida.',
      documents: ['Notificação ou comunicação completa recebida, com envelope e comprovante de ciência.', 'Comprovantes de habilitação, inscrição ativa e responsabilidade técnica, quando pertinentes.', 'Prontuário, consentimentos, protocolos e registros relacionados ao atendimento, preservando a confidencialidade.', 'Comprovantes de formação, capacitação e manutenção de equipamentos relacionados ao caso.', 'Registros de contato com o Conselho e os respectivos prazos indicados no documento.'],
      steps: ['Confirme a autenticidade da comunicação pelos canais oficiais do CRBM.', 'Anote a data de recebimento e localize o prazo no documento original; não estime o prazo por este roteiro.', 'Peça a um advogado com experiência em direito profissional ou sanitário para revisar a resposta antes do envio.', 'Mantenha cópia de tudo o que foi recebido e enviado.']
    },
    complaint: {
      categoryLabel: 'Reclamação ou dano', title: 'Preserve os registros e estruture a cronologia',
      summary: 'Separe evidências originais e descreva o que ocorreu sem alterar prontuários ou mensagens.',
      documents: ['Cronologia factual do atendimento, intercorrência e contatos posteriores.', 'Prontuário e termos assinados, com acesso restrito e cópias íntegras.', 'Orientações pré e pós-procedimento e registros de acompanhamento.', 'Identificação do produto, lote, validade e equipamento, se relacionados ao caso.', 'Mensagens e notificações recebidas, preservadas no formato original.'],
      steps: ['Não apague, edite retroativamente ou publique informações sobre o caso.', 'Evite admitir responsabilidade, prometer resultado ou discutir o caso em redes sociais antes de receber orientação.', 'Procure advogado rapidamente se houve notificação, pedido de indenização ou dano à saúde.', 'Se houver risco à saúde, priorize o atendimento assistencial e os canais de urgência adequados.']
    },
    records: {
      categoryLabel: 'Prontuário e privacidade', title: 'Revise a documentação com foco em confidencialidade',
      summary: 'Este roteiro ajuda a localizar registros e fluxos de acesso; não cria nem valida um termo jurídico.',
      documents: ['Modelos atuais de consentimento e ficha de avaliação, sem dados reais de pacientes.', 'Política de acesso, armazenamento, cópia de segurança e descarte de registros.', 'Lista de pessoas e sistemas que acessam informações clínicas.', 'Procedimento interno para pedidos de acesso, correção ou cópia de dados.'],
      steps: ['Restrinja o acesso a quem precisa da informação para a finalidade profissional.', 'Confira a orientação vigente do CRBM e procure assessoria sobre bases legais, retenção e direitos dos titulares.', 'Não compartilhe dados de saúde em ferramentas abertas ou nesta demonstração.', 'Submeta termos e políticas a advogado com experiência em saúde e proteção de dados.']
    },
    advertising: {
      categoryLabel: 'Publicidade profissional', title: 'Faça uma revisão antes de publicar',
      summary: 'Compare o conteúdo com as regras profissionais vigentes e mantenha evidências da revisão.',
      documents: ['Rascunho completo da publicação, incluindo legenda, imagem, vídeo e chamada para ação.', 'Fonte e comprovação de afirmações técnicas ou de resultados divulgados.', 'Autorizações documentadas de imagem e registros de consentimento, se aplicáveis.', 'Identificação profissional e habilitação exibidas no material.'],
      steps: ['Consulte as resoluções atuais do CFBM e as orientações do seu CRBM.', 'Revise promessas, garantias, comparações e imagens de resultados com orientação profissional e jurídica.', 'Confirme direitos de uso das imagens e a autorização específica antes de divulgar.', 'Guarde a versão revisada e a data da conferência das regras.']
    },
    sanitary: {
      categoryLabel: 'Vigilância sanitária', title: 'Monte um dossiê de regularização do espaço',
      summary: 'A exigência pode variar conforme o município, a atividade e a classificação do estabelecimento.',
      documents: ['Licença ou alvará sanitário e documentos do estabelecimento.', 'Registro de responsabilidade técnica e habilitação profissional pertinentes.', 'Relação de procedimentos, produtos e equipamentos utilizados.', 'Registros de manutenção, limpeza, esterilização e gerenciamento de resíduos aplicáveis.', 'Relatórios de inspeção, autos, notificações e comprovantes de resposta.'],
      steps: ['Leia o auto ou solicitação integralmente e registre a data e os prazos informados.', 'Confirme requisitos diretamente com a Vigilância Sanitária local e com o CRBM da sua região.', 'Não presuma que uma regra municipal se aplica a outra localidade.', 'Procure advogado com experiência sanitária se houver autuação, interdição ou prazo de defesa.']
    },
    contract: {
      categoryLabel: 'Contrato e parceria', title: 'Prepare os pontos para revisão contratual',
      summary: 'O roteiro organiza perguntas e documentos, mas não redige nem valida cláusulas.',
      documents: ['Minuta integral do contrato e aditivos existentes.', 'Descrição dos serviços, responsabilidades técnicas e uso do espaço.', 'Condições de pagamento, cancelamento, reembolso e duração.', 'Regras para prontuários, equipamentos, insumos, imagem e dados pessoais.'],
      steps: ['Identifique quais obrigações ficam com cada parte e quais pontos estão indefinidos.', 'Confirme compatibilidade com as normas do Conselho e as exigências sanitárias locais.', 'Peça a um advogado para revisar a minuta antes da assinatura.', 'Não compartilhe dados pessoais ou financeiros confidenciais nesta ferramenta demonstrativa.']
    },
    other: {
      categoryLabel: 'Outra questão', title: 'Organize os fatos antes de buscar orientação',
      summary: 'Comece separando documentos, datas e pessoas envolvidas, sem compartilhar dados identificáveis aqui.',
      documents: ['Comunicações e documentos originais relacionados ao assunto.', 'Cronologia factual com datas, ações e pessoas por função, sem conclusões.', 'Comprovantes de habilitação, registros técnicos ou autorizações pertinentes.', 'Prazos, protocolos e respostas já enviados.'],
      steps: ['Identifique se o assunto envolve Conselho, Vigilância Sanitária, contrato, consumidor ou processo judicial.', 'Confirme prazos diretamente nos documentos recebidos e nos canais oficiais.', 'Não altere registros nem envie uma resposta formal sem revisão adequada.', 'Procure advogado com experiência compatível com o tema.']
    }
  };

  function createGuide(category, context = '') {
    const guide = guides[category] || guides.other;
    const cleanContext = String(context).trim();
    const topics = regional.topics.filter(topic => topic.categories.includes(category));
    return { ...guide, context: cleanContext, topics: topics.length ? topics : regional.topics.filter(topic => topic.id === 'response') };
  }

  const caseKinds = { dissatisfaction:'Insatisfação com resultado estético', complication:'Intercorrência relatada após procedimento', notice:'Notificação ou pedido de reparação', lawsuit:'Processo relacionado à estética', council:'Fiscalização da atuação estética', advertising:'Imagem ou publicidade do atendimento' };
  const caseStatuses = ['Em triagem','Aguardando revisão da Tami','Aguardando advogado','Em acompanhamento','Encerrado'];
  const caseDocuments = { record:'Prontuário e avaliação preservados', consent:'Consentimentos localizados', messages:'Comunicações originais preservadas', trace:'Registros de produtos / equipamentos localizados', notification:'Notificação ou documento recebido preservado' };
  function validateCase(values, clients, visits) {
    if (!clients.some(c => c.id === values.clientId)) throw new Error('Selecione um cliente cadastrado.');
    if (values.visitId && !visits.some(v => v.id === values.visitId && v.clientId === values.clientId)) throw new Error('O atendimento precisa pertencer ao cliente selecionado.');
    if (!Object.hasOwn(caseKinds,values.kind) || !caseStatuses.includes(values.status)) throw new Error('Confira o assunto e a situação do caso.');
    const summary = String(values.summary || '').trim().slice(0,1200);
    if (summary.length < 10) throw new Error('Descreva os fatos em pelo menos 10 caracteres.');
    const date = String(values.date || '');
    const validDate = value => { const parsed = new Date(value+'T12:00:00Z'); return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === value; };
    if (!validDate(date)) throw new Error('Informe uma data válida para o registro.');
    const deadline = String(values.deadline || '');
    if (deadline && (!validDate(deadline) || !values.deadlineChecked)) throw new Error('Confira a data de acompanhamento no documento ou com o advogado e confirme essa conferência.');
    return {clientId:values.clientId, visitId:values.visitId || '', kind:values.kind, status:values.status, date, summary, deadline, deadlineChecked:!!deadline, healthConcern:values.healthConcern === true, documents:Object.fromEntries(Object.keys(caseDocuments).map(key=>[key,values.documents?.[key] === true]))};
  }
  function casePlan(item) {
    const formal = ['notice','lawsuit','council'].includes(item.kind);
    const missing = Object.keys(caseDocuments).filter(key=>!item.documents?.[key] && (key !== 'notification' || formal));
    const steps = ['Organize a sequência dos fatos e preserve registros originais; não altere retrospectivamente o prontuário.', 'Separe o relato da pessoa, o que está documentado e o que ainda precisa ser verificado.'];
    if (item.healthConcern) steps.unshift('Priorize avaliação assistencial por profissional habilitado; se houver risco imediato, busque atendimento de urgência. Este roteiro não avalia sintomas nem orienta tratamento.');
    if (formal) steps.push('Leve o documento integral ao advogado e confirme recebimento, prazo, órgão competente e providências antes de responder. O sistema não calcula prazo processual.');
    else steps.push('Prepare uma conversa de acolhimento e avaliação com a Tami, registre o acompanhamento e peça revisão jurídica antes de resposta formal ou proposta de acordo.');
    if (item.kind === 'advertising') steps.push('Separe a versão da publicação e as autorizações para revisão das regras de publicidade; não divulgue o caso identificável.');
    if (item.kind === 'council') steps.push('Confira habilitação, responsabilidade técnica e limites do procedimento com o CRBM-6 e o advogado; esta tela não autoriza a atuação.');
    return { priority:item.healthConcern ? 'Prioridade assistencial' : formal ? 'Revisão jurídica prioritária' : 'Organizar acompanhamento', steps, missing, questions:['Quais fatos e documentos ainda precisam ser confirmados?', 'Há comunicação formal ou prazo que o advogado deva conferir?', 'Quem ficará responsável pelo próximo contato e pela revisão?'], sources: item.kind === 'council' ? ['inspection','court','councilNote'] : item.kind === 'advertising' ? ['ethics'] : ['ethics','hygiene'] };
  }
  window.EsteticaJudicialEngine = { createGuide, regional, caseKinds, caseStatuses, caseDocuments, validateCase, casePlan };
})();
