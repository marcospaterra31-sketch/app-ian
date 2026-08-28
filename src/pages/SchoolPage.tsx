import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { School, CheckCircle2, Star, Calendar, MessageSquare, Plus, BookOpen, Smile } from 'lucide-react';

export const SchoolPage: React.FC = () => {
  const { school, addSchoolRecord, currentRole } = useApp();

  // Form State
  const [date, setDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [teacher, setTeacher] = useState('Profª Mariana Silva');
  const [atividade, setAtividade] = useState('');
  const [participacao, setParticipacao] = useState<'Ótima' | 'Boa' | 'Regular'>('Boa');
  const [socializacao, setSocializacao] = useState<'Ótima' | 'Boa' | 'Regular'>('Ótima');
  const [comunicacao, setComunicacao] = useState<'Ótima' | 'Boa' | 'Regular'>('Boa');
  const [autonomia, setAutonomia] = useState<'Ótima' | 'Boa' | 'Regular'>('Boa');
  const [conquista, setConquista] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [recadoPais, setRecadoPais] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atividade.trim()) return;

    addSchoolRecord({
      date,
      teacher: teacher.trim() || 'Equipe Pedagógica',
      atividade: atividade.trim(),
      participacao,
      socializacao,
      comunicacao,
      autonomia,
      conquista: conquista.trim() || 'Participou com muito carinho e entusiasmo das atividades.',
      observacoes: observacoes.trim() || 'Dia calmo e proveitoso na rotina de sala de aula.',
      recadoPais: recadoPais.trim() || 'Ian teve um excelente dia com a turminha hoje!'
    });

    setAtividade('');
    setConquista('');
    setObservacoes('');
    setRecadoPais('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
          Rotina & Acompanhamento Escolar
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Escola Pequeno Passo · Mediação pedagógica, socialização e inclusão do Ian.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5 rounded-3xl border border-blue-100 shadow-xs">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Presença</h3>
          <div className="text-2xl font-heading font-bold text-[#154578] mt-1">95%</div>
          <p className="text-[11px] text-gray-400 mt-0.5">Frequência no mês</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-5 rounded-3xl border border-emerald-100 shadow-xs">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Participação</h3>
          <div className="text-2xl font-heading font-bold text-emerald-900 mt-1">Boa / Ativa</div>
          <p className="text-[11px] text-gray-400 mt-0.5">Engajamento nas rodas</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-4 sm:p-5 rounded-3xl border border-amber-100 shadow-xs">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Autonomia</h3>
          <div className="text-2xl font-heading font-bold text-amber-950 mt-1">Em Evolução</div>
          <p className="text-[11px] text-gray-400 mt-0.5">Hora do lanche & mochila</p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-white p-4 sm:p-5 rounded-3xl border border-pink-100 shadow-xs">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conquistas</h3>
          <div className="text-2xl font-heading font-bold text-pink-950 mt-1">4 no Mês</div>
          <p className="text-[11px] text-gray-400 mt-0.5">Marcos escolares</p>
        </div>
      </div>

      {/* Register Form */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            🏫
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Novo Registro Escolar
            </h2>
            <p className="text-xs text-gray-500">
              Registrar o dia, interações sociais, conquistas e recados da professora.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Data</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Professor(a) / Responsável</label>
              <input
                type="text"
                required
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Ex: Profª Mariana Silva"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Atividade Principal Trabalhada *</label>
            <input
              type="text"
              required
              value={atividade}
              onChange={(e) => setAtividade(e.target.value)}
              placeholder="Ex: Roda de história com fantoches, massinha ou brincadeiras no parque..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          {/* Rating Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/70">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Participação</label>
              <select
                value={participacao}
                onChange={(e: any) => setParticipacao(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold text-gray-800"
              >
                <option value="Ótima">Ótima 🌟</option>
                <option value="Boa">Boa 👍</option>
                <option value="Regular">Regular ⏳</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Interação Social</label>
              <select
                value={socializacao}
                onChange={(e: any) => setSocializacao(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold text-gray-800"
              >
                <option value="Ótima">Ótima 🌟</option>
                <option value="Boa">Boa 👍</option>
                <option value="Regular">Regular ⏳</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Comunicação</label>
              <select
                value={comunicacao}
                onChange={(e: any) => setComunicacao(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold text-gray-800"
              >
                <option value="Ótima">Ótima 🌟</option>
                <option value="Boa">Boa 👍</option>
                <option value="Regular">Regular ⏳</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Autonomia</label>
              <select
                value={autonomia}
                onChange={(e: any) => setAutonomia(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs font-bold text-gray-800"
              >
                <option value="Ótima">Ótima 🌟</option>
                <option value="Boa">Boa 👍</option>
                <option value="Regular">Regular ⏳</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Conquista Especial do Dia</label>
            <input
              type="text"
              value={conquista}
              onChange={(e) => setConquista(e.target.value)}
              placeholder="Ex: Cantou a música junto, compartilhou o brinquedo com o amiguinho..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Observações Gerais</label>
              <textarea
                rows={2}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Como foi o comportamento na rotina..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Recado Direto para os Pais</label>
              <textarea
                rows={2}
                value={recadoPais}
                onChange={(e) => setRecadoPais(e.target.value)}
                placeholder="Lanche, recadinho carinhoso ou orientação..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Registro Escolar</span>
            </button>
          </div>
        </form>
      </div>

      {/* School History Cards */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1E5FA6]" />
          <span>Registros Pedagógicos Recentes ({school.length})</span>
        </h2>

        <div className="space-y-3">
          {school.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-blue-50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                    🏫
                  </span>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                      {s.atividade}
                    </h3>
                    <div className="text-[11px] text-gray-400">
                      {s.teacher} · {s.date}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#1E5FA6] rounded-full">
                    Part: {s.participacao}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                    Social: {s.socializacao}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full">
                    Autonomia: {s.autonomia}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 text-amber-950">
                  <strong className="block mb-0.5 text-amber-900 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                    Conquista do dia na escola:
                  </strong>
                  <p>{s.conquista}</p>
                </div>

                <div className="text-gray-600">
                  <strong className="text-gray-700">Observações: </strong>
                  {s.observacoes}
                </div>

                {s.recadoPais && (
                  <div className="text-xs text-[#154578] bg-blue-50/50 p-2.5 rounded-xl flex items-start gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#1E5FA6] shrink-0 mt-0.5" />
                    <div>
                      <strong>Recado da Escola para a Família: </strong>
                      {s.recadoPais}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
