import React, { useState, useEffect } from 'react';
import AccessibilityBar from './components/AccessibilityBar';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ActivitiesPage from './pages/ActivitiesPage';
import CalendarPage from './pages/CalendarPage';
import GalleryPage from './pages/GalleryPage';
import DonationModal from './components/DonationModal';
import ScheduleModal from './components/ScheduleModal';
import AdminModal from './components/AdminModal';
import ImageLightbox from './components/ImageLightbox';
import { siteData } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [fontSizeLevel, setFontSizeLevel] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Modals state
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Eventos adicionados dinamicamente via painel admin
  const [dynamicEvents, setDynamicEvents] = useState([]);

  // Aplica classes de acessibilidade ao body
  useEffect(() => {
    document.body.classList.remove('font-lg', 'font-xl', 'high-contrast');
    if (fontSizeLevel === 'lg') document.body.classList.add('font-lg');
    if (fontSizeLevel === 'xl') document.body.classList.add('font-xl');
    if (highContrast) document.body.classList.add('high-contrast');
  }, [fontSizeLevel, highContrast]);

  const handleAddAdminEvent = (newEvent) => {
    setDynamicEvents(prev => [...prev, newEvent]);
  };

  const handleSelectActivityFromFooter = (actId) => {
    const act = siteData.activities.items.find(item => item.id === actId);
    if (act) {
      setSelectedActivity(act);
    }
  };

  return (
    <div className="app-container">
      {/* 1. Barra de Acessibilidade */}
      <AccessibilityBar 
        fontSizeLevel={fontSizeLevel}
        setFontSizeLevel={setFontSizeLevel}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* 2. Header de Navegação */}
      <Header 
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 3. Renderização Dinâmica das Páginas */}
      <main className="main-content" id="main-content">
        {activePage === 'home' && (
          <HomePage 
            onNavigate={setActivePage}
            onOpenDonation={() => setIsDonationOpen(true)}
            onSelectPhoto={setSelectedPhoto}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage 
            onSelectPhoto={setSelectedPhoto}
          />
        )}

        {activePage === 'activities' && (
          <ActivitiesPage 
            onOpenSchedule={setSelectedActivity}
          />
        )}

        {activePage === 'calendar' && (
          <CalendarPage 
            dynamicEvents={dynamicEvents}
          />
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
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />

      <ScheduleModal 
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      <AdminModal 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onAddEvent={handleAddAdminEvent}
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
