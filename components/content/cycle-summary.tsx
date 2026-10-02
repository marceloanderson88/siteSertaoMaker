import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cycle, cycleStatus } from "@/lib/site-content";

export function CycleSummary() {
  const status = cycleStatus();
  return <section className="cycle-summary" aria-labelledby="cycle-summary-title">
    <div className="container cycle-summary__inner">
      <div><span className="status-label">{status.label}</span><h2 id="cycle-summary-title">SerTão Inovador · {cycle.name}</h2><p>Formação e mentorias gratuitas, formato remoto e até 40 projetos selecionados. Conheça os requisitos, o cronograma e os documentos oficiais.</p></div>
      <Link className="button button--primary" href="/oportunidades">{status.action}<ArrowRight aria-hidden="true" /></Link>
    </div>
  </section>;
}
