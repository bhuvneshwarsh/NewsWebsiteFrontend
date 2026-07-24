// Add to your existing src/services/api.ts

import axios from 'axios';
import type { EditorProfile, CreateEditorPayload } from '../types/editor';

import type {  ApiResponse } from '../types';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || '/api'
});
export const editorsApi = {
  // Public — active editors only
  list: () =>
    api.get<ApiResponse<EditorProfile[]>>('/editors'),

  // Admin — all including inactive
  adminList: () =>
    api.get<ApiResponse<EditorProfile[]>>('/editors/all'),

  getById: (id: number) =>
    api.get<ApiResponse<EditorProfile>>(`/editors/${id}`),

  create: (data: CreateEditorPayload) =>
    api.post<ApiResponse<EditorProfile>>('/editors', data),

  update: (id: number, data: CreateEditorPayload) =>
    api.put<ApiResponse<EditorProfile>>(`/editors/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<{ id: number }>>(`/editors/${id}`),
};
