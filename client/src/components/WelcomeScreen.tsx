import { Button } from "@/components/ui/button";
import { Building, Calendar, Cog, Users, Play } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 fade-in">
        {/* Modern DWU Logo */}
        <div className="mb-8 scale-in">
          <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl tech-border relative group">
            <Building className="text-white transform group-hover:scale-110 transition-transform duration-300" size={80} />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-6 gradient-text slide-in-left">
          Bem-vindo à DWU
        </h1>
        <h2 className="text-3xl font-semibold text-slate-300 mb-6 slide-in-right">
          Onboarding Interativo - Suporte Técnico
        </h2>
        <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed fade-in">
          Embarque em uma jornada tecnológica de 5 dias que transformará você em um especialista em 
          <span className="text-blue-400 font-semibold"> CRM One</span>, 
          <span className="text-green-400 font-semibold"> SAP Business One</span> e nossas 
          <span className="text-purple-400 font-semibold"> metodologias avançadas de suporte</span>.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="glass-effect p-8 rounded-2xl tech-border group hover:scale-105 transition-all duration-300 slide-in-left">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
              <Calendar className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-blue-300">5 Dias Intensivos</h3>
            <p className="text-slate-400">Cronograma estruturado com conteúdo progressivo e prático</p>
          </div>
          
          <div className="glass-effect p-8 rounded-2xl tech-border group hover:scale-105 transition-all duration-300 scale-in delay-200">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
              <Cog className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-green-300">Stack Tecnológico</h3>
            <p className="text-slate-400">Domine as principais ferramentas do ecossistema DWU</p>
          </div>
          
          <div className="glass-effect p-8 rounded-2xl tech-border group hover:scale-105 transition-all duration-300 slide-in-right">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
              <Users className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-purple-300">Suporte de Elite</h3>
            <p className="text-slate-400">Metodologias N1, N2 e N3 para excelência no atendimento</p>
          </div>
        </div>
        
        <div className="fade-in delay-300">
          <Button 
            onClick={onStart}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white font-bold py-6 px-12 rounded-2xl text-xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl relative group overflow-hidden"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              <Play className="mr-3 group-hover:translate-x-1 transition-transform duration-300" size={24} />
              Iniciar Jornada
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
