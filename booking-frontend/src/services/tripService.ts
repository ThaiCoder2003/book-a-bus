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

    getById: (tripId: string) => {
        return axiosClient.get(`/trips/${tripId}`)
    },
}

export default tripService
