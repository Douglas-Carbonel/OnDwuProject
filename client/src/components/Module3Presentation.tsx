
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
  Trophy
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
    'hero', 'interface', 'mobile', 'dashboards', 'security', 'support', 'modules', 'conclusion'
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    const newViewed = new Set(viewedSections);
    
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
      newViewed.add(sectionId);
      
      // Animate counters when section is opened
      if (sectionId === 'hero') {
        animateCounter('clients', 500);
        animateCounter('years', 9);
        animateCounter('satisfaction', 98);
      }
    }
    
    setExpandedSections(newExpanded);
    setViewedSections(newViewed);
  };

  const animateCounter = (key: string, target: number) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
    }, 30);
  };

  useEffect(() => {
    const progress = (viewedSections.size / sections.length) * 100;
    setCompletionProgress(progress);
  }, [viewedSections, sections.length]);

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header with Progress */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full border border-blue-500/50 backdrop-blur-sm">
            <Rocket className="w-8 h-8 text-blue-400 animate-bounce" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              CRM One - Solução Definitiva
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-slate-400 text-lg">Explore todas as seções para conhecer nossa solução completa</p>
          <div className="max-w-md mx-auto space-y-2">
            <Progress 
              value={completionProgress} 
              className="h-4 bg-slate-800 border border-slate-700"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{Math.round(completionProgress)}% concluído</span>
              <span className="text-slate-500">{viewedSections.size}/{sections.length} seções</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Enhanced */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('hero')}
        >
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Monitor className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">CRM One</h2>
                  <p className="text-blue-200 text-lg">A Solução Definitiva para o SAP Business One</p>
                  <p className="text-slate-400 text-sm mt-1">100% Integrado • Tempo Real • Seguro</p>
                </div>
              </div>
              <div className="text-center">
                {expandedSections.has('hero') ? 
                  <ChevronUp className="w-8 h-8 text-blue-400 animate-bounce" /> : 
                  <ChevronDown className="w-8 h-8 text-blue-400 animate-pulse" />
                }
              </div>
            </div>
          </div>
        </div>
        
        {expandedSections.has('hero') && (
          <CardContent className="p-8 space-y-8 animate-in slide-in-from-top duration-500">
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30">
                <div className="text-3xl font-bold text-blue-300 mb-2">
                  {animatedCounters.clients || 0}+
                </div>
                <p className="text-slate-400">Clientes Ativos</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30">
                <div className="text-3xl font-bold text-green-300 mb-2">
                  {animatedCounters.years || 0}
                </div>
                <p className="text-slate-400">Anos de Experiência</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                <div className="text-3xl font-bold text-purple-300 mb-2">
                  {animatedCounters.satisfaction || 0}%
                </div>
                <p className="text-slate-400">Satisfação</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  O que é o CRM One?
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  O CRM One é uma solução 100% integrada ao SAP Business One, desenvolvida para 
                  aprimorar a gestão comercial, fortalecer o relacionamento com clientes e 
                  otimizar processos de vendas e pós-venda com tecnologia de ponta.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Globe, text: "100% Integrado", color: "blue" },
                    { icon: Zap, text: "Tempo Real", color: "green" },
                    { icon: Shield, text: "Dados Seguros", color: "purple" },
                    { icon: Cloud, text: "Multi-plataforma", color: "orange" }
                  ].map((badge, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className={`bg-${badge.color}-600/20 text-${badge.color}-300 border-${badge.color}-600/50 p-3 hover:scale-105 transition-transform duration-300`}
                    >
                      <badge.icon className="w-4 h-4 mr-2" />
                      {badge.text}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-8 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
                  <div className="text-center space-y-6">
                    <div className="relative mx-auto w-24 h-24">
                      <Target className="w-24 h-24 text-blue-400 animate-spin-slow" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-red-400 animate-pulse" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-blue-300">Transforme seu relacionamento</h4>
                    <p className="text-slate-400">Potencialize suas vendas com dados em tempo real e inteligência artificial</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Interface Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('interface')}
        >
          <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-cyan-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Palette className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Interface Intuitiva e Responsiva</h2>
              </div>
              {expandedSections.has('interface') ? 
                <ChevronUp className="w-6 h-6 text-cyan-400" /> : 
                <ChevronDown className="w-6 h-6 text-cyan-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('interface') && (
          <CardContent className="p-8 animate-in slide-in-from-left duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-cyan-300">Design Moderno e Funcional</h3>
                <div className="space-y-4">
                  {[
                    { icon: Eye, title: "Interface Visual Atrativa", desc: "Design moderno com foco na experiência do usuário" },
                    { icon: MousePointer, title: "Navegação Intuitiva", desc: "Fluxos otimizados para máxima produtividade" },
                    { icon: Layers, title: "Organização Inteligente", desc: "Informações estruturadas de forma lógica" },
                    { icon: Maximize, title: "Totalmente Responsivo", desc: "Funciona perfeitamente em qualquer dispositivo" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all duration-300 group">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-200 mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 p-6 rounded-xl border border-cyan-500/30">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-4">Características da Interface</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      "Dashboard customizável",
                      "Filtros avançados",
                      "Busca inteligente",
                      "Temas personalizáveis",
                      "Atalhos de teclado",
                      "Modo escuro/claro",
                      "Multi-idioma",
                      "Acessibilidade"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Mobile Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-green-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('mobile')}
        >
          <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-green-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Smartphone className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Aplicativo Mobile Nativo</h2>
              </div>
              {expandedSections.has('mobile') ? 
                <ChevronUp className="w-6 h-6 text-green-400" /> : 
                <ChevronDown className="w-6 h-6 text-green-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('mobile') && (
          <CardContent className="p-8 animate-in slide-in-from-right duration-500">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold text-green-300">Trabalhe de Qualquer Lugar</h3>
                <p className="text-slate-300 text-lg">
                  Aplicativo mobile completo com funcionalidades offline, sincronização automática e interface otimizada para dispositivos móveis.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Download, title: "Modo Offline", desc: "Trabalhe sem conexão com sincronização automática" },
                    { icon: RefreshCw, title: "Sync em Tempo Real", desc: "Dados sempre atualizados em todos os dispositivos" },
                    { icon: Bell, title: "Notificações Push", desc: "Alertas importantes direto no seu celular" },
                    { icon: Lock, title: "Segurança Móvel", desc: "Biometria e criptografia de ponta" }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-green-900/20 rounded-lg border border-green-600/30 hover:border-green-500/50 transition-all duration-300 group">
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                        <h4 className="font-semibold text-green-300">{item.title}</h4>
                      </div>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 p-6 rounded-xl border border-green-500/30">
                <h4 className="text-lg font-semibold text-green-300 mb-4 text-center">Disponível para</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <Smartphone className="w-6 h-6 text-green-400" />
                    <span className="text-slate-300">iOS - App Store</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <Smartphone className="w-6 h-6 text-green-400" />
                    <span className="text-slate-300">Android - Play Store</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <Globe className="w-6 h-6 text-green-400" />
                    <span className="text-slate-300">Web App</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Dashboards Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('dashboards')}
        >
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Dashboards Inteligentes</h2>
              </div>
              {expandedSections.has('dashboards') ? 
                <ChevronUp className="w-6 h-6 text-purple-400" /> : 
                <ChevronDown className="w-6 h-6 text-purple-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('dashboards') && (
          <CardContent className="p-8 animate-in slide-in-from-bottom duration-500">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Visualização de Dados Avançada
                </h3>
                <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                  Dashboards totalmente customizáveis com gráficos interativos, KPIs em tempo real e relatórios automatizados.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: LineChart,
                    title: "Gráficos Dinâmicos",
                    description: "Visualizações interativas que se adaptam aos seus dados",
                    features: ["Drill-down", "Filtros em tempo real", "Múltiplas séries", "Exportação"]
                  },
                  {
                    icon: PieChart,
                    title: "KPIs Personalizados",
                    description: "Indicadores de performance sob medida para seu negócio",
                    features: ["Metas configuráveis", "Alertas automáticos", "Comparativos", "Tendências"]
                  },
                  {
                    icon: FileText,
                    title: "Relatórios Automáticos",
                    description: "Geração e envio automatizado de relatórios",
                    features: ["Agendamento", "Múltiplos formatos", "Distribuição", "Templates"]
                  }
                ].map((dashboard, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-xl border border-purple-600/30 hover:border-purple-500/50 transition-all duration-300 group">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <dashboard.icon className="w-6 h-6 text-purple-400" />
                        </div>
                        <h4 className="text-xl font-bold text-purple-300">{dashboard.title}</h4>
                      </div>
                      <p className="text-slate-300">{dashboard.description}</p>
                      <div className="space-y-2">
                        {dashboard.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2 text-sm text-slate-400">
                            <CheckCircle className="w-4 h-4 text-purple-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Security Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-red-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('security')}
        >
          <div className="bg-gradient-to-r from-red-900 via-pink-900 to-red-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Segurança e Conformidade</h2>
              </div>
              {expandedSections.has('security') ? 
                <ChevronUp className="w-6 h-6 text-red-400" /> : 
                <ChevronDown className="w-6 h-6 text-red-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('security') && (
          <CardContent className="p-8 animate-in slide-in-from-top duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-red-300">Proteção de Dados Avançada</h3>
                <p className="text-slate-300">
                  Implementamos os mais altos padrões de segurança para proteger seus dados e garantir conformidade com regulamentações.
                </p>
                <div className="grid gap-4">
                  {[
                    { icon: Lock, title: "Criptografia End-to-End", desc: "Dados protegidos em trânsito e em repouso" },
                    { icon: Server, title: "Infraestrutura Segura", desc: "Servidores em data centers certificados" },
                    { icon: Eye, title: "Auditoria Completa", desc: "Log detalhado de todas as ações" },
                    { icon: Users, title: "Controle de Acesso", desc: "Permissões granulares por usuário" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-red-900/20 rounded-lg border border-red-600/30">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-300 mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-red-600/10 to-pink-600/10 p-6 rounded-xl border border-red-500/30">
                  <h4 className="text-lg font-semibold text-red-300 mb-4">Certificações e Conformidade</h4>
                  <div className="space-y-3">
                    {[
                      "LGPD - Lei Geral de Proteção de Dados",
                      "ISO 27001 - Gestão de Segurança",
                      "GDPR - Regulamento Geral de Proteção",
                      "SOC 2 Type II - Controles de Segurança",
                      "Backup Automático 24/7",
                      "Disaster Recovery Plan"
                    ].map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-red-400" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Support Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('support')}
        >
          <div className="bg-gradient-to-r from-yellow-900 via-orange-900 to-yellow-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Suporte Especializado</h2>
              </div>
              {expandedSections.has('support') ? 
                <ChevronUp className="w-6 h-6 text-yellow-400" /> : 
                <ChevronDown className="w-6 h-6 text-yellow-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('support') && (
          <CardContent className="p-8 animate-in slide-in-from-left duration-500">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold text-yellow-300">Atendimento que Faz a Diferença</h3>
                <p className="text-slate-300 text-lg">
                  Nossa equipe de especialistas está sempre pronta para ajudar você a aproveitar ao máximo o CRM One.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Clock, title: "Suporte 24/7", desc: "Atendimento disponível todos os dias", time: "24h" },
                    { icon: Phone, title: "Múltiplos Canais", desc: "Telefone, chat, email e WhatsApp", time: "4 canais" },
                    { icon: Users, title: "Especialistas SAP", desc: "Equipe certificada e experiente", time: "9 anos" },
                    { icon: Rocket, title: "Resposta Rápida", desc: "SLA garantido para todos os tickets", time: "< 2h" }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/30 hover:border-yellow-500/50 transition-all duration-300 group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <item.icon className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-yellow-300">{item.title}</h4>
                            <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">{item.time}</span>
                          </div>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 p-6 rounded-xl border border-yellow-500/30">
                  <h4 className="text-lg font-semibold text-yellow-300 mb-4">Canais de Atendimento</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Phone, text: "(51) 3023-8393", desc: "Telefone" },
                      { icon: Mail, text: "suporte@dwu.com.br", desc: "Email" },
                      { icon: MessageSquare, text: "Chat Online", desc: "Website" },
                      { icon: Globe, text: "Portal do Cliente", desc: "Self-service" }
                    ].map((contact, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg">
                        <contact.icon className="w-4 h-4 text-yellow-400" />
                        <div>
                          <div className="text-sm font-medium text-slate-300">{contact.text}</div>
                          <div className="text-xs text-slate-500">{contact.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Enhanced Modules Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('modules')}
        >
          <div className="bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Layers className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Módulos Completos do Sistema</h2>
              </div>
              {expandedSections.has('modules') ? 
                <ChevronUp className="w-6 h-6 text-orange-400" /> : 
                <ChevronDown className="w-6 h-6 text-orange-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('modules') && (
          <CardContent className="p-8 animate-in slide-in-from-right duration-500">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent mb-4">
                  Funcionalidades Completas
                </h3>
                <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                  Cada módulo foi desenvolvido para atender necessidades específicas do seu negócio.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {[
                  {
                    icon: BarChart3,
                    title: "Dashboards Personalizáveis",
                    description: "Total autonomia na personalização dos dashboards! Através de consultas SQL/HANA, crie indicadores e gráficos baseados em informações em tempo real na base de dados do SAP Business One.",
                    features: ["Consultas SQL/HANA", "Gráficos em tempo real", "Indicadores customizados", "Widgets arrastar e soltar"],
                    color: "blue"
                  },
                  {
                    icon: DollarSign,
                    title: "Vendas",
                    description: "Geração de cotações e pedidos com agilidade em tempo real com o SAP Business One, garantindo qualidade na informação repassada ao cliente.",
                    features: ["Cotações rápidas", "Pedidos automáticos", "Histórico completo", "Integração nativa SAP"],
                    color: "green"
                  },
                  {
                    icon: Users,
                    title: "Relacionamento",
                    description: "Atendimentos em formato Agenda e Kanban. Gerencie tarefas e crie histórico de relacionamento com clientes através do módulo de atendimento.",
                    features: ["Agenda integrada", "Kanban visual", "Histórico completo", "Gestão de tarefas"],
                    color: "purple"
                  },
                  {
                    icon: Handshake,
                    title: "Oportunidades",
                    description: "Crie, edite e gerencie oportunidades de vendas online de qualquer lugar! Pipeline inovador para filtrar e visualizar oportunidades por etapa.",
                    features: ["Pipeline visual", "Gestão de etapas", "Filtros avançados", "Previsão de vendas"],
                    color: "orange"
                  }
                ].map((module, index) => (
                  <div key={index} className={`group p-6 bg-gradient-to-br from-${module.color}-900/20 to-${module.color}-800/20 rounded-xl border border-${module.color}-600/30 hover:border-${module.color}-500/50 transition-all duration-300 hover:scale-105`}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-${module.color}-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <module.icon className={`w-8 h-8 text-${module.color}-400`} />
                        </div>
                        <h4 className="text-2xl font-bold text-slate-200 group-hover:text-white transition-colors duration-300">
                          {module.title}
                        </h4>
                      </div>
                      <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                        {module.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {module.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`w-4 h-4 text-${module.color}-400`} />
                            <span className="text-slate-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      

      {/* Enhanced Conclusion Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-green-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('conclusion')}
        >
          <div className="bg-gradient-to-r from-slate-900 via-green-900 to-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Rocket className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Comece Sua Transformação Agora!</h2>
              </div>
              {expandedSections.has('conclusion') ? 
                <ChevronUp className="w-6 h-6 text-green-400" /> : 
                <ChevronDown className="w-6 h-6 text-green-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('conclusion') && (
          <CardContent className="p-8 animate-in slide-in-from-top duration-500">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                  Pronto para Revolucionar seu CRM?
                </h3>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Otimize sua operação comercial e alcance novos patamares de performance com a solução mais completa do mercado!
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {[
                  { icon: Globe, text: "@dwuitsolutions", label: "Instagram", color: "text-pink-400" },
                  { icon: Monitor, text: "www.dwu.com.br", label: "Website", color: "text-blue-400" },
                  { icon: Mail, text: "comercial@dwu.com.br", label: "Email", color: "text-green-400" },
                  { icon: Phone, text: "(51) 30238393", label: "Telefone", color: "text-purple-400" }
                ].map((contact, index) => (
                  <div key={index} className="group flex flex-col items-center p-6 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                    <div className={`w-12 h-12 ${contact.color.replace('text', 'bg')}/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <contact.icon className={`w-6 h-6 ${contact.color}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300">{contact.text}</span>
                    <span className="text-xs text-slate-500 mt-1">{contact.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 p-8 rounded-2xl border border-green-600/30">
                <h4 className="text-2xl font-bold text-green-300 mb-4">Solicite uma Demonstração Gratuita</h4>
                <p className="text-slate-400 mb-6">Veja como o CRM One pode transformar seus resultados em apenas 30 minutos</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Demo
                  </Button>
                  <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-600/10 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                    <Download className="w-5 h-5 mr-2" />
                    Download Brochure
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Enhanced Action Button */}
      <div className="text-center space-y-6">
        {completionProgress === 100 ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-full border border-green-600/50 animate-pulse">
              <Star className="w-4 h-4" />
              Parabéns! Você explorou toda a apresentação
            </div>
            <Button
              onClick={handleComplete}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 text-xl font-bold transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              <CheckCircle className="w-6 h-6 mr-3" />
              Concluir Apresentação
              <Rocket className="w-6 h-6 ml-3" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-400 text-lg">Explore todas as seções para concluir a apresentação</p>
            <div className="flex items-center justify-center gap-3 text-slate-500">
              <ArrowRight className="w-5 h-5 animate-bounce" />
              <span>Clique nos títulos das seções para expandir o conteúdo</span>
            </div>
            <div className="flex justify-center gap-2">
              {sections.map((section, index) => (
                <div 
                  key={section}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    viewedSections.has(section) 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-slate-600'
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
