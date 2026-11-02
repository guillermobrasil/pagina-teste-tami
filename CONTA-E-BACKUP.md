# Conta privada e backup

Projeto gratuito criado em São Paulo: **Estética Pro IA**. O painel público continua separado da conta. Acesso ao banco usa Supabase Auth e RLS por proprietário; não há compartilhamento de registros entre contas.

## Ambiente local

- A configuração local está em `.env`, ignorado pelo Git. Nunca colocar senha, chave administrativa ou token no código.
- `npm ci`, `npm run build:cloud` e `npm start`.
- Use **Entrar na conta**, crie seu cadastro, confirme o e-mail e entre. A conta começa vazia. Os exemplos e registros locais não são importados automaticamente.
- O SDK guarda a sessão somente na sessão do navegador. Dados privados carregados ficam em memória, sem cópia no `localStorage` da demonstração. Recarregar a página volta à demonstração; **Retomar sessão** carrega a conta novamente.
- Falha de rede ou conflito entre dispositivos bloqueia novos envios. Exporte as alterações antes de recarregar a conta. Não há fusão automática de alterações concorrentes.

## Ativação no site online (pendente)

1. No Supabase, em Authentication / URL Configuration, configurar Site URL e Redirect URLs para o endereço publicado e localhost usado. Não desativar confirmação de e-mail. Conferir SMTP e limites antes do uso real.
2. No GitHub, Settings / Pages: escolher **GitHub Actions** como origem.
3. Em Settings / Secrets and variables / Actions: variável `SUPABASE_URL` e secret `SUPABASE_PUBLISHABLE_KEY`, obtidos do projeto. É uma chave pública própria para frontend, mas fica fora dos arquivos versionados conforme a regra do projeto. Nunca usar chave administrativa.
4. O workflow Publicar site compila uma pasta `dist` com somente arquivos públicos e gera `cloud-config.json`. Ausência de configuração mantém a conexão privada indisponível, sem liberar dados.
5. Publicar somente após os ajustes de configuração. Testar cadastro, confirmação por e-mail, login e acesso em dois dispositivos com dados sintéticos. Esses passos reais com e-mail ainda não foram executados.

## Recuperação e limites do backup

Ao salvar na conta, o banco preserva até **20 versões anteriores**, acessíveis em Minha conta. A restauração é uma nova gravação com proteção de concorrência. As versões ficam no mesmo banco e não protegem contra exclusão do projeto ou perda do serviço. Exclusão da conta também remove suas versões.

O plano gratuito não inclui o backup diário gerenciado dos planos pagos: [documentação oficial](https://supabase.com/docs/guides/platform/backups).

O workflow **Backup criptografado do banco** está preparado para executar diariamente às 03h de São Paulo. **Ainda não está ativo nem validado**, pois depende de publicação e de `BACKUP_ENABLED=true` nas variáveis do repositório e de dois secrets do GitHub:

- `SUPABASE_DB_URL`: conexão PostgreSQL do projeto (preferir Session pooler para runner sem IPv6). Não enviar essa senha no chat.
- `BACKUP_PASSWORD`: senha forte exclusiva com pelo menos 20 caracteres, guardada também fora do GitHub para permitir recuperação.

O dump é criptografado com AES-256-GCM autenticado, scrypt, salt e nonce aleatórios antes de ser guardado como artifact por 30 dias. Nunca é enviado um dump aberto. Baixe e guarde cópias em outro local; expiração do artifact ou exclusão do repositório elimina essas cópias. Não há alerta externo de falha configurado.

Para testar a recuperação em um banco de teste separado, usando variáveis locais protegidas:

```sh
node scripts/backup-crypto.js decrypt < clinic.dump.enc > clinic.dump
pg_restore --dbname="$RESTORE_DATABASE_URL" --no-owner --no-acl clinic.dump
```

Verificar contagem de registros, autenticação, RLS, dados e relacionamento no banco restaurado. Apagar o dump aberto após a conferência. Não restaurar sobre produção durante o teste. O dump não inclui arquivos binários futuros do Supabase Storage. Conferir compatibilidade da versão de `pg_dump` com o banco antes de ativar o workflow.

Login e isolamento não substituem uma revisão de produção. Permanecem pendentes teste real de e-mail, backup externo e restauração, permissões de equipe, revisão de privacidade e avaliação para dados reais.
