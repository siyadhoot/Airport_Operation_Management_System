// src/store/index.ts
// ============================================================
//  Zustand global state stores
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AuthResponse, FlightDTO, AircraftDTO, StaffDTO,
  GateDTO, RunwayDTO, BeltDTO, PassengerDTO, BookingDTO,
  DashboardDTO, WsFlightUpdate
} from '@/types';

// ============================================================
//  AUTH STORE
// ============================================================
interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      isAuthenticated: false,
      setAuth: (auth) => {
        localStorage.setItem('airport_token', auth.token);
        localStorage.setItem('airport_user', JSON.stringify({ username: auth.username, role: auth.role }));
        set({
          token: auth.token,
          username: auth.username,
          role: auth.role,
          isAuthenticated: true,
        });
      },
      logout: () => {
        localStorage.removeItem('airport_token');
        localStorage.removeItem('airport_user');
        set({ token: null, username: null, role: null, isAuthenticated: false });
      },
    }),
    { name: 'airport_auth' }
  )
);

// ============================================================
//  FLIGHT STORE
// ============================================================
interface FlightState {
  flights: FlightDTO[];
  loading: boolean;
  error: string | null;
  setFlights: (flights: FlightDTO[]) => void;
  addFlight: (flight: FlightDTO) => void;
  updateFlight: (flight: FlightDTO) => void;
  removeFlight: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Live WebSocket update
  applyLiveUpdate: (update: WsFlightUpdate) => void;
}

export const useFlightStore = create<FlightState>()((set) => ({
  flights: [],
  loading: false,
  error: null,
  setFlights: (flights) => set({ flights }),
  addFlight: (flight) => set((state) => ({ flights: [...state.flights, flight] })),
  updateFlight: (flight) =>
    set((state) => ({
      flights: state.flights.map((f) => (f.id === flight.id ? flight : f)),
    })),
  removeFlight: (id) =>
    set((state) => ({ flights: state.flights.filter((f) => f.id !== id) })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  applyLiveUpdate: (update) => {
    if (update.type === 'FLIGHT_UPDATE' && update.flight) {
      set((state) => ({
        flights: state.flights.map((f) =>
          f.id === update.flight!.id ? update.flight! : f
        ),
      }));
    }
  },
}));

// ============================================================
//  DASHBOARD STORE
// ============================================================
interface DashboardState {
  data: DashboardDTO | null;
  loading: boolean;
  setData: (data: DashboardDTO) => void;
  setLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  data: null,
  loading: false,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));

// ============================================================
//  AIRCRAFT STORE
// ============================================================
interface AircraftState {
  aircraft: AircraftDTO[];
  loading: boolean;
  setAircraft: (aircraft: AircraftDTO[]) => void;
  addAircraft: (a: AircraftDTO) => void;
  updateAircraft: (a: AircraftDTO) => void;
  removeAircraft: (id: number) => void;
  setLoading: (l: boolean) => void;
}

export const useAircraftStore = create<AircraftState>()((set) => ({
  aircraft: [],
  loading: false,
  setAircraft: (aircraft) => set({ aircraft }),
  addAircraft: (a) => set((s) => ({ aircraft: [...s.aircraft, a] })),
  updateAircraft: (a) =>
    set((s) => ({ aircraft: s.aircraft.map((x) => (x.id === a.id ? a : x)) })),
  removeAircraft: (id) => set((s) => ({ aircraft: s.aircraft.filter((x) => x.id !== id) })),
  setLoading: (loading) => set({ loading }),
}));

// ============================================================
//  STAFF STORE
// ============================================================
interface StaffState {
  staff: StaffDTO[];
  loading: boolean;
  setStaff: (staff: StaffDTO[]) => void;
  addStaff: (s: StaffDTO) => void;
  updateStaff: (s: StaffDTO) => void;
  removeStaff: (id: number) => void;
  setLoading: (l: boolean) => void;
}

export const useStaffStore = create<StaffState>()((set) => ({
  staff: [],
  loading: false,
  setStaff: (staff) => set({ staff }),
  addStaff: (s) => set((state) => ({ staff: [...state.staff, s] })),
  updateStaff: (s) =>
    set((state) => ({ staff: state.staff.map((x) => (x.id === s.id ? s : x)) })),
  removeStaff: (id) => set((state) => ({ staff: state.staff.filter((x) => x.id !== id) })),
  setLoading: (l) => set({ loading: l }),
}));

// ============================================================
//  RESOURCE STORE (Gates, Runways, Belts)
// ============================================================
interface ResourceState {
  gates: GateDTO[];
  runways: RunwayDTO[];
  belts: BeltDTO[];
  loading: boolean;
  setGates: (gates: GateDTO[]) => void;
  setRunways: (runways: RunwayDTO[]) => void;
  setBelts: (belts: BeltDTO[]) => void;
  updateGate: (g: GateDTO) => void;
  updateRunway: (r: RunwayDTO) => void;
  updateBelt: (b: BeltDTO) => void;
  setLoading: (l: boolean) => void;
}

export const useResourceStore = create<ResourceState>()((set) => ({
  gates: [], runways: [], belts: [], loading: false,
  setGates: (gates) => set({ gates }),
  setRunways: (runways) => set({ runways }),
  setBelts: (belts) => set({ belts }),
  updateGate: (g) =>
    set((s) => ({ gates: s.gates.map((x) => (x.id === g.id ? g : x)) })),
  updateRunway: (r) =>
    set((s) => ({ runways: s.runways.map((x) => (x.id === r.id ? r : x)) })),
  updateBelt: (b) =>
    set((s) => ({ belts: s.belts.map((x) => (x.id === b.id ? b : x)) })),
  setLoading: (l) => set({ loading: l }),
}));
