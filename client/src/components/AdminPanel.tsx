import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  Trophy,
  Clock,
  User,
  LogOut,
  Shield,
  BarChart3,
  Plus,
  Minus,
  Target,
  Edit,
  Trash2,
  Save
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
  user_mail: string;
  user_profile: string;
}

interface Evaluation {
  id: number;
  userId: string;
  moduleNumber: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
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

interface UserEvaluationData {
  evaluations: Evaluation[];
  attempts: Attempt[];
  totalEvaluations: number;
  totalAttempts: number;
  currentModule: number;
  userProgress?: any;
}

export default function AdminPanel() {
  const { createUser, logout } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profile: "colaborador",
    address: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const [userEvaluations, setUserEvaluations] = useState<Record<number, UserEvaluationData>>({});
  const [loadingEvaluations, setLoadingEvaluations] = useState<Set<number>>(new Set());
  const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    password: "",
    profile: "colaborador",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message) setMessage(null);
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchUserEvaluations = async (userId: number) => {
    setLoadingEvaluations(prev => new Set(prev).add(userId));
    try {
      const response = await fetch(`/api/admin/user-evaluations/user-${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserEvaluations(prev => ({
          ...prev,
          [userId]: data
        }));
      } else {
        console.error("Failed to fetch user evaluations");
      }
    } catch (error) {
      console.error("Error fetching user evaluations:", error);
    } finally {
      setLoadingEvaluations(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const toggleUserExpansion = async (userId: number) => {
    const newExpanded = new Set(expandedUsers);

    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
      // Fetch evaluations if not already loaded
      if (!userEvaluations[userId]) {
        await fetchUserEvaluations(userId);
      }
    }

    setExpandedUsers(newExpanded);
  };

  const openAttemptsModal = (user: User, userId: number) => {
    setSelectedUserForModal(user);
    if (!userEvaluations[userId]) {
      fetchUserEvaluations(userId);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      email: user.user_mail,
      password: "",
      profile: user.user_profile,
    });
    setIsEditModalOpen(true);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editFormData.username,
          email: editFormData.email,
          password: editFormData.password || undefined,
          profile: editFormData.profile,
        }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: `Usuário ${editFormData.username} atualizado com sucesso!`,
        });
        setIsEditModalOpen(false);
        setEditingUser(null);
        fetchUsers(); // Refresh users list
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.message || "Erro ao atualizar usuário",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão com o servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.username}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: `Usuário ${user.username} excluído com sucesso!`,
        });
        fetchUsers(); // Refresh users list
      } else {
        const error = await response.json();
        toast({
          title: "Erro",
          description: error.message || "Erro ao excluir usuário",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão com o servidor",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createUser(formData);

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: `Usuário ${formData.username} criado com sucesso!`,
        });
        setFormData({
          username: "",
          email: "",
          password: "",
          profile: "colaborador",
          address: "",
          phone: "",
        });
        // Refresh users list after creating a new user
        fetchUsers();
      } else {
        toast({
          title: "Erro",
          description: result.message || "Erro ao criar usuário",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão com o servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 relative">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="absolute top-0 right-0 bg-slate-800 border-slate-600 text-slate-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>

          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-slate-400">Gerencie usuários e permissões do sistema</p>
        </div>

        {/* Create User Form */}
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <UserPlus size={24} className="text-blue-400" />
              Criar Novo Colaborador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert 
                className={`${
                  message.type === "success" 
                    ? "bg-green-900/50 border-green-700 text-green-100" 
                    : "bg-red-900/50 border-red-700 text-red-100"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300 font-medium">
                    Nome Completo
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nome do colaborador"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium">
                    Email Corporativo
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@dwu.com.br"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 font-medium">
                    Senha Temporária
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Senha inicial"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile" className="text-slate-300 font-medium">
                    Perfil de Acesso
                  </Label>
                  <Select
                    value={formData.profile}
                    onValueChange={(value) => handleInputChange("profile", value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="colaborador" className="text-white">
                        Colaborador - Acesso ao Onboarding
                      </SelectItem>
                      <SelectItem value="admin" className="text-white">
                        Administrador - Acesso Total
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-300 font-medium">
                    Endereço Completo
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Rua, número, bairro, cidade, CEP"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300 font-medium">
                    Telefone/WhatsApp
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar Colaborador"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users and Evaluations Report */}
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <BarChart3 size={24} className="text-green-400" />
              Relatório de Usuários e Avaliações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="text-center py-8">
                <div className="text-slate-400">Carregando usuários...</div>
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-4">
                {users.map((user) => (
                  <Collapsible key={user.id} open={expandedUsers.has(user.id)}>
                    <div className="border border-slate-600 rounded-lg bg-slate-900/50">
                      {/* User Header */}
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full p-4 justify-between hover:bg-slate-700/50"
                          onClick={() => toggleUserExpansion(user.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {expandedUsers.has(user.id) ? (
                                <Minus size={16} className="text-blue-400" />
                              ) : (
                                <Plus size={16} className="text-blue-400" />
                              )}
                              <User size={16} className="text-slate-400" />
                            </div>
                            <div className="text-left">
                              <div className="text-white font-medium">{user.username}</div>
                              <div className="text-slate-400 text-sm">{user.user_mail}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={user.user_profile === 'admin' ? 'secondary' : 'default'}
                              className={user.user_profile === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}
                            >
                              {user.user_profile === 'admin' ? 'Admin' : 'Colaborador'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-slate-700 border-slate-600 hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(user);
                              }}
                            >
                              <Edit size={14} className="text-slate-300" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-slate-700 border-slate-600 hover:bg-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user);
                              }}
                            >
                              <Trash2 size={14} className="text-slate-300" />
                            </Button>
                          </div>
                        </Button>
                      </CollapsibleTrigger>

                      {/* User Evaluation Details */}
                      <CollapsibleContent>
                        <div className="p-4 border-t border-slate-600">
                          {loadingEvaluations.has(user.id) ? (
                            <div className="text-center py-4">
                              <div className="text-slate-400">Carregando avaliações...</div>
                            </div>
                          ) : userEvaluations[user.id] ? (
                            <div className="space-y-4">
                              {/* Statistics Cards */}
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-slate-800 rounded-lg">
                                  <div className="text-lg font-bold text-blue-400">
                                    {userEvaluations[user.id].currentModule || 1}
                                  </div>
                                  <div className="text-xs text-slate-400">Módulo Atual</div>
                                </div>

                                <Dialog open={isModalOpen && selectedUserForModal?.id === user.id} onOpenChange={(open) => {
                                  setIsModalOpen(open);
                                  if (!open) setSelectedUserForModal(null);
                                }}>
                                  <DialogTrigger asChild>
                                    <div 
                                      className="text-center p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors group"
                                      onClick={() => openAttemptsModal(user, user.id)}
                                    >
                                      <div className="text-lg font-bold text-green-400 flex items-center justify-center gap-1">
                                        <Target size={16} className="text-green-400" />
                                        {userEvaluations[user.id].totalAttempts}
                                        <Eye size={14} className="text-slate-400 group-hover:text-green-400 ml-1" />
                                      </div>
                                      <div className="text-xs text-slate-400">Tentativas</div>
                                    </div>
                                  </DialogTrigger>

                                  <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto bg-slate-800 border-slate-700">
                                    <DialogHeader className="border-b border-slate-700 pb-4 mb-6">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                                            <Target className="text-green-400" size={28} />
                                            Dashboard de Performance - {selectedUserForModal?.username}
                                          </DialogTitle>
                                          <DialogDescription className="text-slate-400 text-base">
                                            Análise completa de desempenho e progresso nas avaliações
                                          </DialogDescription>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm text-slate-400">Última atualização</div>
                                          <div className="text-white font-medium">
                                            {new Date().toLocaleDateString('pt-BR')}
                                          </div>
                                        </div>
                                      </div>
                                    </DialogHeader>

                                    {userEvaluations[user.id] && userEvaluations[user.id].evaluations.length > 0 ? (
                                      <div className="space-y-8">
                                        {/* KPI Cards - Top Section */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                              <div className="text-blue-400 text-sm font-medium uppercase tracking-wide">Total de Tentativas</div>
                                              <Target className="text-blue-400" size={20} />
                                            </div>
                                            <div className="text-3xl font-bold text-white mb-1">
                                              {userEvaluations[user.id].totalAttempts}
                                            </div>
                                            <div className="text-slate-400 text-sm">Avaliações realizadas</div>
                                          </div>

                                          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                              <div className="text-green-400 text-sm font-medium uppercase tracking-wide">Aprovações</div>
                                              <CheckCircle className="text-green-400" size={20} />
                                            </div>
                                            <div className="text-3xl font-bold text-white mb-1">
                                              {userEvaluations[user.id].evaluations.filter(e => e.passed).length}
                                            </div>
                                            <div className="text-slate-400 text-sm">
                                              Taxa: {Math.round((userEvaluations[user.id].evaluations.filter(e => e.passed).length / userEvaluations[user.id].totalAttempts) * 100)}%
                                            </div>
                                          </div>

                                          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                              <div className="text-red-400 text-sm font-medium uppercase tracking-wide">Reprovações</div>
                                              <XCircle className="text-red-400" size={20} />
                                            </div>
                                            <div className="text-3xl font-bold text-white mb-1">
                                              {userEvaluations[user.id].evaluations.filter(e => !e.passed).length}
                                            </div>
                                            <div className="text-slate-400 text-sm">
                                              Taxa: {Math.round((userEvaluations[user.id].evaluations.filter(e => !e.passed).length / userEvaluations[user.id].totalAttempts) * 100)}%
                                            </div>
                                          </div>

                                          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                              <div className="text-purple-400 text-sm font-medium uppercase tracking-wide">Média Geral</div>
                                              <BarChart3 className="text-purple-400" size={20} />
                                            </div>
                                            <div className="text-3xl font-bold text-white mb-1">
                                              {Math.round(userEvaluations[user.id].evaluations.reduce((acc, e) => acc + e.score, 0) / userEvaluations[user.id].evaluations.length)}%
                                            </div>
                                            <div className="text-slate-400 text-sm">Score médio</div>
                                          </div>
                                        </div>

                                        {/* Main Dashboard Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                          {/* Performance por Módulo */}
                                          <div className="bg-slate-900/60 border border-slate-600 rounded-xl p-6">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                              <BarChart3 className="text-blue-400" size={22} />
                                              Performance por Módulo
                                            </h3>
                                            <div className="space-y-4">
                                              {[1, 2, 3, 4].map(moduleNum => {
                                                const moduleEvals = userEvaluations[user.id].evaluations.filter(e => e.moduleNumber === moduleNum);
                                                const lastEval = moduleEvals[0];
                                                const attempts = moduleEvals.length;
                                                const avgScore = moduleEvals.length > 0 ? Math.round(moduleEvals.reduce((acc, e) => acc + e.score, 0) / moduleEvals.length) : 0;

                                                return (
                                                  <div key={moduleNum} className="bg-slate-800/50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                      <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                          {moduleNum}
                                                        </div>
                                                        <span className="text-white font-medium">Módulo {moduleNum}</span>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                          {attempts} tentativa{attempts !== 1 ? 's' : ''}
                                                        </Badge>
                                                        {lastEval && (
                                                          <Badge 
                                                            variant={lastEval.passed ? "default" : "destructive"}
                                                            className="text-xs"
                                                          >
                                                            {lastEval.score}%
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </div>
                                                    {moduleEvals.length > 0 ? (
                                                      <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                          <span className="text-slate-400">Média do módulo</span>
                                                          <span className="text-white font-medium">{avgScore}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                                          <div 
                                                            className={`h-2 rounded-full transition-all ${
                                                              avgScore >= 70 ? 'bg-green-500' : avgScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${avgScore}%` }}
                                                          ></div>
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="text-slate-500 text-sm italic">Módulo não iniciado</div>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>

                                          {/* Estatísticas Detalhadas */}
                                          <div className="bg-slate-900/60 border border-slate-600 rounded-xl p-6">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                              <Clock className="text-green-400" size={22} />
                                              Análise de Desempenho
                                            </h3>
                                            <div className="space-y-6">
                                              {/* Tempo Médio */}
                                              <div>
                                                <div className="flex justify-between items-center mb-2">
                                                  <span className="text-slate-400">Tempo Médio por Avaliação</span>
                                                  <span className="text-white font-medium">
                                                    {Math.round(userEvaluations[user.id].evaluations.reduce((acc, e) => acc + (e.timeSpent || 0), 0) / userEvaluations[user.id].evaluations.length)} segundos
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Taxa de Acerto */}
                                              <div>
                                                <div className="flex justify-between items-center mb-2">
                                                  <span className="text-slate-400">Taxa de Acerto Média</span>
                                                  <span className="text-white font-medium">
                                                    {Math.round(userEvaluations[user.id].evaluations.reduce((acc, e) => acc + ((e.correctAnswers / e.totalQuestions) * 100), 0) / userEvaluations[user.id].evaluations.length)}%
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Melhor Performance */}
                                              <div>
                                                <div className="flex justify-between items-center mb-2">
                                                  <span className="text-slate-400">Melhor Performance</span>
                                                  <span className="text-green-400 font-medium">
                                                    {Math.max(...userEvaluations[user.id].evaluations.map(e => e.score))}%
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Módulo Atual */}
                                              <div>
                                                <div className="flex justify-between items-center mb-2">
                                                  <span className="text-slate-400">Módulo Atual</span>
                                                  <span className="text-blue-400 font-medium">
                                                    Módulo {userEvaluations[user.id].currentModule}
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Status Geral */}
                                              <div className="pt-4 border-t border-slate-700">
                                                <div className="flex items-center gap-3">
                                                  <div className={`w-3 h-3 rounded-full ${
                                                    userEvaluations[user.id].evaluations.some(e => e.passed) ? 'bg-green-500' : 'bg-red-500'
                                                  }`}></div>
                                                  <span className="text-white font-medium">
                                                    {userEvaluations[user.id].evaluations.some(e => e.passed) ? 'Usuário com aprovações' : 'Usuário sem aprovações'}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Histórico Detalhado */}
                                        <div className="bg-slate-900/60 border border-slate-600 rounded-xl p-6">
                                          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <Eye className="text-yellow-400" size={22} />
                                            Histórico de Tentativas
                                          </h3>
                                          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                            {userEvaluations[user.id].evaluations.map((evaluation, index) => (
                                              <div
                                                key={evaluation.id}
                                                className="border border-slate-600 rounded-lg p-4 bg-slate-800/30 hover:bg-slate-700/30 transition-colors"
                                              >
                                                <div className="flex items-center justify-between mb-4">
                                                  <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                        #{evaluation.attemptNumber}
                                                      </div>
                                                      <div>
                                                        <div className="text-white font-medium">Módulo {evaluation.moduleNumber}</div>
                                                        <div className="text-slate-400 text-xs">
                                                          {new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <Badge
                                                      variant={evaluation.passed ? "default" : "destructive"}
                                                      className="font-medium"
                                                    >
                                                      {evaluation.score}% - {evaluation.passed ? "APROVADO" : "REPROVADO"}
                                                    </Badge>
                                                  </div>
                                                  {evaluation.passed ? (
                                                    <CheckCircle size={24} className="text-green-400" />
                                                  ) : (
                                                    <XCircle size={24} className="text-red-400" />
                                                  )}
                                                </div>

                                                <div className="grid grid-cols-4 gap-4">
                                                  <div className="text-center p-2 bg-slate-700/50 rounded">
                                                    <div className="text-green-400 font-bold">{evaluation.correctAnswers}</div>
                                                    <div className="text-xs text-slate-400">Acertos</div>
                                                  </div>
                                                  <div className="text-center p-2 bg-slate-700/50 rounded">
                                                    <div className="text-red-400 font-bold">{evaluation.totalQuestions - evaluation.correctAnswers}</div>
                                                    <div className="text-xs text-slate-400">Erros</div>
                                                  </div>
                                                  <div className="text-center p-2 bg-slate-700/50 rounded">
                                                    <div className="text-blue-400 font-bold">{evaluation.totalQuestions}</div>
                                                    <div className="text-xs text-slate-400">Total</div>
                                                  </div>
                                                  <div className="text-center p-2 bg-slate-700/50 rounded">
                                                    <div className="text-purple-400 font-bold">
                                                      {evaluation.timeSpent ? `${Math.floor(evaluation.timeSpent / 60)}:${(evaluation.timeSpent % 60).toString().padStart(2, '0')}` : '--'}
                                                    </div>
                                                    <div className="text-xs text-slate-400">Tempo</div>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center py-12">
                                        <Target size={64} className="mx-auto mb-4 text-slate-600" />
                                        <h3 className="text-xl font-semibold text-white mb-2">Nenhuma Avaliação Encontrada</h3>
                                        <p className="text-slate-400">Este usuário ainda não realizou nenhuma avaliação.</p>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                <div className="text-center p-3 bg-slate-800 rounded-lg">
                                  <div className="text-lg font-bold text-purple-400">
                                    {userEvaluations[user.id].evaluations.filter(e => e.passed).length}
                                  </div>
                                  <div className="text-xs text-slate-400">Aprovações</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-slate-400">
                              Clique para carregar avaliações
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-slate-400">Nenhum usuário encontrado</div>              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Shield size={24} className="text-blue-400" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{users.length}</div>
                <div className="text-slate-400 text-sm">Usuários Cadastrados</div>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">5</div>
                <div className="text-slate-400 text-sm">Dias de Onboarding</div>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">~8h</div>
                <div className="text-slate-400 text-sm">Tempo Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-3">
                <Edit className="text-blue-400" size={24} />
                Editar Usuário
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Altere as informações do usuário {editingUser?.username}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username" className="text-slate-300 font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="edit-username"
                  type="text"
                  placeholder="Nome do colaborador"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-slate-300 font-medium">
                  Email Corporativo
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="usuario@dwu.com.br"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-password" className="text-slate-300 font-medium">
                  Nova Senha (deixe em branco para manter a atual)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="Nova senha (opcional)"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-profile" className="text-slate-300 font-medium">
                  Perfil de Acesso
                </Label>
                <Select
                  value={editFormData.profile}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, profile: value }))}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="colaborador" className="text-white">
                      Colaborador - Acesso ao Onboarding
                    </SelectItem>
                    <SelectItem value="admin" className="text-white">
                      Administrador - Acesso Total
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : (
                    <>
                      <Save size={16} className="mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}