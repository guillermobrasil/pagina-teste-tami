# Segurança e separação entre demonstração e produção

## Situação atual

- Este repositório publica um protótipo estático de demonstração. O selo “Ambiente de demonstração” deve permanecer visível.
- Os exemplos fornecidos pelo sistema são fictícios e marcados como demonstração. Não use dados reais de pacientes, clientes, saúde, contato ou finanças neste ambiente público.
- Não há login, perfis, permissões, banco de dados de produção ou sincronização entre dispositivos. Os registros digitados ficam no `localStorage` do navegador; outra pessoa usando o mesmo perfil de navegador pode vê-los.
- O sistema não envia esses registros ao servidor. O arquivo de backup exportado é JSON sem criptografia e deve ser guardado com cuidado.
- Foi feita uma busca por padrões comuns de chaves e credenciais nos arquivos rastreados e no histórico Git disponível: nenhum candidato foi encontrado. Essa busca não substitui rotação de credenciais nem uma ferramenta especializada de varredura.

## Salvaguardas da demonstração

- A interface avisa para usar somente dados fictícios.
- A tela Configurações permite baixar e restaurar um backup local.
- A aplicação mantém uma cópia local da gravação anterior e tenta recuperá-la se os dados principais estiverem corrompidos.
- Se uma gravação falhar, a página avisa e pede confirmação antes de sair; isso não substitui um backup externo.

## Bloqueios antes de qualquer uso em produção

1. Implementar autenticação segura e controle de acesso por usuário e função.
2. Migrar os dados para um backend e banco de dados protegidos; não tratar `localStorage` como armazenamento de produção.
3. Definir minimização, base legal, retenção, exportação e exclusão de dados, com revisão especializada de privacidade.
4. Manter segredos somente no servidor ou no gerenciador de segredos. Nunca colocar chaves em HTML, JavaScript público ou arquivos versionados.
5. Automatizar backups criptografados e testar restauração antes de cadastrar dados reais.
6. Separar domínios e credenciais de demonstração, homologação e produção; testar primeiro com dados sintéticos.
7. Fazer revisão de segurança e privacidade, configurar HTTPS, registros de auditoria e resposta a incidentes.

O protótipo atual não deve ser usado como sistema de registro oficial nem como ambiente de produção.
