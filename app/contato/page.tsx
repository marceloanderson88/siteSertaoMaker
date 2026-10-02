import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { SocialLinks } from "@/components/content/social-links";
import { contact, emailLink, sources } from "@/lib/site-content";

export const metadata: Metadata = { title: "Contato | Incubadora Sertão Maker", description: "Fale com a Sertão Maker sobre programas, parcerias e visitas ao CIM no IFSertãoPE Campus Salgueiro." };

export default function Page() {
  return <ContentPage eyebrow="Vamos conversar" title="Fale com a Sertão Maker" intro="Escolha o assunto da sua mensagem. A equipe pode orientar sobre programas, apoio a projetos, parcerias e visitas."
    blocks={[
      { title: "Participação e orientação", text: "Conte em que estágio está sua ideia e qual apoio procura. Canal da incubadora: " + contact.email + ".", items: ["Seu nome e município", "Resumo da ideia ou negócio", "Programa ou apoio que deseja conhecer"], link: { label: "Enviar e-mail à incubadora", href: emailLink("Participação e orientação — Sertão Maker") } },
      { title: "Dúvidas sobre o edital 122/2026", text: "Para inscrição, seleção, resultados ou recursos, use o canal formal do programa: " + contact.programEmail + ". Atendimento em dias úteis, das 8h às 17h, conforme o edital.", link: { label: "Falar com a execução do programa", href: emailLink("Dúvida — Edital nº 122/2026", true) }, content: <p className="source-note"><a href={sources.preIncubation}>Consultar documentos oficiais</a></p> },
      { title: "Proponha uma parceria", text: "Empresas, instituições e especialistas podem conversar sobre mentorias, desafios, ações conjuntas e apoio à infraestrutura.", items: ["Nome da organização e responsável", "Objetivo da colaboração", "Recursos ou competências que deseja compartilhar"], link: { label: "Enviar proposta de parceria", href: emailLink("Proposta de parceria — Sertão Maker") } },
      { title: "Visitas e localização", text: "Centro de Inovação Maker — CIM, IFSertãoPE Campus Salgueiro. " + contact.address + ".", items: ["Solicite a visita por e-mail antes de se deslocar", "Informe número de visitantes, objetivo e datas desejadas", "Informe necessidades de acessibilidade para orientar o atendimento"], link: { label: "Solicitar uma visita", href: emailLink("Solicitação de visita ao CIM — Sertão Maker") }, content: <p className="source-note"><a href={contact.campusContact}>Endereço e contatos institucionais do campus</a> · Horário de visita e disponibilidade devem ser combinados com a equipe.</p> },
    ]}
    cta={{ title: "Conte o que você quer desenvolver.", label: "Escrever para a Sertão Maker", href: emailLink("Contato — Sertão Maker") }}><section className="container content-section"><h2>Faça parte da rede.</h2><p>Acompanhe o Instagram e conecte-se à comunidade Sertão Maker.</p><SocialLinks /></section></ContentPage>;
}
