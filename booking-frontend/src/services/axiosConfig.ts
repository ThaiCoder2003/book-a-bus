import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const BASE_URL = 'http://localhost:4000'

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 giây
})

// auth actions
const getToken = async () => {
    return localStorage.getItem('accessToken')
}

const getRefreshToken = async () => {
    return localStorage.getItem('refreshToken')
}

const setToken = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
}

const clearToken = async () => {
    localStorage.clear()
}

// request interceptors
axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getToken()
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        }

        // Nếu lỗi là 401 (Hết hạn token)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // Đánh dấu để tránh lặp vô tận

            try {
                const refreshToken = await getRefreshToken()

                if (!refreshToken) {
                    await clearToken()
                    window.location.href = '/login'
                    return Promise.reject(error)
                }

                // gọi refresh api
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken: refreshToken,
                })

                const { accessToken, refreshToken: newRefreshToken } =
                    response.data

                // Lưu token mới
                await setToken(accessToken, newRefreshToken)

                // Cập nhật token cho request bị lỗi lúc nãy
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                }

                // Gọi lại request ban đầu với token mới
                return axiosClient(originalRequest)
            } catch (refreshError) {
                await clearToken()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

export default axiosClient
