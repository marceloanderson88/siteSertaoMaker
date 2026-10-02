import { Camera, UsersRound } from "lucide-react";
import { emailLink } from "@/lib/site-content";
import { getContent } from "@/lib/cms";

export async function SocialLinks() {
  const { content: { social } } = await getContent();
  return <div className="social-links" aria-label="Instagram e comunidade">
    <a href={social.instagram} target="_blank" rel="noopener noreferrer"><Camera aria-hidden="true" /> Instagram</a>
    <a href={social.community || emailLink("Quero participar da comunidade Sertão Maker")} {...(social.community ? { target: "_blank", rel: "noopener noreferrer" } : {})}><UsersRound aria-hidden="true" /> {social.community ? "Entrar na comunidade" : "Solicitar acesso à comunidade"}</a>
  </div>;
}
