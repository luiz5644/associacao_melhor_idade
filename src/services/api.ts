// API Service Layer - Frontend Integration with Backend
const API_BASE = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '') || '';

function apiUrl(endpoint: string): string {
  if (!API_BASE) throw new ApiError(0, 'Configure VITE_API_URL para conectar ao backend.');
  return `${API_BASE}${endpoint}`;
}

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

  const response = await fetch(apiUrl(endpoint), {
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
  if (!API_BASE) return false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(apiUrl('/health'), {
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

export const informacoesApi = {
  get: async () => unpackProps<any>(await fetchApi<any>('/informacoes')),
  update: async (data: any) => fetchApi<any>('/informacoes', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// ============================================
// EVENTOS DO CALENDÁRIO
// ============================================
export interface Evento {
  id: number;
  titulo: string;
  desc: string;
  data_completa: string; // YYYY-MM-DD
  horario: string; // HH:MM
  local: string;
  is_highlight: boolean;
  status: 'ativo' | 'cancelado' | string;
}

export interface EventoCreate {
  titulo: string;
  desc: string;
  data_completa: string;
  horario: string;
  local: string;
  is_highlight: boolean;
  status: string;
}

export interface EventoUpdate {
  id: number;
  titulo?: string;
  desc?: string;
  data_completa?: string;
  horario?: string;
  local?: string;
  is_highlight?: boolean;
  status?: string;
}

export const eventosApi = {
  list: async (): Promise<Evento[]> => {
    const data = await fetchApi<any[]>('/eventos');
    return unpackList<Evento>(data);
  },

  create: async (data: EventoCreate): Promise<{ message: string }> => {
    return fetchApi('/eventos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById: async (id: number): Promise<Evento> => {
    const data = await fetchApi<any>(`/eventos/${id}`);
    return unpackProps<Evento>(data);
  },

  update: async (id: number, data: Partial<EventoUpdate>): Promise<{ message: string }> => {
    return fetchApi(`/eventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id }),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi(`/eventos/${id}`, {
      method: 'DELETE',
    });
  },
};

export interface AcaoRecorrente {
  id: number;
  titulo: string;
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  local: string;
  responsavel: string;
  url_imagem?: string | null;
  descricao_curta?: string | null;
  orientacoes?: string | null;
}

export type AcaoRecorrenteInput = Omit<AcaoRecorrente, 'id'>;

export const acoesApi = {
  list: async (): Promise<AcaoRecorrente[]> => unpackList<AcaoRecorrente>(await fetchApi<any[]>('/acoes')),
  getById: async (id: number): Promise<AcaoRecorrente> => unpackProps<AcaoRecorrente>(await fetchApi<any>(`/acoes/${id}`)),
  create: async (data: AcaoRecorrenteInput) => fetchApi<{ message: string }>('/acoes', {
    method: 'POST', body: JSON.stringify(data),
  }),
  update: async (id: number, data: AcaoRecorrenteInput) => fetchApi<{ message: string }>(`/acoes/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
  }),
  delete: async (id: number) => fetchApi<{ message: string }>(`/acoes/${id}`, { method: 'DELETE' }),
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
    const response = await fetch(apiUrl('/upload'), {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new ApiError(response.status, data.message || 'Erro ao enviar imagem.', data);
    return data.url;
  },
};

const DEFAULT_SPONSOR_LOGO = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400&auto=format&fit=crop';

export const patrocinadoresApi = {
  list: async () => unpackList<any>(await fetchApi<any[]>('/patrocinadores')),
  create: async (data: any) => fetchApi<{ message: string; id: number }>('/patrocinadores', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getById: async (id: number) => unpackProps<any>(await fetchApi<any>(`/patrocinadores/${id}`)),
  update: async (id: number, data: any) => fetchApi<{ message: string }>(`/patrocinadores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: async (id: number) => fetchApi<{ message: string }>(`/patrocinadores/${id}`, { method: 'DELETE' }),
};

export function adaptSponsorToFrontend(input: any) {
  const row = unpackProps<any>(input);
  return {
    id: `spn-${row.id}`,
    apiId: Number(row.id),
    name: row.nome || '',
    logo: row.logo ? resolveImageUrl(row.logo) : DEFAULT_SPONSOR_LOGO,
    websiteUrl: row.websiteUrl || '',
    description: row.description || '',
    active: Boolean(row.active),
  };
}

export function adaptSponsorToBackend(front: any) {
  const logo = front.logo && front.logo !== DEFAULT_SPONSOR_LOGO ? toStoredUrl(front.logo) : null;
  return {
    nome: front.name ? front.name.trim() : '',
    logo,
    category: null,
    websiteUrl: front.websiteUrl || null,
    description: front.description ? front.description.trim() : null,
    active: front.active !== undefined ? Boolean(front.active) : true,
  };
}

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

export function adaptEventoToFrontend(raw: any): any {
  const api = unpackProps<Evento>(raw);
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

export function adaptAcaoRecorrenteToFrontend(input: any) {
  const action = unpackProps<AcaoRecorrente>(input);
  const weekdayLabels: Record<string, string> = {
    domingo: 'Domingo', segunda: 'Segunda-feira', terca: 'Terça-feira', quarta: 'Quarta-feira',
    quinta: 'Quinta-feira', sexta: 'Sexta-feira', sabado: 'Sábado',
  };
  const start = String(action.horario_inicio || '').slice(0, 5);
  const end = String(action.horario_fim || '').slice(0, 5);
  return {
    id: `act-${action.id}`,
    apiId: Number(action.id),
    title: action.titulo || '',
    image: resolveImageUrl(action.url_imagem || ''),
    description: action.descricao_curta || '',
    schedule: {
      days: action.dia_semana || '',
      daysLabel: weekdayLabels[action.dia_semana] || action.dia_semana || '',
      time: [start, end].filter(Boolean).join(' às '),
      location: action.local || '',
      instructor: action.responsavel || '',
      details: action.orientacoes || '',
    },
  };
}

export function adaptEventoToBackend(front: any): EventoCreate {
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
