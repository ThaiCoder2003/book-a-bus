import { Bell, Menu, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import authAction from '@/actions/authAction'
import { toast } from 'react-toastify'

export default function UserHeader() {
    const location = useLocation()
    const isHomeActive =
        location.pathname === '/' || location.pathname === '/dashboard'
    const [username, setUsername] = useState('')

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('accessToken')

            if (token) {
                try {
                    const decoded = await authAction.decodeToken(token)

                    if (decoded && decoded.name) {
                        setUsername(decoded.name)
                    }
                } catch (error) {
                    await authAction.clearToken()
                    window.location.replace('/schedule')
                }
            } else {
                toast.error("Can't get necessary token")
            }
        }

        checkToken()
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0064D2] text-white">
                        <Ticket className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#0064D2]">
                        Vexere
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-8">
                    {username && (
                        <NavLink
                            to="/dashboard"
                            end
                            className={cn(
                                'text-sm font-medium transition-colors',
                                isHomeActive
                                    ? 'text-foreground font-semibold'
                                    : 'text-muted-foreground hover:text-primary',
                            )}
                        >
                            Trang chủ
                        </NavLink>
                    )}

                    <NavLink
                        to="/schedule"
                        className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Chuyến xe
                    </NavLink>
                    <NavLink
                        to="/sales"
                        className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Ưu đãi
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Liên hệ
                    </NavLink>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell with Red Dot */}
                    {username && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative cursor-pointer text-muted-foreground"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></span>
                        </Button>
                    )}

                    {!username ? (
                        <Button className="cursor-pointer sm:flex bg-[#0064D2] hover:bg-[#0055b3] text-white font-semibold rounded-lg px-6 h-10 flex items-center justify-center transition-all">
                            <span className="leading-none">Đặt vé ngay</span>
                        </Button>
                    ) : (
                        <Avatar className="h-9 w-9 border cursor-pointer ml-1">
                            <AvatarImage
                                src="/path-to-your-avatar.jpg"
                                alt="Admin"
                            />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    )}

                    {/* Mobile Menu */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
