"use client";

import { useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { shareLinks } from "@/lib/share-links";

export function ShareActions({ title, path }: { title: string; path: string }) {
  const [feedback, setFeedback] = useState("");
  const links = shareLinks(title, path);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(links.url);
      setFeedback("Link copiado. Cole na conversa ou rede que preferir.");
    } catch {
      setFeedback(`Copie este endereço: ${links.url}`);
    }
  }

  async function share() {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({ title, url: links.url });
      setFeedback("");
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) setFeedback("Escolha uma rede abaixo ou use Copiar link.");
    }
  }

  return <div className="share-actions" aria-label={`Compartilhar: ${title}`}>
    <div className="share-actions__links">
      <a className="share-whatsapp" href={links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`Compartilhar ${title} no WhatsApp`}>WhatsApp ↗</a>
      <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Compartilhar ${title} no Facebook`}>Facebook ↗</a>
      <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`Compartilhar ${title} no LinkedIn`}>LinkedIn ↗</a>
      <a href={links.x} target="_blank" rel="noopener noreferrer" aria-label={`Compartilhar ${title} no X`}>X ↗</a>
      <button type="button" onClick={copyLink}><Copy aria-hidden="true" /> Copiar link</button>
      <button type="button" onClick={share}><Share2 aria-hidden="true" /> Compartilhar</button>
    </div>
    <p className="share-feedback" role="status">{feedback}</p>
  </div>;
}
