import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Clock, Award, ShieldCheck, Sparkles, Check, Edit2 } from 'lucide-react';

export const EvolutionPage: React.FC = () => {
  const { goals, updateGoalNivel, timeline, child } = useApp();

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [tempNivel, setTempNivel] = useState<number>(50);

  const handleStartEdit = (id: string, currentNivel: number) => {
    setEditingGoalId(id);
    setTempNivel(currentNivel);
  };

  const handleSaveEdit = (id: string) => {
    updateGoalNivel(id, tempNivel);
    setEditingGoalId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
          Evolução & Plano de Desenvolvimento do Ian
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Acompanhamento integrado de marcos e metas por área de intervenção multidisciplinar.
        </p>
      </div>

      {/* Goals Breakdown */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1E5FA6]" />
              <span>Indicadores por Domínio</span>
            </h2>
            <p className="text-xs text-gray-500">
              Clique em "Ajustar" para atualizar o nível da meta conforme a evolução nas sessões.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-blue-50 px-3 py-1 rounded-full text-[#1E5FA6]">
            {goals.length} Áreas Monitoradas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const isEditing = editingGoalId === goal.id;
            return (
              <div
                key={goal.id}
                className="bg-[#F9FBFE] border border-blue-100/70 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-800">{goal.cat}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#1E5FA6]">
                      {isEditing ? tempNivel : goal.nivel}%
                    </span>
                    {!isEditing ? (
                      <button
                        onClick={() => handleStartEdit(goal.id, goal.nivel)}
                        className="text-xs text-gray-400 hover:text-[#1E5FA6] p-1 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Ajustar percentual"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveEdit(goal.id)}
                        className="text-xs text-white bg-[#1E5FA6] hover:bg-[#154578] px-2 py-1 rounded-lg font-bold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Salvar
                      </button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-1 py-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tempNivel}
                      onChange={(e) => setTempNivel(Number(e.target.value))}
                      className="w-full accent-[#1E5FA6] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-3 bg-blue-100/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6FD9C0] to-[#1E5FA6] rounded-full transition-all duration-500"
                      style={{ width: `${goal.nivel}%` }}
                    />
                  </div>
                )}

                <p className="text-xs text-gray-600 leading-relaxed">
                  {goal.description}
                </p>

                <div className="text-[10.5px] text-gray-400 pt-1">
                  Última atualização: {goal.updatedAt.split('-').reverse().join('/')}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#FFF6E0] border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-950 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Nota ética e de acolhimento:</strong> Estes indicadores representam apenas o acompanhamento dos registros e objetivos definidos por pais e profissionais — não constituem diagnóstico nem medida clínica fechada. Cada criança floresce em seu próprio ritmo com amor e suporte contínuo.
          </div>
        </div>
      </div>

      {/* Historical Timeline */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1E5FA6]" />
          <span>Linha do Tempo de Desenvolvimento ({timeline.length} etapas)</span>
        </h2>

        <div className="relative pl-6 sm:pl-8 border-l-3 border-[#DCEFFB] space-y-6">
          {timeline.map((event) => (
            <div key={event.id} className="relative group">
              <div className={`absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full border-2 border-white ring-2 ${
                event.highlight ? 'bg-[#1E5FA6] ring-[#1E5FA6]' : 'bg-[#6FD9C0] ring-[#6FD9C0]'
              }`} />
              <div className="bg-white border border-blue-50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-heading font-bold text-sm text-[#1E5FA6]">
                    {event.year}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-[#154578] rounded-full">
                    {event.category}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1">
                  {event.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {event.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
