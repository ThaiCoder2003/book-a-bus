import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";

export default function RootRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route cho user */}
        <Route path="/*" element={<UserRoutes />} />

        {/* Các route cho admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
