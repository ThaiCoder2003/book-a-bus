import PersistLogin from '@/components/helpers/PersistLogin'
import AuthPage from '@/pages/AuthPage'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import DashboardPage from '@/pages/DashboardPage'
import SchedulePage from '@/pages/SchedulePage'
import TripDetailPage from '@/pages/TripDetailPage'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route element={<PersistLogin />}>
                <Route element={<PrivateRoute />}>
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/trip/:id" element={<TripDetailPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/" element={<DashboardPage />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes
