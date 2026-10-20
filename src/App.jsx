import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ActivitiesPage from './pages/ActivitiesPage';
import CalendarPage from './pages/CalendarPage';
import GalleryPage from './pages/GalleryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AdminPage from './pages/AdminPage';
import DonationModal from './components/DonationModal';
import ScheduleModal from './components/ScheduleModal';
import ImageLightbox from './components/ImageLightbox';
import { useData } from './context/DataContext';
import DonationBanner from './components/DonationBanner';
import { siteData } from './data/mockData';

const donationBanners = {
  home: {
    title: siteData.home.cta.title,
    description: siteData.home.cta.description
  },
  activities: {
    title: 'Ajude a manter as oficinas funcionando',
    description: 'Sua doação ou seu trabalho voluntário ajudam a manter e ampliar nossas oficinas e atividades.'
  },
  gallery: {
    title: 'Esses sorrisos dependem de você',
    description: 'Cada momento feliz acontece com o apoio de quem doa ou oferece seu tempo como voluntário.'
  },
  calendar: {
    title: 'Ajude a organizar o próximo passeio',
    description: 'Sua contribuição ajuda a realizar passeios, encontros e eventos da nossa programação.'
  },
  testimonials: {
    title: 'Faça parte dessa história',
    description: 'Contribua para que mais idosos vivam experiências especiais como as que você conheceu aqui.'
  }
};

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const { galleryItems, activities } = useData();

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
    const act = activities.find(item => item.id === actId);
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
            onSelectPhoto={setSelectedPhoto}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage 
            onSelectPhoto={setSelectedPhoto}
            onOpenSponsorModal={handleOpenSponsorModal}
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

                {activePage === 'testimonials' && (
                  <TestimonialsPage />
                )}
              </main>

      {donationBanners[activePage] && (
        <DonationBanner
          {...donationBanners[activePage]}
          onOpenDonation={handleOpenPixDonation}
        />
      )}

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
        photosList={galleryItems}
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
