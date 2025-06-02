import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface SimulationComponentProps {
  title: string;
  description: string;
  options: string[];
  correctAnswer: number;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export default function SimulationComponent({ 
  title, 
  description, 
  options, 
  correctAnswer, 
  feedback 
}: SimulationComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const reset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <Card className="bg-slate-900 border-slate-600">
      <CardContent className="p-6">
        <h4 className="font-semibold mb-4 text-green-400">{title}</h4>
        <p className="text-slate-400 text-sm mb-4">{description}</p>
        
        {!showResult ? (
          <div className="space-y-2">
            {options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left p-3 bg-slate-800 hover:bg-slate-700 border-slate-600"
                onClick={() => handleAnswer(index)}
              >
                {String.fromCharCode(65 + index)}) {option}
              </Button>
            ))}
          </div>
        ) : (
          <div>
            <div className="space-y-2 mb-4">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    index === correctAnswer
                      ? 'border-green-500 bg-green-500/10'
                      : index === selectedAnswer
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-600'
                  }`}
                >
                  <div className="flex items-center">
                    {index === correctAnswer && <CheckCircle className="text-green-500 mr-2" size={16} />}
                    {index === selectedAnswer && index !== correctAnswer && <XCircle className="text-red-500 mr-2" size={16} />}
                    <span>{String.fromCharCode(65 + index)}) {option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`p-3 rounded-lg ${
              isCorrect ? 'bg-green-600' : 'bg-red-600'
            } text-white mb-3`}>
              <div className="flex items-center">
                {isCorrect ? <CheckCircle className="mr-2" size={16} /> : <XCircle className="mr-2" size={16} />}
                <span>{isCorrect ? feedback.correct : feedback.incorrect}</span>
              </div>
            </div>
            
            <Button 
              onClick={reset}
              variant="outline"
              className="w-full"
            >
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
