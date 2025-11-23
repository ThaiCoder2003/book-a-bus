import { useState } from "react";
import type { FC } from "react"; 


const AuthPage: FC = () => { 
  const [isLogin, setIsLogin] = useState(true);

  return (
    // CONTAINER CHÍNH:
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#e6eef7] to-white">
      
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[500px]"> 

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-2 text-lg font-semibold transition-all ${
              isLogin ? "border-b-4 border-orange-500 text-orange-600" : "text-gray-500 hover:text-orange-500"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-2 text-lg font-semibold transition-all ${
              !isLogin ? "border-b-4 border-orange-500 text-orange-600" : "text-gray-500 hover:text-orange-500"
            }`}
          >
            Đăng kí
          </button>
        </div>

        {/* Title (Căn giữa tiêu đề) */}
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-1">
              {isLogin ? "Đăng nhập" : "Đăng kí"}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Bus Booking {isLogin ? "Access" : "Registration"}
            </p>
        </div>


        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" 
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Confirmation (only visible when sign up) */}
        {!isLogin && (
          <div className="mb-4">
            <input
              type="password"
              placeholder="Nhập lại mật khẩu" 
              className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )}

        {/* Button */}
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
          {isLogin ? "Đăng nhập" : "Đăng kí"}
        </button>
      </div>
    </div>
  );
}

export default AuthPage; 