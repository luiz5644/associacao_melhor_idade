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
    let errorMsg = data.message || data.mesage;
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
    const res = await fetch(`${API_BASE}/categoria`, {
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
// CATEGORIAS CALENDÁRIO
// ============================================
export interface CategoriaCalendario {
  id: number;
  nome: string;
}

export const categoriaApi = {
  list: async (): Promise<CategoriaCalendario[]> => {
    const data = await fetchApi<any[]>('/categoria');
    return unpackList<CategoriaCalendario>(data);
  },

  create: async (nome: string): Promise<{ message: string }> => {
    return fetchApi('/categoria', {
      method: 'POST',
      body: JSON.stringify({ nome }),
    });
  },

  getById: async (id: number): Promise<CategoriaCalendario> => {
    const data = await fetchApi<any>(`/categoria/${id}`);
    return unpackProps<CategoriaCalendario>(data);
  },

  update: async (id: number, nome: string): Promise<{ message: string }> => {
    return fetchApi(`/categoria/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nome }),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi(`/categoria/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// ATIVIDADES (CALENDÁRIO)
// ============================================
export interface Atividade {
  id: number;
  categoria_id: number;
  titulo: string;
  desc: string;
  data_completa: string; // YYYY-MM-DD
  horario: string; // HH:MM
  local: string;
  is_highlight: boolean;
  status: 'ativo' | 'cancelado' | string;
  categoria_nome?: string;
}

export interface AtividadeCreate {
  categoria_id: number;
  titulo: string;
  desc: string;
  data_completa: string;
  horario: string;
  local: string;
  is_highlight: boolean;
  status: string;
}

export interface AtividadeUpdate {
  id: number;
  categoria_id?: number;
  titulo?: string;
  desc?: string;
  data_completa?: string;
  horario?: string;
  local?: string;
  is_highlight?: boolean;
  status?: string;
}

export const atividadeApi = {
  list: async (): Promise<Atividade[]> => {
    const data = await fetchApi<any[]>('/atividades');
    return unpackList<Atividade>(data);
  },

  create: async (data: AtividadeCreate): Promise<{ message: string }> => {
    return fetchApi('/atividades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById: async (id: number): Promise<Atividade> => {
    const data = await fetchApi<any>(`/atividades/${id}`);
    return unpackProps<Atividade>(data);
  },

  update: async (id: number, data: Partial<AtividadeUpdate>): Promise<{ message: string }> => {
    return fetchApi(`/atividades/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id }),
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return fetchApi(`/atividades/${id}`, {
      method: 'DELETE',
    });
  },

  listByCategoria: async (categoriaId: number): Promise<Atividade[]> => {
    const data = await fetchApi<any[]>(`/atividades/categoria/${categoriaId}`);
    return unpackList<Atividade>(data);
  },
};

// ============================================
// ADAPTADORES FRONTEND <-> BACKEND
// ============================================

export function adaptAtividadeToFrontend(raw: any, categories: CategoriaCalendario[] = []): any {
  const api = unpackProps<Atividade>(raw);
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

  let categoryName = api.categoria_nome;
  if (!categoryName && categories.length > 0) {
    const found = categories.find(c => c.id === api.categoria_id);
    if (found) categoryName = found.nome;
  }

  return {
    id: `cal-${api.id}`,
    apiId: api.id,
    categoria_id: api.categoria_id,
    year,
    month,
    day,
    time: api.horario ? String(api.horario).substring(0, 5) : '14:00',
    title: api.titulo || '',
    category: categoryName || 'Lazer',
    desc: api.desc || '',
    location: api.local || 'Sede da Associação',
    isHighlight: Boolean(api.is_highlight),
    status: api.status || 'ativo',
  };
}

export function adaptAtividadeToBackend(front: any, categories: CategoriaCalendario[] = []): AtividadeCreate {
  const month = (front.month !== undefined ? parseInt(front.month, 10) : 9) + 1; // 0-11 -> 1-12
  const day = parseInt(front.day, 10) || 1;
  const year = parseInt(front.year, 10) || 2026;
  const data_completa = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  let categoria_id = typeof front.categoria_id === 'number' ? front.categoria_id : undefined;

  if (!categoria_id && front.category) {
    const match = categories.find(
      c => c.nome.toLowerCase() === String(front.category).toLowerCase()
    );
    if (match) {
      categoria_id = match.id;
    }
  }

  if (!categoria_id) {
    categoria_id = categories.length > 0 && categories[0]?.id ? categories[0].id : 1;
  }

  return {
    categoria_id,
    titulo: front.title ? front.title.trim() : 'Atividade Comunitária',
    desc: front.desc ? front.desc.trim() : '',
    data_completa,
    horario: front.time ? front.time.substring(0, 5) : '14:00',
    local: front.location || 'Sede da Associação',
    is_highlight: Boolean(front.isHighlight),
    status: front.status || 'ativo',
  };
}