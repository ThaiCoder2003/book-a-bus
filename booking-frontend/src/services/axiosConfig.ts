import authAction from '@/actions/authAction'
import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

// const BASE_URL = 'http://localhost:3000/api'
const BASE_URL = 'https://book-a-bus-backend-7p28.onrender.com/api'


const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 giây
})

// request interceptors
axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await authAction.getToken()
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
                const refreshToken = await authAction.getRefreshToken()

                if (!refreshToken) {
                    await authAction.clearToken()
                    window.location.replace('/auth')
                    return Promise.reject(error)
                }

                // gọi refresh api
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken: refreshToken,
                })

                const { accessToken, refreshToken: newRefreshToken } =
                    response.data

                // Lưu token mới
                await authAction.setToken(accessToken, newRefreshToken)

                // Cập nhật token cho request bị lỗi lúc nãy
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                }

                // Gọi lại request ban đầu với token mới
                return axiosClient(originalRequest)
            } catch (refreshError) {
                await authAction.clearToken()
                window.location.replace('/auth')
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

export default axiosClient
