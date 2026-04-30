// src/types/index.ts
// ============================================================
//  Shared TypeScript types — mirrors Java DTOs exactly
// ============================================================

export type Role = 'ADMIN' | 'STAFF';

export interface AuthResponse {
  token: string;
  username: string;
  role: Role;
  expiresIn: number;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  role: Role;
}

// ---- FLIGHT ----
export type FlightType = 'DomesticFlight' | 'InternationalFlight' | 'CargoFlight' | 'EmergencyFlight';
export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'ARRIVED' | 'DELAYED' | 'CANCELLED' | 'EMERGENCY';

export interface FlightDTO {
  id: number;
  dtype: FlightType;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  aircraftId?: number;
  aircraftRegistration?: string;
  priority: number;
  // Subtype fields
  zone?: string;
  countryCode?: string;
  customsRequired?: boolean;
  cargoWeightKg?: number;
  cargoType?: string;
  emergencyReason?: string;
  priorityLevel?: number;
}

export interface FlightCreateRequest {
  dtype: FlightType;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraftId?: number;
  zone?: string;
  countryCode?: string;
  customsRequired?: boolean;
  cargoWeightKg?: number;
  cargoType?: string;
  emergencyReason?: string;
  priorityLevel?: number;
}

// ---- AIRCRAFT ----
export type AircraftStatus = 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'GROUNDED';

export interface AircraftDTO {
  id: number;
  registrationNumber: string;
  model: string;
  manufacturer?: string;
  capacity: number;
  status: AircraftStatus;
}

// ---- STAFF ----
export type StaffType = 'Pilot' | 'GroundStaff' | 'AirHostess';
export type StaffStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';

export interface StaffDTO {
  id: number;
  dtype: StaffType;
  name: string;
  employeeId: string;
  email: string;
  phone?: string;
  status: StaffStatus;
  staffType: string;
  licenseNumber?: string;
  flightHours?: number;
  areaAssigned?: string;
  languageSkills?: string;
}

// ---- GATE ----
export type GateStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface GateDTO {
  id: number;
  gateCode: string;
  terminal: string;
  status: GateStatus;
  currentFlightId?: number;
  currentFlightNumber?: string;
}

// ---- RUNWAY ----
export type RunwayStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'CLOSED';

export interface RunwayDTO {
  id: number;
  runwayCode: string;
  lengthMeters: number;
  status: RunwayStatus;
  currentFlightId?: number;
  currentFlightNumber?: string;
}

// ---- BELT ----
export type BeltStatus = 'AVAILABLE' | 'ACTIVE' | 'MAINTENANCE';

export interface BeltDTO {
  id: number;
  beltCode: string;
  terminal: string;
  status: BeltStatus;
  currentFlightId?: number;
  currentFlightNumber?: string;
}

// ---- PASSENGER ----
export interface PassengerDTO {
  id: number;
  name: string;
  email: string;
  phone?: string;
  passportNumber?: string;
  nationality?: string;
}

// ---- BOOKING ----
export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN' | 'BOARDED';

export interface BookingDTO {
  id: number;
  bookingReference: string;
  passengerId: number;
  passengerName: string;
  flightId: number;
  flightNumber: string;
  seatNumber?: string;
  status: BookingStatus;
  bookingTime: string;
}

// ---- DASHBOARD ----
export interface DashboardDTO {
  totalFlights: number;
  scheduledFlights: number;
  delayedFlights: number;
  activeFlights: number;
  totalPassengers: number;
  totalBookings: number;
  totalAircraft: number;
  availableGates: number;
  availableRunways: number;
  availableBelts: number;
  totalStaff: number;
  recentFlights: FlightDTO[];
}

// ---- WebSocket ----
export interface WsFlightUpdate {
  type: 'FLIGHT_UPDATE' | 'PONG';
  flight?: FlightDTO;
  timestamp: string;
  message?: string;
}
