import type { Seat } from './seat.type'
import type { Trip } from './trip.type'

export interface Bus {
    id: string
    plateNumber: string
    name: string
    totalSeats: number

    // Relations
    seats?: Seat[]
    trips?: Trip[]
}
