import { cookies } from "next/headers";
import QRCode from "qrcode";
import { authenticated, cookieOptions, countLoginAttempt, newSession, sameOrigin, sessionCookie, sessionId, sessionSeconds, validPassword } from "@/lib/admin-auth";
import { beginEnrollment, confirmEnrollment, readSecurity, revokeAllSessions } from "@/lib/admin-security";
import { adminError, privateHeaders, readAdminJson } from "@/lib/admin-request";
import { EditorialError } from "@/lib/cms";

export const runtime = "nodejs";
export async function GET() {
  try {
    if (!await authenticated()) throw new EditorialError("Entre no painel para continuar.", 401);
    const security = await readSecurity();
    return Response.json({ mfaEnabled: !!security.mfa, recoveryRemaining: security.mfa?.recovery.length || 0 }, { headers: privateHeaders });
  } catch (error) { return adminError(error); }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (!await authenticated()) throw new EditorialError("Entre no painel para continuar.", 401);
    const input = await readAdminJson(request, 4096);
    if (input.action === "revokeAll") {
      await revokeAllSessions();
      (await cookies()).set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
      return Response.json({ ok: true }, { headers: privateHeaders });
    }
    const id = await sessionId();
    if (!id) throw new EditorialError("Entre no painel para continuar.", 401);
    await countLoginAttempt(request);
    if (input.action === "enroll") {
      if (typeof input.password !== "string" || input.password.length > 256 || !await validPassword(process.env.ADMIN_EMAIL || "", input.password)) throw new EditorialError("Senha inválida.", 401);
      const enrollment = await beginEnrollment(id);
      return Response.json({ secret: enrollment.secret, qr: await QRCode.toDataURL(enrollment.uri, { width: 256, margin: 2 }) }, { headers: privateHeaders });
    }
    if (input.action === "confirm" && typeof input.code === "string" && /^\d{6}$/.test(input.code)) {
      const result = await confirmEnrollment(id, input.code);
      (await cookies()).set(sessionCookie, await newSession(result.epoch), { ...cookieOptions, maxAge: sessionSeconds });
      return Response.json({ recoveryCodes: result.recoveryCodes }, { headers: privateHeaders });
    }
    throw new EditorialError("Operação inválida.");
  } catch (error) { return adminError(error); }
}
