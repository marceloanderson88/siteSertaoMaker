import { cookies } from "next/headers";
import { adminConfigured, countLoginAttempt, newSession, sameOrigin, sessionCookie, sessionSeconds, validPassword } from "@/lib/admin-auth";
import { EditorialError } from "@/lib/cms";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (!adminConfigured()) throw new EditorialError("O acesso administrativo ainda não está configurado.", 503);
    if (Number(request.headers.get("content-length")) > 4096) throw new EditorialError("Dados de acesso inválidos.");
    const input = await request.json();
    if (typeof input.email !== "string" || typeof input.password !== "string" || input.email.length > 254 || input.password.length > 256) throw new EditorialError("Dados de acesso inválidos.");
    await countLoginAttempt(request);
    if (!validPassword(input.email, input.password)) throw new EditorialError("E-mail ou senha inválidos.", 401);
    (await cookies()).set(sessionCookie, newSession(), { httpOnly: true, secure: new URL(request.url).protocol === "https:", sameSite: "strict", path: "/", maxAge: sessionSeconds });
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof EditorialError ? error.message : "Não foi possível entrar. Tente novamente." }, { status: error instanceof EditorialError ? error.status : 503 });
  }
}
export async function DELETE(request: Request) {
  try { sameOrigin(request); (await cookies()).delete(sessionCookie); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Requisição de origem inválida." }, { status: 403 }); }
}
