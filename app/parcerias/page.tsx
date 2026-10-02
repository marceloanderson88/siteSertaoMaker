import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { emailLink, sources } from "@/lib/site-content";
export const metadata: Metadata = { title: "Parcerias | Sertão Maker", description: "Conheça os papéis na rede de apoio ao SerTão Inovador e proponha mentorias, desafios ou ações conjuntas." };
export default function Page() {
  return <ContentPage eyebrow="Colaboração com propósito" title="Conecte sua organização ao território" intro="Empresas, instituições e especialistas podem contribuir com conhecimento, desafios reais e oportunidades de desenvolvimento. Comece apresentando uma proposta de colaboração."
    blocks={[
      { title: "IFSertãoPE e incubadoras", text: "O IFSertãoPE realiza e executa o programa. As incubadoras ISA e Sertão Maker integram a atuação empreendedora, a organização das atividades e o acompanhamento das iniciativas.", link: { label: "Consultar a execução no edital 2026.2 (PDF)", href: sources.preRegulation } },
      { title: "CIM e infraestrutura", text: "O Centro de Inovação Maker aproxima projetos de espaços e recursos para prototipagem, testes e comunicação. A utilização depende do perfil do projeto, da agenda e das normas do espaço.", link: { label: "Conhecer infraestrutura e acesso", href: "/servicos" } },
      { title: "Rede metodológica e de apoio", text: "Na edição de 2024, a publicação oficial identifica Wadhwani Foundation no apoio metodológico, CERTI no suporte à execução e MDIC e Sebrae na realização, com apoio de outras instituições.", link: { label: "Ver instituições e papéis na edição de 2024", href: sources.network2024 }, content: <p className="source-note">Esse é um registro da edição de 2024. A composição da rede e os compromissos de cada parceiro devem ser conferidos para a edição atual.</p> },
      { title: "Mentoria e conhecimento", text: "Apresente sua experiência e os temas em que pode contribuir: mercado, gestão, tecnologia, comunicação ou outras competências relevantes para os projetos.", link: { label: "Propor colaboração como especialista", href: emailLink("Colaboração como mentor ou especialista — Sertão Maker") } },
      { title: "Desafios e ações conjuntas", text: "Sua organização pode apresentar problemas reais para discutir atividades de inovação, formação ou aproximação com iniciativas do ecossistema.", link: { label: "Apresentar um desafio ou ação", href: emailLink("Desafio ou ação conjunta — Sertão Maker") } },
      { title: "Como construir a parceria", text: "Envie o objetivo, a organização responsável, a contribuição proposta e o período de interesse. A equipe avaliará a viabilidade e o encaminhamento institucional.", items: ["Definição do objetivo e dos participantes", "Análise de recursos, responsabilidades e condições", "Formalização aplicável antes de assumir compromissos"], link: { label: "Enviar proposta de parceria", href: emailLink("Proposta de parceria — Sertão Maker") } },
    ]}
    cta={{ title: "Que contribuição sua organização pode trazer?", label: "Conversar sobre parceria", href: emailLink("Proposta de parceria — Sertão Maker") }} />;
}
