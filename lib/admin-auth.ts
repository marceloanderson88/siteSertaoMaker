import "server-only";
import { randomBytes, scrypt } from "node:crypto";
import { cookies } from "next/headers";
import { del, BlobPreconditionFailedError } from "@vercel/blob";
import { authPrefix, digest, equal, readPrivate, updatePrivate, writePrivate } from "@/lib/admin-store";
import { readSecurity } from "@/lib/admin-security";
import { EditorialError } from "@/lib/cms";

const deployed = process.env.VERCEL === "1";
export const sessionCookie = deployed ? "__Host-sertao-editor-session" : "sertao-editor-session";
export const sessionSeconds = 2 * 60 * 60;
const idleMillis = 30 * 60_000;
export const cookieOptions = { httpOnly: true, secure: deployed, sameSite: "strict" as const, path: "/", priority: "high" as const };
export function adminConfigured() { return (process.env.ADMIN_SESSION_SECRET || "").length >= 32 && /^scrypt:131072:8:1:[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.ADMIN_PASSWORD_HASH_V2 || "") && !!process.env.ADMIN_EMAIL && !!process.env.BLOB_READ_WRITE_TOKEN; }
export async function validPassword(email: string, password: string) {
  if (!adminConfigured()) return false;
  const [, , , , salt, hash] = process.env.ADMIN_PASSWORD_HASH_V2!.split(":");
  // Even an unknown e-mail incurs the same password derivation cost.
  const derived = await new Promise<Buffer>((resolve, reject) => scrypt(password, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key)));
  return equal(derived.toString("hex"), hash) && equal(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase());
}
type Session = { expiresAt: number; lastSeenAt: number; epoch: string; credential: string };
function sessionPath(value: string) { return authPrefix + "/sessions/" + digest("session:" + value) + ".json"; }
function credential() { return digest("credential:" + process.env.ADMIN_PASSWORD_HASH_V2 + ":" + process.env.ADMIN_EMAIL); }
export async function sessionId() {
  const value = (await cookies()).get(sessionCookie)?.value;
  return value && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
}
export async function newSession(epoch: string) {
  if ((await readSecurity()).epoch !== epoch) throw new EditorialError("A segurança do acesso mudou. Entre novamente.", 401);
  const value = randomBytes(32).toString("base64url");
  const now = Date.now();
  await writePrivate(sessionPath(value), { expiresAt: now + sessionSeconds * 1000, lastSeenAt: now, epoch, credential: credential() });
  return value;
}
export async function revokeSession() {
  const value = await sessionId();
  if (value) await del(sessionPath(value));
}
export async function authenticated(retries = 0): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = await sessionId();
  if (!value) return false;
  try {
    const stored = await readPrivate<Session>(sessionPath(value));
    const state = await readSecurity();
    const now = Date.now();
    if (!stored || !Number.isFinite(stored.value.expiresAt) || !Number.isFinite(stored.value.lastSeenAt) || stored.value.expiresAt <= now || stored.value.expiresAt > now + sessionSeconds * 1000 || stored.value.lastSeenAt + idleMillis <= now || stored.value.lastSeenAt > now || !equal(stored.value.credential, credential()) || stored.value.epoch !== state.epoch) return false;
    if (now - stored.value.lastSeenAt > 5 * 60_000) {
      // CAS prevents a concurrent logout from recreating a revoked session.
      try { await writePrivate(sessionPath(value), { ...stored.value, lastSeenAt: now }, stored.etag); }
      catch (error) { if (error instanceof BlobPreconditionFailedError && retries < 3) return authenticated(retries + 1); throw error; }
    }
    return true;
  } catch { return false; }
}
export function sameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") throw new EditorialError("Requisição de origem inválida.", 403);
}
export async function countLoginAttempt(request: Request) {
  const path = authPrefix + "/login-attempts.json";
  const window = Math.floor(Date.now() / (15 * 60_000));
  // Vercel overwrites this header; untrusted X-Forwarded-For is never used.
  const identity = deployed ? request.headers.get("x-vercel-forwarded-for") || "unknown" : "local";
  const key = digest("attempt:" + identity);
  type Bucket = { window: number; total: number; counts: Record<string, number> };
  await updatePrivate<Bucket>(path, () => ({ window, total: 0, counts: {} }), current => {
    const bucket = current.window === window ? current : { window, total: 0, counts: {} };
    if ((bucket.counts[key] || 0) >= 10 || bucket.total >= 1000) throw new EditorialError("Muitas tentativas. Aguarde até 15 minutos para entrar novamente.", 429);
    bucket.counts[key] = (bucket.counts[key] || 0) + 1;
    bucket.total++;
    return bucket;
  });
}
