import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { NewsCatalog } from "@/components/content/news-catalog";
import { SocialLinks } from "@/components/content/social-links";
import { newsPreviews } from "@/lib/news";
import { getPublishedNews } from "@/lib/cms";
import { emailLink } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notícias e oportunidades | Sertão Maker", description: "Editais, resultados, eventos e benefícios da Sertão Maker. Leia as publicações e compartilhe com sua rede." };

export default async function Page() {
  const posts = await getPublishedNews();
  return <ContentPage eyebrow="O ecossistema em movimento" title="Notícias e oportunidades" intro="Acompanhe editais, resultados e atividades da rede. Encontre uma oportunidade e compartilhe com quem pode dar o próximo passo."
    blocks={[]} cta={{ title: "Tem uma oportunidade para divulgar?", label: "Enviar pauta à incubadora", href: emailLink("Pauta ou oportunidade para divulgação — Sertão Maker") }}>
    <section className="container content-section content-section--first" aria-label="Publicações"><NewsCatalog posts={newsPreviews(posts)} /></section>
    <section className="container content-section"><h2>Continue conectado à comunidade.</h2><p>Acompanhe o Instagram e participe das conversas sobre empreendedorismo, tecnologia e oportunidades.</p><SocialLinks /></section>
  </ContentPage>;
}
