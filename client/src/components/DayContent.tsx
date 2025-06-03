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
  FileText, TriangleAlert, Search, Gamepad, Info, ArrowUp, ArrowRight, UserCircle, Presentation
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DayContentProps {
  day: number;
  onProgressUpdate: (progress: number) => void;
}

// Slide Presentation Component (Mock)
const slides = [
  { id: 1, title: "Bem-vindo à DWU", content: "Uma jornada de transformação digital." },
  { id: 2, title: "Nossa Missão", content: "Inovação e excelência em cada solução." },
  { id: 3, title: "Nossos Valores", content: "Paixão, colaboração, e impacto." },
];

interface SlidePresentationProps {
  onComplete: () => void;
}

function SlidePresentation({ onComplete }: SlidePresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <Card className="glass-effect tech-border">
      <CardContent className="p-8">
        <h4 className="text-2xl font-bold mb-6 gradient-text text-center">{slides[currentSlide].title}</h4>
        <p className="text-center text-slate-300 mb-8">{slides[currentSlide].content}</p>
        <div className="text-center">
          {currentSlide < slides.length - 1 ? (
            <Button onClick={nextSlide}>Próximo Slide</Button>
          ) : (
            <Button onClick={nextSlide}>Concluir Apresentação</Button>
          )}
        </div>
      </CardContent>
    </Card>
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
    // Create a mock PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${materialName}.pdf`;
    link.click();
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
          <Card className="mb-8 glass-effect tech-border slide-in-left">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold mb-6 gradient-text text-center">Estrutura do CRM One</h4>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-blue-300 flex items-center">
                      <Database className="mr-3" size={24} />
                      Banco de Dados
                    </h5>
                    <p className="text-slate-300 mb-4">Estrutura de dados SQL Server e SAP HANA</p>
                    <ul className="space-y-2 text-slate-400">
                      <li>• SQL Server (dados principais)</li>
                      <li>• SAP HANA (integração ERP)</li>
                      <li>• Stored Procedures</li>
                      <li>• Views e triggers</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-green-300 flex items-center">
                      <Globe className="mr-3" size={24} />
                      APIs
                    </h5>
                    <p className="text-slate-300 mb-4">APIs de integração e comunicação</p>
                    <ul className="space-y-2 text-slate-400">
                      <li>• DI-Server (Data Interface)</li>
                      <li>• Service Layer (SAP B1)</li>
                      <li>• REST APIs</li>
                      <li>• WebServices SOAP</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-purple-300 flex items-center">
                      <Building className="mr-3" size={24} />
                      Portal Web
                    </h5>
                    <p className="text-slate-300 mb-4">Infraestrutura do portal e serviços</p>
                    <ul className="space-y-2 text-slate-400">
                      <li>• IIS (Internet Information Services)</li>
                      <li>• Load Balancer</li>
                      <li>• Serviços Windows</li>
                      <li>• SSL/TLS Certificados</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 tech-border">
                  <CardContent className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-orange-300 flex items-center">
                      <Headset className="mr-3" size={24} />
                      Ferramentas de Suporte
                    </h5>
                    <p className="text-slate-300 mb-4">Ferramentas para gestão e comunicação</p>
                    <ul className="space-y-2 text-slate-400">
                      <li>• Notion (controle de bugs)</li>
                      <li>• GLPI (sistema de chamados)</li>
                      <li>• TeamViewer (acesso remoto)</li>
                      <li>• Teams (manuais e comunicação)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 tech-border">
                <CardContent className="p-6">
                  <h5 className="text-xl font-bold mb-4 text-center gradient-text">Fluxo de Dados</h5>
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    <div className="bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-500/30">
                      <span className="text-blue-300 font-semibold">Frontend</span>
                      <div className="text-xs text-slate-400">Portal CRM One</div>
                    </div>
                    <ArrowRight className="text-slate-500" size={20} />
                    <div className="bg-green-600/20 px-4 py-2 rounded-lg border border-green-500/30">
                      <span className="text-green-300 font-semibold">APIs</span>
                      <div className="text-xs text-slate-400">DI-Server/Service Layer</div>
                    </div>
                    <ArrowRight className="text-slate-500" size={20} />
                    <div className="bg-purple-600/20 px-4 py-2 rounded-lg border border-purple-500/30">
                      <span className="text-purple-300 font-semibold">ERP</span>
                      <div className="text-xs text-slate-400">SAP Business One</div>
                    </div>
                    <ArrowRight className="text-slate-500" size={20} />
                    <div className="bg-orange-600/20 px-4 py-2 rounded-lg border border-orange-500/30">
                      <span className="text-orange-300 font-semibold">Database</span>
                      <div className="text-xs text-slate-400">SQL/HANA</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      className="w-full bg-orange-600 hover:bg-orange-700"
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
                        <Button size="sm" onClick={() => downloadMaterial('Manual-Usuario')}>
                          <Download className="mr-2" size={14} />
                          Download
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Manual Técnico</p>
                          <p className="text-sm text-slate-400">Configurações avançadas</p>
                        </div>
                        <Button size="sm" onClick={() => downloadMaterial('Manual-Tecnico')}>
                          <Download className="mr-2" size={14} />
                          Download
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Manual de Integração</p>
                          <p className="text-sm text-slate-400">APIs e conexões SAP</p>
                        </div>
                        <Button size="sm" onClick={() => downloadMaterial('Manual-Integracao')}>
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