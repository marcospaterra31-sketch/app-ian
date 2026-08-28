import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageCircle, Send, CheckCheck, Mic, MicOff, Paperclip, 
  Sparkles, Search, Phone, Video, ShieldCheck, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MessagesPage: React.FC = () => {
  const { threads, currentRole, sendMessage, showToast } = useApp();

  const roleThreads = threads[currentRole] || [];
  const [activeThreadId, setActiveThreadId] = useState<string>(roleThreads[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);

  const filteredThreads = roleThreads.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.roleDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentThread = roleThreads.find(t => t.id === activeThreadId) || filteredThreads[0] || roleThreads[0];

  const quickPills = currentRole === 'parent' ? [
    '💙 Ian teve um dia maravilhoso hoje!',
    '📅 Podemos confirmar o horário da sessão?',
    '🍎 Ele aceitou a frutinha no lanche!',
    '🧩 Conseguiu completar a atividade com calma.',
    '💤 A noite de sono foi tranquila.'
  ] : [
    '✅ A sessão de hoje foi muito produtiva!',
    '🎯 Alcançamos a meta do plano terapêutico.',
    '📋 Deixei as novas orientações registradas.',
    '💙 Parabéns à família pela dedicação diária!'
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentThread) return;

    sendMessage(currentThread.id, inputText.trim());
    setInputText('');
  };

  const handleSendVoiceAudio = () => {
    setIsRecordingAudio(false);
    if (!currentThread) return;
    const duration = audioSeconds > 0 ? audioSeconds : 14;
    sendMessage(currentThread.id, `🎙️ Mensagem de Áudio da Família (${duration}s) gravada com sucesso.`);
    setAudioSeconds(0);
    showToast('Áudio de voz enviado para o terapeuta!', 'heart');
  };

  const toggleRecord = () => {
    if (!isRecordingAudio) {
      setIsRecordingAudio(true);
      setAudioSeconds(0);
      const interval = setInterval(() => {
        setAudioSeconds(prev => {
          if (prev >= 60) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      (window as any)._audioInterval = interval;
    } else {
      if ((window as any)._audioInterval) clearInterval((window as any)._audioInterval);
      handleSendVoiceAudio();
    }
  };

  const handleCancelRecord = () => {
    if ((window as any)._audioInterval) clearInterval((window as any)._audioInterval);
    setIsRecordingAudio(false);
    setAudioSeconds(0);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E5FA6] to-[#2B7BC6] rounded-3xl p-5 sm:p-6 text-white shadow-md shadow-blue-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Canal Seguro & Direto com Terapeutas e Escola</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">
            Espaço de Mensagens Instantâneas
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
            Alinhamento contínuo entre Pais (Alessandra & Marcos), Fonoaudióloga, TO, Musicoterapeuta, Psicólogo e Escola.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-white/10 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/20">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-white">Canal Ativo & Sincronizado</span>
        </div>
      </div>

      {roleThreads.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center text-gray-500 border border-blue-100">
          Nenhuma conversa disponível para este perfil no momento.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-blue-100/80 shadow-sm overflow-hidden flex flex-col md:flex-row h-[620px]">
          {/* Threads List Sidebar */}
          <div className="w-full md:w-88 border-b md:border-b-0 md:border-r border-gray-100 bg-[#FBFDFF] flex flex-col shrink-0">
            {/* Search */}
            <div className="p-3.5 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar profissional ou escola..."
                  className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
              <span>Contatos ({filteredThreads.length})</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
              </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filteredThreads.map((th) => {
                const isActive = th.id === (currentThread?.id || '');
                return (
                  <button
                    key={th.id}
                    onClick={() => setActiveThreadId(th.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isActive ? 'bg-[#EAF5FC] border-l-4 border-[#1E5FA6]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-xl shadow-xs">
                        {th.avatar}
                      </div>
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                          {th.name}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {th.lastTime}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#1E5FA6] block truncate">
                        {th.roleDescription}
                      </span>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {th.last}
                      </p>
                    </div>

                    {th.unread && th.unread > 0 ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                        {th.unread}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Box */}
          {currentThread ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Chat Top Header */}
              <div className="p-3.5 sm:p-4 border-b border-gray-100 bg-white/90 backdrop-blur-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl">
                      {currentThread.avatar}
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-[#154578] truncate flex items-center gap-1.5">
                      <span>{currentThread.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Online
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium truncate">
                      {currentThread.roleDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium shrink-0">
                  <span className="hidden sm:inline">Acompanhamento do Ian</span>
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-400" />
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-gradient-to-b from-[#F5FBFF]/60 via-white to-white">
                {currentThread.msgs.map((m) => {
                  const isMe = m.from === 'me';
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-gray-400 font-bold mb-1 px-1">
                        {m.senderName}
                      </span>
                      <div
                        className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-[#1E5FA6] text-white rounded-br-xs'
                            : 'bg-[#EAF5FC] text-gray-800 rounded-bl-xs border border-blue-100'
                        }`}
                      >
                        {m.text}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 px-1 font-mono">
                        <span>{m.time}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#1E5FA6]" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Reply Pills */}
              <div className="px-4 py-2 border-t border-gray-100 bg-[#FBFDFF] overflow-x-auto flex items-center gap-1.5 no-scrollbar">
                <span className="text-[10px] font-bold text-gray-400 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#1E5FA6]" />
                  <span>Respostas Rápidas:</span>
                </span>
                {quickPills.map((pill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sendMessage(currentThread.id, pill);
                      showToast('Mensagem enviada com sucesso!', 'heart');
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 border border-blue-100 text-[11px] font-semibold text-gray-700 hover:text-[#1E5FA6] transition-all shrink-0 cursor-pointer shadow-2xs"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Audio recording bar or text input */}
              {isRecordingAudio ? (
                <div className="p-3.5 sm:p-4 border-t border-red-100 bg-red-50/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-red-700 text-xs font-bold animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-red-600"></span>
                    <span>Gravando áudio de voz para a equipe: 00:{audioSeconds < 10 ? `0${audioSeconds}` : audioSeconds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelRecord}
                      className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSendVoiceAudio}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Áudio</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-gray-100 bg-white flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleRecord}
                    title="Gravar áudio de voz"
                    className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl border border-gray-200 transition-all cursor-pointer shrink-0"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Escreva uma mensagem instantânea para ${currentThread.name}...`}
                    className="flex-1 bg-gray-50/90 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white transition-all"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="px-4 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] disabled:opacity-40 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-blue-900/10 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </form>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
