import axios from 'axios';
import type {
  ApiResponse, ArticleListItem, ArticleDetail,
  PaginatedResult, EPaper, AdminStats, AuthUser, Category
} from '../types';

const api = axios.create({ baseURL: '/api' });

// Attach JWT to every request
api.interceptors.request.use(config => {
  const stored = localStorage.getItem('cloudnews_auth');
  if (stored) {
    const auth: AuthUser = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthUser>>('/auth/login', { email, password }),

  register: (fullName: string, email: string, password: string) =>
    api.post<ApiResponse<AuthUser>>('/auth/register', { fullName, email, password }),
};

// ── Articles ──────────────────────────────────────────────────────────────────

export const articlesApi = {
  list: (params?: { page?: number; size?: number; category?: string; all?: boolean }) =>
    api.get<ApiResponse<PaginatedResult<ArticleListItem>>>('/articles', { params }),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<ArticleDetail>>(`/articles/${slug}`),

  create: (data: { title: string; content: string; categoryId: number; thumbnailUrl?: string; publish?: boolean }) =>
    api.post<ApiResponse<{ id: number; slug: string }>>('/articles', data),

  update: (id: number, data: { title?: string; content?: string; categoryId?: number; thumbnailUrl?: string; publish?: boolean }) =>
    api.put<ApiResponse<{ id: number; slug: string }>>(`/articles/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<{ id: number }>>(`/articles/${id}`),
};

// ── Categories ────────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: () => api.get<ApiResponse<Category[]>>('/categories'),
};

// ── Media ─────────────────────────────────────────────────────────────────────

export const mediaApi = {
  upload: (file: File, onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ url: string }>('/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      }
    });
  }
};

// ── E-Paper ───────────────────────────────────────────────────────────────────

export const epaperApi = {
  get: (date?: string) =>
    api.get<ApiResponse<EPaper>>('/epaper', { params: date ? { date } : {} }),

  list: () =>
    api.get<ApiResponse<EPaper[]>>('/epaper/list'),

  upload: (file: File, date: string, onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append('file', file);
    form.append('date', date);
    return api.post<ApiResponse<EPaper>>('/epaper', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      }
    });
  },

  delete: (id: number) =>
    api.delete<ApiResponse<{ id: number }>>(`/epaper/${id}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  stats: () => api.get<ApiResponse<AdminStats>>('/admin/stats'),
};

export default api;
