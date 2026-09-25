import React, { useState, useLayoutEffect } from 'react';
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

  // Toda troca de página começa no topo, instantâneo (sem animação)
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  // Modals state
  const [donationModal, setDonationModal] = useState({ isOpen: false, mode: 'pix' });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleOpenPixDonation = () => setDonationModal({ isOpen: true, mode: 'pix' });
  const handleOpenSponsorModal = () => setDonationModal({ isOpen: true, mode: 'sponsor' });
  const handleCloseDonationModal = () => setDonationModal(prev => ({ ...prev, isOpen: false }));

  const handleSelectActivityFromFooter = (actId) => {
    const act = siteData.activities.items.find(item => item.id === actId);
    if (act) {
      setSelectedActivity(act);
    }
  };

  // Página de Admin ocupa a tela inteira sem header/footer
  if (activePage === 'admin') {
    return (
      <AdminPage onClose={() => setActivePage('home')} />
    );
  }

  return (
    <div className="app-container">


      {/* 2. Header de Navegação */}
      <Header 
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAdmin={() => setActivePage('admin')}
      />

      {/* 3. Renderização Dinâmica das Páginas */}
      <main className="main-content" id="main-content">
        {activePage === 'home' && (
          <HomePage 
            onNavigate={setActivePage}
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
        onNavigatePage={setActivePage}
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
