import type { Bus } from './bus.type'
import type { SeatStatus } from './enum'
import type { Ticket } from './ticket.type'

export interface Seat {
    id: string
    busId: string
    label: string // VD: A01, B02
    floor: number
    row: number
    col: number
    isActive: boolean
    status: SeatStatus // Mặc định AVAILABLE

    // Relations (Optional)
    bus?: Bus
    tickets?: Ticket[]
}
