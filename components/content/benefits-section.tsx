import Link from "next/link";
import { ArrowRight, Cloud } from "lucide-react";
import { benefits, emailLink } from "@/lib/site-content";

export function BenefitsSection({ id = "beneficios" }: { id?: string }) {
  const [aws, ...otherBenefits] = benefits;
  return <section className="benefits-section" id={id} aria-labelledby={`${id}-title`}>
    <div className="container">
      <div className="section-heading section-heading--split"><div><p className="eyebrow">Apoios para desenvolver seu negócio</p><h2 id={`${id}-title`}>Benefícios que ampliam suas possibilidades.</h2></div><p>Combine acompanhamento, formação e infraestrutura com oportunidades oferecidas pela rede. A equipe orienta quais benefícios se aplicam ao estágio do seu projeto.</p></div>
      <article className="aws-benefit"><div><Cloud aria-hidden="true" /><p className="eyebrow">Possibilidade de créditos em nuvem</p><h3>{aws.title}</h3></div><div><p>{aws.text}</p><div className="content-actions"><a className="button button--light" href={emailLink("Créditos AWS até US$ 5 mil — Sertão Maker")}>Consultar minha elegibilidade <ArrowRight aria-hidden="true" /></a><a className="text-link" href={aws.href} target="_blank" rel="noopener noreferrer">{aws.action} ↗</a></div></div></article>
      <div className="benefits-grid">{otherBenefits.map(item => <article key={item.title}><p className="eyebrow">{item.tag}</p><h3>{item.title}</h3><p>{item.text}</p><Link className="text-link" href={item.href}>{item.action} <ArrowRight aria-hidden="true" /></Link></article>)}</div>
      <p className="source-note">Benefícios de terceiros dependem de elegibilidade, disponibilidade e regras próprias. Créditos AWS são destinados a serviços elegíveis de nuvem; o valor aprovado e a validade são definidos na concessão.</p>
    </div>
  </section>;
}
