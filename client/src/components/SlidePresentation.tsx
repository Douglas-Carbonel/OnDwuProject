
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Building, Users, Target, Award, Globe, Heart } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  backgroundColor: string;
  textColor: string;
}

interface SlidePresentationProps {
  onComplete: () => void;
}

export default function SlidePresentation({ onComplete }: SlidePresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Cultura da DWU IT Solutions",
      content: "Bem-vindos à nossa jornada de transformação digital e inovação tecnológica.",
      icon: Building,
      backgroundColor: "from-blue-600 to-blue-800",
      textColor: "text-blue-100"
    },
    {
      id: 2,
      title: "Quem Somos?",
      content: "Somos uma empresa especializada em soluções para empresas que utilizam SAP Business One, com foco na área comercial e equipe de vendas. Com 9 anos de experiência, nos destacamos no mercado pelo desenvolvimento do CRM One, uma solução certificada pela SAP.",
      icon: Users,
      backgroundColor: "from-green-600 to-green-800",
      textColor: "text-green-100"
    },
    {
      id: 3,
      title: "Nosso Modelo de Negócio",
      content: "Baseamos nossa atuação em 5 pilares fundamentais que garantem excelência e satisfação dos nossos clientes.",
      icon: Target,
      backgroundColor: "from-purple-600 to-purple-800",
      textColor: "text-purple-100"
    },
    {
      id: 4,
      title: "1. Cultura e Treinamento",
      content: "Manter a cultura da empresa voltada em cuidar das pessoas.",
      icon: Heart,
      backgroundColor: "from-yellow-600 to-orange-600",
      textColor: "text-yellow-100"
    },
    {
      id: 5,
      title: "2. Perfilamento",
      content: "Buscar o cliente e perfilar ele na demonstração do sistema.",
      icon: Globe,
      backgroundColor: "from-orange-600 to-red-600",
      textColor: "text-orange-100"
    },
    {
      id: 6,
      title: "3. Produto Único",
      content: "Cuidado do desenvolvimento dos sistemas e linha de produção do produto.",
      icon: Award,
      backgroundColor: "from-pink-600 to-purple-600",
      textColor: "text-pink-100"
    },
    {
      id: 7,
      title: "4. Cuidado Personalizado com o Cliente",
      content: "Entender sobre o contexto do cliente antes de implantar o sistema.",
      icon: Users,
      backgroundColor: "from-cyan-600 to-blue-600",
      textColor: "text-cyan-100"
    },
    {
      id: 8,
      title: "5. Atendimento Humanizado",
      content: "Cada cliente tem sua história e nós conectamos o nosso produto ao universo dele para gerar satisfação.",
      icon: Heart,
      backgroundColor: "from-indigo-600 to-blue-800",
      textColor: "text-indigo-100"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleComplete = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;
  const progressPercentage = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header com Progresso */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">Apresentação Institucional</h2>
          <span className="text-sm text-slate-400">
            {currentSlide + 1} de {slides.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Slide Principal */}
      <Card className={`glass-effect border-slate-700/50 min-h-[500px] bg-gradient-to-br ${currentSlideData.backgroundColor}`}>
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <IconComponent size={48} className="text-white" />
          </div>
          
          <h3 className="text-4xl font-bold text-white mb-6">
            {currentSlideData.title}
          </h3>
          
          <p className={`text-xl leading-relaxed max-w-3xl ${currentSlideData.textColor}`}>
            {currentSlideData.content}
          </p>
        </CardContent>
      </Card>

      {/* Controles de Navegação */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
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
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            Concluir Apresentação
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={nextSlide}
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
