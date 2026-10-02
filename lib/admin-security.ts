import "server-only";
import { randomBytes } from "node:crypto";
import { TOTP, Secret } from "otpauth";
import { authPrefix, decrypt, digest, encrypt, equal, readPrivate, updatePrivate } from "@/lib/admin-store";
import { EditorialError } from "@/lib/cms";

type Security = { epoch: string; mfa?: { secret: string; lastStep: number; recovery: string[] }; pending?: { secret: string; sessionId: string; expiresAt: number } };
const path = authPrefix + "/security.json";
const initial = (): Security => ({ epoch: "initial" });
export async function readSecurity(): Promise<Security> {
  const stored = await readPrivate<ReturnType<typeof encrypt>>(path);
  return stored ? decrypt<Security>(stored.value) : initial();
}
function changeSecurity(change: (state: Security) => Security) {
  return updatePrivate(path, () => encrypt(initial()), current => encrypt(change(decrypt<Security>(current)))).then(value => decrypt<Security>(value));
}
function totp(secret: string) { return new TOTP({ issuer: "Sertão Maker", label: process.env.ADMIN_EMAIL || "Editor", secret, algorithm: "SHA1", digits: 6, period: 30 }); }
function acceptedStep(secret: string, code: string) {
  if (!/^\d{6}$/.test(code)) return null;
  const timestamp = Date.now();
  const delta = totp(secret).validate({ token: code, window: 1, timestamp });
  return delta === null ? null : Math.floor(timestamp / 30_000) + delta;
}
export async function verifySecondFactor(code: string) {
  const state = await readSecurity();
  if (!state.mfa) return state.epoch;
  if (!code) throw new EditorialError("Informe o código do autenticador ou um código de recuperação.", 401);
  const next = await changeSecurity(current => {
    if (current.epoch !== state.epoch || !current.mfa) throw new EditorialError("A segurança do acesso mudou. Entre novamente.", 401);
    const step = acceptedStep(current.mfa.secret, code);
    const recoveryHash = digest("recovery:" + code.toLowerCase().replace(/-/g, ""));
    const recoveryIndex = current.mfa.recovery.findIndex(value => equal(value, recoveryHash));
    if (step !== null && step > current.mfa.lastStep) current.mfa.lastStep = step;
    else if (recoveryIndex >= 0) current.mfa.recovery.splice(recoveryIndex, 1);
    else throw new EditorialError("Código inválido ou já utilizado. Aguarde um novo código.", 401);
    return current;
  });
  return next.epoch;
}
export async function beginEnrollment(sessionId: string) {
  const secret = new Secret({ size: 20 }).base32;
  await changeSecurity(current => {
    if (current.mfa) throw new EditorialError("A verificação em duas etapas já está ativa.", 409);
    return { ...current, pending: { secret, sessionId, expiresAt: Date.now() + 10 * 60_000 } };
  });
  return { secret, uri: totp(secret).toString() };
}
export async function confirmEnrollment(sessionId: string, code: string) {
  const recoveryCodes = Array.from({ length: 10 }, () => randomBytes(16).toString("hex"));
  const next = await changeSecurity(current => {
    if (current.mfa) throw new EditorialError("A verificação em duas etapas já está ativa.", 409);
    if (!current.pending || !equal(current.pending.sessionId, sessionId) || current.pending.expiresAt <= Date.now()) throw new EditorialError("Configuração expirada. Inicie novamente.");
    const step = acceptedStep(current.pending.secret, code);
    if (step === null) throw new EditorialError("Código inválido. Confira o aplicativo autenticador.");
    return { epoch: randomBytes(16).toString("hex"), mfa: { secret: current.pending.secret, lastStep: step, recovery: recoveryCodes.map(code => digest("recovery:" + code)) } };
  });
  return { epoch: next.epoch, recoveryCodes };
}
export async function revokeAllSessions() {
  await changeSecurity(current => ({ ...current, pending: undefined, epoch: randomBytes(16).toString("hex") }));
}
