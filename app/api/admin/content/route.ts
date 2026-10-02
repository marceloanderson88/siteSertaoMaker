import { authenticated, sameOrigin } from "@/lib/admin-auth";
import { EditorialError, readContent, updateContent } from "@/lib/cms";

export const runtime = "nodejs";
export async function GET() {
  if (!await authenticated()) return Response.json({ error: "Entre no painel para continuar." }, { status: 401 });
  try { return Response.json(await readContent(), { headers: { "Cache-Control": "private, no-store" } }); }
  catch { return Response.json({ error: "Não foi possível carregar as publicações." }, { status: 503 }); }
}
export async function PUT(request: Request) {
  try {
    sameOrigin(request);
    if (!await authenticated()) throw new EditorialError("Entre no painel para continuar.", 401);
    const body = await request.text();
    if (body.length > 250_000) throw new EditorialError("Publicação muito grande.", 413);
    const input = JSON.parse(body);
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new EditorialError("Dados inválidos.");
    return Response.json(await updateContent(input), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof EditorialError ? error.message : "Não foi possível salvar. Tente novamente." }, { status: error instanceof EditorialError ? error.status : 503 });
  }
}
