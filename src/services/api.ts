import axios from 'axios';

// ── Base axios instance ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request automatically
api.interceptors.request.use(config => {
  try {
    const stored = localStorage.getItem('cloudnews_auth');
    if (stored) {
      const auth = JSON.parse(stored);
      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    }
  } catch { /* ignore */ }
  return config;
});

// ── Generic API response type ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

// ── Articles API ──────────────────────────────────────────────────────────────
export const articlesApi = {

  // Public homepage / category page — ALWAYS shows only approved published articles
  // Does NOT pass any special params — backend ignores JWT for public listing
  list: (params?: {
    page?:     number;
    size?:     number;
    category?: string;
  }) => api.get<ApiResponse<any>>('/articles', { params }),

  // Admin: all articles including drafts (?all=true)
  adminList: (params?: { page?: number; size?: number; category?: string }) =>
    api.get<ApiResponse<any>>('/articles', { params: { ...params, all: true } }),

  // Employee: only THEIR OWN articles (?mine=true)
  // Uses the mine param so backend filters by authorId from JWT
  myArticles: (params?: { page?: number; size?: number }) =>
    api.get<ApiResponse<any>>('/articles', { params: { ...params, mine: true, size: 50 } }),

  // Get article by slug — FIXED route: /articles/slug/{slug}
  getBySlug: (slug: string) =>
    api.get<ApiResponse<any>>(`/articles/slug/${slug}`),

  // Track view — FIXED route: /articles/slug/{slug}/view
  trackView: (slug: string) =>
    api.post(`/articles/slug/${slug}/view`),

  // Admin: preview any article by ID (for approval review)
  preview: (id: number) =>
    api.get<ApiResponse<any>>(`/articles/${id}/preview`),

  // Admin: get all pending articles for approval
  getPending: () =>
    api.get<ApiResponse<any[]>>('/articles/pending'),

  // Admin: approve article → publishes immediately
  approve: (id: number) =>
    api.post<ApiResponse<any>>(`/articles/${id}/approve`),

  // Admin: reject article with reason
  reject: (id: number, note: string) =>
    api.post<ApiResponse<any>>(`/articles/${id}/reject`, { note }),

  // Create new article
  create: (data: {
    title:        string;
    content:      string;
    categoryId:   number;
    thumbnailUrl?: string;
    publish?:     boolean;
  }) => api.post<ApiResponse<any>>('/articles', data),

  // Update existing article
  update: (id: number, data: {
    title?:        string;
    content?:      string;
    categoryId?:   number;
    thumbnailUrl?: string;
    publish?:      boolean;
  }) => api.put<ApiResponse<any>>(`/articles/${id}`, data),

  // Delete article (SuperAdmin only)
  delete: (id: number) =>
    api.delete<ApiResponse<any>>(`/articles/${id}`),
};

// ── Categories API ────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get<ApiResponse<any[]>>('/categories'),
};

// ── Media upload API ──────────────────────────────────────────────────────────
export const mediaApi = {
  upload: (file: File, onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ success: boolean; url: string; fileName: string }>(
      '/media/upload',
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
  },
  list:   () => api.get('/media'),
  delete: (url: string) => api.delete(`/media?url=${encodeURIComponent(url)}`),
};

// ── Employees API ─────────────────────────────────────────────────────────────
export const employeesApi = {
  list:        () => api.get<ApiResponse<any[]>>('/employees'),
  adminList:   () => api.get<ApiResponse<any[]>>('/employees?all=true'),
  getById:     (employeeId: string) => api.get<ApiResponse<any>>(`/employees/${employeeId}`),
  create:      (data: any) => api.post<ApiResponse<any>>('/employees', data),
  update:      (id: number, data: any) => api.put<ApiResponse<any>>(`/employees/${id}`, data),
  softDelete:  (id: number) => api.delete<ApiResponse<any>>(`/employees/${id}`),
  hardDelete:  (id: number) => api.delete<ApiResponse<any>>(`/employees/${id}/hard`),
  grantLogin:  (id: number, loginEmail?: string) =>
    api.post<ApiResponse<any>>(`/employees/${id}/grant-login`, loginEmail ? { loginEmail } : {}),
  revokeLogin: (id: number) =>
    api.delete<ApiResponse<any>>(`/employees/${id}/revoke-login`),
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  login:          (email: string, password: string) =>
    api.post<ApiResponse<any>>('/auth/login', { email, password }),
  employeeLogin:  (employeeId: string, password: string) =>
    api.post<ApiResponse<any>>('/auth/employee-login', { employeeId, password }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<ApiResponse<any>>('/auth/change-password', { currentPassword, newPassword }),
};

// ── EPaper API ────────────────────────────────────────────────────────────────
export const epaperApi = {
  list:   () => api.get<ApiResponse<any[]>>('/epapers'),
  latest: () => api.get<ApiResponse<any>>('/epapers/latest'),
  create: (data: any) => api.post<ApiResponse<any>>('/epapers', data),
  delete: (id: number) => api.delete<ApiResponse<any>>(`/epapers/${id}`),
};

// ── Advertisements API ────────────────────────────────────────────────────────
export const adsApi = {
  getByPlacement: (placement: string) =>
    api.get<ApiResponse<any[]>>(`/ads?placement=${placement}`),
  adminList:       () => api.get<ApiResponse<any[]>>('/ads/admin'),
  create:          (data: any) => api.post<ApiResponse<any>>('/ads', data),
  update:          (id: number, data: any) => api.put<ApiResponse<any>>(`/ads/${id}`, data),
  delete:          (id: number) => api.delete<ApiResponse<any>>(`/ads/${id}`),
  trackImpression: (id: number) => { api.post(`/ads/${id}/impression`).catch(() => {}); },
  trackClick:      (id: number) => { api.post(`/ads/${id}/click`).catch(() => {}); },
};

// ── Editors API ───────────────────────────────────────────────────────────────
export const editorsApi = {
  list:      () => api.get<ApiResponse<any[]>>('/editors'),
  adminList: () => api.get<ApiResponse<any[]>>('/editors/all'),
  getById:   (id: number) => api.get<ApiResponse<any>>(`/editors/${id}`),
  create:    (data: any) => api.post<ApiResponse<any>>('/editors', data),
  update:    (id: number, data: any) => api.put<ApiResponse<any>>(`/editors/${id}`, data),
  delete:    (id: number) => api.delete<ApiResponse<any>>(`/editors/${id}`),
};


export default api;
