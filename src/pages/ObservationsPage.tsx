import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ObservationRecord, 
  Role 
} from '../types';
import { 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Sparkles, 
  Calendar, 
  User, 
  Tag, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: ObservationRecord['category'][] = [
  'Comunicação',
  'Comportamento',
  'Interação social',
  'Autonomia',
  'Aprendizagem',
  'Alimentação',
  'Sono',
  'Escola',
  'Terapia',
  'Outros'
];

export const ObservationsPage: React.FC = () => {
  const { observations, addObservation, currentRole, child, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Observation Form State
  const [newCategory, setNewCategory] = useState<ObservationRecord['category']>('Comunicação');
  const [newText, setNewText] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const authorName = currentRole === 'parent' ? child.parents :
    currentRole === 'therapist' ? 'Dra. Letícia Onari (Fonoaudiologia)' :
    currentRole === 'school' ? 'Profª Mariana Costa (Escola Pequeno Passo)' : 'Administrador do Sistema';

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) {
      showToast('Digite a observação a ser registrada.', 'warning');
      return;
    }

    addObservation({
      childId: 'ian-01',
      authorId: currentRole,
      authorName,
      authorType: currentRole,
      category: newCategory,
      text: newText.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
      isPrivate
    });

    setNewText('');
    setShowAddModal(false);
  };

  const filteredObservations = observations.filter(obs => {
    const matchesCat = selectedCategory === 'Todas' || obs.category === selectedCategory;
    const matchesSearch = obs.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#154578]">
              Observações Multidisciplinares
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Registro compartilhado de comportamento, autonomia, comunicação e rotina do {child.name}.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-900/10 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Observação</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-3xl border border-blue-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar nas anotações..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#1E5FA6] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('Todas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'Todas'
                ? 'bg-[#1E5FA6] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas ({observations.length})
          </button>
          {CATEGORIES.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1E5FA6] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Observations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredObservations.map((obs) => (
          <div
            key={obs.id}
            className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs hover:border-blue-200 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1E5FA6] border border-blue-100/60">
                  🏷️ {obs.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {obs.date}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium mt-2">
                "{obs.text}"
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                  {obs.authorType === 'parent' ? '👨‍👩‍👦' : obs.authorType === 'therapist' ? '🩺' : obs.authorType === 'school' ? '🏫' : '⚙️'}
                </div>
                <span className="font-bold text-gray-700 truncate max-w-[200px]">
                  {obs.authorName}
                </span>
              </div>

              {obs.isPrivate && (
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" /> Privado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Observation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-blue-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-heading font-bold text-lg text-[#154578] flex items-center gap-2">
                <span>Nova Observação Multidisciplinar</span>
              </h3>
            </div>

            <form onSubmit={handleCreateObservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-gray-800 focus:bg-white focus:border-[#1E5FA6]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Texto da Observação (Contexto, Reação, Evolução) *
                </label>
                <textarea
                  rows={4}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Ex: Demonstrou excelente autorregulação após atividade motora..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-gray-800 focus:bg-white focus:border-[#1E5FA6] resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="privateCheck"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded border-gray-300 text-[#1E5FA6] focus:ring-[#1E5FA6]"
                />
                <label htmlFor="privateCheck" className="text-xs text-gray-600 font-medium">
                  Visível apenas para equipe clínica e administradores
                </label>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all"
                >
                  Registrar Observação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
