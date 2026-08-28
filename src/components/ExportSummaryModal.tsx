import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, CheckCircle2, Heart, Award, Calendar, FileText } from 'lucide-react';

interface ExportSummaryModalProps {
  onClose: () => void;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({ onClose }) => {
  const { child, goals, achievements, professionals, sessions, school, agenda } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E5FA6] to-[#154578] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              📄
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold">
                Relatório de Acompanhamento Integrado
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                Prontuário e evolução multidimensional do Ian
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-gray-800 printable-content">
          {/* Top Title & Child Info */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#154578] font-heading flex items-center gap-2">
                  <span>Meu Mundo Azul</span>
                  <span className="text-xs font-normal bg-blue-100 text-[#1E5FA6] px-2.5 py-1 rounded-full">
                    Relatório Oficial
                  </span>
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Gerado em {new Date().toLocaleDateString('pt-BR')} via Plataforma Meu Mundo Azul</p>
              </div>
              <div className="text-right text-xs text-gray-600">
                <p><strong>Pais/Responsáveis:</strong> {child.parents}</p>
                <p><strong>Nascimento:</strong> {child.birthDateFull} ({child.age})</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-blue-50/60 p-3.5 rounded-2xl text-xs">
              <div>
                <span className="text-gray-500 block">Diagnóstico Principal:</span>
                <span className="font-bold text-[#154578]">{child.diagnosis}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Tipo Sanguíneo:</span>
                <span className="font-bold text-gray-800">{child.bloodType}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Contato de Emergência:</span>
                <span className="font-bold text-gray-800">{child.emergencyContact}</span>
              </div>
            </div>
          </div>

          {/* Development Goals Status */}
          <div>
            <h3 className="text-sm font-bold text-[#154578] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>📈</span> Indicadores de Metas do Desenvolvimento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((g) => (
                <div key={g.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>{g.cat}</span>
                    <span className="text-[#1E5FA6]">{g.nivel}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#6FD9C0] to-[#1E5FA6] rounded-full"
                      style={{ width: `${g.nivel}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">{g.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Multidisciplinary Team */}
          <div>
            <h3 className="text-sm font-bold text-[#154578] uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <span>🩺</span> Equipe Multidisciplinar Responsável
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {professionals.map((p) => (
                <div key={p.id} className="p-2.5 bg-white border border-gray-200 rounded-xl">
                  <div className="font-bold text-gray-800">{p.emoji} {p.name}</div>
                  <div className="text-[11px] text-[#1E5FA6] font-semibold">{p.role}</div>
                  <div className="text-[10px] text-gray-500">{p.clinic}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Therapy Logs */}
          <div>
            <h3 className="text-sm font-bold text-[#154578] uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <span>📝</span> Últimos Registros de Sessões
            </h3>
            <div className="space-y-2 text-xs">
              {sessions.slice(0, 3).map((s) => (
                <div key={s.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex justify-between font-bold text-gray-800 mb-1">
                    <span>{s.professionalName} ({s.role})</span>
                    <span className="text-gray-500 font-normal">{s.date.split('-').reverse().join('/')} às {s.time}</span>
                  </div>
                  <p className="text-gray-700 mb-1"><strong>Evolução:</strong> {s.evolution}</p>
                  <p className="text-gray-500 text-[11px]"><strong>Próximos passos:</strong> {s.nextGoals}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent School Summary */}
          {school.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#154578] uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>🏫</span> Registro Pedagógico Recente
              </h3>
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-xs space-y-1 text-gray-700">
                <p><strong>Última Atividade:</strong> {school[0].atividade} ({school[0].date})</p>
                <p><strong>Conquista na Escola:</strong> {school[0].conquista}</p>
                <p><strong>Observações:</strong> {school[0].observacoes}</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 text-center text-[11px] text-gray-400">
            Documento emitido para fins de acompanhamento familiar e pedagógico integrado. Plataforma Meu Mundo Azul © 2026.
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Fechar
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#1E5FA6] hover:bg-[#154578] rounded-xl shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
