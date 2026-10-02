import "server-only";
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
import { EditorialError } from "@/lib/cms";

const testNamespace = process.env.VERCEL !== "1" && /^[a-f0-9]{24}$/.test(process.env.ADMIN_TEST_NAMESPACE || "") ? process.env.ADMIN_TEST_NAMESPACE : null;
export const authPrefix = testNamespace ? `cms/auth-tests/${testNamespace}` : process.env.VERCEL_ENV === "production" ? "cms/auth" : "cms/auth-development";
export function digest(value: string) { return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(value).digest("hex"); }
export function equal(a: string, b: string) { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
export async function readPrivate<T>(path: string): Promise<{ value: T; etag: string } | null> {
  const result = await get(path, { access: "private", useCache: false, headers: { "Accept-Encoding": "identity" } });
  if (!result) return null;
  if (result.statusCode !== 200) throw new EditorialError("Acesso temporariamente indisponível.", 503);
  return { value: await new Response(result.stream).json() as T, etag: result.blob.etag };
}
export async function writePrivate(path: string, value: unknown, etag?: string) {
  return put(path, JSON.stringify(value), { access: "private", addRandomSuffix: false, contentType: "application/json", ...(etag ? { ifMatch: etag } : { allowOverwrite: false }) });
}
export async function updatePrivate<T>(path: string, initial: () => T, change: (current: T) => T): Promise<T> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await readPrivate<T>(path);
    const next = change(current?.value ?? initial());
    try { await writePrivate(path, next, current?.etag); return next; }
    catch (error) {
      if (!(error instanceof BlobPreconditionFailedError)) throw error;
      if (attempt < 4) await new Promise(resolve => setTimeout(resolve, 100 * 2 ** attempt));
    }
  }
  throw new EditorialError("Acesso temporariamente ocupado. Tente novamente.", 503);
}
// MFA secrets are encrypted separately from the private storage token.
function key() { return Buffer.from(digest("mfa-encryption-v1"), "hex"); }
export function encrypt(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(Buffer.from(authPrefix + "/security"));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return { iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: encrypted.toString("base64") };
}
export function decrypt<T>(value: ReturnType<typeof encrypt>): T {
  const cipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(value.iv, "base64"));
  cipher.setAAD(Buffer.from(authPrefix + "/security"));
  cipher.setAuthTag(Buffer.from(value.tag, "base64"));
  return JSON.parse(Buffer.concat([cipher.update(Buffer.from(value.data, "base64")), cipher.final()]).toString("utf8")) as T;
}
