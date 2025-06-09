
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
  Rocket
} from "lucide-react";

interface Module3PresentationProps {
  onComplete: () => void;
}

export default function Module3Presentation({ onComplete }: Module3PresentationProps) {
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['hero']));
  const [completionProgress, setCompletionProgress] = useState(0);

  const sections = [
    'hero', 'benefits', 'features', 'modules', 'comparison', 'conclusion'
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
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30">
          <Rocket className="w-6 h-6 text-blue-400" />
          <span className="text-xl font-semibold text-blue-300">CRM One - Solução Definitiva</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-slate-400">Explore todas as seções para conhecer nossa solução</p>
          <Progress value={completionProgress} className="h-3 max-w-md mx-auto" />
          <span className="text-sm text-slate-500">{Math.round(completionProgress)}% concluído</span>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('hero')}
        >
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">CRM One</h2>
                  <p className="text-blue-200">A Solução Definitiva para o SAP Business One</p>
                </div>
              </div>
              {expandedSections.has('hero') ? 
                <ChevronUp className="w-6 h-6 text-blue-400" /> : 
                <ChevronDown className="w-6 h-6 text-blue-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('hero') && (
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-200">O que é o CRM One?</h3>
                <p className="text-slate-300 leading-relaxed">
                  O CRM One é uma solução 100% integrada ao SAP Business One, desenvolvida para 
                  aprimorar a gestão comercial, fortalecer o relacionamento com clientes e 
                  otimizar processos de vendas e pós-venda.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/50">
                    <Globe className="w-4 h-4 mr-1" />
                    100% Integrado
                  </Badge>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/50">
                    <Zap className="w-4 h-4 mr-1" />
                    Tempo Real
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/50">
                    <Shield className="w-4 h-4 mr-1" />
                    Dados Seguros
                  </Badge>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-6 rounded-xl border border-blue-500/20">
                <div className="text-center space-y-4">
                  <Target className="w-16 h-16 text-blue-400 mx-auto" />
                  <h4 className="text-xl font-semibold text-blue-300">Transforme seu relacionamento</h4>
                  <p className="text-slate-400">Potencialize suas vendas com dados em tempo real</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Benefits Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('benefits')}
        >
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Principais Benefícios</h2>
              </div>
              {expandedSections.has('benefits') ? 
                <ChevronUp className="w-6 h-6 text-purple-400" /> : 
                <ChevronDown className="w-6 h-6 text-purple-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('benefits') && (
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Monitor,
                  title: "Interface WEB e Mobile Intuitiva",
                  description: "Acesso completo em qualquer dispositivo",
                  color: "text-blue-400"
                },
                {
                  icon: Database,
                  title: "Banco de Dados Próprio",
                  description: "Dados seguros na sua infraestrutura",
                  color: "text-green-400"
                },
                {
                  icon: Zap,
                  title: "Evolução Contínua com o SAP",
                  description: "Sem necessidade de atualizações em integrações internas",
                  color: "text-yellow-400"
                },
                {
                  icon: Users,
                  title: "Centralização do Relacionamento",
                  description: "Todo relacionamento com cliente em um módulo",
                  color: "text-purple-400"
                }
              ].map((benefit, index) => (
                <div key={index} className="group p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${benefit.color.replace('text', 'bg')}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Features Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('features')}
        >
          <div className="bg-gradient-to-r from-green-900 via-teal-900 to-green-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Funcionalidades Avançadas</h2>
              </div>
              {expandedSections.has('features') ? 
                <ChevronUp className="w-6 h-6 text-green-400" /> : 
                <ChevronDown className="w-6 h-6 text-green-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('features') && (
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: BarChart3, text: "Dashboards customizáveis sem dependência de terceiros", color: "text-blue-400" },
                { icon: Globe, text: "Visão 360 graus dos seus clientes", color: "text-green-400" },
                { icon: BarChart3, text: "Relatórios em Crystal Reports e tabelas dinâmicas", color: "text-purple-400" },
                { icon: Settings, text: "Análises personalizadas em tempo real", color: "text-orange-400" },
                { icon: Monitor, text: "Relatórios personalizáveis no APP para uso offline", color: "text-cyan-400" },
                { icon: Globe, text: "Envio de alertas ou relatórios por e-mail", color: "text-pink-400" }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all duration-300">
                  <feature.icon className={`w-5 h-5 ${feature.color} mt-1 flex-shrink-0`} />
                  <span className="text-sm text-slate-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Modules Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('modules')}
        >
          <div className="bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Módulos do Sistema</h2>
              </div>
              {expandedSections.has('modules') ? 
                <ChevronUp className="w-6 h-6 text-orange-400" /> : 
                <ChevronDown className="w-6 h-6 text-orange-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('modules') && (
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: BarChart3,
                  title: "Dashboards Personalizáveis",
                  description: "Total autonomia na personalização dos dashboards! Através de consultas SQL/HANA, crie indicadores e gráficos baseados em informações em tempo real na base de dados do SAP Business One.",
                  color: "blue"
                },
                {
                  icon: DollarSign,
                  title: "Vendas",
                  description: "Geração de cotações e pedidos com agilidade em tempo real com o SAP Business One, garantindo qualidade na informação repassada ao cliente.",
                  color: "green"
                },
                {
                  icon: Users,
                  title: "Relacionamento",
                  description: "Atendimentos em formato Agenda e Kanban. Gerencie tarefas e crie histórico de relacionamento com clientes através do módulo de atendimento.",
                  color: "purple"
                },
                {
                  icon: Handshake,
                  title: "Oportunidades",
                  description: "Crie, edite e gerencie oportunidades de vendas online de qualquer lugar! Pipeline inovador para filtrar e visualizar oportunidades por etapa.",
                  color: "orange"
                }
              ].map((module, index) => (
                <div key={index} className={`group p-6 bg-gradient-to-br from-${module.color}-900/20 to-${module.color}-800/20 rounded-xl border border-${module.color}-600/30 hover:border-${module.color}-500/50 transition-all duration-300`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-${module.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <module.icon className={`w-6 h-6 text-${module.color}-400`} />
                      </div>
                      <h4 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors duration-300">
                        {module.title}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                      {module.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Comparison Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('comparison')}
        >
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Por que Escolher o CRM One?</h2>
              </div>
              {expandedSections.has('comparison') ? 
                <ChevronUp className="w-6 h-6 text-indigo-400" /> : 
                <ChevronDown className="w-6 h-6 text-indigo-400" />
              }
            </div>
          </div>
        </div>
        
        {expandedSections.has('comparison') && (
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-600/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8 text-blue-400" />
                    <h4 className="text-xl font-bold text-blue-300">Padrões do SAP Business One</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Segue as regras de negócio, transações e procedimentos de autorização padrões
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Exibição de impostos em tempo real de acordo com parametrizações existentes
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Ferramenta desenvolvida exclusivamente para o SAP Business One
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-600/30">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    <h4 className="text-xl font-bold text-green-300">Redução de Custos</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Dispensa licenciamento profissional e não impõe limites
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Tudo funciona de forma nativa, sem integrações externas
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
              <h4 className="text-lg font-semibold text-slate-200 mb-6 text-center">Comparativo com Concorrentes</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 font-semibold text-slate-300">Critério</th>
                      <th className="text-center p-4 font-semibold text-blue-400">CRM ONE</th>
                      <th className="text-center p-4 font-semibold text-slate-400">Concorrentes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Integração Nativa com SAP B1",
                      "App Mobile Offline",
                      "Evolui junto ao SAP sem retrabalho",
                      "Suporte Direto com Especialista",
                      "Custo-benefício"
                    ].map((criteria, index) => (
                      <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors duration-300">
                        <td className="p-4 text-slate-300">{criteria}</td>
                        <td className="text-center p-4">
                          <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                        </td>
                        <td className="text-center p-4">
                          {criteria === "App Mobile Offline" ? 
                            <CheckCircle className="w-5 h-5 text-green-400 mx-auto" /> :
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Conclusion Section */}
      <Card className="glass-effect border-slate-700/50 overflow-hidden">
        <div 
          className="cursor-pointer transition-all duration-300"
          onClick={() => toggleSection('conclusion')}
        >
          <div className="bg-gradient-to-r from-slate-900 via-green-900 to-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-400" />
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
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Otimize sua operação comercial e alcance novos patamares de performance!
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: Globe, text: "@dwuitsolutions", color: "text-blue-400" },
                  { icon: Monitor, text: "www.dwu.com.br", color: "text-green-400" },
                  { icon: Users, text: "comercial@dwu.com.br", color: "text-purple-400" },
                  { icon: Clock, text: "(51) 30238393", color: "text-orange-400" }
                ].map((contact, index) => (
                  <div key={index} className="flex flex-col items-center p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all duration-300">
                    <contact.icon className={`w-8 h-8 ${contact.color} mb-2`} />
                    <span className="text-sm text-slate-300">{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Action Button */}
      <div className="text-center">
        {completionProgress === 100 ? (
          <Button
            onClick={handleComplete}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Concluir Apresentação
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-400">Explore todas as seções para concluir a apresentação</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <ArrowRight className="w-4 h-4" />
              Clique nos títulos das seções para expandir o conteúdo
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
