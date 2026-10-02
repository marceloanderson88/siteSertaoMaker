import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, BriefcaseBusiness, Building2, Check, ChevronDown, CircuitBoard, ExternalLink, Handshake, MapPin, Network, Rocket, Sparkles, Sprout, Sun, Target, UsersRound } from "lucide-react";

const destaques = [
  { Icone: Sprout, texto: "Pessoas que desenvolvem" }, { Icone: UsersRound, texto: "Negócios que geram impacto" },
  { Icone: Sun, texto: "Conhecimento que transforma" }, { Icone: Sparkles, texto: "Um Sertão mais forte" },
];
const pilares = [
  { Icone: Target, titulo: "Inovação com propósito", texto: "Soluções conectadas a problemas reais." },
  { Icone: Sprout, titulo: "Talentos do território", texto: "Valorização de pessoas, conhecimentos e competências regionais." },
  { Icone: Network, titulo: "Conexões que impulsionam", texto: "Mentores, instituições, empresas e redes trabalhando juntas." },
  { Icone: Rocket, titulo: "Negócios para o amanhã", texto: "Iniciativas estruturadas para crescer e gerar impacto." },
];
const etapas = ["Inscrição", "Seleção", "Diagnóstico", "Formação", "Mentorias", "Validação", "Desenvolvimento", "Conclusão"];
const servicos = [
  { Icone: BriefcaseBusiness, titulo: "Desenvolvimento de negócios", itens: ["Formação empreendedora", "Mentorias especializadas", "Diagnóstico e plano de desenvolvimento", "Modelagem e validação"] },
  { Icone: CircuitBoard, titulo: "Prototipagem e soluções", itens: ["Prototipagem e provas de conceito", "Impressão 3D e fabricação digital", "Eletrônica e automação", "Desenvolvimento de MVP"] },
  { Icone: Building2, titulo: "Espaços e infraestrutura", itens: ["Ambientes de inovação", "Laboratórios e equipamentos", "Espaços para reuniões e eventos", "Ambientes colaborativos"] },
  { Icone: Network, titulo: "Mercado e conexões", itens: ["Networking e parceiros", "Apoio à captação", "Propriedade intelectual", "Visibilidade e eventos"] },
];
const faqs = [
  ["O que é a Sertão Maker?", "É uma incubadora instalada no Centro de Inovação Maker do IFSertãoPE Campus Salgueiro, dedicada ao desenvolvimento de ideias e negócios inovadores."],
  ["O que é o SerTão Inovador?", "É o programa principal da incubadora. Ele organiza o apoio aos participantes em dois ciclos complementares: Pré-incubação e Incubação."],
  ["Qual a diferença entre Pré-incubação e Incubação?", "A Pré-incubação ajuda a validar uma ideia e estruturar a proposta de negócio. A Incubação fortalece soluções ou negócios que já avançaram nessa validação."],
  ["Posso participar apenas com uma ideia?", "Sim. Pessoas e equipes em estágio inicial podem encontrar na Pré-incubação o caminho mais adequado, conforme as regras de cada edital."],
  ["Posso utilizar os laboratórios?", "Participantes podem ser conectados à infraestrutura disponível conforme as necessidades do projeto, a agenda, as normas e as regras de utilização."],
  ["Como faço para participar?", "Acompanhe a seção de oportunidades. Quando não houver edital aberto, entre em contato para manifestar interesse nas próximas edições."],
];

export default function Home() {
  return <main>
    <section className="hero" aria-labelledby="hero-title">
      <Image src="/hero-faixa-ubo4.png" alt="Paisagem do Sertão ao pôr do sol com uma pessoa observando o horizonte" fill preload sizes="100vw" className="hero__background" />
      <Image src="/hero-linhas.png" alt="" width={3840} height={2160} className="hero__overlay hero__overlay--lines" aria-hidden="true" />
      <Image src="/hero-assinatura.png" alt="" width={1954} height={2160} className="hero__overlay hero__overlay--signature" aria-hidden="true" />
      <div className="hero__copy"><div className="hero__copy-inner">
        <p className="eyebrow">Incubadora Sertão Maker</p>
        <h1 id="hero-title"><span className="hero-title__wine">TRANSFORMANDO</span><span className="hero-title__wine">IDEIAS EM NEGÓCIOS</span><span>QUE INOVAM</span><span>A PARTIR DO SERTÃO.</span></h1>
        <p className="hero__description">A Incubadora Sertão Maker apoia ideias e negócios inovadores por meio de formação, mentorias, acompanhamento, validação e conexão com o ecossistema de inovação, gerando oportunidades para transformar realidades no Sertão.</p>
        <div className="hero__highlights" aria-label="Nossos compromissos">{destaques.map(({ Icone, texto }) => <div className="hero__highlight" key={texto}><Icone className="hero__highlight-icon" aria-hidden="true" /><p>{texto}</p></div>)}</div>
        <p className="hero__location"><MapPin aria-hidden="true" /> CIM <i aria-hidden="true" /> IFSertãoPE Campus Salgueiro</p>
      </div></div>
      <a className="hero__scroll" href="#sobre"><span aria-hidden="true">↓</span>Descubra mais</a>
    </section>

    <section className="section about" id="sobre" aria-labelledby="about-title"><div className="container section-heading section-heading--split"><div><p className="eyebrow">Sobre a Sertão Maker</p><h2 id="about-title">Mais que uma incubadora, um território de possibilidades.</h2></div><div><p>A Incubadora Sertão Maker é um ambiente de apoio ao desenvolvimento de iniciativas inovadoras, instalada no Centro de Inovação Maker — CIM, do IFSertãoPE Campus Salgueiro.</p><p>Conecta empreendedorismo, conhecimento, tecnologia e desenvolvimento regional para transformar ideias em soluções e negócios mais estruturados.</p><Link className="text-link" href="/sobre">Conheça a Sertão Maker <ArrowRight aria-hidden="true" /></Link></div></div><div className="container card-grid card-grid--four">{pilares.map(({ Icone, titulo, texto }) => <article className="feature-card" key={titulo}><Icone aria-hidden="true" /><h3>{titulo}</h3><p>{texto}</p></article>)}</div></section>

    <section className="section program" id="programa" aria-label="SerTão Inovador"><Image className="program-campaign" src="/sertao-capa-011.png" alt="SerTão Inovador — O Sertão cria, Pernambuco se conecta" width={2172} height={724} sizes="100vw" /><div className="container"><div className="program-grid">
      <article className="program-card"><span className="program-card__number">01</span><p className="program-card__label">Pré-incubação</p><h3>Valide sua ideia e construa o negócio.</h3><p>Para validar problema, público, solução e modelo.</p><ul><li>Proposta de valor</li><li>Mercado e público</li><li>Protótipo e MVP</li><li>Modelo de negócio</li></ul><Link href="/sertao-inovador/pre-incubacao">Conheça a Pré-incubação <ArrowRight aria-hidden="true" /></Link></article>
      <article className="program-card program-card--accent"><span className="program-card__number">02</span><p className="program-card__label">Incubação</p><h3>Estruture e faça seu negócio crescer.</h3><p>Para organizar estratégia, operação e crescimento.</p><ul><li>Estratégia e gestão</li><li>Mercado e posicionamento</li><li>Inovação e tecnologia</li><li>Captação e conexões</li></ul><Link href="/sertao-inovador/incubacao">Conheça a Incubação <ArrowRight aria-hidden="true" /></Link></article>
    </div></div></section>

    <section className="section journey" id="jornada" aria-labelledby="journey-title"><div className="container"><div className="section-heading section-heading--center"><p className="eyebrow">Como funciona</p><h2 id="journey-title">Uma jornada para tirar projetos do papel.</h2><p className="section-lead">O edital vigente informa datas, regras e etapas específicas de cada edição.</p></div><ol className="journey-list">{etapas.map((etapa, index) => <li key={etapa}><span>{String(index + 1).padStart(2, "0")}</span><strong>{etapa}</strong></li>)}</ol></div></section>

    <section className="section services" id="servicos" aria-labelledby="services-title"><div className="container"><div className="section-heading section-heading--split"><div><p className="eyebrow">Apoio ao desenvolvimento</p><h2 id="services-title">Recursos para transformar projetos em negócios.</h2></div><p>Formação, acompanhamento, infraestrutura e conexões reunidos conforme as necessidades de cada iniciativa.</p></div><div className="services-grid">{servicos.map(({ Icone, titulo, itens }) => <article className="service-card" key={titulo}><Icone aria-hidden="true" /><h3>{titulo}</h3><ul>{itens.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></article>)}</div></div></section>

    <section className="section ecosystem" id="cim" aria-labelledby="ecosystem-title"><div className="container ecosystem-grid"><div><p className="eyebrow eyebrow--light">Integração institucional</p><h2 id="ecosystem-title">A Sertão Maker faz parte do CIM.</h2><p>A incubadora atua conectada ao ambiente de inovação do IFSertãoPE Campus Salgueiro.</p><a className="button button--light" href="https://cimhub.com.br/" target="_blank" rel="noopener noreferrer">Conheça o CIM <ExternalLink aria-hidden="true" /></a></div><div className="ecosystem-card"><Boxes aria-hidden="true" /><h3>Conexão com laboratórios.</h3><p>Quando o projeto exige desenvolvimento técnico, a incubadora orienta o acesso às estruturas adequadas do ecossistema.</p><p className="ecosystem-card__note">Uso sujeito ao perfil do projeto, à agenda e às normas de cada espaço.</p></div></div></section>

    <section className="section content" id="conteudos" aria-labelledby="content-title"><div className="container"><div className="section-heading section-heading--split"><div><p className="eyebrow">Ecossistema em movimento</p><h2 id="content-title">Projetos, notícias e encontros.</h2></div><p>Acompanhe as iniciativas apoiadas e o que acontece na comunidade Sertão Maker.</p></div><div className="content-grid content-grid--two"><article><span>PORTFÓLIO</span><Rocket aria-hidden="true" /><h3>Startups e projetos</h3><p>Conheça soluções que nascem e crescem no território.</p><Link className="text-link" href="/startups">Ver projetos <ArrowRight aria-hidden="true" /></Link></article><article><span>CONTEÚDOS E AGENDA</span><Sparkles aria-hidden="true" /><h3>Novidades do ecossistema</h3><p>Notícias, eventos, chamadas e histórias da incubadora.</p><Link className="text-link" href="/conteudos">Ver conteúdos <ArrowRight aria-hidden="true" /></Link></article></div></div></section>

    <section className="section partners" id="parceiros" aria-labelledby="partners-title"><div className="container partners__inner"><Handshake aria-hidden="true" /><div><p className="eyebrow">Parcerias</p><h2 id="partners-title">Inovação se constrói em rede.</h2><p>A Sertão Maker conecta ensino, empresas, governo, especialistas e organizações comprometidas com o desenvolvimento regional.</p></div><a className="text-link" href="#contato">Seja parceiro <ArrowRight aria-hidden="true" /></a></div></section>

    <section className="section faq" id="faq" aria-labelledby="faq-title"><div className="container faq-grid"><div><p className="eyebrow">Perguntas frequentes</p><h2 id="faq-title">O que você precisa saber.</h2></div><div>{faqs.map(([pergunta, resposta]) => <details key={pergunta}><summary>{pergunta}<ChevronDown aria-hidden="true" /></summary><p>{resposta}</p></details>)}</div></div></section>

    <section className="final-cta" id="contato" aria-labelledby="contact-title"><div className="container"><p className="eyebrow eyebrow--light">Dê o próximo passo</p><h2 id="contact-title">Sua ideia pode ser o começo de algo maior.</h2><p>Acompanhe editais e chamadas do SerTão Inovador ou fale com a equipe da incubadora.</p><div><Link className="button button--light" href="/oportunidades">Ver oportunidades <ArrowRight aria-hidden="true" /></Link><Link className="button button--outline-light" href="/contato">Fale com a Sertão Maker</Link></div></div></section>
  </main>;
}
