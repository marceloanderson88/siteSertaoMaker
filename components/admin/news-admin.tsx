"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { EditorialContent, ManagedPost } from "@/lib/cms";

type Snapshot = { content: EditorialContent; version: string };
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const emptyPost = (): ManagedPost => ({ slug: "", title: "", category: "Notícias", publishedAt: today(), excerpt: "", source: "", sourceLabel: "", actionHref: "/contato", actionLabel: "Falar com a incubadora", sections: [{ title: "", text: "" }], status: "draft", updatedAt: "" });
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140).replace(/-$/g, "");

export function NewsAdmin({ initial, loggedIn, configured }: { initial: Snapshot | null; loggedIn: boolean; configured: boolean }) {
  const [session, setSession] = useState(loggedIn);
  const [snapshot, setSnapshot] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [tab, setTab] = useState<"posts" | "social">("posts");
  const [post, setPost] = useState<ManagedPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [networks, setNetworks] = useState(initial?.content.social || { instagram: "", community: "" });

  async function api(path: string, options?: RequestInit) {
    const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...options?.headers }, cache: "no-store" });
    const body = await response.json();
    if (!response.ok) {
      if (response.status === 401 && path !== "/api/admin/session") setSession(false);
      throw new Error(body.error || "Não foi possível concluir a operação.");
    }
    return body;
  }
  async function refresh() {
    setBusy(true); setFeedback("");
    try { const data = await api("/api/admin/content") as Snapshot; setSnapshot(data); if (!dirty) setNetworks(data.content.social); setFeedback("Lista atualizada. O texto no formulário foi preservado."); }
    catch (error) { setFeedback((error as Error).message); }
    finally { setBusy(false); }
  }
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form);
    setBusy(true); setFeedback("");
    try {
      await api("/api/admin/session", { method: "POST", body: JSON.stringify({ email: values.get("email"), password: values.get("password") }) });
      form.reset(); setSession(true);
      const data = await api("/api/admin/content") as Snapshot; setSnapshot(data); setNetworks(data.content.social); setFeedback("Acesso autorizado.");
    } catch (error) { setFeedback((error as Error).message); }
    finally { setBusy(false); }
  }
  function abandon() { return !dirty || window.confirm("Há alterações ainda não salvas. Deseja descartá-las?"); }
  function select(item: ManagedPost | null) {
    if (!abandon()) return;
    setPost(item ? structuredClone(item) : emptyPost()); setIsNew(!item); setSlugEdited(!!item); setDirty(false); setFeedback(""); setTab("posts");
  }
  function update(key: keyof ManagedPost, value: string) { setPost(current => current && { ...current, [key]: value, ...(key === "title" && isNew && !slugEdited ? { slug: slugify(value) } : {}) }); setDirty(true); }
  async function save(status: "draft" | "published") {
    if (!post || !snapshot) return;
    setBusy(true); setFeedback("");
    try {
      const data = await api("/api/admin/content", { method: "PUT", body: JSON.stringify({ operation: "savePost", version: snapshot.version, isNew, post: { ...post, status } }) }) as Snapshot;
      setSnapshot(data); setPost(data.content.posts.find(item => item.slug === post.slug) || null); setIsNew(false); setDirty(false);
      setFeedback(status === "draft" ? "Rascunho salvo. Esta publicação não aparece no site." : post.publishedAt > today() ? "Publicação agendada para a data informada, no horário de Brasília." : "Publicação salva e disponível no site.");
    } catch (error) { setFeedback((error as Error).message); }
    finally { setBusy(false); }
  }
  async function saveNetworks(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!snapshot) return; setBusy(true); setFeedback("");
    try { const data = await api("/api/admin/content", { method: "PUT", body: JSON.stringify({ operation: "saveSocial", version: snapshot.version, social: networks }) }) as Snapshot; setSnapshot(data); setDirty(false); setFeedback("Links atualizados no site."); }
    catch (error) { setFeedback((error as Error).message); }
    finally { setBusy(false); }
  }
  async function logout() {
    if (!abandon()) return; setBusy(true);
    try { await api("/api/admin/session", { method: "DELETE" }); setSession(false); setSnapshot(null); setPost(null); setNetworks({ instagram: "", community: "" }); setDirty(false); setFeedback("Sessão encerrada."); }
    catch (error) { setFeedback((error as Error).message); }
    finally { setBusy(false); }
  }

  return <div className="admin-workspace">
    <p className="admin-feedback" role="status" aria-live="polite">{feedback}</p>
    {!session ? <form className="admin-login admin-form" onSubmit={login}><h2>Entrar no painel</h2><p>Use o acesso da equipe para gerenciar as publicações.</p>
      {!configured && <p>O acesso precisa ser configurado pelo responsável pelo site.</p>}
      <label>E-mail<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
      <label>Senha<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
      <button className="button button--primary" disabled={busy || !configured}>{busy ? "Entrando…" : "Entrar"}</button>
    </form> : <>
      <div className="admin-toolbar"><div><button className={tab === "posts" ? "active" : ""} aria-pressed={tab === "posts"} disabled={busy} onClick={() => { if (abandon()) { setTab("posts"); setDirty(false); setNetworks(snapshot?.content.social || networks); } }}>Publicações</button><button className={tab === "social" ? "active" : ""} aria-pressed={tab === "social"} disabled={busy} onClick={() => { if (abandon()) { setTab("social"); setPost(null); setDirty(false); } }}>Redes e comunidade</button></div><div><button disabled={busy} onClick={refresh}>Atualizar lista</button><button disabled={busy} onClick={logout}>Sair</button></div></div>
      {!snapshot ? <p>As publicações não puderam ser carregadas. Use “Atualizar lista” para tentar novamente.</p> : tab === "social" ? <form className="admin-form admin-networks" onSubmit={saveNetworks}><h2>Redes e comunidade</h2><p>Os links aparecem na página inicial, nas notícias e no rodapé.</p><label>Perfil do Instagram<input type="url" required value={networks.instagram} onChange={event => { setNetworks({ ...networks, instagram: event.target.value }); setDirty(true); }} /></label><label>Convite da comunidade<input type="url" placeholder="https://chat.whatsapp.com/…" value={networks.community} onChange={event => { setNetworks({ ...networks, community: event.target.value }); setDirty(true); }} /></label><p>Sem convite cadastrado, o site oferece um contato por e-mail para solicitar acesso.</p><button className="button button--primary" disabled={busy}>{busy ? "Salvando…" : "Salvar links"}</button></form> : <div className="admin-grid">
        <aside className="admin-list" aria-label="Lista de publicações"><button className="button button--primary" disabled={busy} onClick={() => select(null)}>Nova publicação</button><p>{snapshot.content.posts.length} publicações</p>{[...snapshot.content.posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(item => <button disabled={busy} className={post?.slug === item.slug ? "selected" : ""} onClick={() => select(item)} key={item.slug}><span className="eyebrow">{item.status === "draft" ? "Rascunho" : item.publishedAt > today() ? "Agendada" : "Publicada"} · {item.category}</span><strong>{item.title}</strong><span>{item.publishedAt.split("-").reverse().join("/")}</span></button>)}</aside>
        {!post ? <div className="admin-empty"><h2>Uma boa oportunidade merece circular.</h2><p>Crie uma publicação ou selecione um item da lista para editar. Você pode salvar um rascunho antes de publicar.</p></div> : <form className="admin-form admin-editor" onSubmit={event => { event.preventDefault(); void save("published"); }}>
          <div className="admin-editor-heading"><h2>{isNew ? "Nova publicação" : "Editar publicação"}</h2><span>{dirty ? "Alterações não salvas" : post.status === "draft" ? "Rascunho" : "Publicada / agendada"}</span></div>
          <label>Título<input required value={post.title} maxLength={180} onChange={event => update("title", event.target.value)} /></label>
          <label>Endereço da publicação<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={post.slug} readOnly={!isNew} maxLength={140} onChange={event => { setSlugEdited(true); update("slug", event.target.value); }} /><small>/noticias/{post.slug || "endereco-da-publicacao"}. O endereço fica fixo após salvar.</small></label>
          <div className="admin-fields"><label>Categoria<input required list="editorial-categories" maxLength={60} value={post.category} onChange={event => update("category", event.target.value)} /><datalist id="editorial-categories">{["Notícias", "Editais", "Resultados", "Eventos", "Benefícios"].map(item => <option key={item}>{item}</option>)}</datalist></label><label>Data de publicação<input required type="date" value={post.publishedAt} onChange={event => update("publishedAt", event.target.value)} /></label></div>
          <p className="source-note">Uma data futura agenda a publicação para esse dia, no horário de Brasília.</p>
          <label>Resumo<textarea rows={3} maxLength={600} value={post.excerpt} onChange={event => update("excerpt", event.target.value)} /><small>Aparece na lista e no compartilhamento.</small></label>
          <fieldset><legend>Texto da publicação</legend>{post.sections.map((section, index) => <div className="admin-section" key={index}><label>Título da seção {index + 1}<input maxLength={180} value={section.title} onChange={event => { setPost({ ...post, sections: post.sections.map((item, i) => i === index ? { ...item, title: event.target.value } : item) }); setDirty(true); }} /></label><label>Texto da seção {index + 1}<textarea rows={5} maxLength={10000} value={section.text} onChange={event => { setPost({ ...post, sections: post.sections.map((item, i) => i === index ? { ...item, text: event.target.value } : item) }); setDirty(true); }} /></label><button type="button" disabled={busy} onClick={() => { setPost({ ...post, sections: post.sections.filter((_, i) => i !== index) }); setDirty(true); }}>Remover seção {index + 1}</button></div>)}<button type="button" disabled={busy || post.sections.length >= 20} onClick={() => { setPost({ ...post, sections: [...post.sections, { title: "", text: "" }] }); setDirty(true); }}>Adicionar seção</button></fieldset>
          <div className="admin-fields"><label>Prazo da oportunidade (Brasília)<input type="datetime-local" value={post.closesAt?.slice(0, 16) || ""} onChange={event => update("closesAt", event.target.value ? `${event.target.value}-03:00` : "")} /></label><label>Data do evento (opcional)<input type="date" value={post.eventDate || ""} onChange={event => update("eventDate", event.target.value)} /></label></div>
          <label>Link da fonte oficial<input type="url" value={post.source} maxLength={2000} onChange={event => update("source", event.target.value)} /></label><label>Nome da fonte<input value={post.sourceLabel} maxLength={180} onChange={event => update("sourceLabel", event.target.value)} /></label>
          <div className="admin-fields"><label>Texto do botão<input value={post.actionLabel} maxLength={100} onChange={event => update("actionLabel", event.target.value)} /></label><label>Destino do botão<input value={post.actionHref} maxLength={2000} onChange={event => update("actionHref", event.target.value)} /><small>Caminho interno (/oportunidades) ou link com HTTPS.</small></label></div>
          <details className="admin-preview"><summary>Prévia do conteúdo</summary><h2>{post.title}</h2><p>{post.excerpt}</p>{post.sections.map((section, index) => <section key={index}><h3>{section.title}</h3><p>{section.text}</p></section>)}</details>
          <div className="admin-save"><button type="button" className="button button--outline" disabled={busy} onClick={() => save("draft")}>{post.status === "published" ? "Retirar do ar e salvar rascunho" : "Salvar rascunho"}</button><button className="button button--primary" disabled={busy}>{busy ? "Salvando…" : post.status === "published" && !isNew ? "Salvar publicação" : "Publicar"}</button>{!isNew && post.status === "published" && <Link href={`/noticias/${post.slug}`} target="_blank" className="text-link">Ver no site ↗</Link>}</div>
          <p className="source-note">Para publicar, preencha o resumo, ao menos uma seção, a fonte e o botão. O texto é exibido como você o escreveu; códigos HTML não são executados.</p>
        </form>}
      </div>}
    </>}
  </div>;
}
