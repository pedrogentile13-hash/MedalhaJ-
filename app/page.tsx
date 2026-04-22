'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Medal, Zap, Trophy, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const FEATURES = [
  { icon: Trophy, label: 'Sistema de Medalhas', desc: 'Ouro, Prata, Bronze e Honra ao Mérito calculados automaticamente' },
  { icon: BarChart3, label: 'Gráficos Avançados', desc: 'Evolução, comparação e radar de desempenho' },
  { icon: Zap, label: 'Gamificação', desc: 'XP, níveis e conquistas para manter a motivação' },
  { icon: Medal, label: 'Previsão IA', desc: 'Estimativa de desempenho futuro com análise de tendências' },
];

export default function LandingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const goToDashboard = () => router.push('/dashboard');

  const handleLogin = async () => {
    await login();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 bg-grid flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Medal className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Dashboard Olímpico
          </span>
          <span className="text-white block text-3xl sm:text-4xl mt-1">2026</span>
        </h1>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Treine como um atleta. Conquiste como um campeão.
          <br />
          Acompanhe seu desempenho em olimpíadas acadêmicas.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Button variant="primary" size="lg" onClick={goToDashboard}>
            <Zap className="w-5 h-5" />
            Começar Agora
          </Button>
          <Button variant="secondary" size="lg" onClick={handleLogin}>
            Entrar com Google
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 text-left">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-4 hover:border-violet-500/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{label}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
