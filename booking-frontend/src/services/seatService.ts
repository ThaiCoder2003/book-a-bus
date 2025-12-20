import axiosClient from "./axiosConfig"

const seatService = {
    getByTrip: (tripId: string) => {
        return axiosClient.get(`/seats/getAll/${tripId}`)
    }
}

export default seatService