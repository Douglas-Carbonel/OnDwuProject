
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface Evaluation {
  id: number;
  userId: string;
  moduleNumber: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  answers: Record<number, number>;
  timeSpent: number;
  createdAt: string;
}

interface Attempt {
  id: number;
  userId: string;
  moduleNumber: number;
  attemptNumber: number;
  score: number;
  passed: boolean;
  createdAt: string;
}

export default function ValidationPanel() {
  const [allEvaluations, setAllEvaluations] = useState<Evaluation[]>([]);
  const [userEvaluations, setUserEvaluations] = useState<any>(null);
  const [moduleStats, setModuleStats] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAllEvaluations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/all-evaluations");
      if (response.ok) {
        const data = await response.json();
        setAllEvaluations(data);
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEvaluations = async () => {
    if (!user?.userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/user-evaluations/${user.userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserEvaluations(data);
      }
    } catch (error) {
      console.error("Error fetching user evaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleStats = async (moduleNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/module-stats/${moduleNumber}`);
      if (response.ok) {
        const data = await response.json();
        setModuleStats(data);
      }
    } catch (error) {
      console.error("Error fetching module stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvaluations();
    if (user?.userId) {
      fetchUserEvaluations();
    }
  }, [user?.userId]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Painel de Validação - Avaliações
        </h1>
        <p className="text-slate-400">
          Verificação de dados salvos no banco de dados
        </p>
      </div>

      {/* All Evaluations */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            Todas as Avaliações
            <Button onClick={fetchAllEvaluations} disabled={loading} size="sm">
              Atualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-slate-300 mb-4">
            Total de avaliações: <Badge variant="secondary">{allEvaluations.length}</Badge>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {allEvaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="p-3 border border-slate-600 rounded-lg mb-2 text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">
                      Usuário: {evaluation.userId.substring(0, 20)}...
                    </p>
                    <p className="text-slate-300">
                      Módulo {evaluation.moduleNumber} | Score: {evaluation.score}% | 
                      {evaluation.passed ? " ✅ Aprovado" : " ❌ Reprovado"}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {new Date(evaluation.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={evaluation.passed ? "default" : "destructive"}>
                    {evaluation.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current User Evaluations */}
      {user && userEvaluations && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center">
              Minhas Avaliações
              <Button onClick={fetchUserEvaluations} disabled={loading} size="sm">
                Atualizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-slate-300">
                Total de avaliações: <Badge variant="secondary">{userEvaluations.totalEvaluations}</Badge>
              </div>
              <div className="text-slate-300">
                Total de tentativas: <Badge variant="secondary">{userEvaluations.totalAttempts}</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-white font-semibold">Avaliações Completas:</h4>
              {userEvaluations.evaluations.map((evaluation: Evaluation) => (
                <div
                  key={evaluation.id}
                  className="p-3 border border-slate-600 rounded-lg text-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white">Módulo {evaluation.moduleNumber}</span>
                      <span className="text-slate-300 ml-4">
                        {evaluation.correctAnswers}/{evaluation.totalQuestions} corretas
                      </span>
                      <span className="text-slate-400 ml-4 text-xs">
                        Tempo: {Math.floor(evaluation.timeSpent / 60)}min {evaluation.timeSpent % 60}s
                      </span>
                    </div>
                    <Badge variant={evaluation.passed ? "default" : "destructive"}>
                      {evaluation.score}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Statistics */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-white">Estatísticas por Módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4].map((module) => (
              <Button
                key={module}
                onClick={() => {
                  setSelectedModule(module);
                  fetchModuleStats(module);
                }}
                variant={selectedModule === module ? "default" : "outline"}
                size="sm"
              >
                Módulo {module}
              </Button>
            ))}
          </div>

          {moduleStats && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{moduleStats.totalEvaluations}</div>
                  <div className="text-slate-400 text-sm">Avaliações</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{moduleStats.totalAttempts}</div>
                  <div className="text-slate-400 text-sm">Tentativas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{moduleStats.passedCount}</div>
                  <div className="text-slate-400 text-sm">Aprovados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{moduleStats.passRate.toFixed(1)}%</div>
                  <div className="text-slate-400 text-sm">Taxa de Aprovação</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-white">
                  Nota Média: {moduleStats.averageScore}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
