import axiosClient from './axiosConfig'

const authService = {
    register: async ({
        name,
        email,
        phone,
        password,
    }: {
        name: string
        email: string
        phone: string
        password: string
    }) => {
        return await axiosClient.post('/auth/register', {
            name,
            email,
            phone,
            password,
        })
    },

    login: async ({ email, password }: { email: string; password: string }) => {
        return await axiosClient.post('/auth/login', { email, password })
    },

    refreshToken: async (refreshToken: string | null) => {
        return await axiosClient.post('/auth/refresh', {
            refreshToken: refreshToken,
        })
    },
}

export default authService
