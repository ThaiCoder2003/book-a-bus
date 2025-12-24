import type { SeatType } from './enum'
import type { Bus } from './bus.type'
import type { Ticket } from './ticket.type'

export interface Seat {
    id: string
    busId: string
    label: string
    floor: number
    row: number
    col: number
    type: SeatType
    isAvailable: boolean

    // Relations
    bus?: Bus
    tickets?: Ticket[]
}
