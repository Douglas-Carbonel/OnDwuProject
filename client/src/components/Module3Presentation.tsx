
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
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
  Zap
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: string | React.ReactNode;
  type: 'intro' | 'benefits' | 'features' | 'modules' | 'comparison' | 'final';
  backgroundColor: string;
  textColor: string;
  icon?: React.ComponentType<any>;
}

interface Module3PresentationProps {
  onComplete: () => void;
}

export default function Module3Presentation({ onComplete }: Module3PresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      title: "CRM ONE",
      subtitle: "A Solução Definitiva para o SAP Business One",
      content: "Transforme seu relacionamento com seus clientes e potencialize suas vendas.",
      type: 'intro',
      backgroundColor: "from-slate-900 via-blue-900 to-slate-900",
      textColor: "text-white",
      icon: Monitor
    },
    {
      id: 2,
      title: "O que é o CRM One?",
      content: "O CRM One é uma solução 100% integrada ao SAP Business One, desenvolvida para aprimorar a gestão comercial, fortalecer o relacionamento com clientes e otimizar processos de vendas e pós-venda. Tudo isso com dados em tempo real, eliminando a necessidade de integrações externas e garantindo máxima eficiência para sua operação.",
      type: 'intro',
      backgroundColor: "from-blue-900 via-cyan-900 to-blue-900",
      textColor: "text-blue-100",
      icon: Globe
    },
    {
      id: 3,
      title: "Benefícios",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Monitor className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">Interface WEB e Mobile Intuitiva</h4>
                <p className="text-sm opacity-90">Acesso completo em qualquer dispositivo</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">Evolução Contínua com o SAP</h4>
                <p className="text-sm opacity-90">Sem necessidade de atualizações em integrações internas</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Database className="w-8 h-8 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">Banco de Dados Próprio</h4>
                <p className="text-sm opacity-90">Dados seguros na sua infraestrutura</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">Centralização do Relacionamento</h4>
                <p className="text-sm opacity-90">Todo relacionamento com cliente em um módulo</p>
              </div>
            </div>
          </div>
        </div>
      ),
      type: 'benefits',
      backgroundColor: "from-purple-900 via-indigo-900 to-purple-900",
      textColor: "text-purple-100",
      icon: TrendingUp
    },
    {
      id: 4,
      title: "Funcionalidades",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <span className="text-sm">Dashboards customizáveis sem dependência de terceiros</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-green-400" />
              <span className="text-sm">Visão 360 graus dos seus clientes</span>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span className="text-sm">Relatórios em Crystal Reports e tabelas dinâmicas</span>
            </div>
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-orange-400" />
              <span className="text-sm">Análises personalizadas em tempo real</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Monitor className="w-6 h-6 text-cyan-400" />
              <span className="text-sm">Relatórios personalizáveis no APP para uso offline</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-pink-400" />
              <span className="text-sm">Envio de alertas ou relatórios por e-mail</span>
            </div>
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-yellow-400" />
              <span className="text-sm">Filtro de itens com estoque e agrupamento</span>
            </div>
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-red-400" />
              <span className="text-sm">Personalização de layouts de impressão</span>
            </div>
          </div>
        </div>
      ),
      type: 'features',
      backgroundColor: "from-green-900 via-teal-900 to-green-900",
      textColor: "text-green-100",
      icon: Settings
    },
    {
      id: 5,
      title: "Módulos do Sistema",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <h4 className="font-bold text-xl">Dashboards Personalizáveis</h4>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Total autonomia na personalização dos dashboards! Através de consultas SQL/HANA, 
                crie indicadores e gráficos baseados em informações em tempo real na base de dados do SAP Business One.
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
                <h4 className="font-bold text-xl">Vendas</h4>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Geração de cotações e pedidos com agilidade em tempo real com o SAP Business One, 
                garantindo qualidade na informação repassada ao cliente.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-purple-400" />
                <h4 className="font-bold text-xl">Relacionamento</h4>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Atendimentos em formato Agenda e Kanban. Gerencie tarefas e crie histórico de relacionamento 
                com clientes através do módulo de atendimento.
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Handshake className="w-8 h-8 text-orange-400" />
                <h4 className="font-bold text-xl">Oportunidades</h4>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Crie, edite e gerencie oportunidades de vendas online de qualquer lugar! 
                Pipeline inovador para filtrar e visualizar oportunidades por etapa.
              </p>
            </div>
          </div>
        </div>
      ),
      type: 'modules',
      backgroundColor: "from-orange-900 via-red-900 to-orange-900",
      textColor: "text-orange-100",
      icon: Users
    },
    {
      id: 6,
      title: "Por que Escolher o CRM One?",
      content: (
        <div className="space-y-8">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-blue-400" />
              <h4 className="font-bold text-xl">Padrões do SAP Business One</h4>
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Segue as regras de negócio, transações e procedimentos de autorização padrões do SAP Business One</li>
              <li>• Exibição de impostos em tempo real de acordo com todas as parametrizações já existentes</li>
              <li>• Centralização de todo relacionamento com cliente no módulo de atendimento</li>
              <li>• Ferramenta desenvolvida exclusivamente para o SAP Business One</li>
            </ul>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <h4 className="font-bold text-xl">Redução de Custos</h4>
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Dispensa licenciamento profissional e não impõe limites do CRM One</li>
              <li>• Tudo funciona de forma nativa, sem depender de integrações externas</li>
            </ul>
          </div>
        </div>
      ),
      type: 'comparison',
      backgroundColor: "from-cyan-900 via-blue-900 to-cyan-900",
      textColor: "text-cyan-100",
      icon: Shield
    },
    {
      id: 7,
      title: "Comparativo com Concorrentes",
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-4 font-bold">Critério</th>
                <th className="text-center p-4 font-bold text-blue-400">CRM ONE</th>
                <th className="text-center p-4 font-bold text-gray-400">Concorrentes</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b border-white/10">
                <td className="p-4">Integração Nativa com SAP B1</td>
                <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center p-4"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-4">App Mobile Offline</td>
                <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-4">Evolui junto ao SAP sem retrabalho</td>
                <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center p-4"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-4">Suporte Direto com Especialista</td>
                <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center p-4"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-4">Custo-benefício</td>
                <td className="text-center p-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                <td className="text-center p-4"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      type: 'comparison',
      backgroundColor: "from-indigo-900 via-purple-900 to-indigo-900",
      textColor: "text-indigo-100",
      icon: BarChart3
    },
    {
      id: 8,
      title: "Comece Agora!",
      subtitle: "Otimize sua operação comercial e alcance novos patamares de performance!",
      content: (
        <div className="space-y-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <Globe className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-sm">@dwuitsolutions</span>
            </div>
            <div className="flex flex-col items-center">
              <Monitor className="w-8 h-8 text-green-400 mb-2" />
              <span className="text-sm">www.dwu.com.br</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-purple-400 mb-2" />
              <span className="text-sm">comercial@dwu.com.br</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-orange-400 mb-2" />
              <span className="text-sm">(51) 30238393</span>
            </div>
          </div>
        </div>
      ),
      type: 'final',
      backgroundColor: "from-slate-900 via-green-900 to-slate-900",
      textColor: "text-white",
      icon: Zap
    }
  ];

  const nextSlide = () => {
    if (animating) return;
    
    setAnimating(true);
    setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        handleComplete();
      }
      setAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    if (animating) return;
    
    setAnimating(true);
    setTimeout(() => {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
      setAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (animating) return;
    
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setAnimating(false);
    }, 300);
  };

  const handleComplete = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;
  const progressPercentage = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header com Progresso */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">Benefícios da Ferramenta</h2>
          <span className="text-sm text-slate-400">
            {currentSlide + 1} de {slides.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Slide Principal */}
      <Card className={`glass-effect border-slate-700/50 min-h-[600px] bg-gradient-to-br ${currentSlideData.backgroundColor} transition-all duration-500 ${animating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <CardContent className="p-12 flex flex-col justify-center space-y-8">
          {/* Header do Slide */}
          <div className="text-center space-y-4">
            {IconComponent && (
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto">
                <IconComponent size={40} className="text-white" />
              </div>
            )}
            
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">
                {currentSlideData.title}
              </h3>
              {currentSlideData.subtitle && (
                <p className="text-xl text-white/80 mb-4">
                  {currentSlideData.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Conteúdo do Slide */}
          <div className={`${currentSlideData.textColor} flex-1 flex items-center justify-center`}>
            {typeof currentSlideData.content === 'string' ? (
              <p className="text-lg leading-relaxed text-center max-w-4xl">
                {currentSlideData.content}
              </p>
            ) : (
              <div className="w-full max-w-6xl">
                {currentSlideData.content}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controles de Navegação */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0 || animating}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Anterior
        </Button>

        {/* Indicadores de Slide */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={animating}
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
            onClick={handleComplete}
            disabled={animating}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            Concluir Apresentação
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={nextSlide}
            disabled={currentSlide >= slides.length - 1 || animating}
            className="flex items-center gap-2"
          >
            Próximo
            <ChevronRight size={16} />
          </Button>
        )}
      </div>

      {/* Instruções */}
      <div className="text-center">
        <p className="text-sm text-slate-400">
          Use as setas ou clique nos indicadores para navegar pelos slides
        </p>
      </div>
    </div>
  );
}
