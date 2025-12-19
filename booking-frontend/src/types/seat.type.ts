import type { Bus } from './bus.type'
import type { Ticket } from './ticket.type'

export interface Seat {
    id: string
    busId: string
    label: string // VD: A01, B02
    floor: number
    row: number
    col: number
    isActive: boolean

    // Relations (Optional)
    bus?: Bus
    tickets?: Ticket[]
}
