import type { Trip } from './trip.type'
import type { RouteStop } from './routeStop.type'

export interface Route {
    id: string
    name: string

    // Relations
    stops?: RouteStop[]
    trips?: Trip[]
}
