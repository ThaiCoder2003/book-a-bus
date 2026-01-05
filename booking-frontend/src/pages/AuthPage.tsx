import authAction from '@/actions/authAction'
import authService from '@/services/authService'
import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AuthPage: FC = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    // handle submit
    const handleRegisterSubmit = async (e?: FormEvent) => {
        try {
            if (e) e.preventDefault()

            const res = await authService.register({
                name,
                email,
                phone,
                password,
            })

            if (res && res.data.id) {
                toast.success('Đăng kí tài khoản thành công')
                setName('')
                setEmail('')
                setPhone('')
                setPassword('')
                setConfirmPassword('')
            }
        } catch (error: any) {
            const message = error.response?.data?.message

            const finalMessage = Array.isArray(message)
                ? message.join(', ') // Nếu là mảng lỗi (Validation) -> Nối lại thành câu
                : message ||
                  error.message ||
                  'Có lỗi xảy ra trong quá trình đăng nhập'

            console.error(finalMessage)
            toast.error(finalMessage)
        }
    }

    const handleLoginSubmit = async (e?: FormEvent) => {
        try {
            if (e) e.preventDefault()

            const res = await authService.login({ email, password })
            const user = res.data.user
            if (res && res?.data?.token) {
                const tokens = res.data.token

                authAction.setToken(tokens.accessToken, tokens.refreshToken)
                toast.success('Đăng nhập thành công')
                if (user?.role === 'ADMIN') {
                    navigate('/admin', { replace: true })
                } else {
                    navigate(from, { replace: true })
                }
            }
        } catch (error: any) {
            const message = error.response?.data?.message

            const finalMessage = Array.isArray(message)
                ? message.join(', ') // Nếu là mảng lỗi (Validation) -> Nối lại thành câu
                : message ||
                  error.message ||
                  'Có lỗi xảy ra trong quá trình đăng kí'

            console.error(finalMessage)
            toast.error(finalMessage)
        }
    }

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (isLogin) {
            handleLoginSubmit()
        } else {
            handleRegisterSubmit()
        }
    }

    return (
        // CONTAINER CHÍNH:
        <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-b from-[#e6eef7] to-white">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-[500px]">
                <div className="flex mb-6 border-b">
                    <button
                        onClick={() => {
                            setEmail('')
                            setPassword('')
                            setIsLogin(true)
                        }}
                        className={`flex-1 pb-2 text-lg font-semibold transition-all ${
                            isLogin
                                ? 'border-b-4 border-orange-500 text-orange-600'
                                : 'text-gray-500 hover:text-orange-500'
                        }`}
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => {
                            setEmail('')
                            setPassword('')
                            setConfirmPassword('')
                            setIsLogin(false)
                        }}
                        className={`flex-1 pb-2 text-lg font-semibold transition-all ${
                            !isLogin
                                ? 'border-b-4 border-orange-500 text-orange-600'
                                : 'text-gray-500 hover:text-orange-500'
                        }`}
                    >
                        Đăng kí
                    </button>
                </div>

                <form onSubmit={onFormSubmit}>
                    {/* Title (Căn giữa tiêu đề) */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-1">
                            {isLogin ? 'Đăng nhập' : 'Đăng kí'}
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Bus Booking {isLogin ? 'Access' : 'Registration'}
                        </p>
                    </div>
                    {/* Username (only visible when sign up) */}
                    {!isLogin && (
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Tên người dùng"
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    {/* Email */}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {/* Phone */}
                    {!isLogin && (
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    {/* Password */}
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* Confirmation (only visible when sign up) */}
                    {!isLogin && (
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                    )}
                    {/* Button */}
                    <button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl mt-4 font-semibold transition-colors"
                        type="submit"
                    >
                        {isLogin ? 'Đăng nhập' : 'Đăng kí'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuthPage
