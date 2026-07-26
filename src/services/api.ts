import axios from 'axios';

// ── Base axios instance ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
});

// Attach JWT to every request automatically
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

export default api;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

export interface PaginatedResult<T> {
  items:      T[];
  page:       number;
  pageSize:   number;
  totalCount: number;
  totalPages: number;
  hasNext:    boolean;
}

// ── Article list params ───────────────────────────────────────────────────────
interface ArticleListParams {
  page?:     number;
  size?:     number;
  category?: string;
  all?:      boolean;   // admin: show all including drafts
  mine?:     boolean;   // employee: show only own articles
  q?:        string;    // search query
}

// ── Articles API ──────────────────────────────────────────────────────────────
export const articlesApi = {
  // Public homepage — only approved published articles
  list: (params?: ArticleListParams) =>
    api.get<ApiResponse<PaginatedResult<any>>>('/articles', { params }),

  // Admin: all articles including drafts
  adminList: (params?: { page?: number; size?: number; category?: string }) =>
    api.get<ApiResponse<PaginatedResult<any>>>('/articles', {
      params: { ...params, all: true },
    }),

  // Employee: only their own articles
  myArticles: (params?: { page?: number; size?: number }) =>
    api.get<ApiResponse<PaginatedResult<any>>>('/articles', {
      params: { ...params, mine: true, size: 50 },
    }),

  // Public article by slug
  getBySlug: (slug: string) =>
    api.get<ApiResponse<any>>(`/articles/slug/${slug}`),

  // Track view
  trackView: (slug: string) =>
    api.post(`/articles/slug/${slug}/view`),

  // Admin preview by ID
  preview: (id: number) =>
    api.get<ApiResponse<any>>(`/articles/${id}/preview`),

  // Get all pending articles for approval
  getPending: () =>
    api.get<ApiResponse<any[]>>('/articles/pending'),

  // Approve article
  approve: (id: number) =>
    api.post<ApiResponse<any>>(`/articles/${id}/approve`),

  // Reject article with note
  reject: (id: number, note: string) =>
    api.post<ApiResponse<any>>(`/articles/${id}/reject`, { note }),

  // Create article
  create: (data: {
    title:         string;
    content:       string;
    categoryId:    number;
    thumbnailUrl?: string;
    publish?:      boolean;
  }) => api.post<ApiResponse<any>>('/articles', data),

  // Update article
  update: (id: number, data: {
    title?:        string;
    content?:      string;
    categoryId?:   number;
    thumbnailUrl?: string;
    publish?:      boolean;
  }) => api.put<ApiResponse<any>>(`/articles/${id}`, data),

  // Delete article
  delete: (id: number) =>
    api.delete<ApiResponse<any>>(`/articles/${id}`),
};

// ── Categories API ────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get<ApiResponse<any[]>>('/categories'),
};

// ── Media API ─────────────────────────────────────────────────────────────────
export const mediaApi = {
  upload: (file: File, onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ success: boolean; url: string; fileName: string }>(
      '/media/upload',
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: any) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
  },
  list:   () => api.get('/media'),
  delete: (url: string) =>
    api.delete(`/media?url=${encodeURIComponent(url)}`),
};

// ── EPaper API ────────────────────────────────────────────────────────────────
export const epaperApi = {
  list:   () => api.get<ApiResponse<any[]>>('/epapers'),
  latest: () => api.get<ApiResponse<any>>('/epapers/latest'),
  create: (data: any) => api.post<ApiResponse<any>>('/epapers', data),
  delete: (id: number) => api.delete<ApiResponse<any>>(`/epapers/${id}`),

  // Upload EPaper PDF — uses mediaApi internally
  upload: (file: File, date: string, onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append('file', file);
    form.append('date', date);
    return api.post<{ success: boolean; url: string }>(
      '/media/upload?type=pdf',
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: any) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
  },
};

// ── Admin API — dashboard stats ───────────────────────────────────────────────
// FIX: was missing from api.ts — Dashboard.tsx imports adminApi
export const adminApi = {
  getStats: () => api.get<ApiResponse<{
    totalArticles:   number;
    publishedArticles: number;
    totalCategories: number;
    totalEmployees:  number;
    totalViews:      number;
    pendingApprovals: number;
  }>>('/admin/stats'),
};

// ── Employees API ─────────────────────────────────────────────────────────────
export const employeesApi = {
  list:        () => api.get<ApiResponse<any[]>>('/employees'),
  adminList:   () => api.get<ApiResponse<any[]>>('/employees?all=true'),
  getById:     (employeeId: string) =>
    api.get<ApiResponse<any>>(`/employees/${employeeId}`),
  create:      (data: any) => api.post<ApiResponse<any>>('/employees', data),
  update:      (id: number, data: any) =>
    api.put<ApiResponse<any>>(`/employees/${id}`, data),
  softDelete:  (id: number) =>
    api.delete<ApiResponse<any>>(`/employees/${id}`),
  hardDelete:  (id: number) =>
    api.delete<ApiResponse<any>>(`/employees/${id}/hard`),
  grantLogin:  (id: number, loginEmail?: string) =>
    api.post<ApiResponse<any>>(
      `/employees/${id}/grant-login`,
      loginEmail ? { loginEmail } : {}
    ),
  revokeLogin: (id: number) =>
    api.delete<ApiResponse<any>>(`/employees/${id}/revoke-login`),
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<any>>('/auth/login', { email, password }),
  employeeLogin: (employeeId: string, password: string) =>
    api.post<ApiResponse<any>>('/auth/employee-login', { employeeId, password }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<ApiResponse<any>>('/auth/change-password', {
      currentPassword, newPassword,
    }),
};

// ── Advertisements API ────────────────────────────────────────────────────────
export const adsApi = {
  getByPlacement: (placement: string) =>
    api.get<ApiResponse<any[]>>(`/ads?placement=${placement}`),
  adminList: () =>
    api.get<ApiResponse<any[]>>('/ads/admin'),
  create: (data: any) =>
    api.post<ApiResponse<any>>('/ads', data),
  update: (id: number, data: any) =>
    api.put<ApiResponse<any>>(`/ads/${id}`, data),
  delete: (id: number) =>
    api.delete<ApiResponse<any>>(`/ads/${id}`),
  trackImpression: (id: number) => {
    api.post(`/ads/${id}/impression`).catch(() => {});
  },
  trackClick: (id: number) => {
    api.post(`/ads/${id}/click`).catch(() => {});
  },
};

// ── Editors API ───────────────────────────────────────────────────────────────
export const editorsApi = {
  list:      () => api.get<ApiResponse<any[]>>('/editors'),
  adminList: () => api.get<ApiResponse<any[]>>('/editors/all'),
  getById:   (id: number) => api.get<ApiResponse<any>>(`/editors/${id}`),
  create:    (data: any) => api.post<ApiResponse<any>>('/editors', data),
  update:    (id: number, data: any) =>
    api.put<ApiResponse<any>>(`/editors/${id}`, data),
  delete:    (id: number) =>
    api.delete<ApiResponse<any>>(`/editors/${id}`),
};
