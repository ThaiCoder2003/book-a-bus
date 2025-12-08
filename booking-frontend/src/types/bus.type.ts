import type { SeatType } from './enum'
import type { Seat } from './seat.type'
import type { Trip } from './trip.type'

export interface Bus {
    id: string
    plateNumber: string
    name: string | null // Có thể null
    totalSeats: number
    type: SeatType

    // Relations (Optional)
    seats?: Seat[]
    trips?: Trip[]
}
