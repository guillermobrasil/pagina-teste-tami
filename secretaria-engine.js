/* Respostas determinísticas locais para a Secretária Virtual. Sem rede ou IA generativa. */
(function attachSecretaryEngine(root) {
  const normalize = (value = '') => String(value).toLocaleLowerCase('pt-BR')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  const has = (text, pattern) => pattern.test(text);
  const patterns = {
    privacy: /\b(paciente|clientes?|cadastro de pessoas|dados pessoais|nome de quem|quem esta marcado)\b/,
    marketing: /\b(marketing|post|publicacao|legenda|reels?|stories|campanha|carrossel|conteudo|rascunho|instagram)\b/,
    price: /\b(preco|precos|quanto custa|quanto e|valor do botox|valor do procedimento|tabela de preco|tabela de valores|orcamento)\b/,
    finance: /\b(financeiro|saldo|faturamento|receita|receitas|despesa|despesas|lancamento|lancamentos|quanto entrou|quanto gastei|gastos)\b/,
    approvals: /\b(aprovacao|aprovacoes|aprovar|rejeitar|pendencias|pendente|publicar|publicacao pendente)\b/,
    agenda: /\b(agenda|compromissos?|horarios?|agendamentos?|marcados?|marcacao|atendimentos?)\b/,
    clinical: /\b(procedimentos?|botox|toxina|preenchimento|bioestimuladores?|harmonizacao|contraindicacoes?|dosagem|dose|aplicacao|pos procedimento|resultado clinico|efeitos)\b/,
    general: /\b(oi|ola|tudo bem|ajuda|ajudar|duvida|duvidas|como funciona|o que voce faz|bom dia|boa tarde|boa noite|obrigad[oa])\b/
  };
  const isFollowUp = (text) => {
    const words = text.split(' ').filter(Boolean);
    return words.length <= 5 && /^(e |e$|isso|esse|essa|aquele|aquela|qual deles|qual delas|me diga mais|e amanha|e hoje|e depois)/.test(text);
  };
  function previousUserMessage(chat = []) {
    for (let index = chat.length - 1; index >= 0; index -= 1) {
      if (chat[index]?.from === 'you') return normalize(chat[index].text);
    }
    return '';
  }
  function inferIntent(text, chat = []) {
    const message = normalize(text);
    const previous = previousUserMessage(chat);
    const combined = isFollowUp(message) && previous ? `${message} ${previous}` : message;
    if (has(combined, patterns.privacy)) return { name: 'privacidade', query: combined, current: message };
    if (has(combined, patterns.marketing)) return { name: 'marketing', query: combined, current: message };
    if (has(combined, patterns.price) && !has(combined, patterns.finance)) return { name: 'precos', query: combined, current: message };
    if (has(combined, patterns.finance)) return { name: 'financeiro', query: combined, current: message };
    if (has(combined, patterns.approvals)) return { name: 'aprovacoes', query: combined, current: message };
    if (has(combined, patterns.agenda)) return { name: 'agenda', query: combined, current: message };
    if (has(combined, patterns.clinical)) return { name: 'procedimentos', query: combined, current: message };
    if (has(combined, patterns.general)) return { name: 'geral', query: combined, current: message };
    return { name: 'desconhecida', query: combined, current: message };
  }
  const localISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const formatDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR') : 'data não informada';
  const formatMoney = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  function agendaReply(query, appointments = [], now = new Date()) {
    const today = localISO(now);
    const tomorrowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrow = localISO(tomorrowDate);
    let selected = appointments.filter((item) => item.status !== 'Cancelado');
    let period = 'próximos compromissos';
    if (/\bhoje\b/.test(query)) { selected = selected.filter((item) => item.date === today); period = 'hoje'; }
    else if (/\bamanha\b/.test(query)) { selected = selected.filter((item) => item.date === tomorrow); period = 'amanhã'; }
    else if (/\bsemana\b/.test(query)) {
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
      selected = selected.filter((item) => item.date >= today && item.date < localISO(end)); period = 'nos próximos 7 dias';
    } else selected = selected.filter((item) => !item.date || item.date >= today);
    selected.sort((a, b) => `${a.date || ''} ${a.time || ''}`.localeCompare(`${b.date || ''} ${b.time || ''}`));
    if (!selected.length) return `Não encontrei compromissos fictícios ${period} na agenda salva. Se esperava um horário específico, confira a data ou cadastre-o na área Agenda.`;
    const rows = selected.slice(0, 5).map((item) => `• ${formatDate(item.date)} às ${item.time || 'horário não informado'} — ${item.title} (${item.status || 'status não informado'})`).join('\n');
    const more = selected.length > 5 ? `\nHá mais ${selected.length - 5} compromisso(s); consulte a área Agenda para ver todos.` : '';
    return `Consultei a agenda demonstrativa salva e encontrei ${selected.length} compromisso(s) ${period}:\n${rows}${more}\nOs registros são fictícios e não incluem cadastro de clientes.`;
  }
  function financeReply(query, transactions = []) {
    const income = transactions.filter((item) => item.type === 'receita').reduce((sum, item) => sum + Number(item.value || 0), 0);
    const expenses = transactions.filter((item) => item.type === 'despesa').reduce((sum, item) => sum + Number(item.value || 0), 0);
    const listExpenses = /\b(despesa|despesas|gastei|gastos)\b/.test(query);
    const listIncome = /\b(receita|receitas|quanto entrou)\b/.test(query);
    let detail = '';
    if (listExpenses || listIncome) {
      const kind = listExpenses ? 'despesa' : 'receita';
      const matching = transactions.filter((item) => item.type === kind).slice(0, 5);
      detail = matching.length
        ? `\n${listExpenses ? 'Despesas' : 'Receitas'} registradas: ${matching.map((item) => `${item.description} (${formatDate(item.date)}): ${formatMoney(item.value)}`).join('; ')}.`
        : `\nNão há ${listExpenses ? 'despesas' : 'receitas'} cadastradas neste protótipo.`;
    }
    return `Consultei os lançamentos demonstrativos salvos (todos os períodos): receitas ${formatMoney(income)}, despesas ${formatMoney(expenses)} e saldo ${formatMoney(income - expenses)}.${detail}\nEsses números vêm apenas dos lançamentos locais fictícios; não são dados bancários nem contabilidade oficial.`;
  }
  function reply(text, context = {}, now = new Date()) {
    const chat = context.chat || [];
    const intent = inferIntent(text, chat);
    if (intent.name === 'privacidade') return 'Este protótipo não mantém cadastro de pacientes ou clientes. A agenda contém somente descrições fictícias de compromissos; não posso identificar quem estaria associado a um horário. Evite inserir dados pessoais.';
    if (intent.name === 'agenda') return agendaReply(intent.current, context.appointments || [], now);
    if (intent.name === 'financeiro') return financeReply(intent.query, context.transactions || []);
    if (intent.name === 'aprovacoes') {
      const pending = (context.approvals || []).filter((item) => item.status === 'Pendente');
      if (!pending.length) return 'Consultei a Central local: não há itens pendentes de aprovação agora. Aprovar ou rejeitar por lá só muda o status; nada é enviado ou publicado.';
      const countLabel = pending.length === 1 ? '1 item pendente' : `${pending.length} itens pendentes`;
      return `A Central local tem ${countLabel}: ${pending.slice(0, 5).map((item) => `“${item.title}” (${item.type})`).join(', ')}. Você pode revisar cada um em Aprovações; nenhuma publicação sai do sistema.`;
    }
    if (intent.name === 'marketing') {
      const drafts = context.drafts || [];
      const list = drafts.length ? ` Seus rascunhos salvos incluem: ${drafts.slice(0, 4).map((item) => `“${item.title}”`).join(', ')}.` : ' Ainda não há rascunhos salvos.';
      return `Na área Marketing você pode criar posts, carrosséis, capas e Stories, editar a arte e salvar rascunhos localmente.${list} As sugestões do estrategista são modelos demonstrativos, sem IA conectada. Que formato ou assunto você quer preparar?`;
    }
    if (intent.name === 'precos') return 'Não há uma tabela de preços ou catálogo de serviços cadastrado neste protótipo, então não consigo informar um valor sem inventar. Se quiser preparar uma divulgação, informe a condição comercial exata e autorizada pela profissional; a peça ainda precisará de revisão.';
    if (intent.name === 'procedimentos') return 'Posso ajudar a organizar uma pauta educativa geral, mas esta secretária não avalia casos nem recomenda procedimentos, doses, contraindicações ou resultados clínicos. Revise qualquer conteúdo técnico e confirme sua adequação profissional antes de usar. Você quer montar uma pauta de Marketing ou precisa de ajuda administrativa?';
    if (intent.name === 'geral') return 'Posso consultar os compromissos e lançamentos demonstrativos salvos, mostrar pendências locais ou orientar sobre Marketing. A conversa não envia mensagens nem altera nada fora deste navegador. Qual dessas áreas você quer ver?';
    return 'Não consegui identificar o assunto com segurança. Posso consultar agenda, lançamentos financeiros e aprovações salvas, ou orientar sobre Marketing, preços cadastrados (não há tabela nesta versão) e pautas educativas. Pode reformular sua pergunta?';
  }
  root.SecretariaLocal = Object.freeze({ inferIntent, reply });
})(window);
