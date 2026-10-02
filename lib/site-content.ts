export const contact = {
  email: "contato@sertaomaker.com",
  programEmail: "isa@ifsertao-pe.edu.br",
  address: "BR-232, km 504, sentido Recife, Zona Rural — Salgueiro/PE · CEP 56000-000",
  campusContact: "https://ifsertaope.edu.br/salgueiro/contatos/",
};

export function emailLink(subject: string, program = false) {
  return `mailto:${program ? contact.programEmail : contact.email}?subject=${encodeURIComponent(subject)}`;
}

export const sources = {
  preIncubation: "https://ifsertaope.edu.br/editais/edital-n-o-122-2026/",
  preRegulation: "https://ifsertaope.edu.br/wp-content/uploads/2026/09/Edital.pdf",
  amendment: "https://ifsertaope.edu.br/wp-content/uploads/2026/09/retificacao_01_edital_122_2026_.pdf",
  incubation: "https://ifsertaope.edu.br/editais/edital-n-191-2025-programa-de-incubacao-sertao-inovador/",
  incubationRegulation: "https://ifsertaope.edu.br/wp-content/uploads/2025/12/Regulamento_SertaoInovador_v4_assinado-1.pdf",
  previousCycle: "https://ifsertaope.edu.br/editais/edital-n-o-45-2026/",
  coordination: "https://ifsertaope.edu.br/wp-content/uploads/2026/05/retificacao_edital_45_2026_assinado.pdf",
  selection2023: "https://portalantigo.ifsertaope.edu.br/images/Campus_Salgueiro/1-Editais/2023/Janeiro/Resultado_etapa2-972ea5c11d854a3e98b2a5d23c7def01.pdf",
  sigma: "https://portalantigo.ifsertaope.edu.br/index.php/campus/salgueiro/15623-premiacao-2",
  network2024: "https://ifsertaope.edu.br/programa-sertao-inovador-powered-by-inovativa-apoiara-negocios-inovadores-em-fases-iniciais-da-regiao-de-pernambuco/",
  oldSite: "https://www.sertaomaker.com.br/",
};

export const cycle = {
  name: "Pré-incubação 2026.2",
  notice: "Edital nº 122/2026",
  checkedAt: "02/10/2026",
  deadline: "05/10/2026",
  // Date-only deadline: stop advertising participation once the published day has ended in Brasília.
  closesAt: "2026-10-06T00:00:00-03:00",
  timeline: [
    ["Prazo de inscrição indicado na retificação", "05/10/2026"],
    ["Avaliação e seleção", "06 a 10/10/2026"],
    ["Resultado preliminar previsto", "12/10/2026"],
    ["Recursos", "13 e 14/10/2026"],
    ["Resultado final previsto", "16/10/2026"],
    ["Capacitação e mentorias", "19/10 a 07/12/2026"],
    ["Demoday previsto", "16/12/2026"],
  ],
};

export function cycleStatus(now = new Date()) {
  const deadlinePassed = now.getTime() >= new Date(cycle.closesAt).getTime();
  return {
    deadlinePassed,
    label: deadlinePassed ? "Prazo publicado encerrado" : "Prazo prorrogado: 05 de outubro",
    action: deadlinePassed ? "Consultar seleção e comunicados" : "Conferir edital e inscrição",
  };
}

export const preIncubationFaq = [
  ["Quem pode participar da edição 2026.2?", "Projetos inovadores em ideação ou validação, representados por pessoa maior de idade, residente em Pernambuco e com capacidade de representar o projeto. Não é preciso ser estudante do IFSertãoPE. Há até 40 vagas, com 50% reservadas a projetos vinculados ao Sertão Pernambucano, conforme o edital."],
  ["Preciso ter CNPJ ou uma equipe formada?", "O CNPJ não é obrigatório. Se o projeto já tiver empresa registrada, informe os dados no formulário e confira os limites de elegibilidade. A inscrição é feita pelo responsável pelo projeto; a composição e a experiência da equipe são avaliadas na seleção."],
  ["Tem custo ou participação societária?", "As atividades do programa são gratuitas e não exigem participação societária (equity). Internet, deslocamento e outros custos pessoais não são custeados pelo programa. Apoios externos seguem suas próprias condições."],
  ["Quanto tempo dura e como acontecem as atividades?", "A edição 2026.2 prevê cerca de oito semanas de capacitação, preferencialmente remota, com possibilidade de encontros presenciais em comum acordo. Reserve tempo para formações, mentorias, testes com clientes e entregas. O calendário detalhado é comunicado aos selecionados; não há carga horária semanal fixa informada no edital."],
  ["O que preciso entregar?", "As atividades solicitadas durante o ciclo, o diagnóstico de maturidade quando solicitado e a apresentação do projeto no Demoday, encontro com uma banca e atores do ecossistema. Também há pesquisas obrigatórias de acompanhamento após o programa."],
  ["Concluir a pré-incubação garante vaga na incubação?", "Não. A conclusão das atividades qualifica o projeto como pré-incubado. O ingresso na incubação depende do diagnóstico de maturidade, de vagas disponíveis e de edital específico."],
  ["Como é feita a seleção?", "São avaliadas a equipe, o problema ou oportunidade de mercado, a solução e proposta de valor e a inovação. A nota mínima para estar apto à seleção é 60 pontos; classificação e reserva de vagas seguem o edital."],
  ["Onde acompanho inscrições, resultados e mudanças?", "Na página de oportunidades e no portal oficial do IFSertãoPE. Leia o edital e as retificações antes de se inscrever. Dúvidas formais sobre o processo seletivo devem ser enviadas para isa@ifsertao-pe.edu.br."],
];

export const cases = [
  {
    slug: "sigma", name: "Sigma", category: "Agricultura familiar · tecnologia", period: "Registro de 2023",
    summary: "Tecnologia aplicada à irrigação, à conectividade rural e à comercialização de produtos agrícolas.",
    problem: "Agricultores familiares precisam de ferramentas para gerir a água, acessar conectividade e comercializar a produção.",
    solution: "O projeto propõe integrar sensores e inteligência artificial à irrigação, redes comunitárias para acesso à internet e um aplicativo de precificação e comercialização.",
    support: "A notícia institucional registra desenvolvimento no Campus Salgueiro, dentro da incubadora Maker, com apoio do IFSertãoPE, FACEPE, Oficinas 4.0, Lócus de Inovação do Sertão Central e GPRO.",
    result: "Terceiro lugar no Prêmio AgroInnova 2023, durante o Painel Telebrasil Innovation, em junho de 2023.",
    source: sources.sigma,
  },
  {
    slug: "salgs-turismo", name: "SALGS Turismo", category: "Empreendedorismo · seleção", period: "Registro de 2022–2023",
    summary: "Iniciativa reconhecida no Hackasertão e selecionada para o processo de incubação de 2023.",
    problem: "O resultado público da seleção não detalha o problema ou o público atendido pelo projeto.",
    solution: "A solução e os serviços precisam ser apresentados pela equipe do empreendimento para uma descrição atualizada.",
    support: "O resultado da etapa 2 registra a obtenção de uma vaga no processo de incubação como premiação no Hackasertão 2022.",
    result: "Primeiro lugar no Hackasertão 2022 e inclusão na seleção de 2023, conforme o documento institucional.",
    source: sources.selection2023,
  },
];

export const selected2023 = ["AICURY", "CESTA ORGÂNICA", "CONECTA AGRO", "FALA CIDADÃO", "INTERMED", "MOTOR PET", "PETFRIENDLY", "PLATAFORMA DEMÉTER", "PREVMOD", "PROJETO DEFESA", "ROBOTRÔNICA", "ROPE - IHS", "SALGS TURISMO", "SERTÃOCODE", "SIMENERGY", "VIDA PLENA"];

export const guides = [
  {
    slug: "tenho-uma-ideia", title: "Tenho apenas uma ideia: por onde começar?", category: "Primeiros passos", readTime: "3 min",
    intro: "Antes de investir em uma solução, descubra quem enfrenta o problema e como essa pessoa lida com ele hoje.",
    sections: [
      { title: "Comece pelo problema", text: "Descreva uma situação concreta: quem tem a dificuldade, quando ela aparece e o que ela impede. Uma frase útil é: ‘Pessoas que ___ têm dificuldade para ___ quando ___.’" },
      { title: "Converse com o público", text: "Pergunte sobre experiências recentes: ‘Como você resolveu isso da última vez?’ e ‘O que foi mais difícil?’. Registre comportamentos e exemplos. Evite conduzir a conversa para receber elogios à ideia." },
      { title: "Escolha uma hipótese para testar", text: "Uma hipótese é algo que você acredita, mas ainda precisa verificar. Exemplo: pequenos produtores precisam comparar preços antes de vender. Defina qual observação ajudaria a confirmar ou rever essa hipótese." },
      { title: "Faça um teste pequeno", text: "Você pode começar com um desenho, uma demonstração ou um serviço manual. Registre o que o teste ensinou e ajuste a proposta antes de investir em desenvolvimento." },
    ],
  },
  {
    slug: "pre-incubacao-ou-incubacao", title: "Pré-incubação ou incubação: qual caminho faz sentido?", category: "Programas", readTime: "3 min",
    intro: "O estágio da iniciativa ajuda a escolher o tipo de apoio. Os critérios de ingresso são definidos em cada edital.",
    sections: [
      { title: "Quando a pré-incubação faz sentido", text: "Você ainda está entendendo o problema, escolhendo o público ou testando uma ideia. O foco é reunir evidências e estruturar uma proposta de negócio." },
      { title: "Quando olhar para a incubação", text: "Você já realizou testes e tem uma solução em validação ou uma operação inicial. O foco passa a incluir estratégia, organização do negócio, indicadores e desenvolvimento da solução." },
      { title: "MVP não precisa ser um produto completo", text: "MVP significa produto mínimo viável: uma versão simples da solução usada para testar uma hipótese com usuários reais. Pode ser um protótipo funcional ou uma entrega manual do serviço." },
      { title: "A passagem depende de avaliação", text: "Concluir a pré-incubação não garante ingresso na incubação. Confira o diagnóstico de maturidade, as vagas e as regras da seleção específica antes de planejar o próximo ciclo." },
    ],
  },
  {
    slug: "prepare-sua-proposta", title: "Como preparar sua proposta para uma seleção", category: "Editais", readTime: "4 min",
    intro: "Uma proposta clara permite compreender o problema, a solução e a capacidade da equipe para executar o projeto.",
    sections: [
      { title: "Leia as regras da edição", text: "Confira público elegível, prazo atualizado, documentos e critérios de avaliação. Leia também as retificações. Preparar uma proposta não substitui o envio no formulário oficial." },
      { title: "Explique problema e público", text: "Mostre quem vive o problema e apresente evidências: entrevistas, observações ou dados com fonte e data. Diferencie o que já foi testado do que ainda é hipótese." },
      { title: "Apresente a proposta de valor", text: "Proposta de valor é o benefício que a solução oferece ao público. Explique como ela funciona, por que faz sentido e como se diferencia das alternativas já usadas." },
      { title: "Mostre a capacidade de execução", text: "Apresente as competências da equipe, o estágio do projeto e os próximos passos. Use resultados verificáveis; evite prometer vendas, investimentos ou impactos que ainda não ocorreram." },
      { title: "Revise antes de enviar", text: "Confira todos os campos e links. Se enviar um vídeo, respeite as regras da edição e evite informações confidenciais. Guarde a confirmação do envio e acompanhe o e-mail cadastrado." },
    ],
  },
  {
    slug: "teste-antes-de-investir", title: "Como testar uma solução antes de investir", category: "Validação", readTime: "3 min",
    intro: "Validação é o processo de buscar evidências com o público para decidir se uma solução merece ser desenvolvida ou ajustada.",
    sections: [
      { title: "Defina a pergunta", text: "Escolha uma incerteza específica: o público compreende a proposta? Consegue usar a solução? Precisa do benefício oferecido? Um teste deve ajudar a tomar uma decisão." },
      { title: "Escolha a versão mais simples", text: "Use um desenho de tela, modelo físico ou simulação do serviço. Explique que se trata de um teste. Em projetos que envolvem saúde ou segurança, busque orientação técnica antes de qualquer aplicação real." },
      { title: "Observe ações", text: "Peça que a pessoa realize uma tarefa e observe dificuldades. Interesse declarado não comprova compra; registre o que ocorreu e o contexto do teste." },
      { title: "Decida o próximo passo", text: "Compare as observações com a hipótese inicial. Ajuste a solução, reveja o público ou planeje outro teste. Guarde os aprendizados para compartilhar com mentores e parceiros." },
    ],
  },
];
