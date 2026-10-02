// Integration checks use isolated credentials and their own private Blob prefix.
import assert from "node:assert/strict";
import { randomBytes, scryptSync, createHmac } from "node:crypto";
import { spawn } from "node:child_process";
import { get, put, del, list } from "@vercel/blob";
import { TOTP } from "otpauth";

if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Configure o token privado de teste antes de executar.");
const namespace = randomBytes(12).toString("hex");
const prefix = `cms/auth-tests/${namespace}`;
const password = randomBytes(24).toString("base64url");
const secret = randomBytes(32).toString("hex");
const salt = randomBytes(16).toString("hex");
const hash = `scrypt:131072:8:1:${salt}:${scryptSync(password, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }).toString("hex")}`;
const port = 3100 + Math.floor(Math.random() * 500);
const base = `http://localhost:${port}`;
const email = "security-test@example.invalid";
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port)], {
  env: { ...process.env, NODE_ENV: "production", VERCEL: "", VERCEL_ENV: "development", ADMIN_EMAIL: email, ADMIN_PASSWORD_HASH_V2: hash, ADMIN_SESSION_SECRET: secret, ADMIN_TEST_NAMESPACE: namespace },
  stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
});
child.stdout.resume(); child.stderr.resume();
let cookie = "";
async function request(path, method = "GET", body, options = {}) {
  return fetch(base + path, { method, headers: { ...(method !== "GET" ? { Origin: base, "Content-Type": "application/json" } : {}), ...(cookie ? { Cookie: cookie } : {}), ...options.headers }, ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}) });
}
async function login(code = "") {
  const response = await request("/api/admin/session", "POST", { email, password, code });
  assert.equal(response.status, 200, "Login autorizado");
  const header = response.headers.getSetCookie().find(value => /^sertao-editor-session=[A-Za-z0-9_-]{43};/.test(value));
  assert.ok(header, "Cookie opaco de 256 bits");
  assert.match(header, /HttpOnly/i); assert.match(header, /SameSite=Strict/i); assert.match(header, /Max-Age=7200/i);
  cookie = header.split(";")[0];
  return cookie;
}
async function resetAttempts() { await del(`${prefix}/login-attempts.json`); }
async function alterSession(changes) {
  const token = cookie.split("=")[1];
  const id = createHmac("sha256", secret).update(`session:${token}`).digest("hex");
  const path = `${prefix}/sessions/${id}.json`;
  const current = await get(path, { access: "private", useCache: false, headers: { "Accept-Encoding": "identity" } });
  assert.equal(current.statusCode, 200);
  const value = await new Response(current.stream).json();
  await put(path, JSON.stringify({ ...value, ...changes }), { access: "private", addRandomSuffix: false, contentType: "application/json", ifMatch: current.blob.etag });
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { ready = (await fetch(base + "/admin")).status === 200; } catch {}
    if (ready) break;
    if (child.exitCode !== null) throw new Error("O servidor de teste encerrou inesperadamente.");
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, "Servidor de produção local iniciou");
  let response = await request("/admin");
  const csp = response.headers.get("content-security-policy");
  assert.match(csp, /'strict-dynamic'/); assert.ok(!csp.includes("'unsafe-eval'"));
  const nonce = csp.match(/'nonce-([^']+)'/)[1];
  const html = await response.text();
  const scripts = html.match(/<script\b[^>]*>/g) || [];
  assert.ok(scripts.length > 0); assert.ok(scripts.every(tag => tag.includes(`nonce="${nonce}"`)), "Todos os scripts recebem nonce");
  assert.notEqual((await request("/admin")).headers.get("content-security-policy"), csp, "Nonce muda por requisição");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-powered-by"), null);
  for (const path of ["/api/admin/content", "/api/admin/security"]) { response = await request(path); assert.equal(response.status, 401); assert.match(response.headers.get("cache-control"), /no-store/); }
  response = await request("/api/admin/session", "POST", { email, password }, { headers: { Origin: "https://attacker.invalid" } }); assert.equal(response.status, 403);
  response = await request("/api/admin/session", "POST", { email, password }, { headers: { "Sec-Fetch-Site": "cross-site" } }); assert.equal(response.status, 403);
  response = await request("/api/admin/session", "POST", "{broken-json"); assert.equal(response.status, 400);
  response = await request("/api/admin/session", "POST", "x".repeat(5000)); assert.equal(response.status, 413);
  response = await request("/api/admin/session", "POST", { email, password }, { headers: { "Content-Type": "text/plain" } }); assert.equal(response.status, 415);
  response = await request("/api/admin/session", "POST", { email, password: "wrong" }); assert.equal(response.status, 401);
  await login();
  response = await request("/api/admin/content"); assert.equal(response.status, 200);
  const snapshot = await response.json(); assert.ok(snapshot.content.posts.length >= 4);
  const originalCookie = cookie;
  response = await request("/api/admin/session", "DELETE"); assert.equal(response.status, 200);
  cookie = originalCookie; response = await request("/api/admin/content"); assert.equal(response.status, 401, "Replay após logout é recusado");
  await login();
  await alterSession({ lastSeenAt: Date.now() - 31 * 60_000 });
  response = await request("/api/admin/content"); assert.equal(response.status, 401, "Inatividade encerra sessão");
  await login();
  await alterSession({ expiresAt: Date.now() - 1000 });
  response = await request("/api/admin/content"); assert.equal(response.status, 401, "Expiração absoluta é respeitada");
  cookie = "sertao-editor-session=invalid.signed.token";
  response = await request("/api/admin/content"); assert.equal(response.status, 401, "Tokens legados não dão acesso");
  await resetAttempts(); await login();
  response = await request("/api/admin/security", "POST", { action: "enroll", password }); assert.equal(response.status, 200);
  const enrollment = await response.json(); assert.match(enrollment.qr, /^data:image\/png;base64,/);
  const authenticator = new TOTP({ secret: enrollment.secret, algorithm: "SHA1", digits: 6, period: 30 });
  const securityBlob = await get(`${prefix}/security.json`, { access: "private", useCache: false, headers: { "Accept-Encoding": "identity" } });
  const storedSecurity = await new Response(securityBlob.stream).text(); assert.ok(!storedSecurity.includes(enrollment.secret), "Chave MFA criptografada no armazenamento");
  const oldSession = cookie;
  response = await request("/api/admin/security", "POST", { action: "confirm", code: authenticator.generate() }); assert.equal(response.status, 200);
  const confirmed = await response.json(); assert.equal(confirmed.recoveryCodes.length, 10);
  cookie = response.headers.getSetCookie().find(value => value.startsWith("sertao-editor-session=")).split(";")[0];
  const mfaCookie = cookie;
  cookie = oldSession; response = await request("/api/admin/content"); assert.equal(response.status, 401, "Ativar MFA revoga sessões anteriores");
  cookie = "";
  response = await request("/api/admin/session", "POST", { email, password }); assert.equal(response.status, 401, "Senha sozinha não basta com MFA ativo");
  response = await request("/api/admin/session", "POST", { email, password, code: authenticator.generate() }); assert.equal(response.status, 401, "Código da ativação não pode ser reutilizado");
  await login(confirmed.recoveryCodes[0]);
  cookie = "";
  response = await request("/api/admin/session", "POST", { email, password, code: confirmed.recoveryCodes[0] }); assert.equal(response.status, 401, "Código de recuperação não pode ser reutilizado");
  await resetAttempts();
  const timestamp = Date.now() + (30_000 - Date.now() % 30_000) + 50;
  const nextCode = authenticator.generate({ timestamp });
  const concurrent = await Promise.all([request("/api/admin/session", "POST", { email, password, code: nextCode }), request("/api/admin/session", "POST", { email, password, code: nextCode })]);
  assert.equal(concurrent.filter(item => item.status === 200).length, 1, "Somente uma tentativa simultânea pode consumir o TOTP");
  assert.ok(concurrent.filter(item => item.status !== 200).every(item => [401, 503].includes(item.status)), "Conflitos são recusados sem liberar acesso");
  cookie = concurrent.find(item => item.status === 200).headers.getSetCookie().find(value => value.startsWith("sertao-editor-session=")).split(";")[0];
  response = await request("/api/admin/security", "POST", { action: "revokeAll" }); assert.equal(response.status, 200);
  cookie = mfaCookie; response = await request("/api/admin/content"); assert.equal(response.status, 401, "Encerrar todas as sessões revoga outros dispositivos");
  await resetAttempts(); cookie = "";
  for (let index = 0; index < 10; index++) { response = await request("/api/admin/session", "POST", { email, password: "wrong" }); assert.equal(response.status, 401); }
  response = await request("/api/admin/session", "POST", { email, password, code: confirmed.recoveryCodes[1] }); assert.equal(response.status, 429, "Limite persistente bloqueia novas tentativas"); assert.equal(response.headers.get("retry-after"), "900");
  console.log("PASS: CSP, cabeçalhos, autorização, CSRF, tamanho e formato, hash, logout/replay, expiração, MFA, criptografia, recuperação, concorrência e limite de tentativas.");
} finally {
  child.kill();
  let cursor;
  do {
    const page = await list({ prefix: prefix + "/", cursor, limit: 1000 });
    const owned = page.blobs.filter(blob => blob.pathname.startsWith(prefix + "/"));
    if (owned.length) await del(owned.map(blob => blob.url));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  console.log("Dados isolados de teste removidos. Conteúdo e autenticação de produção preservados.");
}
