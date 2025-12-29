import { jwtDecode, type JwtPayload } from 'jwt-decode'

export interface DecodedToken extends JwtPayload {
    userId: string
    email: string
    name: string
    role: 'USER' | 'ADMIN'
}

const authAction = {
    getToken: async () => {
        return localStorage.getItem('accessToken')
    },

    getRefreshToken: async () => {
        return localStorage.getItem('refreshToken')
    },

    setToken: async (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
    },

    clearToken: async () => {
        localStorage.clear()
    },

    decodeToken: async (token: string) => {
        return token ? jwtDecode<DecodedToken>(token) : null
    },
}

export default authAction
