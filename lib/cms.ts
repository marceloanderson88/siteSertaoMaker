import "server-only";
import { cache } from "react";
import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
import seeds from "@/content/noticias.json";
import { social } from "@/lib/site-content";
import type { NewsPost } from "@/lib/news";

export type ManagedPost = NewsPost & { status: "draft" | "published"; updatedAt: string };
export type EditorialContent = { posts: ManagedPost[]; social: { instagram: string; community: string } };
export class EditorialError extends Error { constructor(message: string, public status = 400) { super(message); } }
const path = "cms/content.json";
const initial = (): EditorialContent => ({ posts: seeds.map(post => ({ ...post, status: "published", updatedAt: `${post.publishedAt}T12:00:00Z` })), social: { ...social } });
export async function readContent() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { content: initial(), version: "initial" };
  // Identity encoding preserves the strong ETag needed for conditional writes.
  const result = await get(path, { access: "private", useCache: false, headers: { "Accept-Encoding": "identity" } });
  if (!result || result.statusCode !== 200) return { content: initial(), version: "initial" };
  const content = await new Response(result.stream).json() as EditorialContent;
  return { content, version: result.blob.etag };
}
export const getContent = cache(readContent);
export async function getPublishedNews() {
  const { content } = await getContent();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return content.posts.filter(post => post.status === "published" && post.publishedAt <= today).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
export function safeLink(value: string, internal = false) {
  if (internal && /^\/(?!\/)[^\\\s]*$/.test(value)) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !/[\s\\]/.test(value); } catch { return false; }
}
function field(input: Record<string, unknown>, key: string, max: number, required = true) {
  const value = input[key];
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new EditorialError(`Revise o campo ${key}.`);
  return value.trim();
}
function date(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value; }
export function validatePost(value: unknown): ManagedPost {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new EditorialError("Publicação inválida.");
  const input = value as Record<string, unknown>;
  const status = input.status;
  if (status !== "draft" && status !== "published") throw new EditorialError("Estado de publicação inválido.");
  const slug = field(input, "slug", 140);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new EditorialError("Use letras minúsculas, números e hífens no endereço.");
  const publishedAt = field(input, "publishedAt", 10);
  if (!date(publishedAt)) throw new EditorialError("Data de publicação inválida.");
  const post: ManagedPost = { slug, status, publishedAt, title: field(input, "title", 180), category: field(input, "category", 60), excerpt: field(input, "excerpt", 600, status === "published"), source: field(input, "source", 2000, status === "published"), sourceLabel: field(input, "sourceLabel", 180, status === "published"), actionHref: field(input, "actionHref", 2000, status === "published"), actionLabel: field(input, "actionLabel", 100, status === "published"), sections: [], updatedAt: new Date().toISOString() };
  if ((post.source && !safeLink(post.source)) || (post.actionHref && !safeLink(post.actionHref, true))) throw new EditorialError("Os links devem usar HTTPS ou um caminho interno válido.");
  if (!Array.isArray(input.sections) || input.sections.length > 20 || (status === "published" && !input.sections.length)) throw new EditorialError("Adicione ao menos uma seção à publicação.");
  post.sections = input.sections.map(section => {
    if (!section || typeof section !== "object") throw new EditorialError("Seção inválida.");
    return { title: field(section, "title", 180, status === "published"), text: field(section, "text", 10000, status === "published") };
  });
  if (input.closesAt) {
    const value = field(input, "closesAt", 40);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?-03:00$/.test(value) || !date(value.slice(0, 10)) || !Number.isFinite(Date.parse(value))) throw new EditorialError("Prazo inválido. Use o horário de Brasília.");
    post.closesAt = value;
  }
  if (input.eventDate) { const value = field(input, "eventDate", 10); if (!date(value)) throw new EditorialError("Data do evento inválida."); post.eventDate = value; }
  return post;
}
export async function updateContent(input: Record<string, unknown>) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new EditorialError("Armazenamento não configurado.", 503);
  const current = await readContent();
  if (input.version !== current.version) throw new EditorialError("Outra edição foi salva. Atualize a lista antes de tentar novamente; seu texto continua no formulário.", 409);
  const content = current.content;
  if (input.operation === "savePost") {
    const post = validatePost(input.post);
    const index = content.posts.findIndex(item => item.slug === post.slug);
    if (input.isNew && index >= 0) throw new EditorialError("Já existe uma publicação com esse endereço.", 409);
    if (!input.isNew && index < 0) throw new EditorialError("Publicação não encontrada.", 404);
    if (index < 0) content.posts.push(post); else content.posts[index] = post;
  } else if (input.operation === "saveSocial") {
    if (!input.social || typeof input.social !== "object") throw new EditorialError("Redes inválidas.");
    const values = input.social as Record<string, unknown>;
    const instagram = field(values, "instagram", 2000);
    const community = field(values, "community", 2000, false);
    if (!safeLink(instagram) || (community && !safeLink(community))) throw new EditorialError("Informe links completos com HTTPS.");
    const host = new URL(instagram).hostname;
    if (host !== "instagram.com" && host !== "www.instagram.com") throw new EditorialError("Informe um perfil do Instagram.");
    content.social = { instagram, community };
  } else throw new EditorialError("Operação inválida.");
  const body = JSON.stringify(content);
  if (content.posts.length > 500 || Buffer.byteLength(body) > 2_000_000) throw new EditorialError("Limite editorial atingido. Fale com o responsável pelo site.");
  try {
    await put(path, body, { access: "private", addRandomSuffix: false, contentType: "application/json", ...(current.version === "initial" ? { allowOverwrite: false } : { ifMatch: current.version }) });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) throw new EditorialError("Outra edição foi salva. Atualize a lista e tente novamente.", 409);
    throw error;
  }
  return readContent();
}
