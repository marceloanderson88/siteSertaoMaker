import { authenticated, sameOrigin } from "@/lib/admin-auth";
import { EditorialError, readContent, updateContent } from "@/lib/cms";
import { adminError, privateHeaders, readAdminJson } from "@/lib/admin-request";

export const runtime = "nodejs";
export async function GET() {
  try {
    if (!await authenticated()) throw new EditorialError("Entre no painel para continuar.", 401);
    return Response.json(await readContent(), { headers: privateHeaders });
  } catch (error) { return adminError(error); }
}
export async function PUT(request: Request) {
  try {
    sameOrigin(request);
    if (!await authenticated()) throw new EditorialError("Entre no painel para continuar.", 401);
    return Response.json(await updateContent(await readAdminJson(request, 250_000)), { headers: privateHeaders });
  } catch (error) { return adminError(error); }
}
