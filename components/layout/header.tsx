import Image from "next/image";
import Link from "next/link";

const links = [["SerTão Inovador", "/sertao-inovador"], ["Startups", "/startups"], ["Oportunidades", "/oportunidades"], ["Conteúdos", "/conteudos"], ["Sobre", "/sobre"], ["Contato", "/contato"]];

export function Header() {
  return <header className="site-header"><div className="site-header__content">
    <Link className="brand" href="/" aria-label="Incubadora Sertão Maker — início"><Image src="/logo-sertao-maker.png" alt="Incubadora Sertão Maker" width={210} height={68} className="brand__logo" /></Link>
    <nav aria-label="Navegação principal"><Link href="/">Início</Link>{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/oportunidades">Quero participar <span aria-hidden="true">→</span></Link>
    <details className="mobile-menu"><summary aria-label="Abrir menu"><span /><span /><span /></summary><div>{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}<Link href="/oportunidades">Quero participar</Link></div></details>
  </div></header>;
}
