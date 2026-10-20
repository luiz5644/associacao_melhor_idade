import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { siteData } from '../data/mockData';
import {
  adminApi,
  acoesApi,
  eventosApi,
  albumApi,
  fotosApi,
  checkBackendHealth,
  adaptEventoToFrontend,
  adaptEventoToBackend,
  adaptAcaoRecorrenteToFrontend,
  adaptAlbumToFrontend,
  patrocinadoresApi,
  adaptSponsorToFrontend,
  adaptSponsorToBackend,
  toStoredUrl,
  informacoesApi,
} from '../services/api';

const STORAGE_KEY_BRAND = 'ami_brand_info_v1';
const STORAGE_KEY_TESTIMONIALS = 'ami_testimonials_v1';
const EMPTY_BRAND_INFO = { ...siteData.brand, email: '', address: '', phone: '', pixKey: '' };

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Estado de conexão com backend
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendLoading, setBackendLoading] = useState(true);

  // Administradores (do backend)
  const [admins, setAdmins] = useState([]);

  const [galleryItems, setGalleryItems] = useState([]);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState('');

  const [brandInfo, setBrandInfo] = useState(EMPTY_BRAND_INFO);
  const [legacyBrandInfo, setLegacyBrandInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRAND);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return null;
  });
  const [brandInfoHasRecord, setBrandInfoHasRecord] = useState(false);

  const [sponsors, setSponsors] = useState([]);

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
    localStorage.removeItem('ami_sponsors_v1');
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

  const loadSponsorsFromBackend = useCallback(async () => {
    const records = await patrocinadoresApi.list();
    return records.map(adaptSponsorToFrontend);
  }, []);

  const reloadSponsors = useCallback(async () => {
    if (!backendConnected) {
      setSponsors([]);
      return [];
    }
    try {
      const records = await loadSponsorsFromBackend();
      setSponsors(records);
      return records;
    } catch (error) {
      setSponsors([]);
      throw error;
    }
  }, [backendConnected, loadSponsorsFromBackend]);

  useEffect(() => {
    localStorage.removeItem('ami_calendar_events_v1');
    localStorage.removeItem('ami_calendar_highlights_v1');
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(testimonials)); } catch (_) {}
  }, [testimonials]);

  // ── Sincronização inicial com o Backend (se ativo na porta 3000) ────
  const checkAndSyncBackend = useCallback(async (silent = false) => {
    setBackendLoading(true);
    setActivitiesLoading(true);
    setActivitiesError('');
    try {
      const isOnline = await checkBackendHealth();
      setBackendConnected(isOnline);

      if (isOnline) {
        try {
          const info = await informacoesApi.get();
          const hasRecord = Boolean(info && Object.keys(info).length);
          setBrandInfoHasRecord(hasRecord);
          if (hasRecord) {
            setBrandInfo(current => ({
              ...current, ...info,
              name: info.name || current.name, subtitle: info.subtitle || current.subtitle,
              mission: info.mission || current.mission, since: info.since || current.since,
              email: info.email || '', address: info.address || '', phone: info.phone || '', pixKey: info.pixKey || '',
            }));
            setLegacyBrandInfo(null);
          } else {
            setBrandInfo(EMPTY_BRAND_INFO);
            try {
              const old = localStorage.getItem(STORAGE_KEY_BRAND);
              setLegacyBrandInfo(old ? JSON.parse(old) : null);
            } catch (_) { setLegacyBrandInfo(null); }
          }
        } catch (err) {
          console.warn('[Backend] Erro ao carregar informações:', err);
          setBrandInfo(EMPTY_BRAND_INFO);
        }
        try {
          setGalleryItems(await loadGalleryFromBackend());
        } catch (err) {
          setGalleryItems([]);
          console.warn('[Backend] Erro ao carregar álbuns e fotos:', err);
        }

        try {
          setSponsors(await loadSponsorsFromBackend());
        } catch (err) {
          setSponsors([]);
          console.warn('[Backend] Erro ao carregar patrocinadores:', err);
        }

        // Carrega eventos do calendário e ações recorrentes separadamente.
        try {
          const events = await eventosApi.list();
          setCalendarEvents(Array.isArray(events) ? events.map(adaptEventoToFrontend) : []);
        } catch (err) {
          setCalendarEvents([]);
          console.warn('[Backend] Erro ao carregar eventos:', err);
        }
        try {
          const actions = await acoesApi.list();
          setActivities(Array.isArray(actions) ? actions.map(adaptAcaoRecorrenteToFrontend) : []);
          setActivitiesError('');
        } catch (err) {
          setActivities([]);
          setActivitiesError(err.message || 'Não foi possível carregar as ações.');
          console.warn('[Backend] Erro ao carregar ações:', err);
        } finally {
          setActivitiesLoading(false);
        }

        if (!silent) {
          showToast('Conectado com sucesso ao backend (porta 3000)!', 'success');
        }
      } else {
        setGalleryItems([]);
        setCalendarEvents([]);
        setActivities([]);
        setActivitiesError('Backend desconectado. Não foi possível carregar as ações.');
        setSponsors([]);
        setBrandInfo(EMPTY_BRAND_INFO);
        if (!silent) {
          showToast('Backend offline. Operando em modo de dados locais.', 'info');
        }
      }
    } catch (err) {
      setBackendConnected(false);
      setGalleryItems([]);
      setCalendarEvents([]);
      setActivities([]);
      setActivitiesError('Não foi possível conectar ao backend para carregar as ações.');
      setSponsors([]);
      if (!silent) {
        showToast('Backend inacessível. Usando armazenamento local.', 'info');
      }
    } finally {
      setActivitiesLoading(false);
      setBackendLoading(false);
    }
  }, [loadGalleryFromBackend, loadSponsorsFromBackend, showToast]);

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
      await eventosApi.create(adaptEventoToBackend(newEvent));
      const events = await eventosApi.list();
      setCalendarEvents(Array.isArray(events) ? events.map(adaptEventoToFrontend) : []);
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
      await eventosApi.update(numericId, adaptEventoToBackend({ ...event, ...updatedData, id: numericId }));
      const events = await eventosApi.list();
      setCalendarEvents(Array.isArray(events) ? events.map(adaptEventoToFrontend) : []);
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
      await eventosApi.delete(numericId);
      const events = await eventosApi.list();
      setCalendarEvents(Array.isArray(events) ? events.map(adaptEventoToFrontend) : []);
      showToast('Ação excluída com sucesso do backend!', 'warning');
    } catch (err) {
      showToast(err.message || 'Erro ao remover ação do backend.', 'warning');
    }
  };

  const reloadActivities = useCallback(async () => {
    if (!backendConnected) {
      setActivities([]);
      setActivitiesError('Backend desconectado. Não foi possível carregar as ações.');
      return [];
    }
    setActivitiesLoading(true);
    setActivitiesError('');
    try {
      const records = await acoesApi.list();
      const items = Array.isArray(records) ? records.map(adaptAcaoRecorrenteToFrontend) : [];
      setActivities(items);
      return items;
    } catch (error) {
      setActivities([]);
      setActivitiesError(error.message || 'Não foi possível carregar as ações.');
      throw error;
    } finally {
      setActivitiesLoading(false);
    }
  }, [backendConnected]);

  const addActivity = async (data) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível cadastrar ação no banco.', 'warning');
      throw new Error('Backend offline');
    }
    try {
      await acoesApi.create({
        titulo: data.title.trim(), dia_semana: data.days.trim(),
        horario_inicio: data.startTime, horario_fim: data.endTime,
        local: data.location.trim(), responsavel: data.responsible.trim(),
      });
      await reloadActivities();
      showToast('Ação cadastrada com sucesso!', 'success');
    } catch (error) {
      showToast(error.message || 'Erro ao cadastrar ação.', 'warning');
      throw error;
    }
  };

  const updateActivity = async (id, data) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível atualizar ação no banco.', 'warning');
      throw new Error('Backend offline');
    }
    const current = activities.find(item => item.id === id || item.apiId === id);
    const apiId = Number(current?.apiId ?? id);
    if (!Number.isInteger(apiId) || apiId <= 0) throw new Error('Ação inválida.');
    try {
      await acoesApi.update(apiId, {
        titulo: data.title.trim(), dia_semana: data.days.trim(),
        horario_inicio: data.startTime, horario_fim: data.endTime,
        local: data.location.trim(), responsavel: data.responsible.trim(),
      });
      await reloadActivities();
      showToast('Ação atualizada com sucesso!', 'info');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar ação.', 'warning');
      throw error;
    }
  };

  const deleteActivity = async (id) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível excluir ação do banco.', 'warning');
      return;
    }
    const current = activities.find(item => item.id === id || item.apiId === id);
    const apiId = Number(current?.apiId ?? id);
    if (!Number.isInteger(apiId) || apiId <= 0) return;
    try {
      await acoesApi.delete(apiId);
      await reloadActivities();
      showToast('Ação excluída com sucesso.', 'warning');
    } catch (error) {
      showToast(error.message || 'Erro ao excluir ação.', 'warning');
      throw error;
    }
  };

  // ── CRUD: Patrocinadores & Parceiros ─────────────────────────────
  const addSponsor = async (sponsorData) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível cadastrar patrocinador no banco.', 'warning');
      return;
    }
    const normalized = {
      ...sponsorData,
      name: sponsorData.name.trim(),
      websiteUrl: sponsorData.websiteUrl ? (sponsorData.websiteUrl.startsWith('http') ? sponsorData.websiteUrl : `https://${sponsorData.websiteUrl}`) : '',
      description: sponsorData.description ? sponsorData.description.trim() : '',
      active: sponsorData.active !== undefined ? Boolean(sponsorData.active) : true,
    };
    try {
      await patrocinadoresApi.create(adaptSponsorToBackend(normalized));
      await reloadSponsors();
      showToast(`Patrocinador "${normalized.name}" cadastrado com sucesso!`, 'success');
    } catch (error) {
      showToast(error.message || 'Erro ao cadastrar patrocinador no backend.', 'warning');
    }
  };

  const updateSponsor = async (id, updatedData) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível atualizar patrocinador no banco.', 'warning');
      return;
    }
    const current = sponsors.find(sponsor => sponsor.id === id || sponsor.apiId === id);
    const apiId = Number(current?.apiId ?? String(id).replace(/^spn-/, ''));
    if (!current || !Number.isInteger(apiId) || apiId <= 0) return;
    const normalized = {
      ...current,
      ...updatedData,
      name: updatedData.name ? updatedData.name.trim() : current.name,
      websiteUrl: updatedData.websiteUrl ? (updatedData.websiteUrl.startsWith('http') ? updatedData.websiteUrl : `https://${updatedData.websiteUrl}`) : '',
      description: updatedData.description !== undefined ? updatedData.description.trim() : current.description,
      active: updatedData.active !== undefined ? Boolean(updatedData.active) : current.active,
    };
    try {
      await patrocinadoresApi.update(apiId, adaptSponsorToBackend(normalized));
      await reloadSponsors();
      showToast('Dados do patrocinador atualizados com sucesso!', 'info');
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar patrocinador no backend.', 'warning');
    }
  };

  const deleteSponsor = async (id) => {
    if (!backendConnected) {
      showToast('Backend offline. Não é possível remover patrocinador do banco.', 'warning');
      return;
    }
    const current = sponsors.find(sponsor => sponsor.id === id || sponsor.apiId === id);
    const apiId = Number(current?.apiId ?? String(id).replace(/^spn-/, ''));
    if (!current || !Number.isInteger(apiId) || apiId <= 0) return;
    try {
      await patrocinadoresApi.delete(apiId);
      await reloadSponsors();
      showToast('Patrocinador removido com sucesso.', 'warning');
    } catch (error) {
      showToast(error.message || 'Erro ao remover patrocinador do backend.', 'warning');
    }
  };

  // ── CRUD: Depoimentos ─────────────────────────────────────────────
  const addTestimonial = (testimonialData) => {
    const newTestimonial = {
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: testimonialData.name.trim(),
      role: testimonialData.role || '',
      avatar: toStoredUrl(testimonialData.avatar || ''),
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
        avatar: updatedData.avatar !== undefined ? toStoredUrl(updatedData.avatar) : t.avatar,
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

  const updateBrandInfo = async (newInfo) => {
    if (!backendConnected) {
      showToast('Backend offline. As informações não foram alteradas.', 'warning');
      throw new Error('Backend offline');
    }
    try {
      await informacoesApi.update({
        email: newInfo.email,
        phone: newInfo.phone,
        address: newInfo.address,
        pixKey: newInfo.pixKey,
      });
      const refreshed = await informacoesApi.get();
      setBrandInfo(current => ({
        ...current, ...refreshed,
        name: refreshed.name || current.name, subtitle: refreshed.subtitle || current.subtitle,
        mission: refreshed.mission || current.mission, since: refreshed.since || current.since,
        email: refreshed.email || '', address: refreshed.address || '', phone: refreshed.phone || '', pixKey: refreshed.pixKey || '',
      }));
      setBrandInfoHasRecord(Boolean(Object.keys(refreshed || {}).length));
      setLegacyBrandInfo(null);
      localStorage.removeItem(STORAGE_KEY_BRAND);
      showToast('Informações da Associação salvas com sucesso!', 'success');
    } catch (error) {
      showToast(error.message || 'Erro ao salvar informações da Associação.', 'warning');
      throw error;
    }
  };

  const resetToDefaultData = () => {
    [STORAGE_KEY_BRAND, STORAGE_KEY_TESTIMONIALS]
      .forEach(k => localStorage.removeItem(k));
    setCalendarEvents([]);
    setBrandInfo(EMPTY_BRAND_INFO);
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
      galleryItems, calendarEvents, activities, activitiesLoading, activitiesError, brandInfo, legacyBrandInfo, brandInfoHasRecord, sponsors, testimonials, toast,
      reloadGallery,
      addGalleryItem, updateGalleryItem, deleteGalleryItem,
      addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
      reloadActivities, addActivity, updateActivity, deleteActivity,
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
