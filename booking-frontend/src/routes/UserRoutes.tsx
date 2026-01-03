import PersistLogin from '@/components/helpers/PersistLogin'
import AuthPage from '@/pages/AuthPage'
import { Routes, Route } from 'react-router-dom'
// import PrivateRoute from './PrivateRoute'
import DashboardPage from '@/pages/DashboardPage'
import SchedulePage from '@/pages/SchedulePage'
import TripDetailPage from '@/pages/TripDetailPage'
import ContactPage from '@/pages/ContactPage'
import PaymentPage from '@/pages/PaymentPage'
import UserHeader from '@/components/helpers/UserHeader'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/trip/:id" element={<TripDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/demo" element={<PaymentPage />} />

            <Route element={<PersistLogin />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/" element={<DashboardPage />} />
                <Route path="/payment/:bookingId" element={<PaymentPage />} />
            </Route>

            <Route
                path="*"
                element={
                    <>
                        <UserHeader />
                        <div className="flex flex-col items-center justify-center h-64">
                            <h2 className="text-2xl font-bold">
                                404 - Trang này đang phát triển
                            </h2>
                            <p>Vui lòng quay lại sau!</p>
                        </div>
                    </>
                }
            />
        </Routes>
    )
}

export default AppRoutes
