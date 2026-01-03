import type { Seat } from '@/types/seat.type';
import axiosClient from './axiosConfig'

import type { Bus } from "@/types/bus.type";

interface BusResponse {
    buses: Bus[];
    countBus: number;
    countSeat: number;
}

const stationService = {
    getBuses: (searchTerm: string = ''): Promise<BusResponse> => 
        axiosClient.get('/bus', {
            params: { searchTerm }
        }).then(res => res.data.busData),

    getBusById: (id: string):  Promise<Bus> => 
        axiosClient.get(`/bus/${id}`).then(res => res.data),

    registernewBus: (payload: any): Promise<Bus> =>
        axiosClient.post('/bus/register', payload).then(res => res.data.bus),

    updateBus: (id: string, payload: any): Promise<Bus> =>
        axiosClient.put(`/bus/update/${id}`, payload).then(res => res.data.bus),

    deleteBus: async (id: string) => {
        return await axiosClient.delete(`/bus/delete/${id}`)
    },

    updateBusSeats: async (id: string, seatsArray: Seat[]) => {
        return await axiosClient.put(`/bus/seats/${id}`, seatsArray)
    }
}

export default stationService
