import type { FilterSchedule } from '@/types/filterSchedule'
import axiosClient from './axiosConfig'

const tripService = {
    getAll: async (data: FilterSchedule, page: number) => {
        return await axiosClient.get('/trips/getAll', {
            params: {
                ...data,
                page: page,
            },
        })
    },
}

export default tripService
