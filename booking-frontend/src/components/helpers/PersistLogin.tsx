import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import authService from '@/services/authService'
import { jwtDecode } from 'jwt-decode'

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const verifyRefreshToken = async () => {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')

            if (!refreshToken) return setIsLoading(false)

            let isExpired = true
            if (accessToken) {
                try {
                    const decoded: any = jwtDecode(accessToken)
                    const currentTime = Date.now() / 1000
                    console.log(decoded)

                    if (decoded.exp > currentTime) {
                        isExpired = false
                    }
                } catch (e) {
                    isExpired = true // Token lỗi coi như hết hạn
                }
            }

            if (isExpired) {
                try {
                    const response = await authService.refreshToken(
                        refreshToken,
                    )

                    const newAccessToken = response.data.accessToken
                    const newRefreshToken = response.data.refreshToken

                    if (newAccessToken && newRefreshToken) {
                        localStorage.setItem('accessToken', newAccessToken)
                        localStorage.setItem('refreshToken', newRefreshToken)
                    }
                } catch (err) {
                    console.error('Refresh token failed:', err)
                    localStorage.clear()
                    window.location.replace('/auth')
                } finally {
                    setIsLoading(false)
                }
            } else {
                setIsLoading(false)
            }
        }

        verifyRefreshToken()
    }, [])

    if (isLoading) {
        return (
            <div
                style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <p>Đang tải dữ liệu...</p>
            </div>
        )
    }

    return <Outlet />
}

export default PersistLogin
