import DayContent from "./DayContent";
import ModuleEvaluation from "./ModuleEvaluation";
import FeedbackSystem from "./FeedbackSystem";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface ModuleContentProps {
  day: number;
  onProgressUpdate: (progress: number) => void;
  showEvaluation: boolean;
  onEvaluationComplete: (passed: boolean, score: number) => void;
  onCancelEvaluation: () => void;
}

export default function ModuleContent({ 
  day, 
  onProgressUpdate, 
  showEvaluation, 
  onEvaluationComplete, 
  onCancelEvaluation 
}: ModuleContentProps) {
  
  const downloadPDF = () => {
    try {
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = '/assets/Onboarding-DWU-IT-Solutions.pdf';
      link.download = 'Onboarding-DWU-IT-Solutions.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao fazer download do PDF:', error);
    }
  };
  if (showEvaluation) {
    return (
      <div>
        <ModuleEvaluation
          moduleNumber={day}
          onEvaluationComplete={onEvaluationComplete}
          onCancel={onCancelEvaluation}
        />
        {/* Feedback System para avaliações */}
        <div className="mt-6">
          <FeedbackSystem moduleId={day} contentType="evaluation" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* PDF Download Button for Module 1 */}
      {day === 1 && (
        <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-blue-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-300">Material Complementar</h3>
                <p className="text-slate-400 text-sm">
                  Faça o download do guia completo de onboarding para acompanhar a apresentação
                </p>
              </div>
            </div>
            <Button 
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        </div>
      )}
      
      <DayContent 
        day={day} 
        onProgressUpdate={onProgressUpdate} 
      />
      {/* Feedback System para módulos */}
      <div className="mt-8">
        <FeedbackSystem moduleId={day} contentType="module" />
      </div>
    </div>
  );
}