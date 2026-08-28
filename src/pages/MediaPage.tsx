import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MediaRecord } from '../types';
import { Image, Video, Plus, Sparkles, Heart, Filter, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface MediaPageProps {
  onSelectMedia: (media: MediaRecord) => void;
}

export const MediaPage: React.FC<MediaPageProps> = ({ onSelectMedia }) => {
  const { media, addMedia } = useApp();

  const [selectedCat, setSelectedCat] = useState('Todos');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Família');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [date, setDate] = useState('Ago 2026');
  const [emoji, setEmoji] = useState('📷');
  const [description, setDescription] = useState('');

  const categories = ['Todos', 'Família', 'Escola', 'Terapia Ocupacional', 'Musicoterapia', 'Conquistas', 'Passeios'];
  const emojis = ['📷', '🎥', '👶', '🎨', '🧩', '🌳', '🎵', '🎹', '🖍️', '🌻', '🧸', '🚴'];

  const filteredMedia = selectedCat === 'Todos'
    ? media
    : media.filter(m => m.category.toLowerCase() === selectedCat.toLowerCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addMedia({
      title: title.trim(),
      category,
      type,
      date: date.trim() || 'Ago 2026',
      emoji,
      colorBg: 'from-blue-200 to-teal-300',
      description: description.trim()
    });

    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
            Memórias & Galeria do Ian 📷
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Momentos especiais, fotos de terapias, registros da escola e passeios em família.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 bg-[#1E5FA6] hover:bg-[#154578] text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fechar Formulário' : 'Nova Memória'}</span>
        </button>
      </div>

      {/* Add Media Form */}
      {showAddForm && (
        <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="font-heading font-bold text-base text-[#154578] pb-2 border-b border-gray-100">
            Adicionar Registro de Foto ou Vídeo
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Escolha um Ícone / Emoji</label>
              <div className="flex flex-wrap gap-2">
                {emojis.map((em) => (
                  <button
                    type="button"
                    key={em}
                    onClick={() => setEmoji(em)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      emoji === em
                        ? 'bg-blue-100 ring-2 ring-[#1E5FA6] scale-110 shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título do Momento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Sorrindo no balanço do parque"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
                >
                  <option value="Família">Família 👨‍👩‍👦</option>
                  <option value="Escola">Escola 🏫</option>
                  <option value="Terapia Ocupacional">Terapia Ocupacional 🖐️</option>
                  <option value="Musicoterapia">Musicoterapia 🎵</option>
                  <option value="Conquistas">Conquistas ⭐</option>
                  <option value="Passeios">Passeios 🌳</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Mídia</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
                >
                  <option value="image">Fotografia 📷</option>
                  <option value="video">Vídeo Curto 🎥</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Descrição do Momento & Lembrança *</label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte o que tornou este instante tão especial para o Ian..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#1E5FA6] hover:bg-[#154578] rounded-xl shadow-md transition-colors"
              >
                Salvar Memória no Álbum
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCat === cat
                ? 'bg-[#1E5FA6] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            onClick={() => onSelectMedia(item)}
            className="group bg-white rounded-3xl overflow-hidden border border-blue-100/80 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className={`aspect-square bg-gradient-to-tr ${item.colorBg} flex items-center justify-center relative overflow-hidden`}>
              {item.url ? (
                <img 
                  src={item.url} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </span>
              )}
              {item.type === 'video' && (
                <div className="absolute top-3 left-3 bg-black/40 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Video className="w-3 h-3" /> Vídeo
                </div>
              )}
            </div>

            <div className="p-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E5FA6]">
                {item.category}
              </span>
              <h3 className="font-heading font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-400">
                {item.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
