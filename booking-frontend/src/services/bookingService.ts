import axiosClient from './axiosConfig'
import type { Booking } from '@/types/booking.type';

const bookingService = {
    getAll: async(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        route?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await axiosClient.get('/bookings', { params });
        return response.data
    }, 

    create: (payload: {
        tripId: string
        seatIds: string[]
        fromOrder: number
        toOrder: number
        depStationId: string
        arrStationId: string
    }) => {
        return axiosClient.post('/bookings/create', payload)
    },

    getById: (bookingId: string) => {
        return axiosClient.get(`/bookings/${bookingId}`)
    },

    getByIdForAdmin: async(bookingId: string): Promise<Booking> => {
        const response = await axiosClient.get(`/bookings/admin/${bookingId}`)
        return response.data
    },

    cancel: async(bookingId: string): Promise<Booking> => {
        const response = await axiosClient.put(`/bookings/cancel/${bookingId}`)
        return response.data.updated
    },

    resend: async(bookingId: string): Promise<Booking> => {
        const response = await axiosClient.put(`/bookings/resend/${bookingId}`)
        return response.data.updated
    },

    update: async(bookingId: string, newAmount: number): Promise<Booking> => {
        const response = await axiosClient.put(`/bookings/update/${bookingId}`, { newAmount })
        return response.data.updated
    }
}

export default bookingService
