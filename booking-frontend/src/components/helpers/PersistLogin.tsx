import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import authService from '@/services/authService'

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const verifyRefreshToken = async () => {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')

            if (!accessToken && refreshToken) {
                try {
                    const response = await authService.refreshToken(
                        refreshToken,
                    )

                    localStorage.setItem(
                        'accessToken',
                        response.data.accessToken,
                    )

                    if (response.data.refreshToken) {
                        localStorage.setItem(
                            'refreshToken',
                            response.data.refreshToken,
                        )
                    }
                } catch (err) {
                    console.error('Refresh token failed:', err)
                    localStorage.clear()
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
