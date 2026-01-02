import axiosClient from './axiosConfig'

import type { Station } from '@/types/station.type'

interface StationResponse {
    stations: Station[];
    stationNumber: number;
}

const stationService = {
    getStations: (): Promise<StationResponse> => 
        axiosClient.get('/station').then(res => res.data.result),

    registerNewStation: async (data: Omit<Station, "id">): Promise<Station> => 
        axiosClient.post('/station', data).then(res => res.data.station),

    updateStation: async (data: Partial<Station>, id: string) => 
        axiosClient.put(`/station/${id}`, data).then(res => res.data.station),

    deleteStation: async (id: string) => await axiosClient.delete(`/station/${id}`)
}

export default stationService