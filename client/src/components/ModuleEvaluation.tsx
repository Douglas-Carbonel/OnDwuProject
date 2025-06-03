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
      question: "Qual é a missão da DWU?",
      options: [
        "Vender software empresarial",
        "Transformar a gestão empresarial através de tecnologia de ponta",
        "Ser a maior empresa de TI do Brasil",
        "Desenvolver sistemas de CRM",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Quantos anos de mercado a DWU possui?",
      options: ["10+", "15+", "20+", "25+"],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "Quantos clientes ativos a DWU possui aproximadamente?",
      options: ["200+", "300+", "500+", "800+"],
      correctAnswer: 2,
    },
    {
      id: 4,
      question: "Qual é o SLA de uptime da DWU?",
      options: ["95%", "98%", "99.9%", "100%"],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "Qual dos seguintes é um valor da cultura DWU?",
      options: ["Competição", "Paixão", "Individualismo", "Lucro"],
      correctAnswer: 1,
    },
    {
      id: 6,
      question: "Em quantos países a DWU atua?",
      options: ["5", "10", "15+", "20+"],
      correctAnswer: 2,
    },
    {
      id: 7,
      question: "Qual setor NÃO é mencionado como cliente da DWU?",
      options: ["Manufatura", "Varejo", "Saúde", "Educação"],
      correctAnswer: 3,
    },
    {
      id: 8,
      question: "Quantas empresas de manufatura são clientes da DWU?",
      options: ["100+", "150+", "200+", "250+"],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: "Qual ferramenta é usada para gestão de chamados?",
      options: ["Notion", "GLPI", "TeamViewer", "Teams"],
      correctAnswer: 1,
    },
    {
      id: 10,
      question: "O CRM One é integrado nativamente com qual ERP?",
      options: ["Oracle", "SAP Business One", "Totvs", "Microsiga"],
      correctAnswer: 1,
    },
    {
      id: 11,
      question: "Qual é a visão da DWU?",
      options: [
        "Ser líder em soluções ERP na América Latina",
        "Dominar o mercado brasileiro",
        "Expandir para a Europa",
        "Focar apenas no Brasil",
      ],
      correctAnswer: 0,
    },
    {
      id: 12,
      question: "Quantos níveis de suporte técnico existem?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 1,
    },
    {
      id: 13,
      question: "Qual ferramenta é usada para acesso remoto?",
      options: ["GLPI", "Notion", "TeamViewer", "Teams"],
      correctAnswer: 2,
    },
    {
      id: 14,
      question: "Quantas lojas do varejo são clientes?",
      options: ["150+", "200+", "250+", "300+"],
      correctAnswer: 1,
    },
    {
      id: 15,
      question: "Qual equipe é responsável por implementações?",
      options: ["Suporte", "Desenvolvimento", "Consultoria", "Vendas"],
      correctAnswer: 2,
    },
    {
      id: 16,
      question: "O que significa 'Colaboração' na cultura DWU?",
      options: [
        "Trabalhar sozinho",
        "Juntos somos mais fortes",
        "Competir internamente",
        "Focar apenas em resultados",
      ],
      correctAnswer: 1,
    },
    {
      id: 17,
      question: "Quantas clínicas de saúde são clientes?",
      options: ["60+", "80+", "100+", "120+"],
      correctAnswer: 1,
    },
    {
      id: 18,
      question: "Qual ferramenta é usada para manuais e comunicação?",
      options: ["GLPI", "Notion", "TeamViewer", "Teams"],
      correctAnswer: 3,
    },
    {
      id: 19,
      question: "Quantas empresas de logística são clientes?",
      options: ["100+", "120+", "150+", "180+"],
      correctAnswer: 1,
    },
    {
      id: 20,
      question: "Qual é o foco principal do time de desenvolvimento?",
      options: [
        "Apenas correção de bugs",
        "Criadores do CRM One e inovações",
        "Apenas manutenção",
        "Apenas documentação",
      ],
      correctAnswer: 1,
    },
  ],
  2: [
    {
      id: 1,
      question: "Quais são os dois principais bancos de dados do CRM One?",
      options: [
        "MySQL e PostgreSQL",
        "SQL Server e SAP HANA",
        "Oracle e MongoDB",
        "SQLite e Redis",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "O que significa DI-Server?",
      options: [
        "Database Interface",
        "Data Interface",
        "Direct Integration",
        "Dynamic Interface",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "Qual tecnologia é usada para o portal web?",
      options: ["Apache", "IIS", "Nginx", "Tomcat"],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "Qual ferramenta é usada para controle de bugs?",
      options: ["GLPI", "Teams", "Notion", "TeamViewer"],
      correctAnswer: 2,
    },
    {
      id: 5,
      question: "O Service Layer é uma API de qual sistema?",
      options: ["CRM One", "SQL Server", "SAP B1", "HANA"],
      correctAnswer: 2,
    },
    {
      id: 6,
      question: "Qual componente fornece balanceamento de carga?",
      options: ["IIS", "Load Balancer", "SQL Server", "Service Layer"],
      correctAnswer: 1,
    },
    {
      id: 7,
      question: "Os Serviços Windows fazem parte de qual camada?",
      options: ["Banco de dados", "APIs", "Portal Web", "Ferramentas"],
      correctAnswer: 2,
    },
    {
      id: 8,
      question: "Qual protocolo é usado para REST APIs?",
      options: ["SOAP", "HTTP/HTTPS", "FTP", "TCP"],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: "Para que serve o GLPI?",
      options: [
        "Controle de bugs",
        "Sistema de chamados",
        "Acesso remoto",
        "Comunicação",
      ],
      correctAnswer: 1,
    },
    {
      id: 10,
      question: "Qual é a primeira etapa no fluxo de dados?",
      options: ["APIs", "Database", "ERP", "Frontend"],
      correctAnswer: 3,
    },
    {
      id: 11,
      question: "O SAP HANA é usado principalmente para:",
      options: [
        "Dados principais",
        "Integração ERP",
        "Portal web",
        "Comunicação",
      ],
      correctAnswer: 1,
    },
    {
      id: 12,
      question: "Stored Procedures são executadas em qual camada?",
      options: ["Frontend", "APIs", "Banco de dados", "Portal"],
      correctAnswer: 2,
    },
    {
      id: 13,
      question: "WebServices SOAP fazem parte de qual componente?",
      options: ["Banco de dados", "APIs", "Portal", "Ferramentas"],
      correctAnswer: 1,
    },
    {
      id: 14,
      question: "SSL/TLS Certificados são usados em qual camada?",
      options: ["Banco", "APIs", "Portal Web", "Todas"],
      correctAnswer: 2,
    },
    {
      id: 15,
      question: "TeamViewer é usado para:",
      options: [
        "Controle de bugs",
        "Sistema de chamados",
        "Acesso remoto",
        "Banco de dados",
      ],
      correctAnswer: 2,
    },
    {
      id: 16,
      question: "Views e triggers estão relacionados a:",
      options: ["APIs", "Portal", "Banco de dados", "Ferramentas"],
      correctAnswer: 2,
    },
    {
      id: 17,
      question: "A integração com SAP Business One é feita através de:",
      options: ["SQL Server", "DI-Server e Service Layer", "IIS", "GLPI"],
      correctAnswer: 1,
    },
    {
      id: 18,
      question: "O fluxo de dados termina em qual componente?",
      options: ["Frontend", "APIs", "ERP", "Database"],
      correctAnswer: 3,
    },
    {
      id: 19,
      question: "Teams é usado principalmente para:",
      options: [
        "Controle de bugs",
        "Chamados",
        "Acesso remoto",
        "Manuais e comunicação",
      ],
      correctAnswer: 3,
    },
    {
      id: 20,
      question: "Qual é a sequência correta do fluxo de dados?",
      options: [
        "Frontend → APIs → ERP → Database",
        "APIs → Frontend → Database → ERP",
        "Database → ERP → APIs → Frontend",
        "ERP → Database → Frontend → APIs",
      ],
      correctAnswer: 0,
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
  const [isCheckingAttempts, setIsCheckingAttempts] = useState(true);
  const { user } = useAuth();
  const { progress: userProgress, updateProgress } = useProgress();

  const questions = moduleQuestions[moduleNumber] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

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
            const evaluationData = {
              userId: parseInt(user?.userId || '0'),
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
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
      <Card className="glass-effect tech-border max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Clock size={64} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold text-white mb-2">Limite de Tentativas Atingido</h3>
            <p className="text-slate-300 mb-4">
              Você já realizou 2 tentativas hoje para este módulo.
            </p>
            <p className="text-yellow-400 font-medium">
              Próxima tentativa disponível em: {hoursRemaining} hora(s)
            </p>
          </div>
          <Button onClick={onCancel} variant="outline" className="bg-slate-700 border-slate-600">
            Voltar ao Módulo
          </Button>
        </CardContent>
      </Card>
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
                {currentQuestion_final_file>
Index + 1} de {questions.length}
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