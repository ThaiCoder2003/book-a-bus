import axiosClient from './axiosConfig'

const authService = {
    register: async ({
        name,
        email,
        password,
    }: {
        name: string
        email: string
        password: string
    }) => {
        return await axiosClient.post('/auth/register', {
            name,
            email,
            password,
        })
    },

    login: async ({ email, password }: { email: string; password: string }) => {
        return await axiosClient.post('/auth/login', { email, password })
    },

    refreshToken: async (refreshToken: string | null) => {
        return await axiosClient.post('/auth/refresh', { refreshToken: refreshToken })
    },
}

export default authService
