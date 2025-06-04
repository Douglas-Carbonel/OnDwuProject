
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, ThumbsDown, Star, Send, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackSystemProps {
  moduleId?: number;
  contentType?: "module" | "evaluation" | "general";
}

export default function FeedbackSystem({ moduleId, contentType = "general" }: FeedbackSystemProps) {
  const [feedbackType, setFeedbackType] = useState<"rating" | "comment" | "help">("rating");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    try {
      // Aqui você enviaria para o backend
      const feedbackData = {
        moduleId,
        contentType,
        feedbackType,
        rating: feedbackType === "rating" ? rating : undefined,
        comment: comment || undefined,
        timestamp: new Date().toISOString()
      };

      console.log("Enviando feedback:", feedbackData);

      setSubmitted(true);
      toast({
        title: "Feedback enviado!",
        description: "Obrigado por nos ajudar a melhorar o conteúdo.",
      });

      // Reset form
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setComment("");
      }, 3000);

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <Card className="bg-green-900/20 border-green-500/50">
        <CardContent className="p-4 text-center">
          <div className="text-green-400 mb-2">
            ✓ Feedback recebido!
          </div>
          <p className="text-sm text-slate-400">
            Obrigado por nos ajudar a melhorar a experiência de onboarding.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <MessageCircle size={20} />
          <span>Feedback & Suporte</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tipo de Feedback */}
        <div className="flex space-x-2">
          <Button
            variant={feedbackType === "rating" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedbackType("rating")}
            className="flex-1"
          >
            <Star size={16} className="mr-2" />
            Avaliar
          </Button>
          <Button
            variant={feedbackType === "comment" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedbackType("comment")}
            className="flex-1"
          >
            <MessageCircle size={16} className="mr-2" />
            Comentar
          </Button>
          <Button
            variant={feedbackType === "help" ? "default" : "outline"}
            size="sm"
            onClick={() => setFeedbackType("help")}
            className="flex-1"
          >
            <HelpCircle size={16} className="mr-2" />
            Ajuda
          </Button>
        </div>

        {/* Rating System */}
        {feedbackType === "rating" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              Como você avalia este {contentType === "module" ? "módulo" : "conteúdo"}?
            </p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-colors ${
                    rating >= star ? 'text-yellow-500' : 'text-slate-600'
                  }`}
                >
                  <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-400">
                {rating}/5 estrelas
              </Badge>
            )}
          </div>
        )}

        {/* Comment System */}
        {(feedbackType === "comment" || feedbackType === "help") && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              {feedbackType === "help" 
                ? "Descreva sua dúvida ou dificuldade:" 
                : "Deixe seu comentário:"}
            </p>
            <Textarea
              placeholder={feedbackType === "help" 
                ? "Ex: Não consegui entender a parte sobre..." 
                : "Compartilhe sua opinião sobre este conteúdo..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              rows={3}
            />
          </div>
        )}

        {/* Quick Actions for Help */}
        {feedbackType === "help" && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              💬 Chat com Suporte
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              📚 Ver FAQ
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              🎥 Assistir Tutorial
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              📞 Agendar Chamada
            </Button>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmitFeedback}
          disabled={
            (feedbackType === "rating" && rating === 0) ||
            ((feedbackType === "comment" || feedbackType === "help") && !comment.trim())
          }
          className="w-full"
        >
          <Send size={16} className="mr-2" />
          Enviar {feedbackType === "help" ? "Solicitação" : "Feedback"}
        </Button>
      </CardContent>
    </Card>
  );
}
