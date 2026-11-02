(() => {
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
    return { ...guide, context: cleanContext };
  }

  window.EsteticaJudicialEngine = { createGuide };
})();
