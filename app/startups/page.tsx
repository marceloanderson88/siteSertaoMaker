import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content/content-page";
import { cases, emailLink, selected2023, sources } from "@/lib/site-content";
export const metadata: Metadata = { title: "Projetos e resultados | Sertão Maker", description: "Conheça registros de projetos e conquistas ligados à Incubadora Sertão Maker, com período e fontes institucionais." };
export default function Page() {
  return <ContentPage eyebrow="Projetos e resultados" title="Ideias que já encontraram caminhos" intro="Conheça experiências documentadas da incubadora e do Campus Salgueiro. Cada registro informa seu período e a fonte; a participação histórica não indica vínculo atual."
    blocks={[]}
    cta={{ title: "Seu projeto tem uma história para compartilhar?", label: "Enviar atualização do projeto", href: emailLink("Atualização de projeto para o portfólio — Sertão Maker") }}>
    <section className="container content-section content-section--first" aria-labelledby="cases-title"><p className="eyebrow">Experiências documentadas</p><h2 id="cases-title">Projetos em destaque</h2><div className="editorial-grid">{cases.map(item => <article className="editorial-card" key={item.slug}><span className="status-label status-label--neutral">{item.period}</span><p className="eyebrow">{item.category}</p><h3>{item.name}</h3><p>{item.summary}</p><p className="case-result">{item.result}</p><Link className="text-link" href={"/startups/" + item.slug}>Conhecer o registro →</Link></article>)}</div></section>
    <section className="container content-section" aria-labelledby="selection-title"><p className="eyebrow">Seleção de 2023</p><h2 id="selection-title">Iniciativas relacionadas no resultado oficial</h2><p>O documento de 23 de janeiro de 2023 lista {selected2023.length} iniciativas selecionadas para o processo de incubação. Consulte a fonte para conhecer o contexto.</p><ul className="project-list">{selected2023.map(name => <li key={name}>{name}</li>)}</ul><a className="text-link" href={sources.selection2023}>Ver resultado da etapa 2 (PDF) →</a></section>
  </ContentPage>;
}
