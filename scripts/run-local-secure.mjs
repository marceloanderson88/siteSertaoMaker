import fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { parseEnv } from "node:util";

let values = {};
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  if (fs.existsSync(".env.local")) values = parseEnv(fs.readFileSync(".env.local", "utf8"));
  else if (process.platform === "win32" && fs.existsSync("work/ambiente.protegido.txt")) {
    const decrypted = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "RemoteSigned", "-File", "scripts/read-admin-secret.ps1", "-Path", "work/ambiente.protegido.txt"], { encoding: "utf8", windowsHide: true });
    if (decrypted.status !== 0) throw new Error("Execute no usuário do Windows que protegeu as credenciais ou use vercel env run.");
    values = parseEnv(decrypted.stdout);
  }
}
const mode = process.argv[2] || "dev";
if (!["dev", "start", "build", "test-security"].includes(mode)) throw new Error("Modo inválido.");
const args = mode === "test-security" ? ["scripts/test-admin-security.mjs"] : ["node_modules/next/dist/bin/next", mode];
const child = spawn(process.execPath, [...args, ...process.argv.slice(3)], { env: { ...values, ...process.env }, stdio: "inherit", windowsHide: true });
child.on("exit", code => { process.exitCode = code ?? 1; });
child.on("error", () => { console.error("Não foi possível iniciar o processo local."); process.exitCode = 1; });
