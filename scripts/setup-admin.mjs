// Run locally; the output files are ignored by Git. No secrets are printed.
import fs from "node:fs";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
const email = process.argv[2];
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Uso: node scripts/setup-admin.mjs email@dominio.com");
if (process.platform !== "win32") throw new Error("Este gerador usa a protecao de credenciais do Windows. Em outros sistemas, gere o acesso em um gerenciador de senhas e configure o hash na Vercel.");
const target = ".vercel/admin-secrets.protegido.txt";
if (fs.existsSync(target)) throw new Error("O arquivo de acesso já existe. Guarde o acesso anterior e renomeie o arquivo antes de uma rotação intencional.");
fs.mkdirSync(".vercel", { recursive: true });
fs.mkdirSync("work", { recursive: true });
const password = crypto.randomBytes(24).toString("base64url");
const salt = crypto.randomBytes(16).toString("hex");
const values = { ADMIN_EMAIL: email, ADMIN_PASSWORD_HASH_V2: `scrypt:131072:8:1:${salt}:${crypto.scryptSync(password, salt, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }).toString("hex")}`, ADMIN_SESSION_SECRET: crypto.randomBytes(32).toString("hex") };
function protect(destination, input) {
  const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "RemoteSigned", "-File", "scripts/store-admin-secret.ps1", "-Destination", destination], { input, encoding: "utf8", windowsHide: true });
  if (result.status !== 0) throw new Error("Não foi possível guardar o acesso protegido. Execute no seu usuário do Windows e preserve os arquivos existentes.");
}
if (fs.existsSync("work/acesso-painel.protegido.txt")) throw new Error("O acesso protegido já existe. Preserve-o antes de uma rotação intencional.");
protect("work/acesso-painel.protegido.txt", `Acesso ao painel editorial da Sertão Maker\n\nEndereço: https://www.sertaomaker.com.br/admin\nE-mail: ${email}\nSenha: ${password}\n`);
protect(target, JSON.stringify(values));
process.stdout.write("Acesso guardado com a criptografia do seu usuário Windows. Consulte docs/painel-editorial.md para configurar as variáveis na Vercel. Nenhuma senha foi gravada em texto puro.\n");
