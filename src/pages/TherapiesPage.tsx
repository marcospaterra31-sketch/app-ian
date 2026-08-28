import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Professional, TherapySession } from '../types';
import {
  HeartPulse,
  Calendar,
  Clock,
  User,
  Plus,
  FileText,
  CheckCircle,
  Phone,
  Award,
  Search,
  Filter
} from 'lucide-react';

interface TherapiesPageProps {
  onOpenSessionModal: (prof?: Professional) => void;
}

export const TherapiesPage: React.FC<TherapiesPageProps> = ({ onOpenSessionModal }) => {
  const { professionals, sessions, goals, addSession, currentRole } = useApp();

  // In-page quick registration form
  const [selectedProfId, setSelectedProfId] = useState<number>(professionals[0]?.id || 1);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('10:00');
  const [goalCat, setGoalCat] = useState<string>(goals[0]?.cat || 'Comunicação');
  const [activities, setActivities] = useState<string>('');
  const [evolution, setEvolution] = useState<string>('');
  const [nextGoals, setNextGoals] = useState<string>('');
  const [attachment, setAttachment] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState('');

  const displayedProfessionals = professionals;

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activities.trim() || !evolution.trim()) return;

    const currentProf = professionals.find(p => p.id === selectedProfId) || professionals[0];

    addSession({
      professionalId: currentProf.id,
      professionalName: currentProf.name,
      role: currentProf.role,
      date,
      time,
      goalCategory: goalCat,
      activities: activities.trim(),
      evolution: evolution.trim(),
      nextGoals: nextGoals.trim() || 'Manter os estímulos orientados.',
      attachmentName: attachment.trim() || undefined
    });

    setActivities('');
    setEvolution('');
    setNextGoals('');
    setAttachment('');
  };

  const filteredSessions = sessions.filter(s =>
    s.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.activities.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.evolution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
          Terapias & Equipe Multidisciplinar
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Profissionais especializados que acompanham o desenvolvimento integral do Ian.
        </p>
      </div>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProfessionals.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-dashed border-blue-200">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
              🩺
            </div>
            <h3 className="font-bold text-sm text-gray-800">Nenhum terapeuta listado ainda</h3>
            <p className="text-xs text-gray-500 mt-1">
              Os profissionais da equipe multidisciplinar aparecerão aqui quando forem autorizados e cadastrados.
            </p>
          </div>
        ) : (
          displayedProfessionals.map((prof) => (
            <div
              key={prof.id}
              className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl">
                    {prof.emoji}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 text-[#1E5FA6] rounded-full">
                    {prof.role}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-gray-900">
                  {prof.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mb-2">{prof.clinic}</p>
                
                <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                  {prof.bio}
                </p>

                <div className="bg-gray-50 p-2.5 rounded-xl text-xs space-y-1 mb-4">
                  <div className="text-gray-500">
                    <strong className="text-gray-700">Próxima sessão:</strong> {prof.next}
                  </div>
                  <div className="text-gray-500">
                    <strong className="text-gray-700">Foco:</strong> {prof.goals.join(', ')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenSessionModal(prof)}
                className="w-full py-2.5 px-4 bg-[#EAF5FC] hover:bg-[#1E5FA6] text-[#154578] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Ver Histórico & Registrar</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Register New Session Form */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E5FA6]">
            📝
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Registrar Nova Sessão de Terapia
            </h2>
            <p className="text-xs text-gray-500">
              Adicione os estímulos, reações do Ian e recomendações para continuidade.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitSession} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Profissional</label>
              <select
                value={selectedProfId}
                onChange={(e) => setSelectedProfId(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Horário</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Área / Meta Principal</label>
              <select
                value={goalCat}
                onChange={(e) => setGoalCat(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.cat}>{g.cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Anexo (PDF / Relatório)</label>
              <input
                type="text"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
                placeholder="Ex: relatorio_fono_ago26.pdf"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Atividades & Estímulos Trabalhados *</label>
            <textarea
              required
              rows={2}
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="Descreva as brincadeiras terapêuticas, recursos lúdicos ou circuitos..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Evolução, Resposta do Ian & Conquistas *</label>
            <textarea
              required
              rows={3}
              value={evolution}
              onChange={(e) => setEvolution(e.target.value)}
              placeholder="Observações do engajamento, fala, humor, autorregulação e avanços..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Próximos Passos & Orientações para Casa</label>
            <input
              type="text"
              value={nextGoals}
              onChange={(e) => setNextGoals(e.target.value)}
              placeholder="Ex: Praticar a solicitação com pranchas de apoio no jantar..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Registro de Sessão</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search & History of All Sessions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#1E5FA6]" />
            <span>Histórico Completo de Sessões ({filteredSessions.length})</span>
          </h2>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por profissional ou atividade..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1E5FA6]"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="bg-white border border-dashed border-blue-200 rounded-3xl p-10 text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
                📋
              </div>
              <h3 className="font-bold text-sm text-gray-800">Nenhum registro de sessão encontrado</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Utilize o formulário acima para registrar a evolução da primeira sessão de terapia.
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white border border-blue-50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#154578]">
                      {session.professionalName}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-[#1E5FA6] rounded-full">
                      {session.role}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                      {session.goalCategory}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span>{session.date.split('-').reverse().join('/')}</span>
                    <span>{session.time}</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm space-y-1.5">
                  <div>
                    <strong className="text-gray-700">Atividades: </strong>
                    <span className="text-gray-600">{session.activities}</span>
                  </div>
                  <div className="bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/50">
                    <strong className="text-[#154578] block mb-0.5">Evolução:</strong>
                    <p className="text-gray-700 leading-relaxed">{session.evolution}</p>
                  </div>
                  {session.nextGoals && (
                    <div className="text-xs text-gray-500 pt-0.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span><strong className="text-gray-700">Recomendações:</strong> {session.nextGoals}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
