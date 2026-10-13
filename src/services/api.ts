// API Service Layer - Frontend Integration with Backend
const API_BASE = 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utilitário para desempacotar objetos que venham como { props: { ... } } ou direto { ... }
export function unpackProps<T = any>(item: any): T {
  if (!item) return item;
  if (item.props && typeof item.props === 'object') {
    return { ...item.props };
  }
  return item;
}

export function unpackList<T = any>(list: any): T[] {
  if (!Array.isArray(list)) return [];
  return list.map(unpackProps<T>);
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg = data.message;
    if (!errorMsg && Array.isArray(data)) {
      errorMsg = data
        .map((e: any) => Object.values(e.constraints || {}).join(', '))
        .filter(Boolean)
        .join('; ');
    }
    throw new ApiError(response.status, errorMsg || 'Erro na requisição', data);
  }

  return data;
}

// ============================================
// VERIFICAÇÃO DE SAÚDE DA API (ONLINE / OFFLINE)
// ============================================
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================
// ADMIN AUTH & CRUD
// ============================================
export interface Admin {
  id: number;
  username: string;
  cpf: string;
}

export interface LoginResponse {
  token: string;
}

export const adminApi = {
  login: async (login: string, senha: string): Promise<LoginResponse> => {
    const response = await fetchApi<LoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ login, senha }),
    });
    if (response.token) {
      localStorage.setItem('admin_token', response.token);
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
  },

  getToken: () => localStorage.getItem('admin_token'),

  isAuthenticated: () => !!localStorage.getItem('admin_token'),

  list: async (): Promise<Admin[]> => {
    const data = await fetchApi<any[]>('/admin');
    return unpackList<Admin>(data);
  },

  create: async (data: { username: string; cpf: string; senha?: string }): Promise<{ message: string }> => {
    return fetchApi('/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById: async (id: number): Promise<Admin> => {
    const data = await fetchApi<any>(`/admin/${id}`);
    return unpackProps<Admin>(data);
  },

  update: async (id: number, data: { username: string; senha?: string }): Promise<{ message: string }> => {
    return fetchApi(`/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi(`/admin/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// AÇÕES (CALENDÁRIO)
// ============================================
export interface Acao {
  id: number;
  titulo: string;
  desc: string;
  data_completa: string; // YYYY-MM-DD
  horario: string; // HH:MM
  local: string;
  is_highlight: boolean;
  status: 'ativo' | 'cancelado' | string;
}

export interface AcaoCreate {
  titulo: string;
  desc: string;
  data_completa: string;
  horario: string;
  local: string;
  is_highlight: boolean;
  status: string;
}

export interface AcaoUpdate {
  id: number;
  titulo?: string;
  desc?: string;
  data_completa?: string;
  horario?: string;
  local?: string;
  is_highlight?: boolean;
  status?: string;
}

export const acoesApi = {
  list: async (): Promise<Acao[]> => {
    const data = await fetchApi<any[]>('/acoes');
    return unpackList<Acao>(data);
  },

  create: async (data: AcaoCreate): Promise<{ message: string }> => {
    return fetchApi('/acoes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById: async (id: number): Promise<Acao> => {
    const data = await fetchApi<any>(`/acoes/${id}`);
    return unpackProps<Acao>(data);
  },

  update: async (id: number, data: Partial<AcaoUpdate>): Promise<{ message: string }> => {
    return fetchApi(`/acoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id }),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi(`/acoes/${id}`, {
      method: 'DELETE',
    });
  },
};

export const albumApi = {
  list: async () => unpackList<any>(await fetchApi<any[]>('/album')),
  create: async (data: { titulo: string; description: string; date: string }) =>
    fetchApi<{ message: string; id: number }>('/album', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: { titulo: string; description: string; date: string }) =>
    fetchApi<{ message: string }>(`/album/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number) => fetchApi<{ message: string }>(`/album/${id}`, { method: 'DELETE' }),
};

export const fotosApi = {
  list: async () => unpackList<any>(await fetchApi<any[]>('/fotos')),
  create: async (data: { album_id: number; url_imagem: string; eh_capa: boolean }) =>
    fetchApi<{ message: string; id: number }>('/fotos', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: number, data: { album_id: number; url_imagem: string; eh_capa: boolean }) =>
    fetchApi<{ message: string }>(`/fotos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: number) => fetchApi<{ message: string }>(`/fotos/${id}`, { method: 'DELETE' }),
};

export const uploadApi = {
  upload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('imagem', file);
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new ApiError(response.status, data.message || 'Erro ao enviar imagem.', data);
    return data.url;
  },
};

export function resolveImageUrl(url: string): string {
  return url?.startsWith('/uploads/') ? `${API_BASE}${url}` : (url || '');
}

export function toStoredUrl(url: string): string {
  const uploadsPrefix = `${API_BASE}/uploads/`;
  return url?.startsWith(uploadsPrefix) ? url.slice(API_BASE.length) : (url || '');
}

export function adaptAlbumToFrontend(albumInput: any, fotosInput: any[] = []) {
  const album = unpackProps<any>(albumInput);
  const date = String(album.date || '').slice(0, 10);
  const [year, month] = date.split('-').map(Number);
  const monthName = Number.isInteger(month) && month >= 1 && month <= 12
    ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][month - 1]
    : '';
  const subtitle = monthName && Number.isInteger(year) ? `${monthName} de ${year}` : 'Lembrança Especial';
  const photoRecords = fotosInput
    .map(unpackProps<any>)
    .sort((a, b) => Number(Boolean(b.eh_capa)) - Number(Boolean(a.eh_capa)) || Number(a.id) - Number(b.id))
    .map(photo => ({ id: Number(photo.id), url: photo.url_imagem, isCover: Boolean(photo.eh_capa) }));
  const photos = photoRecords.map(photo => resolveImageUrl(photo.url));

  return {
    id: `alb-${album.id}`,
    apiId: Number(album.id),
    title: album.titulo || '',
    description: album.description || '',
    date,
    subtitle,
    photos,
    image: photos[0] || '',
    photoRecords,
  };
}

// ============================================
// ADAPTADORES FRONTEND <-> BACKEND
// ============================================

export function adaptAcaoToFrontend(raw: any): any {
  const api = unpackProps<Acao>(raw);
  let year = 2026;
  let month = 9;
  let day = 1;

  if (api.data_completa) {
    const parts = String(api.data_completa).split(/[-T ]/);
    if (parts.length >= 3) {
      year = parseInt(parts[0], 10) || 2026;
      month = (parseInt(parts[1], 10) || 10) - 1; // 1-12 -> 0-11
      day = parseInt(parts[2], 10) || 1;
    }
  }

  return {
    id: `cal-${api.id}`,
    apiId: api.id,
    year,
    month,
    day,
    time: api.horario ? String(api.horario).substring(0, 5) : '14:00',
    title: api.titulo || '',
    desc: api.desc || '',
    location: api.local || 'Sede da Associação',
    isHighlight: Boolean(api.is_highlight),
    status: api.status || 'ativo',
  };
}

export function adaptAcaoToBackend(front: any): AcaoCreate {
  const month = (front.month !== undefined ? parseInt(front.month, 10) : 9) + 1; // 0-11 -> 1-12
  const day = parseInt(front.day, 10) || 1;
  const year = parseInt(front.year, 10) || 2026;
  const data_completa = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    titulo: front.title ? front.title.trim() : 'Ação Comunitária',
    desc: front.desc ? front.desc.trim() : '',
    data_completa,
    horario: front.time ? front.time.substring(0, 5) : '14:00',
    local: front.location || 'Sede da Associação',
    is_highlight: Boolean(front.isHighlight),
    status: front.status || 'ativo',
  };
}
