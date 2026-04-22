'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Medal, Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

type Mode = 'login' | 'register' | 'reset';

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { loginWithEmail, register, resetPassword, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearState = () => {
    setError('');
    setSuccessMsg('');
  };

  const switchMode = (m: Mode) => {
    clearState();
    setMode(m);
  };

  const friendlyError = (code: string): string => {
    const map: Record<string, string> = {
      'auth/user-not-found': 'E-mail não cadastrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
      'auth/invalid-email': 'E-mail inválido.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
      'auth/popup-closed-by-user': 'Login cancelado.',
    };
    return map[code] || 'Ocorreu um erro. Tente novamente.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();

    if (mode === 'register') {
      if (!name.trim()) { setError('Informe seu nome.'); return; }
      if (password !== confirmPassword) { setError('As senhas não coincidem.'); return; }
      if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return; }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        router.push('/dashboard');
      } else if (mode === 'register') {
        await register(email, password, name.trim());
        router.push('/dashboard');
      } else if (mode === 'reset') {
        await resetPassword(email);
        setSuccessMsg('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      setError(friendlyError(err?.code || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    clearState();
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(friendlyError(err?.code || ''));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-3">
            <Medal className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard Olímpico</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe seu desempenho acadêmico</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/60 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Tabs (only for login/register) */}
          {mode !== 'reset' && (
            <div className="flex border-b border-gray-800/60">
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                    mode === m
                      ? 'text-white border-b-2 border-violet-500 bg-violet-500/5'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {m === 'login' ? 'Entrar' : 'Criar conta'}
                </button>
              ))}
            </div>
          )}

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Reset password header */}
                {mode === 'reset' && (
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-white">Recuperar senha</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Informe seu e-mail e enviaremos um link de recuperação.
                    </p>
                  </div>
                )}

                {/* Feedback messages */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}
                {successMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-300">{successMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field (register only) */}
                  {mode === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Nome completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome"
                          autoComplete="name"
                          className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        required
                        className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  {mode !== 'reset' && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-gray-300">Senha</label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => switchMode('reset')}
                            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            Esqueci a senha
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                          required
                          className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirm password (register only) */}
                  {mode === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Confirmar senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repita a senha"
                          autoComplete="new-password"
                          required
                          className="w-full bg-gray-800/60 border border-gray-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full mt-2"
                  >
                    {mode === 'login' && (<><ArrowRight className="w-4 h-4" /> Entrar</>)}
                    {mode === 'register' && (<><ArrowRight className="w-4 h-4" /> Criar conta</>)}
                    {mode === 'reset' && 'Enviar e-mail de recuperação'}
                  </Button>
                </form>

                {/* Back to login (reset mode) */}
                {mode === 'reset' && (
                  <button
                    onClick={() => switchMode('login')}
                    className="w-full mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    ← Voltar para o login
                  </button>
                )}

                {/* Divider + Google (login/register only) */}
                {mode !== 'reset' && (
                  <>
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-gray-800" />
                      <span className="text-xs text-gray-600">ou continue com</span>
                      <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    <button
                      onClick={handleGoogle}
                      disabled={googleLoading}
                      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-700/60 bg-gray-800/40 hover:bg-gray-800/70 text-sm text-gray-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {googleLoading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <GoogleIcon />
                      )}
                      Entrar com Google
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-600 mt-5">
          Seus dados ficam salvos com segurança no Firebase
        </p>
      </div>
    </div>
  );
}
