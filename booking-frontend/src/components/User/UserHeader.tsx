import { Bell, Menu, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function UserHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Ticket className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Vexere
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-10">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            cn(
                                'font-medium transition-colors',

                                isActive
                                    ? 'text-primary font-bold'
                                    : 'text-muted-foreground hover:text-primary',
                            )
                        }
                    >
                        Trang chủ
                    </NavLink>
                    <NavLink
                        to="/schedule"
                        className={({ isActive }) =>
                            cn(
                                'font-medium transition-colors',

                                isActive
                                    ? 'text-primary font-bold'
                                    : 'text-muted-foreground hover:text-primary',
                            )
                        }
                    >
                        Lịch trình
                    </NavLink>
                    <NavLink
                        to="/sales"
                        className={({ isActive }) =>
                            cn(
                                'font-medium transition-colors',

                                isActive
                                    ? 'text-primary font-bold'
                                    : 'text-muted-foreground hover:text-primary',
                            )
                        }
                    >
                        Ưu đãi
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            cn(
                                'font-medium transition-colors',

                                isActive
                                    ? 'text-primary font-bold'
                                    : 'text-muted-foreground hover:text-primary',
                            )
                        }
                    >
                        Liên hệ
                    </NavLink>
                </nav>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer text-muted-foreground"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>

                    <Button className="cursor-pointer hidden sm:flex bg-orange-500 hover:bg-orange-600 text-white">
                        Đặt vé ngay
                    </Button>

                    <Button
                        variant="outline"
                        className="cursor-pointer hidden sm:flex gap-2 bg-transparent"
                    >
                        <Ticket className="h-4 w-4" />
                        Vé của tôi
                    </Button>

                    <Avatar className="h-9 w-9 border cursor-pointer">
                        <AvatarImage src="/placeholder-user.jpg" alt="Minh" />
                        <AvatarFallback>M</AvatarFallback>
                    </Avatar>

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
