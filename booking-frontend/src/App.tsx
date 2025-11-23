// src/App.tsx
import { Routes, Route } from 'react-router-dom'; 

import UserDashboardPage from './pages/UserDashboardPage';
import AuthPage from './pages/AuthPage'; 

function App() {
    return (
        <Routes>

            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/dashboard" element={<UserDashboardPage />} />

            <Route path="/" element={<AuthPage />} /> 

        </Routes>
    );
}

export default App;