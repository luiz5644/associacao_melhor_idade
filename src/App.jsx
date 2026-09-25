import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ActivitiesPage from './pages/ActivitiesPage';
import CalendarPage from './pages/CalendarPage';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/AdminPage';
import DonationModal from './components/DonationModal';
import ScheduleModal from './components/ScheduleModal';
import ImageLightbox from './components/ImageLightbox';
import { siteData } from './data/mockData';

function AppContent() {
  const [activePage, setActivePage] = useState('home');

  // Modals state
  const [donationModal, setDonationModal] = useState({ isOpen: false, mode: 'pix' });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleOpenPixDonation = () => setDonationModal({ isOpen: true, mode: 'pix' });
  const handleOpenSponsorModal = () => setDonationModal({ isOpen: true, mode: 'sponsor' });
  const handleCloseDonationModal = () => setDonationModal(prev => ({ ...prev, isOpen: false }));

  // Função centralizada para mudar de página e zerar o scroll de todos os possíveis containers
  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;

    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.scrollTop = 0;
  };

  const handleSelectActivityFromFooter = (actId) => {
    const act = siteData.activities.items.find(item => item.id === actId);
    if (act) {
      setSelectedActivity(act);
    }
  };

  // Página de Admin ocupa a tela inteira sem header/footer
  if (activePage === 'admin') {
    return (
      <AdminPage onClose={() => handleNavigate('home')} />
    );
  }

  return (
    <div className="app-container">
      {/* 2. Header de Navegação */}
      <Header 
        activePage={activePage}
        setActivePage={handleNavigate}
        onOpenAdmin={() => handleNavigate('admin')}
      />

      {/* 3. Renderização Dinâmica das Páginas */}
      <main className="main-content" id="main-content">
        {activePage === 'home' && (
          <HomePage 
            onNavigate={handleNavigate}
            onOpenDonation={handleOpenPixDonation}
            onOpenSponsorModal={handleOpenSponsorModal}
            onSelectPhoto={setSelectedPhoto}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage 
            onSelectPhoto={setSelectedPhoto}
            onOpenDonation={handleOpenPixDonation}
          />
        )}

        {activePage === 'activities' && (
          <ActivitiesPage 
            onOpenSchedule={setSelectedActivity}
          />
        )}

        {activePage === 'calendar' && (
          <CalendarPage />
        )}

        {activePage === 'gallery' && (
          <GalleryPage 
            onSelectPhoto={setSelectedPhoto}
          />
        )}
      </main>

      {/* 4. Rodapé Global */}
      <Footer 
        onNavigatePage={handleNavigate}
        onSelectActivity={handleSelectActivityFromFooter}
      />

      {/* 5. Modais Globais */}
      <DonationModal 
        isOpen={donationModal.isOpen}
        mode={donationModal.mode}
        onClose={handleCloseDonationModal}
      />

      <ScheduleModal 
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      <ImageLightbox 
        photo={selectedPhoto}
        photosList={siteData.gallery.items}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={setSelectedPhoto}
      />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}