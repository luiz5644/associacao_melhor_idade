import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { siteData } from '../data/mockData';
import {
  adminApi,
  acoesApi,
  albumApi,
  fotosApi,
  checkBackendHealth,
  adaptAcaoToFrontend,
  adaptAcaoToBackend,
  adaptAlbumToFrontend,
  toStoredUrl,
} from '../services/api';

const STORAGE_KEY_BRAND = 'ami_brand_info_v1';
const STORAGE_KEY_SPONSORS = 'ami_sponsors_v1';
const STORAGE_KEY_TESTIMONIALS = 'ami_testimonials_v1';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Estado de conexão com backend
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendLoading, setBackendLoading] = useState(true);

  // Administradores (do backend)
  const [admins, setAdmins] = useState([]);

  const [galleryItems, setGalleryItems] = useState([]);

  const [calendarEvents, setCalendarEvents] = useState([]);

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

  // Limpa os exemplos de galeria salvos por versões anteriores.
  useEffect(() => {
    localStorage.removeItem('ami_gallery_items_v1');
  }, []);

  const loadGalleryFromBackend = useCallback(async () => {
    const [albums, photos] = await Promise.all([albumApi.list(), fotosApi.list()]);
    const photosByAlbum = new Map();
    photos.forEach(photo => {
      const albumId = Number(photo.album_id);
      photosByAlbum.set(albumId, [...(photosByAlbum.get(albumId) || []), photo]);
    });
    return albums
      .map(album => adaptAlbumToFrontend(album, photosByAlbum.get(Number(album.id)) || []))
      .sort((a, b) => b.date.localeCompare(a.date) || b.apiId - a.apiId);
  }, []);

  const reloadGallery = useCallback(async () => {
    if (!backendConnected) {
      setGalleryItems([]);
      return [];
    }
    try {
      const items = await loadGalleryFromBackend();
      setGalleryItems(items);
      return items;
    } catch (error) {
      setGalleryItems([]);
      throw error;
    }
  }, [backendConnected, loadGalleryFromBackend]);

  useEffect(() => {
    localStorage.removeItem('ami_calendar_events_v1');
    localStorage.removeItem('ami_calendar_highlights_v1');
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_BRAND, JSON.stringify(brandInfo)); } catch (_) {}
  }, [brandInfo]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_SPONSORS, JSON.stringify(sponsors)); } catch (_) {}
  }, [sponsors]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(testimonials)); } catch (_) {}
  }, [testimonials]);

  // ── Sincronização inicial com o Backend (se ativo na porta 3000) ────
  const checkAndSyncBackend = useCallback(async (silent = false) => {
    setBackendLoading(true);
    try {
      const isOnline = await checkBackendHealth();
      setBackendConnected(isOnline);

      if (isOnline) {
        try {
          setGalleryItems(await loadGalleryFromBackend());
        } catch (err) {
          setGalleryItems([]);
          console.warn('[Backend] Erro ao carregar álbuns e fotos:', err);
        }

        // Carrega ações do calendário do backend
        try {
          const acoesData = await acoesApi.list();
          setCalendarEvents(Array.isArray(acoesData) ? acoesData.map(a => adaptAcaoToFrontend(a)) : []);
        } catch (err) {
          setCalendarEvents([]);
          console.warn('[Backend] Erro ao carregar ações:', err);
        }

        if (!silent) {
          showToast('Conectado com sucesso ao backend (porta 3000)!', 'success');
        }
      } else {
        setGalleryItems([]);
        setCalendarEvents([]);
        if (!silent) {
          showToast('Backend offline. Operando em modo de dados locais.', 'info');
        }
      }
    } catch (err) {
      setBackendConnected(false);
      setGalleryItems([]);
      setCalendarEvents([]);
      if (!silent) {
        showToast('Backend inacessível. Usando armazenamento local.', 'info');
      }
    } finally {
      setBackendLoading(false);
    }
  }, [loadGalleryFromBackend, showToast]);

  useEffect(() => {
    checkAndSyncBackend(true);
  }, []);

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
  const addGalleryItem = async (itemData) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível salvar lembranças no banco.', 'warning');
      return;
    }
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const photos = Array.isArray(itemData.photos) && itemData.photos.length > 0
      ? itemData.photos
      : [itemData.image].filter(Boolean);
    let albumId;
    const createdPhotoIds = [];
    try {
      const createdAlbum = await albumApi.create({
        titulo: itemData.title.trim(),
        description: itemData.description || '',
        date: itemData.date || localDate,
      });
      albumId = Number(createdAlbum.id);
      if (!Number.isInteger(albumId) || albumId <= 0) throw new Error('O backend não retornou o ID do álbum.');

      for (const [index, url] of photos.entries()) {
        const createdPhoto = await fotosApi.create({
          album_id: albumId,
          url_imagem: toStoredUrl(url),
          eh_capa: index === 0,
        });
        createdPhotoIds.push(Number(createdPhoto.id));
      }
      await reloadGallery();
      showToast('Lembrança adicionada ao álbum com sucesso!', 'success');
    } catch (error) {
      for (const photoId of createdPhotoIds) {
        if (Number.isInteger(photoId) && photoId > 0) {
          try { await fotosApi.delete(photoId); } catch (_) {}
        }
      }
      if (albumId) {
        try { await albumApi.delete(albumId); } catch (_) {}
      }
      try { await reloadGallery(); } catch (_) { setGalleryItems([]); }
      showToast(error.message || 'Erro ao salvar lembrança no backend.', 'warning');
    }
  };

  const updateGalleryItem = async (id, updatedData) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível atualizar lembranças no banco.', 'warning');
      return;
    }
    const item = galleryItems.find(entry => entry.id === id || entry.apiId === id);
    const albumId = Number(item?.apiId ?? String(id).replace(/^alb-/, ''));
    if (!item || !Number.isInteger(albumId) || albumId <= 0) return;

    const photos = Array.isArray(updatedData.photos) && updatedData.photos.length > 0
      ? updatedData.photos
      : [updatedData.image].filter(Boolean);
    const desiredUrls = photos.map(toStoredUrl);
    const unusedRecords = new Set((item.photoRecords || []).map(record => record.id));
    try {
      await albumApi.update(albumId, {
        titulo: updatedData.title.trim(),
        description: updatedData.description || '',
        date: updatedData.date || item.date,
      });

      for (const [index, url] of desiredUrls.entries()) {
        const matchingRecord = (item.photoRecords || []).find(record =>
          unusedRecords.has(record.id) && record.url === url
        );
        const isCover = index === 0;
        if (matchingRecord) {
          unusedRecords.delete(matchingRecord.id);
          if (matchingRecord.isCover !== isCover) {
            await fotosApi.update(matchingRecord.id, { album_id: albumId, url_imagem: url, eh_capa: isCover });
          }
        } else {
          await fotosApi.create({ album_id: albumId, url_imagem: url, eh_capa: isCover });
        }
      }

      for (const recordId of unusedRecords) await fotosApi.delete(recordId);
      await reloadGallery();
      showToast('Lembrança atualizada com sucesso!', 'info');
    } catch (error) {
      try { await reloadGallery(); } catch (_) { setGalleryItems([]); }
      showToast(error.message || 'Erro ao atualizar lembrança no backend.', 'warning');
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível remover lembranças do banco.', 'warning');
      return;
    }
    const item = galleryItems.find(entry => entry.id === id || entry.apiId === id);
    const albumId = Number(item?.apiId ?? String(id).replace(/^alb-/, ''));
    if (!item || !Number.isInteger(albumId) || albumId <= 0) return;
    try {
      for (const record of item.photoRecords || []) await fotosApi.delete(record.id);
      await albumApi.delete(albumId);
      await reloadGallery();
      showToast('Lembrança removida do álbum.', 'warning');
    } catch (error) {
      try { await reloadGallery(); } catch (_) { setGalleryItems([]); }
      showToast(error.message || 'Erro ao remover lembrança do backend.', 'warning');
    }
  };

  // ── CRUD: Calendário de Ações (Integrado com Backend) ──────────
  const addCalendarEvent = async (eventData) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível cadastrar ação no banco.', 'warning');
      return;
    }
    const newEvent = {
      year: parseInt(eventData.year || 2026, 10),
      month: parseInt(eventData.month !== undefined ? eventData.month : 9, 10),
      day: parseInt(eventData.day || 1, 10),
      time: eventData.time || '14:00',
      title: eventData.title.trim(),
      desc: eventData.desc || '',
      location: eventData.location || 'Sede da Associação',
      isHighlight: Boolean(eventData.isHighlight),
      status: eventData.status || 'ativo',
    };

    try {
      await acoesApi.create(adaptAcaoToBackend(newEvent));
      const acoes = await acoesApi.list();
      setCalendarEvents(Array.isArray(acoes) ? acoes.map(a => adaptAcaoToFrontend(a)) : []);
      showToast('Ação salva com sucesso no banco de dados!', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao cadastrar ação no backend.', 'warning');
    }
  };

  const updateCalendarEvent = async (id, updatedData) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível atualizar ação no banco.', 'warning');
      return;
    }
    const event = calendarEvents.find(item => item.id === id || item.apiId === id);
    const numericId = Number(event?.apiId ?? id);
    if (!Number.isInteger(numericId) || numericId <= 0) return;
    try {
      await acoesApi.update(numericId, adaptAcaoToBackend({ ...event, ...updatedData, id: numericId }));
      const acoes = await acoesApi.list();
      setCalendarEvents(Array.isArray(acoes) ? acoes.map(a => adaptAcaoToFrontend(a)) : []);
      showToast('Ação atualizada com sucesso no backend!', 'info');
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar ação no backend.', 'warning');
    }
  };

  const deleteCalendarEvent = async (id) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível remover ação do banco.', 'warning');
      return;
    }
    const event = calendarEvents.find(item => item.id === id || item.apiId === id);
    const numericId = Number(event?.apiId ?? id);
    if (!Number.isInteger(numericId) || numericId <= 0) return;
    try {
      await acoesApi.delete(numericId);
      const acoes = await acoesApi.list();
      setCalendarEvents(Array.isArray(acoes) ? acoes.map(a => adaptAcaoToFrontend(a)) : []);
      showToast('Ação excluída com sucesso do backend!', 'warning');
    } catch (err) {
      showToast(err.message || 'Erro ao remover ação do backend.', 'warning');
    }
  };

  // ── CRUD: Patrocinadores & Parceiros ─────────────────────────────
  const addSponsor = (sponsorData) => {
      const newSponsor = {
        id: `sp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        name: sponsorData.name.trim(),
        logo: sponsorData.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400&auto=format&fit=crop',
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
    [STORAGE_KEY_BRAND, STORAGE_KEY_SPONSORS, STORAGE_KEY_TESTIMONIALS]
      .forEach(k => localStorage.removeItem(k));
    setCalendarEvents([]);
    setBrandInfo(siteData.brand);
    setSponsors(siteData.sponsors || []);
    setTestimonials(siteData.testimonials.items);
    showToast('Dados restaurados para o padrão original!', 'info');
  };

  return (
    <DataContext.Provider value={{
      // Status Backend
      backendConnected,
      backendLoading,
      checkBackendConnection: checkAndSyncBackend,

      // Administradores
      admins,
      fetchAdmins,
      addAdmin,
      updateAdmin,
      deleteAdmin,

      // Entidades
      galleryItems, calendarEvents, brandInfo, sponsors, testimonials, toast,
      reloadGallery,
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
