// ============================================================
// API Response types
// ============================================================

export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  meta: ApiMeta;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Auth types
// ============================================================

export type UserRole = 'admin' | 'staff' | 'billing';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthData {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ============================================================
// Client types
// ============================================================

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
}

export type UpdateClientRequest = Partial<CreateClientRequest>;

export interface ClientListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
}

// ============================================================
// Membership types
// ============================================================

export type MembershipStatus = 'active' | 'expired' | 'cancelled';
export type PriceType = 'standard' | 'student';

export interface Membership {
  id: string;
  clientId: string;
  planId: string;
  planName: string;
  priceType: PriceType;
  price: number;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  createdBy: string;
  createdAt: string;
}

export interface CreateMembershipRequest {
  clientId: string;
  planId: string;
  priceType: PriceType;
  startDate: string;
}

export interface UpdateMembershipStatusRequest {
  status: MembershipStatus;
}

export interface MembershipListParams {
  page?: number;
  limit?: number;
  status?: MembershipStatus;
  clientId?: string;
}

// ============================================================
// Payment types
// ============================================================

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer';

export interface Payment {
  id: string;
  clientId: string;
  membershipId: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  paidAt: string;
  createdBy: string;
}

export interface CreatePaymentRequest {
  clientId: string;
  membershipId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
  clientId?: string;
  from?: string;
  to?: string;
}

// ============================================================
// Dashboard types
// ============================================================

export interface DashboardMetrics {
  activeMemberships: number;
  expiringIn7Days: number;
  revenueToday: number;
  revenueThisMonth: number;
  upcomingExpirations: ExpiringMembership[];
}

export interface ExpiringMembership {
  clientId: string;
  clientName: string;
  membershipId: string;
  endDate: string;
  daysLeft: number;
}

// ============================================================
// Report types
// ============================================================

export interface ExpirationReport {
  clientId: string;
  clientName: string;
  membershipId: string;
  endDate: string;
  daysLeft: number;
  status: MembershipStatus;
}

export interface RevenueReport {
  date: string;
  total: number;
  count: number;
  byMethod: {
    cash: number;
    card: number;
    bank_transfer: number;
  };
}

export type ReportType = 'expirations' | 'revenue';

export interface ReportParams {
  from: string;
  to: string;
}

// ============================================================
// Audit Log types
// ============================================================

export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  entity: string;
  entityId: string;
  beforeJson?: string;
  afterJson?: string;
  createdAt: string;
}

export interface AuditLogParams {
  page?: number;
  limit?: number;
  entity?: string;
  entityId?: string;
}
