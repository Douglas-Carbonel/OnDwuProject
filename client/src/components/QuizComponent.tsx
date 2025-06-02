import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface QuizComponentProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export default function QuizComponent({ question, options, correctAnswer, explanation }: QuizComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const answerIndex = parseInt(selectedAnswer);
    const correct = answerIndex === correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const reset = () => {
    setSelectedAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <Card className="mb-8 bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-dwu-green" />Quiz Interativo
        </h4>
        
        <div className="mb-4">
          <p className="font-medium mb-3">{question}</p>
          
          {!showResult ? (
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-slate-700">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    index === correctAnswer
                      ? 'border-green-500 bg-green-500/10'
                      : index === parseInt(selectedAnswer)
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-600'
                  }`}
                >
                  <div className="flex items-center">
                    {index === correctAnswer && <CheckCircle className="text-green-500 mr-2" size={16} />}
                    {index === parseInt(selectedAnswer) && index !== correctAnswer && <XCircle className="text-red-500 mr-2" size={16} />}
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!showResult && (
            <Button 
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="mt-3 bg-dwu-blue hover:bg-blue-700"
            >
              Verificar Resposta
            </Button>
          )}
          
          {showResult && (
            <div className="mt-3">
              <div className={`p-3 rounded-lg ${
                isCorrect ? 'bg-green-600' : 'bg-red-600'
              } text-white`}>
                <div className="flex items-center">
                  {isCorrect ? <CheckCircle className="mr-2" size={16} /> : <XCircle className="mr-2" size={16} />}
                  <span className="font-semibold">
                    {isCorrect ? 'Correto! Excelente conhecimento.' : 'Incorreto. Revise o conteúdo e tente novamente.'}
                  </span>
                </div>
                {explanation && (
                  <p className="mt-2 text-sm opacity-90">{explanation}</p>
                )}
              </div>
              <Button 
                onClick={reset}
                variant="outline"
                className="mt-3"
              >
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
