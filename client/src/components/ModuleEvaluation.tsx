import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ModuleEvaluationProps {
  moduleNumber: number;
  onEvaluationComplete?: (passed: boolean, score: number) => void;
  onCancel?: () => void;
}

interface AttemptStatus {
  canAttempt: boolean;
  remainingTime?: number;
}

// Questions for each module

const moduleQuestions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      question: "Qual é a área de atuação principal da empresa DWU?",
      options: [
        "Agronegócio",
        "Soluções financeiras",
        "Desenvolvimento de soluções integradas com SAP Business One",
        " Vendas diretas e televendas",
      ],
      correctAnswer: 2,
    },
    {
      id: 2,
      question: "A quem se destina principalmente o sistema CRM One?",
      options: [
        "Clientes finais que compram SAP",
        "Equipes comerciais e de atendimento ao cliente",
        "Somente programadores SAP",
        "Departamentos financeiros e fiscais",
      ],
      correctAnswer: 0,
    },
    {
      id: 3,
      question: "O que caracteriza a cultura da DWU segundo a apresentação?",
      options: [
        "Foco total em entregas técnicas, sem atenção ao cliente",
        "Processos inflexíveis para todos os setores",
        " Proximidade com o cliente, soluções sob medida e inovação constante",
        "Isolamento entre times e comunicação restrita",
      ],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: "Qual é o principal produto da DWU IT Solutions?",
      options: [
        "SAP Business One",
        "CRM One",
        "Oracle ERP",
        "Microsoft Dynamics",
      ],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: "Há quanto tempo a DWU está no mercado?",
      options: ["Desde 2020", "Desde 2015", "Há mais de 10 anos", "Desde 2009"],
      correctAnswer: 2,
    },
    {
      id: 6,
      question:
        "O que significa o axioma “Alta performance é obrigação, não exceção”?",
      options: [
        "Que apenas líderes precisam entregar bons resultados",
        " Que a empresa tolera variações de desempenho",
        "Que o desempenho otimizado deve ser padrão e diferencial no mercado",
        "Que performance é um bônus, não uma exigência",
      ],
      correctAnswer: 2,
    },
    {
      id: 7,
      question: "O conceito de 'Colaboração' na cultura DWU significa:",
      options: [
        "Trabalhar individualmente",
        "Juntos somos mais fortes",
        "Competir entre equipes",
        "Focar apenas nos próprios resultados",
      ],
      correctAnswer: 1,
    },
    {
      id: 8,
      question:
        "De acordo com o axioma “Usuário no centro, sempre”, quais são os pilares da experiência DWU",
      options: [
        "Escalabilidade e lucro",
        "Segurança e controle",
        "Empatia, simplicidade e eficiência",
        "Design, marketing e autonomia",
      ],
      correctAnswer: 2,
    },
    {
      id: 9,
      question:
        " O que se entende por “Conhecimento é a base do nosso impacto”?",
      options: [
        "A experiência do cliente vem antes do domínio do produto",
        "Só especialistas devem buscar conhecimento",
        "Dominar os produtos DWU torna os colaboradores referência no mercado",
        "Conhecimento deve ser centralizado na liderança",
      ],
      correctAnswer: 2,
    },
    {
      id: 10,
      question:
        "Segundo o axioma “Aprender é a única constante”, o que é esperado dos colaboradores?",
      options: [
        "Que dominem tudo ao entrar na empresa",
        "Que priorizem tarefas repetitivas",
        "Que mantenham um compromisso contínuo com o aprendizado",
        "Que aprendam somente em treinamentos formais",
      ],
      correctAnswer: 2,
    },
    {
      id: 11,
      question:
        "Quando a empresa afirma que “usuário no centro, sempre”, isso significa:",
      options: [
        "Entregar funcionalidades complexas acima da simplicidade",
        "Priorizar a experiência do usuário com empatia e eficiência",
        "Fazer o necessário apenas para cumprir entregas",
        "Esperar que o usuário se adapte ao sistema",
      ],
      correctAnswer: 1,
    },
    {
      id: 12,
      question:
        "Qual comportamento é incentivado com “Ensinar algo a alguém todos os dias”?",
      options: [
        " Competição interna entre colegas",
        "Compartilhamento de conhecimento como cultura contínua",
        "Criar materiais técnicos somente quando solicitado",
        " Deixar que apenas líderes ensinem",
      ],
      correctAnswer: 1,
    },
    {
      id: 13,
      question: "Comunicação anti-fragilidade” implica em:",
      options: [
        "Evitar conversas difíceis para manter o clima",
        "Dar e receber feedbacks com maturidade, mesmo em momentos desafiadores",
        "Esconder problemas até ter certeza da solução",
        " Sempre falar diretamente, sem pensar no impacto",
      ],
      correctAnswer: 1,
    },
    {
      id: 14,
      question:
        "Qual a postura correta diante de erros, segundo os axiomas do colaborador?",
      options: [
        "Ocultar os erros para evitar desgaste",
        "Aceitar erros apenas se forem inéditos e gerar aprendizado",
        "Errar sem limites e sem responsabilidade",
        "Replicar o que já não deu certo antes",
      ],
      correctAnswer: 1,
    },
    {
      id: 15,
      question: "O que mais aproxima o colaborador dos valores da DWU?",
      options: [
        "Executar bem tarefas técnicas, sem se importar com cultura",
        "Aderir aos axiomas da empresa e do time com atitude prática",
        "Focar só nas entregas, sem interagir com os demais",
        "Estudar apenas ferramentas, não comportamentos",
      ],
      correctAnswer: 1,
    },
    {
      id: 16,
      question: "Como a DWU enxerga o papel da energia na performance?",
      options: [
        "Um colaborador cansado entrega mais",
        "Energia não é fator decisivo para resultados",
        "Energia constante move o time e impulsiona o crescimento",
        " Energia emocional é irrelevante no contexto técnico",
      ],
      correctAnswer: 2,
    },
    {
      id: 17,
      question:
        "Qual o papel dos dados, segundo o axioma “Dados são nossa bússola estratégica”?",
      options: [
        "Validar sentimentos pessoais",
        "Evitar erros simples",
        "Guiar decisões com base em análises concretas",
        "Acompanhar apenas indicadores de venda",
      ],
      correctAnswer: 2,
    },
    {
      id: 18,
      question:
        "O que é priorizado na fase de “Cuidado personalizado com o cliente”?",
      options: [
        "Rapidez na entrega do sistema",
        "Redução de custo com suporte",
        "Entendimento profundo do contexto do cliente antes da implantação",
        "Aplicação direta do manual técnico",
      ],
      correctAnswer: 2,
    },
    {
      id: 19,
      question:
        "Qual a diferença entre “Cuidado personalizado” e “Atendimento humanizado”?",
      options: [
        " Um é técnico, o outro é comercial",
        "Um visa análise do contexto antes da entrega; o outro busca conexão com a história do cliente",
        "Não há diferença prática entre os dois",
        "O atendimento humanizado ocorre apenas com clientes VIP",
      ],
      correctAnswer: 1,
    },
    {
      id: 20,
      question: "O que acontece se a fase de perfilamento for mal executada?",
      options: [
        "O cliente será automaticamente reencaminhado",
        "A fase de produto se ajusta automaticamente",
        "Há risco de oferecer soluções desalinhadas com a realidade do cliente",
        "O cliente nem perceberá diferença",
      ],
      correctAnswer: 2,
    },
  ],
  2: [
    {
      id: 1,
      question: "Onde o CRM One é instalado?",
      options: [
        "Apache Server",
        "Internet Information Services (IIS)",
        "Nginx",
        "Tomcat",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "O CRM One realiza integração com SAP em:",
      options: [
        "Apenas tempo real",
        "Apenas background",
        "tempo real + processamento background",
        "Sincronização diária",
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "Quais versões do SQL Server são suportadas?",
      options: ["2012 a 2019", "2016 a 2022", "2014 a 2020", "2018 a 2024"],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "Qual a versão mínima do SAP Business One suportada?",
      options: ["9.0", "9.1", "9.2", "9.3"],
      correctAnswer: 3,
    },
    {
      id: 5,
      question:
        "Qual é uma limitação comum do DI-Server em relação ao Service Layer?",
      options: [
        "Não funciona em rede local",
        "Não permite autenticação",
        "Possui performance inferior e usa tecnologia mais antiga",
        "Não consegue acessar dados de clientes",
      ],
      correctAnswer: 2,
    },
    {
      id: 6,
      question: "O banco SAP HANA é utilizado como:",
      options: [
        "Servidor web",
        "In-Memory Database",
        "Load balancer",
        "Sistema de filas",
      ],
      correctAnswer: 1,
    },
    {
      id: 7,
      question: "Load Balancer (balencers), servem para:",
      options: [
        "Backup de dados",
        "Distribuição inteligente de carga",
        "Controle de versões",
        "Monitoramento",
      ],
      correctAnswer: 1,
    },
    {
      id: 8,
      question: "Qual domínio é obrigatório para consulta de CEP?",
      options: [
        "receita.ws.com.br",
        "viacep.com.br/ws",
        "dwu.com.br",
        "sap.com.br",
      ],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: "O processamento em segundo plano utiliza:",
      options: [
        "APIs síncronas",
        "Fila de sincronização",
        "Banco temporário",
        "Cache local",
      ],
      correctAnswer: 1,
    },
    {
      id: 10,
      question:
        "Qual é o protocolo padrão utilizado por sites               hospedados no IIS?",
      options: ["HTTP/HTTPS", "FTP", "SSL/TLS", "SMTP"],
      correctAnswer: 0,
    },
    {
      id: 11,
      question:
        "O B1WS (Business One Web Services) utiliza qual forma de comunicação?",
      options: ["JSON", "SOAP com XML", "CSV", "YAML"],
      correctAnswer: 1,
    },
    {
      id: 12,
      question:
        "Qual item abaixo faz parte da arquitetura de comunicação com o SAP?:",
      options: [
        "Active Reports",
        "Service Layer",
        "SQL Viewers",
        "Task Monito",
      ],
      correctAnswer: 1,
    },
    {
      id: 13,
      question: "Serviços Windows são responsáveis por:",
      options: [
        "Interface web",
        "Processamento em background",
        "Autenticação",
        "Logs",
      ],
      correctAnswer: 1,
    },
    {
      id: 14,
      question: "O domínio receita.ws.com.br é usado para:",
      options: ["Consulta CEP", "Consulta CNPJ", "Autenticação", "Logs"],
      correctAnswer: 1,
    },
    {
      id: 15,
      question: "As configurações de balancers são definidas em:",
      options: [
        "Banco de dados",
        "Arquivos JSON",
        "Registry Windows",
        "XML files",
      ],
      correctAnswer: 1,
    },
    {
      id: 16,
      question: "Service Layer é uma API nativa do:",
      options: ["CRM One", "SQL Server", "SAP Business One", "IIS"],
      correctAnswer: 2,
    },
    {
      id: 17,
      question: "A comunicação em tempo real garante:",
      options: [
        "Backup automático",
        "Sincronização instantânea",
        "Logs detalhados",
        "Cache otimizado",
      ],
      correctAnswer: 1,
    },
    {
      id: 18,
      question: "dwu.com.br é necessário para:",
      options: [
        "Consultas externas",
        "Autenficação de licença",
        "Backup",
        "Monitoramento",
      ],
      correctAnswer: 1,
    },
    {
      id: 19,
      question: "A estrutura do CRM One pode ser composta por:",
      options: [
        "Apenas banco de dados e scripts SQL",
        "Interface web e relatórios em Excel",
        "API Service e arquivos .bat",
        "Serviços/Balancers",
      ],
      correctAnswer: 3,
    },
    {
      id: 20,
      question:
        "Qual pasta geralmente abriga os arquivos de serviço da API no CRM One?:",
      options: ["api_crm", "DWUAPIV2_Service", "ws_root", "crm_files"],
      correctAnswer: 1,
    },
  ],
  3: [
    {
      id: 1,
      question: "Qual é o principal diferencial do CRM One em relação aos concorrentes?",
      options: [
        "Interface mais bonita",
        "Integração 100% nativa com SAP Business One",
        "Preço mais baixo",
        "Marketing mais agressivo",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "O que significa a certificação SAP Official para o CRM One?",
      options: [
        "É apenas um selo de marketing",
        "Garante compatibilidade total e suporte oficial da SAP",
        "É obrigatório para todos os CRMs",
        "Não tem importância prática",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "Onde ficam armazenados os dados do CRM One?",
      options: [
        "Na nuvem da Amazon",
        "Nos servidores da DWU",
        "Na infraestrutura da própria empresa cliente",
        "No Google Cloud",
      ],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: "Qual é a principal vantagem da interface WEB e Mobile do CRM One?",
      options: [
        "É gratuita",
        "Funciona apenas online",
        "É intuitiva e oferece acesso completo",
        "Só funciona no Internet Explorer",
      ],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "Como o CRM One evolui junto com o SAP Business One?",
      options: [
        "Precisa de atualizações manuais constantes",
        "Evolui automaticamente sem quebrar funcionalidades",
        "Não acompanha as atualizações do SAP",
        "Requer reprogramação completa a cada versão",
      ],
      correctAnswer: 1,
    },
    {
      id: 6,
      question: "Qual é o benefício dos dashboards customizáveis do CRM One?",
      options: [
        "São apenas decorativos",
        "Funcionam apenas com Crystal Reports",
        "Oferecem total autonomia na personalização sem dependência de terceiros",
        "Só podem ser alterados pela DWU",
      ],
      correctAnswer: 2,
    },
    {
      id: 7,
      question: "O que diferencia os relatórios do CRM One no aplicativo mobile?",
      options: [
        "Só funcionam online",
        "São limitados e básicos",
        "Estão disponíveis para uso offline",
        "Não existem relatórios no mobile",
      ],
      correctAnswer: 2,
    },
    {
      id: 8,
      question: "O que significa 'Visão 360 graus dos clientes' no CRM One?",
      options: [
        "Apenas dados básicos de contato",
        "Visão completa e unificada de cada cliente",
        "Relatórios em formato circular",
        "Acesso limitado aos dados",
      ],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: "Qual vantagem do CRM One em relação aos concorrentes como Salesforce?",
      options: [
        "Mesma funcionalidade por preço menor",
        "Interface mais colorida",
        "Integração nativa vs integração via API",
        "Atendimento em mais idiomas",
      ],
      correctAnswer: 2,
    },
    {
      id: 10,
      question: "Como funciona a comunicação do CRM One com o SAP?",
      options: [
        "Através de APIs externas e sincronização",
        "Dados em tempo real sem intermediários",
        "Apenas por importação manual",
        "Via planilhas Excel",
      ],
      correctAnswer: 1,
    },
    {
      id: 11,
      question: "Qual é o compromisso da DWU IT Solutions com o CRM One?",
      options: [
        "Suporte apenas durante horário comercial",
        "15 anos de expertise especializada em SAP Business One",
        "Foco em múltiplas tecnologias",
        "Suporte terceirizado",
      ],
      correctAnswer: 1,
    },
    {
      id: 12,
      question: "O que garante a segurança dos dados no CRM One?",
      options: [
        "Criptografia básica",
        "Dados ficam na nuvem pública",
        "Banco de dados instalado na infraestrutura do cliente",
        "Backup apenas semanal",
      ],
      correctAnswer: 2,
    },
    {
      id: 13,
      question: "Qual é a principal diferença entre 'Cuidado personalizado' e 'Atendimento humanizado'?",
      options: [
        "São exatamente a mesma coisa",
        "Um é técnico, outro é comercial",
        "Um analisa contexto antes da entrega, outro busca conexão com a história do cliente",
        "Não há diferença prática",
      ],
      correctAnswer: 2,
    },
    {
      id: 14,
      question: "Como o CRM One se posiciona em relação ao custo total de propriedade (TCO)?",
      options: [
        "TCO mais alto que concorrentes",
        "TCO similar aos concorrentes",
        "TCO mais baixo devido à integração nativa",
        "TCO irrelevante para a decisão",
      ],
      correctAnswer: 2,
    },
    {
      id: 15,
      question: "Qual é a vantagem dos filtros customizáveis do CRM One?",
      options: [
        "São apenas visuais",
        "Filtros de itens com estoque, dados da última compra e agrupamento",
        "Funcionam apenas com produtos específicos",
        "São limitados a 5 filtros por usuário",
      ],
      correctAnswer: 1,
    },
    {
      id: 16,
      question: "O que torna o CRM One único no mercado de CRM para SAP?",
      options: [
        "É o mais barato",
        "Tem mais funcionalidades",
        "É a única solução CRM certificada oficialmente pela SAP",
        "Tem melhor marketing",
      ],
      correctAnswer: 2,
    },
    {
      id: 17,
      question: "Como funciona o envio de alertas e relatórios por e-mail no CRM One?",
      options: [
        "Manual apenas",
        "Apenas uma vez por semana",
        "Comunicação automatizada e eficiente",
        "Não possui esta funcionalidade",
      ],
      correctAnswer: 2,
    },
    {
      id: 18,
      question: "Qual é o principal benefício da arquitetura sem APIs externas?",
      options: [
        "Menor custo de licenciamento",
        "Interface mais bonita",
        "Performance superior e estabilidade",
        "Facilita a programação",
      ],
      correctAnswer: 2,
    },
    {
      id: 19,
      question: "O que significa 'ROI Imediato' prometido pelo CRM One?",
      options: [
        "Retorno em 2 anos",
        "Resultados positivos nos primeiros 30 dias",
        "Apenas economia de custos",
        "ROI apenas teórico",
      ],
      correctAnswer: 1,
    },
    {
      id: 20,
      question: "Por que o CRM One é considerado 'A Solução Definitiva para SAP Business One'?",
      options: [
        "É o único CRM que existe",
        "Tem o melhor preço",
        "Combina certificação SAP, integração nativa, dados seguros e 15 anos de expertise",
        "Tem interface mais moderna",
      ],
      correctAnswer: 2,
    },
  ],
  4: [
    {
      id: 1,
      question: "Quantos tipos de manuais estão disponíveis na biblioteca?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Qual manual contém configurações avançadas?",
      options: [
        "Manual do Usuário",
        "Manual Técnico",
        "Manual de Integração",
        "Manual Básico",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "O Manual de Integração aborda:",
      options: [
        "Uso básico",
        "Configurações",
        "APIs e conexões SAP",
        "Relatórios",
      ],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: "Qual é o domínio da documentação?",
      options: [
        "docs.crm-one.com.br",
        "help.crm-one.com.br",
        "manual.crm-one.com.br",
        "support.crm-one.com.br",
      ],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: "A base de conhecimento está em qual domínio?",
      options: [
        "docs.crm-one.com.br",
        "kb.crm-one.com.br",
        "help.crm-one.com.br",
        "wiki.crm-one.com.br",
      ],
      correctAnswer: 1,
    },
    {
      id: 6,
      question: "Quantos módulos de vídeos tutoriais são mencionados?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 1,
    },
    {
      id: 7,
      question: "O módulo de vendas aborda:",
      options: [
        "Apenas cadastros",
        "Gestão completa do ciclo de vendas",
        "Apenas relatórios",
        "Apenas propostas",
      ],
      correctAnswer: 1,
    },
    {
      id: 8,
      question: "O módulo financeiro inclui:",
      options: [
        "Apenas pagamentos",
        "Apenas recebimentos",
        "Controle financeiro e relatórios",
        "Apenas impostos",
      ],
      correctAnswer: 2,
    },
    {
      id: 9,
      question: "Para obter a certificação DWU CRM One Expert, é necessário:",
      options: [
        "Apenas assistir vídeos",
        "Apenas ler manuais",
        "Completar todos os exercícios",
        "Apenas fazer prova",
      ],
      correctAnswer: 2,
    },
    {
      id: 10,
      question: "O exercício de simulação do sistema permite:",
      options: [
        "Apenas visualizar",
        "Praticar funcionalidades",
        "Apenas ler",
        "Apenas assistir",
      ],
      correctAnswer: 1,
    },
    {
      id: 11,
      question: "Crystal Reports está relacionado a:",
      options: ["Customizações", "Relatórios", "Workflows", "APIs"],
      correctAnswer: 1,
    },
    {
      id: 12,
      question: "Scripts e personalizações fazem parte de:",
      options: ["Relatórios", "Customizações", "Workflows", "APIs"],
      correctAnswer: 1,
    },
    {
      id: 13,
      question: "A automação de processos é feita através de:",
      options: ["Relatórios", "Customizações", "Workflows", "Banco"],
      correctAnswer: 2,
    },
    {
      id: 14,
      question: "A avaliação final está relacionada à:",
      options: ["Customização", "Relatórios", "Workflows", "Certificação"],
      correctAnswer: 3,
    },
    {
      id: 15,
      question: "BI está relacionado a qual área?",
      options: ["Customizações", "Relatórios", "Workflows", "APIs"],
      correctAnswer: 1,
    },
    {
      id: 16,
      question: "O setup e configuração de APIs é abordado em qual vídeo?",
      options: [
        "Módulo Vendas",
        "Módulo Financeiro",
        "Integração SAP",
        "Módulo Relatórios",
      ],
      correctAnswer: 2,
    },
    {
      id: 17,
      question: "A API Reference está disponível em:",
      options: [
        "docs.crm-one.com.br",
        "kb.crm-one.com.br",
        "api.crm-one.com.br",
        "dev.crm-one.com.br",
      ],
      correctAnswer: 2,
    },
    {
      id: 18,
      question: "Os exercícios de API são classificados como:",
      options: ["Básicos", "Práticos", "Teóricos", "Opcionais"],
      correctAnswer: 1,
    },
    {
      id: 19,
      question: "O conteúdo mais completo está no:",
      options: ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4"],
      correctAnswer: 3,
    },
    {
      id: 20,
      question: "Qual é o objetivo principal do Módulo 4?",
      options: [
        "Apresentar a empresa",
        "Mostrar estrutura técnica",
        "Comparar concorrentes",
        "Detalhar funcionalidades",
      ],
      correctAnswer: 3,
    },
  ],
};

export default function ModuleEvaluation({
  moduleNumber,
  onEvaluationComplete,
  onCancel,
}: ModuleEvaluationProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useLocation();
  const [attemptStatus, setAttemptStatus] = useState<AttemptStatus>({
    canAttempt: true,
  });
  const [isCheckingAttempts, setIsCheckingAttempts] = useState(false);
  const { user } = useAuth();
  const { progress: userProgress, updateProgress } = useProgress();

  const questions = moduleQuestions[moduleNumber] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleCancel = () => {
    console.log("🔙 Botão Voltar clicado - iniciando redirecionamento");

    // Prevenir múltiplos cliques
    if (loading) return;

    // Callback direto se disponível
    if (onCancel) {
      console.log("🔙 Usando callback onCancel");
      try {
        onCancel();
      } catch (error) {
        console.error("🔙 Erro no callback onCancel:", error);
        // Fallback para redirecionamento direto
        setLocation("/onboarding");
      }
      return;
    }

    // Redirecionamento direto e simples
    try {
      console.log("🔙 Redirecionando para /onboarding");
      setLocation("/onboarding");
    } catch (error) {
      console.error("🔙 Erro no redirecionamento:", error);
      // Fallback para window.location
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 100);
    }
  };

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    const questionId = currentQuestion?.id;
    if (questionId && answers[questionId] !== undefined) {
      setSelectedAnswer(answers[questionId].toString());
    } else {
      setSelectedAnswer("");
    }
  }, [currentQuestionIndex, answers, currentQuestion?.id]);

  useEffect(() => {
    const checkAttempts = async () => {
      setIsCheckingAttempts(true);
      try {
        if (user?.userId) {
          console.log(
            "🔍 Verificando tentativas para userId:",
            user.userId,
            "módulo:",
            moduleNumber,
          );
          const response = await fetch(
            `/api/evaluations/attempts?userId=${user.userId}&moduleId=${moduleNumber}`,
          );
          if (response.ok) {
            const data = await response.json();
            console.log("✅ Status de tentativas recebido:", data);
            setAttemptStatus(data);
          } else {
            console.error("Failed to fetch attempt status");
            setAttemptStatus({ canAttempt: true }); // Permitir tentativa em caso de erro
          }
        }
      } catch (error) {
        console.error("Error checking attempts:", error);
        setAttemptStatus({ canAttempt: true }); // Permitir tentativa em caso de erro
      } finally {
        setIsCheckingAttempts(false);
      }
    };

    checkAttempts();
  }, [user?.userId, moduleNumber]);

  const handleNext = async () => {
    if (selectedAnswer !== "") {
      const answerIndex = parseInt(selectedAnswer);
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerIndex }));

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer("");
      } else {
        setLoading(true);

        const newAnswers = { ...answers, [currentQuestion.id]: answerIndex };
        const correctAnswersCount = questions.filter(
          (q) => newAnswers[q.id] === q.correctAnswer,
        ).length;
        const finalScore = Math.round(
          (correctAnswersCount / questions.length) * 100,
        );
        const passed = finalScore >= 90;
        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        try {
          if (user) {
            // Garantir que userId seja um número válido
            const numericUserId = parseInt(user.userId.replace("user-", ""));
            if (isNaN(numericUserId)) {
              throw new Error("ID de usuário inválido");
            }

            const evaluationData = {
              userId: numericUserId,
              moduleId: moduleNumber,
              score: finalScore,
              totalQuestions: questions.length,
              correctAnswers: correctAnswersCount,
              passed,
              answers: newAnswers,
              timeSpent,
              completedAt: new Date().toISOString(),
            };

            console.log("🎯 About to save evaluation:");
            console.log("🎯 User object:", user);
            console.log("🎯 Evaluation data:", evaluationData);
            console.log("🎯 Making POST to /api/evaluations");

            const response = await fetch("/api/evaluations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(evaluationData),
            });

            console.log("🎯 Response status:", response.status);
            console.log("🎯 Response ok:", response.ok);

            if (!response.ok) {
              const errorText = await response.text();
              console.error("🎯 Response error:", errorText);
              throw new Error(
                `HTTP error! status: ${response.status} - ${errorText}`,
              );
            }

            const result = await response.json();
            console.log("🎯 Response result:", result);

            if (passed && userProgress) {
              const completedModules = userProgress.completedModules || [];
              if (!completedModules.includes(moduleNumber)) {
                const newCompletedModules = [...completedModules, moduleNumber];
                const nextModule =
                  moduleNumber < 4 ? moduleNumber + 1 : moduleNumber;

                console.log(
                  `✅ Módulo ${moduleNumber} completado! Próximo módulo: ${nextModule}`,
                );
                console.log(
                  `📊 Novos módulos completados:`,
                  newCompletedModules,
                );

                await updateProgress({
                  completedModules: newCompletedModules,
                  currentModule: nextModule, // Atualizar para o próximo módulo
                  moduleProgress: {
                    ...userProgress.moduleProgress,
                    [moduleNumber]: 100,
                  },
                  moduleEvaluations: {
                    ...userProgress.moduleEvaluations,
                    [moduleNumber]: {
                      score: finalScore,
                      passed,
                      completedAt: new Date().toISOString(),
                    },
                  },
                });
              }
            }
          }
        } catch (error) {
          console.error("Error saving evaluation:", error);
        } finally {
          setLoading(false);
          setScore(finalScore);
          setShowResults(true);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    const passed = score >= 90;
    if (onEvaluationComplete) {
      onEvaluationComplete(passed, score);
    } else {
      setLocation("/onboarding");
    }
  };

  if (!user?.userId) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Usuário não autenticado</p>
      </div>
    );
  }

  if (isCheckingAttempts) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Verificando tentativas disponíveis...</p>
      </div>
    );
  }

  if (!attemptStatus.canAttempt) {
    const hoursRemaining = Math.ceil(
      (attemptStatus.remainingTime || 0) / (1000 * 60 * 60),
    );

    return (
      <div className="max-w-4xl mx-auto">
        {/* Header DWU IT Academy */}
        <div className="mb-8 text-center">
          <div className="glass-effect p-6 rounded-2xl tech-border mb-6">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  DWU IT Academy
                </h1>
                <p className="text-sm text-slate-400">
                  Centro de Excelência Técnica
                </p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-blue-300">
              Avaliação - Módulo {moduleNumber}
            </h2>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="glass-effect">
          <CardContent className="p-8">
            {/* Status Icon and Title */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto border border-yellow500/30 shadow-lg">
                  <Clock size={48} className="text-yellow-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-slate-900 font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Limite de Tentativas Atingido
              </h3>
              <p className="text-slate-400 mb-6">
                Você atingiu o limite diário de avaliações para este módulo
              </p>
            </div>

            {/* Status Info */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Status da Avaliação
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Informações sobre suas tentativas
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    2/2
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Tentativas Hoje
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {hoursRemaining}h
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Tempo Restante
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    24h
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Ciclo Reset
                  </div>
                </div>
              </div>

              {hoursRemaining > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                  <p className="text-yellow-300 font-medium">
                    ⏰ Próxima tentativa disponível em{" "}
                    <strong>{hoursRemaining} hora(s)</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Learning Suggestions */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-6 text-center">
                💡 Aproveite este tempo para aprimorar seus conhecimentos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-5 hover:bg-blue-500/15 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-xl">📚</span>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">
                        Revisar Conteúdo
                      </h5>
                      <p className="text-slate-400 text-sm">
                        Releia o material do módulo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-5 hover:bg-green-500/15 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-xl">🎥</span>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">
                        Assistir Vídeos
                      </h5>
                      <p className="text-slate-400 text-sm">
                        Revise as explicações em vídeo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-5 hover:bg-purple-500/15 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 text-xl">📝</span>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">
                        Fazer Anotações
                      </h5>
                      <p className="text-slate-400 text-sm">
                        Anote pontos importantes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-5 hover:bg-orange-500/15 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-orange-400 text-xl">❓</span>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">
                        Tirar Dúvidas
                      </h5>
                      <p className="text-slate-400 text-sm">
                        Esclareça pontos confusos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCancel}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 glass-effect border-slate-600 hover:border-slate-400 text-white"
              >
                <ChevronLeft size={20} />
                Voltar ao Conteúdo
              </Button>
              <Button
                onClick={() => setLocation("/onboarding")}
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <Home size={20} />
                Ir para Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= 90;
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-effect">
          <CardContent className="p-8 text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                passed ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {passed ? (
                <Award className="text-white" size={40} />
              ) : (
                <XCircle className="text-white" size={40} />
              )}
            </div>

            <h3 className="text-2xl font-bold mb-4 text-white">
              {passed
                ? "Parabéns! Você foi aprovado!"
                : "Você não foi aprovado desta vez"}
            </h3>

            <p className="text-slate-300 mb-8">
              {passed
                ? "Você atingiu a nota mínima necessária para aprovação."
                : "Continue estudando e tente novamente. Você precisa de pelo menos 90% de acertos para ser aprovado."}
            </p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleFinish}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {passed ? "Continuar" : "Revisar"}
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <Home className="mr-2" size={16} />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header DWU IT Academy */}
      <div className="mb-8 text-center">
        <div className="glass-effect p-6 rounded-2xl tech-border mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                DWU IT Academy
              </h1>
              <p className="text-sm text-slate-400">
                Centro de Excelência Técnica
              </p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-blue-300">
            Avaliação - Módulo {moduleNumber}
          </h2>
        </div>
      </div>

      <Card className="glass-effect">
        <CardContent className="p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Questão {currentQuestionIndex + 1}
              </h3>
              <span className="text-sm text-slate-400">
                {currentQuestionIndex + 1} de {questions.length}
              </span>
            </div>
            <Progress value={progressPercentage} />
          </div>

          <div className="mb-8">
            <h4 className="text-lg mb-6 text-white">
              {currentQuestion?.question}
            </h4>

            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              className="space-y-3"
            >
              {currentQuestion?.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer border border-slate-600/30 hover:border-blue-400/50"
                  onClick={() => setSelectedAnswer(index.toString())}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="cursor-pointer flex-1 text-slate-200"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className={currentQuestionIndex === 0 ? "invisible" : ""}
            >
              <ChevronLeft className="mr-2" size={16} />
              Anterior
            </Button>

            <div className="flex gap-4">
              <Button onClick={handleCancel} variant="outline">
                Cancelar
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === "" || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading
                  ? "Salvando..."
                  : currentQuestionIndex === questions.length - 1
                    ? "Finalizar"
                    : "Próxima"}
                {!loading && currentQuestionIndex < questions.length - 1 && (
                  <ChevronRight className="ml-2" size={16} />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
