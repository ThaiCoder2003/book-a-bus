import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import UserHeader from '@/components/helpers/UserHeader'
import type { User } from '@/types/user.type'
// Sidebar components
import UserProfile from '@/components/Dashboard/sidebar/UserProfile'
import QuickActions from '@/components/Dashboard/sidebar/QuickActions'
import FavoriteRoutes from '@/components/Dashboard/sidebar/FavoriteRoutes'
import SupportSection from '@/components/Dashboard/sidebar/SupportSection'

// Main content components
import StatsOverview from '@/components/Dashboard/StatsOverview'
import NextTripCard from '@/components/Dashboard/NextTripCard'
import VoucherSection from '@/components/Dashboard/VoucherSection'
import PaymentMethods from '@/components/Dashboard/PaymentMethods'
import BookingHistory from '@/components/Dashboard/BookingHistory'
import userService from '@/services/userService'

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null)
    const [totalBookings, setTotalBookings] = useState<number>(0)
    const [totalSpent, setTotalSpent] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [nextTrip, setNextTrip] = useState<any>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Gọi API lấy profile thực từ DB (Sử dụng req.user.id ở Backend)
                const responseProfile = await userService.getUserProfile()
                setUser(responseProfile) // Data từ API getUserProfile của bạn

                const responseStat = await userService.getStatOverview()
                setTotalBookings(responseStat.totalBookings)
                setTotalSpent(responseStat.totalSpent)
            } catch (error) {
                toast.error('Không thể lấy thông tin người dùng')
            } finally {
                setLoading(false)
            }
        }

        const fetchNextTrip = async () => {
            const data = await userService.getNextTrip()
            setNextTrip(data)
        }

        fetchUserData()
        fetchNextTrip()
    }, [])

    const handleEdit = async (payload: any) => {
        setLoading(true)
        try {
            const updatedUser = await userService.editProfile(payload)

            setUser((prevUser) => ({
                ...prevUser,
                ...updatedUser,
            }))
        } catch (error) {
            toast.error('Không thể cập nhật thông tin người dùng')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <UserHeader />

            <div className="min-h-screen bg-muted/10 pb-10">
                <main className="container mx-auto px-4 py-10 max-w-8xl">
                    {/* Main layout: Sidebar + Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Sidebar (Left) */}
                        <aside className="lg:col-span-3 space-y-6">
                            <UserProfile
                                user={user}
                                isLoading={loading}
                                onEdit={handleEdit}
                            />
                            <QuickActions />
                            <FavoriteRoutes />
                            <SupportSection />
                        </aside>

                        {/* Main Content (Right) */}
                        <section className="lg:col-span-9 space-y-8">
                            {/* Greeting + Stats grouped together */}

                            <div className="mb-6">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    Xin chào, {user?.name || 'User'}
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Chúc bạn có một chuyến đi an toàn và vui vẻ.
                                </p>
                            </div>

                            <StatsOverview
                                totalBookings={totalBookings}
                                totalSpent={totalSpent}
                            />
                            <NextTripCard booking={nextTrip} />
                            <VoucherSection />
                            <PaymentMethods />
                            <BookingHistory bookings={user?.bookings} />
                        </section>
                    </div>
                </main>
            </div>
        </>
    )
}
