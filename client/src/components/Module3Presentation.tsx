
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
              CRM One - A Solução Definitiva para o SAP Business One
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

      {/* Hero Section */}
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
                  <p className="text-slate-400 text-sm mt-1">Transforme seu relacionamento com seus clientes e potencialize suas vendas</p>
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
            <div className="text-center space-y-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                "Transforme seu Relacionamento com seus clientes e potencialize suas vendas."
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold text-blue-300 mb-2">SAP Certified</h4>
                  <p className="text-slate-400 text-sm">Certificado pela SAP</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30">
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-green-300 mb-2">100% Integrado</h4>
                  <p className="text-slate-400 text-sm">Integração nativa com SAP B1</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-purple-300 mb-2">DWU IT Solutions</h4>
                  <p className="text-slate-400 text-sm">Especialistas em SAP</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Definition Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('definition')}
        >
          <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-cyan-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">O que é o CRM One?</h2>
              </div>
              {expandedSections.has('definition') ? 
                <ChevronUp className="w-6 h-6 text-cyan-400" /> : 
                <ChevronDown className="w-6 h-6 text-cyan-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('definition') && (
          <CardContent className="p-8 animate-in slide-in-from-left duration-500">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-cyan-300 mb-6">A Solução Completa para Seu SAP Business One</h3>
                <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 p-8 rounded-2xl border border-cyan-500/30 max-w-4xl mx-auto">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    O CRM One é uma solução <strong className="text-cyan-300">100% integrada ao SAP Business One</strong>, 
                    desenvolvida para aprimorar a gestão comercial, fortalecer o relacionamento com clientes e 
                    otimizar processos de vendas e pós-venda. Tudo isso com dados em tempo real, eliminando a 
                    necessidade de integrações externas e garantindo máxima eficiência para sua operação.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-cyan-300">Principais Características</h4>
                  <div className="space-y-3">
                    {[
                      "Integração nativa com SAP Business One",
                      "Dados em tempo real sem intermediários",
                      "Elimina necessidade de integrações externas",
                      "Máxima eficiência operacional"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-cyan-400" />
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-cyan-300">Benefícios Imediatos</h4>
                  <div className="space-y-3">
                    {[
                      "Aprimoramento da gestão comercial",
                      "Fortalecimento do relacionamento com clientes",
                      "Otimização de processos de vendas",
                      "Melhoria no pós-venda"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <Star className="w-5 h-5 text-cyan-400" />
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Benefits Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-green-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('benefits')}
        >
          <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-green-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Benefícios</h2>
              </div>
              {expandedSections.has('benefits') ? 
                <ChevronUp className="w-6 h-6 text-green-400" /> : 
                <ChevronDown className="w-6 h-6 text-green-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('benefits') && (
          <CardContent className="p-8 animate-in slide-in-from-right duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-green-300">Principais Benefícios</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Monitor,
                      title: "Interface WEB e Mobile intuitiva",
                      desc: "Acesso completo via web e aplicativo mobile com interface moderna e intuitiva"
                    },
                    {
                      icon: Zap,
                      title: "Evolução contínua com o SAP",
                      desc: "Sem necessidade de atualizações em integrações internas, reduzindo o custo da ferramenta"
                    },
                    {
                      icon: Database,
                      title: "Banco de dados instalado na sua infraestrutura",
                      desc: "Garantia de que os dados da sua empresa não fiquem em poder de terceiros"
                    },
                    {
                      icon: Users,
                      title: "Centralização do relacionamento com cliente",
                      desc: "Módulo de atendimento completo para gestão centralizada"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-green-900/20 rounded-lg border border-green-600/30 hover:border-green-500/50 transition-all duration-300 group">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-300 mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 p-8 rounded-xl border border-green-500/30 w-full">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Monitor className="w-12 h-12 text-green-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-green-300">Interface Moderna</h4>
                    <p className="text-slate-400">
                      Visualização completa da interface CRM One com dashboards personalizáveis, 
                      relatórios em tempo real e gestão integrada de clientes
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-green-300 font-semibold">WEB</div>
                        <div className="text-slate-400">Acesso completo</div>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-green-300 font-semibold">MOBILE</div>
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

      {/* Functionalities Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('functionalities')}
        >
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Settings className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Funcionalidades</h2>
              </div>
              {expandedSections.has('functionalities') ? 
                <ChevronUp className="w-6 h-6 text-purple-400" /> : 
                <ChevronDown className="w-6 h-6 text-purple-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('functionalities') && (
          <CardContent className="p-8 animate-in slide-in-from-bottom duration-500">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                  Recursos Avançados
                </h3>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {[
                  {
                    icon: BarChart3,
                    title: "Dashboards customizáveis sem a dependência de terceiros",
                    description: "Total autonomia na personalização dos dashboards"
                  },
                  {
                    icon: FileText,
                    title: "Relatórios personalizáveis no APP para uso offline",
                    description: "Relatórios disponíveis mesmo sem conexão"
                  },
                  {
                    icon: Eye,
                    title: "Visão 360 graus dos seus clientes",
                    description: "Visão completa e unificada de cada cliente"
                  },
                  {
                    icon: Mail,
                    title: "Envio de alertas ou relatórios por e-mail",
                    description: "Comunicação automatizada e eficiente"
                  },
                  {
                    icon: PieChart,
                    title: "Relatórios em Crystal Reports, em tabelas simples e em tabelas dinâmicas com filtros customizáveis",
                    description: "Múltiplos formatos de relatórios para diferentes necessidades"
                  },
                  {
                    icon: Filter,
                    title: "Filtro de itens com estoque, dados da última compra, preços e agrupamento de itens",
                    description: "Filtros avançados para gestão de estoque e preços"
                  },
                  {
                    icon: Search,
                    title: "Possibilidade de personalizar análises em tempo real na tela de cadastros e documentos (itens mais vendidos, últimos pedidos, análise financeira, dados contábeis, produtos em oferta, etc)",
                    description: "Análises personalizadas e em tempo real"
                  },
                  {
                    icon: Layout,
                    title: "Personalização de layouts de impressão",
                    description: "Layouts customizados para documentos"
                  },
                  {
                    icon: WifiOff,
                    title: "APP funciona offline para cadastro de clientes, cotações, pedidos, atendimentos, oportunidades, pipeline, listas de preços, estoque, relatórios entre outros",
                    description: "Funcionalidade completa mesmo offline"
                  }
                ].map((func, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 rounded-xl border border-purple-600/30 hover:border-purple-500/50 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <func.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-purple-300 mb-2">{func.title}</h4>
                        <p className="text-slate-300 text-sm">{func.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Modules Section */}
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
                <h2 className="text-2xl font-bold text-white">Módulos</h2>
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
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Dashboards Personalizáveis */}
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-8 rounded-xl border border-blue-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-300">Dashboards personalizáveis</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Tenha total autonomia na personalização dos DASHBOARDS! 
                    Através de consultas SQL/HANA, você cria os indicadores e 
                    gráficos baseado em informações em tempo real na base de 
                    dados do SAP Business One.
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Além da informação resumida, ao clicar em nos indicadores 
                    ou gráficos, você pode configurar uma segunda consulta 
                    detalhada dos dados e também adicionar um link para 
                    atalhos, como por exemplo acessar o documento em 
                    questão, acessar o cockpit, adicionar um novo pedido, editar 
                    o cadastro do cliente, e muito mais!
                  </p>
                </div>

                {/* Relacionamento */}
                <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 p-8 rounded-xl border border-purple-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-300">Relacionamento</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Atendimentos no formato Agenda e Kanban. 
                    Gerencie suas tarefas e gere um histórico de relacionamento 
                    com os clientes através do módulo de atendimento.
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Você pode criar e visualizar suas tarefas e fazer seu follow-up 
                    no formato de agenda ou no formato Kanban. Além disso, as 
                    tarefas poderão estar vinculadas aos documentos, 
                    facilitando o entendimento do que foi tratado com o cliente e 
                    tornando seu trabalho mais rápido, mais assertivo e menos 
                    trabalhoso.
                  </p>
                </div>

                {/* Vendas */}
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 p-8 rounded-xl border border-green-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-300">Vendas</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Faça suas cotações e pedidos com muito mais agilidade! 
                    O CRM One permite que você consulte e cadastre os preços 
                    em tempo real com o SAP Business One, garantindo a 
                    qualidade na informação repassada ao cliente.
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Você também pode importar pedidos grandes através de 
                    planilha do Excel. Isso facilitará demais sua rotina diária e te 
                    dará mais tempo para trabalhar em novas vendas.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    No momento da geração de pedidos, você pode também 
                    criar análises críticas como por exemplo "Produtos que o 
                    cliente ainda não comprou" e consultá-las em tempo real 
                    através da aba "Análises".
                  </p>
                </div>

                {/* Oportunidades */}
                <div className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 p-8 rounded-xl border border-orange-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                      <Handshake className="w-8 h-8 text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-orange-300">Oportunidades</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Crie, edite e gerencie suas oportunidades de vendas online 
                    de qualquer lugar!
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Com o pipeline inovador do CRM One, é possível filtrar e 
                    visualizar suas oportunidades de vendas por etapa em um 
                    formato visual muito atrativo e prático.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    É ideal para uma visão macro e para realização de reuniões 
                    rápidas de acompanhamento com o time de vendas.
                  </p>
                </div>

                {/* Cockpit */}
                <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 p-8 rounded-xl border border-cyan-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                      <Monitor className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-cyan-300">Cockpit</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Obtenha uma visão 360° de um cliente e visualize os fatores 
                    críticos, comportamento, histórico de vendas com top 10 
                    produtos, análise financeira com pontualidade dos 
                    pagamentos e lista de títulos em aberto/vencidos.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Você pode também criar diversas análises personalizadas de 
                    acordo com a necessidade da sua empresa. 
                    Extraia o máximo de informações importantes que o sistema 
                    oferece e potencialize o relacionamento com o seu cliente.
                  </p>
                </div>

                {/* Relatórios Customizáveis */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/20 p-8 rounded-xl border border-indigo-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-300">Relatórios Customizáveis</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Crie seus próprios relatórios sem a dependência de terceiros. 
                    Todas as consultas podem conter filtros e são desenvolvidas 
                    na linguagem do seu banco de dados (HANA ou SQL).
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Os relatórios podem exibir informação por usuário ou equipe. 
                    A visualização pode ser em uma tabela simples com filtros 
                    em todas as colunas, tabelas dinâmicas ou no formato visual 
                    para impressão do Crystal Reports.
                  </p>
                </div>

                {/* App Offline */}
                <div className="bg-gradient-to-br from-teal-900/20 to-teal-800/20 p-8 rounded-xl border border-teal-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center">
                      <WifiOff className="w-8 h-8 text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-teal-300">App Offline</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    O aplicativo mobile do CRM One está disponível para 
                    trabalhar ONLINE e OFFLINE.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Se o seu time precisa fazer uma venda e está sem conexão 
                    com a internet, ele poderá fazer novos cadastros, pedidos, 
                    consultar produtos, preços, executar relatórios e muito mais. 
                    A aplicativo tem uma interface intuitiva e moderna para 
                    facilitar o uso de todos.
                  </p>
                </div>

                {/* Chamados de serviço */}
                <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 p-8 rounded-xl border border-red-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-300">Chamados de serviço</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Gerencie seus chamados de serviços de forma 
                    integrada e eficiente.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Você pode realizar follow ups e registrar todas as 
                    interações com o cliente. 
                    Utilize a base de conhecimento para solucionar 
                    problemas de forma mais rápida e eficiente.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Why Choose Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('why-choose')}
        >
          <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Trophy className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Por que Escolher o CRM One?</h2>
              </div>
              {expandedSections.has('why-choose') ? 
                <ChevronUp className="w-6 h-6 text-indigo-400" /> : 
                <ChevronDown className="w-6 h-6 text-indigo-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('why-choose') && (
          <CardContent className="p-8 animate-in slide-in-from-left duration-500">
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Padrões do SAP Business One */}
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-8 rounded-xl border border-blue-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                      <Award className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-300">Padrões do SAP Business One</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Segue as regras de negócio, transações, procedimentos de autorização padrões do SAP Business One.",
                      "Exibição de impostos em tempo real e de acordo com todas as parametrizações já existentes no SAP Business One.",
                      "Centralização de todo o relacionamento com o cliente no módulo de atendimento.",
                      "Ferramenta desenvolvida e exclusiva para o SAP Business One.",
                      "Utiliza banco de dados e tabelas padrões do ERP SAP B1.",
                      "Todos os dados em tempo real com o SAP.",
                      "Preparado para base de dados HANA e SQL"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <span className="text-slate-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Redução de Custos */}
                <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 p-8 rounded-xl border border-green-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-300">Redução de Custos</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      "Dispensa licenciamento profissional e não impõe limites do CRM One.",
                      "Tudo funciona de forma nativa, sem depender de integrações externas."
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <span className="text-slate-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificado e 100% Integrado */}
                <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 p-8 rounded-xl border border-purple-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                      <Shield className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-300">Certificado e 100% Integrado com SAP Business One</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    O CRM One é certificado pela SAP e foi desenvolvido 
                    especialmente para o SAP Business One. 
                    Isso garante qualidade e segurança para a sua empresa.
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Ele segue as regras de negócio já definidas no seu SAP 
                    Business One, como por exemplo:
                  </p>
                  <div className="space-y-2">
                    {[
                      "Transações",
                      "Procedimentos de autorização",
                      "Validações padrões SAP",
                      "Permissões de acesso",
                      "Entre outras."
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informações em Tempo Real */}
                <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 p-8 rounded-xl border border-cyan-600/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                      <Clock className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-cyan-300">Informações em Tempo Real</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-300 mb-2">Consulta de Estoque</h4>
                      <p className="text-slate-300 text-sm">
                        A aplicação é totalmente instalada no seu ambiente, seja 
                        local ou na nuvem.
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm">
                        O acesso às informações é direto, sem bases de dados 
                        intermediárias.
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm">
                        Isso garante à sua equipe uma informação real e de 
                        qualidade.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Comparison Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('comparison')}
        >
          <div className="bg-gradient-to-r from-yellow-900 via-orange-900 to-yellow-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Tabela Comparativa - CRM One X Concorrentes</h2>
              </div>
              {expandedSections.has('comparison') ? 
                <ChevronUp className="w-6 h-6 text-yellow-400" /> : 
                <ChevronDown className="w-6 h-6 text-yellow-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('comparison') && (
          <CardContent className="p-8 animate-in slide-in-from-bottom duration-500">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-yellow-300 mb-4">Veja como o CRM One se destaca</h3>
                <p className="text-slate-300 text-lg">Comparação detalhada com principais concorrentes do mercado</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-slate-800/50 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-700/50">
                      <th className="text-left p-4 text-slate-300 font-semibold">Critério / Plataforma</th>
                      <th className="text-center p-4 text-blue-300 font-bold">CRM ONE</th>
                      <th className="text-center p-4 text-slate-400">Concorrentes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600/30">
                    {[
                      {
                        criteria: "Integração Nativa com SAP B1",
                        crmOne: "Integração certificada e em tempo real com SAP Business One",
                        competitors: "Integração por conectores externos ou APIs",
                        crmOneStatus: true
                      },
                      {
                        criteria: "App Mobile Offline",
                        crmOne: "Sim, funciona com ou sem internet (Android)",
                        competitors: "App mobile disponível, mas nem sempre com suporte offline completo",
                        crmOneStatus: true
                      },
                      {
                        criteria: "Infraestrutura de Dados",
                        crmOne: "Cloud ou local — cliente escolhe",
                        competitors: "Cloud obrigatória (dados sob terceiros)",
                        crmOneStatus: true
                      },
                      {
                        criteria: "Atualizações e Manutenção",
                        crmOne: "Evolui junto ao SAP sem retrabalho",
                        competitors: "Demandam ajustes com atualizações e versões",
                        crmOneStatus: true
                      },
                      {
                        criteria: "Suporte Direto com Especialista",
                        crmOne: "Atendimento direto com analista que entende o processo do cliente",
                        competitors: "Suporte via chatbot, chamadas genéricas ou equipes sem especialização",
                        crmOneStatus: true
                      },
                      {
                        criteria: "Dashboards Customizáveis",
                        crmOne: "SQL/HANA, Crystal Reports e tabelas dinâmicas sem dev",
                        competitors: "Requer plano premium ou suporte externo",
                        crmOneStatus: true
                      },
                      {
                        criteria: "Cobrança e SAC Integrados",
                        crmOne: "Gestão completa dentro do CRM",
                        competitors: "Necessita ferramentas externas ou integrações",
                        crmOneStatus: true
                      },
                      {
                        criteria: "Visão 360° desde o primeiro dia",
                        crmOne: "Cockpit unificado com todas as áreas",
                        competitors: "Requer configuração e tempo de setup",
                        crmOneStatus: true
                      },
                      {
                        criteria: "Custo-benefício",
                        crmOne: "Preço acessível e sem módulos separados",
                        competitors: "Alto custo por usuário/módulo + upgrades pagos",
                        crmOneStatus: true
                      },
                      {
                        criteria: "Reputação e suporte Humanizado",
                        crmOne: "Sem reclamações no Reclame Aqui, atendimento próximo, humanizado e sem automações robóticas",
                        competitors: "Alta incidência de reclamações públicas e atendimento automatizado ou burocrático",
                        crmOneStatus: true
                      }
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-slate-700/30 transition-colors duration-200">
                        <td className="p-4 text-slate-300 font-medium">{row.criteria}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-slate-300 text-sm">{row.crmOne}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <X className="w-5 h-5 text-red-400" />
                            <span className="text-slate-400 text-sm">{row.competitors}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-6 rounded-xl border border-yellow-600/30">
                <h4 className="text-xl font-bold text-yellow-300 mb-3">Diferenciais Únicos do CRM One</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Certificação SAP oficial",
                    "Suporte técnico especializado nacional",
                    "Sem dependência de integrações externas",
                    "Dados sempre na sua infraestrutura",
                    "Custo-benefício imbatível",
                    "Atendimento humanizado sem automações"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-slate-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Conclusion Section */}
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
                <h2 className="text-2xl font-bold text-white">Comece Agora!</h2>
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
                  Comece Agora!
                </h3>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Otimize sua operação comercial e alcance novos patamares de performance!
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
                <div className="flex justify-center items-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Monitor className="w-8 h-8 text-blue-400" />
                    </div>
                    <span className="text-slate-300 font-semibold">DWU IT Solutions</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Database className="w-8 h-8 text-blue-400" />
                    </div>
                    <span className="text-slate-300 font-semibold">SAP Business One</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Award className="w-8 h-8 text-green-400" />
                    </div>
                    <span className="text-slate-300 font-semibold">SAP Certified</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-700/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Database className="w-8 h-8 text-blue-400" />
                    </div>
                    <span className="text-slate-300 font-semibold">SAP Integration</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Demonstração
                  </Button>
                  <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-600/10 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                    <Download className="w-5 h-5 mr-2" />
                    Solicitar Orçamento
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Action Button */}
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
