
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, Target, Clock, Book, Medal, Award } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: "learning" | "performance" | "completion" | "engagement";
  points: number;
}

interface AchievementSystemProps {
  userProgress: any;
}

export default function AchievementSystem({ userProgress }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_module",
      title: "Primeiro Passo",
      description: "Complete seu primeiro módulo",
      icon: "star",
      unlocked: (userProgress?.completedModules?.length || 0) >= 1,
      progress: userProgress?.completedModules?.length || 0,
      maxProgress: 1,
      category: "learning",
      points: 50
    },
    {
      id: "speed_learner",
      title: "Aprendiz Veloz",
      description: "Complete um módulo em menos de 2 horas",
      icon: "zap",
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: "performance",
      points: 100
    },
    {
      id: "perfectionist",
      title: "Perfeccionista",
      description: "Obtenha 100% em uma avaliação",
      icon: "target",
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      category: "performance",
      points: 150
    },
    {
      id: "dedicated",
      title: "Dedicado",
      description: "Acesse o sistema por 5 dias consecutivos",
      icon: "clock",
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      category: "engagement",
      points: 200
    },
    {
      id: "graduate",
      title: "Graduado DWU",
      description: "Complete todos os módulos",
      icon: "medal",
      unlocked: (userProgress?.completedModules?.length || 0) >= 4,
      progress: userProgress?.completedModules?.length || 0,
      maxProgress: 4,
      category: "completion",
      points: 500
    }
  ]);

  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "star": return <Star className="text-yellow-500" size={20} />;
      case "zap": return <Zap className="text-blue-500" size={20} />;
      case "target": return <Target className="text-green-500" size={20} />;
      case "clock": return <Clock className="text-purple-500" size={20} />;
      case "medal": return <Medal className="text-orange-500" size={20} />;
      default: return <Trophy className="text-yellow-500" size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "learning": return "bg-blue-500/20 text-blue-400";
      case "performance": return "bg-green-500/20 text-green-400";
      case "completion": return "bg-purple-500/20 text-purple-400";
      case "engagement": return "bg-orange-500/20 text-orange-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="text-yellow-500" size={24} />
          <span className="text-white">Conquistas</span>
          <Badge className="bg-yellow-500/20 text-yellow-400">
            {totalPoints} pts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border transition-all ${
              achievement.unlocked
                ? 'bg-slate-700/50 border-yellow-500/50 shadow-lg'
                : 'bg-slate-900/50 border-slate-700'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                achievement.unlocked ? 'bg-yellow-500/20' : 'bg-slate-800'
              }`}>
                {getIcon(achievement.icon)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    achievement.unlocked ? 'text-white' : 'text-slate-400'
                  }`}>
                    {achievement.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(achievement.category)}>
                      {achievement.category}
                    </Badge>
                    {achievement.unlocked && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        +{achievement.points}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 mb-3">
                  {achievement.description}
                </p>
                
                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progresso</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100}
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
