import React, { useState } from 'react';
import { useApp, getRoleLabel } from '../context/AppContext';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  RefreshCw, 
  KeyRound, 
  CheckCircle, 
  Copy, 
  HelpCircle, 
  Terminal,
  ExternalLink
} from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { 
    currentRole, 
    isAdmin, 
    currentUserEmail, 
    currentUserId, 
    customClaims, 
    refreshAuthClaims, 
    setCurrentPage, 
    showToast 
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConsoleGuide, setShowConsoleGuide] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // If user has admin permission (by Auth custom claim 'role: admin', Firestore role, or root email)
  if (isAdmin || currentRole === 'admin') {
    return <>{children}</>;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAuthClaims();
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyUidToClipboard = () => {
    if (currentUserId) {
      navigator.clipboard.writeText(currentUserId);
      setCopiedUid(true);
      showToast('UID copiado para a área de transferência!', 'success');
      setTimeout(() => setCopiedUid(false), 3000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-9 max-w-2xl w-full border border-red-100 shadow-xl space-y-6">
        
        {/* Header with Security Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-red-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200">
            <Lock className="w-3.5 h-3.5" /> Erro 403 • Acesso Restrito ao Painel Administrativo
          </div>

          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#154578]">
            Permissão Administrativa Necessária
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            Esta página contém dados sensíveis, cadastros clínicos e configurações estruturais do <strong>Mundo Azul</strong>. O acesso é liberado exclusivamente para contas com a permissão <code className="bg-red-50 text-red-600 font-mono px-1.5 py-0.5 rounded text-xs font-bold">role: admin</code>.
          </p>
        </div>

        {/* Current Auth Diagnostic Box */}
        <div className="bg-gray-50/80 rounded-2xl p-4 sm:p-5 border border-gray-200/80 space-y-3 text-xs">
          <div className="font-bold text-gray-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#1E5FA6]" /> Diagnóstico da Sessão Conectada:
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
              Sem Privilégios Admin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
              <div className="text-[10px] text-gray-500 font-semibold">E-mail Conectado:</div>
              <div className="font-bold text-gray-800 truncate" title={currentUserEmail || 'Não informado'}>
                {currentUserEmail || 'Modo Demonstração'}
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
              <div className="text-[10px] text-gray-500 font-semibold">Perfil Atual:</div>
              <div className="font-bold text-gray-800">
                {getRoleLabel(currentRole)}
              </div>
            </div>
          </div>

          {currentUserId && (
            <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
              <div className="truncate">
                <div className="text-[10px] text-gray-500 font-semibold">User UID no Firebase:</div>
                <code className="text-[11px] font-mono text-gray-700">{currentUserId}</code>
              </div>
              <button
                type="button"
                onClick={copyUidToClipboard}
                className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
              >
                {copiedUid ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedUid ? 'Copiado!' : 'Copiar UID'}
              </button>
            </div>
          )}

          <div className="bg-white p-2.5 rounded-xl border border-gray-200">
            <div className="text-[10px] text-gray-500 font-semibold">Token Custom Claims:</div>
            <pre className="text-[11px] font-mono text-gray-600 bg-gray-50 p-1.5 rounded mt-1 overflow-x-auto">
              {customClaims ? JSON.stringify(customClaims, null, 2) : 'Nenhuma claim administrativa detectada no token JWT'}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentPage('dashboard')}
            className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Início (Dashboard)
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:flex-1 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Revalidando Token...' : 'Verificar Novamente Permissões'}
          </button>
        </div>

        {/* Toggleable Console Instructions Guide */}
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowConsoleGuide(!showConsoleGuide)}
            className="w-full text-left font-bold text-xs text-[#1E5FA6] hover:text-[#154578] flex items-center justify-between p-2 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Como liberar este acesso via Firebase Console?
            </span>
            <span className="text-xs">{showConsoleGuide ? 'Ocultar Guia ▲' : 'Ver Passo a Passo ▼'}</span>
          </button>

          {showConsoleGuide && (
            <div className="mt-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs space-y-3 text-gray-700 animate-in fade-in duration-200">
              <div className="font-bold text-[#154578] flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> Passo a Passo para Atribuir a Role Admin no Firebase:
              </div>

              <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                <li>
                  Acesse o <strong>Firebase Console</strong> do projeto <code className="bg-white px-1.5 py-0.5 rounded border font-mono text-[11px]">ai-studio-meumundoazul-d288e013-8e2b-4070-ba6e-95fed15a38ae</code>.
                </li>
                <li>
                  Vá em <strong>Firestore Database</strong> &rarr; Coleção <code className="bg-white px-1.5 py-0.5 rounded border font-mono text-[11px]">users</code>.
                </li>
                <li>
                  Adicione ou edite o documento cujo ID é o seu UID copiado acima:
                  <div className="bg-gray-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[11px] mt-1.5">
                    <div>role: "admin"</div>
                    <div>email: "{currentUserEmail || 'seu-email@...'}"</div>
                    <div>status: "Ativo"</div>
                  </div>
                </li>
                <li>
                  Para <strong>Custom Claims Nativas do Firebase Auth</strong> (via Node.js / Admin SDK), execute:
                  <div className="bg-gray-900 text-blue-300 p-2.5 rounded-xl font-mono text-[11px] mt-1.5">
                    <div>admin.auth().setCustomUserClaims('{currentUserId || 'UID_DO_USUARIO'}', &#123; role: 'admin' &#125;);</div>
                  </div>
                </li>
                <li>
                  Após salvar, clique no botão <strong>"Verificar Novamente Permissões"</strong> acima.
                </li>
              </ol>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
