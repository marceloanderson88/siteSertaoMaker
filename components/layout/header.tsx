import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

const links = [["SerTão Inovador", "/sertao-inovador"], ["Projetos", "/startups"], ["Serviços", "/servicos"], ["Oportunidades", "/oportunidades"], ["Notícias", "/noticias"], ["Guias", "/conteudos"], ["Sobre", "/sobre"], ["Contato", "/contato"]];

export function Header() {
  return <header className="site-header"><div className="site-header__content">
    <Link className="brand" href="/" aria-label="Incubadora Sertão Maker — início"><Image src="/logo-sertao-maker.png" alt="Incubadora Sertão Maker" width={210} height={68} className="brand__logo" /></Link>
    <nav aria-label="Navegação principal"><Link href="/">Início</Link>{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/oportunidades">Editais e resultados <span aria-hidden="true">→</span></Link>
    <MobileMenu links={links} />
  </div></header>;
}
