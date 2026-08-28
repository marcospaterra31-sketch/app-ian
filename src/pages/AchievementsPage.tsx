import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Star, Plus, Award, Filter, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface AchievementsPageProps {
  onOpenAchievementModal: () => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ onOpenAchievementModal }) => {
  const { achievements, celebrateAchievement } = useApp();
  const [selectedCat, setSelectedCat] = useState('Todos');

  const categories = ['Todos', 'Comunicação', 'Autonomia', 'Sensorial', 'Coordenação Motora', 'Grande Conquista', 'Primeiro Mês'];

  const filtered = selectedCat === 'Todos'
    ? achievements
    : achievements.filter(a => a.cat.toLowerCase() === selectedCat.toLowerCase());

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
            As Conquistas do Ian ⭐
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Cada avanço, por menor que pareça, é uma vitória gigante que merece ser celebrada com festa e carinho.
          </p>
        </div>

        <button
          onClick={onOpenAchievementModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 px-4 py-2 rounded-2xl text-xs font-bold shadow-md transition-all shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Celebrar Nova Conquista</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCat === cat
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ach) => (
          <motion.div
            key={ach.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Banner */}
              <div className="h-36 bg-gradient-to-br from-[#FF9EC7] via-[#FFCB4D] to-[#6FD9C0] flex items-center justify-center relative">
                <span className="text-6xl drop-shadow-md transition-transform hover:scale-125 duration-300 cursor-pointer" onClick={() => celebrateAchievement(ach.id)}>
                  {ach.emoji}
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/85 text-amber-950 backdrop-blur-xs shadow-xs">
                  {ach.date}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1E5FA6]">
                  {ach.cat}
                </span>
                <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 leading-snug">
                  {ach.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {ach.desc}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 pt-0">
              <button
                onClick={() => celebrateAchievement(ach.id)}
                className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100/80 text-amber-950 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 border border-amber-200/50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Celebrar Conquista 🎉</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
