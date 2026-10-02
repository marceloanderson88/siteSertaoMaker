import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { preIncubationFaq, sources } from "@/lib/site-content";

export const metadata: Metadata = { title: "Pré-incubação | SerTão Inovador", description: "Entenda os requisitos, atividades, duração e compromissos da Pré-incubação SerTão Inovador 2026.2." };

export default function Page() {
  return <ContentPage eyebrow="SerTão Inovador · edição 2026.2" title="Da ideia a uma proposta testável" intro="A pré-incubação ajuda você a compreender o problema, conversar com o público e testar a solução antes de ampliar o investimento."
    blocks={[
      { title: "Para quem é", text: "Projetos inovadores em ideação ou validação, representados por pessoas maiores de idade residentes em Pernambuco. Não é necessário ter CNPJ ou vínculo com o IFSertãoPE.", link: { label: "Conferir requisitos completos e reserva de vagas", href: "/oportunidades" } },
      { title: "Formato, duração e custo", text: "O ciclo 2026.2 prevê cerca de oito semanas de capacitação, preferencialmente remota, com possíveis encontros presenciais em comum acordo. As atividades são gratuitas e não exigem participação societária.", items: ["Internet e deslocamentos pessoais ficam a cargo do participante", "Calendário detalhado informado aos selecionados", "Dedicação a formações, mentorias, testes e entregas", "O edital não define uma carga horária semanal fixa"] },
      { title: "O que você vai desenvolver", text: "Uma proposta sustentada por evidências do público e por um plano de próximos passos.", items: ["Problema: a dificuldade que a iniciativa busca resolver", "Público: quem vive essa dificuldade", "Proposta de valor: o benefício da solução", "Protótipo ou MVP: uma versão simples para testar hipóteses", "Modelo de negócio: como entregar valor e sustentar a iniciativa"], link: { label: "Ler o guia para quem tem uma ideia", href: "/conteudos/tenho-uma-ideia" } },
      { title: "Entregas e compromissos", text: "A participação inclui atividades práticas, diagnóstico de maturidade quando solicitado e apresentação do projeto no Demoday, encontro com uma banca e atores do ecossistema.", items: ["Firmar o contrato após a convocação", "Cumprir o plano de atividades e as entregas solicitadas", "Acompanhar o e-mail cadastrado", "Responder às pesquisas de acompanhamento após o programa"], link: { label: "Ler atividades e obrigações no edital (PDF)", href: sources.preRegulation } },
      { title: "Como acontece a seleção", text: "A avaliação considera equipe, problema ou mercado, solução e proposta de valor e inovação. É preciso atingir a nota mínima e respeitar as regras de classificação.", link: { label: "Preparar uma proposta clara", href: "/conteudos/prepare-sua-proposta" } },
      { title: "Depois da pré-incubação", text: "Quem cumpre as atividades obrigatórias recebe a qualificação de projeto pré-incubado. A entrada na incubação depende de maturidade, vagas e edital específico; não é automática.", link: { label: "Entender a etapa de incubação", href: "/sertao-inovador/incubacao" } },
    ]}
    cta={{ title: "Confira o prazo e as regras desta edição.", label: "Ver edital e cronograma", href: "/oportunidades" }}>
    <section className="container content-section" aria-labelledby="pre-faq-title"><p className="eyebrow">Antes de participar</p><h2 id="pre-faq-title">Perguntas frequentes</h2><div className="editorial-faq">{preIncubationFaq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><p className="source-note">Informações da edição 2026.2. <a href={sources.preIncubation}>O edital e as retificações são a referência para participação.</a></p></section>
  </ContentPage>;
}
