import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // ⚠️ Quan trọng: Không có dòng này toast sẽ bị vỡ giao diện

import UserDashboardPage from './pages/UserDashboardPage'
import AuthPage from './pages/AuthPage'
import PrivateRoute from './routes/PrivateRoute'

function App() {
    return (
        <>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<UserDashboardPage />} />
                    <Route path="/" element={<UserDashboardPage />} />

                    {/* <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} /> */}
                </Route>
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default App
