
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, ArrowLeft, Lock } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ModuleEvaluationProps {
  moduleId: number;
  userId: string;
  onComplete: (score: number, passed: boolean) => void;
  onBack: () => void;
}

export default function ModuleEvaluation({ moduleId, userId, onComplete, onBack }: ModuleEvaluationProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canAttempt, setCanAttempt] = useState(true);
  const [attemptsInfo, setAttemptsInfo] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    loadQuestions();
    checkAttemptStatus();
  }, [moduleId, userId]);

  // Update timer every second when blocked
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!canAttempt && attemptsInfo?.nextAttemptAt) {
      interval = setInterval(() => {
        const now = new Date();
        const nextAttempt = new Date(attemptsInfo.nextAttemptAt);
        const diff = nextAttempt.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeRemaining('Disponível agora');
          checkAttemptStatus(); // Recheck status
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          if (hours > 0) {
            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
          } else if (minutes > 0) {
            setTimeRemaining(`${minutes}m ${seconds}s`);
          } else {
            setTimeRemaining(`${seconds}s`);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [canAttempt, attemptsInfo]);

  const checkAttemptStatus = async () => {
    try {
      console.log('🔍 Verificando tentativas para userId:', userId, 'módulo:', moduleId);
      
      if (!userId || !moduleId) {
        console.error('❌ UserId ou ModuleId não definidos');
        return;
      }
      
      const response = await fetch(`/api/evaluation-attempts/${userId}/${moduleId}`);
      const data = await response.json();
      console.log('✅ Status de tentativas recebido:', data);
      
      setCanAttempt(data.canAttempt);
      setAttemptsInfo(data);
      
      if (!data.canAttempt && data.nextAttemptAt) {
        const now = new Date();
        const nextAttempt = new Date(data.nextAttemptAt);
        const diff = nextAttempt.getTime() - now.getTime();
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          if (hours > 0) {
            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
          } else if (minutes > 0) {
            setTimeRemaining(`${minutes}m ${seconds}s`);
          } else {
            setTimeRemaining(`${seconds}s`);
          }
        } else {
          setTimeRemaining('Disponível agora');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar tentativas:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      console.log('🔍 Carregando questões para moduleId:', moduleId);
      
      if (!moduleId) {
        console.error('❌ ModuleId não definido');
        return;
      }
      
      const response = await fetch(`/api/evaluation-questions/${moduleId}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar questões');
      }
      const data = await response.json();
      console.log('✅ Questões carregadas:', data.questions?.length || 0);
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const finalScore = calculateScore();
      const passed = finalScore >= 70;

      const response = await fetch('/api/submit-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          moduleId,
          score: finalScore,
          answers: selectedAnswers,
          totalQuestions: questions.length,
          correctAnswers: questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length,
          passed
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar avaliação');
      }

      setScore(finalScore);
      setShowResults(true);
      onComplete(finalScore, passed);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const allQuestionsAnswered = questions.every(question => 
    selectedAnswers[question.id] !== undefined
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando avaliação...</p>
        </div>
      </div>
    );
  }

  // Blocked screen with improved design
  if (!canAttempt) {
    return (
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-red-600" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            Acesso Temporariamente Bloqueado
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="bg-red-50 border-red-200 text-red-800">
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-sm leading-relaxed">
              Você atingiu o limite de <strong>2 tentativas por dia</strong> para este módulo.
              Para manter a qualidade do aprendizado, você poderá tentar novamente após 24 horas da sua última tentativa.
            </AlertDescription>
          </Alert>

          {attemptsInfo && (
            <div className="bg-white rounded-lg p-6 border border-red-200">
              <h3 className="font-semibold text-gray-800 mb-4">Informações das Tentativas:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tentativas realizadas:</span>
                  <span className="font-medium">{attemptsInfo.attemptCount}/2</span>
                </div>
                <div className="flex justify-between">
                  <span>Última tentativa:</span>
                  <span className="font-medium">
                    {new Date(attemptsInfo.lastAttempt).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Próxima tentativa disponível:</span>
                  <span className="font-medium text-green-600">
                    {new Date(attemptsInfo.nextAttemptAt).toLocaleString('pt-BR')}
                  </span>
                </div>
                {timeRemaining && (
                  <div className="flex justify-between border-t pt-2 mt-3">
                    <span>Tempo restante:</span>
                    <span className="font-bold text-blue-600">{timeRemaining}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Use este tempo para revisar o conteúdo do módulo e se preparar melhor para a próxima tentativa.
            </p>
            
            <Button 
              onClick={onBack}
              variant="outline"
              className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Módulo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const passed = score >= 70;
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <CheckCircle className="text-green-600" size={32} />
            ) : (
              <XCircle className="text-red-600" size={32} />
            )}
          </div>
          <CardTitle className={`text-2xl font-bold ${
            passed ? 'text-green-800' : 'text-red-800'
          }`}>
            {passed ? 'Parabéns! Você foi aprovado!' : 'Ops! Você foi reprovado.'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${
              passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {score}%
            </div>
            <p className="text-gray-600">
              {passed 
                ? 'Você atingiu a nota mínima de 70% para aprovação!'
                : 'Você precisa de pelo menos 70% para ser aprovado.'
              }
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Questões corretas:</span>
              <span className="font-medium">
                {questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length} de {questions.length}
              </span>
            </div>
            <Progress value={score} className="h-2" />
          </div>

          {!passed && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                Não desanime! Revise o conteúdo do módulo e tente novamente. 
                Você pode fazer até 2 tentativas por dia.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 justify-center">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Módulo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhuma questão disponível para este módulo.</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              Módulo {moduleId} - Avaliação
            </span>
          </div>
          <Progress 
            value={((currentQuestionIndex + 1) / questions.length) * 100} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestion.id] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleAnswerSelect(currentQuestion.id, index)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedAnswers[currentQuestion.id] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestion.id] === index && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Anterior
        </Button>

        {currentQuestionIndex === questions.length - 1 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={!allQuestionsAnswered || submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Enviando...' : 'Finalizar Avaliação'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Finalizar Avaliação</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja finalizar a avaliação? 
                  Você respondeu {Object.keys(selectedAnswers).length} de {questions.length} questões.
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion.id] === undefined}
          >
            Próxima
          </Button>
        )}
      </div>

      {/* Answer Status */}
      <div className="text-center text-sm text-gray-600">
        Questões respondidas: {Object.keys(selectedAnswers).length} de {questions.length}
        {!allQuestionsAnswered && (
          <span className="block text-yellow-600 mt-1">
            Responda todas as questões para finalizar a avaliação
          </span>
        )}
      </div>
    </div>
  );
}
