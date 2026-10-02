import Link from "next/link";
import { contact, emailLink } from "@/lib/site-content";
import { SocialLinks } from "@/components/content/social-links";

const footerLinks = [["SerTão Inovador", "/sertao-inovador"], ["Pré-incubação", "/sertao-inovador/pre-incubacao"], ["Incubação", "/sertao-inovador/incubacao"], ["Projetos e resultados", "/startups"], ["Serviços", "/servicos"], ["Parcerias", "/parcerias"], ["Oportunidades", "/oportunidades"], ["Notícias e oportunidades", "/noticias"], ["Guias", "/conteudos"], ["Sobre", "/sobre"], ["Contato", "/contato"]];

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><p className="footer-brand">Incubadora Sertão Maker</p><p>Centro de Inovação Maker — CIM<br />IFSertãoPE Campus Salgueiro</p><p className="footer-note">{contact.address}</p></div><nav aria-label="Links do rodapé">{footerLinks.map(([label, href]) => <Link href={href} key={`${label}-${href}`}>{label}</Link>)}</nav><div><p className="footer-title">Fale com a incubadora</p><a href={emailLink("Contato pelo site — Sertão Maker")}>{contact.email}</a><p className="footer-note">Agende previamente sua visita.</p><Link href="/parcerias">Mentorias, desafios e parcerias →</Link><SocialLinks /></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} Incubadora Sertão Maker</p><Link href="/">Voltar ao início ↑</Link></div></footer>;
}
