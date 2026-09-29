import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { siteData } from '../data/mockData';
import {
  adminApi,
  categoriaApi,
  atividadeApi,
  checkBackendHealth,
  adaptAtividadeToFrontend,
  adaptAtividadeToBackend,
} from '../services/api';

const STORAGE_KEY_GALLERY = 'ami_gallery_items_v1';
const STORAGE_KEY_CALENDAR = 'ami_calendar_events_v1';
const STORAGE_KEY_HIGHLIGHTS = 'ami_calendar_highlights_v1';
const STORAGE_KEY_BRAND = 'ami_brand_info_v1';
const STORAGE_KEY_SPONSORS = 'ami_sponsors_v1';
const STORAGE_KEY_TESTIMONIALS = 'ami_testimonials_v1';
const STORAGE_KEY_CATEGORIES = 'ami_categories_v1';

const DataContext = createContext(null);

const DEFAULT_CATEGORIES = [
  { id: 1, nome: 'Música' },
  { id: 2, nome: 'Coral' },
  { id: 3, nome: 'Lazer' },
  { id: 4, nome: 'Artes' },
  { id: 5, nome: 'Saúde' },
  { id: 6, nome: 'Dança' },
  { id: 7, nome: 'Festas' },
];

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
    isHighlight: index < 3,
    status: 'ativo',
  }));
}

export function DataProvider({ children }) {
  // Estado de conexão com backend
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendLoading, setBackendLoading] = useState(true);

  // Categorias do calendário (do backend / fallback local)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_CATEGORIES;
  });

  // Administradores (do backend)
  const [admins, setAdmins] = useState([]);

  // Dados com persistência local (fallback / entidades não implementadas no backend)
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

  const [testimonials, setTestimonials] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TESTIMONIALS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return siteData.testimonials.items;
  });

  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Salvar caches locais ───────────────────────────────────────────
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

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(testimonials)); } catch (_) {}
  }, [testimonials]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories)); } catch (_) {}
  }, [categories]);

  // ── Sincronização inicial com o Backend (se ativo na porta 3000) ────
  const checkAndSyncBackend = useCallback(async (silent = false) => {
    setBackendLoading(true);
    try {
      const isOnline = await checkBackendHealth();
      setBackendConnected(isOnline);

      if (isOnline) {
        // Carrega categorias do backend
        let loadedCats = [];
        try {
          const catsData = await categoriaApi.list();
          if (Array.isArray(catsData) && catsData.length > 0) {
            loadedCats = catsData;
            setCategories(catsData);
          }
        } catch (err) {
          console.warn('[Backend] Erro ao carregar categorias:', err);
        }

        // Carrega atividades do calendário do backend
        try {
          const ativsData = await atividadeApi.list();
          if (Array.isArray(ativsData) && ativsData.length > 0) {
            const adapted = ativsData.map(a => adaptAtividadeToFrontend(a, loadedCats.length ? loadedCats : categories));
            setCalendarEvents(adapted);

            // Atualiza highlights
            const hl = adapted.filter(a => a.isHighlight).map(a => ({
              id: `hl-${a.id}`,
              dateLabel: `${a.day} de Outubro - ${a.time}`,
              category: a.category,
              title: a.title,
              description: a.desc,
              color: '#2A5C66',
            }));
            if (hl.length > 0) setCalendarHighlights(hl);
          }
        } catch (err) {
          console.warn('[Backend] Erro ao carregar atividades:', err);
        }

        if (!silent) {
          showToast('Conectado com sucesso ao backend (porta 3000)!', 'success');
        }
      } else {
        if (!silent) {
          showToast('Backend offline. Operando em modo de dados locais.', 'info');
        }
      }
    } catch (err) {
      setBackendConnected(false);
      if (!silent) {
        showToast('Backend inacessível. Usando armazenamento local.', 'info');
      }
    } finally {
      setBackendLoading(false);
    }
  }, [categories, showToast]);

  useEffect(() => {
    checkAndSyncBackend(true);
  }, []);

  // ── Gestão de Categorias (Backend + Local) ─────────────────────────
  const addCategory = async (nome) => {
    const nomeTrimmed = nome.trim();
    if (!nomeTrimmed) return;

    if (backendConnected) {
      try {
        await categoriaApi.create(nomeTrimmed);
        const updated = await categoriaApi.list();
        setCategories(updated);
        showToast(`Categoria "${nomeTrimmed}" salva no backend!`, 'success');
        return;
      } catch (err) {
        console.error('Erro ao salvar categoria no backend:', err);
        showToast('Erro ao salvar categoria no backend. Salvando localmente.', 'warning');
      }
    }

    const newCat = { id: Date.now(), nome: nomeTrimmed };
    setCategories(prev => [...prev, newCat]);
    showToast(`Categoria "${nomeTrimmed}" adicionada!`, 'success');
  };

  const updateCategory = async (id, nome) => {
    const nomeTrimmed = nome.trim();
    if (!nomeTrimmed) return;

    if (backendConnected) {
      try {
        await categoriaApi.update(id, nomeTrimmed);
        const updated = await categoriaApi.list();
        setCategories(updated);
        showToast('Categoria atualizada no backend!', 'info');
        return;
      } catch (err) {
        console.error('Erro ao atualizar categoria no backend:', err);
        showToast('Erro ao atualizar no backend. Atualizando localmente.', 'warning');
      }
    }

    setCategories(prev => prev.map(c => c.id === id ? { ...c, nome: nomeTrimmed } : c));
    showToast('Categoria atualizada!', 'info');
  };

  const deleteCategory = async (id) => {
    if (backendConnected) {
      try {
        await categoriaApi.delete(id);
        const updated = await categoriaApi.list();
        setCategories(updated);
        showToast('Categoria removida do backend!', 'warning');
        return;
      } catch (err) {
        console.error('Erro ao deletar categoria no backend:', err);
        showToast('Erro ao remover no backend. Removendo localmente.', 'warning');
      }
    }

    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Categoria removida.', 'warning');
  };

  // ── Gestão de Administradores (Backend) ────────────────────────────
  const fetchAdmins = async () => {
    if (!backendConnected) return [];
    try {
      const data = await adminApi.list();
      setAdmins(data);
      return data;
    } catch (err) {
      console.warn('Erro ao listar administradores:', err);
      return [];
    }
  };

  const addAdmin = async (data) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível cadastrar admin no banco.', 'warning');
      return;
    }
    try {
      await adminApi.create(data);
      await fetchAdmins();
      showToast('Administrador cadastrado com sucesso!', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao cadastrar administrador', 'warning');
      throw err;
    }
  };

  const updateAdmin = async (id, data) => {
    if (!backendConnected) return;
    try {
      await adminApi.update(id, data);
      await fetchAdmins();
      showToast('Administrador atualizado com sucesso!', 'info');
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar administrador', 'warning');
      throw err;
    }
  };

  const deleteAdmin = async (id) => {
    if (!backendConnected) return;
    try {
      await adminApi.delete(id);
      await fetchAdmins();
      showToast('Administrador removido com sucesso!', 'warning');
    } catch (err) {
      showToast(err.message || 'Erro ao remover administrador', 'warning');
      throw err;
    }
  };

  // ── CRUD: Álbum de Lembranças (Galeria) ─────────────────────────────
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

  // ── CRUD: Calendário de Atividades (Integrado com Backend) ──────────
  const MONTH_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const CAT_COLORS = { Música: '#E8A87C', Coral: '#2A5C66', Lazer: '#3D6058', Artes: '#7B5EA7', Saúde: '#4A9B6F' };

  const addCalendarEvent = async (eventData) => {
    let newEvent = {
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
      isHighlight: Boolean(eventData.isHighlight),
      status: eventData.status || 'ativo',
    };

    if (backendConnected) {
      try {
        const payload = adaptAtividadeToBackend(newEvent, categories);
        await atividadeApi.create(payload);
        const ativs = await atividadeApi.list();
        if (Array.isArray(ativs) && ativs.length > 0) {
          const adapted = ativs.map(a => adaptAtividadeToFrontend(a, categories));
          setCalendarEvents(adapted);
          showToast('Atividade salva com sucesso no banco de dados!', 'success');
          return;
        }
      } catch (err) {
        console.error('Erro ao salvar atividade no backend:', err);
        showToast('Erro no backend ao agendar. Salvo em armazenamento local.', 'warning');
      }
    }

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

  const updateCalendarEvent = async (id, updatedData) => {
    // Tenta atualizar no backend se tiver ID numérico
    if (backendConnected) {
      const numericId = typeof id === 'number' ? id : parseInt(String(id).replace('cal-', ''), 10);
      if (!isNaN(numericId) && numericId > 0 && !String(id).includes('seed')) {
        try {
          const payload = adaptAtividadeToBackend({ ...updatedData, id: numericId }, categories);
          await atividadeApi.update(numericId, payload);
          const ativs = await atividadeApi.list();
          const adapted = ativs.map(a => adaptAtividadeToFrontend(a, categories));
          setCalendarEvents(adapted);
          showToast('Atividade atualizada com sucesso no backend!', 'info');
          return;
        } catch (err) {
          console.error('Erro ao atualizar no backend:', err);
          showToast('Erro no backend. Atualizando localmente.', 'warning');
        }
      }
    }

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

  const deleteCalendarEvent = async (id) => {
    if (backendConnected) {
      const numericId = typeof id === 'number' ? id : parseInt(String(id).replace('cal-', ''), 10);
      if (!isNaN(numericId) && numericId > 0 && !String(id).includes('seed')) {
        try {
          await atividadeApi.delete(numericId);
          const ativs = await atividadeApi.list();
          const adapted = ativs.map(a => adaptAtividadeToFrontend(a, categories));
          setCalendarEvents(adapted);
          setCalendarHighlights(prev => prev.filter(hl => hl.id !== `hl-${id}`));
          showToast('Atividade excluída com sucesso do backend!', 'warning');
          return;
        } catch (err) {
          console.error('Erro ao deletar no backend:', err);
          showToast('Erro ao remover no backend. Removendo localmente.', 'warning');
        }
      }
    }

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

  // ── CRUD: Depoimentos ─────────────────────────────────────────────
  const addTestimonial = (testimonialData) => {
    const newTestimonial = {
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: testimonialData.name.trim(),
      role: testimonialData.role || '',
      avatar: testimonialData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      text: testimonialData.text.trim()
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
    showToast('Depoimento adicionado com sucesso!', 'success');
    return newTestimonial;
  };

  const updateTestimonial = (id, updatedData) => {
    setTestimonials(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        ...updatedData,
        name: updatedData.name ? updatedData.name.trim() : t.name,
        role: updatedData.role !== undefined ? updatedData.role : t.role,
        avatar: updatedData.avatar || t.avatar,
        text: updatedData.text ? updatedData.text.trim() : t.text,
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('Depoimento atualizado com sucesso!', 'info');
  };

  const deleteTestimonial = (id) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    showToast('Depoimento removido.', 'warning');
  };

  const updateBrandInfo = (newInfo) => {
    setBrandInfo(prev => ({ ...prev, ...newInfo }));
    showToast('Informações da Associação salvas com sucesso!', 'success');
  };

  const resetToDefaultData = () => {
    [STORAGE_KEY_GALLERY, STORAGE_KEY_CALENDAR, STORAGE_KEY_HIGHLIGHTS, STORAGE_KEY_BRAND, STORAGE_KEY_SPONSORS, STORAGE_KEY_TESTIMONIALS, STORAGE_KEY_CATEGORIES]
      .forEach(k => localStorage.removeItem(k));
    setGalleryItems(siteData.gallery.items);
    setCalendarEvents(seedCalendarEvents());
    setCalendarHighlights(siteData.calendar.highlights);
    setBrandInfo(siteData.brand);
    setSponsors(siteData.sponsors || []);
    setTestimonials(siteData.testimonials.items);
    setCategories(DEFAULT_CATEGORIES);
    showToast('Dados restaurados para o padrão original!', 'info');
  };

  return (
    <DataContext.Provider value={{
      // Status Backend
      backendConnected,
      backendLoading,
      checkBackendConnection: checkAndSyncBackend,

      // Categorias
      categories,
      addCategory,
      updateCategory,
      deleteCategory,

      // Administradores
      admins,
      fetchAdmins,
      addAdmin,
      updateAdmin,
      deleteAdmin,

      // Entidades
      galleryItems, calendarEvents, calendarHighlights, brandInfo, sponsors, testimonials, toast,
      addGalleryItem, updateGalleryItem, deleteGalleryItem,
      addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
      addSponsor, updateSponsor, deleteSponsor,
      addTestimonial, updateTestimonial, deleteTestimonial,
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
