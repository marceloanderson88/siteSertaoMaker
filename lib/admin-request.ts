import "server-only";
import { EditorialError } from "@/lib/cms";

export const privateHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
export function adminError(error: unknown) {
  return Response.json({ error: error instanceof EditorialError ? error.message : "Não foi possível concluir a operação. Tente novamente." }, { status: error instanceof EditorialError ? error.status : 503, headers: { ...privateHeaders, ...(error instanceof EditorialError && error.status === 429 ? { "Retry-After": "900" } : {}) } });
}
export async function readAdminJson(request: Request, maxBytes: number): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new EditorialError("Envie dados no formato JSON.", 415);
  if (Number(request.headers.get("content-length")) > maxBytes) throw new EditorialError("Dados muito grandes.", 413);
  if (!request.body) throw new EditorialError("Dados inválidos.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new EditorialError("Dados muito grandes.", 413); }
      chunks.push(value);
    }
    const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new EditorialError("Dados inválidos.");
    return input;
  } catch (error) { if (error instanceof EditorialError) throw error; throw new EditorialError("Dados inválidos."); }
  finally { reader.releaseLock(); }
}
