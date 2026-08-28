import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookHeart, Plus, Heart, Smile, Moon, Utensils, Sparkles, Image as ImageIcon } from 'lucide-react';

export const DiaryPage: React.FC = () => {
  const { diary, addDiaryRecord } = useApp();

  // Form State
  const [date, setDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [humor, setHumor] = useState('Alegre 😄');
  const [sono, setSono] = useState<'Ótimo' | 'Bom' | 'Regular' | 'Agitado'>('Bom');
  const [alimentacao, setAlimentacao] = useState<'Ótima' | 'Boa' | 'Regular' | 'Pouco apetite'>('Boa');
  const [atividades, setAtividades] = useState('');
  const [conquista, setConquista] = useState('');
  const [obs, setObs] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obs.trim() && !atividades.trim()) return;

    addDiaryRecord({
      date,
      humor,
      sono,
      alimentacao,
      atividades: atividades.trim() || 'Brincadeiras livres em casa e descanso em família.',
      conquista: conquista.trim() || 'Momentos de muito carinho e tranquilidade.',
      obs: obs.trim() || 'Dia tranquilo e aconchegante.',
      photosCount: 2
    });

    setAtividades('');
    setConquista('');
    setObs('');
  };

  const moods = [
    { label: 'Alegre 😄', emoji: '😄' },
    { label: 'Calmo 🙂', emoji: '🙂' },
    { label: 'Agitado 😅', emoji: '😅' },
    { label: 'Cansado 😴', emoji: '😴' },
    { label: 'Conquistador 🌟', emoji: '🌟' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
          Diário do Ian 📔
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Pequenos registros e memórias do dia a dia da família, sono, alimentação e humor.
        </p>
      </div>

      {/* New Diary Form */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center font-bold">
            ✏️
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Registrar o Dia de Hoje
            </h2>
            <p className="text-xs text-gray-500">
              Anote como o Ian acordou, suas reações e descobertas em família.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Data do Registro</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 27/08/2026"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Qualidade do Sono</label>
              <select
                value={sono}
                onChange={(e: any) => setSono(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              >
                <option value="Ótimo">Ótimo 🌙 (Dormiu a noite toda)</option>
                <option value="Bom">Bom 😊 (Acordou 1x rápido)</option>
                <option value="Regular">Regular 🥱 (Custou a pegar no sono)</option>
                <option value="Agitado">Agitado ⚡ (Inquieto na madrugada)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Alimentação</label>
              <select
                value={alimentacao}
                onChange={(e: any) => setAlimentacao(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              >
                <option value="Ótima">Ótima 🍎 (Comeu muito bem)</option>
                <option value="Boa">Boa 🥣 (Aceitou as refeições)</option>
                <option value="Regular">Regular 🥪 (Seletivo hoje)</option>
                <option value="Pouco apetite">Pouco apetite 🧃</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Humor Predominante</label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.label}
                  onClick={() => setHumor(m.label)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    humor === m.label
                      ? 'bg-pink-500 text-white shadow-sm scale-105'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Atividades e Brincadeiras do Dia</label>
            <input
              type="text"
              value={atividades}
              onChange={(e) => setAtividades(e.target.value)}
              placeholder="Ex: Passeio no parquinho, brincou de blocos de montar, desenho animado..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Conquista ou Momento Especial</label>
            <input
              type="text"
              value={conquista}
              onChange={(e) => setConquista(e.target.value)}
              placeholder="Ex: Apontou para pedir água, deu gargalhada com o irmãozinho..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Observações e Sentimentos da Família *</label>
            <textarea
              required
              rows={2}
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Como foi o clima em casa, momentos de regulação e aconchego..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
              <span>Salvar no Diário</span>
            </button>
          </div>
        </form>
      </div>

      {/* Diary History */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
          <BookHeart className="w-5 h-5 text-pink-500" />
          <span>Registros Anteriores ({diary.length})</span>
        </h2>

        <div className="space-y-3">
          {diary.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-pink-100/60 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-lg">
                    📔
                  </span>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                      {entry.date}
                    </h3>
                    <span className="text-[11px] font-bold text-pink-600">
                      Humor: {entry.humor}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#1E5FA6] rounded-full flex items-center gap-1">
                    <Moon className="w-3 h-3" /> Sono: {entry.sono}
                  </span>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full flex items-center gap-1">
                    <Utensils className="w-3 h-3" /> Alimentação: {entry.alimentacao}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                {entry.atividades && (
                  <div>
                    <strong className="text-gray-900">Atividades: </strong>
                    <span>{entry.atividades}</span>
                  </div>
                )}
                {entry.conquista && (
                  <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 text-amber-950 font-medium flex items-start gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Conquista do dia:</strong> {entry.conquista}</span>
                  </div>
                )}
                <p className="text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-2xl">
                  {entry.obs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
