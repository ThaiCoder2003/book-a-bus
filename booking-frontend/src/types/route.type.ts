import type { RouteStation } from './RouteStation.type'
import type { Trip } from './trip.type'

export interface Route {
    id: string
    name: string

    _count?: {
        route_station: number;
        trips: number;
    };

    // Các trường ảo (Virtual fields) tạo ra từ lúc format ở Backend
    startLocation?: string
    endLocation?: string

    // Relations
    stops?: RouteStation[]
    trips?: Trip[]
}
