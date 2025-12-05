import axiosClient from './axiosConfig'

const tripService = {
    getAll: async (departureDay?: string, from?: string, to?: string) => {
        return await axiosClient.get('/trips/getAll', {
            params: {
                from,
                to,
                departureDay,
            },
        })
    },
}

export default tripService
