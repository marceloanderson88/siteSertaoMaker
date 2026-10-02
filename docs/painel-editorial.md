# Painel editorial

Abra `/admin` e use o acesso entregue à equipe. As credenciais iniciais ficam apenas no arquivo local ignorado `work/acesso-painel.txt`.

## Publicações

1. Escolha **Nova publicação** ou um item existente.
2. Informe título, categoria, data, resumo e seções. O endereço fica fixo após o primeiro salvamento para preservar links compartilhados.
3. Inclua a fonte oficial e um botão para o próximo passo. Use links HTTPS; para páginas do próprio site use, por exemplo, `/oportunidades`.
4. Confira a prévia. **Salvar rascunho** mantém o conteúdo privado. **Publicar** exibe o conteúdo a partir da data escolhida, no horário de Brasília.
5. Para retirar uma notícia do ar, use **Retirar do ar e salvar rascunho**. Os dados continuam no painel.

O prazo opcional exibe automaticamente um aviso de encerramento. A data de evento informa a agenda prevista e, depois da data, indica que ela já passou. Esses campos não consultam novos editais automaticamente.

Na aba **Redes e comunidade**, atualize o Instagram e cole o convite da comunidade. Sem convite, o site oferece um contato por e-mail. A equipe deve renovar convites expirados.

Se outra pessoa editar o conteúdo ao mesmo tempo, o painel recusa a gravação para evitar perda de dados. Seu formulário é preservado. Use **Atualizar lista**, confira a edição mais recente e escolha como conciliar os textos antes de salvar novamente.

## Armazenamento e acesso

As publicações são armazenadas em JSON no Vercel Blob **privado** `sertao-maker-noticias`, fora do repositório. O site retorna apenas conteúdos publicados cuja data já chegou. Os rascunhos exigem sessão administrativa. A gravação usa ETag para detectar concorrência. A sessão dura oito horas, com cookie HttpOnly e SameSite Strict; as alterações exigem origem igual à do site. As tentativas de login são limitadas no armazenamento persistente.

Variáveis: `BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `ADMIN_SESSION_SECRET`. Não use prefixo `NEXT_PUBLIC_`. Produção e desenvolvimento estão conectados ao armazenamento; previews não recebem o acesso de produção. Desenvolvimento local pode alterar o mesmo acervo: use apenas rascunhos de teste e preserve publicações reais. Para trabalho paralelo, configure outro store privado.

Sem armazenamento configurado, as páginas públicas exibem os quatro textos iniciais de `content/noticias.json`. Sem configuração completa, o painel recusa login e gravação. Depois da primeira gravação, o acervo do Blob passa a ser a fonte; alterar o JSON inicial no Git não sobrescreve edições da equipe.

## Trocar o acesso

Guarde o acesso existente. Renomeie `.vercel/admin-secrets.json` e execute `node scripts/setup-admin.mjs email@dominio.com`. Configure os três novos valores `ADMIN_*` na Vercel e publique uma nova versão. A troca do segredo invalida sessões antigas. Baixe novamente as variáveis de desenvolvimento com `vercel env pull .env.local`. Nunca publique os arquivos de acesso ou variáveis. O painel usa um acesso de equipe; não há contas individuais ou recuperação de senha por e-mail.

Mantenha cópias privadas periódicas de `cms/content.json` pelo armazenamento da Vercel. O painel não oferece histórico de versões nem upload de imagens nesta primeira versão.
