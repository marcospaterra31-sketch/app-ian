import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  Shield, 
  ArrowRight, 
  Lock, 
  Mail, 
  User,
  Eye, 
  EyeOff, 
  Loader2, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserPlus,
  LogIn,
  Briefcase,
  Copy,
  Check,
  Globe,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Role } from '../types';
import { IAN_OFFICIAL_PHOTO } from '../data/initialData';
import ianPhoto from '../assets/images/ian_sorrindo_real_1787837860779.jpg';

export const LoginScreen: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, registerWithEmail, sendPasswordReset, child, loginAsDemoRole } = useApp();

  // Mode: 'login' | 'register' | 'reset'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('parent');
  const [roleTitle, setRoleTitle] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyHostname = () => {
    if (navigator?.clipboard && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 3000);
    }
  };

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email || !password) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    const res = await loginWithEmail(email, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Falha ao autenticar.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    const res = await registerWithEmail(
      name.trim(),
      email.trim(),
      password,
      selectedRole,
      roleTitle.trim() || undefined
    );
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Falha ao concluir o cadastro.');
    }
  };

  const handleGoogleAuth = async () => {
    resetFormState();
    setIsGoogleLoading(true);
    const res = await loginWithGoogle();
    setIsGoogleLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Não foi possível autenticar com a conta Google.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email) {
      setErrorMessage('Por favor, informe seu e-mail para receber as instruções de recuperação.');
      return;
    }

    setIsLoading(true);
    const res = await sendPasswordReset(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      setTimeout(() => setAuthMode('login'), 3500);
    } else {
      setErrorMessage(res.error || 'Erro ao solicitar redefinição.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 bg-gradient-to-b from-[#EBF5FC] via-[#F4FAFF] to-[#DCEFFB]">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2 px-1 text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-gray-700 font-semibold">Mundo Azul — Central de Acompanhamento do Ian</span>
        </div>
        <a 
          href="https://ianzinhopaterraoficial.com.br/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#1E5FA6] hover:underline flex items-center gap-1 font-semibold"
        >
          <span>ianzinhopaterraoficial.com.br</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Main Container */}
      <div className="my-auto flex items-center justify-center py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-3xl md:rounded-[36px] shadow-2xl p-6 sm:p-8 border border-blue-100/90"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto ring-4 ring-blue-100 bg-blue-50">
                <img 
                  src={child.photoUrl || IAN_OFFICIAL_PHOTO || ianPhoto} 
                  alt={child.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = ianPhoto;
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#1E5FA6] to-[#6FD9C0] text-white flex items-center justify-center text-xs shadow-md">
                💙
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#154578] tracking-tight">
              Mundo Azul
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xs mx-auto mt-1 leading-relaxed">
              Plataforma de Acompanhamento & Integração Multidisciplinar
            </p>
          </div>

          {/* Mode Switcher Tabs (Entrar / Cadastrar) */}
          {authMode !== 'reset' && (
            <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-5 border border-gray-200/60">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  resetFormState();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-[#1E5FA6] shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  resetFormState();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-[#1E5FA6] shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Cadastre-se</span>
              </button>
            </div>
          )}

          {/* Social Google Login Button */}
          {authMode !== 'reset' && (
            <div className="space-y-4 mb-4">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading || isLoading}
                className="w-full bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl border border-gray-200 shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#1E5FA6]" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>
                  {authMode === 'login' ? 'Entrar com Conta Google' : 'Cadastrar com Conta Google'}
                </span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider absolute">
                  ou com seu e-mail
                </span>
              </div>
            </div>
          )}

          {/* Feedback Alerts */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold space-y-2"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#1E5FA6]" />
                  <span>E-mail</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#1E5FA6] focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#1E5FA6]" />
                    <span>Senha</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('reset');
                      resetFormState();
                    }}
                    className="text-[11px] font-semibold text-[#1E5FA6] hover:underline cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#1E5FA6] focus:bg-white rounded-2xl px-4 py-2.5 pr-11 text-xs sm:text-sm text-gray-800 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#1E5FA6] hover:bg-[#154578] active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 rounded-2xl shadow-md shadow-blue-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. REGISTRATION FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1E5FA6]" />
                  <span>Nome Completo</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Dra. Letícia Onari ou Alessandra Paterra"
                  className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#1E5FA6] focus:bg-white rounded-2xl px-3.5 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#1E5FA6]" />
                  <span>E-mail</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#1E5FA6] focus:bg-white rounded-2xl px-3.5 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tipo de Perfil
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#1E5FA6] focus:bg-white rounded-2xl px-3 py-2 text-xs text-gray-800 focus:outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value="parent">👨‍👩‍👦 Pais / Família</option>
                    <option value="therapist">🩺 Terapeuta</option>
                    <option value="school">🏫 Escola / Docente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#1E5FA6]" />
                    <span>Especialidade (Op.)</span>
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="Ex: Fono, TO, Mãe"
                    className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#1E5FA6] focus:bg-white rounded-2xl px-3 py-2 text-xs text-gray-800 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#1E5FA6]" />
                  <span>Criar Senha (mínimo 6 caracteres)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50/80 border border-gray-200 focus:border-[#1E5FA6] focus:bg-white rounded-2xl px-3.5 py-2 pr-10 text-xs sm:text-sm text-gray-800 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Criando Conta...</span>
                  </>
                ) : (
                  <>
                    <span>Concluir Cadastro</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. RESET PASSWORD FORM */}
          {authMode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-blue-50/80 border border-blue-100 p-3.5 rounded-2xl text-xs text-[#154578] leading-relaxed">
                Informe o seu e-mail cadastrado. Enviaremos um link direto para você redefinir sua senha com segurança.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#1E5FA6]" />
                  <span>E-mail cadastrado</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#1E5FA6] focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    resetFormState();
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-2xl transition-all cursor-pointer"
                >
                  Voltar ao Login
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs py-2.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar link'}
                </button>
              </div>
            </form>
          )}

          {/* Footer RBAC Note */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ambiente Seguro com Google Firebase Authentication & RBAC</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Page Footer */}
      <footer className="text-center py-3 text-xs text-gray-400">
        Mundo Azul – Central de Acompanhamento © {new Date().getFullYear()} • Integrado a ianzinhopaterraoficial.com.br
      </footer>
    </div>
  );
};
