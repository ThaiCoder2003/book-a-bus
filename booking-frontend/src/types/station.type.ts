import type { Trip } from "./trip.type"

export interface Station {
    id: string
    name: string
    address: string | null
    province: string

    // Relations (Optional)
    departingTrips?: Trip[]
    arrivingTrips?: Trip[]
}
