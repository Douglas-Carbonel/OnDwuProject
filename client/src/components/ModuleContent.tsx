
import DayContent from "./DayContent";
import ModuleEvaluation from "./ModuleEvaluation";

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
      <ModuleEvaluation
        moduleNumber={day}
        onEvaluationComplete={onEvaluationComplete}
        onCancel={onCancelEvaluation}
      />
    );
  }

  return (
    <DayContent 
      day={day} 
      onProgressUpdate={onProgressUpdate} 
    />
  );
}
