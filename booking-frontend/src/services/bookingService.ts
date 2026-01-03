import axiosClient from './axiosConfig'

const bookingService = {
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
    }
}

export default bookingService
