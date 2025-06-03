
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Award, Share2, Download, Facebook, Linkedin, MessageCircle, Twitter, Instagram } from "lucide-react";

interface CertificateGeneratorProps {
  onClose?: () => void;
}

interface Certificate {
  id: number;
  certificate_id: string;
  user_name: string;
  course_name: string;
  completion_date: string;
  certificate_url: string;
}

export default function CertificateGenerator({ onClose }: CertificateGeneratorProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateCertificate = async () => {
    if (!user?.userId || !user?.name) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          userName: user.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCertificate(data.certificate);
        toast({
          title: "Certificado Gerado!",
          description: "Seu certificado foi gerado com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao gerar certificado",
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
      setIsGenerating(false);
    }
  };

  const downloadCertificate = () => {
    if (certificate) {
      window.open(certificate.certificate_url, '_blank');
    }
  };

  const shareOnLinkedIn = () => {
    if (!certificate) return;
    const url = `${window.location.origin}${certificate.certificate_url}`;
    const text = `Concluí com sucesso o ${certificate.course_name} na DWU IT Solutions! 🎓`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, '_blank');
  };

  const shareOnWhatsApp = () => {
    if (!certificate) return;
    const url = `${window.location.origin}${certificate.certificate_url}`;
    const text = `🎓 Concluí com sucesso o ${certificate.course_name} na DWU IT Solutions!\n\nVeja meu certificado: ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnFacebook = () => {
    if (!certificate) return;
    const url = `${window.location.origin}${certificate.certificate_url}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareOnTwitter = () => {
    if (!certificate) return;
    const url = `${window.location.origin}${certificate.certificate_url}`;
    const text = `🎓 Concluí com sucesso o ${certificate.course_name} na @DWUITSolutions!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnInstagram = () => {
    toast({
      title: "Instagram",
      description: "Copie o link do certificado e compartilhe em seu story do Instagram!",
    });
    
    if (certificate) {
      const url = `${window.location.origin}${certificate.certificate_url}`;
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/90 backdrop-blur-sm border-slate-700 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
            <Award className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {certificate ? "Certificado Gerado!" : "Gerar Certificado"}
          </CardTitle>
          <p className="text-slate-400">
            {certificate 
              ? "Parabéns! Seu certificado foi gerado com sucesso."
              : "Parabéns por concluir o programa de onboarding!"
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!certificate ? (
            <div className="text-center space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Programa de Onboarding DWU IT Solutions
                </h3>
                <p className="text-slate-300 mb-4">
                  Você completou todos os módulos do programa de capacitação!
                </p>
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Award size={20} />
                  <span className="font-medium">Certificação Completa</span>
                </div>
              </div>

              <Button
                onClick={generateCertificate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3"
              >
                {isGenerating ? "Gerando Certificado..." : "Gerar Meu Certificado"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {certificate.course_name}
                </h3>
                <p className="text-slate-300 mb-2">
                  Certificado para: <span className="text-white font-medium">{certificate.user_name}</span>
                </p>
                <p className="text-slate-400 text-sm">
                  Concluído em: {new Date(certificate.completion_date).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  ID: {certificate.certificate_id}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={downloadCertificate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Visualizar/Baixar Certificado
                </Button>

                <div className="border-t border-slate-600 pt-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Share2 size={18} />
                    Compartilhar nas Redes Sociais
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={shareOnLinkedIn}
                      variant="outline"
                      className="bg-blue-700 border-blue-600 text-white hover:bg-blue-800 flex items-center gap-2"
                    >
                      <Linkedin size={16} />
                      LinkedIn
                    </Button>

                    <Button
                      onClick={shareOnWhatsApp}
                      variant="outline"
                      className="bg-green-600 border-green-500 text-white hover:bg-green-700 flex items-center gap-2"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </Button>

                    <Button
                      onClick={shareOnFacebook}
                      variant="outline"
                      className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Facebook size={16} />
                      Facebook
                    </Button>

                    <Button
                      onClick={shareOnTwitter}
                      variant="outline"
                      className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Twitter size={16} />
                      X (Twitter)
                    </Button>

                    <Button
                      onClick={shareOnInstagram}
                      variant="outline"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 border-purple-500 text-white hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
                    >
                      <Instagram size={16} />
                      Instagram
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {onClose && (
            <div className="flex justify-center pt-4 border-t border-slate-600">
              <Button
                onClick={onClose}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                Voltar ao Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
