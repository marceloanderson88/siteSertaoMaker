import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Action = { label: string; href: string };
type Block = { title: string; text: string; items?: string[]; link?: Action; content?: ReactNode; id?: string };

export function ContentPage({ eyebrow, title, intro, blocks, children, cta = { title: "Converse sobre o próximo passo da sua iniciativa.", label: "Fale com a Sertão Maker", href: "/contato" } }: { eyebrow: string; title: string; intro: string; blocks: Block[]; children?: ReactNode; cta?: Action & { title: string } }) {
  return <main className="internal-page">
    <section className="internal-hero"><div className="container"><Link className="back-link" href="/"><ArrowLeft aria-hidden="true" /> Voltar ao início</Link><p className="eyebrow eyebrow--light">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section>
    <section className="internal-body"><div className="container internal-grid">{blocks.map(block => <article className="internal-card" key={block.title} id={block.id}><h2>{block.title}</h2><p>{block.text}</p>{block.items && <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>}{block.content}{block.link && <Link className="text-link card-link" href={block.link.href}>{block.link.label}<ArrowRight aria-hidden="true" /></Link>}</article>)}</div>{children}</section>
    <section className="internal-cta"><div className="container"><h2>{cta.title}</h2><Link className="button button--primary" href={cta.href}>{cta.label}<ArrowRight aria-hidden="true" /></Link></div></section>
  </main>;
}
