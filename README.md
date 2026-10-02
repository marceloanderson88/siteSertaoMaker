# Incubadora Sertão Maker

Site institucional da Incubadora Sertão Maker e do programa SerTão Inovador.

## Requisitos

- Node.js 22.13.0 ou superior
- npm

## Executar localmente

```sh
npm ci
npm run dev
```

Abra http://localhost:3000 no navegador.

## Validar e executar em produção

```sh
npm run lint
npm run build
npm start
```

## Enviar para o GitHub

O repositório de destino é https://github.com/marceloanderson88/siteSertaoMaker.
Com o Git autenticado, envie a branch principal:

```sh
git push -u origin main
```

O envio publica o código no repositório. Para colocar o site online, use uma
hospedagem compatível com Next.js, configurando `npm run build` como comando de
build e `npm start` para execução em um servidor Node.js. O projeto atual não
está configurado para exportação estática no GitHub Pages.

## Estrutura

- `app/`: páginas, estilos e layout global
- `components/`: componentes de conteúdo, cabeçalho e rodapé
- `public/`: imagens e outros arquivos públicos
- `lib/site-content.ts`: dados compartilhados, contatos, cronograma e guias
- `content/noticias.json`: notícias iniciais, usadas antes da primeira gravação no armazenamento
- `app/admin/` e `app/api/admin/`: painel editorial e acesso protegido
- `docs/painel-editorial.md`: publicação de notícias, links e gestão de acesso
- `docs/conteudo-e-fontes.md`: fontes, manutenção editorial e informações a confirmar

## Deploy na Vercel

Importe o repositório `marceloanderson88/siteSertaoMaker`, selecione Next.js e
mantenha a pasta raiz do projeto. Use `npm run build` e a saída automática do
framework. O envio à branch `main` publica em produção no projeto Vercel
`site-sertao-maker`, associado ao domínio `www.sertaomaker.com.br`.

As páginas públicas funcionam com os textos iniciais sem variáveis. Para o
painel `/admin`, conecte um store **privado** do Vercel Blob e configure
`BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH_V2` e
`ADMIN_SESSION_SECRET`, conforme `.env.example` e `docs/painel-editorial.md`.
Use `node scripts/setup-admin.mjs email@dominio.com` para gerar um acesso local
sem exibir segredos no terminal. Não conecte previews ao acervo de produção.
Com o projeto vinculado, `vercel env pull .env.local` prepara o desenvolvimento.
As páginas de oportunidades usam renderização por requisição para encerrar
o destaque de inscrição conforme a data publicada.

Dependências, arquivos de build e variáveis de ambiente locais são ignorados
pelo Git por meio do `.gitignore`.
