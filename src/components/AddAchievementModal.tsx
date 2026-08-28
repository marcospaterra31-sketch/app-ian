import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Star, Award, Heart } from 'lucide-react';

interface AddAchievementModalProps {
  onClose: () => void;
}

export const AddAchievementModal: React.FC<AddAchievementModalProps> = ({ onClose }) => {
  const { addAchievement, goals } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(goals[0]?.cat || 'Comunicação');
  const [date, setDate] = useState('Ago 2026');
  const [desc, setDesc] = useState('');
  const [emoji, setEmoji] = useState('⭐');

  const emojis = ['⭐', '🧩', '💬', '🎨', '👟', '🎵', '🌳', '👶', '🚴', '🏊', '🧸', '👏', '🏆', '🎉', '🧠'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    addAchievement({
      title: title.trim(),
      cat: category,
      date: date.trim() || 'Ago 2026',
      desc: desc.trim(),
      emoji,
      celebrated: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 p-5 sm:p-6 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-2xl shadow-sm">
              🎉
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-amber-950">
                Celebrar Nova Conquista!
              </h2>
              <p className="text-xs text-amber-800/80 font-medium">
                Cada pequeno passo do Ian é um marco grandioso de amor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-800 hover:text-amber-950 p-2 rounded-xl hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Escolha um Ícone / Emoji</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setEmoji(em)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                    emoji === em
                      ? 'bg-amber-400 ring-2 ring-amber-500 scale-110 shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Título da Conquista *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Comeu a fruta com o garfo sozinho!"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="Comunicação">Comunicação</option>
                <option value="Autonomia">Autonomia</option>
                <option value="Socialização">Socialização</option>
                <option value="Coordenação Motora">Coordenação Motora</option>
                <option value="Sensorial">Sensorial</option>
                <option value="Cognição">Cognição</option>
                <option value="Grande Conquista">Grande Conquista</option>
                <option value="Escola">Escola</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mês / Período</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: Ago 2026"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Descrição do Momento & Emoção *</label>
            <textarea
              required
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descreva o que aconteceu, como o Ian reagiu e o sentimento da família e equipe..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 rounded-xl shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Celebrar & Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
