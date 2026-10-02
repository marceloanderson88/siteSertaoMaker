// Run locally; the output files are ignored by Git. No secrets are printed.
import fs from "node:fs";
import crypto from "node:crypto";
const email = process.argv[2];
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Uso: node scripts/setup-admin.cjs email@dominio.com");
const target = ".vercel/admin-secrets.json";
if (fs.existsSync(target)) throw new Error("O arquivo de acesso já existe. Guarde o acesso anterior e renomeie o arquivo antes de uma rotação intencional.");
fs.mkdirSync(".vercel", { recursive: true });
fs.mkdirSync("work", { recursive: true });
const password = crypto.randomBytes(24).toString("base64url");
const salt = crypto.randomBytes(16).toString("hex");
const values = { ADMIN_EMAIL: email, ADMIN_PASSWORD_HASH: `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`, ADMIN_SESSION_SECRET: crypto.randomBytes(32).toString("hex") };
fs.writeFileSync(target, JSON.stringify(values));
fs.writeFileSync("work/acesso-painel.txt", `Acesso ao painel editorial da Sertão Maker\n\nEndereço: https://www.sertaomaker.com.br/admin\nE-mail: ${email}\nSenha: ${password}\n\nGuarde este arquivo em local privado. Não envie para o GitHub.\n`);
process.stdout.write("Acesso gerado em work/acesso-painel.txt. Configure as variáveis da Vercel com os valores de .vercel/admin-secrets.json.\n");
