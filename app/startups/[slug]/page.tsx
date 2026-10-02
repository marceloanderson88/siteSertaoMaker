import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content/content-page";
import { cases, emailLink } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return cases.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = cases.find(item => item.slug === slug);
  if (!project) notFound();
  return { title: `${project.name} | Projetos Sertão Maker`, description: project.summary };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = cases.find(item => item.slug === slug);
  if (!project) notFound();
  return <ContentPage eyebrow={`${project.category} · ${project.period}`} title={project.name} intro={project.summary}
    blocks={[
      { title: "Problema e público", text: project.problem },
      { title: "A proposta", text: project.solution },
      { title: "Relação com a incubadora", text: project.support },
      { title: "Conquista registrada", text: project.result, link: { label: "Consultar a fonte institucional", href: project.source } },
    ]}
    cta={{ title: "Você representa este projeto?", label: "Enviar informações atualizadas", href: emailLink(`Atualização de portfólio — ${project.name}`) }}>
    <div className="container content-section"><p className="source-note">Registro histórico baseado em publicação institucional. Não confirma vínculo atual com a incubadora ou resultados comerciais posteriores.</p><Link className="text-link" href="/startups">← Ver todos os registros e projetos</Link></div>
  </ContentPage>;
}
