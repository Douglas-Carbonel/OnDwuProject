
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Mail, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

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
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "reminder",
      title: "Prazo de conclusão",
      message: "Você tem 10 dias restantes para concluir o onboarding",
      date: new Date(),
      read: false,
      actionRequired: true
    },
    {
      id: "2",
      type: "info",
      title: "Novo conteúdo disponível",
      message: "Módulo 3 foi atualizado com novos materiais",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false
    }
  ]);

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
