import axiosClient from './axiosConfig'

const bookingService = {
    create: async (payload: {
        tripId: string
        seatIds: string[]
        fromOrder: number
        toOrder: number
        depStationId: string
        arrStationId: string
    }) => {
        return axiosClient.post('/bookings/create', payload)
    },
}

export default bookingService
