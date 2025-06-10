
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Monitor, 
  Settings, 
  Users, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe, 
  Target,
  BookOpen,
  PlayCircle,
  FileText,
  CheckCircle,
  Star,
  Trophy,
  Clock,
  ArrowRight,
  Eye,
  MousePointer,
  Download,
  Upload,
  Database,
  Server,
  Smartphone,
  Layers,
  PieChart,
  TrendingUp,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  Palette,
  Layout,
  Maximize,
  RefreshCw,
  Bell,
  Heart,
  Award,
  Rocket,
  Sparkles,
  Lock,
  DollarSign
} from "lucide-react";

interface MindMapNode {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ComponentType<any>;
  position: { x: number; y: number };
  color: string;
  gradient: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  contentType: 'presentation' | 'video' | 'pdf' | 'interactive' | 'evaluation';
  estimatedTime: string;
  children?: string[];
  dependencies?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCore?: boolean;
}

interface Module4MindMapProps {
  onSectionSelect: (sectionId: string) => void;
  completedSections: string[];
  currentSection?: string;
}

export default function Module4MindMap({ 
  onSectionSelect, 
  completedSections = [], 
  currentSection 
}: Module4MindMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(currentSection || null);
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Definição dos nós do mapa mental com melhor distribuição espacial
  const mindMapNodes: MindMapNode[] = [
    // Centro - CRM One Core
    {
      id: 'core',
      title: 'CRM One',
      subtitle: 'Certificação Especialista',
      description: 'Centro de conhecimento completo do CRM One',
      icon: Trophy,
      position: { x: 600, y: 400 },
      color: 'blue',
      gradient: 'from-blue-600 to-purple-600',
      status: 'available',
      contentType: 'presentation',
      estimatedTime: '15 min',
      difficulty: 'intermediate',
      isCore: true
    },

    // Ramo Superior Esquerdo - Licenças
    {
      id: 'licencas',
      title: 'Licenças',
      description: 'Tipos de licenças e configurações',
      icon: Shield,
      position: { x: 300, y: 200 },
      color: 'green',
      gradient: 'from-green-600 to-emerald-600',
      status: 'available',
      contentType: 'pdf',
      estimatedTime: '20 min',
      difficulty: 'intermediate',
      children: ['layout-admin', 'conceitos-licenca', 'tipos-acesso']
    },

    {
      id: 'layout-admin',
      title: 'Layout',
      subtitle: 'Administração',
      description: 'Interface de administração e layout customizável',
      icon: Layout,
      position: { x: 150, y: 120 },
      color: 'green',
      gradient: 'from-green-500 to-green-700',
      status: 'available',
      contentType: 'interactive',
      estimatedTime: '25 min',
      difficulty: 'advanced'
    },

    {
      id: 'conceitos-licenca',
      title: 'Conceitos',
      subtitle: 'de Licença',
      description: 'Fundamentos e tipos de licenciamento',
      icon: BookOpen,
      position: { x: 250, y: 80 },
      color: 'green',
      gradient: 'from-emerald-500 to-green-600',
      status: 'available',
      contentType: 'presentation',
      estimatedTime: '15 min',
      difficulty: 'beginner'
    },

    {
      id: 'tipos-acesso',
      title: 'Tipos',
      subtitle: 'Acesso',
      description: 'Configuração de tipos de acesso e permissões',
      icon: Lock,
      position: { x: 400, y: 120 },
      color: 'green',
      gradient: 'from-green-600 to-teal-600',
      status: 'available',
      contentType: 'video',
      estimatedTime: '18 min',
      difficulty: 'intermediate'
    },

    // Ramo Superior Central - Pipeline de Vendas
    {
      id: 'pipeline',
      title: 'Pipeline',
      subtitle: 'de Vendas',
      description: 'Gestão completa do pipeline de vendas',
      icon: TrendingUp,
      position: { x: 600, y: 150 },
      color: 'purple',
      gradient: 'from-purple-600 to-indigo-600',
      status: 'available',
      contentType: 'presentation',
      estimatedTime: '30 min',
      difficulty: 'intermediate',
      children: ['pedidos-vendas']
    },

    {
      id: 'pedidos-vendas',
      title: 'Pedidos',
      subtitle: 'de Vendas',
      description: 'Gerenciamento de pedidos e processo de vendas',
      icon: BarChart3,
      position: { x: 700, y: 80 },
      color: 'purple',
      gradient: 'from-indigo-500 to-purple-700',
      status: 'available',
      contentType: 'interactive',
      estimatedTime: '35 min',
      difficulty: 'advanced'
    },

    // Ramo Superior Direito - Utilidades
    {
      id: 'utilidades',
      title: 'Utilidades',
      description: 'Ferramentas e utilitários do sistema',
      icon: Settings,
      position: { x: 950, y: 200 },
      color: 'cyan',
      gradient: 'from-cyan-600 to-blue-600',
      status: 'available',
      contentType: 'video',
      estimatedTime: '22 min',
      difficulty: 'intermediate'
    },

    // Ramo Esquerdo - Configurações
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Configurações avançadas do sistema',
      icon: Settings,
      position: { x: 200, y: 400 },
      color: 'orange',
      gradient: 'from-orange-600 to-red-600',
      status: 'available',
      contentType: 'pdf',
      estimatedTime: '40 min',
      difficulty: 'advanced',
      children: ['grupos-itens', 'tipos-atividade']
    },

    {
      id: 'grupos-itens',
      title: 'Grupo',
      subtitle: 'de Itens',
      description: 'Organização e categorização de itens',
      icon: Layers,
      position: { x: 80, y: 480 },
      color: 'orange',
      gradient: 'from-red-500 to-orange-600',
      status: 'available',
      contentType: 'interactive',
      estimatedTime: '25 min',
      difficulty: 'intermediate'
    },

    {
      id: 'tipos-atividade',
      title: 'Tipos',
      subtitle: 'Atividade',
      description: 'Configuração de tipos de atividades',
      icon: Calendar,
      position: { x: 150, y: 550 },
      color: 'orange',
      gradient: 'from-orange-600 to-yellow-600',
      status: 'available',
      contentType: 'presentation',
      estimatedTime: '20 min',
      difficulty: 'beginner'
    },

    // Ramo Inferior Esquerdo - Lucro
    {
      id: 'lucro',
      title: 'Lucro',
      description: 'Análise de lucratividade e margens',
      icon: DollarSign,
      position: { x: 300, y: 600 },
      color: 'yellow',
      gradient: 'from-yellow-600 to-orange-600',
      status: 'available',
      contentType: 'presentation',
      estimatedTime: '28 min',
      difficulty: 'advanced'
    },

    // Ramo Central Inferior - Relatórios
    {
      id: 'relatorios',
      title: 'Relatórios',
      description: 'Sistema completo de relatórios',
      icon: FileText,
      position: { x: 600, y: 650 },
      color: 'indigo',
      gradient: 'from-indigo-600 to-purple-600',
      status: 'available',
      contentType: 'video',
      estimatedTime: '45 min',
      difficulty: 'advanced',
      children: ['relatorios-principais']
    },

    {
      id: 'relatorios-principais',
      title: 'Principais',
      subtitle: 'Relatórios',
      description: 'Relatórios mais utilizados no CRM One',
      icon: PieChart,
      position: { x: 750, y: 720 },
      color: 'indigo',
      gradient: 'from-purple-500 to-indigo-700',
      status: 'available',
      contentType: 'interactive',
      estimatedTime: '30 min',
      difficulty: 'intermediate'
    },

    // Ramo Direito - Análise
    {
      id: 'analise',
      title: 'Análise',
      description: 'Ferramentas de análise e Business Intelligence',
      icon: BarChart3,
      position: { x: 1000, y: 400 },
      color: 'pink',
      gradient: 'from-pink-600 to-rose-600',
      status: 'available',
      contentType: 'presentation',
      estimatedTime: '35 min',
      difficulty: 'advanced',
      children: ['dashboards-bi']
    },

    {
      id: 'dashboards-bi',
      title: 'Dashboards',
      subtitle: 'Business Intelligence',
      description: 'Criação e customização de dashboards BI',
      icon: Monitor,
      position: { x: 1150, y: 320 },
      color: 'pink',
      gradient: 'from-rose-500 to-pink-700',
      status: 'available',
      contentType: 'interactive',
      estimatedTime: '40 min',
      difficulty: 'advanced'
    },

    // Avaliação Final
    {
      id: 'avaliacao-final',
      title: 'Avaliação',
      subtitle: 'Certificação',
      description: 'Prova final para certificação de especialista',
      icon: Award,
      position: { x: 600, y: 800 },
      color: 'emerald',
      gradient: 'from-emerald-600 to-green-600',
      status: 'locked',
      contentType: 'evaluation',
      estimatedTime: '60 min',
      difficulty: 'advanced',
      dependencies: ['core', 'licencas', 'pipeline', 'configuracoes', 'relatorios', 'analise']
    }
  ];

  const getNodeStatus = (node: MindMapNode): MindMapNode['status'] => {
    if (completedSections.includes(node.id)) return 'completed';
    if (node.id === currentSection) return 'in-progress';
    
    // Verificar dependências
    if (node.dependencies) {
      const hasAllDependencies = node.dependencies.every(dep => completedSections.includes(dep));
      if (!hasAllDependencies) return 'locked';
    }
    
    return 'available';
  };

  const calculateProgress = () => {
    const totalNodes = mindMapNodes.filter(node => node.id !== 'core').length;
    const completedNodes = completedSections.length;
    return Math.round((completedNodes / totalNodes) * 100);
  };

  const handleNodeClick = (node: MindMapNode) => {
    const status = getNodeStatus(node);
    if (status === 'locked') return;
    
    setSelectedNode(node.id);
    onSectionSelect(node.id);
  };

  const renderNode = (node: MindMapNode) => {
    const status = getNodeStatus(node);
    const isHovered = hoveredNode === node.id;
    const isSelected = selectedNode === node.id;
    const IconComponent = node.icon;

    const getStatusIcon = () => {
      switch (status) {
        case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
        case 'in-progress': return <PlayCircle className="w-4 h-4 text-blue-400" />;
        case 'locked': return <Lock className="w-4 h-4 text-gray-500" />;
        default: return null;
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case 'completed': return 'border-green-500/50 bg-green-500/10';
        case 'in-progress': return 'border-blue-500/50 bg-blue-500/10';
        case 'locked': return 'border-gray-500/30 bg-gray-500/5';
        default: return `border-${node.color}-500/30 bg-${node.color}-500/5`;
      }
    };

    return (
      <div
        key={node.id}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
          status === 'locked' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
        } ${isSelected ? 'scale-125 z-20' : 'z-10'}`}
        style={{
          left: node.position.x * scale + viewportPosition.x,
          top: node.position.y * scale + viewportPosition.y,
        }}
        onMouseEnter={() => status !== 'locked' && setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={() => handleNodeClick(node)}
      >
        <Card className={`
          relative overflow-hidden group w-32 h-32 
          ${node.isCore ? 'w-40 h-40' : ''}
          ${getStatusColor()}
          ${isHovered || isSelected ? `border-${node.color}-400/70 shadow-lg shadow-${node.color}-500/20` : ''}
          transition-all duration-300
        `}>
          <div className={`absolute inset-0 bg-gradient-to-br ${node.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
          
          <CardContent className="p-3 h-full flex flex-col items-center justify-center text-center relative z-10">
            <div className="relative mb-2">
              <div className={`w-12 h-12 ${node.isCore ? 'w-16 h-16' : ''} bg-${node.color}-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className={`w-6 h-6 ${node.isCore ? 'w-8 h-8' : ''} text-${node.color}-400`} />
              </div>
              
              {/* Status indicator */}
              <div className="absolute -top-1 -right-1">
                {getStatusIcon()}
              </div>
            </div>
            
            <h4 className={`font-bold text-${node.color}-300 text-xs ${node.isCore ? 'text-sm' : ''} leading-tight mb-1`}>
              {node.title}
            </h4>
            
            {node.subtitle && (
              <p className={`text-${node.color}-400 text-xs opacity-80`}>
                {node.subtitle}
              </p>
            )}
            
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">{node.estimatedTime}</span>
            </div>
            
            <Badge 
              variant="outline" 
              className={`text-xs mt-1 border-${node.color}-500/30 text-${node.color}-400`}
            >
              {node.contentType}
            </Badge>
          </CardContent>
          
          {/* Hover tooltip */}
          {isHovered && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-30 w-64">
              <h5 className="font-bold text-white mb-2">{node.title}</h5>
              <p className="text-slate-300 text-sm mb-2">{node.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className={`text-${node.color}-400`}>
                  {node.difficulty === 'beginner' && '⭐ Iniciante'}
                  {node.difficulty === 'intermediate' && '⭐⭐ Intermediário'}
                  {node.difficulty === 'advanced' && '⭐⭐⭐ Avançado'}
                </span>
                <span className="text-slate-400">{node.estimatedTime}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderConnections = () => {
    return mindMapNodes.map(node => {
      if (!node.children) return null;
      
      return node.children.map(childId => {
        const childNode = mindMapNodes.find(n => n.id === childId);
        if (!childNode) return null;
        
        const startX = node.position.x * scale + viewportPosition.x;
        const startY = node.position.y * scale + viewportPosition.y;
        const endX = childNode.position.x * scale + viewportPosition.x;
        const endY = childNode.position.y * scale + viewportPosition.y;
        
        return (
          <svg
            key={`${node.id}-${childId}`}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
          >
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={`rgb(${node.color === 'blue' ? '59 130 246' : '156 163 175'})`}
              strokeWidth="2"
              strokeOpacity="0.3"
              strokeDasharray="5,5"
            />
          </svg>
        );
      });
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewportPosition.x, y: e.clientY - viewportPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setViewportPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(2, scale + delta));
    setScale(newScale);
  };

  const resetView = () => {
    setScale(1);
    setViewportPosition({ x: 0, y: 0 });
  };

  const progress = calculateProgress();

  return (
    <div className="relative w-full h-[900px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
      {/* Header com progresso */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Módulo 4: Certificação Especialista</h2>
            <p className="text-slate-400">Navegue pelo mapa mental e explore cada seção para se tornar um especialista certificado</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-400 mb-1">{progress}%</div>
            <Progress value={progress} className="w-32 h-2" />
          </div>
        </div>
      </div>

      {/* Controles de zoom */}
      <div className="absolute top-24 right-6 z-30 flex flex-col gap-2">
        <Button size="sm" variant="outline" onClick={() => handleZoom(0.1)} className="bg-slate-800/80 border-slate-600">
          <Maximize className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleZoom(-0.1)} className="bg-slate-800/80 border-slate-600">
          <Maximize className="w-4 h-4 rotate-180" />
        </Button>
        <Button size="sm" variant="outline" onClick={resetView} className="bg-slate-800/80 border-slate-600">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Legenda */}
      <div className="absolute bottom-6 left-6 z-30 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
        <h4 className="text-white font-bold mb-3">Legenda</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-slate-300">Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">Em progresso</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-slate-300">Bloqueado</span>
          </div>
        </div>
      </div>

      {/* Área do mapa mental */}
      <div
        ref={containerRef}
        className="absolute inset-0 top-24 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Connections */}
        {renderConnections()}
        
        {/* Nodes */}
        {mindMapNodes.map(renderNode)}
      </div>

      {/* Instruções */}
      <div className="absolute bottom-6 right-6 z-30 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-600 max-w-xs">
        <h4 className="text-white font-bold mb-2">Como usar</h4>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Clique nos nós para acessar o conteúdo</li>
          <li>• Arraste para navegar pelo mapa</li>
          <li>• Use os controles de zoom</li>
          <li>• Conclua as dependências para desbloquear novos conteúdos</li>
        </ul>
      </div>
    </div>
  );
}
