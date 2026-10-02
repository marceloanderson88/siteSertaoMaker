import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content/content-page";
import { guides } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  if (!guide) notFound();
  return { title: `${guide.title} | Sertão Maker`, description: guide.intro };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  if (!guide) notFound();
  return <ContentPage eyebrow={`${guide.category} · leitura de ${guide.readTime}`} title={guide.title} intro={guide.intro} blocks={[]}
    cta={{ title: "Conecte esse aprendizado ao seu projeto.", label: "Conhecer os programas", href: "/sertao-inovador" }}>
    <article className="container reading-page">
      <p className="source-note">Guia da Sertão Maker · publicado em <time dateTime="2026-10-02">2 de outubro de 2026</time></p>
      {guide.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
      <p className="reading-next"><Link className="text-link" href="/oportunidades">Consultar editais e requisitos →</Link></p>
      <Link className="text-link" href="/conteudos">← Voltar aos guias e novidades</Link>
    </article>
  </ContentPage>;
}
