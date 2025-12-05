import BookingHistory from '@/components/Dashboard/BookingHistory'
import NextTripCard from '@/components/Dashboard/NextTripCard'
import SearchTrip from '@/components/Dashboard/SearchTrip'
import UserHeader from '@/components/helpers/UserHeader'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function DashboardPage() {
    const [username, setUsername] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            try {
                const decoded: any = jwtDecode(token)
                setUsername(decoded.name)
            } catch (error) {
                window.location.replace('/auth')
                toast.error("Can't get user information")
            }
        } else {
            toast.error("Can't get necessary token")
            window.location.replace('/auth')
        }
    }, [])

    return (
        <>
            <UserHeader />
            
            <div className="min-h-screen bg-muted/10 pb-10">
                <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
                    {/* Greeting Section */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Xin chào, {username}
                        </h1>
                        <p className="text-muted-foreground">
                            Chúc bạn có một chuyến đi an toàn và vui vẻ.
                        </p>
                    </div>

                    {/* Priority Widget: Next Trip */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Chuyến đi sắp tới
                            </h2>
                        </div>
                        <NextTripCard />
                    </section>

                    {/* Secondary Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-5 lg:col-span-4">
                            <SearchTrip />
                        </div>
                        <div className="md:col-span-7 lg:col-span-8">
                            <BookingHistory />
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
