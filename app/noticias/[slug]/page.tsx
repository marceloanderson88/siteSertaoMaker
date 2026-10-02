import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content/content-page";
import { ShareActions } from "@/components/content/share-actions";
import { formatDate, newsStatus } from "@/lib/news";
import { getPublishedNews } from "@/lib/cms";
import { siteUrl } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPublishedNews()).find(item => item.slug === slug);
  if (!post) notFound();
  const url = `${siteUrl}/noticias/${post.slug}`;
  const image = `${siteUrl}/hero-faixa-ubo4.png`;
  return {
    title: `${post.title} | Sertão Maker`, description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url, siteName: "Sertão Maker", locale: "pt_BR", publishedTime: post.publishedAt, images: [{ url: image, alt: "Sertão Maker: inovação a partir do território" }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = (await getPublishedNews()).find(item => item.slug === slug);
  if (!post) notFound();
  const status = newsStatus(post);
  return <ContentPage eyebrow={post.category} title={post.title} intro={post.excerpt} blocks={[]}
    cta={{ title: "Explore os próximos passos desta publicação.", label: post.actionLabel, href: post.actionHref }}>
    <article className="container reading-page">
      <p className="source-note">Sertão Maker · Publicado em <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></p>
      {status && <p><span className="status-label status-label--neutral">{status}</span></p>}
      <ShareActions title={post.title} path={`/noticias/${post.slug}`} />
      {post.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
      <p className="source-note">Fonte: <a href={post.source} target="_blank" rel="noopener noreferrer">{post.sourceLabel} ↗</a></p>
      <p className="reading-next"><Link className="text-link" href="/noticias">← Voltar às notícias e oportunidades</Link></p>
    </article>
  </ContentPage>;
}
