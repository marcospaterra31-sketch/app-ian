import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, HeartPulse, School, Calendar, Star, MessageCircle, MoreHorizontal } from 'lucide-react';

export const BottomNav: React.FC<{ onOpenMore: () => void }> = ({ onOpenMore }) => {
  const { currentRole, currentPage, setCurrentPage } = useApp();

  const mobileTabs = {
    parent: [
      { id: 'dashboard', label: 'Início', icon: Home },
      { id: 'agenda', label: 'Agenda', icon: Calendar },
      { id: 'terapias', label: 'Terapias', icon: HeartPulse },
      { id: 'escola', label: 'Escola', icon: School },
      { id: 'conquistas', label: 'Conquistas', icon: Star },
    ],
    therapist: [
      { id: 'dashboard', label: 'Início', icon: Home },
      { id: 'terapias', label: 'Sessões', icon: HeartPulse },
      { id: 'agenda', label: 'Agenda', icon: Calendar },
      { id: 'mensagens', label: 'Mensagens', icon: MessageCircle },
    ],
    school: [
      { id: 'dashboard', label: 'Início', icon: Home },
      { id: 'escola', label: 'Escola', icon: School },
      { id: 'agenda', label: 'Agenda', icon: Calendar },
      { id: 'mensagens', label: 'Mensagens', icon: MessageCircle },
    ],
    admin: [
      { id: 'dashboard', label: 'Início', icon: Home },
      { id: 'admin', label: 'Admin', icon: HeartPulse },
      { id: 'documentos', label: 'Documentos', icon: Calendar },
      { id: 'mensagens', label: 'Mensagens', icon: MessageCircle },
    ]
  }[currentRole] || [];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100/80 px-2 py-2 flex items-center justify-around shadow-lg">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentPage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentPage(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              isActive ? 'text-[#1E5FA6] font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'}`} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMore}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-gray-400 hover:text-gray-600 transition-all"
      >
        <MoreHorizontal className="w-5 h-5 stroke-[1.8px]" />
        <span className="text-[10px] font-medium">Mais</span>
      </button>
    </nav>
  );
};
