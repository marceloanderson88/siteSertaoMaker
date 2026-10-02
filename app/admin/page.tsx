import type { Metadata } from "next";
import { NewsAdmin } from "@/components/admin/news-admin";
import { adminConfigured, authenticated } from "@/lib/admin-auth";
import { readContent } from "@/lib/cms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Painel editorial | Sertão Maker", robots: { index: false, follow: false } };
export default async function Page() {
  const loggedIn = await authenticated();
  let initial = null;
  if (loggedIn) { try { initial = await readContent(); } catch { /* The panel offers a retry when storage is temporarily unavailable. */ } }
  return <main className="admin-page"><div className="container"><p className="eyebrow">Sertão Maker · Equipe</p><h1>Painel editorial</h1><p>Publique notícias, oportunidades e atualizações para a comunidade.</p><NewsAdmin initial={initial} loggedIn={loggedIn} configured={adminConfigured()} /></div></main>;
}
