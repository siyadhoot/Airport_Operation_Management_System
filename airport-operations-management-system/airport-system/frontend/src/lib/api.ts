// src/lib/api.ts
// ============================================================
//  Axios instance + typed API service functions
// ============================================================
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  AuthResponse, FlightDTO, FlightCreateRequest, AircraftDTO,
  StaffDTO, GateDTO, RunwayDTO, BeltDTO, PassengerDTO,
  BookingDTO, DashboardDTO, UserDTO
} from '@/types';

// ---- Axios Instance ----
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('airport_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect on 401
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('airport_token');
      localStorage.removeItem('airport_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const authApi = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),
  register: (data: { username: string; password: string; email: string; role?: string }) =>
    api.post<UserDTO>('/auth/register', data),
  getUsers: () => api.get<UserDTO[]>('/users'),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

// ---- Flights ----
export const flightApi = {
  getAll: (status?: string) =>
    api.get<FlightDTO[]>('/flights', { params: status ? { status } : {} }),
  getById: (id: number) => api.get<FlightDTO>(`/flights/${id}`),
  create: (data: FlightCreateRequest) => api.post<FlightDTO>('/flights', data),
  update: (id: number, data: FlightCreateRequest) => api.put<FlightDTO>(`/flights/${id}`, data),
  updateStatus: (id: number, value: string) =>
    api.patch<FlightDTO>(`/flights/${id}/status`, null, { params: { value } }),
  delete: (id: number) => api.delete(`/flights/${id}`),
};

// ---- Aircraft ----
export const aircraftApi = {
  getAll: () => api.get<AircraftDTO[]>('/aircraft'),
  getById: (id: number) => api.get<AircraftDTO>(`/aircraft/${id}`),
  create: (data: Partial<AircraftDTO>) => api.post<AircraftDTO>('/aircraft', data),
  update: (id: number, data: Partial<AircraftDTO>) => api.put<AircraftDTO>(`/aircraft/${id}`, data),
  updateStatus: (id: number, value: string) =>
    api.patch<AircraftDTO>(`/aircraft/${id}/status`, null, { params: { value } }),
  delete: (id: number) => api.delete(`/aircraft/${id}`),
};

// ---- Staff ----
export const staffApi = {
  getAll: () => api.get<StaffDTO[]>('/staff'),
  getById: (id: number) => api.get<StaffDTO>(`/staff/${id}`),
  create: (data: Partial<StaffDTO>) => api.post<StaffDTO>('/staff', data),
  update: (id: number, data: Partial<StaffDTO>) => api.put<StaffDTO>(`/staff/${id}`, data),
  delete: (id: number) => api.delete(`/staff/${id}`),
};

// ---- Gates ----
export const gateApi = {
  getAll: () => api.get<GateDTO[]>('/gates'),
  getById: (id: number) => api.get<GateDTO>(`/gates/${id}`),
  create: (data: { gateCode: string; terminal: string }) => api.post<GateDTO>('/gates', data),
  update: (id: number, data: { gateCode: string; terminal: string }) =>
    api.put<GateDTO>(`/gates/${id}`, data),
  assign: (id: number, flightId: number) =>
    api.post<GateDTO>(`/gates/${id}/assign`, { flightId }),
  release: (id: number) => api.post<GateDTO>(`/gates/${id}/release`),
  delete: (id: number) => api.delete(`/gates/${id}`),
};

// ---- Runways ----
export const runwayApi = {
  getAll: () => api.get<RunwayDTO[]>('/runways'),
  getById: (id: number) => api.get<RunwayDTO>(`/runways/${id}`),
  create: (data: { runwayCode: string; lengthMeters: number }) =>
    api.post<RunwayDTO>('/runways', data),
  update: (id: number, data: { runwayCode: string; lengthMeters: number }) =>
    api.put<RunwayDTO>(`/runways/${id}`, data),
  assign: (id: number, flightId: number) =>
    api.post<RunwayDTO>(`/runways/${id}/assign`, { flightId }),
  release: (id: number) => api.post<RunwayDTO>(`/runways/${id}/release`),
  delete: (id: number) => api.delete(`/runways/${id}`),
};

// ---- Baggage Belts ----
export const beltApi = {
  getAll: () => api.get<BeltDTO[]>('/belts'),
  getById: (id: number) => api.get<BeltDTO>(`/belts/${id}`),
  create: (data: { beltCode: string; terminal: string }) => api.post<BeltDTO>('/belts', data),
  update: (id: number, data: { beltCode: string; terminal: string }) =>
    api.put<BeltDTO>(`/belts/${id}`, data),
  assign: (id: number, flightId: number) =>
    api.post<BeltDTO>(`/belts/${id}/assign`, { flightId }),
  release: (id: number) => api.post<BeltDTO>(`/belts/${id}/release`),
  delete: (id: number) => api.delete(`/belts/${id}`),
};

// ---- Passengers ----
export const passengerApi = {
  getAll: () => api.get<PassengerDTO[]>('/passengers'),
  getById: (id: number) => api.get<PassengerDTO>(`/passengers/${id}`),
  create: (data: Partial<PassengerDTO>) => api.post<PassengerDTO>('/passengers', data),
  update: (id: number, data: Partial<PassengerDTO>) =>
    api.put<PassengerDTO>(`/passengers/${id}`, data),
  delete: (id: number) => api.delete(`/passengers/${id}`),
};

// ---- Bookings ----
export const bookingApi = {
  getAll: () => api.get<BookingDTO[]>('/bookings'),
  getById: (id: number) => api.get<BookingDTO>(`/bookings/${id}`),
  getByPassenger: (passengerId: number) =>
    api.get<BookingDTO[]>(`/bookings/passenger/${passengerId}`),
  getByFlight: (flightId: number) => api.get<BookingDTO[]>(`/bookings/flight/${flightId}`),
  create: (data: { passengerId: number; flightId: number; seatNumber?: string }) =>
    api.post<BookingDTO>('/bookings', data),
  updateStatus: (id: number, value: string) =>
    api.patch<BookingDTO>(`/bookings/${id}/status`, null, { params: { value } }),
  delete: (id: number) => api.delete(`/bookings/${id}`),
};

// ---- Dashboard ----
export const dashboardApi = {
  get: () => api.get<DashboardDTO>('/dashboard'),
};

export default api;
