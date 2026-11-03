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

- Aplicação HTML/CSS/JavaScript sem framework, com demonstração local e modo de conta privada opcional. SDK Supabase 2.118.0 empacotado por esbuild; dependências fixadas no lockfile.
- Executa no navegador; um servidor Node.js simples serve os arquivos localmente.
- A demonstração continua sem login. A conta privada implementa cadastro/login por e-mail e senha via Supabase, banco com RLS por proprietário e gravação com versão esperada. Projeto gratuito criado com autorização em São Paulo; esquema aplicado. Publicação/configuração online e teste real de confirmação por e-mail continuam pendentes; não declarar pronto para dados reais.
- Perfil/avatar do painel continuam demonstrativos. Minha conta permite sair da sessão privada e voltar aos registros locais da demonstração.
- Registros da demonstração ficam no navegador. Na conta privada, os registros são carregados do banco e ficam em memória; sessão do SDK usa sessionStorage. Recarregar volta à demonstração, com opção Retomar sessão. Não há envio automático dos registros locais para a conta.
- Agentes atuais usam cálculos, roteiros e regras locais. Não há IA generativa, WhatsApp, Canva, Google Agenda, coworking ou contabilidade conectados. O banco da conta privada é independente dessas integrações.
- Não há envio automático de mensagens ou publicação de posts.
- Os dados iniciais de clientes são fictícios, com nomes genéricos como Maria, João, Ana, Camila e Pedro.
- O ambiente público deve usar somente dados fictícios. Avisos orientam essa prática, mas a aplicação não consegue detectar com segurança se um visitante digitou dados reais.
- Qualquer pessoa que use o mesmo perfil de navegador pode acessar os registros ali salvos.
- Os arquivos públicos do frontend não devem conter segredos nem informações reais de pacientes.

## 4. Navegação e identidade visual

Ordem atual das abas principais:

1. Visão geral.
2. Secretário virtual.
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

- Na Visão geral, o monograma TC aparece à esquerda de “Bom dia, Tami”, com proporção preservada e tamanho responsivo (72px desktop/tablet, 52px celular e 44px em telas até 360px). A imagem é decorativa; texto da saudação permanece acessível. Demais títulos não recebem essa imagem.

- Tema escuro com base azul profunda, superfícies azuladas, textos marfim e dourado discreto em detalhes, aplicado em `tami-theme.css`. Manter cores semânticas de status/rankings, leitura de tabelas e fontes maiores. Paleta base da marca: azul #172B43, marfim #F3EEE4, areia #D9CDB9, texto #393B3E e destaque #B6975A. Identidades já salvas não são substituídas.
- Evitar excesso de dourado, cores de arco-íris e caixas muito saturadas de verde/vermelho.
- Preservar leitura com fontes maiores e proporcionais, inclusive nos textos auxiliares.
- Diferenciar rankings com cores discretas nos títulos, valores e indicadores. Pendências mais importantes recebem sinais mais fortes, acompanhados de texto.
- Logotipo oficial: monograma dourado entrelaçado **T e C**, disponível em `assets/monograma-tc.png`. Usado na marca, favicon e identidade das novas artes. Ajustar com proporção preservada.
- A identidade configurável inclui paleta, fontes de título/corpo e logo. Alterar a identidade não deve reescrever automaticamente artes antigas.
- O botão “Conheça o painel” abre um guia com atalhos para as áreas.

- Fora da Visão geral, as caixas de conteúdo com título começam recolhidas. Clicar no título/faixa do cabeçalho expande; clicar novamente recolhe. Cada caixa é independente, com seta, botão acessível, `aria-expanded` e suporte a Enter/Espaço. O estado visual é mantido somente em memória durante a navegação da página, sem mudar registros ou backups; atualizar a página reinicia fechado.
- Cada cabeçalho retrátil recebe um ícone vetorial local ligado ao assunto (pessoas, retorno, agenda, carteira, recibo, paleta, documentos, backup etc.). Os seis rankings têm símbolos próprios; ícones antigos são reutilizados/substituídos para evitar duplicação. Ilustrações são decorativas para acessibilidade: texto, teclado e expansão continuam iguais, sem carregamento externo de imagens.
- Clientes, Retornos, cada ranking, caixas de Marketing/editor, Agenda, WhatsApp, Jurídico, Identidade Visual, Aprovações e Configurações seguem esse comportamento. Indicadores de clientes/agenda ficam agrupados em caixas; no Financeiro, resumo, resultado por atendimento e lançamentos são caixas separadas. Formulários de Configurações mantêm seus campos no mesmo form, agrupados visualmente.
- Botões de ação, seletores e links do cabeçalho continuam independentes da expansão. A validação do navegador abre as caixas que contêm um campo inválido. Avisos gerais, navegação e modais de edição permanecem acessíveis; a Visão geral não recebe caixas recolhíveis.
- Caixas retráteis têm brilho e borda no hover de mouse, realce de foco por teclado e uma **seta vetorial dentro de um círculo**, sem o texto visual Abrir/Fechar. A seta aponta para baixo quando recolhida e para cima quando aberta. Título do botão e `aria-expanded/controls` informam a ação/estado a tecnologias assistivas; o ícone é decorativo. Em toque, cabeçalho mínimo de 52px e contorno visível; Enter/Espaço continuam funcionando. Alto contraste e movimento reduzido recebem tratamento sem piscadas ou pulsação automática.
- Celular/tablet: botões principais de interface com alvos de 44px, campos de formulário em 16px para leitura/toque, cabeçalhos flexíveis, menu lateral recolhível até 1024px e Jurídico em uma coluna nessa faixa. Corrigidos transbordamentos de Clientes/retornos, breadcrumb e pares de campos no editor de Marketing. Tabelas mantêm rolagem horizontal e recebem região focável para teclado.
- Acessibilidade adicional: atalho “Pular para o conteúdo” sem trocar rota; foco visível; menu fechado sai da navegação assistiva e responde a Esc; diálogos abertos pelo sistema mantêm Tab/Shift+Tab dentro, fecham por Esc e devolvem foco ao acionador enquanto ele existir. Não equivale a auditoria WCAG nem teste com leitor de tela real.
- **Padrão para próximas alterações:** considerar celular, tablet, teclado, alvos de toque, leitura e preferências de movimento desde a implementação; executar verificações proporcionais à mudança e registrar seus limites. Não afirmar que tudo foi testado quando houve apenas revisão de código ou automação.


## 5. Funcionamento de cada área

### Visão geral

- Data e ano exibidos são atualizados pelo JavaScript.
- A agenda de hoje vem dos compromissos ativos salvos, ordenados por horário.
- Recebimentos do mês vêm de receitas não canceladas e não marcadas como exemplos `demo`.
- Novos cadastros consideram os últimos sete dias e excluem os clientes de exemplo `demo`.
- Contagem e prévia das aprovações vêm da fila pendente.
- Foram removidos indicadores fixos que inventavam crescimento, faturamento e disponibilidade.
- Pendências da rotina reúne retornos vencidos/para hoje (informados ou estimados), pagamentos pendentes ou não informados, custos ausentes e aprovações. Filtros por categoria e atalhos para ficha/edição/revisão. Clientes/atendimentos fictícios são excluídos dessas pendências; aprovações de demonstração continuam como exemplos.
- A prévia de Marketing ainda contém conteúdo de apresentação; não interpretar toda a página inicial como um relatório completo de gestão.

### Secretário virtual

- Consulta registros locais de agenda, financeiro, aprovações e Marketing por regras em `secretaria-engine.js`.
- Apresenta perguntas úteis que podem ser clicadas, sem digitação.
- Clicar em sugestões mantém os atalhos disponíveis; escrever uma pergunta própria pode ocultá-los durante aquela sessão.
- Mensagens e respostas aparecem na conversa da sessão; `chat` não é persistido no armazenamento local nem nos backups exportados.

- Ziggy é o mascote animado do Secretário, baseado na ilustração do cachorro enviada/aprovada pelo usuário. O atlas PNG RGBA local de 24 quadros (4 colunas × 6 linhas, 1024 × 1536), `assets/ziggy-sprites-v1.png`, permanece preservado; a apresentação atual usa o primeiro retrato estável e regiões dos olhos do quadro de piscada, combinados por máscaras SVG. Movimentos de respiração/aceno são contínuos por CSS; não há mais troca repetida do rosto inteiro nem boca por quadros. A ilustração foi produzida com image_gen; fotos originais/pessoas não foram copiadas para o projeto.
- Estados: atento/piscando, acompanhando digitação, preparando resposta, respondendo, surpreso quando o assunto não é reconhecido ou ocorre falha, e descansando após 45 segundos em espera. A preparação visual tem transição de cerca de 480ms; não representa espera por API. Não há interpretação emocional por IA nem captura de áudio.
- Clicar no Ziggy faz carinho; Conversar com o Ziggy abre a caixa recolhida da conversa e foca o campo. Animações podem ser pausadas e respeitam movimento reduzido do sistema. O personagem aparece apenas nesta aba, sem modificar a Visão geral.
- Nome visível padronizado para **Secretário virtual**, inclusive menu, título, conversa, visão geral, ajuda, voz planejada e descrições dos agentes. A rota `#secretaria`, os identificadores e o nome do arquivo do motor permanecem compatíveis com links e dados existentes.
- Boquinha feliz: usa somente um recorte fixo da boca com língua da própria ilustração (segundo quadro da quarta linha), alinhado e misturado por máscara SVG suave. Entrada/saída por opacidade e movimento local de 0,5 unidade, sem sequência de quadros ou troca do rosto/olhos. Aparece por 2,8s ao receber carinho/responder e ocasionalmente após 10s de espera; interrompida ao digitar, preparar resposta, descansar, pausar, reduzir movimento, ocultar a aba ou sair do módulo. Não representa sincronização de fala/áudio.
- Olhos acompanham o ponteiro fino com suavização por `requestAnimationFrame`, limite de 3,2 × 2,4 unidades de imagem e leve inclinação da cabeça (até 1,6 grau). Retorna ao centro ao sair da janela; pausa, toque, movimento reduzido, soneca e aba oculta desativam o acompanhamento. Loop encerra ao alcançar o alvo e é cancelado ao trocar de módulo; sem coordenadas armazenadas, câmera ou API. Estados alteram texto/ritmo e soneca fecha os olhos; não há detecção emocional.
- O envio bloqueia perguntas duplicadas enquanto prepara a resposta, recupera o formulário em falhas e não força voltar à Secretário caso o usuário troque de aba. Respostas pendentes são descartadas se o objeto de dados/sessão mudar. O chat deixa de chamar `save()` a cada pergunta: a conversa segue somente em memória, sem gravação de documentos/backups ou chamadas externas para responder.

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
- Estúdio Visual livre reunido em uma única caixa recolhível “Criar uma nova arte”: cabeçalho com monograma discreto, instrução curta, quatro formatos e aviso integrado ao rodapé. Substitui o banner “Crie do seu jeito”, o aviso separado e a caixa adicional de formatos.
- Recomenda estruturas de estratégia e permite editar textos, títulos, slides, legendas e hashtags.
- Editor local de post, carrossel, capa de Reels e Stories; permite duplicar, reordenar e excluir slides, inserir imagem e exportar PNG.
- Novas artes recebem a identidade visual vigente no momento da criação.
- Modelos e sugestões são demonstrativos, sem IA externa. Não prometer resultados clínicos nem inventar preços/ofertas.
- Condição comercial só deve ser usada quando informada e autorizada.
- Conteúdo pode seguir para a fila de revisão; enviar para aprovação não publica a peça.
- Coleção Tami implementada no editor local: post de acolhimento, carrossel educativo de quatro páginas, Story de relacionamento e capa de Reels. Cada uso cria um rascunho independente com snapshot da identidade vigente, legenda e revisão profissional requerida; não altera artes antigas.
- Editor permite guardar/remover um link HTTPS de design em canva.com, abrir externamente e enviar o link junto com o conteúdo para Aprovações. Domínios parecidos e URLs inválidas são rejeitados; links abrem com noopener/noreferrer. Não há sincronização automática de texto, arte ou status com o Canva nem publicação social.
- Nesta conversa, o plugin Canva foi usado para enviar o monograma oficial à biblioteca e iniciar gerações de post e Story após confirmação da direção visual pelo usuário. Nenhum Brand Kit foi encontrado. A ferramenta retornou jobs em andamento e a busca posterior ainda não retornou designs salvos; seleção/conclusão no widget e links definitivos continuam pendentes. Não declarar os arquivos do Canva prontos ou vinculados ao site.

### Agenda

- Visão por dia e semana, com navegação de datas, criação, edição e cancelamento de compromissos.
- Registrar atendimento abre o formulário com cliente, procedimento, data, hora e duração do agendamento. Se não há cliente, permite selecionar ou cadastrar antes de continuar. Agendamento já realizado abre o atendimento existente; vínculo único validado antes de qualquer alteração. Salvar apresenta o resultado no Financeiro do mês do atendimento.
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
- Resultado por atendimento: `recebido vinculado − sala − materiais`. O Financeiro separa caixa do período (`receitas por data de pagamento − outras despesas por data do lançamento`) e resultado dos atendimentos realizados no período (todos os recebimentos desses atendimentos, inclusive fora do intervalo, menos seus custos). Outras despesas não são descontadas novamente desse resultado.
- Filtros Este mês (padrão), Esta semana (segunda a domingo), Todo o histórico e intervalo personalizado inclusivo. Listas e totais acompanham o período; saldos pendentes são dos atendimentos realizados no intervalo. Cálculos de agregação do novo motor usam centavos inteiros, sem substituir todos os cálculos legados.
- Custos ausentes não equivalem a zero: o resultado fica incompleto até a informação ser preenchida. Zero só deve significar custo realmente inexistente.
- Guardar custo/tarifa/regra aplicados ao atendimento em campos de snapshot; mudar Configurações não deve reprecificar automaticamente o passado.
- No Resultado por atendimento, um único botão Editar abre os dados do atendimento, custos manuais de sala/materiais e o último recebimento ativo (descrição, valor, data, hora, bruto, taxas, forma e parcelas). Quando há recebimentos vinculados, o total recebido é somente leitura e recalculado ao salvar; quando ainda não há, esse campo permite informar o primeiro pagamento. Custos em branco continuam desconhecidos; ajustes afetam somente este atendimento. Despesas e lançamentos conserva os botões Editar e Cancelar.
- O formulário aceita pagamento ainda não informado (campo vazio), zero informado, pagamento parcial e valor combinado opcional (`agreedTotal`). Só há dívida monetária quando o combinado foi informado; sem ele, `chargedTotal` acompanha o recebido, preservando a semântica legada. `paymentConfirmed=false` sinaliza pagamento desconhecido sem inventar dívida. Novos recebimentos preservam o combinado e reduzem o saldo. Custos podem vir das Configurações ou ser preenchidos para o atendimento. Campos vazios permanecem desconhecidos.
- Recebimentos e despesas exigem valor positivo e data válida. Taxas não podem superar o valor bruto informado.
- Resultado por atendimento permanece em tabela em todas as larguras, com cabeçalhos visíveis, valores alinhados à direita, data/hora e números sem quebra e botões empilhados na coluna de ações. Largura mínima de 980px; em painéis menores, rolagem horizontal restrita à tabela.
- Data e hora começam preenchidas em novos lançamentos. Nas tabelas do Financeiro, mostrar somente a data e uma hora abaixo, sem frases auxiliares e sem quebrar os números. No resultado por atendimento, usar a hora do último recebimento ativo ou, se ausente, a hora do atendimento; manter a data do atendimento.
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

- **Arquivo normativo local:** texto do Código de Ética CFBM/Resolução 330/2020 extraído da página oficial em 02/11/2026, sem menus/rodapé e com espaços normalizados. Arquivos públicos `assets/juridico-base.js` (texto, 43 unidades: dois artigos da resolução e 41 do Código, origem, método, data e hashes SHA-256 do HTML capturado e texto normalizado) e `assets/codigo-etica-cfbm-330-2020.txt` (cópia legível). Não é cópia autenticada, consolidação de alterações ou conjunto de toda a legislação de estética.
- Caixa “Consultar legislação salva”: busca literal local com termos sem distinção de acentos/caixa, até oito artigos e prévias de 1.200 caracteres, deixando explícito o corte e o acesso ao texto completo por download TXT. Casos têm atalho para a consulta. `EsteticaJudicialEngine.searchArchive` permite recuperação local para futura integração; não há agente de IA lendo/inter­pretando o arquivo nesta entrega. Busca e download não enviam casos/perguntas a APIs; download usa Blob gerado a partir da cópia carregada. Funcionam sem rede depois do carregamento da página, sem promessa de recarga offline/PWA.
- Atualização é manual e o aviso de cobertura limitada permanece. O arquivo evita chamadas de API na busca atual, mas não torna gratuita uma futura geração por IA externa: envio de trechos e inferência dependerão do provedor/modelo. Nenhum modelo local foi instalado ou conectado.

- Roteiros locais para organizar documentos, dúvidas regulatórias e próximos passos.
- Aponta fontes e necessidade de revisão por profissional habilitado.
- Não emite parecer jurídico nem controla prazos processuais automaticamente.
- Base regional inicial para **CRBM-6 / Paraná / Curitiba**, com curadoria manual de 02/11/2026: inscrição/habilitação/RT, limites de atuação, publicidade, sigilo/prontuário, licenciamento municipal e fiscalização. Seis caixas retráteis com fontes oficiais por assunto; o roteiro relaciona os assuntos pertinentes e abre o resultado automaticamente. Links internos abrem o tópico sem trocar a rota.
- Biblioteca distingue orientação regional, Código de Ética CFBM 330/2020, normas sanitárias municipais e discussão judicial. Referências municipais: SMS 02/2018 e 05/2025, conforme portal oficial. Fonte Anvisa para segurança do estabelecimento. LGPD permanece como link oficial, mas o texto foi bloqueado na consulta automatizada; não declarar leitura integral nesta entrega.
- Alerta sobre Resolução CFBM 241/2014: notícia do TRF1 de 17/03/2026 informa manutenção da anulação; nota CFBM de 24/02/2026 informa recurso. Não houve consulta integral/atual dos autos, confirmação de trânsito em julgado ou efeitos atuais. Não há autorização automática de procedimentos, avaliação individual nem certificação de conformidade.
- A base não integra **todas** as normas, não monitora atualizações e não substitui revisão jurídica. Agente para acompanhar fontes é planejamento, não integração ativa. O contexto do organizador genérico continua transitório, escapado como texto, sem salvar ou enviar documentos. Os casos vinculados abaixo são registros persistentes separados desse organizador.
- **Foco em atuação estética e casos vinculados:** nova caixa “Casos de estética e possíveis processos”, com criação também pela ficha CRM. Cada caso referencia `clientId` e opcionalmente `visitId` do mesmo cliente, sem duplicar os dados do atendimento. Categorias: insatisfação, intercorrência relatada, notificação/reparação, processo, fiscalização da atuação e imagem/publicidade. Situações de triagem até encerramento, checklist de documentos, data de acompanhamento conferida pelo usuário e histórico administrativo. Nenhum prazo processual é calculado.
- `data.legalCases` é opcional nos dados antigos e começa vazio nos novos. Segue o mesmo salvamento/backup dos demais registros, inclusive o documento da conta quando ativo; não exige tabela nova. Edição mantém o ID, acompanhamentos são acrescentados ao histórico. Não é prontuário, arquivo de provas nem trilha imutável. Exclusão de cliente ou atendimento com caso vinculado é bloqueada para preservar referências.
- Apoio atual: `casePlan` cria roteiro local conforme categoria, preocupação assistencial e documentos marcados, destacando revisão humana e fontes. Não interpreta o resumo livre, não lê documentos, não sugere tratamento, não prevê êxito nem prepara defesa. Risco atual de saúde sinalizado prioriza avaliação assistencial; notificações/processos direcionam à conferência por advogado. Agente de análise individual permanece não conectado.
- Formulário exige confirmação de exemplo fictício, limita textos e escapa a exibição. Não recebe anexos, número de processo ou prontuários; real uso clínico/jurídico depende das etapas de produção e privacidade. A data informada não é validada juridicamente. Caso pode ser aberto, editado e acompanhado em celular/tablet, com as caixas, brilho e acessibilidade existentes.
- Datas do histórico são armazenadas como instantes ISO e exibidas em `America/Sao_Paulo`. Verificação dos casos: 36 testes Node e 28 Chromium aprovados, incluindo edição sem duplicar, persistência após recarga, troca de situação, confirmação da data, escape de texto, vínculo CRM e bloqueio de exclusão do cliente. Capturas de caso aberto no celular inspecionadas; não foi testado caso real, consulta processual nem análise por IA.
- Verificação desta entrega: 34 testes Node e 19 testes Chromium aprovados; sintaxe e build aprovados. Capturas da aba com tópicos e roteiro abertos inspecionadas em 390 e 1440px, com ajuste de contraste nos avisos e repetição dos dois testes do Jurídico aprovada. Sem dispositivo físico e sem auditoria jurídica integral.

### Aprovações

- Fila local de conteúdo e mensagens, com estados pendente, aprovado e rejeitado.
- Peças que exigem revisão profissional só habilitam aprovação após as confirmações da revisão.
- Aprovação/rejeição não envia nem publica conteúdo externo.

## 6. Agentes especializados planejados

O manifesto está em `agents.js`. Os perfis são descrições de estrutura futura, sem ativar serviços.

| Área | Especialização prevista | Integrações previstas |
| --- | --- | --- |
| Secretário | Rotina de clínica estética e consulta das áreas pertinentes | Agenda, coworking, mensagens e voz opcional |
| Relacionamento | Estratégias de acompanhamento e retorno | Clientes, agenda, Marketing e secretário |
| Marketing | Marketing de estética avançada e criação de conteúdo | Canva, identidade e redes sociais |
| Agenda | Organização de horários e confirmações | Google Agenda, coworking e secretário |
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
- Na demonstração não há controle de concorrência. Na conta privada, documentos têm versão e gravação transacional com bloqueio otimista; conflito ou falha bloqueia a fila de envios e exige exportar/recarregar, sem fusão automática. RLS restringe documentos e versões anteriores ao proprietário. Não há permissões de equipe nem trilha completa de auditoria.
- Na conta, até 20 versões anteriores são preservadas automaticamente no mesmo banco e podem ser restauradas. Backup externo criptografado e publicação por artifacts preparados em workflows, mas não publicados/ativados nesta entrega; precisam de configuração protegida e teste real de restauração. Guia: `CONTA-E-BACKUP.md`.
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
| `server.js` | Servidor local com lista de arquivos públicos permitidos, bloqueio de `.env`/Git/testes/banco, configuração pública do Supabase via endpoint e sem cache; padrão `127.0.0.1:3000` |
| `ziggy.js`, `ziggy.css`, `assets/ziggy-sprites-v1.png` | Estados e animação local do mascote do Secretário; prompts em `ZIGGY-ARTE.md` |
| `section-disclosures.js`, `section-disclosures.css` | Caixas recolhíveis nas abas, agrupamento de seções e validação acessível |
| `tami-theme.css`, `tami-collection.js` | Identidade visual do painel e modelos locais de Marketing |
| `workflow-engine.js` | Períodos, totais financeiros e pendências |
| `src/cloud-store.js`, `assets/cloud-store.js`, `app-cloud.js` | SDK empacotado, autenticação, fila de gravação e interface da conta |
| `database/setup.sql` | Estrutura aplicada no projeto novo: documentos, versões, políticas RLS e RPC transacional |
| `scripts/`, `.github/workflows/` | Build público e backup externo criptografado preparado |
| `browser-tests/` | Testes Chromium e capturas em larguras de celular/tablet/desktop |
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

Verificação de 02/11/2026 nesta entrega: **32 testes Node e 17 testes Chromium aprovados**, sintaxe JavaScript, build e `git diff --check` aprovados. Capturas inspecionadas de agenda, login, atendimento, financeiro, Marketing, editor e Ziggy, em larguras emuladas de 360/390/768/1440px (Marketing/editor: 390 e 1440px); não houve teste em aparelho físico. Login/envio/conflito no navegador foram testados com API simulada; RLS, gravação, versões e conflito também foram exercitados no banco real com usuários sintéticos e rollback. Advisor de segurança do projeto sem alertas. Cadastro/confirmação por e-mail reais e backup externo agendado/restauração de dump do projeto não foram testados.

Cobertura existente inclui motores de CRM/Marketing/secretário, navegação de todas as áreas, identidade visual, exportação em ambiente simulado, estratégias e aprovações, cadastro/atendimento/recebimentos, edição sem duplicidade, persistência, recuperação e rejeição de sobreposição na agenda.

Limites e próximos trabalhos:

- Os testes de interface usam elementos simulados; não equivalem a uma inspeção de todos os botões em navegador real.
- Revisão em dispositivos físicos e avaliação completa de acessibilidade continuam pendentes; as capturas atuais são de Chromium em larguras emuladas.
- Revisar foco, teclado, modais, leitura por tecnologia assistiva, contraste, ampliação e tabelas em telas estreitas.
- Ampliar testes de cancelamentos cruzados entre agenda/financeiro, edição de snapshots, importação/restauração e concorrência de abas.
- Conferir consistência entre indicadores que incluem exemplos e indicadores que os excluem, tornando os critérios claros ao usuário.
- Rever modelo de cobrança/recebimento antes de adicionar contas a receber, parcelamento ou cálculo de taxas automático.
- Avaliar valores monetários em centavos inteiros ou biblioteca decimal antes de depender do sistema para apuração oficial.
- Corrigir e validar os fluxos necessários antes de receber dados reais ou ativar integrações pagas.

A criação inicial desta memória foi documental. Na entrega do ajuste compacto do Financeiro, a suíte foi executada novamente com 25 testes aprovados; os testes usam interface simulada e não comprovam o encaixe visual em telas reais.

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

- **02/11/2026 — envio do Secretário Ziggy solicitado pelo usuário:** entrega do nome masculino nas telas e da expressão feliz com boquinha/língua, mantendo olhos e rosto estáveis. Verificação anterior da mesma implementação: 37 testes Node, 14 Chromium, build, sintaxe e diff aprovados. Somente código, testes e documentação; dados locais, credenciais e capturas não integram o commit. Conferir publicação pelo commit remoto e arquivos públicos após o envio.

- **02/11/2026 — Secretário e boquinha feliz do Ziggy:** nomes visíveis ajustados para masculino, mantendo rota/identificadores. Expressão feliz com língua da própria pintura, misturada somente na região da boca por máscara, opacidade e oscilação contínua pequena. Surge no carinho/resposta e ocasionalmente em espera; preservados olhos e limites de movimento. Verificação: 37 testes Node, 14 Chromium (Ziggy e acessibilidade/responsividade), build, sintaxe e diff aprovados. Captura ampliada da boca inspecionada e toque emulado testado; sem dispositivo físico ou áudio. Sem envio ao GitHub nesta entrega.

- **02/11/2026 — envio solicitado pelo usuário:** entrega conjunta das setas gráficas nas caixas, arquivo normativo local/busca sem API, monograma na saudação e animação suave/olhar do Ziggy. Verificação final antes do envio: 37 testes Node, 32 Chromium, build e diff aprovados. Arquivos públicos e documentação apenas; `.env`, capturas, downloads de teste e dados do navegador permanecem fora do commit. Conferir o resultado de publicação pelo hash remoto e pelos arquivos servidos no Pages.

- **02/11/2026 — Ziggy mais suave e olhar interativo:** substituídos ciclos de quadros do rosto inteiro por retrato estável, respiração/aceno contínuos, piscada em camada e olhos que seguem o mouse com limites/suavização. Mantidos carinho, chat, estados, pausa e soneca, com acompanhamento desligado no toque e movimento reduzido. Verificação: 37 testes Node e 7 Chromium específicos do Ziggy aprovados, incluindo ponteiro, recentralização, pausa, preferências, toque e troca de aba/contexto. Capturas ampliadas de olhos para esquerda/direita e piscada inspecionadas; sem dispositivo físico. Sem envio ao GitHub nesta entrega.

- **02/11/2026 — logo na saudação:** monograma TC adicionado à esquerda do título da Visão geral. Verificação: sintaxe JavaScript e checagem Chromium em 320/390/768/1440px para carregamento, posição e ausência de transbordamento; confirmada ausência em Clientes. Captura de celular inspecionada. Sem reexecução das suítes completas por ser ajuste visual pequeno; sem envio ao GitHub.

- **02/11/2026 — arquivo jurídico e consulta sem API:** capturado o texto oficial da Resolução CFBM 330/2020/Código de Ética; cópias legível TXT e estruturada JS, com origem, data, método e hashes. Busca local de trechos, download por Blob, atalho a partir do caso e perfil do agente atualizado. Não há inferência/modelo local nem envio a API; cobertura parcial e atualização manual continuam explícitas. Verificação: 37 testes Node, 7 Chromium focados no Jurídico/casos/busca, build, sintaxe e diff aprovados. Busca e download exercitados com rede desligada após carregar a página, em 390/768px; captura de celular inspecionada. Sem teste em dispositivo físico ou auditoria jurídica. Sem envio ao GitHub nesta entrega.

- **02/11/2026 — figura para expandir/recolher:** substituído o texto Abrir/Fechar por chevron SVG em círculo, apontando para baixo/para cima conforme o estado. Mantidos título acessível, `aria-expanded/controls`, brilho, foco e alvos de toque. Verificação: 9 testes Chromium de responsividade, expansão e acessibilidade aprovados, mais repetição do teste da nova figura/rotação; sintaxe e diff aprovados. Captura CRM em 390px inspecionada. Sem reexecução Node ou build por ser ajuste visual local; sem envio ao GitHub nesta entrega.

- **02/11/2026 — conferência da publicação:** alterações enviadas no commit `5c1335a`; Pages padrão publicou com sucesso e seis arquivos públicos conferidos contra o código local. O workflow adicional “Publicar site” revelou um teste antigo dependente da data atual: esperava ver na agenda de hoje um compromisso fixo em 02/11/2026. Corrigido o teste de recuperação para selecionar explicitamente o dia do registro, sem alterar o comportamento do produto. Reexecução da suíte Node em UTC: 36 testes aprovados. Nova verificação remota necessária após enviar esta correção.

- **02/11/2026 — envio conjunto solicitado pelo usuário:** entrega das alterações pendentes de Estúdio Visual compacto, ícones/brilho das caixas, responsividade/acessibilidade, base CRBM-6 e casos de estética vinculados. Verificações de implementação: 36 testes Node, 28 Chromium, repetição dos três testes de casos, build, sintaxe e diff aprovados. Somente código, documentação e testes; credenciais, dados do navegador e capturas locais não integram a entrega. A confirmação da publicação deve ser feita pelo commit remoto e pelo site após o envio.

- **02/11/2026 — atuação estética e casos vinculados:** área de casos com cliente/atendimento existentes, assunto, situação, documentos a conferir, data manual confirmada, histórico administrativo e roteiro local por categoria. Acesso pela ficha CRM; vínculo validado e exclusão de referências bloqueada. Privacidade documentada: apenas exemplos fictícios, sem anexos ou agente externo; dados seguem o armazenamento/backup existente. Verificações: 36 testes Node, 28 Chromium, repetição dos três testes de casos em 390/768/1440px, build, sintaxe e diff aprovados. Capturas de caso e formulário no celular inspecionadas; datas do histórico exibidas em São Paulo. Sem análise real por IA, consulta de autos, auditoria jurídica ou uso de pacientes reais. Sem envio ao GitHub.

- **Até 02/11/2026:** construção das áreas do sistema; adoção do nome Tami e do monograma oficial; tema escuro e revisão de fontes/cores; Clientes e Relacionamento com rankings e ocorrências; editor e estratégias locais de Marketing; agenda visual; estrutura futura de agentes/WhatsApp/voz; configurações e custos de atendimentos; edição financeira; cancelamentos com motivo e perguntas manuais sobre custos; ajuste da ordem das abas e guia do painel.
- **02/11/2026:** criação da tag de backup de código `backup-2026-11-02` no GitHub.
- **02/11/2026 — mudanças locais posteriores ao backup:** avisos de demonstração e limites de produção; exportação/restauração e recuperação local; verificação de gravação; indicadores do início ligados aos registros; validação de datas, valores e conflitos de agenda; atualização/ampliação da suíte para 25 testes aprovados. Revisão visual completa continua pendente.
- **02/11/2026 — esta entrega:** criação de `cérebro.md` e `AGENTS.md` para preservar o contexto do projeto e exigir atualização da memória em futuras entregas de desenvolvimento. Nenhum envio ao GitHub realizado nesta tarefa.
- **02/11/2026 — envio solicitado pelo usuário:** preparação de um commit na `main` reunindo as correções funcionais, os testes e os documentos de segurança e memória que estavam locais. O resultado do envio deve ser confirmado no Git remoto; esta entrada registra a autorização e o conteúdo da entrega.

- **02/11/2026 — financeiro compacto:** removidas as frases junto aos horários e a duplicação de horários na coluna Data; despesas também mostram apenas data e hora. Validação automatizada e limites registrados na seção 9. Sem publicação nesta entrega.

- **02/11/2026 — largura dos resultados:** tabela de atendimentos adaptada à largura disponível, com blocos em painéis estreitos, quebra de textos e ações reorganizadas para dispensar rolagem horizontal. Verificação: `node --check app.js` e 25 testes aprovados. Conferência visual em navegador permanece pendente.

- **02/11/2026 — retorno à tabela solicitado pelo usuário:** removida a conversão dos resultados em blocos; ajustadas colunas, alinhamento monetário e botões. Revisão do CSS e `git diff --check` sem erros; conferência visual em navegador permanece pendente. Sem novos testes automatizados nesta mudança de CSS.

- **02/11/2026 — edição financeira unificada:** três botões de Resultado por atendimento reunidos em Editar, com custos e último recebimento na mesma janela. Teste verifica redução de valor sem duplicidade, rejeição de custo negativo e persistência das correções. `npm test`: 26 aprovados; `node --check app.js` e `git diff --check` aprovados. Sem verificação visual nesta entrega e sem envio ao GitHub.

- **02/11/2026 — atualização do GitHub solicitada:** entrega na `main` dos ajustes da tabela financeira, data/hora compactas e edição unificada, junto com teste e memória. Verificações: 26 testes aprovados, sintaxe JavaScript e diff sem erros; revisão visual segue pendente. Confirmar o envio pelo hash remoto.

- **02/11/2026 — cache do site publicado:** confirmado que GitHub Pages publicou o commit `12217af` com sucesso e que HTML, JavaScript e CSS remotos correspondem aos locais (normalizando finais de linha). Adicionada versão nos links dos arquivos CSS/JS locais em `index.html` para evitar reutilização de arquivos antigos em cache. Registros locais são independentes entre localhost e GitHub Pages; não há sincronização. Conferência visual ainda pendente.

- **02/11/2026 — rotina completa antes do Canva:** Agenda ligada ao registro sem repetir dados, pagamento parcial/desconhecido e combinado opcional, custos e resultado na mesma rotina; filtros financeiros e central de pendências. Conta privada implementada e projeto Supabase gratuito criado com autorização, esquema/RLS aplicados e exercitados com rollback. Histórico de 20 versões, backup externo criptografado preparado, servidor local protegido e builds configurados. Verificação e limites na seção 9. Sem envio desta entrega ao GitHub; ativação online/e-mail/backup externo ainda pendentes.

- **02/11/2026 — identidade e coleção Tami:** refinado o painel com azul profundo, marfim e acentos discretos; quatro modelos editáveis locais e vínculo manual de design Canva com revisão. Corrigidos contraste das prévias claras e transbordamento do carrossel no celular. 32 testes Node e 9 testes Chromium aprovados; após o acabamento visual, os 2 testes de Marketing também passaram novamente. Monograma enviado ao Canva; gerações iniciadas, sem confirmação de designs salvos. Sem envio ao GitHub nesta entrega.

- **02/11/2026 — envio completo solicitado pelo usuário:** entrega dos ajustes de rotina/Financeiro/pendências, conta privada e esquema do banco, coleção Tami e visual, testes, build e workflows preparados. Reexecutados 32 testes Node com sucesso; verificação do diff e busca por padrões comuns de credenciais sem candidatos nos arquivos destinados ao envio. `.env`, caches, dependências instaladas e artifacts locais ficam fora do Git. As configurações de autenticação online e backup externo descritas no guia continuam pendentes. Confirmar o commit e a publicação pelo GitHub após o envio.

- **02/11/2026 — caixas recolhíveis solicitadas pelo usuário:** informações das caixas nas demais abas começam ocultas e abrem/fecham pelo cabeçalho, independentemente, preservando a Visão geral. Indicadores agrupados e seções financeiras separadas; teclado, estado em memória e revelação de campo inválido implementados. Corrigidas larguras no Jurídico/Identidade no celular. Verificação: 32 testes Node e 12 testes Chromium aprovados, build e sintaxe aprovados. Capturas de CRM fechado/aberto inspecionadas em 390 e 1440px; testes cobrem as dez abas secundárias. Sem teste em dispositivo físico. Sem envio ao GitHub nesta entrega.

- **02/11/2026 — Ziggy animado:** mascote da Secretária com 24 quadros e seis estados, interação com digitação/resposta, carinho, pausa e soneca. CTA revela a conversa recolhida. Chat com bloqueio de duplicidade, tratamento de falha e proteção ao trocar de aba/contexto; envio não grava documentos ou backups. 32 testes Node e 17 testes Chromium aprovados, com inspeção da captura do Ziggy no celular; build e sintaxe aprovados. Sem teste em dispositivo físico, sem voz ou IA externa e sem envio ao GitHub nesta entrega.

- **02/11/2026 — envio do Ziggy e caixas solicitado pelo usuário:** entrega na `main` do mascote animado, atlas/arte, caixas recolhíveis, ajustes do chat e testes correspondentes. Verificações anteriores: 32 testes Node, 17 testes Chromium e build aprovados; diff sem erros antes do envio. Credenciais, fotos originais e artifacts de teste ficam fora do commit. Resultado do envio/publicação deve ser conferido pelo hash remoto e pelos arquivos do site.

- **02/11/2026 — Estúdio Visual compacto:** por solicitação do usuário, apresentação, formatos e aviso foram reunidos em uma caixa com monograma menor. Mantidos os quatro formatos, a expansão pelo título e o aviso de revisão/direitos de imagem, com texto curto. Verificação: 2 testes de Marketing no Chromium aprovados e capturas do bloco inspecionadas em 390/1440px; sintaxe e diff sem erros. A suíte completa não foi reexecutada nesta alteração visual. Sem envio ao GitHub.

- **02/11/2026 — símbolos intuitivos nas caixas:** acrescentado um conjunto SVG consistente nos cabeçalhos retráteis de todas as abas secundárias, escolhido pelo conteúdo e preservando as cores dos rankings. Testes verificam um único ícone por cabeçalho, sem mudar nomes acessíveis, abertura ou formulários. 17 testes Chromium aprovados; capturas de CRM inspecionadas em 390/1440px; sintaxe e diff aprovados. Testes Node não reexecutados nesta alteração visual. Sem envio ao GitHub.

- **02/11/2026 — base jurídica regional:** adicionada curadoria inicial CRBM-6/Paraná/Curitiba com seis assuntos, dez fontes oficiais e alerta da disputa sobre a Resolução 241/2014, sem presumir o estado atual dos autos. Roteiros apontam assuntos relacionados; resultados abrem após envio e tópicos preservam a rota. Verificação: 34 testes Node, 19 Chromium, repetição dos dois testes jurídicos, sintaxe e build aprovados; capturas em 390/1440px inspecionadas. Cobertura jurídica não exaustiva, sem monitoramento ou parecer. Sem envio ao GitHub nesta entrega.

- **02/11/2026 — destaque das caixas e revisão responsiva/acessível:** brilho de hover, foco, Abrir/Fechar, alvos de toque, menu de tablet, atalho de conteúdo, foco de diálogos e tabelas, movimento reduzido e alto contraste. Corrigidos layout dos retornos, cabeçalho e campos do editor. Verificação final: 34 testes Node, 25 testes Chromium, build, sintaxe e diff aprovados. Nova cobertura percorre as 11 abas com caixas abertas e o editor em 320/390/768/1024px, testa mouse, toque emulado, teclado, foco/retorno do diálogo, menu, alto contraste e movimento reduzido. Capturas do celular/Secretária, tablet/Jurídico e celular/editor inspecionadas; suíte anterior também verifica 360/1440px. Sem teste em aparelho físico, Safari, leitor de tela real ou auditoria WCAG completa. Padrão de revisão responsiva/acessível registrado para entregas futuras. Sem envio ao GitHub.
