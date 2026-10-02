"use client";

import { useState } from "react";
import type { NewsPreview } from "@/lib/news";
import { NewsCard } from "./news-card";

function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function NewsCatalog({ posts }: { posts: NewsPreview[] }) {
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");
  const categories = ["Todas", ...new Set(posts.map(post => post.category))];
  const normalizedQuery = normalize(query.trim());
  const filtered = posts.filter(post => (category === "Todas" || category === post.category) && normalize(`${post.title} ${post.excerpt} ${post.category}`).includes(normalizedQuery));

  return <div>
    <div className="news-tools"><label htmlFor="news-search">Buscar notícias e oportunidades<input id="news-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Busque por assunto ou palavra" /></label><div className="news-filters" role="group" aria-label="Filtrar por categoria">{categories.map(item => <button type="button" key={item} aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
    <p className="news-count" role="status">{filtered.length} {filtered.length === 1 ? "publicação encontrada" : "publicações encontradas"}</p>
    {filtered.length ? <div className="editorial-grid">{filtered.map(post => <NewsCard post={post} key={post.slug} />)}</div> : <div className="news-empty"><h3>Nenhuma publicação encontrada</h3><p>Tente outro assunto ou volte a Todas.</p><button type="button" onClick={() => { setCategory("Todas"); setQuery(""); }}>Limpar filtros</button></div>}
  </div>;
}
