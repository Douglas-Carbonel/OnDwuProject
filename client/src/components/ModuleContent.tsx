import DayContent from "./DayContent";
import ModuleEvaluation from "./ModuleEvaluation";
import FeedbackSystem from "./FeedbackSystem";

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