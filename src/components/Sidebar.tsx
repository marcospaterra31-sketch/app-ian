import React from 'react';
import { useApp, getRoleLabel } from '../context/AppContext';
import { Role } from '../types';
import {
  Home,
  HeartPulse,
  School,
  Calendar,
  TrendingUp,
  Star,
  BookHeart,
  FileText,
  MessageCircle,
  Image,
  Shield,
  Settings,
  Baby,
  ChevronRight,
  Eye,
  Bell,
  Target
} from 'lucide-react';
import ianPhoto from '../assets/images/ian_sorrindo_real_1787837860779.jpg';
import { IAN_OFFICIAL_PHOTO } from '../data/initialData';

export const Sidebar: React.FC = () => {
  const { currentRole, currentPage, setCurrentPage, child, threads, notifications } = useApp();

  const unreadNotifs = notifications.filter(n => !n.read).length;

  // Navigation per role
  const navItems = {
    parent: [
      { id: 'dashboard', label: 'Início', icon: Home },
      { id: 'terapias', label: 'Terapias & Equipe', icon: HeartPulse },
      { id: 'agenda', label: 'Agenda & Atendimentos', icon: Calendar },
      { id: 'observacoes', label: 'Observações', icon: Eye },
      { id: 'evolucao', label: 'Evolução & Gráficos', icon: TrendingUp },
      { id: 'conquistas', label: 'Metas & Conquistas', icon: Target },
      { id: 'escola', label: 'Acompanhamento Escolar', icon: School },
      { id: 'diario', label: 'Diário Familiar', icon: BookHeart },
      { id: 'documentos', label: 'Documentos & PEI', icon: FileText },
      { id: 'mensagens', label: 'Mensagens', icon: MessageCircle, badgeCount: (threads[currentRole] || []).reduce((acc, t) => acc + t.unread, 0) },
      { id: 'midia', label: 'Memórias Fotográficas', icon: Image },
    ],
    therapist: [
      { id: 'dashboard', label: 'Início', icon: Home },
      { id: 'terapias', label: 'Meus Atendimentos', icon: HeartPulse },
      { id: 'agenda', label: 'Agenda de Sessões', icon: Calendar },
      { id: 'observacoes', label: 'Observações Clínicas', icon: Eye },
      { id: 'evolucao', label: 'Plano de Metas & PEI', icon: TrendingUp },
      { id: 'documentos', label: 'Documentos & Laudos', icon: FileText },
      { id: 'mensagens', label: 'Mensagens com a Família', icon: MessageCircle },
    ],
    school: [
      { id: 'dashboard', label: 'Início', icon: Home },
      { id: 'escola', label: 'Registro Pedagógico', icon: School },
      { id: 'agenda', label: 'Agenda Escolar', icon: Calendar },
      { id: 'observacoes', label: 'Observações Escolares', icon: Eye },
      { id: 'documentos', label: 'PEI & Relatórios', icon: FileText },
      { id: 'mensagens', label: 'Comunicação com Pais', icon: MessageCircle },
    ],
    admin: [
      { id: 'dashboard', label: 'Início', icon: Home },
      { id: 'admin', label: 'Painel Administrativo', icon: Shield },
      { id: 'terapias', label: 'Profissionais & Terapias', icon: HeartPulse },
      { id: 'escola', label: 'Escolas & Turmas', icon: School },
      { id: 'agenda', label: 'Agenda Geral', icon: Calendar },
      { id: 'observacoes', label: 'Todas as Observações', icon: Eye },
      { id: 'documentos', label: 'Central de Documentos', icon: FileText },
      { id: 'mensagens', label: 'Central de Mensagens', icon: MessageCircle },
    ]
  }[currentRole] || [];

  return (
    <aside className="w-64 bg-white border-r border-blue-50/80 p-5 flex flex-col justify-between shrink-0 shadow-sm overflow-y-auto">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E5FA6] via-[#2F80ED] to-[#6FD9C0] flex items-center justify-center text-xl text-white shadow-md shadow-blue-500/20">
            💙
          </div>
          <div>
            <div className="font-heading font-extrabold text-base text-[#154578] leading-tight">
              Mundo Azul
            </div>
            <div className="text-[11px] font-semibold text-[#1E5FA6]">
              Central de Acompanhamento
            </div>
          </div>
        </div>

        {/* Child Mini Card with photo */}
        <div 
          onClick={() => setCurrentPage('evolucao')}
          className="bg-gradient-to-r from-[#EAF5FC] to-[#F5FBFF] border border-blue-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-blue-200 transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-blue-200 shadow-xs shrink-0 bg-white">
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
            <div className="min-w-0">
              <div className="font-bold text-xs text-[#154578] flex items-center gap-1">
                <span className="truncate">{child.name}</span>
                <span className="text-[10px] font-normal px-1.5 py-0.2 bg-blue-100/70 text-[#1E5FA6] rounded-full shrink-0">
                  {child.age}
                </span>
              </div>
              <div className="text-[10px] text-gray-500 truncate">
                TEA Nível 1 • Suporte
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#1E5FA6] text-white shadow-md shadow-blue-900/10 font-bold'
                    : 'text-gray-600 hover:bg-[#EAF5FC] hover:text-[#1E5FA6]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-[#1E5FA6]' : 'bg-pink-500 text-white'}`}>
                    {item.badgeCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer */}
      <div className="pt-4 border-t border-gray-100 space-y-1">
        <button
          onClick={() => setCurrentPage('configuracoes')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-colors cursor-pointer ${
            currentPage === 'configuracoes'
              ? 'bg-gray-100 text-gray-900 font-bold'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Configurações & Perfil</span>
        </button>

        <div className="px-3 pt-2 text-[10px] text-gray-400 font-medium">
          Conectado como: <strong>{getRoleLabel(currentRole)}</strong>
        </div>
      </div>
    </aside>
  );
};
