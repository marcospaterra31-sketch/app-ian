import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Sparkles,
  HeartPulse,
  MessageCircle,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  Star,
  CheckCircle2,
  Heart,
  Plus,
  Smile
} from 'lucide-react';
import { motion } from 'motion/react';
import { MoodTrackerWidget } from '../components/MoodTrackerWidget';

interface DashboardPageProps {
  onOpenSessionModal: (prof?: any) => void;
  onOpenAchievementModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenSessionModal, onOpenAchievementModal }) => {
  const {
    currentRole,
    child,
    professionals,
    agenda,
    achievements,
    goals,
    sessions,
    school,
    setCurrentPage,
    celebrateAchievement,
    threads
  } = useApp();

  const getGreeting = () => {
    switch (currentRole) {
      case 'parent': return `Olá, Alessandra e Marcos 💙`;
      case 'therapist': return `Olá, Equipe Multidisciplinar do ${child.name} 🩺`;
      case 'school': return `Olá, Escola Pequeno Passo 🏫`;
      case 'admin': return `Painel de Acompanhamento do ${child.name} ⚙️`;
    }
  };

  const getSubGreeting = () => {
    switch (currentRole) {
      case 'parent': return `Acompanhe cada etapa, conquista e a evolução integrada do ${child.name} com os terapeutas e a escola.`;
      case 'therapist': return `Consulte o plano de metas, histórico de sessões e troque orientações com Alessandra e Marcos.`;
      case 'school': return `Registre a rotina pedagógica, conquistas escolares e comunique-se com os pais.`;
      case 'admin': return `Gerenciamento centralizado do prontuário, equipe multidisciplinar e segurança dos dados.`;
    }
  };

  const unreadMessagesCount = (threads[currentRole] || []).reduce((acc, t) => acc + t.unread, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
            {getGreeting()}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            {getSubGreeting()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'therapist' ? (
            <button
              onClick={() => onOpenSessionModal()}
              className="flex items-center gap-1.5 bg-[#1E5FA6] hover:bg-[#154578] text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md shadow-blue-900/10 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Sessão</span>
            </button>
          ) : currentRole === 'school' ? (
            <button
              onClick={() => setCurrentPage('escola')}
              className="flex items-center gap-1.5 bg-[#1E5FA6] hover:bg-[#154578] text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md shadow-blue-900/10 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Registro Escolar</span>
            </button>
          ) : (
            <button
              onClick={onOpenAchievementModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 px-4 py-2 rounded-2xl text-xs font-bold shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nova Conquista</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Accent Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => setCurrentPage('terapias')}
          className="bg-gradient-to-br from-[#EAF5FC] to-white p-4 sm:p-5 rounded-3xl border border-blue-100 shadow-xs cursor-pointer hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-100/70 flex items-center justify-center text-xl mb-3 text-blue-600">
            🩺
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Terapias</h3>
          <div className="text-2xl font-heading font-bold text-[#154578] mt-0.5">
            {professionals.length} <span className="text-xs font-normal text-gray-500">profissionais</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => setCurrentPage('agenda')}
          className="bg-gradient-to-br from-[#FFF3D6] to-white p-4 sm:p-5 rounded-3xl border border-amber-100 shadow-xs cursor-pointer hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100/70 flex items-center justify-center text-xl mb-3 text-amber-600">
            📅
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Compromissos</h3>
          <div className="text-2xl font-heading font-bold text-amber-950 mt-0.5">
            {agenda.length} <span className="text-xs font-normal text-gray-500">na agenda</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => setCurrentPage('conquistas')}
          className="bg-gradient-to-br from-[#FFE7F1] to-white p-4 sm:p-5 rounded-3xl border border-pink-100 shadow-xs cursor-pointer hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-pink-100/70 flex items-center justify-center text-xl mb-3 text-pink-600">
            ⭐
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conquistas</h3>
          <div className="text-2xl font-heading font-bold text-pink-950 mt-0.5">
            {achievements.length} <span className="text-xs font-normal text-gray-500">celebradas</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => setCurrentPage('mensagens')}
          className="bg-gradient-to-br from-[#E3FBF5] to-white p-4 sm:p-5 rounded-3xl border border-emerald-100 shadow-xs cursor-pointer hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 flex items-center justify-center text-xl mb-3 text-emerald-600">
            💬
          </div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mensagens</h3>
          <div className="text-2xl font-heading font-bold text-emerald-950 mt-0.5">
            {unreadMessagesCount > 0 ? `${unreadMessagesCount} nova(s)` : 'Em dia'}
          </div>
        </motion.div>
      </div>

      {/* Quick-Entry Mood Tracker & Emotion Patterns */}
      <MoodTrackerWidget />

      {/* Main Grid: Agenda & Conquistas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Compromissos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-heading text-[#154578] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1E5FA6]" />
              <span>Próximos Compromissos</span>
            </h2>
            <button
              onClick={() => setCurrentPage('agenda')}
              className="text-xs font-bold text-[#1E5FA6] hover:underline flex items-center gap-1"
            >
              Ver agenda <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {agenda.length === 0 ? (
              <div className="bg-white border border-dashed border-blue-200 rounded-2xl p-6 text-center">
                <div className="text-2xl mb-1">🗓️</div>
                <p className="text-xs font-bold text-gray-700">Nenhum compromisso agendado</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Adicione consultas e terapias na aba Agenda.</p>
              </div>
            ) : (
              agenda.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-blue-50 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1E5FA6] flex items-center justify-center text-xl shrink-0">
                      🗓️
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-gray-800">
                        {item.tipo} — {item.who}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{item.day} às {item.time}</span>
                        <span>·</span>
                        <span className="truncate max-w-[130px] sm:max-w-none">{item.local}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#1E5FA6] shrink-0">
                    {item.tipo}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimas Conquistas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-heading text-[#154578] flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Últimas Conquistas do Ian</span>
            </h2>
            <button
              onClick={() => setCurrentPage('conquistas')}
              className="text-xs font-bold text-[#1E5FA6] hover:underline flex items-center gap-1"
            >
              Ver todas ({achievements.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {achievements.length === 0 ? (
              <div className="bg-white border border-dashed border-amber-200 rounded-2xl p-6 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-xs font-bold text-gray-700">Nenhuma conquista registrada ainda</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Cadastre o primeiro marco do Ian pelo botão "Nova Conquista".</p>
              </div>
            ) : (
              achievements.slice(0, 3).map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white border border-amber-100/60 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">
                      {ach.emoji}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-gray-800">
                        {ach.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {ach.date} · <span className="text-amber-700 font-semibold">{ach.cat}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => celebrateAchievement(ach.id)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-amber-100/60 hover:bg-amber-200 text-amber-900 rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    title="Celebrar novamente"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Celebrar</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Espaço de Mensagens Instantâneas da Família & Terapeutas */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold font-heading text-[#154578] flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#1E5FA6]" />
              <span>Espaço de Mensagens Instantâneas</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-xs text-gray-500">
              Converse diretamente com Fonoaudióloga, TO, Musicoterapeuta, Psicólogo e a Escola.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('mensagens')}
            className="text-xs font-bold text-[#1E5FA6] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            Abrir chat completo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(threads[currentRole] || []).length === 0 ? (
            <div className="col-span-full bg-[#F8FBFE] border border-dashed border-blue-200 rounded-2xl p-6 text-center">
              <p className="text-xs font-bold text-gray-700">Nenhum canal de mensagem ativo no momento</p>
              <p className="text-[11px] text-gray-400 mt-0.5">As conversas com os profissionais vinculados aparecerão aqui.</p>
            </div>
          ) : (
            (threads[currentRole] || []).slice(0, 3).map((th) => (
              <div
                key={th.id}
                onClick={() => setCurrentPage('mensagens')}
                className="bg-[#F8FBFE] hover:bg-[#F0F7FD] border border-blue-100/70 p-3.5 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{th.avatar}</span>
                      <span className="font-bold text-xs text-gray-900 truncate group-hover:text-[#1E5FA6]">
                        {th.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    "{th.last}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-blue-50 text-[10px] text-gray-400">
                  <span>{th.roleDescription}</span>
                  <span className="text-[#1E5FA6] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Responder <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Progress & Goals Snapshot */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-[#154578] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1E5FA6]" />
              <span>Painel de Evolução do Desenvolvimento</span>
            </h2>
            <p className="text-xs text-gray-500">
              Acompanhamento contínuo dos objetivos cadastrados pela família e especialistas.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('evolucao')}
            className="text-xs font-bold text-[#1E5FA6] hover:underline"
          >
            Ver detalhado
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.slice(0, 6).map((g) => (
            <div key={g.id} className="bg-[#F8FBFE] p-3.5 rounded-2xl border border-blue-50 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-700">{g.cat}</span>
                <span className="text-[#1E5FA6]">{g.nivel}%</span>
              </div>
              <div className="w-full h-2.5 bg-blue-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6FD9C0] to-[#1E5FA6] rounded-full transition-all duration-500"
                  style={{ width: `${g.nivel}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11.5px] text-amber-900 bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3 leading-relaxed">
          💙 <strong>Nota de acolhimento:</strong> Estes percentuais representam o acompanhamento das metas individuais cadastradas na rotina do Ian — celebrando cada evolução com amor e respeito ao tempo do seu desenvolvimento.
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold font-heading text-[#154578] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1E5FA6]" />
          <span>Linha do Tempo de Atividades Recentes</span>
        </h2>

        {sessions.length === 0 && school.length === 0 && achievements.length === 0 ? (
          <div className="bg-white border border-dashed border-blue-200 rounded-3xl p-8 text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
              🌱
            </div>
            <h3 className="font-bold text-sm text-gray-800">Início da Jornada do Ian</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Nenhuma atividade registrada ainda. À medida que sessões de terapia, registros escolares e conquistas forem adicionados, esta linha do tempo será preenchida automaticamente.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-100 space-y-6">
            {sessions.slice(0, 2).map((s) => (
              <div key={s.id} className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-[#6FD9C0] border-2 border-white ring-2 ring-[#6FD9C0]"></div>
                <div className="text-xs font-bold font-heading text-[#1E5FA6]">{s.date} às {s.time}</div>
                <div className="font-bold text-xs sm:text-sm text-gray-800 mt-0.5">Sessão: {s.professionalName} ({s.role})</div>
                <p className="text-xs text-gray-500 mt-1">{s.evolution}</p>
              </div>
            ))}
            {school.slice(0, 1).map((sc) => (
              <div key={sc.id} className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-[#FFCB4D] border-2 border-white ring-2 ring-[#FFCB4D]"></div>
                <div className="text-xs font-bold font-heading text-amber-600">{sc.date}</div>
                <div className="font-bold text-xs sm:text-sm text-gray-800 mt-0.5">Registro Escolar: {sc.atividade}</div>
                <p className="text-xs text-gray-500 mt-1">{sc.conquista}</p>
              </div>
            ))}
            {achievements.slice(0, 1).map((ach) => (
              <div key={ach.id} className="relative">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-[#FF9EC7] border-2 border-white ring-2 ring-[#FF9EC7]"></div>
                <div className="text-xs font-bold font-heading text-pink-500">{ach.date}</div>
                <div className="font-bold text-xs sm:text-sm text-gray-800 mt-0.5">Nova Conquista: {ach.title}</div>
                <p className="text-xs text-gray-500 mt-1">{ach.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
