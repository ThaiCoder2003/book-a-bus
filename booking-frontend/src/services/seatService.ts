import axiosClient from './axiosConfig'

const seatService = {
    getByTrip: (tripId: string, fromOrder: number, toOrder: number) => {
        return axiosClient.get(`/seats/getAll/${tripId}`, {
            params: {
                fromOrder: fromOrder,
                toOrder: toOrder,
            },
        })
    },
}

export default seatService
