import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { SessionHistoryModal } from './components/SessionHistoryModal';
import { AddAchievementModal } from './components/AddAchievementModal';
import { MediaViewerModal } from './components/MediaViewerModal';
import { ExportSummaryModal } from './components/ExportSummaryModal';

import { DashboardPage } from './pages/DashboardPage';
import { TherapiesPage } from './pages/TherapiesPage';
import { SchoolPage } from './pages/SchoolPage';
import { AgendaPage } from './pages/AgendaPage';
import { EvolutionPage } from './pages/EvolutionPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { DiaryPage } from './pages/DiaryPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { MessagesPage } from './pages/MessagesPage';
import { MediaPage } from './pages/MediaPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { AdminGuard } from './components/AdminGuard';
import { ObservationsPage } from './pages/ObservationsPage';

import { Professional, MediaRecord } from './types';
import { X, Settings, Image, BookHeart, FileText, Shield, Sparkles, Eye } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isLoggedIn, currentPage, setCurrentPage } = useApp();

  // Modals state
  const [selectedProfessionalForModal, setSelectedProfessionalForModal] = useState<Professional | null>(null);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaRecord | null>(null);
  const [mobileMoreDrawerOpen, setMobileMoreDrawerOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  const handleOpenSessionModal = (prof?: Professional) => {
    setSelectedProfessionalForModal(prof || null);
    setSessionModalOpen(true);
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onOpenSessionModal={handleOpenSessionModal}
            onOpenAchievementModal={() => setAchievementModalOpen(true)}
          />
        );
      case 'terapias':
        return <TherapiesPage onOpenSessionModal={handleOpenSessionModal} />;
      case 'escola':
        return <SchoolPage />;
      case 'agenda':
        return <AgendaPage />;
      case 'observacoes':
        return <ObservationsPage />;
      case 'evolucao':
        return <EvolutionPage />;
      case 'conquistas':
        return <AchievementsPage onOpenAchievementModal={() => setAchievementModalOpen(true)} />;
      case 'diario':
        return <DiaryPage />;
      case 'documentos':
        return <DocumentsPage />;
      case 'mensagens':
        return <MessagesPage />;
      case 'midia':
        return <MediaPage onSelectMedia={(med) => setSelectedMedia(med)} />;
      case 'configuracoes':
        return <SettingsPage />;
      case 'admin':
        return (
          <AdminGuard>
            <AdminPage />
          </AdminGuard>
        );
      default:
        return (
          <DashboardPage
            onOpenSessionModal={handleOpenSessionModal}
            onOpenAchievementModal={() => setAchievementModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#EAF5FC] via-[#F5FBFF] to-[#EAF5FC] text-[#2E3A4A]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen z-20">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Topbar
          onOpenExportModal={() => setExportModalOpen(true)}
          onOpenNewAchievementModal={() => setAchievementModalOpen(true)}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenMore={() => setMobileMoreDrawerOpen(true)} />

      {/* Mobile "More" Bottom Sheet */}
      {mobileMoreDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs md:hidden">
          <div className="bg-white rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom-full duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-heading font-bold text-base text-[#154578]">Mais Acessos</span>
              <button
                onClick={() => setMobileMoreDrawerOpen(false)}
                className="text-gray-400 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-gray-700">
              <button
                onClick={() => { setCurrentPage('observacoes'); setMobileMoreDrawerOpen(false); }}
                className="flex items-center gap-2 p-3 rounded-2xl bg-blue-50 text-[#154578] border border-blue-100"
              >
                <Eye className="w-4 h-4 text-[#1E5FA6]" />
                <span>Observações</span>
              </button>

              <button
                onClick={() => { setCurrentPage('diario'); setMobileMoreDrawerOpen(false); }}
                className="flex items-center gap-2 p-3 rounded-2xl bg-pink-50 text-pink-950 border border-pink-100"
              >
                <BookHeart className="w-4 h-4 text-pink-500" />
                <span>Diário Familiar</span>
              </button>

              <button
                onClick={() => { setCurrentPage('midia'); setMobileMoreDrawerOpen(false); }}
                className="flex items-center gap-2 p-3 rounded-2xl bg-blue-50 text-[#154578] border border-blue-100"
              >
                <Image className="w-4 h-4 text-[#1E5FA6]" />
                <span>Memórias & Fotos</span>
              </button>

              <button
                onClick={() => { setCurrentPage('documentos'); setMobileMoreDrawerOpen(false); }}
                className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-100"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Documentos & PEI</span>
              </button>

              <button
                onClick={() => { setCurrentPage('configuracoes'); setMobileMoreDrawerOpen(false); }}
                className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50 text-gray-800 border border-gray-200"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span>Configurações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      {sessionModalOpen && (
        <SessionHistoryModal
          professional={selectedProfessionalForModal}
          onClose={() => setSessionModalOpen(false)}
        />
      )}

      {achievementModalOpen && (
        <AddAchievementModal
          onClose={() => setAchievementModalOpen(false)}
        />
      )}

      {selectedMedia && (
        <MediaViewerModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}

      {exportModalOpen && (
        <ExportSummaryModal
          onClose={() => setExportModalOpen(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
