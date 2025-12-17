// src/types/trip.ts

export type TripStatus = "scheduled" | "on_going" | "completed" | "canceled";

export interface Trip {
  id: string;
  routeId: string;
  routeName: string;
  departureDate: string;
  departureTime: string;
  busCompanyName: string;
  busPlate: string;
  driverName: string;
  status: TripStatus;
  price: number;
  departurePoint?: string;
  arrivalPoint?: string;
}

export interface TripFilter {
  searchTerm: string;
  status: TripStatus | "all";
  routeId: string | "all";
  busCompanyId: string | "all";
  departureDate?: string;
  minPrice?: number;
  maxPrice?: number;
}
