# Cérebro do projeto — Tami / Estética Pro IA

Última atualização: **02/11/2026** — referência de datas e horários do usuário: **America/Sao_Paulo**.

## 1. Finalidade deste arquivo

Este é o documento de memória do sistema: reúne objetivos, decisões, funcionamento, regras de negócio, estrutura técnica e pendências. Deve ser consultado antes de desenvolver e atualizado na mesma entrega de cada mudança. A regra permanente de manutenção está em [AGENTS.md](AGENTS.md).

O documento descreve a implementação atual e identifica planos futuros. Não representa uma integração ativa, certificação de segurança ou garantia de precisão contábil. Quando houver divergência, conferir o código e a orientação mais recente do usuário antes de atualizar esta memória.

## 2. Objetivo e pessoas

- Sistema de apoio à gestão da clínica de estética avançada da **Tami, biomédica esteta**.
- O usuário acompanha o desenvolvimento e pede explicações simples sobre decisões, custos e limitações. Deve receber orientações honestas e claras, sem pressupor conhecimento técnico.
- Nome pessoal adotado: **Tami**, substituindo “Tami Linda”. A aplicação também usa a marca de produto **Estética Pro IA**, exibida com capitalização legível.
- Objetivo futuro: reunir agentes especializados por área, com revisão humana, integrações úteis e controle de custos.
- Prioridade atual: construir e revisar o esqueleto funcional sem contratar serviços nem gerar cobranças de APIs.
- Não oferecer upgrade do ChatGPT como solução para os pedidos do projeto.

## 3. Estado atual e limites

- Aplicação web de demonstração, feita com HTML, CSS e JavaScript, sem framework e sem dependências de runtime no `package.json`.
- Executa no navegador; um servidor Node.js simples serve os arquivos localmente.
- Sem autenticação, login/senha, sessão de usuário, permissões, backend de negócio ou banco de dados de produção.
- Perfil e avatar da Tami são elementos demonstrativos. Não existe um fluxo real de logout.
- Registros ficam no navegador usado, sem sincronização entre computadores, celulares ou perfis de navegador.
- Agentes atuais usam cálculos, roteiros e regras locais. Não há IA generativa, WhatsApp, Canva, Google Agenda, coworking, banco ou contabilidade conectados.
- Não há envio automático de mensagens ou publicação de posts.
- Os dados iniciais de clientes são fictícios, com nomes genéricos como Maria, João, Ana, Camila e Pedro.
- O ambiente público deve usar somente dados fictícios. Avisos orientam essa prática, mas a aplicação não consegue detectar com segurança se um visitante digitou dados reais.
- Qualquer pessoa que use o mesmo perfil de navegador pode acessar os registros ali salvos.
- Os arquivos públicos do frontend não devem conter segredos nem informações reais de pacientes.

## 4. Navegação e identidade visual

Ordem atual das abas principais:

1. Visão geral.
2. Secretária virtual.
3. Clientes e Relacionamento.
4. Marketing.
5. Agenda.
6. WhatsApp.
7. Financeiro.
8. Agente Jurídico.
9. Identidade Visual — penúltima.
10. Aprovações — última.

**Configurações** abre pela engrenagem no canto superior direito, junto às ações do perfil. Não precisa ocupar uma aba do menu principal.

Decisões visuais:

- Usar tema escuro com boa hierarquia de texto, cores com função e aparência profissional.
- Evitar excesso de dourado, cores de arco-íris e caixas muito saturadas de verde/vermelho.
- Preservar leitura com fontes maiores e proporcionais, inclusive nos textos auxiliares.
- Diferenciar rankings com cores discretas nos títulos, valores e indicadores. Pendências mais importantes recebem sinais mais fortes, acompanhados de texto.
- Logotipo oficial: monograma dourado entrelaçado **T e C**, disponível em `assets/monograma-tc.png`. Usado na marca, favicon e identidade das novas artes. Ajustar com proporção preservada.
- A identidade configurável inclui paleta, fontes de título/corpo e logo. Alterar a identidade não deve reescrever automaticamente artes antigas.
- O botão “Conheça o painel” abre um guia com atalhos para as áreas.

## 5. Funcionamento de cada área

### Visão geral

- Data e ano exibidos são atualizados pelo JavaScript.
- A agenda de hoje vem dos compromissos ativos salvos, ordenados por horário.
- Recebimentos do mês vêm de receitas não canceladas e não marcadas como exemplos `demo`.
- Novos cadastros consideram os últimos sete dias e excluem os clientes de exemplo `demo`.
- Contagem e prévia das aprovações vêm da fila pendente.
- Foram removidos indicadores fixos que inventavam crescimento, faturamento e disponibilidade.
- A prévia de Marketing ainda contém conteúdo de apresentação; não interpretar toda a página inicial como um relatório completo de gestão.

### Secretária virtual

- Consulta registros locais de agenda, financeiro, aprovações e Marketing por regras em `secretaria-engine.js`.
- Apresenta perguntas úteis que podem ser clicadas, sem digitação.
- Clicar em sugestões mantém os atalhos disponíveis; escrever uma pergunta própria pode ocultá-los durante aquela sessão.
- Mensagens e respostas aparecem na conversa da sessão; `chat` não é persistido no armazenamento local nem nos backups exportados.
- Existe botão de voz planejado e desativado. A integração futura deve ter custo avaliado antes de ativar.
- Não realiza avaliação clínica, prescrição ou recomendação individual de procedimento/dose.

### Clientes e Relacionamento

- Nome de interface adotado para substituir “CRM de Clientes”, evitando confusão com conselho de medicina. A rota interna continua `crm`.
- Cadastro administrativo com nome/identificador, contato opcional, primeiro atendimento, retorno manual e observações.
- Histórico de atendimentos, procedimentos, duração, recebimentos e vínculo opcional com a agenda.
- Rankings: valor cobrado, valor recebido, tempo de relacionamento, quantidade de atendimentos, frequência e ocorrências/pendências.
- Retorno informado manualmente tem prioridade. Sem data manual, o motor pode estimar pela média dos intervalos positivos entre atendimentos; isso é uma previsão administrativa revisável.
- “Ativo” considera atendimento registrado nos últimos 12 meses.
- Ocorrências devem relatar fatos, providências, situação e responsável. O ranking destaca necessidade de acompanhamento, sem rotular ou ofender clientes.
- Dados sintéticos aparecem identificados como exemplos. O CRM inclui esses exemplos em demonstrações; Financeiro e alguns indicadores do início os excluem, conforme seus filtros.

### Marketing

- Planejamento local por assunto, público, objetivo, estágio do público, formato e cadência.
- Recomenda estruturas de estratégia e permite editar textos, títulos, slides, legendas e hashtags.
- Editor local de post, carrossel, capa de Reels e Stories; permite duplicar, reordenar e excluir slides, inserir imagem e exportar PNG.
- Novas artes recebem a identidade visual vigente no momento da criação.
- Modelos e sugestões são demonstrativos, sem IA externa. Não prometer resultados clínicos nem inventar preços/ofertas.
- Condição comercial só deve ser usada quando informada e autorizada.
- Conteúdo pode seguir para a fila de revisão; enviar para aprovação não publica a peça.
- Canva e publicação em redes sociais são planos futuros.

### Agenda

- Visão por dia e semana, com navegação de datas, criação, edição e cancelamento de compromissos.
- A seção Google Agenda é uma prévia local, claramente marcada como não conectada.
- Duração é informada em minutos; padrão inicial de uma hora (60 minutos).
- Há validação de sobreposição por intervalo, excluindo o próprio registro na edição e compromissos cancelados. Horários adjacentes são aceitos.
- O vínculo de atendimento com compromisso também verifica conflito antes de alterar a agenda.
- A checagem atual considera uma agenda única; não existe disponibilidade real de salas/profissionais externos nem sincronização concorrente com coworking/Google.

### WhatsApp

- Estrutura para preparar respostas administrativas e guardar rascunhos para revisão da Tami.
- Aprovação humana é obrigatória no planejamento de uma futura integração.
- “Marcar revisado” altera somente o rascunho local; não envia mensagem.
- Limites de orçamento informados são anotações de planejamento, sem poder de bloquear cobranças reais.
- Conexão à API, respostas automáticas e qualquer contratação dependem de uma implementação futura com custos e limites reais explicados ao usuário.

### Financeiro e Configurações

- Fluxo desejado: informar procedimento, duração do atendimento e quanto o cliente pagou; usar os custos previamente cadastrados para calcular o resultado.
- Configurações gerais: nome do espaço, duração padrão, valor da sala por hora, regra de cobrança da sala, regime tributário informativo e materiais/custos por procedimento.
- Procedimentos iniciais: Botox, Preenchimento, Luz pulsada e Outro. Mais procedimentos poderão ser adicionados depois.
- Tarifa inicial da sala: **R$ 120 por hora**, provisória e a confirmar. Duração padrão: **1 hora**.
- Cobrança da sala pode ser proporcional aos minutos ou arredondada para cada hora iniciada; a escolha fica em Configurações.
- No modo proporcional: `custo da sala = tarifa por hora × duração em minutos ÷ 60`.
- No modo hora iniciada: `custo da sala = tarifa por hora × teto(duração em minutos ÷ 60)`.
- Resultado por atendimento: `recebido − custo da sala − materiais`. O resumo também considera outras despesas registradas.
- Custos ausentes não equivalem a zero: o resultado fica incompleto até a informação ser preenchida. Zero só deve significar custo realmente inexistente.
- Guardar custo/tarifa/regra aplicados ao atendimento em campos de snapshot; mudar Configurações não deve reprecificar automaticamente o passado.
- Permitir editar custos manualmente no Financeiro, somente naquele atendimento. Também existe edição do atendimento e dos recebimentos.
- O fluxo simplificado registra o efetivamente recebido; não inventar um valor contratado ou saldo devedor quando esse valor não foi informado. `chargedTotal` é um campo herdado usado na implementação: conferir sua semântica antes de expandir cobranças/parcelas.
- Recebimentos e despesas exigem valor positivo e data válida. Taxas não podem superar o valor bruto informado.
- Data e hora começam preenchidas em novos lançamentos; a hora deve aparecer abaixo da data nas tabelas.
- O sistema usa números JavaScript e arredondamentos em partes do cálculo. Não possui motor contábil, conciliação bancária nem garantia formal de cálculo fiscal.
- Regime da Tami ainda não foi confirmado. Não presumir MEI ou Simples Nacional. A seleção atual é informativa; não calcula alíquota nem imposto devido. Tributos efetivamente pagos podem ser registrados como despesas.

### Cancelamentos e custos

- Manter o histórico com status cancelado e motivo registrado, em vez de apagar silenciosamente.
- Perguntar manualmente, com opções **Sim/Não**, sobre material e sala no cancelamento.
- Não aplicar automaticamente uma regra de cancelamento de 24 horas: o usuário pediu decisão manual sobre os custos efetivamente perdidos.
- A interface atual pergunta se material/sala foram utilizados. Conferir essa redação ao evoluir o fluxo: uso, prejuízo e recuperação do horário por outro cliente não são necessariamente a mesma coisa.
- O cancelamento da agenda pode criar despesas de material/sala conforme as respostas e os custos cadastrados.
- Cancelar um recebimento vinculado ao atendimento registra motivo e pode ajustar custos do atendimento conforme as respostas. Os dois caminhos precisam continuar coerentes, sem duplicar custos.

### Agente Jurídico

- Roteiros locais para organizar documentos, dúvidas regulatórias e próximos passos.
- Aponta fontes e necessidade de revisão por profissional habilitado.
- Não emite parecer jurídico nem controla prazos processuais automaticamente.

### Aprovações

- Fila local de conteúdo e mensagens, com estados pendente, aprovado e rejeitado.
- Peças que exigem revisão profissional só habilitam aprovação após as confirmações da revisão.
- Aprovação/rejeição não envia nem publica conteúdo externo.

## 6. Agentes especializados planejados

O manifesto está em `agents.js`. Os perfis são descrições de estrutura futura, sem ativar serviços.

| Área | Especialização prevista | Integrações previstas |
| --- | --- | --- |
| Secretária | Rotina de clínica estética e consulta das áreas pertinentes | Agenda, coworking, mensagens e voz opcional |
| Relacionamento | Estratégias de acompanhamento e retorno | Clientes, agenda, Marketing e secretária |
| Marketing | Marketing de estética avançada e criação de conteúdo | Canva, identidade e redes sociais |
| Agenda | Organização de horários e confirmações | Google Agenda, coworking e secretária |
| WhatsApp | Respostas administrativas revisadas pela Tami | WhatsApp Business Platform e aprovações |
| Financeiro | Organização financeira e apoio à contabilidade | Exportações e eventual sistema contábil |
| Jurídico | Organização jurídica e regulatória | Fontes oficiais e revisão profissional |
| Identidade | Consistência de marca | Biblioteca visual e Canva |
| Aprovações | Revisão e encaminhamento de tarefas | Demais áreas do sistema |

Antes de integrar: definir escopo mínimo de dados, permissões, aprovação, custos efetivos, limites de uso e mecanismo real de interrupção. Nenhuma integração deve ser apresentada como ativa enquanto for apenas planejada.

## 7. Dados, armazenamento e segurança

- Chave principal: `estetica-pro-ia-demo-v1` em `localStorage`.
- Chaves auxiliares: sufixo `-backup` para uma cópia anterior e `-recovery` para preservar conteúdo com problema de leitura.
- Principais coleções: `clients`, `clientVisits`, `appointments`, `transactions`, `occurrences`, `drafts`, `strategyPlans`, `approvals` e `whatsappDrafts`.
- Configurações: `settings`, `identity` e `whatsappSettings`. `chat` é esvaziado ao persistir.
- Vínculos principais: atendimento aponta para cliente e pode apontar para compromisso; recebimentos apontam para atendimento e cliente; ocorrências podem apontar para cliente.
- Após salvar, a aplicação lê o conteúdo para confirmar a gravação. Se falhar, sinaliza alterações não salvas e solicita confirmação antes de fechar a página.
- Configurações permite exportar JSON, restaurar um arquivo com confirmação e solicitar armazenamento persistente ao navegador. O navegador pode negar essa proteção.
- Em problemas de leitura, tenta recuperar a cópia anterior e oferece download do conteúdo preservado para recuperação técnica quando disponível.
- Backups locais compartilham os riscos do mesmo navegador: limpar os dados do site pode remover todas as cópias. O JSON exportado não é criptografado.
- A validação de importação é básica; dados malformados e recuperação completa de todas as relações ainda merecem testes mais abrangentes.
- Não existe controle de concorrência entre abas, trilha completa de auditoria ou proteção de banco de dados de produção.
- A busca anterior por padrões comuns de segredos nos arquivos/histórico Git disponível não encontrou candidatos. Não foi uma auditoria de segurança exaustiva.
- Requisitos antes de produção estão em [SEGURANCA-E-PRODUCAO.md](SEGURANCA-E-PRODUCAO.md).

## 8. Estrutura técnica

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura principal, menu, início, carregamento de estilos/scripts |
| `app.js` | Estado, persistência, navegação, renderização, formulários e operações integradas |
| `crm-engine.js` | Indicadores, pagamentos, rankings e previsão de retorno |
| `marketing-engine.js` | Estratégias e estruturas de conteúdo locais |
| `secretaria-engine.js` | Respostas administrativas locais por intenção/contexto |
| `judicial-engine.js` | Guias jurídicos e regulatórios demonstrativos |
| `agents.js` | Perfis e integrações planejadas dos agentes |
| `styles.css`, `modules.css` | Estilos de base e módulos |
| `crm.css`, `agenda.css`, `identity.css`, `strategy.css`, `judicial.css` | Estilos das áreas |
| `dark-theme.css`, `readability.css`, `professional-theme.css` | Tema escuro, leitura e ajustes visuais; ordem de carregamento importa |
| `assets/` | Recursos visuais, incluindo o monograma oficial |
| `server.js` | Servidor estático Node.js, padrão `127.0.0.1:3000`; aceita variável `PORT` |
| `test/` | Testes com `node:test`, incluindo execução do frontend em ambiente simulado |
| `AGENTS.md` | Instruções permanentes para agentes que trabalham neste repositório |

As rotas usam fragmentos da URL, como `#crm`, `#agenda` e `#configuracoes`. Há navegação de voltar/avançar.

Comandos locais:

```sh
npm start
npm test
```

O servidor estático é para desenvolvimento local; não é uma infraestrutura protegida de produção.

## 9. Verificação e pendências conhecidas

Última execução automatizada registrada antes da criação deste documento: **25 testes passaram, 0 falharam**.

Cobertura existente inclui motores de CRM/Marketing/secretária, navegação de todas as áreas, identidade visual, exportação em ambiente simulado, estratégias e aprovações, cadastro/atendimento/recebimentos, edição sem duplicidade, persistência, recuperação e rejeição de sobreposição na agenda.

Limites e próximos trabalhos:

- Os testes de interface usam elementos simulados; não equivalem a uma inspeção de todos os botões em navegador real.
- A revisão visual em celular e tablet e a avaliação completa de acessibilidade permanecem pendentes. A tentativa anterior de usar o navegador foi interrompida porque a ferramenta não conseguiu confirmar a URL da janela com segurança.
- Revisar foco, teclado, modais, leitura por tecnologia assistiva, contraste, ampliação e tabelas em telas estreitas.
- Ampliar testes de cancelamentos cruzados entre agenda/financeiro, edição de snapshots, importação/restauração e concorrência de abas.
- Conferir consistência entre indicadores que incluem exemplos e indicadores que os excluem, tornando os critérios claros ao usuário.
- Rever modelo de cobrança/recebimento antes de adicionar contas a receber, parcelamento ou cálculo de taxas automático.
- Avaliar valores monetários em centavos inteiros ou biblioteca decimal antes de depender do sistema para apuração oficial.
- Corrigir e validar os fluxos necessários antes de receber dados reais ou ativar integrações pagas.

A criação desta memória foi uma tarefa documental e não repetiu a suíte de testes. O resultado de 25 testes aprovados corresponde à verificação das alterações funcionais descritas acima.

## 10. GitHub, publicação e backups

- Repositório conhecido: `https://github.com/guillermobrasil/pagina-teste-tami`.
- Branch usada: `main`.
- Backup de código criado e confirmado no GitHub: tag `backup-2026-11-02`, apontando para o commit `f32628c7c4f89580ac86dfa81729d84dabb6967d`.
- A tag é um ponto de restauração do código daquela versão. Não inclui registros guardados no navegador nem as mudanças locais posteriores ainda não commitadas.
- Na criação desta memória, já havia mudanças locais em `app.js`, `index.html` e `test/identity.test.js`, além do documento de segurança ainda não versionado.
- Atualizar código ou memória localmente não publica automaticamente. Fazer commit/push quando o usuário pedir e informar o resultado real.
- Não confundir backup de código no GitHub com backup JSON dos registros do navegador.

## 11. Como manter esta memória

Em cada tarefa de desenvolvimento:

1. Ler este documento e conferir os arquivos envolvidos.
2. Implementar a mudança solicitada respeitando as decisões vigentes.
3. Atualizar as seções afetadas e a data desta memória; retirar informações que deixaram de valer.
4. Registrar verificações realmente feitas, limitações e pendências relevantes.
5. Acrescentar uma entrada breve no histórico, sem copiar dados privados nem toda a conversa.

Se a alteração for apenas documental, informar isso; não inventar execução de testes. Não registrar como concluída uma integração ou revisão apenas planejada.

## 12. Histórico resumido

- **Até 02/11/2026:** construção das áreas do sistema; adoção do nome Tami e do monograma oficial; tema escuro e revisão de fontes/cores; Clientes e Relacionamento com rankings e ocorrências; editor e estratégias locais de Marketing; agenda visual; estrutura futura de agentes/WhatsApp/voz; configurações e custos de atendimentos; edição financeira; cancelamentos com motivo e perguntas manuais sobre custos; ajuste da ordem das abas e guia do painel.
- **02/11/2026:** criação da tag de backup de código `backup-2026-11-02` no GitHub.
- **02/11/2026 — mudanças locais posteriores ao backup:** avisos de demonstração e limites de produção; exportação/restauração e recuperação local; verificação de gravação; indicadores do início ligados aos registros; validação de datas, valores e conflitos de agenda; atualização/ampliação da suíte para 25 testes aprovados. Revisão visual completa continua pendente.
- **02/11/2026 — esta entrega:** criação de `cérebro.md` e `AGENTS.md` para preservar o contexto do projeto e exigir atualização da memória em futuras entregas de desenvolvimento. Nenhum envio ao GitHub realizado nesta tarefa.
- **02/11/2026 — envio solicitado pelo usuário:** preparação de um commit na `main` reunindo as correções funcionais, os testes e os documentos de segurança e memória que estavam locais. O resultado do envio deve ser confirmado no Git remoto; esta entrada registra a autorização e o conteúdo da entrega.
