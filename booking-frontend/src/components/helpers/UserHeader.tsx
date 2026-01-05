import { Bell, Menu, Ticket, X } from 'lucide-react' // Thêm icon X để đóng menu
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import authAction from '@/actions/authAction'

export default function UserHeader() {
    const location = useLocation()
    const isHomeActive =
        location.pathname === '/' || location.pathname === '/dashboard'

    const [username, setUsername] = useState('')
    // State quản lý đóng mở menu mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
                    // Không redirect ở đây để tránh UX xấu nếu token hết hạn khi đang lướt
                }
            }
        }
        checkToken()
    }, [])

    // Helper: Class cho Desktop
    const getNavLinkClass = (isActive: boolean) => {
        return cn(
            'text-sm font-medium transition-colors',
            isActive
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-primary',
        )
    }

    // Helper: Class cho Mobile (to hơn, padding rộng hơn)
    const getMobileNavLinkClass = (isActive: boolean) => {
        return cn(
            'text-base font-medium transition-colors py-2 block',
            isActive
                ? 'text-[#0064D2] font-bold'
                : 'text-muted-foreground hover:text-primary',
        )
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

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

                {/* DESKTOP Navigation Links */}
                <nav className="hidden md:flex items-center gap-8">
                    {username && (
                        <NavLink
                            to="/dashboard"
                            end
                            className={() => getNavLinkClass(isHomeActive)}
                        >
                            Trang chủ
                        </NavLink>
                    )}

                    <NavLink
                        to="/schedule"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        Chuyến xe
                    </NavLink>

                    <NavLink
                        to="/contact"
                        className={({ isActive }) => getNavLinkClass(isActive)}
                    >
                        Liên hệ
                    </NavLink>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    {username && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative cursor-pointer text-muted-foreground hidden sm:flex"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></span>
                        </Button>
                    )}

                    {!username ? (
                        <Link to="/auth">
                            <Button className="cursor-pointer bg-[#0064D2] hover:bg-[#0055b3] text-white font-semibold rounded-lg px-6 h-10 flex items-center justify-center transition-all">
                                <span className="leading-none">
                                    Đăng nhập/Đăng ký ngay
                                </span>
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium hidden lg:block">
                                Xin chào, {username}
                            </span>
                            <Avatar className="h-9 w-9 border cursor-pointer">
                                <AvatarImage
                                    src="/path-to-your-avatar.jpg"
                                    alt="User Avatar"
                                />
                                <AvatarFallback>
                                    {username
                                        ? username.charAt(0).toUpperCase()
                                        : 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer md:hidden"
                        onClick={toggleMobileMenu} // --- SỬA ĐỔI 2a: Thêm sự kiện onClick ---
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* --- SỬA ĐỔI 2b: Giao diện Mobile Menu --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                        {username && (
                            <NavLink
                                to="/dashboard"
                                end
                                className={() =>
                                    getMobileNavLinkClass(isHomeActive)
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Trang chủ
                            </NavLink>
                        )}

                        <NavLink
                            to="/schedule"
                            className={({ isActive }) =>
                                getMobileNavLinkClass(isActive)
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Chuyến xe
                        </NavLink>

                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                getMobileNavLinkClass(isActive)
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Liên hệ
                        </NavLink>

                        {/* Hiển thị nút thông báo trên mobile nếu đã đăng nhập */}
                        {username && (
                            <div className="py-2 border-t mt-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start px-0 text-muted-foreground hover:text-foreground"
                                >
                                    <Bell className="h-5 w-5 mr-2" />
                                    Thông báo
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
