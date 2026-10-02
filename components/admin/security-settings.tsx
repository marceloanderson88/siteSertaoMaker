"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";

export function SecuritySettings({ onSessionEnded, onBusyChange, onRecoveryChange }: { onSessionEnded: () => void; onBusyChange: (busy: boolean) => void; onRecoveryChange: (unsaved: boolean) => void }) {
  const [status, setStatus] = useState<{ mfaEnabled: boolean; recoveryRemaining: number } | null>(null);
  const [enrollment, setEnrollment] = useState<{ secret: string; qr: string } | null>(null);
  const [recovery, setRecovery] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => { onBusyChange(busy); return () => onBusyChange(false); }, [busy, onBusyChange]);
  useEffect(() => { onRecoveryChange(recovery.length > 0); return () => onRecoveryChange(false); }, [recovery.length, onRecoveryChange]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/security", { cache: "no-store", signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStatus(data);
    }).catch(error => { if (error.name !== "AbortError") setFeedback(error.message); });
    return () => controller.abort();
  }, []);

  async function request(body: Record<string, unknown>) {
    const response = await fetch("/api/admin/security", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível concluir a operação.");
    return data;
  }
  async function enroll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = new FormData(form).get("password");
    setBusy(true); setFeedback("");
    try { setEnrollment(await request({ action: "enroll", password })); form.reset(); }
    catch (error) { setFeedback((error as Error).message); }
    finally { setBusy(false); }
  }
  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const code = new FormData(form).get("code");
    setBusy(true); setFeedback("");
    try {
      const data = await request({ action: "confirm", code });
      setEnrollment(null); form.reset(); setRecovery(data.recoveryCodes);
      setStatus({ mfaEnabled: true, recoveryRemaining: data.recoveryCodes.length });
      setFeedback("Verificação em duas etapas ativada. As outras sessões foram encerradas.");
    } catch (error) { setFeedback((error as Error).message); }
    finally { setBusy(false); }
  }
  async function revoke() {
    if (!window.confirm("Encerrar o acesso em todos os dispositivos, incluindo este? Você precisará entrar novamente.")) return;
    setBusy(true); setFeedback("");
    try { await request({ action: "revokeAll" }); onSessionEnded(); }
    catch (error) { setFeedback((error as Error).message); }
    finally { setBusy(false); }
  }

  return <section className="admin-form admin-security">
    <h2>Segurança do acesso</h2>
    <p>Sua sessão expira após duas horas ou 30 minutos sem atividade. Use “Sair” ao terminar.</p>
    <p role="status" aria-live="polite">{feedback}</p>
    {!status ? <p>Carregando configurações…</p> : status.mfaEnabled ? <>
      <h3>Verificação em duas etapas ativa</h3>
      <p>Além da senha, o login exige um código do seu aplicativo autenticador. Restam {status.recoveryRemaining} códigos de recuperação.</p>
    </> : <>
      <h3>Ativar verificação em duas etapas</h3>
      <p>Cadastre este acesso no Google Authenticator, Microsoft Authenticator ou outro aplicativo compatível. A proteção só fica ativa depois que você confirma um código.</p>
      {!enrollment ? <form onSubmit={enroll}><label>Confirme sua senha<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label><button className="button button--primary" disabled={busy}>{busy ? "Preparando…" : "Configurar autenticador"}</button></form> : <form onSubmit={confirm}>
        <p>Escaneie o QR Code no aplicativo. Se preferir, cadastre a chave abaixo manualmente. Esta configuração expira em dez minutos.</p>
        <Image src={enrollment.qr} width={256} height={256} unoptimized alt="QR Code para cadastrar o acesso no aplicativo autenticador" />
        <p className="admin-secret"><strong>Chave de configuração:</strong> <code>{enrollment.secret}</code></p>
        <label>Código de seis dígitos<input name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required /></label>
        <p>Após ativar, guarde os códigos de recuperação que aparecerão. Eles permitem entrar se você perder o celular.</p>
        <div className="admin-save"><button className="button button--primary" disabled={busy}>{busy ? "Ativando…" : "Confirmar e ativar"}</button><button type="button" disabled={busy} onClick={() => setEnrollment(null)}>Recomeçar configuração</button></div>
      </form>}
    </>}
    {!!recovery.length && <div className="admin-recovery"><h3>Guarde seus códigos de recuperação agora</h3><p>Eles são exibidos uma única vez. Salve-os em um gerenciador de senhas. Cada código pode ser usado somente uma vez e ainda exige sua senha.</p><ul>{recovery.map(code => <li key={code}><code>{code}</code></li>)}</ul><button className="button button--outline" onClick={() => { if (window.confirm("Você já guardou os códigos em um local seguro? Eles não serão exibidos novamente.")) setRecovery([]); }}>Já guardei os códigos</button></div>}
    <h3>Encerrar todas as sessões</h3>
    <p>Use esta opção se perdeu um dispositivo ou suspeita que alguém acessou sua conta.</p>
    <button className="button button--outline" disabled={busy} onClick={revoke}>Sair de todos os dispositivos</button>
  </section>;
}
