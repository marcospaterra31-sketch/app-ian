import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Smile, Sparkles, Heart, Send, History, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, Moon, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const EMOTION_OPTIONS = [
  {
    id: 'alegre',
    label: 'Alegre 😄',
    name: 'Alegre',
    emoji: '😄',
    description: 'Radiante e interativo',
    bgActive: 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/40',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'calmo',
    label: 'Calmo 🙂',
    name: 'Calmo',
    emoji: '🙂',
    description: 'Regulado e concentrado',
    bgActive: 'bg-blue-50 border-[#1E5FA6] text-[#154578] ring-2 ring-[#1E5FA6]/40',
    badgeColor: 'bg-blue-100 text-[#1E5FA6]'
  },
  {
    id: 'conquistador',
    label: 'Conquistador 🌟',
    name: 'Conquistador',
    emoji: '🌟',
    description: 'Empolgado e vitorioso',
    bgActive: 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400/40',
    badgeColor: 'bg-amber-100 text-amber-900'
  },
  {
    id: 'aconchegado',
    label: 'Aconchegado 🧸',
    name: 'Aconchegado',
    emoji: '🧸',
    description: 'Carinhoso e relaxado',
    bgActive: 'bg-pink-50 border-pink-400 text-pink-950 ring-2 ring-pink-400/40',
    badgeColor: 'bg-pink-100 text-pink-900'
  },
  {
    id: 'agitado',
    label: 'Agitado ⚡',
    name: 'Agitado',
    emoji: '⚡',
    description: 'Inquieto ou hiperativo',
    bgActive: 'bg-orange-50 border-orange-400 text-orange-950 ring-2 ring-orange-400/40',
    badgeColor: 'bg-orange-100 text-orange-900'
  },
  {
    id: 'sensivel',
    label: 'Sensível 😣',
    name: 'Sensível',
    emoji: '😣',
    description: 'Sobrecarga sensorial',
    bgActive: 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/40',
    badgeColor: 'bg-rose-100 text-rose-900'
  },
  {
    id: 'cansado',
    label: 'Cansado 😴',
    name: 'Cansado',
    emoji: '😴',
    description: 'Com sono ou fadigado',
    bgActive: 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-2 ring-indigo-400/40',
    badgeColor: 'bg-indigo-100 text-indigo-900'
  },
  {
    id: 'choroso',
    label: 'Choroso 🥺',
    name: 'Choroso',
    emoji: '🥺',
    description: 'Precisando de colo e apoio',
    bgActive: 'bg-purple-50 border-purple-400 text-purple-950 ring-2 ring-purple-400/40',
    badgeColor: 'bg-purple-100 text-purple-900'
  }
];

const QUICK_TAGS = [
  '🏫 Pós-escola',
  '🩺 Pós-terapia',
  '🍽️ Refeição',
  '🌳 Parquinho',
  '🎧 Usando fones',
  '🌙 Antes de dormir',
  '🧩 Brincando de blocos'
];

export const MoodTrackerWidget: React.FC = () => {
  const { diary, addDiaryRecord, setCurrentPage, showToast, child } = useApp();

  const [selectedEmotion, setSelectedEmotion] = useState<string>(EMOTION_OPTIONS[0].label);
  const [notes, setNotes] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sono, setSono] = useState<'Ótimo' | 'Bom' | 'Regular' | 'Agitado'>('Bom');
  const [alimentacao, setAlimentacao] = useState<'Ótima' | 'Boa' | 'Regular' | 'Pouco apetite'>('Boa');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeOption = EMOTION_OPTIONS.find(o => o.label === selectedEmotion) || EMOTION_OPTIONS[0];

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag('');
    } else {
      setSelectedTag(tag);
      if (!notes.includes(tag)) {
        setNotes(prev => prev ? `${tag} — ${prev}` : `${tag} — `);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const fullNotes = notes.trim()
      ? notes.trim()
      : `Registro rápido de humor: ${activeOption.name} (${activeOption.description.toLowerCase()}).`;

    addDiaryRecord({
      date: formattedDate,
      humor: selectedEmotion,
      sono,
      alimentacao,
      atividades: selectedTag ? `Contexto: ${selectedTag}` : 'Rotina diária e momentos em família.',
      conquista: activeOption.id === 'conquistador' || activeOption.id === 'alegre'
        ? 'Excelente regulação emocional e engajamento.'
        : 'Acolhimento e suporte emocional proporcionado.',
      obs: fullNotes,
      photosCount: 0
    });

    setNotes('');
    setSelectedTag('');
    setIsSubmitting(false);
  };

  // Calculate mood distribution pattern across recent diary records
  const recentEntries = diary.slice(0, 5);
  
  const moodCounts = diary.reduce<Record<string, number>>((acc, item) => {
    const key = item.humor.split(' ')[0] || item.humor;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totalEntries = diary.length || 1;
  const positiveCount = diary.filter(d => 
    d.humor.includes('Alegre') || d.humor.includes('Calmo') || d.humor.includes('Conquistador') || d.humor.includes('Aconchegado')
  ).length;
  const positivePercentage = Math.round((positiveCount / totalEntries) * 100);

  return (
    <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600 flex items-center justify-center text-xl shadow-xs">
            ✨
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
              <span>Registro Rápido de Humor & Emoções</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                Diário do Ian
              </span>
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Acompanhe os padrões emocionais, gatilhos e regulação do {child.name} ao longo dos dias.
            </p>
          </div>
        </div>

        {/* Emotion Trend Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#F0FAF7] border border-emerald-200/60 rounded-2xl px-3 py-1.5 text-xs text-emerald-900 font-bold">
          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{positivePercentage}% Regulado & Positivo</span>
        </div>
      </div>

      {/* Quick Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Emoji-based emotions selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Como o {child.name} está se sentindo neste momento?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {EMOTION_OPTIONS.map((opt) => {
              const isSelected = selectedEmotion === opt.label;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedEmotion(opt.label)}
                  className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? opt.bgActive + ' shadow-xs scale-[1.02]'
                      : 'bg-gray-50/80 hover:bg-white hover:border-gray-300 border-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl shrink-0 drop-shadow-xs transition-transform group-hover:scale-110">
                    {opt.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold truncate">
                      {opt.name}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {opt.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick context tags */}
        <div>
          <div className="text-[11px] font-bold text-gray-500 mb-1.5">
            Contexto ou Atividade (opcional):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                  selectedTag === tag
                    ? 'bg-[#1E5FA6] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes input field */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700">
            Observações do momento (o que provocou, reação ou regulação)
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Ex: Ficou muito contente no parque com o balanço; pediu água apontando e se manteve regulado...`}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Expandable Advanced Options (Sono & Alimentação) */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-bold text-[#1E5FA6] hover:underline flex items-center gap-1"
          >
            {showAdvanced ? '− Ocultar sono e alimentação' : '+ Adicionar detalhes de sono e alimentação'}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 overflow-hidden"
              >
                <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-[#1E5FA6]" /> Qualidade do Sono
                  </label>
                  <select
                    value={sono}
                    onChange={(e: any) => setSono(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold text-gray-800"
                  >
                    <option value="Ótimo">Ótimo 🌙 (Noite tranquila)</option>
                    <option value="Bom">Bom 😊 (Acordou 1x rápido)</option>
                    <option value="Regular">Regular 🥱 (Dificuldade p/ dormir)</option>
                    <option value="Agitado">Agitado ⚡ (Inquieto)</option>
                  </select>
                </div>

                <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                  <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-amber-600" /> Alimentação
                  </label>
                  <select
                    value={alimentacao}
                    onChange={(e: any) => setAlimentacao(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold text-gray-800"
                  >
                    <option value="Ótima">Ótima 🍎 (Comeu muito bem)</option>
                    <option value="Boa">Boa 🥣 (Aceitou as refeições)</option>
                    <option value="Regular">Regular 🥪 (Seletivo)</option>
                    <option value="Pouco apetite">Pouco apetite 🧃</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-gray-400 font-medium">
            Salvo automaticamente no histórico do Diário do Ian
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-900/10 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Salvar Humor no Diário</span>
          </button>
        </div>
      </form>

      {/* Pattern Tracking Strip: Recent Mood Logs Over Time */}
      <div className="pt-2 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[#1E5FA6]" />
            <span>Padrão Emocional Recente ({diary.length} registros no diário)</span>
          </h3>

          <button
            onClick={() => setCurrentPage('diario')}
            className="text-xs font-bold text-[#1E5FA6] hover:underline flex items-center gap-0.5"
          >
            Ver diário completo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {recentEntries.slice(0, 3).map((entry) => (
            <div
              key={entry.id}
              className="bg-[#F8FBFE] border border-blue-100/70 p-3 rounded-2xl flex items-start gap-2.5 hover:bg-blue-50/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                {entry.humor.includes('😄') ? '😄' :
                 entry.humor.includes('🙂') ? '🙂' :
                 entry.humor.includes('🌟') ? '🌟' :
                 entry.humor.includes('🧸') ? '🧸' :
                 entry.humor.includes('⚡') ? '⚡' :
                 entry.humor.includes('😣') ? '😣' :
                 entry.humor.includes('😴') ? '😴' :
                 entry.humor.includes('🥺') ? '🥺' :
                 entry.humor.includes('😅') ? '😅' : '💙'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-gray-900 truncate">
                    {entry.humor}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {entry.date.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
                  {entry.obs || entry.atividades}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
