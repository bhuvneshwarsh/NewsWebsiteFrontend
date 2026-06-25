// Add these to your existing src/services/api.ts
import axios from 'axios';
import type { EmployeeCard, EmployeeDetail, EmployeeAdmin, CreateEmployeePayload } from '../types/employee';
import type { ApiResponse } from '../types/index';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || '/api'
});

// ── Employees ─────────────────────────────────────────────────────────────────
export const employeesApi = {
  // Public: active employees only
  list: () =>
    api.get<ApiResponse<EmployeeCard[]>>('/employees'),

  // Public: one employee detail by employeeId string e.g. "EMP-2024-00001"
  getById: (employeeId: string) =>
    api.get<ApiResponse<EmployeeDetail>>(`/employees/${employeeId}`),

  // Admin: all employees including inactive
  adminList: () =>
    api.get<ApiResponse<EmployeeAdmin[]>>('/employees?all=true'),

  // SuperAdmin only
  create: (data: CreateEmployeePayload) =>
    api.post<ApiResponse<EmployeeAdmin>>('/employees', data),

  update: (id: number, data: CreateEmployeePayload & { isActive: boolean }) =>
    api.put<ApiResponse<EmployeeAdmin>>(`/employees/${id}`, data),

  deactivate: (id: number) =>
    api.delete<ApiResponse<{ id: number }>>(`/employees/${id}`),

  hardDelete: (id: number) =>
    api.delete<ApiResponse<{ id: number }>>(`/employees/${id}/hard`),
};
