import type { RouteStation } from './RouteStation.type'
import type { Trip } from './trip.type'

export interface Route {
    id: string
    name: string

    // Relations
    stops?: RouteStation[]
    trips?: Trip[]
}
