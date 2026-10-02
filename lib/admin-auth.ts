import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
import { EditorialError } from "@/lib/cms";

export const sessionCookie = "sertao-editor-session";
export const sessionSeconds = 8 * 60 * 60;
function secret() { return process.env.ADMIN_SESSION_SECRET || ""; }
export function adminConfigured() { return secret().length >= 32 && !!process.env.ADMIN_PASSWORD_HASH && !!process.env.ADMIN_EMAIL && !!process.env.BLOB_READ_WRITE_TOKEN; }
function equal(a: string, b: string) { const first = Buffer.from(a); const second = Buffer.from(b); return first.length === second.length && timingSafeEqual(first, second); }
export function validPassword(email: string, password: string) {
  if (!adminConfigured() || !equal(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase())) return false;
  const [salt, hash] = process.env.ADMIN_PASSWORD_HASH!.split(":");
  if (!salt || !hash) return false;
  return equal(scryptSync(password, salt, 64).toString("hex"), hash);
}
export function newSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + sessionSeconds * 1000, nonce: randomBytes(16).toString("hex") })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
export async function authenticated() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(sessionCookie)?.value;
  if (!value || value.length > 600) return false;
  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra || !equal(signature, createHmac("sha256", secret()).update(payload).digest("base64url"))) return false;
  try { const data = JSON.parse(Buffer.from(payload, "base64url").toString()); return typeof data.exp === "number" && data.exp > Date.now() && data.exp <= Date.now() + sessionSeconds * 1000; } catch { return false; }
}
export function sameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) throw new EditorialError("Requisição de origem inválida.", 403);
}
// Persistent rate limiting also works when Vercel starts a new function instance.
export async function countLoginAttempt(request: Request) {
  const path = "cms/login-attempts.json";
  const now = Date.now();
  const window = Math.floor(now / (15 * 60 * 1000));
  const identity = request.headers.get("x-vercel-forwarded-for") || "local";
  const key = createHmac("sha256", secret()).update(identity).digest("hex");
  for (let attempt = 0; attempt < 5; attempt++) {
    const result = await get(path, { access: "private", useCache: false, headers: { "Accept-Encoding": "identity" } });
    const record = result?.statusCode === 200 ? await new Response(result.stream).json() as { window: number; total: number; counts: Record<string, number> } : { window, total: 0, counts: {} };
    const bucket = record.window === window ? record : { window, total: 0, counts: {} };
    if ((bucket.counts[key] || 0) >= 10 || bucket.total >= 1000) throw new EditorialError("Muitas tentativas. Aguarde até 15 minutos para entrar novamente.", 429);
    bucket.counts[key] = (bucket.counts[key] || 0) + 1;
    bucket.total++;
    try {
      await put(path, JSON.stringify(bucket), { access: "private", addRandomSuffix: false, contentType: "application/json", ...(result?.statusCode === 200 ? { ifMatch: result.blob.etag } : { allowOverwrite: false }) });
      return;
    } catch (error) { if (!(error instanceof BlobPreconditionFailedError)) throw error; }
  }
  throw new EditorialError("Acesso temporariamente ocupado. Tente novamente em instantes.", 503);
}
