# Painel editorial

Abra `/admin` e use o acesso entregue à equipe. A senha inicial foi preservada. A cópia local fica criptografada em `work/acesso-painel.protegido.txt`, ignorada pelo Git e vinculada ao usuário do Windows que a protegeu. Para consultar intencionalmente no seu terminal, execute `powershell -NoProfile -File scripts/read-admin-secret.ps1`. Não cole o resultado no chat ou em documentos compartilhados; guarde a senha em um gerenciador de senhas.

## Segurança

Na aba **Segurança**, escolha **Configurar autenticador**, confirme sua senha, escaneie o QR Code em seu aplicativo autenticador e informe o código de seis dígitos. A ativação depende dessa confirmação; instalar o recurso não ativa a proteção automaticamente. Após ativar, guarde os dez códigos de recuperação exibidos uma única vez. Cada código exige sua senha e só funciona uma vez. A ativação encerra as outras sessões. A chave de configuração só aparece durante a inscrição autenticada e fica criptografada com AES-256-GCM no armazenamento privado.

O login passa a exigir senha e código do autenticador (ou de recuperação). Códigos já usados são recusados, inclusive em tentativas simultâneas. **Sair de todos os dispositivos** invalida todas as sessões no servidor e exige novo login. Não há opção pública para desativar o autenticador. Se perder o celular, use um código de recuperação e registre um novo pedido com o responsável técnico; se também perder todos os códigos, a recuperação exige acesso administrativo à Vercel, rotação da senha e remoção intencional de `cms/auth/security.json`. Não troque `ADMIN_SESSION_SECRET` sem preservar/recuperar a configuração de MFA: esse segredo também protege sua criptografia.

A migração invalida sessões antigas. O painel continua usando um único acesso de equipe; ainda não possui contas individuais nem recuperação de senha por e-mail. Prefira um responsável por esse acesso.

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

As publicações são armazenadas em JSON no Vercel Blob **privado** `sertao-maker-noticias`, fora do repositório. O site retorna apenas conteúdos publicados cuja data já chegou. Os rascunhos exigem sessão administrativa. A gravação usa ETag para detectar concorrência. As sessões têm tokens aleatórios de 256 bits, armazenados apenas por digest no servidor, prazo absoluto de duas horas e limite de 30 minutos sem atividade (a atividade é registrada em intervalos de até cinco minutos). O logout revoga a sessão no armazenamento, além de apagar o cookie. Em produção, o cookie usa prefixo `__Host-`, Secure, HttpOnly e SameSite Strict. Alterações exigem a mesma origem do site. Tentativas de login e de ativação do autenticador têm limites persistentes. Falhas no armazenamento recusam o acesso.

Variáveis: `BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH_V2` e `ADMIN_SESSION_SECRET`. Não use prefixo `NEXT_PUBLIC_`. O hash usa scrypt assíncrono com N=131072, r=8 e p=1. A autenticação usa `cms/auth` em produção e `cms/auth-development` no desenvolvimento; testes de segurança usam um prefixo temporário exclusivo. Produção e desenvolvimento ainda compartilham as publicações do armazenamento; previews não recebem o acesso de produção. Desenvolvimento local pode alterar o mesmo acervo: preserve publicações reais. Para trabalho paralelo, configure outro store privado.

O site aplica uma CSP com nonce novo por requisição, bloqueia scripts não autorizados e inclusão em iframes, protege contra interpretação incorreta de arquivos, limita permissões do navegador e usa HSTS em produção. Respostas administrativas, inclusive erros, não devem ser armazenadas em cache. JSON inválido e corpos acima do limite são recusados antes de processamento completo.

As cópias locais de variáveis e configuração também ficam protegidas pelo Windows (`work/ambiente.protegido.txt` e `.vercel/admin-secrets.protegido.txt`). Execute `npm run dev:secure` para injetar as variáveis em memória no processo local, sem recriar `.env.local`. Para consultar a configuração intencionalmente, passe `-Path .vercel/admin-secrets.protegido.txt` ao script de leitura. A criptografia não protege contra programas maliciosos executados na sua própria conta Windows. Para outras máquinas, prefira o gerenciador de senhas e as variáveis da Vercel; não conte com copiar o arquivo protegido para outro usuário.

`npm run test:security` executa os testes integrados em uma instância local com credenciais próprias e dados isolados. As publicações e a autenticação de produção são preservadas, e os arquivos temporários de teste são removidos. Em CI ou em outro sistema, injete `BLOB_READ_WRITE_TOKEN` em memória, por exemplo com `vercel env run -- npm run test:security`.

Sem armazenamento configurado, as páginas públicas exibem os quatro textos iniciais de `content/noticias.json`. Sem configuração completa, o painel recusa login e gravação. Depois da primeira gravação, o acervo do Blob passa a ser a fonte; alterar o JSON inicial no Git não sobrescreve edições da equipe.

## Trocar o acesso

Guarde o acesso existente em um gerenciador de senhas. Preserve os dois arquivos protegidos de acesso/configuração e execute `node scripts/setup-admin.mjs email@dominio.com` no seu usuário Windows. O script recusa sobrescrever arquivos existentes e não grava a senha em texto puro. Configure os novos valores `ADMIN_*` na Vercel como variáveis secretas em produção e publique uma nova versão; valores devem ser transmitidos por stdin, nunca como argumentos ou logs. **Se o autenticador já estiver ativo, preserve o segredo de sessão existente durante a troca de senha**; para uma rotação desse segredo, planeje também a recuperação da configuração criptografada de MFA. Nunca publique os arquivos de acesso ou variáveis.

As versões anteriores de arquivos em texto puro podem ainda existir em backups ou no histórico do OneDrive. A remoção local não apaga essas cópias. Após guardar a senha em um gerenciador, revise compartilhamentos e cópias antigas; se houver suspeita de exposição, faça uma rotação intencional do acesso.

Mantenha cópias privadas periódicas de `cms/content.json` pelo armazenamento da Vercel. O painel não oferece histórico de versões nem upload de imagens nesta primeira versão.
