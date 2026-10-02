import Image from "next/image";
import Link from "next/link";
import { CycleSummary } from "@/components/content/cycle-summary";
import { featuredStartups } from "@/lib/site-content";
import { BenefitsSection } from "@/components/content/benefits-section";
import { SocialLinks } from "@/components/content/social-links";
import { NewsCard } from "@/components/content/news-card";
import { getPublishedNews } from "@/lib/cms";
import { newsPreviews } from "@/lib/news";

export const dynamic = "force-dynamic";
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
  { Icone: CircuitBoard, titulo: "Prototipagem e soluções", itens: ["Orientação para protótipos e testes", "Consulta de acesso à impressão 3D", "IoT: sensores e automação", "Testes com versões simples da solução"] },
  { Icone: Building2, titulo: "Espaços e infraestrutura", itens: ["Ambientes de inovação", "Laboratórios e equipamentos", "Espaços para reuniões e eventos", "Ambientes colaborativos"] },
  { Icone: Network, titulo: "Mercado e conexões", itens: ["Networking e parceiros", "Orientação para propostas de financiamento", "Encaminhamento em propriedade intelectual", "Apresentação do negócio e eventos"] },
];
const faqs = [
  ["O que é a Sertão Maker?", "É uma incubadora instalada no Centro de Inovação Maker do IFSertãoPE Campus Salgueiro, dedicada ao desenvolvimento de ideias e negócios inovadores."],
  ["O que é o SerTão Inovador?", "É o programa principal da incubadora. Ele organiza o apoio aos participantes em dois ciclos complementares: Pré-incubação e Incubação."],
  ["Qual a diferença entre Pré-incubação e Incubação?", "A Pré-incubação ajuda a validar uma ideia e estruturar a proposta de negócio. A Incubação fortalece soluções ou negócios que já avançaram nessa validação."],
  ["Posso participar apenas com uma ideia?", "Sim. Pessoas e equipes em estágio inicial podem encontrar na Pré-incubação o caminho mais adequado, conforme as regras de cada edital."],
  ["Posso utilizar os laboratórios?", "Participantes podem ser conectados à infraestrutura disponível conforme as necessidades do projeto, a agenda, as normas e as regras de utilização."],
  ["Como faço para participar?", "Confira requisitos, prazo atualizado e formulário oficial na página de oportunidades. Se o prazo de uma edição já tiver terminado, acompanhe os resultados e fale com a incubadora sobre os próximos ciclos."],
];

export default async function Home() {
  const posts = newsPreviews(await getPublishedNews()).slice(0, 3);
  return <main>
    <section className="hero" aria-labelledby="hero-title">
      <Image src="/hero-faixa-ubo4.png" alt="Paisagem do Sertão ao pôr do sol com uma pessoa observando o horizonte" fill preload sizes="100vw" className="hero__background" />
      <Image src="/hero-linhas.png" alt="" width={3840} height={2160} className="hero__overlay hero__overlay--lines" aria-hidden="true" />
      <Image src="/hero-assinatura.png" alt="" width={1954} height={2160} className="hero__overlay hero__overlay--signature" aria-hidden="true" />
      <div className="hero__copy"><div className="hero__copy-inner">
        <p className="eyebrow">Incubadora Sertão Maker</p>
        <h1 id="hero-title"><span className="hero-title__wine">SUA IDEIA PODE</span><span className="hero-title__wine">VIRAR UM NEGÓCIO</span><span>A PARTIR</span><span>DO SERTÃO.</span></h1>
        <p className="hero__description">No IFSertãoPE Campus Salgueiro, apoiamos o desenvolvimento de ideias e negócios inovadores com formação, mentorias e conexão com infraestrutura e parceiros. Conheça os programas e os critérios para participar.</p>
        <div className="hero__actions"><Link className="button button--primary" href="/sertao-inovador">Conheça os programas <ArrowRight aria-hidden="true" /></Link><Link className="button button--outline" href="/oportunidades">Editais e resultados</Link></div>
        <div className="hero__highlights" aria-label="Nossos compromissos">{destaques.map(({ Icone, texto }) => <div className="hero__highlight" key={texto}><Icone className="hero__highlight-icon" aria-hidden="true" /><p>{texto}</p></div>)}</div>
        <p className="hero__location"><MapPin aria-hidden="true" /> CIM <i aria-hidden="true" /> IFSertãoPE Campus Salgueiro</p>
      </div></div>
      <a className="hero__scroll" href="#sobre"><span aria-hidden="true">↓</span>Descubra mais</a>
    </section>

    <CycleSummary />

    <section className="section about" id="sobre" aria-labelledby="about-title"><div className="container section-heading section-heading--split"><div><p className="eyebrow">Sobre a Sertão Maker</p><h2 id="about-title">Formação, testes e apoio para desenvolver sua iniciativa.</h2></div><div><p>A Incubadora Sertão Maker é um ambiente de apoio ao desenvolvimento de iniciativas inovadoras, instalada no Centro de Inovação Maker — CIM, do IFSertãoPE Campus Salgueiro.</p><p>Conecta empreendedorismo, conhecimento, tecnologia e desenvolvimento regional para transformar ideias em soluções e negócios mais estruturados.</p><Link className="text-link" href="/sobre">Conheça a Sertão Maker <ArrowRight aria-hidden="true" /></Link></div></div><div className="container card-grid card-grid--four">{pilares.map(({ Icone, titulo, texto }) => <article className="feature-card" key={titulo}><Icone aria-hidden="true" /><h3>{titulo}</h3><p>{texto}</p></article>)}</div></section>

    <section className="section program" id="programa" aria-label="SerTão Inovador"><Image className="program-campaign" src="/sertao-capa-011.png" alt="SerTão Inovador — O Sertão cria, Pernambuco se conecta" width={2172} height={724} sizes="100vw" /><div className="container"><div className="program-grid">
      <article className="program-card"><span className="program-card__number">01</span><p className="program-card__label">Pré-incubação</p><h3>Valide sua ideia e construa o negócio.</h3><p>Para validar problema, público, solução e modelo.</p><ul><li>Proposta de valor</li><li>Mercado e público</li><li>Protótipo ou versão simples para testar</li><li>Modelo de negócio</li></ul><Link href="/sertao-inovador/pre-incubacao">Conheça a Pré-incubação <ArrowRight aria-hidden="true" /></Link></article>
      <article className="program-card program-card--accent"><span className="program-card__number">02</span><p className="program-card__label">Incubação</p><h3>Estruture e faça seu negócio crescer.</h3><p>Para organizar estratégia, operação e crescimento.</p><ul><li>Estratégia e gestão</li><li>Mercado e posicionamento</li><li>Inovação e tecnologia</li><li>Captação e conexões</li></ul><Link href="/sertao-inovador/incubacao">Conheça a Incubação <ArrowRight aria-hidden="true" /></Link></article>
    </div></div></section>

    <section className="section journey" id="jornada" aria-labelledby="journey-title"><div className="container"><div className="section-heading section-heading--center"><p className="eyebrow">Como funciona</p><h2 id="journey-title">Uma jornada para tirar projetos do papel.</h2><p className="section-lead">O edital vigente informa datas, regras e etapas específicas de cada edição.</p></div><ol className="journey-list">{etapas.map((etapa, index) => <li key={etapa}><span>{String(index + 1).padStart(2, "0")}</span><strong>{etapa}</strong></li>)}</ol></div></section>

    <section className="section services" id="servicos" aria-labelledby="services-title"><div className="container"><div className="section-heading section-heading--split"><div><p className="eyebrow">Apoio ao desenvolvimento</p><h2 id="services-title">Recursos para transformar projetos em negócios.</h2></div><p>Conheça o apoio dos programas e as possibilidades no CIM. Uso de espaços, equipamentos e apoios externos depende de avaliação, agenda e condições específicas.</p></div><div className="services-grid">{servicos.map(({ Icone, titulo, itens }) => <article className="service-card" key={titulo}><Icone aria-hidden="true" /><h3>{titulo}</h3><ul>{itens.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></article>)}</div><p className="content-actions"><Link className="text-link" href="/servicos">Ver apoios, condições e como solicitar <ArrowRight aria-hidden="true" /></Link></p></div></section>

    <BenefitsSection />

    <section className="section ecosystem" id="cim" aria-labelledby="ecosystem-title"><div className="container ecosystem-grid"><div><p className="eyebrow eyebrow--light">Integração institucional</p><h2 id="ecosystem-title">A Sertão Maker faz parte do CIM.</h2><p>A incubadora atua conectada ao ambiente de inovação do IFSertãoPE Campus Salgueiro.</p><a className="button button--light" href="https://cimhub.com.br/" target="_blank" rel="noopener noreferrer">Conheça o CIM <ExternalLink aria-hidden="true" /></a></div><div className="ecosystem-card"><Boxes aria-hidden="true" /><h3>Conexão com laboratórios.</h3><p>Quando o projeto exige desenvolvimento técnico, a incubadora orienta o acesso às estruturas adequadas do ecossistema.</p><p className="ecosystem-card__note">Uso sujeito ao perfil do projeto, à agenda e às normas de cada espaço.</p></div></div></section>

    <section className="section content" id="conteudos" aria-labelledby="content-title"><div className="container"><div className="section-heading section-heading--split"><div><p className="eyebrow">Ecossistema em movimento</p><h2 id="content-title">Projetos reais e guias para começar.</h2></div><p>Conheça experiências documentadas e encontre orientações para desenvolver sua iniciativa.</p></div><div className="content-grid content-grid--two"><article><span>PORTFÓLIO</span><Rocket aria-hidden="true" /><h3>Startups e projetos</h3><p>Conheça projetos, conquistas e registros históricos, com período e fonte institucional.</p><Link className="text-link" href="/startups">Ver projetos <ArrowRight aria-hidden="true" /></Link></article><article><span>CONTEÚDOS E AGENDA</span><Sparkles aria-hidden="true" /><h3>Guias e novidades</h3><p>Primeiros passos, validação de soluções, preparação de propostas e agenda do programa.</p><Link className="text-link" href="/conteudos">Ver conteúdos <ArrowRight aria-hidden="true" /></Link></article></div></div></section>

    <section className="section partners" id="parceiros" aria-labelledby="partners-title"><div className="container partners__inner"><Handshake aria-hidden="true" /><div><p className="eyebrow">Parcerias</p><h2 id="partners-title">Inovação se constrói em rede.</h2><p>A Sertão Maker conecta ensino, empresas, governo, especialistas e organizações comprometidas com o desenvolvimento regional.</p></div><Link className="text-link" href="/parcerias">Conheça a rede e proponha uma parceria <ArrowRight aria-hidden="true" /></Link></div></section>

    <section className="section" aria-labelledby="home-results-title"><div className="container"><div className="section-heading section-heading--split"><div><p className="eyebrow">Aprovadas para incubação · 2026.1</p><h2 id="home-results-title">Novos negócios, novos caminhos.</h2></div><p>A seleção mais recente do SerTão Inovador reúne 28 startups aprovadas no resultado final. Conheça alguns nomes desse ciclo.</p></div><div className="startup-grid">{featuredStartups.slice(0, 3).map(name => <article key={name}><p className="eyebrow">Ciclo 2026.1</p><h3>{name}</h3><p>Aprovada no resultado final de incubação.</p><Link className="text-link" href="/startups#ciclo-2026-1">Conhecer a seleção →</Link></article>)}</div><p className="source-note">Seleção conjunta das incubadoras ISA e Sertão Maker. Consulte o resultado e o contexto na página de projetos.</p><Link className="text-link" href="/startups#ciclo-2026-1">Ver as 28 startups e o resultado oficial →</Link></div></section>

    <section className="section home-news" aria-labelledby="home-news-title"><div className="container"><div className="section-heading section-heading--split"><div><p className="eyebrow">Oportunidades que circulam</p><h2 id="home-news-title">Novidades para dar o próximo passo.</h2></div><Link className="text-link" href="/noticias">Ver todas as publicações →</Link></div><div className="news-grid">{posts.map(post => <NewsCard post={post} key={post.slug} />)}</div><div className="community-band"><div><h3>A inovação também acontece na conversa.</h3><p>Siga o Instagram e participe da comunidade Sertão Maker.</p></div><SocialLinks /></div></div></section>

    <section className="section faq" id="faq" aria-labelledby="faq-title"><div className="container faq-grid"><div><p className="eyebrow">Perguntas frequentes</p><h2 id="faq-title">O que você precisa saber.</h2></div><div>{faqs.map(([pergunta, resposta]) => <details key={pergunta}><summary>{pergunta}<ChevronDown aria-hidden="true" /></summary><p>{resposta}</p></details>)}</div></div></section>

    <section className="final-cta" id="contato" aria-labelledby="contact-title"><div className="container"><p className="eyebrow eyebrow--light">Dê o próximo passo</p><h2 id="contact-title">Sua ideia pode ser o começo de algo maior.</h2><p>Acompanhe editais e chamadas do SerTão Inovador ou fale com a equipe da incubadora.</p><div><Link className="button button--light" href="/oportunidades">Ver oportunidades <ArrowRight aria-hidden="true" /></Link><Link className="button button--outline-light" href="/contato">Fale com a Sertão Maker</Link></div></div></section>
  </main>;
}
