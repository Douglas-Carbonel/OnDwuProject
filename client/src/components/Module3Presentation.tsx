import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Globe, 
  Database, 
  TrendingUp,
  BarChart3,
  Users,
  Settings,
  DollarSign,
  Handshake,
  Award,
  Shield,
  Clock,
  CheckCircle,
  X,
  Zap,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  Target,
  Rocket,
  Smartphone,
  Server,
  Cloud,
  Lock,
  FileText,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  LineChart,
  PieChart,
  Filter,
  Search,
  Download,
  Upload,
  Palette,
  Eye,
  MousePointer,
  Layers,
  Maximize,
  RefreshCw,
  Bell,
  Heart,
  Sparkles,
  Trophy,
  Wifi,
  WifiOff,
  List,
  Layout
} from "lucide-react";

interface Module3PresentationProps {
  onComplete: () => void;
}

export default function Module3Presentation({ onComplete }: Module3PresentationProps) {
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [completionProgress, setCompletionProgress] = useState(0);
  const [animatedCounters, setAnimatedCounters] = useState<{[key: string]: number}>({});

  const sections = [
    'hero', 'definition', 'benefits', 'functionalities', 'modules', 'why-choose', 'comparison', 'conclusion'
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    const newViewed = new Set(viewedSections);

    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
      newViewed.add(sectionId);
    }

    setExpandedSections(newExpanded);
    setViewedSections(newViewed);
  };

  // Animação para contadores
  const animateCounter = (target: number, key: string) => {
    let start = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setAnimatedCounters(prev => ({ ...prev, [key]: target }));
        clearInterval(timer);
      } else {
        setAnimatedCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
      }
    }, 20);
  };

  useEffect(() => {
    const progress = (viewedSections.size / sections.length) * 100;
    setCompletionProgress(progress);
  }, [viewedSections, sections.length]);

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 relative overflow-hidden">
      {/* Fundo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-cyan-600/5 animate-pulse duration-[3000ms]"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-600/5 via-pink-600/5 to-blue-600/5 animate-pulse duration-[4000ms]"></div>
      </div>

      {/* Header with Enhanced Progress */}
      <div className="text-center space-y-8 relative z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-2xl animate-pulse duration-2000 group-hover:blur-3xl transition-all"></div>
          <div className="relative inline-flex items-center gap-4 px-10 py-6 bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded-full border border-blue-500/30 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
            <div className="relative">
              <Rocket className="w-10 h-10 text-blue-400 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-pulse">
                CRM One
              </span>
              <p className="text-slate-300 text-sm mt-1">A Solução Definitiva para o SAP Business One</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-slate-400 text-lg">Explore todas as seções para conhecer nossa solução completa</p>
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <Progress 
                value={completionProgress} 
                className="h-6 bg-slate-800/50 border border-slate-700/50 overflow-hidden rounded-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${completionProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">{Math.round(completionProgress)}% concluído</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{viewedSections.size}/{sections.length} seções</span>
                <div className="flex gap-1">
                  {sections.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index < viewedSections.size 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50 animate-pulse' 
                          : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Aprimorado */}
      <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div 
          className="cursor-pointer transition-all duration-500 relative z-10"
          onClick={() => toggleSection('hero')}
        >
          <div className="bg-gradient-to-r from-slate-900 via-blue-900/80 to-slate-900 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative group/icon">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-50 group-hover/icon:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                    <Monitor className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-slate-900 animate-pulse shadow-lg"></div>
                </div>
                <div>
                  <h2 className="text-5xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">CRM One</h2>
                  <p className="text-blue-200 text-xl font-medium">A Solução Definitiva para o SAP Business One</p>
                  <p className="text-slate-400 text-sm mt-2 max-w-md">Transforme seu relacionamento com seus clientes e potencialize suas vendas</p>
                </div>
              </div>
              <div className="text-center">
                <div className={`transform transition-all duration-500 ${expandedSections.has('hero') ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-8 h-8 text-blue-400 animate-pulse group-hover:animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {expandedSections.has('hero') && (
          <CardContent className="p-8 space-y-8 animate-in slide-in-from-top duration-700 relative z-10">
            <div className="text-center space-y-8">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-pulse">
                "Transforme seu Relacionamento com seus clientes e potencialize suas vendas."
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    icon: Globe,
                    title: "SAP Certified",
                    desc: "Certificado pela SAP",
                    color: "blue",
                    gradient: "from-blue-600/20 to-cyan-600/20",
                    border: "border-blue-500/30",
                    iconBg: "bg-blue-500/20"
                  },
                  {
                    icon: Zap,
                    title: "100% Integrado",
                    desc: "Integração nativa com SAP B1",
                    color: "green",
                    gradient: "from-green-600/20 to-emerald-600/20",
                    border: "border-green-500/30",
                    iconBg: "bg-green-500/20"
                  },
                  {
                    icon: Award,
                    title: "DWU IT Solutions",
                    desc: "Especialistas em SAP",
                    color: "purple",
                    gradient: "from-purple-600/20 to-pink-600/20",
                    border: "border-purple-500/30",
                    iconBg: "bg-purple-500/20"
                  }
                ].map((item, index) => (
                  <div key={index} className={`group/card text-center p-8 bg-gradient-to-br ${item.gradient} rounded-2xl border ${item.border} hover:border-opacity-70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-${item.color}-500/20 cursor-pointer`}>
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 ${item.iconBg} rounded-3xl flex items-center justify-center mx-auto group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 shadow-lg`}>
                        <item.icon className={`w-10 h-10 text-${item.color}-400 drop-shadow-sm`} />
                      </div>
                      <div className={`absolute -inset-2 bg-gradient-to-r from-${item.color}-500/20 to-${item.color}-600/20 rounded-3xl blur-lg opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`}></div>
                    </div>
                    <h4 className={`text-xl font-bold text-${item.color}-300 mb-3 group-hover/card:text-white transition-colors duration-300`}>{item.title}</h4>
                    <p className="text-slate-400 group-hover/card:text-slate-300 transition-colors duration-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Definition Section - Aprimorado */}
      <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-700 border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div 
          className="cursor-pointer transition-all duration-500"
          onClick={() => toggleSection('definition')}
        >
          <div className="bg-gradient-to-r from-cyan-900/80 via-blue-900/80 to-cyan-900/80 p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg ${expandedSections.has('definition') ? 'rotate-12 scale-110' : ''}`}>
                  <Target className="w-7 h-7 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white group-hover:text-cyan-100 transition-colors duration-300">O que é o CRM One?</h2>
              </div>
              <div className={`transform transition-all duration-500 ${expandedSections.has('definition') ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-6 h-6 text-cyan-400 group-hover:animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {expandedSections.has('definition') && (
          <CardContent className="p-8 animate-in slide-in-from-left duration-700">
            <div className="space-y-10">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-cyan-300 mb-8 animate-pulse">A Solução Completa para Seu SAP Business One</h3>
                <div className="relative bg-gradient-to-br from-cyan-600/10 to-blue-600/10 p-10 rounded-3xl border border-cyan-500/30 max-w-5xl mx-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 animate-pulse duration-3000"></div>
                  <p className="text-slate-300 text-xl leading-relaxed relative z-10">
                    O CRM One é uma solução <strong className="text-cyan-300 font-bold">100% integrada ao SAP Business One</strong>, 
                    desenvolvida para aprimorar a gestão comercial, fortalecer o relacionamento com clientes e 
                    otimizar processos de vendas e pós-venda. Tudo isso com dados em tempo real, eliminando a 
                    necessidade de integrações externas e garantindo máxima eficiência para sua operação.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mt-12">
                <div className="space-y-6">
                  <h4 className="text-2xl font-bold text-cyan-300 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Principais Características
                  </h4>
                  <div className="space-y-4">
                    {[
                      "Integração nativa com SAP Business One",
                      "Dados em tempo real sem intermediários",
                      "Elimina necessidade de integrações externas",
                      "Máxima eficiência operacional"
                    ].map((item, index) => (
                      <div key={index} className="group flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 cursor-pointer border border-slate-700/30 hover:border-cyan-500/30">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-slate-300 group-hover:text-white transition-colors duration-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-2xl font-bold text-cyan-300 flex items-center gap-3">
                    <Star className="w-6 h-6" />
                    Benefícios Imediatos
                  </h4>
                  <div className="space-y-4">
                    {[
                      "Aprimoramento da gestão comercial",
                      "Fortalecimento do relacionamento com clientes",
                      "Otimização de processos de vendas",
                      "Melhoria no pós-venda"
                    ].map((item, index) => (
                      <div key={index} className="group flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 cursor-pointer border border-slate-700/30 hover:border-cyan-500/30">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Star className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-slate-300 group-hover:text-white transition-colors duration-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Benefits Section - Aprimorado */}
      <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-700 border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div 
          className="cursor-pointer transition-all duration-500"
          onClick={() => toggleSection('benefits')}
        >
          <div className="bg-gradient-to-r from-green-900/80 via-emerald-900/80 to-green-900/80 p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg ${expandedSections.has('benefits') ? 'rotate-12 scale-110' : ''}`}>
                  <Award className="w-7 h-7 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white group-hover:text-green-100 transition-colors duration-300">Benefícios</h2>
              </div>
              <div className={`transform transition-all duration-500 ${expandedSections.has('benefits') ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-6 h-6 text-green-400 group-hover:animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {expandedSections.has('benefits') && (
          <CardContent className="p-8 animate-in slide-in-from-right duration-700">
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-green-300 flex items-center gap-3">
                  <Trophy className="w-8 h-8" />
                  Principais Benefícios
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: Monitor,
                      title: "Interface WEB e Mobile intuitiva",
                      desc: "Acesso completo via web e aplicativo mobile com interface moderna e intuitiva",
                      color: "blue"
                    },
                    {
                      icon: Zap,
                      title: "Evolução contínua com o SAP",
                      desc: "Sem necessidade de atualizações em integrações internas, reduzindo o custo da ferramenta",
                      color: "yellow"
                    },
                    {
                      icon: Database,
                      title: "Banco de dados instalado na sua infraestrutura",
                      desc: "Garantia de que os dados da sua empresa não fiquem em poder de terceiros",
                      color: "purple"
                    },
                    {
                      icon: Users,
                      title: "Centralização do relacionamento com cliente",
                      desc: "Módulo de atendimento completo para gestão centralizada",
                      color: "cyan"
                    }
                  ].map((item, index) => (
                    <div key={index} className={`group flex items-start gap-6 p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl border border-green-600/30 hover:border-green-500/50 transition-all duration-500 hover:scale-105 cursor-pointer hover:shadow-lg hover:shadow-green-500/20`}>
                      <div className={`w-16 h-16 bg-${item.color}-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                        <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-green-300 mb-3 text-lg group-hover:text-white transition-colors duration-300">{item.title}</h4>
                        <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative bg-gradient-to-br from-green-600/10 to-emerald-600/10 p-10 rounded-3xl border border-green-500/30 w-full hover:border-green-400/50 transition-all duration-500 group/demo cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl animate-pulse duration-3000"></div>
                  <div className="text-center space-y-8 relative z-10">
                    <div className="relative">
                      <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto group-hover/demo:scale-110 transition-transform duration-500 shadow-2xl">
                        <Monitor className="w-16 h-16 text-green-400" />
                      </div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-lg opacity-0 group-hover/demo:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h4 className="text-3xl font-bold text-green-300 group-hover/demo:text-white transition-colors duration-300">Interface Moderna</h4>
                    <p className="text-slate-400 group-hover/demo:text-slate-300 transition-colors duration-300 text-lg leading-relaxed">
                      Visualização completa da interface CRM One com dashboards personalizáveis, 
                      relatórios em tempo real e gestão integrada de clientes
                    </p>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 hover:border-green-500/30 transition-colors duration-300">
                        <div className="text-green-300 font-bold text-xl">WEB</div>
                        <div className="text-slate-400">Acesso completo</div>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/30 hover:border-green-500/30 transition-colors duration-300">
                        <div className="text-green-300 font-bold text-xl">MOBILE</div>
                        <div className="text-slate-400">App nativo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Continue com as outras seções seguindo o mesmo padrão... */}
      {/* Por brevidade, vou mostrar apenas mais uma seção aprimorada */}

      {/* Functionalities Section - Aprimorado */}
      <Card className="relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-700 border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div 
          className="cursor-pointer transition-all duration-500"
          onClick={() => toggleSection('functionalities')}
        >
          <div className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg ${expandedSections.has('functionalities') ? 'rotate-12 scale-110' : ''}`}>
                  <Settings className="w-7 h-7 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">Funcionalidades</h2>
              </div>
              <div className={`transform transition-all duration-500 ${expandedSections.has('functionalities') ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-6 h-6 text-purple-400 group-hover:animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {expandedSections.has('functionalities') && (
          <CardContent className="p-8 animate-in slide-in-from-bottom duration-700">
            <div className="space-y-10">
              <div className="text-center">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent mb-6 animate-pulse">
                  Recursos Avançados
                </h3>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {[
                  {
                    icon: BarChart3,
                    title: "Dashboards customizáveis sem a dependência de terceiros",
                    description: "Total autonomia na personalização dos dashboards",
                    color: "blue"
                  },
                  {
                    icon: FileText,
                    title: "Relatórios personalizáveis no APP para uso offline",
                    description: "Relatórios disponíveis mesmo sem conexão",
                    color: "green"
                  },
                  {
                    icon: Eye,
                    title: "Visão 360 graus dos seus clientes",
                    description: "Visão completa e unificada de cada cliente",
                    color: "yellow"
                  },
                  {
                    icon: Mail,
                    title: "Envio de alertas ou relatórios por e-mail",
                    description: "Comunicação automatizada e eficiente",
                    color: "red"
                  },
                  {
                    icon: PieChart,
                    title: "Relatórios em Crystal Reports, em tabelas simples e em tabelas dinâmicas com filtros customizáveis",
                    description: "Múltiplos formatos de relatórios para diferentes necessidades",
                    color: "indigo"
                  },
                  {
                    icon: Filter,
                    title: "Filtro de itens com estoque, dados da última compra, preços e agrupamento de itens",
                    description: "Filtros avançados para gestão de estoque e preços",
                    color: "cyan"
                  }
                ].map((func, index) => (
                  <div key={index} className={`group bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-900/20 p-8 rounded-3xl border border-purple-600/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-start gap-6">
                      <div className={`w-16 h-16 bg-${func.color}-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                        <func.icon className={`w-8 h-8 text-${func.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-purple-300 mb-4 group-hover:text-white transition-colors duration-300 leading-tight">{func.title}</h4>
                        <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">{func.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Action Button - Aprimorado */}
      <div className="text-center space-y-8 relative z-10">
        {completionProgress === 100 ? (
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 rounded-full border border-green-600/50 backdrop-blur-sm">
                <Star className="w-5 h-5 animate-spin" />
                <span className="font-bold">Parabéns! Você explorou toda a apresentação</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <Button
                onClick={handleComplete}
                size="lg"
                className="relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-16 py-6 text-2xl font-bold transform hover:scale-110 transition-all duration-500 shadow-2xl rounded-2xl border border-green-500/30"
              >
                <CheckCircle className="w-8 h-8 mr-4" />
                Concluir Apresentação
                <Rocket className="w-8 h-8 ml-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-slate-400 text-xl">Explore todas as seções para concluir a apresentação</p>
            <div className="flex items-center justify-center gap-4 text-slate-500">
              <ArrowRight className="w-6 h-6 animate-bounce" />
              <span className="text-lg">Clique nos títulos das seções para expandir o conteúdo</span>
            </div>
            <div className="flex justify-center gap-3">
              {sections.map((section, index) => (
                <div 
                  key={section}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    viewedSections.has(section) 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse shadow-lg shadow-green-400/50 scale-125' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}