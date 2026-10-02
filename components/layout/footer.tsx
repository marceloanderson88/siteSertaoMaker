import Link from "next/link";

const footerLinks = [["SerTão Inovador", "/sertao-inovador"], ["Pré-incubação", "/sertao-inovador/pre-incubacao"], ["Incubação", "/sertao-inovador/incubacao"], ["Startups", "/startups"], ["Oportunidades", "/oportunidades"], ["Conteúdos", "/conteudos"], ["Sobre", "/sobre"], ["Contato", "/contato"]];

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><p className="footer-brand">Incubadora Sertão Maker</p><p>Centro de Inovação Maker — CIM<br />IFSertãoPE Campus Salgueiro</p></div><nav aria-label="Links do rodapé">{footerLinks.map(([label, href]) => <Link href={href} key={`${label}-${href}`}>{label}</Link>)}</nav><div><p className="footer-title">Ecossistema</p><a href="https://cimhub.com.br/" target="_blank" rel="noopener noreferrer">Centro de Inovação Maker ↗</a><p className="footer-note">Ideias encontram método.<br />Projetos encontram caminhos.</p></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} Incubadora Sertão Maker</p><Link href="/">Voltar ao início ↑</Link></div></footer>;
}
