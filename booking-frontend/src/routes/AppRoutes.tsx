import PersistLogin from '@/components/helpers/PersistLogin'
import AuthPage from '@/pages/AuthPage'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import UserDashboardPage from '@/pages/UserDashboardPage'


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route element={<PersistLogin />}>
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<UserDashboardPage />} />
                    <Route path="/" element={<UserDashboardPage />} />

                    {/* <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} /> */}
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes