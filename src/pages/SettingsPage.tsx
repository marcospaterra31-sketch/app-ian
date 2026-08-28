import React, { useState } from 'react';
import { useApp, getRoleLabel } from '../context/AppContext';
import { Settings, RefreshCw, Save, User, Heart, Bell, Shield, Key } from 'lucide-react';
import { IAN_OFFICIAL_PHOTO } from '../data/initialData';
import ianPhoto from '../assets/images/ian_sorrindo_real_1787837860779.jpg';

export const SettingsPage: React.FC = () => {
  const { child, updateChild, resetAllData, currentRole, switchRole } = useApp();

  const [name, setName] = useState(child.name);
  const [parents, setParents] = useState(child.parents);
  const [age, setAge] = useState(child.age);
  const [diagnosis, setDiagnosis] = useState(child.diagnosis);
  const [bloodType, setBloodType] = useState(child.bloodType);
  const [emergencyContact, setEmergencyContact] = useState(child.emergencyContact);
  const [allergies, setAllergies] = useState(child.allergies);
  const [photoUrl, setPhotoUrl] = useState(child.photoUrl || '');

  // Notification toggles state
  const [notifySessions, setNotifySessions] = useState(true);
  const [notifyAchievements, setNotifyAchievements] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);

  const handleSaveChildInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateChild({
      name,
      parents,
      age,
      diagnosis,
      bloodType,
      emergencyContact,
      allergies,
      photoUrl: photoUrl.trim() || undefined
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setPhotoUrl(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#154578]">
          Configurações da Plataforma ⚙️
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Gerenciamento do prontuário do Ian, preferências de notificação e perfil ativo.
        </p>
      </div>

      {/* Profile Info Form */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E5FA6] flex items-center justify-center font-bold">
            👶
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Ficha de Identificação do Ian
            </h2>
            <p className="text-xs text-gray-500">
              Dados cadastrais compartilhados com a equipe clínica e pedagógica.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveChildInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nome da Criança</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Pais / Responsáveis</label>
              <input
                type="text"
                required
                value={parents}
                onChange={(e) => setParents(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Idade</label>
              <input
                type="text"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Diagnóstico / Observações de Suporte</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Contato de Emergência</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tipo Sanguíneo</label>
              <input
                type="text"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Alergias Conhecidas</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#1E5FA6] focus:bg-white"
              />
            </div>
          </div>

          {/* Foto Oficial do Ian */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Foto de Perfil & Avatar Inicial do Ian
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1E5FA6] shadow-sm bg-white shrink-0">
                <img
                  src={photoUrl || child.photoUrl || IAN_OFFICIAL_PHOTO || ianPhoto}
                  alt={child.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = ianPhoto;
                  }}
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="URL da imagem (ex: https://.../ian03.png ou /ian03.png)"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-800 focus:outline-none focus:border-[#1E5FA6]"
                  />
                  <label className="px-3 py-2 bg-white border border-blue-200 hover:bg-blue-50 text-[#1E5FA6] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-2xs">
                    <span>Selecionar do Celular/PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-gray-500">
                  Se você subiu a foto para a Hostinger, pode digitar o caminho relativo como <code>/ian03.png</code> ou o link completo do seu site <code>https://seusite.com.br/ian03.png</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E5FA6] hover:bg-[#154578] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações da Ficha</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notifications and Preferences */}
      <div className="bg-white border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <Bell className="w-5 h-5 text-[#1E5FA6]" />
          <div>
            <h2 className="font-heading text-lg font-bold text-[#154578]">
              Preferências de Notificações
            </h2>
            <p className="text-xs text-gray-500">
              Escolha quais atualizações geram alertas e avisos imediatos.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50/50 transition-colors">
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              Novas sessões de terapia registradas
            </span>
            <input
              type="checkbox"
              checked={notifySessions}
              onChange={(e) => setNotifySessions(e.target.checked)}
              className="w-4 h-4 accent-[#1E5FA6] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50/50 transition-colors">
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              Novas conquistas adicionadas pela família ou escola
            </span>
            <input
              type="checkbox"
              checked={notifyAchievements}
              onChange={(e) => setNotifyAchievements(e.target.checked)}
              className="w-4 h-4 accent-[#1E5FA6] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50/50 transition-colors">
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              Mensagens diretas nos canais de comunicação
            </span>
            <input
              type="checkbox"
              checked={notifyMessages}
              onChange={(e) => setNotifyMessages(e.target.checked)}
              className="w-4 h-4 accent-[#1E5FA6] rounded"
            />
          </label>
        </div>
      </div>

      {/* Demo Reset Options */}
      <div className="bg-white border border-rose-100 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-rose-950">
              Restaurar Dados de Demonstração
            </h2>
            <p className="text-xs text-gray-500">
              Caso queira recarregar os dados iniciais do protótipo com todas as sessões e conquistas padrão.
            </p>
          </div>
          <button
            onClick={resetAllData}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors border border-rose-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restaurar Padrão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
