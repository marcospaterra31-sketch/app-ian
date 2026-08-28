import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Lock, Shield, Plus, UploadCloud, Tag, Eye } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { documents, addDocument, showToast } = useApp();

  // Upload Form State
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<'Relatório' | 'Avaliação' | 'Escola' | 'Administrativo' | 'PEI' | 'Receita'>('Relatório');
  const [isPrivate, setIsPrivate] = useState(true);
  const [author, setAuthor] = useState('Equipe Multidisciplinar');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addDocument({
      nome: docName.trim().endsWith('.pdf') ? docName.trim() : `${docName.trim()}.pdf`,
      cat: category,
      data: new Date().toLocaleDateString('pt-BR'),
      size: `${(Math.random() * 1.5 + 0.5).toFixed(1)} MB`,
      isPrivate,
      author: author.trim() || 'Equipe do Ian'
    });

    setDocName('');
  };

  const handleDownload = (docName: string) => {
    showToast(`Iniciando download seguro de "${docName}"...`, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
          Central de Documentos & Relatórios
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Laudos médicos, avaliações multidisciplinares e PEI pedagógico organizados com privacidade.
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E5FA6] flex items-center justify-center font-bold">
            ⬆️
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Arquivar Novo Documento
            </h2>
            <p className="text-xs text-gray-500">
              Faça upload de laudos, exames ou orientações escolares em formato PDF.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Título do Documento *</label>
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Ex: Parecer Psicológico Semestral - Ago 2026"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              >
                <option value="Relatório">Relatório Clínico</option>
                <option value="Avaliação">Avaliação do Desenvolvimento</option>
                <option value="PEI">Plano de Ensino Individualizado (PEI)</option>
                <option value="Escola">Escolar / Pedagógico</option>
                <option value="Receita">Receita / Prescrição</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Autor / Emitente</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Dra. Karen Camargo ou Equipe Escola"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nível de Visibilidade</label>
              <select
                value={isPrivate ? 'privado' : 'publico'}
                onChange={(e) => setIsPrivate(e.target.value === 'privado')}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              >
                <option value="privado">🔒 Privado (Apenas Pais & Especialistas)</option>
                <option value="publico">🏫 Compartilhado (Inclui Escola e Professores)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Enviar & Arquivar Documento</span>
            </button>
          </div>
        </form>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[#154578] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1E5FA6]" />
            <span>Documentos Arquivados ({documents.length})</span>
          </h2>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Armazenamento Seguro
          </span>
        </div>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-blue-50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1E5FA6] flex items-center justify-center text-xl shrink-0">
                  📄
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                    {doc.nome}
                  </h3>
                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-semibold text-gray-700">{doc.cat}</span>
                    <span>·</span>
                    <span>{doc.data}</span>
                    <span>·</span>
                    <span>{doc.size}</span>
                    <span>·</span>
                    <span>Por {doc.author}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className={`text-[10.5px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  doc.isPrivate ? 'bg-amber-50 text-amber-900 border border-amber-200/50' : 'bg-blue-50 text-[#1E5FA6]'
                }`}>
                  {doc.isPrivate ? <Lock className="w-3 h-3" /> : null}
                  {doc.isPrivate ? 'Privado' : 'Equipe + Escola'}
                </span>

                <button
                  onClick={() => handleDownload(doc.nome)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-[#EAF5FC] text-[#1E5FA6] transition-colors"
                  title="Baixar Documento"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
