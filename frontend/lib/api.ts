import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, ApiErrorResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }

  async downloadBlob(url: string, params?: Record<string, unknown>): Promise<Blob> {
    const response = await this.client.get(url, {
      params,
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

// ============================================================
// Auth API
// ============================================================
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<import('@/types').AuthData>('/auth/login', { email, password }),

  logout: () =>
    apiClient.post<null>('/auth/logout'),

  me: () =>
    apiClient.get<import('@/types').User>('/auth/me'),
};

// ============================================================
// Clients API
// ============================================================
export const clientsApi = {
  list: (params?: import('@/types').ClientListParams) =>
    apiClient.get<import('@/types').PaginatedData<import('@/types').Client>>('/clients', params),

  get: (clientId: string) =>
    apiClient.get<import('@/types').Client>(`/clients/${clientId}`),

  create: (data: import('@/types').CreateClientRequest) =>
    apiClient.post<import('@/types').Client>('/clients', data),

  update: (clientId: string, data: import('@/types').UpdateClientRequest) =>
    apiClient.put<import('@/types').Client>(`/clients/${clientId}`, data),

  deactivate: (clientId: string) =>
    apiClient.patch<import('@/types').Client>(`/clients/${clientId}/deactivate`),
};

// ============================================================
// Memberships API
// ============================================================
export const membershipsApi = {
  list: (params?: import('@/types').MembershipListParams) =>
    apiClient.get<import('@/types').PaginatedData<import('@/types').Membership>>('/memberships', params),

  get: (membershipId: string) =>
    apiClient.get<import('@/types').Membership>(`/memberships/${membershipId}`),

  create: (data: import('@/types').CreateMembershipRequest) =>
    apiClient.post<import('@/types').Membership>('/memberships', data),

  updateStatus: (membershipId: string, status: import('@/types').MembershipStatus) =>
    apiClient.patch<import('@/types').Membership>(`/memberships/${membershipId}/status`, { status }),
};

// ============================================================
// Payments API
// ============================================================
export const paymentsApi = {
  list: (params?: import('@/types').PaymentListParams) =>
    apiClient.get<import('@/types').PaginatedData<import('@/types').Payment>>('/payments', params),

  get: (paymentId: string) =>
    apiClient.get<import('@/types').Payment>(`/payments/${paymentId}`),

  create: (data: import('@/types').CreatePaymentRequest) =>
    apiClient.post<import('@/types').Payment>('/payments', data),

  downloadReceipt: (paymentId: string) =>
    apiClient.downloadBlob(`/payments/${paymentId}/receipt`),
};

// ============================================================
// Dashboard API
// ============================================================
export const dashboardApi = {
  metrics: () =>
    apiClient.get<import('@/types').DashboardMetrics>('/dashboard/metrics'),
};

// ============================================================
// Reports API
// ============================================================
export const reportsApi = {
  expirations: (params: import('@/types').ReportParams) =>
    apiClient.get<import('@/types').ExpirationReport[]>('/reports/expirations', params),

  revenue: (params: import('@/types').ReportParams) =>
    apiClient.get<import('@/types').RevenueReport[]>('/reports/revenue', params),

  exportPdf: (type: import('@/types').ReportType, params: import('@/types').ReportParams) =>
    apiClient.downloadBlob('/reports/export/pdf', { type, ...params }),
};

// ============================================================
// Admin / Ops API
// ============================================================
export const adminApi = {
  auditLogs: (params?: import('@/types').AuditLogParams) =>
    apiClient.get<import('@/types').PaginatedData<import('@/types').AuditLog>>('/audit-logs', params),

  triggerReminders: () =>
    apiClient.post<null>('/admin/notifications/reminders/run'),

  triggerBackup: () =>
    apiClient.post<null>('/admin/backup/run'),
};
