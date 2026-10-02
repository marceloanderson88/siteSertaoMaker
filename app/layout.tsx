export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "./globals.css";

const sunborn = localFont({
  src: "./fonts/Sunborn-SansOne.otf",
  variable: "--font-sunborn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Incubadora Sertão Maker | Empreendedorismo e Inovação no Sertão",
  description:
    "Conheça a Incubadora Sertão Maker e o programa SerTão Inovador. Pré-incubação, incubação, mentorias, infraestrutura e oportunidades para desenvolver ideias e negócios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body id="top" className={sunborn.variable}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
