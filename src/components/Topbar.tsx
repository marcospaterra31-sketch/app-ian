import React, { useState } from 'react';
import { useApp, getRoleLabel } from '../context/AppContext';
import { Role } from '../types';
import { LogOut, Printer, Sparkles, ChevronDown, UserCheck, Shield, Heart } from 'lucide-react';

interface TopbarProps {
  onOpenExportModal: () => void;
  onOpenNewAchievementModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenExportModal, onOpenNewAchievementModal }) => {
  const { currentRole, switchRole, logout, child, isAdmin } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleOptions: { role: Role; label: string; emoji: string }[] = [
    { role: 'parent', label: 'Pais (Alessandra & Marcos)', emoji: '👨‍👩‍👦' },
    { role: 'therapist', label: 'Terapeutas (Fono, TO, Musicoterapia, Psicólogo)', emoji: '🩺' },
    { role: 'school', label: 'Escola (Escola Pequeno Passo)', emoji: '🏫' },
    { role: 'admin', label: 'Super Admin (Marcos Paterra)', emoji: '👑' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-blue-50/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left side: Brand + active profile switch */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💙</span>
          <span className="font-heading font-bold text-sm sm:text-base text-[#154578] hidden sm:inline">
            Meu Mundo Azul
          </span>
        </div>

        <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

        {/* Role Pill */}
        <div className="relative">
          {isAdmin ? (
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-[#EAF5FC] hover:bg-[#DCEFFB] text-[#154578] px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-blue-200/60 shadow-xs cursor-pointer"
              title="Super Admin: Alternar visualização"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Perfil: {getRoleLabel(currentRole)}</span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#F4F9FD] text-[#154578] px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Perfil: {getRoleLabel(currentRole)}</span>
            </div>
          )}

          {isAdmin && roleDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setRoleDropdownOpen(false)} 
              />
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-blue-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50">
                  Visualizar como (Super Admin):
                </div>
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => {
                      switchRole(opt.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 hover:bg-[#EAF5FC] transition-colors cursor-pointer ${
                      currentRole === opt.role ? 'bg-blue-50 text-[#1E5FA6] font-bold' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-base">{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenNewAchievementModal}
          className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-bold px-3.5 py-1.5 rounded-full text-xs shadow-sm hover:shadow transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-900" />
          <span>Celebrar Conquista</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold px-3 py-1.5 rounded-xl text-xs shadow-xs transition-colors"
          title="Exportar resumo de acompanhamento"
        >
          <Printer className="w-3.5 h-3.5 text-[#1E5FA6]" />
          <span className="hidden sm:inline">Relatório / Imprimir</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-1 text-gray-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
          title="Sair da plataforma"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};
