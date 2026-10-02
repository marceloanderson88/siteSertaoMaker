import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = randomBytes(16).toString("base64");
  const dev = process.env.NODE_ENV === "development";
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:", "font-src 'self'", `connect-src 'self'${dev ? " ws:" : ""}`,
    "frame-src 'none'", "frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self'",
    ...(process.env.VERCEL === "1" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|otf)$).*)"] };
