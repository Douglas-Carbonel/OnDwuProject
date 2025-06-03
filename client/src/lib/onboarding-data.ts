export interface OnboardingDay {
  day: number;
  title: string;
  description: string;
  checklist: string[];
}

export const onboardingData: OnboardingDay[] = [
  {
    day: 1,
    title: "Cultura da Empresa",
    description: "Apresentação institucional, cultura organizacional e fundamentos da DWU IT Solutions",
    checklist: [
      "Visualizar a apresentação institucional completa",
      "Compreender a história e missão da DWU",
      "Assimilar nossos valores fundamentais",
      "Conhecer a estrutura organizacional da empresa",
      "Entender nossa missão e visão estratégica",
      "Reconhecer nossas certificações e reconhecimentos"
    ]
  },
  {
    day: 2,
    title: "Estrutura do CRM One",
    description: "Arquitetura completa do sistema, banco de dados, APIs e ferramentas de suporte",
    checklist: [
      "Compreender a estrutura do banco de dados (SQL/Hana)",
      "Conhecer as APIs utilizadas (DI-Server e Service Layer)",
      "Entender a estrutura do portal web (IIS, Load Balancer, Serviços Windows)",
      "Familiarizar-se com o Notion (controle de bugs)",
      "Configurar acesso ao GLPI (sistema de chamados)",
      "Conhecer o TeamViewer e Teams (comunicação e manuais)"
    ]
  },
  {
    day: 3,
    title: "Benefícios da Ferramenta",
    description: "Pontos fortes do CRM One e comparação com concorrentes de mercado",
    checklist: [
      "Conhecer os principais diferenciais do CRM One",
      "Analisar vantagens competitivas no mercado",
      "Compreender o posicionamento estratégico",
      "Estudar casos de sucesso de clientes",
      "Revisar material em PDF com comparativos",
      "Identificar argumentos de venda técnica"
    ]
  },
  {
    day: 4,
    title: "Funcionalidades Detalhadas",
    description: "Módulo completo com manuais, vídeos, links e conteúdos detalhados da ferramenta",
    checklist: [
      "Acessar biblioteca completa de manuais",
      "Assistir vídeos tutoriais das funcionalidades",
      "Explorar links de referência técnica",
      "Praticar simulações do sistema",
      "Completar exercícios práticos",
      "Obter certificação DWU CRM One Expert"
    ]
  }
];