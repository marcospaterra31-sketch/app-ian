import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Baby, 
  Stethoscope, 
  School, 
  Calendar, 
  FileText, 
  Target, 
  MessageSquare, 
  Shield, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Link as LinkIcon, 
  UserCheck, 
  Search,
  ExternalLink,
  Code,
  Sparkles,
  Lock,
  Layers,
  Terminal,
  KeyRound,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Role, SystemUser, Professional, ChildInfo } from '../types';
import { IAN_OFFICIAL_PHOTO } from '../data/initialData';
import ianPhoto from '../assets/images/ian_sorrindo_real_1787837860779.jpg';

export const AdminPage: React.FC = () => {
  const { 
    users, 
    child, 
    professionals, 
    sessions, 
    goals, 
    documents, 
    agenda, 
    observations, 
    logs, 
    addUser, 
    updateUserStatus, 
    deleteUser, 
    updateChild, 
    showToast,
    currentUserEmail,
    currentUserId,
    customClaims,
    isAdmin,
    refreshAuthClaims
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'child' | 'links' | 'security' | 'integration'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRefreshingClaims, setIsRefreshingClaims] = useState(false);

  // New User Form Modal/State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<Role>('therapist');
  const [userRoleTitle, setUserRoleTitle] = useState('Terapeuta');
  const [userPhone, setUserPhone] = useState('');

  // Edit Child Form State
  const [childName, setChildName] = useState(child.name);
  const [childBirth, setChildBirth] = useState(child.birthDateFull);
  const [childDiagnosis, setChildDiagnosis] = useState(child.diagnosis);
  const [childParents, setChildParents] = useState(child.parents);
  const [childEmergency, setChildEmergency] = useState(child.emergencyContact);
  const [childSchool, setChildSchool] = useState(child.schoolName || 'Escola Pequeno Passo');
  const [childNotes, setChildNotes] = useState(child.notes || 'Intervenção precoce modelo Denver e ABA.');
  const [childPhoto, setChildPhoto] = useState(child.photoUrl || '');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      showToast('Preencha os campos obrigatórios.', 'warning');
      return;
    }

    const emojiMap: Record<Role, string> = {
      parent: '👨‍👩‍👦',
      therapist: '🩺',
      school: '🏫',
      admin: '⚙️'
    };

    addUser({
      name: userName.trim(),
      email: userEmail.trim().toLowerCase(),
      role: userRole,
      roleTitle: userRoleTitle,
      phone: userPhone.trim(),
      permissions: userRole === 'admin' ? 'Acesso total irrestrito' : `Permissão específica (${userRoleTitle})`,
      status: 'Ativo',
      lastAccess: 'Nunca acessou',
      avatarEmoji: emojiMap[userRole]
    });

    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setShowAddUserModal(false);
  };

  const handleSaveChild = (e: React.FormEvent) => {
    e.preventDefault();
    updateChild({
      name: childName,
      birthDateFull: childBirth,
      diagnosis: childDiagnosis,
      parents: childParents,
      emergencyContact: childEmergency,
      schoolName: childSchool,
      notes: childNotes,
      photoUrl: childPhoto.trim() || undefined
    });
  };

  const handleChildPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setChildPhoto(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#154578]">
              Painel de Administração do Sistema
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Gestão centralizada de usuários, cadastros, vínculos e segurança do <strong>Mundo Azul</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-900/10 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Usuário</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Visão Geral & Métricas', icon: Layers },
          { id: 'users', label: `Usuários (${users.length})`, icon: Users },
          { id: 'child', label: 'Cadastro da Criança', icon: Baby },
          { id: 'links', label: 'Vínculos & Permissões', icon: LinkIcon },
          { id: 'security', label: 'Segurança & Firestore Rules', icon: Shield },
          { id: 'integration', label: 'Integração WordPress / Site', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1E5FA6] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1">Crianças</span>
              <span className="text-2xl font-bold text-[#154578]">1</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">● Ativa (Ian)</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1">Usuários</span>
              <span className="text-2xl font-bold text-[#154578]">{users.length}</span>
              <span className="text-[10px] text-blue-600 font-bold block mt-1">Multi-perfil</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1">Profissionais</span>
              <span className="text-2xl font-bold text-emerald-950">{professionals.length}</span>
              <span className="text-[10px] text-gray-500 font-medium block mt-1">Especialistas</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1">Atendimentos</span>
              <span className="text-2xl font-bold text-amber-950">{sessions.length}</span>
              <span className="text-[10px] text-gray-500 font-medium block mt-1">Sessões salvas</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1">Metas</span>
              <span className="text-2xl font-bold text-purple-950">{goals.length}</span>
              <span className="text-[10px] text-purple-600 font-bold block mt-1">Em evolução</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-xs font-bold text-gray-400 block mb-1">Documentos</span>
              <span className="text-2xl font-bold text-pink-950">{documents.length}</span>
              <span className="text-[10px] text-pink-600 font-bold block mt-1">PEI & Laudos</span>
            </div>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-blue-100 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-base text-[#154578] flex items-center gap-2">
                <span>Últimos Atendimentos Registrados</span>
                <span className="text-xs bg-blue-50 text-[#1E5FA6] px-2 py-0.5 rounded-full font-bold">
                  {sessions.length}
                </span>
              </h3>
              <div className="space-y-2.5">
                {sessions.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-gray-900">{s.professionalName} ({s.role})</div>
                      <div className="text-gray-500 line-clamp-1 mt-0.5">{s.activities}</div>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-400 shrink-0">{s.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-blue-100 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-base text-[#154578] flex items-center gap-2">
                <span>Logs de Auditoria e Segurança</span>
                <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Firestore Rules Ativas
                </span>
              </h3>
              <div className="space-y-2.5 text-xs">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 bg-[#F4FAFF] rounded-2xl border border-blue-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-gray-800">{log.action}</div>
                      <div className="text-gray-500 text-[11px]">Usuário: {log.user}</div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-blue-100 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#154578]">
                Gerenciamento de Usuários do Sistema
              </h2>
              <p className="text-xs text-gray-500">
                Cadastre e gerencie acessos para Pais, Terapeutas, Professores e Administradores.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 hover:border-blue-300 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {u.avatarEmoji}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <span>{u.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          u.role === 'parent' ? 'bg-pink-100 text-pink-800' :
                          u.role === 'therapist' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {u.roleTitle}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                      {u.phone && <div className="text-[11px] text-gray-400">{u.phone}</div>}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    u.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {u.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <span className="text-gray-400 text-[11px]">
                    Último acesso: {u.lastAccess}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateUserStatus(u.id, u.status === 'Ativo' ? 'Pendente' : 'Ativo')}
                      className="text-xs font-semibold text-[#1E5FA6] hover:underline"
                    >
                      {u.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remover usuário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CADASTRO DA CRIANÇA */}
      {activeTab === 'child' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-blue-100 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#154578]">
                Prontuário e Cadastro da Criança
              </h2>
              <p className="text-xs text-gray-500">
                Estrutura de dados persistente no Firestore em <code>children/ian-01</code>.
              </p>
            </div>
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#1E5FA6] shadow-sm bg-white">
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
          </div>

          <form onSubmit={handleSaveChild} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Data de Nascimento</label>
                <input
                  type="text"
                  value={childBirth}
                  onChange={(e) => setChildBirth(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Responsáveis Legais</label>
                <input
                  type="text"
                  value={childParents}
                  onChange={(e) => setChildParents(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Diagnóstico / Nível de Suporte</label>
                <input
                  type="text"
                  value={childDiagnosis}
                  onChange={(e) => setChildDiagnosis(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Escola Matriculada</label>
                <input
                  type="text"
                  value={childSchool}
                  onChange={(e) => setChildSchool(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Telefone de Emergência</label>
                <input
                  type="text"
                  value={childEmergency}
                  onChange={(e) => setChildEmergency(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Observações Iniciais e Recomendações</label>
              <textarea
                rows={3}
                value={childNotes}
                onChange={(e) => setChildNotes(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#1E5FA6] resize-none"
              />
            </div>

            {/* Foto Oficial do Ian */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Foto do Perfil / Avatar do Ian
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1E5FA6] shadow-sm bg-white shrink-0">
                  <img
                    src={childPhoto || child.photoUrl || IAN_OFFICIAL_PHOTO || ianPhoto}
                    alt={child.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = ianPhoto;
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="URL da imagem (ex: /ian03.png ou https://.../ian03.png)"
                      value={childPhoto}
                      onChange={(e) => setChildPhoto(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                    />
                    <label className="px-3 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-[#1E5FA6] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-2xs">
                      <span>Enviar Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleChildPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Ao subir na Hostinger, você pode colocar <code>/ian03.png</code> ou o endereço completo da imagem.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Salvar Alterações no Firestore
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: VÍNCULOS */}
      {activeTab === 'links' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-blue-100 shadow-xs space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Vínculos entre Usuários e a Criança ({child.name})
            </h2>
            <p className="text-xs text-gray-500">
              Controle quem tem acesso aos dados, prontuário e relatórios do Ian.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100">
              <h3 className="font-bold text-xs text-pink-900 mb-2 flex items-center gap-2">
                <span>👨‍👩‍👦 Responsáveis Vinculados (Pais)</span>
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white px-3 py-1.5 rounded-xl border border-pink-200 font-bold text-gray-800">
                  Marcos (Pai & Super Admin) — Marcospaterra@ianpaterra.com
                </span>
                <span className="bg-white px-3 py-1.5 rounded-xl border border-pink-200 font-bold text-gray-800">
                  Alessandra (Mãe) — alessandra@mundoazul.com.br
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-xs text-[#154578] mb-2 flex items-center gap-2">
                <span>🩺 Terapeutas e Especialistas Autorizados</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {professionals.map((p) => (
                  <div key={p.id} className="bg-white p-2.5 rounded-xl border border-blue-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{p.name}</div>
                      <div className="text-[11px] text-gray-500">{p.role} — {p.clinic}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      Autorizado
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
              <h3 className="font-bold text-xs text-amber-900 mb-2 flex items-center gap-2">
                <span>🏫 Escola & Corpo Docente</span>
              </h3>
              <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-gray-900">Escola Pequeno Passo</div>
                  <div className="text-[11px] text-gray-500">Profª Mariana Costa • maternal II</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Autorizado (Visão Pedagógica)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEGURANÇA & CLAIMS */}
      {activeTab === 'security' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-blue-100 shadow-xs space-y-6">
          <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span>Segurança, Custom Claims & Controle de Acesso (RBAC)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Lógica de verificação de permissões da rota <code>/admin</code> e sincronização de Claims com o Firebase Authentication.
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsRefreshingClaims(true);
                try {
                  await refreshAuthClaims();
                } finally {
                  setIsRefreshingClaims(false);
                }
              }}
              disabled={isRefreshingClaims}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1E5FA6] rounded-xl text-xs font-bold transition-all shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingClaims ? 'animate-spin' : ''}`} />
              {isRefreshingClaims ? 'Revalidando...' : 'Revalidar Claims do Token'}
            </button>
          </div>

          {/* Diagnostic Box: Current User Claims */}
          <div className="bg-gradient-to-tr from-blue-50/80 to-sky-50/50 p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="font-bold text-[#154578] flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#1E5FA6]" /> Sessão e Token JWT Conectado
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {isAdmin ? '✓ Acesso Admin Autorizado' : 'Acesso Padrão'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white p-3 rounded-xl border border-blue-100/80">
                <div className="text-[10px] text-gray-400 font-bold uppercase">E-mail</div>
                <div className="font-bold text-gray-800 truncate" title={currentUserEmail || ''}>
                  {currentUserEmail || 'Modo Demo'}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-100/80">
                <div className="text-[10px] text-gray-400 font-bold uppercase">UID Firebase</div>
                <div className="font-mono text-[11px] text-gray-800 truncate" title={currentUserId || ''}>
                  {currentUserId || 'Não autenticado no Auth'}
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-100/80">
                <div className="text-[10px] text-gray-400 font-bold uppercase">Custom Claim Detectada</div>
                <div className="font-bold text-emerald-700">
                  {customClaims?.role ? `role: "${customClaims.role}"` : customClaims?.admin ? 'admin: true' : 'Via Documento / Root'}
                </div>
              </div>
            </div>
          </div>

          {/* Tutorial: Primeiro Cadastro de Administrador via Firebase Console */}
          <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#154578] text-sm sm:text-base flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#1E5FA6]" /> Guia: Como Realizar o Primeiro Cadastro de Admin no Firebase Console
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-[#154578] rounded-full">
                Passo a Passo
              </span>
            </div>

            <div className="space-y-3.5 text-gray-700 text-xs leading-relaxed">
              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#1E5FA6] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Acesse o Firebase Console & Crie o Usuário no Authentication</span>
                </div>
                <p className="text-gray-600 pl-6">
                  Acesse <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold inline-flex items-center gap-0.5">console.firebase.google.com <ExternalLink className="w-3 h-3" /></a> &rarr; Selecione o projeto <strong>ai-studio-meumundoazul-d288e013-8e2b-4070-ba6e-95fed15a38ae</strong> &rarr; Menu <strong>Authentication</strong> &rarr; Aba <strong>Users</strong> &rarr; Clique em <strong>"Add user"</strong> (Adicionar Usuário) e informe o e-mail e senha.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#1E5FA6] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Opção A (Imediata): Vincular o Perfil Admin no Firestore</span>
                </div>
                <p className="text-gray-600 pl-6">
                  No menu lateral, vá em <strong>Firestore Database</strong> &rarr; Coleção <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono">users</code> &rarr; Adicione um documento com o ID igual ao <strong>UID</strong> do usuário criado:
                </p>
                <div className="ml-6 bg-gray-900 text-emerald-300 p-3 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
                  <div>// Documento: /users/&#123;UID_DO_USUARIO&#125;</div>
                  <div>role: "admin"</div>
                  <div>email: "admin@mundoazul.com.br"</div>
                  <div>name: "Administrador Geral"</div>
                  <div>status: "Ativo"</div>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#1E5FA6] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Opção B (Custom Claims Nativas do Firebase Auth via Node.js / Admin SDK)</span>
                </div>
                <p className="text-gray-600 pl-6">
                  Para gravar a claim diretamente dentro do token JWT criptografado do Firebase Auth (<code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded font-mono">request.auth.token.role == 'admin'</code>), execute o seguinte script:
                </p>
                <div className="ml-6 relative">
                  <div className="bg-gray-900 text-gray-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                    <div className="text-gray-400">// Script Node.js com Firebase Admin SDK</div>
                    <div className="text-blue-300">const admin = require('firebase-admin');</div>
                    <div className="text-blue-300">admin.initializeApp();</div>
                    <div className="text-yellow-300 mt-1">const userUid = '{currentUserId || 'UID_DO_ADMINISTRADOR'}';</div>
                    <div className="text-emerald-300 mt-1">await admin.auth().setCustomUserClaims(userUid, &#123; role: 'admin' &#125;);</div>
                    <div className="text-gray-400 mt-1">console.log('✓ Custom Claim role:admin atribuída com sucesso!');</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const code = `const admin = require('firebase-admin');\nadmin.initializeApp();\nawait admin.auth().setCustomUserClaims('${currentUserId || 'UID_DO_ADMINISTRADOR'}', { role: 'admin' });\nconsole.log('Claim gravada!');`;
                      navigator.clipboard.writeText(code);
                      setCopiedCode(true);
                      showToast('Código copiado!', 'success');
                      setTimeout(() => setCopiedCode(false), 3000);
                    }}
                    className="absolute top-2.5 right-2.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                  >
                    {copiedCode ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-2">
              <h3 className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Regras de Segurança Firestore (Atualizadas e Publicadas):
              </h3>
              <ul className="space-y-1.5 text-emerald-900 list-disc list-inside">
                <li>Verificação de <code>request.auth.token.role == 'admin'</code></li>
                <li>Validação de <code>request.auth.token.admin == true</code></li>
                <li>Consulta de perfil seguro em <code>getUserData().role == 'admin'</code></li>
                <li>Isolamento de rotas com <code>&lt;AdminGuard /&gt;</code> e erro 403 amigável</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs space-y-2">
              <h3 className="font-bold text-[#154578] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#1E5FA6]" /> Proteção Ativa na Rota /admin:
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Qualquer tentativa de acesso direto à área administrativa por usuários sem a claim <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-red-600">role: admin</code> é interceptada imediatamente com tela de bloqueio e relatório de diagnóstico.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INTEGRAÇÃO WORDPRESS */}
      {activeTab === 'integration' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-blue-100 shadow-xs space-y-5">
          <div className="pb-4 border-b border-gray-100">
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Instruções de Integração com o Site WordPress
            </h2>
            <p className="text-xs text-gray-500">
              Como incorporar o <strong>Mundo Azul – Central de Acompanhamento</strong> ao <code>https://ianzinhopaterraoficial.com.br/</code>
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
              <h3 className="font-bold text-[#154578] text-sm">Opção 1: Subdomínio Dedicado (Recomendado)</h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Crie no DNS do domínio <code>ianzinhopaterraoficial.com.br</code> um registro CNAME:
                <br />
                <strong>acompanhamento.ianzinhopaterraoficial.com.br</strong> ou <strong>app.ianzinhopaterraoficial.com.br</strong>
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
              <h3 className="font-bold text-gray-900 text-sm">Opção 2: Página WordPress com Embed Responsivo (/area-restrita)</h3>
              <p className="text-gray-600 text-xs mb-2">
                No painel do WordPress, crie a página <code>/area-restrita</code> e cole o código HTML abaixo:
              </p>
              <div className="bg-gray-900 text-gray-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                {`<iframe 
  src="https://ais-pre-ovksadjptyxjvcehia3faz-777774569519.us-east1.run.app" 
  style="width: 100%; height: 90vh; border: none; border-radius: 16px;" 
  allow="camera; microphone"
></iframe>`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-blue-100 space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#154578]">
              Cadastrar Novo Usuário
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ex: Dra. Juliana Santos"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="usuario@mundoazul.com.br"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Perfil (Role) *</label>
                  <select
                    value={userRole}
                    onChange={(e) => {
                      const r = e.target.value as Role;
                      setUserRole(r);
                      if (r === 'parent') setUserRoleTitle('Pais / Família');
                      if (r === 'therapist') setUserRoleTitle('Terapeuta');
                      if (r === 'school') setUserRoleTitle('Escola');
                      if (r === 'admin') setUserRoleTitle('Administrador');
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                  >
                    <option value="parent">Pais / Família</option>
                    <option value="therapist">Terapeuta / Profissional</option>
                    <option value="school">Escola / Professor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cargo / Especialidade</label>
                  <input
                    type="text"
                    value={userRoleTitle}
                    onChange={(e) => setUserRoleTitle(e.target.value)}
                    placeholder="Ex: Fonoaudiologia"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
