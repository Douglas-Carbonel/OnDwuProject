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
      question: "Qual é a missão principal da DWU IT Solutions?",
      options: [
        "Vender softwares de terceiros",
        "Transformar a gestão empresarial através de tecnologia de ponta",
        "Ser a maior empresa de TI do Brasil",
        "Focar apenas em desenvolvimento de sistemas",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Qual dos seguintes é um dos valores fundamentais da cultura DWU?",
      options: ["Competição interna", "Paixão pelo que fazemos", "Individualismo", "Lucro acima de tudo"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "A DWU IT Solutions possui quantos anos de experiência no mercado?",
      options: ["Menos de 10 anos", "Mais de 15 anos", "Exatamente 10 anos", "Mais de 25 anos"],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "Qual é o principal produto da DWU IT Solutions?",
      options: ["SAP Business One", "CRM One", "Oracle ERP", "Microsoft Dynamics"],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: "Em qual contexto a DWU atua geograficamente?",
      options: ["Apenas Brasil", "América do Sul", "Mais de 15 países", "Apenas região Sudeste"],
      correctAnswer: 2,
    },
    {
      id: 6,
      question: "Qual é o SLA (Service Level Agreement) de uptime garantido pela DWU?",
      options: ["95%", "98%", "99.9%", "100%"],
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
      question: "Aproximadamente quantos clientes ativos a DWU possui?",
      options: ["Menos de 300", "Cerca de 500", "Mais de 800", "Mais de 1000"],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: "Qual setor empresarial NÃO é mencionado como cliente da DWU?",
      options: ["Manufatura", "Varejo", "Saúde", "Educação"],
      correctAnswer: 3,
    },
    {
      id: 10,
      question: "Com qual ERP o CRM One possui integração nativa?",
      options: ["Oracle ERP", "SAP Business One", "Totvs Protheus", "Microsoft Dynamics"],
      correctAnswer: 1,
    },
    {
      id: 11,
      question: "Qual é a visão estratégica da DWU IT Solutions?",
      options: [
        "Ser líder em soluções ERP na América Latina",
        "Dominar apenas o mercado brasileiro",
        "Expandir para a Europa",
        "Focar exclusivamente no Brasil",
      ],
      correctAnswer: 0,
    },
    {
      id: 12,
      question: "Quantos níveis de suporte técnico a DWU oferece?",
      options: ["2 níveis", "3 níveis", "4 níveis", "5 níveis"],
      correctAnswer: 1,
    },
    {
      id: 13,
      question: "Qual ferramenta é utilizada para gestão de chamados na DWU?",
      options: ["Notion", "GLPI", "TeamViewer", "Microsoft Teams"],
      correctAnswer: 1,
    },
    {
      id: 14,
      question: "Para acesso remoto aos sistemas dos clientes, qual ferramenta é utilizada?",
      options: ["GLPI", "Notion", "TeamViewer", "Teams"],
      correctAnswer: 2,
    },
    {
      id: 15,
      question: "Qual equipe é responsável pelas implementações do CRM One?",
      options: ["Equipe de Suporte", "Equipe de Desenvolvimento", "Equipe de Consultoria", "Equipe de Vendas"],
      correctAnswer: 2,
    },
    {
      id: 16,
      question: "Aproximadamente quantas empresas de manufatura são clientes da DWU?",
      options: ["Mais de 100", "Mais de 150", "Mais de 200", "Mais de 250"],
      correctAnswer: 0,
    },
    {
      id: 17,
      question: "O setor de varejo possui quantas lojas como clientes da DWU?",
      options: ["Mais de 150", "Mais de 200", "Mais de 250", "Mais de 300"],
      correctAnswer: 1,
    },
    {
      id: 18,
      question: "Qual ferramenta é utilizada para manuais e comunicação interna?",
      options: ["GLPI", "Notion", "TeamViewer", "Microsoft Teams"],
      correctAnswer: 3,
    },
    {
      id: 19,
      question: "Na área da saúde, aproximadamente quantas clínicas são clientes?",
      options: ["Mais de 60", "Mais de 80", "Mais de 100", "Mais de 120"],
      correctAnswer: 1,
    },
    {
      id: 20,
      question: "Qual é o foco principal da equipe de desenvolvimento da DWU?",
      options: [
        "Apenas correção de bugs",
        "Criação do CRM One e constantes inovações",
        "Apenas manutenção de sistemas",
        "Apenas documentação técnica",
      ],
      correctAnswer: 1,
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
        "100% tempo real + processamento background",
        "Sincronização diária",
      ],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: "Quais versões do SQL Server são suportadas?",
      options: [
        "2012 a 2019",
        "2016 a 2022",
        "2014 a 2020",
        "2018 a 2024",
      ],
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
      question: "O que é o DI-Server?",
      options: [
        "Database Integration",
        "Data Interface",
        "Direct Integration",
        "Dynamic Interface",
      ],
      correctAnswer: 1,
    },
    {
      id: 6,
      question: "SAP HANA é utilizado como:",
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
      question: "Load Balancer serve para:",
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
      question: "O processamento em background utiliza:",
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
      question: "Qual protocolo é usado na comunicação segura?",
      options: ["HTTP", "FTP", "SSL/TLS", "SMTP"],
      correctAnswer: 2,
    },
    {
      id: 11,
      question: "B1WS utiliza qual formato de comunicação?",
      options: ["JSON", "XML", "CSV", "YAML"],
      correctAnswer: 1,
    },
    {
      id: 12,
      question: "O ambiente é configurado como:",
      options: [
        "Single-tenant",
        "Multi-tenant",
        "Híbrido",
        "Dedicated",
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
      options: [
        "Consulta CEP",
        "Consulta CNPJ",
        "Autenticação",
        "Logs",
      ],
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
      options: [
        "CRM One",
        "SQL Server",
        "SAP Business One",
        "IIS",
      ],
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
        "Serviços DWU",
        "Backup",
        "Monitoramento",
      ],
      correctAnswer: 1,
    },
    {
      id: 19,
      question: "O retry automático em falhas é feature do:",
      options: [
        "IIS",
        "Processamento background",
        "SQL Server",
        "Load Balancer",
      ],
      correctAnswer: 1,
    },
    {
      id: 20,
      question: "O framework principal da aplicação é:",
      options: [
        "Java EE",
        ".NET Framework",
        "PHP Laravel",
        "Node.js",
      ],
      correctAnswer: 1,
    },
  ],
  3: [
    {
      id: 1,
      question: "Qual é o principal diferencial do CRM One?",
      options: [
        "Menor preço",
        "Integração nativa com SAP Business One",
        "Interface simples",
        "Suporte 24h",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Qual é o tempo de ROI comprovado do CRM One?",
      options: ["3 meses", "6 meses", "12 meses", "18 meses"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "Qual é o NPS de satisfação do CRM One?",
      options: ["7.5/10", "8.7/10", "9.2/10", "9.8/10"],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "Quantas empresas utilizam o CRM One?",
      options: ["300+", "400+", "500+", "600+"],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "Qual é a disponibilidade do sistema?",
      options: ["99.5%", "99.8%", "99.9%", "100%"],
      correctAnswer: 1,
    },
    {
      id: 6,
      question: "Qual é a redução em processos manuais?",
      options: ["30%", "40%", "50%", "60%"],
      correctAnswer: 1,
    },
    {
      id: 7,
      question: "Qual é a melhoria na produtividade?",
      options: ["40%", "50%", "60%", "70%"],
      correctAnswer: 2,
    },
    {
      id: 8,
      question: "O CRM One tem compliance total com qual regulamentação?",
      options: ["GDPR", "LGPD", "SOX", "ISO"],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: "Qual característica destaca a implementação do CRM One?",
      options: ["Mais cara", "Mais complexa", "Mais rápida", "Mais demorada"],
      correctAnswer: 2,
    },
    {
      id: 10,
      question: "O CRM One permite customização:",
      options: [
        "Apenas com código",
        "Apenas básica",
        "Completa sem código",
        "Não permite",
      ],
      correctAnswer: 2,
    },
    {
      id: 11,
      question: "Em relação ao custo total de propriedade, o CRM One tem:",
      options: ["Maior custo", "Menor custo", "Mesmo custo", "Custo variável"],
      correctAnswer: 1,
    },
    {
      id: 12,
      question: "A interface do CRM One é descrita como:",
      options: ["Básica", "Complexa", "Moderna e intuitiva", "Ultrapassada"],
      correctAnswer: 2,
    },
    {
      id: 13,
      question: "O suporte técnico do CRM One é:",
      options: ["Básico", "Especializado", "Terceirizado", "Limitado"],
      correctAnswer: 1,
    },
    {
      id: 14,
      question: "Em relação à performance, o CRM One oferece:",
      options: [
        "Performance básica",
        "Performance média",
        "Performance superior",
        "Performance instável",
      ],
      correctAnswer: 2,
    },
    {
      id: 15,
      question: "A escalabilidade do CRM One é:",
      options: ["Limitada", "Básica", "Empresarial", "Inexistente"],
      correctAnswer: 2,
    },
    {
      id: 16,
      question: "O posicionamento estratégico do CRM One foca em:",
      options: ["Preço baixo", "Inovação", "Marketing", "Vendas"],
      correctAnswer: 1,
    },
    {
      id: 17,
      question: "A conectividade do CRM One com ecossistema SAP é:",
      options: ["Parcial", "Básica", "Total", "Inexistente"],
      correctAnswer: 2,
    },
    {
      id: 18,
      question: "O atendimento do CRM One é:",
      options: ["8h", "12h", "24/5", "24/7"],
      correctAnswer: 3,
    },
    {
      id: 19,
      question: "A tecnologia do CRM One é considerada:",
      options: ["Básica", "Média", "De ponta", "Ultrapassada"],
      correctAnswer: 2,
    },
    {
      id: 20,
      question: "O foco em UX (experiência do usuário) do CRM One é:",
      options: ["Inexistente", "Básico", "Médio", "Prioritário"],
      correctAnswer: 3,
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
  const [attemptStatus, setAttemptStatus] = useState<AttemptStatus>({ canAttempt: true });
  const [isCheckingAttempts, setIsCheckingAttempts] = useState(isCheckingAttempts);
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
          console.log("🔍 Verificando tentativas para userId:", user.userId, "módulo:", moduleNumber);
          const response = await fetch(`/api/evaluations/attempts?userId=${user.userId}&moduleId=${moduleNumber}`);
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
            const numericUserId = parseInt(user.userId.replace('user-', ''));
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
              completedAt: new Date().toISOString()
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
              throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log("🎯 Response result:", result);

            if (passed && userProgress) {
              const completedModules = userProgress.completedModules || [];
              if (!completedModules.includes(moduleNumber)) {
                const newCompletedModules = [...completedModules, moduleNumber];
                const nextModule = moduleNumber < 4 ? moduleNumber + 1 : moduleNumber;

                console.log(`✅ Módulo ${moduleNumber} completado! Próximo módulo: ${nextModule}`);
                console.log(`📊 Novos módulos completados:`, newCompletedModules);

                await updateProgress({
                  completedModules: newCompletedModules,
                  currentModule: nextModule, // Atualizar para o próximo módulo
                  moduleProgress: {
                    ...userProgress.moduleProgress,
                    [moduleNumber]: 100,
                  },
                  moduleEvaluations: {
                    ...userProgress.moduleEvaluations,
                    [moduleNumber]: { score: finalScore, passed, completedAt: new Date().toISOString() },
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
    const hoursRemaining = Math.ceil((attemptStatus.remainingTime || 0) / (1000 * 60 * 60));

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
                <h1 className="text-2xl font-bold gradient-text">DWU IT Academy</h1>
                <p className="text-sm text-slate-400">Centro de Excelência Técnica</p>
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
                    <h4 className="text-white font-semibold">Status da Avaliação</h4>
                    <p className="text-slate-400 text-sm">Informações sobre suas tentativas</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">2/2</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Tentativas Hoje</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{hoursRemaining}h</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Tempo Restante</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">24h</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Ciclo Reset</div>
                </div>
              </div>

              {hoursRemaining > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                  <p className="text-yellow-300 font-medium">
                    ⏰ Próxima tentativa disponível em <strong>{hoursRemaining} hora(s)</strong>
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
                      <h5 className="text-white font-semibold">Revisar Conteúdo</h5>
                      <p className="text-slate-400 text-sm">Releia o material do módulo</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-5 hover:bg-green-500/15 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-xl">🎥</span>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">Assistir Vídeos</h5>
                      <p className="text-slate-400 text-sm">Revise as explicações em vídeo</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-5 hover:bg-purple-500/15 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 text-xl">📝</span>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">Fazer Anotações</h5>
                      <p className="text-slate-400 text-sm">Anote pontos importantes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-5 hover:bg-orange-500/15 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-orange-400 text-xl">❓</span>
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">Tirar Dúvidas</h5>
                      <p className="text-slate-400 text-sm">Esclareça pontos confusos</p>
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
              {passed ? "Parabéns! Você foi aprovado!" : "Você não foi aprovado desta vez"}
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
              <h1 className="text-2xl font-bold gradient-text">DWU IT Academy</h1>
              <p className="text-sm text-slate-400">Centro de Excelência Técnica</p>
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