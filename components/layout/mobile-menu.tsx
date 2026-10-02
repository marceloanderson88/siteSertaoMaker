"use client";

import Link from "next/link";
import { useRef } from "react";

export function MobileMenu({ links }: { links: string[][] }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return <details ref={menu} className="mobile-menu">
    <summary aria-label="Abrir menu" role="button"><span /><span /><span /></summary>
    <div onClick={event => {
      if ((event.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
    }}>
      <Link href="/">Início</Link>
      {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      <Link href="/parcerias">Parcerias</Link>
      <Link href="/oportunidades">Editais e resultados</Link>
    </div>
  </details>;
}
