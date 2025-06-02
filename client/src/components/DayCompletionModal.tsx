import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Trophy, ArrowRight, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";

interface DayCompletionModalProps {
  day: number;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DayCompletionModal({ day, isOpen, onConfirm, onCancel }: DayCompletionModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [location, setLocation] = useLocation();

  const handleReviewContent = useCallback(() => {
    onCancel();
    setLocation("/onboarding");
  }, [onCancel, setLocation]);

  const handleStartEvaluation = useCallback(() => {
    if (isConfirming) return;

    setIsConfirming(true);
    onCancel();
    setLocation(`/modulo/${day}/avaliacao`);
  }, [isConfirming, onCancel, setLocation, day]);

  if (!isOpen) return null;

  const dayTitles = {
    1: "Bem-vindo à DWU",
    2: "Stack Tecnológico DWU", 
    3: "Metodologia de Suporte",
    4: "Troubleshooting Avançado",
    5: "Certificação DWU Expert"
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-slate-900 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-dwu-green">
            <AlertTriangle className="mr-2" />
            Avaliação do Módulo {day}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            <div className="space-y-4">
              <div>
                Parabéns! Você concluiu o conteúdo do Módulo {day}. 
                Para prosseguir, você precisará fazer uma avaliação para demonstrar seu conhecimento do conteúdo apresentado.
              </div>

              <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <div className="flex items-center text-blue-300 mb-2">
                  <CheckCircle className="mr-2" size={16} />
                  <span className="font-semibold">Informações da Avaliação:</span>
                </div>
                <div className="text-sm text-slate-300 space-y-1">
                  <div>• Questões de múltipla escolha</div>
                  <div>• Baseada no conteúdo do módulo</div>
                  <div>• Você pode revisar e tentar novamente se necessário</div>
                  <div>• Tempo recomendado: 15-20 minutos</div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={handleReviewContent}
            disabled={isConfirming}
            className="glass-effect border-slate-600 hover:border-slate-400"
          >
            Revisar Conteúdo
          </Button>
          <AlertDialogAction onClick={handleStartEvaluation} className="bg-dwu-green hover:bg-green-700">
            {isConfirming ? "Carregando..." : "Iniciar Avaliação"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}