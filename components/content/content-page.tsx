import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Block = { title: string; text: string; items?: string[] };

export function ContentPage({ eyebrow, title, intro, blocks, children }: { eyebrow: string; title: string; intro: string; blocks: Block[]; children?: ReactNode }) {
  return <main className="internal-page">
    <section className="internal-hero"><div className="container"><Link className="back-link" href="/"><ArrowLeft aria-hidden="true" /> Voltar ao início</Link><p className="eyebrow eyebrow--light">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section>
    <section className="internal-body"><div className="container internal-grid">{blocks.map(block => <article className="internal-card" key={block.title}><h2>{block.title}</h2><p>{block.text}</p>{block.items && <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>}</article>)}</div>{children}</section>
    <section className="internal-cta"><div className="container"><h2>Encontre o próximo passo para sua iniciativa.</h2><Link className="button button--primary" href="/contato">Fale com a Sertão Maker <ArrowRight aria-hidden="true" /></Link></div></section>
  </main>;
}
