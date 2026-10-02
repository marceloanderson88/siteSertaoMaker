import { cookies } from "next/headers";
import { adminConfigured, cookieOptions, countLoginAttempt, newSession, revokeSession, sameOrigin, sessionCookie, sessionSeconds, validPassword } from "@/lib/admin-auth";
import { verifySecondFactor } from "@/lib/admin-security";
import { adminError, privateHeaders, readAdminJson } from "@/lib/admin-request";
import { EditorialError } from "@/lib/cms";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (!adminConfigured()) throw new EditorialError("O acesso administrativo ainda não está configurado.", 503);
    const input = await readAdminJson(request, 4096);
    if (typeof input.email !== "string" || typeof input.password !== "string" || input.email.length > 254 || input.password.length > 256 || (input.code !== undefined && (typeof input.code !== "string" || input.code.length > 64))) throw new EditorialError("Dados de acesso inválidos.");
    await countLoginAttempt(request);
    if (!await validPassword(input.email, input.password)) throw new EditorialError("E-mail ou senha inválidos.", 401);
    const epoch = await verifySecondFactor(typeof input.code === "string" ? input.code.trim() : "");
    await revokeSession();
    const value = await newSession(epoch);
    const jar = await cookies();
    jar.delete("sertao-editor-session");
    jar.set(sessionCookie, value, { ...cookieOptions, maxAge: sessionSeconds });
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch (error) { return adminError(error); }
}
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    await revokeSession();
    const jar = await cookies();
    jar.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
    jar.delete("sertao-editor-session");
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch (error) { return adminError(error); }
}
