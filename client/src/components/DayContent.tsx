import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuizComponent from "./QuizComponent";
import SimulationComponent from "./SimulationComponent";
import { onboardingData } from "@/lib/onboarding-data";
import { 
  Building, Globe, Heart, Database, BarChart, Ticket, 
  CheckCircle, Clock, Headset, Download, Trophy, Users,
  FileText, TriangleAlert, Search, Gamepad, Info, ArrowUp, ArrowRight, UserCircle, Presentation,
  Target, Lightbulb, Zap, Shield, Eye, Rocket, Brain, Handshake, TrendingUp, Settings,
  Server, Code, Network, ArrowDown, Monitor
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DayContentProps {
  day: number;
  onProgressUpdate: (progress: number) => void;
}

interface SlidePresentationProps {
  onComplete: () => void;
}

function SlidePresentation({ onComplete }: SlidePresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Bem-vindos à DWU IT Solutions",
      subtitle: "Sua jornada de transformação digital começa aqui",
      content: "Somos uma empresa especializada em soluções para empresas que utilizam SAP Business One, com foco na área comercial e equipe de vendas.",
      type: "intro",
      bgGradient: "from-blue-600 via-purple-600 to-blue-800"
    },
    {
      id: 2,
      title: "Axiomas dos Colaboradores",
      subtitle: "Nossos princípios fundamentais",
      content: "Afirmações e proposições fundamentais que são consideradas verdades evidentes e que não precisam de provas adicionais.",
      type: "axioms-colaboradores",
      bgGradient: "from-cyan-600 to-blue-700",
      axioms: [
        { text: "Viver para aprender", icon: Brain },
        { text: "Zelar pela verdade", icon: Eye },
        { text: "Entregar mais do que o esperado", icon: TrendingUp },
        { text: "Se posicionar com base em dados e fatos", icon: BarChart },
        { text: "Ensinar algo a alguém todos os dias", icon: Users },
        { text: "Trabalhar para si mesmo", icon: Target },
        { text: "Aceitar e cometer somente erros inéditos", icon: Lightbulb },
        { text: "Cuide da sua mente e leia livros", icon: Brain },
        { text: "Manter o seu ego forte", icon: Shield },
        { text: "Acreditar em você e nunca se comparar", icon: Heart },
        { text: "Comunicação anti-fragilidade", icon: Handshake }
      ]
    },
    {
      id: 3,
      title: "Axiomas da Empresa",
      subtitle: "Pilares que guiam nossa organização",
      content: "Princípios fundamentais que definem nossa cultura organizacional e direcionam nossas decisões estratégicas.",
      type: "axioms-empresa",
      bgGradient: "from-green-600 to-teal-700",
      axioms: [
        { 
          text: "Energia gera resultado", 
          desc: "Manter a energia constante é o motor que move o time rumo ao crescimento.",
          icon: Zap 
        },
        { 
          text: "Ideias boas merecem palco", 
          desc: "Iniciativas de valor serão sempre reconhecidas. Aqui, mérito gera impacto.",
          icon: Lightbulb 
        },
        { 
          text: "Aprender é a única constante", 
          desc: "A evolução da equipe depende do nosso compromisso com o aprendizado contínuo.",
          icon: Brain 
        },
        { 
          text: "Inovar é não aceitar o comum", 
          desc: "Para sermos os melhores, precisamos pensar o que ainda não foi feito.",
          icon: Rocket 
        },
        { 
          text: "Transparência constrói confiança", 
          desc: "Clareza, ética e verdade são os pilares de qualquer relação duradoura.",
          icon: Shield 
        },
        { 
          text: "Problemas existem para serem resolvidos", 
          desc: "Agilidade, foco e atitude fazem parte do nosso DNA.",
          icon: Settings 
        }
      ]
    },
    {
      id: 4,
      title: "Estrutura Organizacional DWU",
      subtitle: "Como estamos organizados",
      content: "Nossa estrutura é pensada para maximizar a colaboração e a eficiência, com times especializados e multidisciplinares.",
      type: "structure",
      bgGradient: "from-purple-600 to-indigo-700"
    },
    {
      id: 5,
      title: "Nossos Deveres e Horários",
      subtitle: "Diretrizes profissionais",
      content: "Estabelecemos padrões claros para manter nossa excelência e profissionalismo.",
      type: "duties",
      bgGradient: "from-slate-700 to-slate-900"
    },
    {
      id: 6,
      title: "Uniforme Corporativo",
      subtitle: "Identidade visual profissional",
      content: "Para mantermos uma imagem profissional e alinhada com a identidade da empresa, informamos que o uso do uniforme passa a ser obrigatório para todos os colaboradores.",
      type: "uniform",
      bgGradient: "from-navy-600 to-blue-800"
    },
    {
      id: 7,
      title: "Nossa Equipe",
      subtitle: "Pessoas que fazem a diferença",
      content: "Conheça os profissionais que trabalham todos os dias para entregar excelência e inovação aos nossos clientes.",
      type: "team",
      bgGradient: "from-indigo-600 to-purple-700"
    },
    {
      id: 8,
      title: "Horários e Responsabilidades",
      subtitle: "Como organizamos nosso trabalho",
      content: "Estrutura de horários flexível com foco em resultados e atendimento de qualidade aos nossos clientes.",
      type: "schedule",
      bgGradient: "from-teal-600 to-cyan-700"
    }
  ];

  const nextSlide = () => {
    console.log('Next slide clicked, current:', currentSlide, 'total:', slides.length);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const progressPercentage = ((currentSlide + 1) / slides.length) * 100;
  const currentSlideData = slides[currentSlide];

  const renderSlideContent = () => {
    switch (currentSlideData.type) {
      case "intro":
        return (
          <div className="text-center space-y-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
              <Building size={64} className="text-white" />
            </div>
            <div>
              <h3 className="text-5xl font-bold text-white mb-4">{currentSlideData.title}</h3>
              <h4 className="text-2xl text-blue-100 mb-6">{currentSlideData.subtitle}</h4>
              <p className="text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">{currentSlideData.content}</p>
            </div>
          </div>
        );

      case "axioms-colaboradores":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-white mb-2">{currentSlideData.title}</h3>
              <h4 className="text-xl text-cyan-100 mb-4">{currentSlideData.subtitle}</h4>
              <p className="text-cyan-100 max-w-3xl mx-auto">{currentSlideData.content}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentSlideData.axioms?.map((axiom, index) => {
                const IconComponent = axiom.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <IconComponent size={24} className="text-cyan-200" />
                    </div>
                    <p className="text-white text-sm font-medium leading-tight">{axiom.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "axioms-empresa":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-white mb-2">{currentSlideData.title}</h3>
              <h4 className="text-xl text-green-100 mb-4">{currentSlideData.subtitle}</h4>
              <p className="text-green-100 max-w-3xl mx-auto">{currentSlideData.content}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {currentSlideData.axioms?.map((axiom, index) => {
                const IconComponent = axiom.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-green-400/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <IconComponent size={28} className="text-green-200" />
                      </div>
                      <div>
                        <h5 className="text-white font-bold text-lg mb-2">{axiom.text}</h5>
                        <p className="text-green-100 text-sm leading-relaxed">{axiom.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "structure":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-white mb-2">{currentSlideData.title}</h3>
              <h4 className="text-xl text-purple-100 mb-4">{currentSlideData.subtitle}</h4>
              <p className="text-purple-100 max-w-3xl mx-auto">{currentSlideData.content}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Tribos */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-blue-200" />
                    </div>
                    <h5 className="text-2xl font-bold text-blue-200">Tribo</h5>
                  </div>
                  <h6 className="text-white font-semibold mb-2">Administrativa e Comercial</h6>
                  <p className="text-purple-100 text-sm">Foco em garantir suporte às áreas de negócio, marketing e vendas, além de atender aos requisitos jurídicos e financeiros.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-xl flex items-center justify-center">
                      <Rocket size={24} className="text-cyan-200" />
                    </div>
                    <h5 className="text-2xl font-bold text-cyan-200">Tribo</h5>
                  </div>
                  <h6 className="text-white font-semibold mb-2">Inovação e Operações</h6>
                  <p className="text-purple-100 text-sm">Foco na entrega de valor do cliente final por meio de melhorias no produto, UX/UI, e inovação tecnológica.</p>
                </div>
              </div>

              {/* Squads */}
              <div className="space-y-4">
                <h5 className="text-2xl font-bold text-purple-200 mb-4">Squads</h5>

                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center space-x-3">
                    <TrendingUp size={20} className="text-purple-200" />
                    <span className="text-white font-medium">Marketing e Vendas</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center space-x-3">
                    <Users size={20} className="text-purple-200" />
                    <span className="text-white font-medium">Financeiro e RH</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center space-x-3">
                    <Settings size={20} className="text-purple-200" />
                    <span className="text-white font-medium">Engenharia e Produto</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center space-x-3">
                    <Rocket size={20} className="text-purple-200" />
                    <span className="text-white font-medium">Implantação</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center space-x-3">
                    <Headset size={20} className="text-purple-200" />
                    <span className="text-white font-medium">Sustentação e Experiência do Cliente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "duties":
        return (
          <div className="text-center space-y-8">
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">{currentSlideData.title}</h3>
              <h4 className="text-xl text-slate-300 mb-4">{currentSlideData.subtitle}</h4>
              <p className="text-slate-200 max-w-3xl mx-auto">{currentSlideData.content}</p>
            </div>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
              <Clock size={64} className="text-white" />
            </div>
          </div>
        );

      case "uniform":
        return (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">{currentSlideData.title}</h3>
              <h4 className="text-xl text-blue-100 mb-6">{currentSlideData.subtitle}</h4>
              <p className="text-blue-100 leading-relaxed mb-6">{currentSlideData.content}</p>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-white text-sm"><strong>A calça fica a critério de escolha do colaborador</strong>, desde que seja uma peça neutra e apropriada para ambiente profissional.</p>
                </div>

                <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
                  <p className="text-yellow-100 text-sm"><strong>Está proibido o uso de:</strong> saias, vestidos, macacões, bermudas, chinelos e rasteiras que não componham o uniforme completo.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-white/20 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm">
                <Building size={96} className="text-white" />
              </div>
              <p className="text-blue-100 text-sm mt-4">Uniforme corporativo DWU</p>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="text-center space-y-8">
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">{currentSlideData.title}</h3>
              <h4 className="text-xl text-purple-100 mb-4">{currentSlideData.subtitle}</h4>
              <p className="text-purple-100 max-w-3xl mx-auto">{currentSlideData.content}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm mb-6">
                <Users size={64} className="text-white" />
              </div>
              <p className="text-white text-lg">Nossa equipe é formada por profissionais apaixonados por tecnologia e comprometidos com a excelência.</p>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-white mb-2">{currentSlideData.title}</h3>
              <h4 className="text-xl text-teal-100 mb-4">{currentSlideData.subtitle}</h4>
              <p className="text-teal-100 max-w-3xl mx-auto">{currentSlideData.content}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock size={24} className="text-teal-200" />
                  <h5 className="text-xl font-bold text-teal-200">Nossos Horários</h5>
                </div>
                <ul className="space-y-2 text-white">
                  <li>• 08h e 30min às 12h e das 13h e 30min às 18h</li>
                  <li>• Intervalo de 1h30 para almoço</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield size={24} className="text-teal-200" />
                  <h5 className="text-xl font-bold text-teal-200">Responsabilidade de Todos</h5>
                </div>
                <ul className="space-y-2 text-white text-sm">
                  <li>• Cumprimento dos horários estabelecidos</li>
                  <li>• Atendimento e suporte ao cliente dentro dos períodos definidos</li>
                  <li>• Uso adequado do uniforme ou vestimenta conforme especificado</li>
                  <li>• Atendimento rápido e eficiente para garantir a qualidade dos serviços prestados</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-400/30">
                <div className="flex items-center space-x-3 mb-4">
                  <TriangleAlert size={24} className="text-red-200" />
                  <h5 className="text-xl font-bold text-red-200">Em caso de falta ou atraso</h5>
                </div>
                <ul className="space-y-2 text-red-100 text-sm">
                  <li>• Informe imediatamente seu gestor direto ou a direção da empresa</li>
                  <li>• <strong>A comunicação deve ser feita o mais rápido possível, preferencialmente antes do horário de entrada</strong></li>
                  <li>• Justifique o motivo da ausência ou do atraso</li>
                  <li>• Caso necessário, apresente documentação como: atestado médico</li>
                </ul>
              </div>

              <div className="bg-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe size={24} className="text-cyan-200" />
                  <h5 className="text-xl font-bold text-cyan-200">Sobre o período de férias</h5>
                </div>
                <ul className="space-y-2 text-cyan-100 text-sm">
                  <li>• O profissional deve se organizar com no <strong>mínimo 45 dias de antecedência</strong></li>
                  <li>• Caso as férias estejam próximas do vencimento e envolvam dois períodos consecutivos, a empresa pode fazer a solicitação a qualquer momento para adequação da escala</li>
                  <li>• É obrigatório avisar seu gestor para que o planejamento da equipe não seja comprometido</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
              <Building size={64} className="text-white" />
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-4">{currentSlideData.title}</h3>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">{currentSlideData.content}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Slide {currentSlide + 1} de {slides.length}
          </span>
          <span className="text-sm text-slate-400">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Slide Content */}
      <Card className={`glass-effect tech-border min-h-[500px] bg-gradient-to-br ${currentSlideData.bgGradient}`}>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          {renderSlideContent()}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center gap-2"
        >
          ← Anterior
        </Button>

        {/* Slide Indicators */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {currentSlide === slides.length - 1 ? (
          <Button
            onClick={onComplete}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            Concluir Apresentação
          </Button>
        ) : (
          <Button
            onClick={nextSlide}
            className="flex items-center gap-2"
          >
            Próximo →
          </Button>
        )}
      </div>
    </div>
  );
}

function getModuleIcon(day: number) {
  switch (day) {
    case 1:
      return <Building className="text-white" size={32} />;
    case 2:
      return <Database className="text-white" size={32} />;
    case 3:
      return <BarChart className="text-white" size={32} />;
    case 4:
      return <FileText className="text-white" size={32} />;
    default:
      return <Info className="text-white" size={32} />;
  }
}

export default function DayContent({ day, onProgressUpdate }: DayContentProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const dayData = onboardingData.find(d => d.day === day);
  const lastProgressRef = useRef<number>(-1);
  const [completedItems, setCompletedItems] = useState<boolean[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [presentationCompleted, setPresentationCompleted] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved progress from localStorage
    const saved = localStorage.getItem(`day-${day}-progress`);
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        setCheckedItems(parsedItems);
      } catch (error) {
        console.error('Error parsing saved progress:', error);
        setCheckedItems({});
      }
    } else {
      setCheckedItems({});
    }
  }, [day]);

  useEffect(() => {
    // Save progress to localStorage and calculate progress
    try {
      localStorage.setItem(`day-${day}-progress`, JSON.stringify(checkedItems));

      // Calculate progress based on checked items
      if (dayData?.checklist) {
        const totalItems = dayData.checklist.length;
        const checkedCount = Object.values(checkedItems).filter(Boolean).length;
        const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

        // Only update if progress actually changed
        if (lastProgressRef.current !== progress) {
          lastProgressRef.current = progress;
          onProgressUpdate(progress);
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [checkedItems, day, dayData?.checklist, onProgressUpdate]);

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => {
      // Prevent unnecessary updates if value hasn't changed
      if (prev[itemId] === checked) {
        return prev;
      }
      return {
        ...prev,
        [itemId]: checked
      };
    });
  };

  const downloadMaterial = (materialName: string) => {
    console.log('🔄 Iniciando download do material:', materialName);

    // Create formatted PDF document
    const createPDF = (title: string, content: string) => {
      console.log('📄 Criando PDF para:', title);
      try {
        // Import jsPDF dynamically
        import('jspdf').then((jsPDFModule) => {
          console.log('📦 jsPDF carregado com sucesso');
          const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF || jsPDFModule;
          const doc = new jsPDF();

          // Set document properties
          doc.setProperties({
            title: title,
            subject: 'Material DWU IT Solutions',
            author: 'DWU IT Solutions',
            creator: 'CRM One Training System'
          });

          // Header
          doc.setFillColor(51, 102, 204); // Blue header
          doc.rect(0, 0, 210, 30, 'F');

          // Company logo/name
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('DWU IT Solutions', 20, 15);

          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text('Sistema de Treinamento CRM One', 20, 22);

          // Title
          doc.setTextColor(51, 102, 204);
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.text(title, 20, 45);

          // Content
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');

          // Split content into lines that fit the page width
          const splitContent = doc.splitTextToSize(content, 170);
          let yPosition = 60;
          const lineHeight = 6;
          const pageHeight = 280;

          splitContent.forEach((line: string) => {
            if (yPosition > pageHeight - 20) {
              doc.addPage();
              yPosition = 20;
            }

            // Format headers and important text
            if (line.includes('========') || line.includes('CONFIGURACOES')) {
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(12);
              doc.setTextColor(51, 102, 204);
            } else if (line.startsWith('[') && line.includes(']')) {
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(10);
              doc.setTextColor(0, 102, 51);
            } else if (line.includes('Descricao:') || line.includes('Formato:') || line.includes('Valores:')) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9);
              doc.setTextColor(102, 102, 102);
            } else {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(10);
              doc.setTextColor(0, 0, 0);
            }

            doc.text(line, 20, yPosition);
            yPosition += lineHeight;
          });

          // Footer
          const totalPages = doc.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFillColor(240, 240, 240);
            doc.rect(0, 287, 210, 10, 'F');

            doc.setTextColor(102, 102, 102);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(`Página ${i} de ${totalPages}`, 20, 292);
            doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 120, 292);
          }

          // Save the PDF
          const fileName = `${materialName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
          console.log('💾 Salvando arquivo:', fileName);
          doc.save(fileName);
          console.log('✅ Download concluído:', materialName);
        }).catch((error) => {
          console.error('❌ Erro ao importar jsPDF:', error);
          console.log('🔄 Fallback para arquivo TXT');
          // Fallback to text file if PDF generation fails
          const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${materialName.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log('✅ Fallback TXT concluído');
        });
      } catch (error) {
        console.error('❌ Erro geral no download:', error);
        // Fallback to text file if PDF generation fails
        const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${materialName.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    };

    // Define content for each material type
    const materialContent = {
      'Requisitos-Hardware': {
        title: 'Requisitos de Hardware - CRM One',
        content: `
REQUISITOS MÍNIMOS:
- Processador: Intel Core i5 ou equivalente
- Memória RAM: 8GB
- Armazenamento: 100GB SSD
- Sistema Operacional: Windows Server 2016+
- .NET Framework 4.8+
- SQL Server 2016+

REQUISITOS RECOMENDADOS:
- Processador: Intel Core i7 ou equivalente
- Memória RAM: 16GB
- Armazenamento: 500GB SSD
- Sistema Operacional: Windows Server 2019+
- SQL Server 2019+
- Load Balancer configurado

REDE:
- Conexão estável de internet
- Portas 80, 443, 1433 abertas
- SSL/TLS configurado

INTEGRAÇÃO SAP:
- SAP Business One 9.3+
- DI-Server configurado
- Service Layer ativo
        `
      },
      'Requisitos-Tecnicos-Completos': {
        title: 'Pré-requisitos técnicos CRM One - 2025',
        content: `REQUISITOS TÉCNICOS

Introdução
Este documento tem o objetivo de padronizar os ambientes em que o CRM One será instalado e utilizado pelos clientes.
Todas as informações devem ser revisadas para o correto funcionamento do ambiente e para garantia do suporte ao produto.

Pré-requisitos técnicos de hardware (Servidor WEB)
É imprescindível que o CRM One tenha um servidor ou máquina virtual dedicado exclusivamente ao portal WEB, à API de integração do APP Mobile e ao Motor de e-mails, com as seguintes características mínimas:

• Processador Intel Xeon E3 ou equivalente com 1x CORE/vCPU a cada 5 usuários
• 8 GB de memória RAM para SERVIDOR e SO
• 250MB de memória RAM por usuário contratado
• 50GB de espaço em disco
• Conexão de rede LOCAL (conexões GIGABIT) com servidor SAP e Banco de dados

Pré-requisitos técnicos de software (Servidor WEB)
• SAP Business One deverá estar na versão 10 FP2111 ou superior
• ServerTools apenas com o módulo DI-SERVER instalado e funcional
• SERVICE LAYER deve ter disponível 1 NODE a cada 5 usuários do CRM One
• Conexão disponível do servidor WEB para o banco de dados SQL/HANA
• Microsoft .NET Framework 3.5, 4.0 e 4.5
• Google chrome (navegador)

Pré-requisitos CRM One DESKTOP (add-on)
• Processador Core i3 ou equivalente
• 1GB de espaço em disco livre
• 300 MB de memória RAM para o CRM One (por usuário)

Premissas de instalação:
1. Informações de Licença (Hardware Key, Install Number, System Number)
2. Instalação do Add-on do CRM One (PRD e TST)
3. DI-Server (instalação no servidor IIS)
4. Licenças DI-Server (mínimo 10 licenças)
5. Usuário SAP (CRMOne com senha SAPB1Admin)
6. Acesso à internet para validações e atualizações
7. Liberação de portas (8099, 8098, 8052, 8053)
8. Driver Hana 32 bits (para ambientes HANA)
9. Usuário Administrador – IIS
10. B1SiteUser para Servertools
11. Usuário TS com permissões de administrador
12. Usuário banco de dados (SA/SYSTEM)
13. Dados SMTP para envio de e-mails

Acesso DWU ao ambiente para instalação:
• Team Viewer para acesso remoto
• Usuário com privilégios de administrador
• Dados de acesso ao SAP Business One
• Dados de acesso ao SQL Server/HANA
• Acompanhamento durante todo o acesso

Suporte:
Telefone: (51) 3023.8393
E-mail: suporte@dwu.com.br
Portal: www.dwu.com.br/suporte`
      },
      'Config-Balancers': {
        title: 'Configuracoes de Balancers - CRM One',
        content: `========================================
       CONFIGURACOES OBRIGATORIAS
========================================

[appServer]
Descricao: Servidor de licencas do SAP
Origem: Service Manager
Exemplo: SERVIDOR-SAP:30015

[appServerSQL] 
Descricao: Servidor de banco de dados do SAP
Origem: Tela de login do SAP
Exemplo: SERVIDOR-SQL:1433

[appServerSQLHANA]
Descricao: Servidor de licenca para HANA 2.0
Formato: Geralmente HDB@SERVIDOR

[appBancoSQL]
Descricao: Nome do banco de dados do SAP
Exemplo: SBODemoUS

[appTipoBanco]
Descricao: Tipo de banco de dados
Valores: SQL Server / HANA

[appUsuarioBanco]
Descricao: Usuario do banco de dados
Valores: SA (SQL Server) / SYSTEM (HANA)

[appSenhaBanco]
Descricao: Senha do banco de dados
Seguranca: Manter confidencial

[EnderecoWSDL]
Descricao: Endereco do site B1WS criado
Formato: http://localhost/b1ws ou https://servidor/b1ws

[EnderecoSL]
Descricao: Endereco para uso da Service Layer
Formato: http://servidor:50000/b1s/v1


========================================
       CONFIGURACOES OPCIONAIS
========================================

[CarregaDadosMemoria]
Descricao: Carregar dados iniciais em memoria do IIS
Valores: true / false
IMPORTANTE: Se true, reiniciar pool da aplicacao sempre que alterar configs do CRM One

[SessaoFixa]
Descricao: Manter sessao fixa na DI Server
Valores: true / false

[GetPNQuery]
Descricao: Fazer getbykey de Parceiro de Negocio via query
Valores: true / false

[GetCVQuery]
Descricao: Fazer getbykey de Cotacao de Venda via query
Valores: true / false

[GetPVQuery]
Descricao: Fazer getbykey de Pedido de Venda via query
Valores: true / false

[GetATDQuery]
Descricao: Fazer getbykey de Atividade via query
Valores: true / false

[PreviewSL]
Descricao: Preview de documentos pela Service Layer
Valores: true / false

[AddCotacaoSL]
Descricao: Adicionar cotacao de venda pela Service Layer
Valores: true / false

[AddPedidoSL]
Descricao: Adicionar pedido de venda pela Service Layer
Valores: true / false

[UpdateCotacaoSL]
Descricao: Atualizar cotacao de venda pela Service Layer
Valores: true / false

[UpdatePedidoSL]
Descricao: Atualizar pedido de venda pela Service Layer
Valores: true / false

[CalculaDocTotal]
Descricao: Informar doctotal ao atualizar documento
Valores: true / false

[RemoveFilialPreview]
Descricao: Remover filial no preview de documentos
Valores: true / false

[UsuariosSimultaneos]
Descricao: Lista de usuarios simultaneos (logins)
Formato: Criptografado, separado por ponto e virgula
Exemplo: user1;user2;user3`
      },
      'Comparativo-CRM-One': {
        title: 'Comparativo CRM One vs Concorrência',
        content: `
DIFERENCIAIS COMPETITIVOS:

1. INTEGRAÇÃO NATIVA SAP:
   - CRM One: 100% integrado
   - Concorrentes: Integração limitada

2. PERFORMANCE:
   - CRM One: 99.9% uptime
   - Concorrentes: 95-98% uptime

3. CUSTOMIZAÇÃO:
   - CRM One: Sem código
   - Concorrentes: Requer programação

4. ROI:
   - CRM One: 6 meses
   - Concorrentes: 12-18 meses

5. SUPORTE:
   - CRM One: 24/7 especializado
   - Concorrentes: Horário comercial
        `
      },
      'Manual-Usuario': {
        title: 'Manual do Usuário - CRM One',
        content: 'Guia completo para utilização do CRM One com instruções passo a passo.'
      },
      'Manual-Tecnico': {
        title: 'Manual Técnico - CRM One', 
        content: 'Documentação técnica completa para configuração e manutenção.'
      },
      'Manual-Integracao': {
        title: 'Manual de Integração - CRM One',
        content: 'Guia de integração com SAP Business One e APIs.'
      }
    };

    const material = materialContent[materialName as keyof typeof materialContent];
    if (material) {
      createPDF(material.title, material.content);
    } else {
      console.error('Material não encontrado:', materialName);
    }
  };

  if (!dayData) return null;

  const handleItemCheck = (index: number, checked: boolean) => {
    const newCompletedItems = [...completedItems];
    newCompletedItems[index] = checked;
    setCompletedItems(newCompletedItems);
  };

  const handlePresentationComplete = () => {
    setPresentationCompleted(true);
  };

  useEffect(() => {
    const completed = completedItems.filter(Boolean).length;
    const total = dayData.checklist.length;
    let progress = (completed / total) * 100;

    // For module 1, include presentation completion in progress
    if (day === 1) {
      const baseProgress = (completed / total) * 70; // Checklist is 70% of progress
      const presentationProgress = presentationCompleted ? 30 : 0; // Presentation is 30%
      progress = baseProgress + presentationProgress;
    }

    setAllCompleted(completed === total && (day !== 1 || presentationCompleted));
    onProgressUpdate(progress);
  }, [completedItems, dayData.checklist.length, onProgressUpdate, day, presentationCompleted]);

  // Special handling for Module 1 with slide presentation
  if (day === 1) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center">
            {getModuleIcon(day)}
          </div>
          <h1 className="text-3xl font-bold gradient-text">{dayData.title}</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{dayData.description}</p>
        </div>

        <Tabs defaultValue="presentation" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="presentation" className="flex items-center gap-2">
              <Presentation size={16} />
              Apresentação Institucional
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <CheckCircle size={16} />
              Lista de Verificação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presentation" className="space-y-6">
            <SlidePresentation onComplete={handlePresentationComplete} />
            {presentationCompleted && (
              <div className="text-center">
                <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/50">
                  <CheckCircle size={16} className="mr-1" />
                  Apresentação Concluída
                </Badge>
              </div>
            )}
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6">
            <Card className="glass-effect border-slate-700/50">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                      <CheckCircle className="text-green-400" size={20} />
                      Lista de Verificação
                    </h3>
                    <Badge variant="outline" className="text-slate-300">
                      {completedItems.filter(Boolean).length}/{dayData.checklist.length}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {dayData.checklist.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors"
                      >
                        <Checkbox
                          id={`item-${index}`}
                          checked={completedItems[index] || false}
                          onCheckedChange={(checked) => handleItemCheck(index, checked as boolean)}
                          className="mt-1"
                        />
                        <label
                          htmlFor={`item-${index}`}
                          className={`text-sm leading-relaxed cursor-pointer flex-1 ${
                            completedItems[index] ? 'text-slate-400 line-through' : 'text-slate-300'
                          }`}
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {allCompleted && (
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/50 text-sm px-4 py-2">
              <Trophy className="mr-2" size={16} />
              Módulo Concluído com Sucesso!
            </Badge>
            <p className="text-slate-400 text-sm">
              Você completou a apresentação institucional e todos os itens de verificação.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center">
          {getModuleIcon(day)}
        </div>
        <h1 className="text-3xl font-bold gradient-text">{dayData.title}</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">{dayData.description}</p>
      </div>

      {/* Day 1 Content - Expanded */}
      {day === 1 && (
        <>
          {/* Hero Welcome Section */}
          <div className="mb-12 text-center fade-in">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-12 tech-border mb-8">
              <h3 className="text-4xl font-bold mb-6 text-white">🚀 Bem-vindo à Família DWU!</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Você acaba de ingressar em uma das empresas mais inovadoras do setor de tecnologia empresarial! 
                Prepare-se para uma jornada extraordinária onde sua paixão por tecnologia encontrará propósito e impacto real.
              </p>
              <div className="flex justify-center items-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">15+</div>
                  <div className="text-blue-100">Anos de Mercado</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-300">500+</div>
                  <div className="text-blue-100">Clientes Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">99.9%</div>
                  <div className="text-blue-100">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Video Section */}
          <Card className="mb-8 glass-effect tech-border slide-in-left">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 gradient-text text-center">Nossa História em Movimento</h4>
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-600 shadow-2xl">
                <iframe 
                  className="w-full h-full" 
                  src="https://www.youtube.com/embed/vzt76rd65sQ" 
                  title="Vídeo Institucional DWU" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
              <p className="text-center text-slate-400 mt-4">
                Descubra como transformamos ideias em soluções que impactam milhares de empresas
              </p>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="glass-effect tech-border slide-in-left">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                  <Heart className="mr-3" size={32} />Nossa Missão
                </h4>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  "Transformar a gestão empresarial através de tecnologia de ponta, 
                  oferecendo soluções integradas que potencializam o crescimento e a eficiência dos nossos clientes."
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3" size={20} />
                    <span className="text-slate-300">Inovação contínua em ERP</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-blue-400 mr-3" size={20} />
                    <span className="text-slate-300">Suporte técnico de excelência</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-purple-400 mr-3" size={20} />
                    <span className="text-slate-300">Parceria estratégica com clientes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect tech-border slide-in-right">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold mb-6 text-green-400 flex items-center">
                  <Globe className="mr-3" size={32} />Nossa Visão
                </h4>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  "Ser a empresa líder em soluções ERP integradas na América Latina, 
                  reconhecida pela excelência técnica e impacto transformador nos negócios."
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="text-yellow-400 mr-3" size={20} />
                    <span className="text-slate-300">Expansão internacional</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-red-400 mr-3" size={20} />
                    <span className="text-slate-300">Tecnologia de vanguarda</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3" size={20} />
                    <span className="text-slate-300">Sustentabilidade e responsabilidade</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Major Clients Showcase */}
          <Card className="mb-8 glass-effect tech-border scale-in">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 gradient-text text-center">Nossos Grandes Clientes</h4>
              <p className="text-center text-slate-300 mb-8">
                Orgulhamo-nos de ser a escolha de empresas líderes em diversos setores
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 rounded-2xl text-center tech-border">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="text-white" size={32} />
                  </div>
                  <h5 className="font-bold text-blue-300">Manufatura</h5>
                  <p className="text-sm text-slate-400">150+ empresas</p>
                </div>

                <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-6 rounded-2xl text-center tech-border">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart className="text-white" size={32} />
                  </div>
                  <h5 className="font-bold text-green-300">Varejo</h5>
                  <p className="text-sm text-slate-400">200+ lojas</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 rounded-2xl text-center tech-border">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-white" size={32} />
                  </div>
                  <h5 className="font-bold text-purple-300">Saúde</h5>
                  <p className="text-sm text-slate-400">80+ clínicas</p>
                </div>

                <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 p-6 rounded-2xl text-center tech-border">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="text-white" size={32} />
                  </div>
                  <h5 className="font-bold text-orange-300">Logística</h5>
                  <p className="text-sm text-slate-400">120+ empresas</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-slate-400 mb-4">
                  <strong className="text-green-400">Confiança</strong> de empresas de pequeno porte até 
                  <strong className="text-blue-400"> multinacionais</strong> em mais de 
                  <strong className="text-purple-400"> 15 países</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Teams & Departments */}
          <Card className="mb-8 glass-effect tech-border slide-in-right">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 gradient-text text-center">Nossos Times de Excelência</h4>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-2xl tech-border group hover:scale-105 transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <Headset className="text-white" size={28} />
                  </div>
                  <h5 className="text-xl font-bold mb-3 text-blue-300">Suporte Técnico</h5>
                  <p className="text-slate-300 text-sm mb-4">
                    Seu novo lar! Equipe especializada em resolver desafios complexos com agilidade e expertise.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li>• N1: Primeiro atendimento e triagem</li>
                    <li>• N2: Análise técnica avançada</li>
                    <li>• N3: Especialistas em arquitetura</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-6 rounded-2xl tech-border group hover:scale-105 transition-all duration-300">
                  <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <Database className="text-white" size={28} />
                  </div>
                  <h5 className="text-xl font-bold mb-3 text-green-300">Desenvolvimento</h5>
                  <p className="text-slate-300 text-sm mb-4">
                    Criadores do CRM One e responsáveis por inovações que transformam o mercado.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li>• Frontend & Backend</li>
                    <li>• Integrações SAP</li>
                    <li>• DevOps & Cloud</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-2xl tech-border group hover:scale-105 transition-all duration-300">
                  <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <Users className="text-white" size={28} />
                  </div>
                  <h5 className="text-xl font-bold mb-3 text-purple-300">Consultoria</h5>
                  <p className="text-slate-300 text-sm mb-4">
                    Especialistas em implementação e otimização de processos empresariais.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li>• Análise de negócios</li>
                    <li>• Implementação SAP B1</li>
                    <li>• Treinamento de usuários</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivational Culture Section */}
          <Card className="mb-8 bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 tech-border slide-in-left">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 gradient-text text-center">Nossa Cultura Transformadora</h4>

              <div className="text-center mb-8">
                <p className="text-xl text-slate-200 leading-relaxed max-w-4xl mx-auto">
                  "Na DWU, acreditamos que cada colaborador é um agente de mudança. Sua jornada aqui não é apenas 
                  sobre crescimento profissional, mas sobre impacto real no mundo dos negócios."
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="text-white" size={36} />
                  </div>
                  <h5 className="font-bold text-blue-300 mb-2">Paixão</h5>
                  <p className="text-sm text-slate-400">Por tecnologia e excelência</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-white" size={36} />
                  </div>
                  <h5 className="font-bold text-green-300 mb-2">Colaboração</h5>
                  <p className="text-sm text-slate-400">Juntos somos mais fortes</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="text-white" size={36} />
                  </div>
                  <h5 className="font-bold text-purple-300 mb-2">Excelência</h5>
                  <p className="text-sm text-slate-400">Sempre superando expectativas</p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="text-white" size={36} />
                  </div>
                  <h5 className="font-bold text-orange-300 mb-2">Impacto</h5>
                  <p className="text-sm text-slate-400">Transformando o futuro</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools Overview */}
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardContent className="p-8">
              <h4 className="text-xl font-semibold mb-6 text-dwu-green flex items-center">
                <Database className="mr-2" />Ferramentas Utilizadas no Suporte
              </h4>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-lg border border-slate-600">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Database className="text-white" size={24} />
                  </div>
                  <h5 className="font-semibold mb-2">CRM One</h5>
                  <p className="text-slate-400 text-sm">Sistema principal de gestão de relacionamento com clientes</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-lg border border-slate-600">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <BarChart className="text-white" size={24} />
                  </div>
                  <h5 className="font-semibold mb-2">SAP Business One</h5>
                  <p className="text-slate-400 text-sm">ERP integrado para gestão empresarial completa</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-lg border border-slate-600">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Ticket className="text-white" size={24} />
                  </div>
                  <h5 className="font-semibold mb-2">Jira & Help Desk</h5>
                  <p className="text-slate-400 text-sm">Gestão de chamados e tickets de suporte</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Day 2 Content */}
      {day === 2 && (
        <>
          {/* Estrutura do CRM One */}
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 text-dwu-green flex items-center">
                <Database className="mr-3" />
                Estrutura Técnica do CRM One
              </h4>

              <div className="space-y-8">
                {/* Onde é instalado - IIS */}
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-lg tech-border">
                  <h5 className="text-xl font-bold mb-4 text-blue-300 flex items-center">
                    <Server className="mr-3" size={24} />
                    Instalação e Ambiente
                  </h5>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-semibold mb-3 text-blue-200">Internet Information Services (IIS)</h6>
                      <ul className="space-y-2 text-slate-300">
                        <li>• <strong>Servidor Web Principal:</strong> O CRM One é uma aplicação web hospedada no IIS</li>
                        <li>• <strong>Ambiente .NET:</strong> Framework robusto para aplicações empresariais</li>
                        <li>• <strong>Configurações de Pool:</strong> Gestão de recursos e performance</li>
                        <li>• <strong>SSL/TLS:</strong> Comunicação segura e criptografada</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-semibold mb-3 text-green-200">Ambiente de Integração</h6>
                      <ul className="space-y-2 text-slate-300">
                        <li>• <strong>Multi-tenant:</strong> Suporte a múltiplos clientes</li>
                        <li>• <strong>Load Balancer:</strong> Distribuição inteligente de carga</li>
                        <li>• <strong>Serviços Windows:</strong> Processamento em background</li>
                        <li>• <strong>APIs RESTful:</strong> Comunicação moderna e eficiente</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Integração em Tempo Real */}
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-6 rounded-lg tech-border">
                  <h5 className="text-xl font-bold mb-4 text-green-300 flex items-center">
                    <Zap className="mr-3" size={24} />
                    Integração com SAP Business One
                  </h5>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-semibold mb-3 text-green-200">Comunicação em Tempo Real</h6>
                      <div className="bg-slate-800 p-4 rounded border border-green-600/30">
                        <p className="text-slate-300 mb-3">
                          <strong>100% Real-time:</strong> O CRM One se comunica diretamente com o SAP Business One 
                          através de APIs nativas, garantindo sincronização instantânea de dados.
                        </p>
                        <ul className="space-y-1 text-slate-400 text-sm">
                          <li>✓ Consultas instantâneas ao banco SAP</li>
                          <li>✓ Atualizações em tempo real</li>
                          <li>✓ Validações automáticas</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h6 className="font-semibold mb-3 text-orange-200">Processamento em Background</h6>
                      <div className="bg-slate-800 p-4 rounded border border-orange-600/30">
                        <p className="text-slate-300 mb-3">
                          <strong>Fila de Sincronização:</strong> Para operações complexas, o sistema utiliza 
                          filas de processamento que garantem a integridade dos dados.
                        </p>
                        <ul className="space-y-1 text-slate-400 text-sm">
                          <li>✓ Processamento assíncrono</li>
                          <li>✓ Retry automático em falhas</li>
                          <li>✓ Logs detalhados de operações</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bancos de Dados */}
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-lg tech-border">
                  <h5 className="text-xl font-bold mb-4 text-purple-300 flex items-center">
                    <Database className="mr-3" size={24} />
                    Bancos de Dados Suportados
                  </h5>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-semibold mb-3 text-purple-200">SQL Server (Service Layer)</h6>
                      <div className="space-y-3">
                        <div className="bg-slate-800 p-3 rounded border border-purple-600/30">
                          <strong className="text-purple-300">Versões Suportadas:</strong>
                          <ul className="mt-2 space-y-1 text-slate-400 text-sm">
                            <li>• SQL Server 2016</li>
                            <li>• SQL Server 2017</li>
                            <li>• SQL Server 2018</li>
                            <li>• SQL Server 2019</li>
                            <li>• SQL Server 2022</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h6 className="font-semibold mb-3 text-cyan-200">SAP HANA</h6>
                      <div className="bg-slate-800 p-3 rounded border border-cyan-600/30">
                        <p className="text-slate-300 mb-2">
                          <strong>In-Memory Database:</strong> Para clientes que utilizam SAP HANA como banco principal.
                        </p>
                        <ul className="space-y-1 text-slate-400 text-sm">
                          <li>• Performance superior</li>
                          <li>• Processamento em memória</li>
                          <li>• Analytics em tempo real</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Versão SAP e Requisitos */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 p-6 rounded-lg tech-border">
                    <h5 className="text-xl font-bold mb-4 text-orange-300 flex items-center">
                      <Settings className="mr-3" size={24} />
                      Versão SAP Suportada
                    </h5>
                    <div className="bg-slate-800 p-4 rounded border border-orange-600/30">
                      <p className="text-slate-300 mb-3">
                        <strong>SAP Business One Client 9.3+</strong>
                      </p>
                      <p className="text-slate-400 text-sm">
                        O CRM One é compatível com todas as versões do SAP Business One 
                        a partir da versão 9.3, garantindo ampla compatibilidade com 
                        instalações existentes.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-6 rounded-lg tech-border">
                    <h5 className="text-xl font-bold mb-4 text-red-300 flex items-center">
                      <FileText className="mr-3" size={24} />
                      Requisitos de Hardware
                    </h5>
                    <div className="space-y-4">
                      <div className="bg-slate-900 p-4 rounded border border-red-600/30">
                        <h6 className="font-semibold text-red-200 mb-2">Especificações & Documentação</h6>
                        <p className="text-slate-400 text-sm mb-3">
                          Especificações mínimas e recomendadas para instalação do CRM One.
                        </p>
                        <ul className="text-sm text-slate-400 space-y-1">
                          <li>• CPU: Intel Core i5+ (i7 recomendado)</li>
                          <li>• RAM: 8GB mínimo (16GB recomendado)</li>
                          <li>• Storage: 100GB SSD (500GB recomendado)</li>
                          <li>• OS: Windows Server 2016+</li>
                          <li>• .NET Framework 4.8+</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagrama Interativo Circular Moderno */}
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 text-dwu-green flex items-center">
                <Network className="mr-3" />
                Diagrama de Comunicação CRM One ↔ SAP
              </h4>
              <p className="text-slate-400 mb-6 text-center">
                Passe o mouse sobre os componentes para conhecer suas funcionalidades
              </p>

              <TooltipProvider delayDuration={200} skipDelayDuration={100}>
                <div className="bg-slate-900 p-8 rounded-lg border border-slate-600 relative overflow-hidden">
                  {/* Container principal com layout circular */}
                  <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible"
                       style={{ zIndex: 1 }}>
                    
                    {/* Elemento central - Núcleo do Sistema */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-cyan-500/30 border-4 border-slate-500/50 flex items-center justify-center group hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/70 transition-all duration-500 cursor-pointer backdrop-blur-sm relative">
                            {/* Pulse ring effect on hover */}
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                                <Globe className="text-white" size={32} />
                              </div>
                              <h6 className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors">CRM One</h6>
                              <p className="text-xs text-slate-300 group-hover:text-slate-200 transition-colors">Sistema Central</p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-slate-800/95 backdrop-blur-sm border-blue-500/50 max-w-xs shadow-2xl shadow-blue-500/20 animate-in fade-in-0 zoom-in-95 duration-200"
                          sideOffset={8}
                          style={{ zIndex: 9999 }}
                          side="top"
                          align="center"
                          avoidCollisions={true}
                          collisionPadding={20}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                              <h6 className="font-bold text-blue-300 text-sm">CRM One - Sistema Central</h6>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed mb-3">Núcleo do sistema que orquestra toda a comunicação entre os componentes. Interface moderna, APIs robustas e integrações em tempo real.</p>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                              <span className="text-xs text-slate-400">Status</span>
                              <span className="text-xs text-green-400 font-medium">Ativo</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Círculo decorativo */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-600/40 animate-spin" style={{ animation: 'spin 30s linear infinite' }}></div>
                    <div className="absolute inset-8 rounded-full border border-slate-600/20"></div>

                    {/* Elemento 01 - CRM Interface (Top) */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="group cursor-pointer">
                            {/* Enhanced diamond with hover effects */}
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 transform rotate-45 rounded-lg shadow-lg group-hover:scale-110 group-hover:shadow-red-500/50 group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              </div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45">
                                <Monitor className="text-white" size={24} />
                              </div>
                              <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                            </div>
                            {/* Label */}
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full mt-4 shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold">01</span>
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-sm">CRM Interface</p>
                                  <p className="text-xs opacity-80">Interface Web Responsiva</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-slate-800/95 backdrop-blur-sm border-red-500/50 max-w-xs shadow-2xl shadow-red-500/20 animate-in fade-in-0 zoom-in-95 duration-200"
                          sideOffset={8}
                          style={{ zIndex: 9999 }}
                          side="bottom"
                          align="center"
                          avoidCollisions={true}
                          collisionPadding={20}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Monitor className="w-3 h-3 text-red-400" />
                              <h6 className="font-bold text-red-300 text-sm">Interface CRM One</h6>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed mb-3">Interface web principal desenvolvida em React. Design moderno, responsivo e otimizado para produtividade máxima dos usuários.</p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                              <div>
                                <span className="text-xs text-slate-400">Framework</span>
                                <p className="text-xs text-blue-400 font-medium">React</p>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400">Status</span>
                                <p className="text-xs text-green-400 font-medium">Online</p>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Elemento 02 - IIS Server (Left) */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="group cursor-pointer">
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 transform rotate-45 rounded-lg shadow-lg group-hover:scale-110 group-hover:shadow-orange-500/50 group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              </div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45">
                                <Server className="text-white" size={24} />
                              </div>
                              <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                            </div>
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full mt-4 shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold">02</span>
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-sm">IIS Server</p>
                                  <p className="text-xs opacity-80">Servidor Web Microsoft</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-slate-800/95 backdrop-blur-sm border-orange-500/50 max-w-xs shadow-2xl shadow-orange-500/20 animate-in fade-in-0 zoom-in-95 duration-200"
                          sideOffset={8}
                          style={{ zIndex: 9999 }}
                          side="right"
                          align="center"
                          avoidCollisions={true}
                          collisionPadding={20}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Server className="w-3 h-3 text-orange-400" />
                              <h6 className="font-bold text-orange-300 text-sm">Internet Information Services</h6>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed mb-3">Servidor web da Microsoft que hospeda a aplicação CRM One. Gerencia pools de aplicação, certificados SSL e balanceamento de carga.</p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                              <div>
                                <span className="text-xs text-slate-400">Versão</span>
                                <p className="text-xs text-blue-400 font-medium">IIS 10</p>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400">SSL</span>
                                <p className="text-xs text-green-400 font-medium">Ativo</p>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Elemento 03 - Service Layer (Right) */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="group cursor-pointer">
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 transform rotate-45 rounded-lg shadow-lg group-hover:scale-110 group-hover:shadow-yellow-500/50 group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              </div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45">
                                <Code className="text-white" size={24} />
                              </div>
                              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-full mt-4 shadow-lg group-hover:shadow-yellow-500/30 transition-all duration-300">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold">03</span>
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-sm">Service Layer</p>
                                  <p className="text-xs opacity-80">API RESTful SAP B1</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-slate-800/95 backdrop-blur-sm border-yellow-500/50 max-w-xs shadow-2xl shadow-yellow-500/20 animate-in fade-in-0 zoom-in-95 duration-200"
                          sideOffset={8}
                          style={{ zIndex: 9999 }}
                          side="left"
                          align="center"
                          avoidCollisions={true}
                          collisionPadding={20}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Code className="w-3 h-3 text-yellow-400" />
                              <h6 className="font-bold text-yellow-300 text-sm">SAP Service Layer</h6>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed mb-3">API RESTful moderna do SAP Business One. Permite integração via HTTP/HTTPS com autenticação OAuth e operações CRUD completas.</p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                              <div>
                                <span className="text-xs text-slate-400">Protocolo</span>
                                <p className="text-xs text-blue-400 font-medium">HTTPS</p>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400">Auth</span>
                                <p className="text-xs text-green-400 font-medium">OAuth</p>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Elemento 04 - Database (Bottom) */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="group cursor-pointer">
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 transform rotate-45 rounded-lg shadow-lg group-hover:scale-110 group-hover:shadow-green-500/50 group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              </div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45">
                                <Database className="text-white" size={24} />
                              </div>
                              <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full mt-4 shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold">04</span>
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-sm">Database</p>
                                  <p className="text-xs opacity-80">HANA/SQL Server</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-slate-800/95 backdrop-blur-sm border-green-500/50 max-w-xs shadow-2xl shadow-green-500/20 animate-in fade-in-0 zoom-in-95 duration-200"
                          sideOffset={8}
                          style={{ zIndex: 9999 }}
                          side="top"
                          align="center"
                          avoidCollisions={true}
                          collisionPadding={20}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Database className="w-3 h-3 text-green-400" />
                              <h6 className="font-bold text-green-300 text-sm">Banco de Dados SAP</h6>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed mb-3">Banco principal do SAP Business One. Suporta SQL Server e SAP HANA in-memory para performance superior e analytics em tempo real.</p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                              <div>
                                <span className="text-xs text-slate-400">Engine</span>
                                <p className="text-xs text-blue-400 font-medium">HANA</p>
                              </div>
                              <div>
                                <span className="text-xs text-slate-400">Performance</span>
                                <p className="text-xs text-green-400 font-medium">High</p>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Linhas de conexão animadas */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                      <defs>
                        <linearGradient id="connectionGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6"/>
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6"/>
                        </linearGradient>
                        <linearGradient id="connectionGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.6"/>
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Linha do CRM Interface para o centro */}
                      <line 
                        x1="50%" y1="15%" 
                        x2="50%" y2="50%" 
                        stroke="url(#connectionGradient1)" 
                        strokeWidth="3" 
                        strokeDasharray="10,5"
                        className="animate-pulse"
                      />
                      
                      {/* Linha do IIS Server para o centro */}
                      <line 
                        x1="15%" y1="50%" 
                        x2="50%" y2="50%" 
                        stroke="url(#connectionGradient1)" 
                        strokeWidth="3" 
                        strokeDasharray="10,5"
                        className="animate-pulse"
                        style={{ animationDelay: '0.5s' }}
                      />
                      
                      {/* Linha do Service Layer para o centro */}
                      <line 
                        x1="85%" y1="50%" 
                        x2="50%" y2="50%" 
                        stroke="url(#connectionGradient2)" 
                        strokeWidth="3" 
                        strokeDasharray="10,5"
                        className="animate-pulse"
                        style={{ animationDelay: '1s' }}
                      />
                      
                      {/* Linha do Database para o centro */}
                      <line 
                        x1="50%" y1="85%" 
                        x2="50%" y2="50%" 
                        stroke="url(#connectionGradient2)" 
                        strokeWidth="3" 
                        strokeDasharray="10,5"
                        className="animate-pulse"
                        style={{ animationDelay: '1.5s' }}
                      />
                    </svg>

                  </div>

                  {/* Resumo do fluxo com design moderno */}
                  <div className="mt-8 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/50 backdrop-blur-sm">
                    <h6 className="text-center text-slate-300 font-semibold mb-6 text-xl flex items-center justify-center">
                      <Zap className="mr-3" size={24} />
                      Fluxo de Comunicação Integrada
                    </h6>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-4 rounded-xl border border-red-600/30 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">01</span>
                          </div>
                          <Monitor className="text-red-300" size={20} />
                        </div>
                        <h6 className="text-red-300 font-semibold mb-2">Interface</h6>
                        <p className="text-slate-400 text-xs">Usuário interage com CRM moderno e responsivo</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 p-4 rounded-xl border border-orange-600/30 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">02</span>
                          </div>
                          <Server className="text-orange-300" size={20} />
                        </div>
                        <h6 className="text-orange-300 font-semibold mb-2">Processamento</h6>
                        <p className="text-slate-400 text-xs">IIS processa requisições com alta performance</p>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 p-4 rounded-xl border border-yellow-600/30 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">03</span>
                          </div>
                          <Code className="text-yellow-300" size={20} />
                        </div>
                        <h6 className="text-yellow-300 font-semibold mb-2">Integração</h6>
                        <p className="text-slate-400 text-xs">Service Layer conecta com SAP Business One</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-4 rounded-xl border border-green-600/30 hover:scale-105 transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">04</span>
                          </div>
                          <Database className="text-green-300" size={20} />
                        </div>
                        <h6 className="text-green-300 font-semibold mb-2">Persistência</h6>
                        <p className="text-slate-400 text-xs">Dados seguros em HANA/SQL Server</p>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center space-x-2 bg-slate-800/70 px-4 py-2 rounded-full border border-slate-600/50">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-slate-300 text-sm font-medium">Sistema 100% integrado em tempo real</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>

          {/* Configurações e Domínios */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Configurações */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h5 className="text-xl font-bold mb-4 text-yellow-300 flex items-center">
                  <Settings className="mr-3" size={24} />
                  Configurações do Sistema
                </h5>
                <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded border border-yellow-600/30">
                    <h6 className="font-semibold text-yellow-200 mb-2">Balancers & Variáveis</h6>
                    <p className="text-slate-400 text-sm">
                      Através de arquivos de configuração JSON, é possível definir N configurações 
                      para uso de APIs específicas, conexões de banco, e parâmetros de integração.
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded border border-blue-600/30">
                    <h6 className="font-semibold text-blue-200 mb-2">Serviços Windows & IIS</h6>
                    <p className="text-slate-400 text-sm">
                      O CRM One possui configurações tanto para serviços no Windows 
                      quanto para balanceadores dentro do IIS, garantindo alta disponibilidade.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domínios Obrigatórios */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h5 className="text-xl font-bold mb-4 text-red-300 flex items-center">
                  <Globe className="mr-3" size={24} />
                  Domínios Obrigatórios
                </h5>
                <div className="bg-slate-900 p-4 rounded border border-red-600/30">
                  <p className="text-slate-300 mb-4">
                    Para que a estrutura responda corretamente, os seguintes domínios 
                    devem estar acessíveis:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <code className="text-green-300 font-mono text-sm">viacep.com.br/ws</code>
                        <p className="text-xs text-slate-400">Consulta de CEP</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <code className="text-blue-300 font-mono text-sm">receita.ws.com.br/v1/cnpj</code>
                        <p className="text-xs text-slate-400">Consulta de CNPJ</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <code className="text-purple-300 font-mono text-sm">dwu.com.br</code>
                        <p className="text-xs text-slate-400">Serviços DWU</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Downloads Section */}
          <Card className="mb-8 bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-slate-600">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 text-center gradient-text flex items-center justify-center">
                <Download className="mr-3" size={28} />
                Downloads de Materiais Técnicos
              </h4>
              <p className="text-center text-slate-300 mb-8">
                Acesse documentos técnicos completos para implementação e configuração do CRM One
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-6 rounded-lg border border-red-600/30 hover:border-red-500/50 transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <h6 className="font-bold text-red-300">Requisitos Técnicos</h6>
                      <p className="text-xs text-slate-400">Documento completo</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    Pré-requisitos técnicos completos de hardware e software para instalação do CRM One.
                  </p>
                  <Button 
                    onClick={() => downloadMaterial('Requisitos-Tecnicos-Completos')}
                    className="w-full bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <Download className="mr-2" size={16} />
                    Download PDF
                  </Button>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg border border-yellow-600/30 hover:border-yellow-500/50 transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Settings className="text-white" size={24} />
                    </div>
                    <div>
                      <h6 className="font-bold text-yellow-300">Configurações</h6>
                      <p className="text-xs text-slate-400">Balancers & Variáveis</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    Guia completo de configuração de balanceadores e variáveis de sistema.
                  </p>
                  <Button 
                    onClick={() => downloadMaterial('Config-Balancers')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 transition-colors"
                  >
                    <Download className="mr-2" size={16} />
                    Download PDF
                  </Button>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg border border-green-600/30 hover:border-green-500/50 transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Database className="text-white" size={24} />
                    </div>
                    <div>
                      <h6 className="font-bold text-green-300">Manual de Integração</h6>
                      <p className="text-xs text-slate-400">SAP Business One</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    Documentação para integração com SAP Business One e configuração de APIs.
                  </p>
                  <Button 
                    onClick={() => downloadMaterial('Manual-Integracao')}
                    className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <Download className="mr-2" size={16} />
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
                  <p className="text-slate-400 text-sm">
                    <Info className="inline mr-2" size={16} />
                    Todos os documentos são gerados automaticamente em formato PDF com as informações mais atualizadas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Day 3 Content */}
      {day === 3 && (
        <>
          <Card className="mb-8 glass-effect tech-border slide-in-left">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 gradient-text text-center">CRM One vs Concorrência</h4>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-blue-300 flex items-center">
                      <Trophy className="mr-3" size={24} />
                      Diferenciais Competitivos
                    </h5>
                    <ul className="space-y-2 text-slate-400">
                      <li>• Integração nativa com SAP Business One</li>
                      <li>• Interface moderna e intuitiva</li>
                      <li>• Customização completa sem código</li>
                      <li>• Performance superior</li>
                      <li>• Suporte técnico especializado</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-green-300 flex items-center">
                      <BarChart className="mr-3" size={24} />
                      Vantagens de Mercado
                    </h5>
                    <ul className="space-y-2 text-slate-400">
                      <li>• Menor custo total de propriedade</li>
                      <li>• Implementação mais rápida</li>
                      <li>• ROI comprovado em 6 meses</li>
                      <li>• Escalabilidade empresarial</li>
                      <li>• Compliance total com LGPD</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-purple-300 flex items-center">
                      <CheckCircle className="mr-3" size={24} />
                      Casos de Sucesso
                    </h5>
                    <ul className="space-y-2 text-slate-400">
                      <li>• +500 empresas utilizando</li>
                      <li>• 99.8% de disponibilidade</li>
                      <li>• 40% redução em processos manuais</li>
                      <li>• 60% melhoria na produtividade</li>
                      <li>• NPS 8.7/10 satisfação</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-orange-300 flex items-center">
                      <FileText className="mr-3" size={24} />
                      Material de Apoio
                    </h5>
                    <p className="text-slate-300 mb-4">
                      Acesse material detalhado de comparação com concorrentes
                    </p>
                    <Button 
                      onClick={() => downloadMaterial('Comparativo-CRM-One')}
                      className="w-full bg-orange-600 hover:bg-orange-700 cursor-pointer transition-all duration-200 hover:scale-105"
                    >
                      <Download className="mr-2" size={16} />
                      Download PDF Comparativo
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 tech-border">
                <CardContent className="p-6">
                  <h5 className="text-xl font-bold mb-4 text-center gradient-text">Posicionamento Estratégico</h5>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Globe className="text-white" size={24} />
                      </div>
                      <h6 className="font-bold text-blue-300 mb-2">Inovação</h6>
                      <p className="text-xs text-slate-400">Tecnologia de ponta com foco em UX</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Database className="text-white" size={24} />
                      </div>
                      <h6 className="font-bold text-green-300 mb-2">Integração</h6>
                      <p className="text-xs text-slate-400">Conectividade total com ecossistema SAP</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Headset className="text-white" size={24} />
                      </div>
                      <h6 className="font-bold text-purple-300 mb-2">Suporte</h6>
                      <p className="text-xs text-slate-400">Atendimento especializado 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </>
      )}

      {/* Day 4 Content */}
      {day === 4 && (
        <>
          <Card className="mb-8 glass-effect tech-border slide-in-left">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 gradient-text text-center">Funcionalidades Detalhadas</h4>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-blue-300 flex items-center">
                      <FileText className="mr-3" size={24} />
                      Biblioteca de Manuais
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Manual do Usuário</p>
                          <p className="text-sm text-slate-400">Guia completo de utilização</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => downloadMaterial('Manual-Usuario')}
                          className="cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          <Download className="mr-2" size={14} />
                          Download
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Manual Técnico</p>
                          <p className="text-sm text-slate-400">Configurações avançadas</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => downloadMaterial('Manual-Tecnico')}
                          className="cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          <Download className="mr-2" size={14} />
                          Download
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Manual de Integração</p>
                          <p className="text-sm text-slate-400">APIs e conexões SAP</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => downloadMaterial('Manual-Integracao')}
                          className="cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          <Download className="mr-2" size={14} />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-green-300 flex items-center">
                      <Globe className="mr-3" size={24} />
                      Links de Referência
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">Portal de Documentação</p>
                        <p className="text-sm text-slate-400">docs.crm-one.com.br</p>
                      </div>
                      <div>
                        <p className="font-semibold">Base de Conhecimento</p>
                        <p className="text-sm text-slate-400">kb.crm-one.com.br</p>
                      </div>
                      <div>
                        <p className="font-semibold">API Reference</p>
                        <p className="text-sm text-slate-400">api.crm-one.com.br</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-purple-300 flex items-center">
                      <BarChart className="mr-3" size={24} />
                      Vídeos Tutoriais
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Módulo Vendas</p>
                          <p className="text-sm text-slate-400">Gestão completa do ciclo de vendas</p>
                        </div>
                        <Button size="sm" variant="outline">
                          ▶ Assistir
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Módulo Financeiro</p>
                          <p className="text-sm text-slate-400">Controle financeiro e relatórios</p>
                        </div>
                        <Button size="sm" variant="outline">
                          ▶ Assistir
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Integração SAP</p>
                          <p className="text-sm text-slate-400">Setup e configuração de APIs</p>
                        </div>
                        <Button size="sm" variant="outline">
                          ▶ Assistir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-orange-300 flex items-center">
                      <Gamepad className="mr-3" size={24} />
                      Exercícios Práticos
                    </h5>
                    <p className="text-slate-300 mb-4">
                      Complete todos os exercícios para obter a certificação DWU CRM One Expert.
                    </p>
                    <div className="space-y-2">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Iniciar Simulação do Sistema
                      </Button>
                      <Button className="w-full" variant="outline">
                        Exercícios de API
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 tech-border">
                <CardContent className="p-6">
                  <h5 className="text-xl font-bold mb-4 text-center gradient-text">Conteúdo Avançado</h5>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Database className="text-white" size={20} />
                      </div>
                      <h6 className="font-bold text-blue-300 mb-1">Customizações</h6>
                      <p className="text-xs text-slate-400">Scripts e personalizações</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <BarChart className="text-white" size={20} />
                      </div>
                      <h6 className="font-bold text-green-300 mb-1">Relatórios</h6>
                      <p className="text-xs text-slate-400">Crystal Reports e BI</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Globe className="text-white" size={20} />
                      </div>
                      <h6 className="font-bold text-purple-300 mb-1">Workflows</h6>
                      <p className="text-xs text-slate-400">Automação de processos</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Trophy className="text-white" size={20} />
                      </div>
                      <h6 className="font-bold text-orange-300 mb-1">Certificação</h6>
                      <p className="text-xs text-slate-400">Avaliação final</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </>
      )}



      {/* Checklist */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="mr-2 text-dwu-green" />Checklist - Dia {day}
          </h4>
          <div className="space-y-3">
            {dayData.checklist.map((item, index) => (
              <label key={index} className="flex items-center cursor-pointer">
                <Checkbox
                  checked={checkedItems[`item-${index}`] || false}
                  onCheckedChange={(checked) => handleCheckboxChange(`item-${index}`, checked as boolean)}
                  className="mr-3"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}