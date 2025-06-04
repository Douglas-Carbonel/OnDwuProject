
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Mail, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "reminder";
  title: string;
  message: string;
  date: Date;
  read: boolean;
  actionRequired?: boolean;
}

export default function NotificationSystem() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deadlineInfo, setDeadlineInfo] = useState<{ isExpired: boolean; deadline: Date; daysRemaining: number } | null>(null);

  // Função para calcular dias restantes
  const calculateDaysRemaining = (deadline: Date): number => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Buscar informações de prazo do usuário
  useEffect(() => {
    const fetchDeadlineInfo = async () => {
      if (!user?.userId) return;

      try {
        console.log("🔍 Buscando informações de prazo para usuário:", user.userId);
        const response = await fetch(`/api/check-deadline/${user.userId}`);
        if (response.ok) {
          const data = await response.json();
          const deadline = new Date(data.deadline);
          const daysRemaining = calculateDaysRemaining(deadline);
          
          console.log("📊 Dados de prazo recebidos:", {
            isExpired: data.isExpired,
            deadline: deadline.toISOString(),
            daysRemaining
          });
          
          setDeadlineInfo({
            isExpired: data.isExpired,
            deadline,
            daysRemaining
          });
        } else {
          console.error("❌ Erro na resposta do servidor:", response.status);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar informações de prazo:", error);
      }
    };

    fetchDeadlineInfo();
  }, [user?.userId]);

  // Gerar notificações baseadas nos dados reais
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      // Notificação de prazo baseada em dados reais
      if (deadlineInfo) {
        const { daysRemaining, isExpired } = deadlineInfo;
        
        if (isExpired) {
          newNotifications.push({
            id: "deadline-expired",
            type: "warning",
            title: "Prazo expirado",
            message: "Seu prazo para conclusão do onboarding expirou. Seu progresso foi reiniciado.",
            date: new Date(),
            read: false,
            actionRequired: true
          });
        } else if (daysRemaining <= 3) {
          newNotifications.push({
            id: "deadline-urgent",
            type: "warning",
            title: "Prazo urgente",
            message: `Apenas ${daysRemaining} dia${daysRemaining !== 1 ? 's' : ''} restante${daysRemaining !== 1 ? 's' : ''} para concluir o onboarding`,
            date: new Date(),
            read: false,
            actionRequired: true
          });
        } else if (daysRemaining <= 7) {
          newNotifications.push({
            id: "deadline-warning",
            type: "reminder",
            title: "Prazo de conclusão",
            message: `Você tem ${daysRemaining} dias restantes para concluir o onboarding`,
            date: new Date(),
            read: false,
            actionRequired: true
          });
        } else {
          newNotifications.push({
            id: "deadline-info",
            type: "info",
            title: "Prazo de conclusão",
            message: `Você tem ${daysRemaining} dias para concluir o onboarding`,
            date: new Date(),
            read: false,
            actionRequired: false
          });
        }
      }

      // Notificação informativa padrão
      newNotifications.push({
        id: "welcome",
        type: "info",
        title: "Bem-vindo ao onboarding",
        message: "Complete todos os módulos para obter seu certificado",
        date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
        read: false
      });

      setNotifications(newNotifications);
    };

    if (deadlineInfo) {
      generateNotifications();
    }
  }, [deadlineInfo]);

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="text-yellow-500" size={16} />;
      case "success": return <CheckCircle className="text-green-500" size={16} />;
      case "reminder": return <Calendar className="text-blue-500" size={16} />;
      default: return <Mail className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative hover:bg-slate-800/50"
      >
        <Bell size={20} className="text-slate-400" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 bg-slate-800 border-slate-700 shadow-xl z-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Notificações</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X size={16} />
              </Button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read 
                      ? 'bg-slate-900/50 border-slate-700' 
                      : 'bg-slate-800 border-blue-500/50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-slate-500">
                        {notification.date.toLocaleDateString('pt-BR')}
                      </span>
                      {notification.actionRequired && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Ação necessária
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
