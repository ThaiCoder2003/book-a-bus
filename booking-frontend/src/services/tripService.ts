import type { FilterSchedule } from '@/types/filterSchedule'
import axiosClient from './axiosConfig'

const tripService = {
    getAll: (data: FilterSchedule, page: number) => {
        return axiosClient.get('/trips/getAll', {
            
            params: {
                ...data,
                page: page,
            },
        })
    },

    getAllNoFilter: async(query: string) => {
        const res = await axiosClient.get('/trips', 
            {
                params: { query },
            }
        )
        return res.data
    },

    registerNewTrip: async(payload: any) => {
        const res = await axiosClient.post('/trips/register', payload)

        return res.data.trip
    },

    updateTrip: async(id: string, payload: any) => {
        const res = await axiosClient.post(`/trips/update/${id}`, payload)

        return res.data.trip
    },

    deleteTrip: async(id: string) => {
        return await axiosClient.delete(`/trips/delete/${id}`,)
    },

    getById: (tripId: string) => {
        return axiosClient.get(`/trips/${tripId}`)
    },
}

export default tripService
