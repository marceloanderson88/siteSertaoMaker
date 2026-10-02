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

Dependências, arquivos de build e variáveis de ambiente locais são ignorados
pelo Git por meio do `.gitignore`.
