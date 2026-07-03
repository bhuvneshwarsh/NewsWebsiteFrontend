// ── Add to your existing src/services/api.ts ─────────────────────────────────
import axios from 'axios';

import type { AdPublic, AdAdmin, CreateAdPayload } from '../types/ads';
import type { ApiResponse } from '../types/index';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || '/api'
});

export const adsApi = {
  // Public: fetch active ads for a placement
  getByPlacement: (placement: string) =>
    api.get<ApiResponse<AdPublic[]>>(`/ads?placement=${placement}`),

  // Admin: all ads with stats
  adminList: () =>
    api.get<ApiResponse<AdAdmin[]>>('/ads/admin'),

  // SuperAdmin: create ad
  create: (data: CreateAdPayload) =>
    api.post<ApiResponse<AdAdmin>>('/ads', data),

  // SuperAdmin: update ad
  update: (id: number, data: CreateAdPayload) =>
    api.put<ApiResponse<AdAdmin>>(`/ads/${id}`, data),

  // SuperAdmin: delete ad
  delete: (id: number) =>
    api.delete<ApiResponse<{ id: number }>>(`/ads/${id}`),

  // Public: track impression (fire and forget)
  trackImpression: (id: number) => {
    api.post(`/ads/${id}/impression`).catch(() => {});
  },

  // Public: track click (fire and forget)
  trackClick: (id: number) => {
    api.post(`/ads/${id}/click`).catch(() => {});
  },
};
