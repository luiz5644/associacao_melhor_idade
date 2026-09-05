import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteData } from '../data/mockData';

const STORAGE_KEY_GALLERY = 'ami_gallery_items_v1';
const STORAGE_KEY_CALENDAR = 'ami_calendar_events_v1';
const STORAGE_KEY_HIGHLIGHTS = 'ami_calendar_highlights_v1';
const STORAGE_KEY_BRAND = 'ami_brand_info_v1';
const STORAGE_KEY_SPONSORS = 'ami_sponsors_v1';

const DataContext = createContext(null);

function seedCalendarEvents() {
  return siteData.calendar.eventsOctober2026.map((ev, index) => ({
    id: `cal-seed-${index + 1}`,
    year: 2026,
    month: 9,
    day: ev.day,
    time: ev.time,
    title: ev.title,
    category: ev.category,
    desc: ev.desc,
    location: 'Sede da Associação',
    isHighlight: index < 3
  }));
}

export function DataProvider({ children }) {
  const [galleryItems, setGalleryItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return siteData.gallery.items;
  });

  const [calendarEvents, setCalendarEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CALENDAR);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return seedCalendarEvents();
  });

  const [calendarHighlights, setCalendarHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIGHLIGHTS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return siteData.calendar.highlights;
  });

  const [brandInfo, setBrandInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRAND);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return siteData.brand;
  });

  const [sponsors, setSponsors] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPONSORS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return siteData.sponsors || [];
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(galleryItems)); } catch (_) {}
  }, [galleryItems]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(calendarEvents)); } catch (_) {}
  }, [calendarEvents]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_HIGHLIGHTS, JSON.stringify(calendarHighlights)); } catch (_) {}
  }, [calendarHighlights]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_BRAND, JSON.stringify(brandInfo)); } catch (_) {}
  }, [brandInfo]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_SPONSORS, JSON.stringify(sponsors)); } catch (_) {}
  }, [sponsors]);

  // ── CRUD: Álbum de Lembranças ──────────────────────────────────────
  const addGalleryItem = (itemData) => {
    const photos = Array.isArray(itemData.photos) && itemData.photos.length > 0
      ? itemData.photos
      : [itemData.image].filter(Boolean);
    const newItem = {
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      photos,
      image: photos[0] || 'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=900',
      title: itemData.title.trim(),
      subtitle: itemData.date || 'Lembrança Especial',
      date: itemData.date || new Date().toISOString().split('T')[0],
      category: itemData.category || 'Celebracoes',
      description: itemData.description || '',
    };
    setGalleryItems(prev => [newItem, ...prev]);
    showToast('Lembrança adicionada ao álbum com sucesso!', 'success');
    return newItem;
  };

  const updateGalleryItem = (id, updatedData) => {
    setGalleryItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const photos = Array.isArray(updatedData.photos) && updatedData.photos.length > 0
        ? updatedData.photos : [updatedData.image || item.image];
      return {
        ...item,
        ...updatedData,
        photos,
        image: photos[0] || item.image,
        subtitle: updatedData.date || item.subtitle,
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('Lembrança atualizada com sucesso!', 'info');
  };

  const deleteGalleryItem = (id) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    showToast('Lembrança removida do álbum.', 'warning');
  };

  // ── CRUD: Calendário de Atividades ────────────────────────────────
  const MONTH_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const CAT_COLORS = { Música: '#E8A87C', Coral: '#2A5C66', Lazer: '#3D6058', Artes: '#7B5EA7', Saúde: '#4A9B6F' };

  const addCalendarEvent = (eventData) => {
    const newEvent = {
      id: `cal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      year: parseInt(eventData.year || 2026, 10),
      month: parseInt(eventData.month !== undefined ? eventData.month : 9, 10),
      day: parseInt(eventData.day || 1, 10),
      time: eventData.time || '14:00',
      title: eventData.title.trim(),
      category: eventData.category || 'Lazer',
      desc: eventData.desc || '',
      location: eventData.location || 'Sede da Associação',
      isHighlight: Boolean(eventData.isHighlight)
    };
    setCalendarEvents(prev => [...prev, newEvent]);

    if (newEvent.isHighlight) {
      const newHighlight = {
        id: `hl-${newEvent.id}`,
        dateLabel: `${newEvent.day} de ${MONTH_SHORT[newEvent.month]} - ${newEvent.time}`,
        category: newEvent.category,
        title: newEvent.title,
        description: newEvent.desc,
        color: CAT_COLORS[newEvent.category] || '#2A5C66'
      };
      setCalendarHighlights(prev => [newHighlight, ...prev]);
    }
    showToast('Atividade agendada no calendário com sucesso!', 'success');
    return newEvent;
  };

  const updateCalendarEvent = (id, updatedData) => {
    setCalendarEvents(prev => prev.map(ev => {
      if (ev.id !== id) return ev;
      return {
        ...ev,
        ...updatedData,
        year: parseInt(updatedData.year !== undefined ? updatedData.year : ev.year, 10),
        month: parseInt(updatedData.month !== undefined ? updatedData.month : ev.month, 10),
        day: parseInt(updatedData.day !== undefined ? updatedData.day : ev.day, 10),
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('Atividade do calendário atualizada!', 'info');
  };

  const deleteCalendarEvent = (id) => {
    setCalendarEvents(prev => prev.filter(ev => ev.id !== id));
    setCalendarHighlights(prev => prev.filter(hl => hl.id !== `hl-${id}`));
    showToast('Atividade removida do calendário.', 'warning');
  };

  // ── CRUD: Patrocinadores & Parceiros ─────────────────────────────
  const addSponsor = (sponsorData) => {
    const newSponsor = {
      id: `sp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: sponsorData.name.trim(),
      logo: sponsorData.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400&auto=format&fit=crop',
      category: sponsorData.category || 'Apoiador Comunitário',
      websiteUrl: sponsorData.websiteUrl ? (sponsorData.websiteUrl.startsWith('http') ? sponsorData.websiteUrl : `https://${sponsorData.websiteUrl}`) : '',
      description: sponsorData.description ? sponsorData.description.trim() : '',
      active: sponsorData.active !== undefined ? Boolean(sponsorData.active) : true
    };
    setSponsors(prev => [newSponsor, ...prev]);
    showToast(`Patrocinador "${newSponsor.name}" cadastrado com sucesso!`, 'success');
    return newSponsor;
  };

  const updateSponsor = (id, updatedData) => {
    setSponsors(prev => prev.map(sp => {
      if (sp.id !== id) return sp;
      return {
        ...sp,
        ...updatedData,
        name: updatedData.name ? updatedData.name.trim() : sp.name,
        websiteUrl: updatedData.websiteUrl ? (updatedData.websiteUrl.startsWith('http') ? updatedData.websiteUrl : `https://${updatedData.websiteUrl}`) : '',
        description: updatedData.description !== undefined ? updatedData.description.trim() : sp.description,
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('Dados do patrocinador atualizados com sucesso!', 'info');
  };

  const deleteSponsor = (id) => {
    setSponsors(prev => prev.filter(sp => sp.id !== id));
    showToast('Patrocinador removido com sucesso.', 'warning');
  };

  const updateBrandInfo = (newInfo) => {
    setBrandInfo(prev => ({ ...prev, ...newInfo }));
    showToast('Informações da Associação salvas com sucesso!', 'success');
  };

  const resetToDefaultData = () => {
    [STORAGE_KEY_GALLERY, STORAGE_KEY_CALENDAR, STORAGE_KEY_HIGHLIGHTS, STORAGE_KEY_BRAND, STORAGE_KEY_SPONSORS]
      .forEach(k => localStorage.removeItem(k));
    setGalleryItems(siteData.gallery.items);
    setCalendarEvents(seedCalendarEvents());
    setCalendarHighlights(siteData.calendar.highlights);
    setBrandInfo(siteData.brand);
    setSponsors(siteData.sponsors || []);
    showToast('Dados restaurados para o padrão original!', 'info');
  };

  return (
    <DataContext.Provider value={{
      galleryItems, calendarEvents, calendarHighlights, brandInfo, sponsors, toast,
      addGalleryItem, updateGalleryItem, deleteGalleryItem,
      addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
      addSponsor, updateSponsor, deleteSponsor,
      updateBrandInfo, resetToDefaultData, showToast
    }}>
      {children}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`} key={toast.id} role="status">
          <span className="toast-icon">
            {toast.type === 'success' && '✓'}
            {toast.type === 'info' && 'ℹ'}
            {toast.type === 'warning' && '⚠'}
          </span>
          <span className="toast-text">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)} aria-label="Fechar">×</button>
        </div>
      )}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve ser utilizado dentro de um DataProvider');
  return context;
}
