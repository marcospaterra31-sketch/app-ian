import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Professional, TherapySession } from '../types';
import { X, Calendar, Clock, Award, FileText, Plus, CheckCircle2, UserCheck, Stethoscope } from 'lucide-react';

interface SessionHistoryModalProps {
  professional: Professional | null;
  onClose: () => void;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({ professional, onClose }) => {
  const { sessions, addSession, goals, professionals } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [selectedProfId, setSelectedProfId] = useState<number>(professional ? professional.id : (professionals[0]?.id || 1));
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState<string>('10:00');
  const [goalCat, setGoalCat] = useState<string>(goals[0]?.cat || 'Comunicação');
  const [activities, setActivities] = useState<string>('');
  const [evolution, setEvolution] = useState<string>('');
  const [nextGoals, setNextGoals] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');

  const currentProf = professionals.find(p => p.id === selectedProfId) || professional || professionals[0];

  const filteredSessions = professional
    ? sessions.filter(s => s.professionalId === professional.id)
    : sessions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activities.trim() || !evolution.trim()) {
      return;
    }

    addSession({
      professionalId: currentProf.id,
      professionalName: currentProf.name,
      role: currentProf.role,
      date: sessionDate,
      time: sessionTime,
      goalCategory: goalCat,
      activities: activities.trim(),
      evolution: evolution.trim(),
      nextGoals: nextGoals.trim() || 'Dar continuidade aos estímulos da sessão anterior.',
      attachmentName: attachmentName ? attachmentName : undefined
    });

    // Reset form
    setActivities('');
    setEvolution('');
    setNextGoals('');
    setAttachmentName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#EAF5FC] via-[#F4FAFF] to-[#DCEFFB] p-5 sm:p-6 border-b border-blue-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-2xl shadow-sm">
              {professional ? professional.emoji : '🩺'}
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-[#154578]">
                {professional ? `Sessões — ${professional.name}` : 'Histórico de Terapias do Ian'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {professional ? `${professional.role} · ${professional.clinic}` : 'Registros clínicos multidisciplinares'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {showAddForm ? 'Registrar Nova Sessão' : `${filteredSessions.length} sessões registradas`}
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 bg-[#1E5FA6] hover:bg-[#154578] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
            >
              {showAddForm ? 'Ver Histórico' : <><Plus className="w-3.5 h-3.5" /> Nova Sessão</>}
            </button>
          </div>

          {showAddForm ? (
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-blue-100">
              {!professional && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Profissional Responsável</label>
                  <select
                    value={selectedProfId}
                    onChange={(e) => setSelectedProfId(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                  >
                    {professionals.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Data da Sessão</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Área Trabalhada</label>
                  <select
                    value={goalCat}
                    onChange={(e) => setGoalCat(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                  >
                    {goals.map((g) => (
                      <option key={g.id} value={g.cat}>{g.cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Atividades e Estímulos Realizados *</label>
                <textarea
                  required
                  rows={2}
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="Ex: Treino de atenção compartilhada, jogos de pareamento e imitação de gestos..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Evolução e Respostas do Ian *</label>
                <textarea
                  required
                  rows={3}
                  value={evolution}
                  onChange={(e) => setEvolution(e.target.value)}
                  placeholder="Descreva o engajamento, conquistas observadas, humor e cooperação do Ian..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Próximos Objetivos & Orientações aos Pais</label>
                <input
                  type="text"
                  value={nextGoals}
                  onChange={(e) => setNextGoals(e.target.value)}
                  placeholder="Ex: Praticar a solicitação com gesto em casa na hora do lanche..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nome do Arquivo / Anexo (opcional)</label>
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="Ex: relatorio_fono_ago26.pdf"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1E5FA6] hover:bg-[#154578] rounded-xl shadow-sm transition-colors"
                >
                  Salvar Registro de Sessão
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3.5">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-10 bg-blue-50/50 rounded-2xl p-6 text-gray-500 text-xs sm:text-sm">
                  Nenhuma sessão registrada para este profissional ainda. Clique em "Nova Sessão" acima para adicionar a primeira.
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white border border-blue-100/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#154578]">
                          {session.professionalName}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-[#1E5FA6] rounded-full">
                          {session.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          {session.date.split('-').reverse().join('/')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {session.time}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div>
                        <span className="font-bold text-gray-700">Objetivo & Atividades: </span>
                        <span className="text-gray-600">{session.activities}</span>
                      </div>
                      <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100/60">
                        <span className="font-bold text-[#154578] block mb-0.5">Evolução Observada:</span>
                        <p className="text-gray-700 leading-relaxed">{session.evolution}</p>
                      </div>
                      {session.nextGoals && (
                        <div className="text-xs text-gray-500 flex items-start gap-1.5 pt-1">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span><strong className="text-gray-700">Próximos passos:</strong> {session.nextGoals}</span>
                        </div>
                      )}
                      {session.attachmentName && (
                        <div className="flex items-center gap-1.5 text-xs text-[#1E5FA6] bg-blue-50/60 px-2.5 py-1.5 rounded-lg w-fit">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Anexo: {session.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
