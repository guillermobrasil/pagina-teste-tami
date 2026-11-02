# Segurança e separação entre demonstração e produção

## Situação atual

- Este repositório publica um protótipo estático de demonstração. O selo “Ambiente de demonstração” deve permanecer visível.
- Os exemplos fornecidos pelo sistema são fictícios e marcados como demonstração. Não use dados reais de pacientes, clientes, saúde, contato ou finanças neste ambiente público.
- A demonstração continua sem login: seus registros ficam no `localStorage` e outra pessoa usando o mesmo perfil pode vê-los. Foi implementado um modo privado opcional com Supabase Auth, RLS por proprietário e sincronização por documento versionado. Projeto gratuito e esquema já criados com autorização; ativação online e teste real de e-mail estão pendentes. Não equivale a aprovação para produção.
- A demonstração não envia seus registros ao servidor. O modo privado grava somente os dados da conta autenticada no banco; nunca importa automaticamente o `localStorage`. O arquivo de backup exportado é JSON sem criptografia e deve ser guardado com cuidado.
- Foi feita uma busca por padrões comuns de chaves e credenciais nos arquivos rastreados e no histórico Git disponível: nenhum candidato foi encontrado. Essa busca não substitui rotação de credenciais nem uma ferramenta especializada de varredura.

## Salvaguardas da demonstração

- A interface avisa para usar somente dados fictícios.
- A tela Configurações permite baixar e restaurar um backup local.
- A aplicação mantém uma cópia local da gravação anterior e tenta recuperá-la se os dados principais estiverem corrompidos.
- Se uma gravação falhar, a página avisa e pede confirmação antes de sair; isso não substitui um backup externo.

## Bloqueios antes de qualquer uso em produção

1. Validar cadastro, confirmação por e-mail, login e recuperação de acesso reais; configurar URLs/SMTP. Isolamento por conta implementado, mas papéis de equipe ainda não existem.
2. Validar o modo privado com dados sintéticos em dois dispositivos antes de qualquer migração real. O banco usa RLS e versão esperada; não tratar a demonstração/localStorage como armazenamento de produção.
3. Definir minimização, base legal, retenção, exportação e exclusão de dados, com revisão especializada de privacidade.
4. Manter segredos somente no servidor ou no gerenciador de segredos. Nunca colocar chaves em HTML, JavaScript público ou arquivos versionados.
5. Automatizar backups criptografados e testar restauração antes de cadastrar dados reais.
6. Separar domínios e credenciais de demonstração, homologação e produção; testar primeiro com dados sintéticos.
7. Fazer revisão de segurança e privacidade, configurar HTTPS, registros de auditoria e resposta a incidentes.

O protótipo atual não deve ser usado como sistema de registro oficial nem como ambiente de produção.

## Implementação e verificação de 02/11/2026

- Credenciais de configuração somente em `.env` ignorado pelo Git ou nos secrets/variáveis de publicação. Apenas URL e chave publicável são expostas ao navegador; nunca chave administrativa.
- Servidor local bloqueia arquivos privados, Git, SQL e testes. Build copia somente arquivos públicos.
- Sessão privada no sessionStorage; dados da conta em memória. Sair volta à demonstração; não persistir dados privados no backup local da demonstração.
- RLS exercitada entre dois usuários sintéticos com rollback; documentos/versões de outra conta ficaram invisíveis. RPC e conflito também exercitados. Advisor do Supabase sem alertas, sem equivaler a auditoria integral.
- Versões automáticas ficam no mesmo banco e não substituem backup externo. Workflow externo preparado com AES-256-GCM/scrypt e ativação explícita por `BACKUP_ENABLED`; ainda sem secrets configurados, sem agendamento ativo ou teste de restauração real. Criptografia testada com conteúdo sintético, senha incorreta e adulterção.
- Guia de ativação: [CONTA-E-BACKUP.md](CONTA-E-BACKUP.md).

- **Marketing/Canva (02/11/2026):** o vínculo com o design é um link externo manual validado para HTTPS e domínio canva.com, guardado no mesmo armazenamento do rascunho/conta. Não enviar dados de clientes ou pacientes ao Canva. Nesta tarefa foi enviado apenas o monograma oficial já público e textos institucionais. O site não recebeu token do Canva nem acesso automático à conta.
