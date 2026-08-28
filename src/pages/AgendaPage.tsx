import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AgendaEvent } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  CheckCircle2,
  Circle,
  Filter,
  Sparkles
} from 'lucide-react';

export const AgendaPage: React.FC = () => {
  const { agenda, addAgendaEvent, toggleAgendaCompleted } = useApp();

  const [filterType, setFilterType] = useState<string>('Todos');

  // Form State
  const [day, setDay] = useState('Seg 08/09');
  const [date, setDate] = useState('2026-09-08');
  const [time, setTime] = useState('14h00');
  const [tipo, setTipo] = useState<AgendaEvent['tipo']>('Terapia');
  const [who, setWho] = useState('');
  const [local, setLocal] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!who.trim() || !local.trim()) return;

    addAgendaEvent({
      day,
      date,
      time,
      tipo,
      who: who.trim(),
      local: local.trim(),
      notes: notes.trim() || undefined,
      completed: false
    });

    setWho('');
    setLocal('');
    setNotes('');
  };

  const filteredAgenda = filterType === 'Todos'
    ? agenda
    : agenda.filter(item => item.tipo === filterType);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
          Agenda Integrada de Compromissos
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Terapias, consultas médicas, rotina escolar e eventos da família organizados em um só lugar.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {['Todos', 'Terapia', 'Escola', 'Consulta', 'Atividade', 'Evento familiar'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterType === cat
                ? 'bg-[#1E5FA6] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add New Event Form */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E5FA6] flex items-center justify-center font-bold">
            📅
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Novo Compromisso
            </h2>
            <p className="text-xs text-gray-500">
              Cadastre sessões, consultas ou atividades para sincronizar com toda a equipe.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Dia da Semana & Data</label>
              <input
                type="text"
                required
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="Ex: Seg 08/09"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Horário</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ex: 14h00"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
              <select
                value={tipo}
                onChange={(e: any) => setTipo(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              >
                <option value="Terapia">Terapia 🩺</option>
                <option value="Escola">Escola 🏫</option>
                <option value="Consulta">Consulta Médica 🏥</option>
                <option value="Atividade">Atividade Lúdica 🎨</option>
                <option value="Evento familiar">Evento Familiar 👨‍👩‍👦</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Profissional / Responsável *</label>
              <input
                type="text"
                required
                value={who}
                onChange={(e) => setWho(e.target.value)}
                placeholder="Ex: Letícia Onari (Fonoaudiologia)"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Local do Compromisso *</label>
              <input
                type="text"
                required
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Ex: Consultório Fono & Acolher ou Domiciliar"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Observações ou Materiais a Levar</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Levar pranchas visuais, garrafinha de água e documento de encaminhamento..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Compromisso</span>
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1E5FA6]" />
          <span>Compromissos Agendados ({filteredAgenda.length})</span>
        </h2>

        <div className="space-y-3">
          {filteredAgenda.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.completed ? 'border-gray-200 bg-gray-50/70 opacity-75' : 'border-blue-100'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleAgendaCompleted(item.id)}
                  className="mt-0.5 text-gray-400 hover:text-emerald-600 transition-colors shrink-0"
                  title={item.completed ? 'Marcar como pendente' : 'Marcar como concluído'}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 hover:text-blue-500" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-bold text-xs sm:text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.tipo} — {item.who}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1E5FA6]">
                      {item.tipo}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Calendar className="w-3.5 h-3.5 text-[#1E5FA6]" />
                      {item.day} às {item.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {item.local}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-xl mt-1">
                      📝 {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 text-xs">
                {item.completed && (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                    ✓ Concluído
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
