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
    title: "Estrutura Técnica do CRM One",
    description: "Arquitetura completa, instalação no IIS, integração SAP, bancos suportados e requisitos técnicos",
    checklist: [
      "Compreender onde o CRM One é instalado (IIS) e ambiente de integração",
      "Entender a comunicação em tempo real com SAP e processamento em background",
      "Conhecer os bancos de dados suportados (SQL Server 2016-2022, SAP HANA)",
      "Identificar a versão mínima do SAP Business One (9.3+)",
      "Revisar requisitos de hardware e especificações técnicas",
      "Analisar o diagrama de comunicação CRM One ↔ SAP interativo",
      "Estudar configurações de balancers e variáveis do sistema",
      "Verificar domínios obrigatórios para funcionamento completo"
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