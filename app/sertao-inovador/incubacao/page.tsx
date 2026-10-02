import Link from "next/link";
import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { BenefitsSection } from "@/components/content/benefits-section";
import { emailLink, sources } from "@/lib/site-content";

export const metadata: Metadata = { title: "Incubação | SerTão Inovador", description: "Apoio para negócios em validação ou operação inicial: diagnóstico, mentorias, gestão e próximos passos." };

export default function Page() {
  return <ContentPage eyebrow="SerTão Inovador · desenvolvimento do negócio" title="Organize seu negócio para avançar" intro="A incubação acompanha iniciativas em validação ou operação inicial que precisam fortalecer a solução, a gestão e sua relação com o mercado."
    blocks={[
      { title: "Qual estágio faz sentido", text: "Você já realizou testes, tem evidências sobre o público ou iniciou a operação e precisa organizar as prioridades do negócio. MVP é uma versão simples da solução usada para testar hipóteses com usuários.", link: { label: "Comparar pré-incubação e incubação", href: "/conteudos/pre-incubacao-ou-incubacao" } },
      { title: "Referência da edição 2025/2026", text: "O regulamento do edital nº 191/2025 contempla projetos em validação ou operação/tração, com responsável maior de idade residente em Pernambuco. O CNPJ não é obrigatório nessa edição.", items: ["Formato remoto, com possíveis encontros presenciais em comum acordo", "Previsão geral de 12 meses no regulamento", "Graduação definida conforme diagnóstico de maturidade", "Confira alterações e condições específicas antes de solicitar ingresso"], link: { label: "Consultar regulamento da edição (PDF)", href: sources.incubationRegulation } },
      { title: "O que será trabalhado", text: "O acompanhamento orienta decisões sobre o negócio, com atividades definidas para as necessidades da iniciativa.", items: ["Diagnóstico e prioridades de desenvolvimento", "Validação da solução com clientes", "Estratégia, posicionamento e modelo de negócio", "Organização da operação e indicadores", "Preparação para apresentar o negócio a parceiros"] },
      { title: "Custo e compromissos", text: "As atividades previstas na edição 2025/2026 são gratuitas. Internet, deslocamentos e despesas pessoais são de responsabilidade dos participantes. Reserve tempo para mentorias, atividades e acompanhamento.", items: ["Apresente evidências e resultados já obtidos", "Mantenha os dados e canais da equipe atualizados", "Cumpra as entregas, o diagnóstico de maturidade e a apresentação no Demoday", "Responda às pesquisas de acompanhamento previstas após o ciclo", "Confira o calendário e as obrigações no regulamento aplicável"], link: { label: "Pedir orientação sobre ingresso", href: emailLink("Orientação para incubação — SerTão Inovador") } },
      { title: "Infraestrutura e conexões", text: "Necessidades de prototipagem, laboratórios e apoio especializado são analisadas caso a caso. Acesso, agenda e eventuais instrumentos de parceria precisam ser combinados previamente.", link: { label: "Conhecer os apoios e como solicitar", href: "/servicos" } },
      { title: "Da pré-incubação à incubação", text: "Concluir a pré-incubação permite pleitear ingresso; a decisão depende de diagnóstico, vagas e seleção específica. O apoio à captação e às conexões não representa promessa de investimento ou de vendas.", link: { label: "Acompanhar chamadas e documentos", href: "/oportunidades" } },
    ]}
    cta={{ title: "Compartilhe o estágio e os desafios do seu negócio.", label: "Conversar sobre incubação", href: emailLink("Orientação para incubação — SerTão Inovador") }}>
    <section className="container content-section"><p className="eyebrow">Ciclo 2026.1</p><h2>28 startups aprovadas para incubação.</h2><p>O resultado final da seleção conjunta das incubadoras ISA e Sertão Maker foi publicado em 27 de janeiro de 2026.</p><Link className="text-link" href="/startups#ciclo-2026-1">Conhecer as startups aprovadas →</Link><p className="source-note"><a href={sources.incubationResult}>Consultar resultado final (PDF)</a></p></section>
    <BenefitsSection />
  </ContentPage>;
}
