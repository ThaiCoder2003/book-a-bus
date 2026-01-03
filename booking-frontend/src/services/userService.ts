import axiosClient from './axiosConfig'
import type { User } from '@/types/admin/user'
import type { User as UserForView} from '@/types/user.type'

interface UserResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  total: number
}

const userService = {
    getUserProfile: async(): Promise<UserForView> => {
        const response = await  axiosClient.get("/user/profile")

        return response.data.profile
    },

    editProfile: async(payload: any): Promise<UserForView> => {
        const response = await axiosClient.put(`/user/profile`, payload);
        // response.data lúc này là { user: {...}, totalSpent: 100, orders: 5 }
        
        return response.data.profile
    },

    getStatOverview: async() => {
        const response = await axiosClient.get(`/user/stat-overview`);

        const { totalBookings, totalSpent } = response.data

        return { totalBookings, totalSpent } 
    },

    getNextTrip: async() => {
        const response = await axiosClient.get(`/user/next-trip`);

        const trip = response.data.trip;

        if (!trip) return null;

        // Chỉ trả ra các "nguyên liệu" sạch cho tấm vé
        return {
            ticketCode: trip.ticketCode,
            departureProvince: trip.departureProvince, // "Sài Gòn"
            departureStation: trip.departure,           // "BX Miền Đông"
            arrivalProvince: trip.arrivalProvince,     // "Đà Lạt"
            arrivalStation: trip.arrival,               // "BX Liên Tỉnh"
            time: trip.departureTime,                   // "20:00"
            date: trip.departureDate,                   // "21/11/2025"
            busPlate: trip.busPlate,                    // "51B-12345"
            busType: trip.busType,                      // "Limousine"
            seatNumber: trip.seats,                     // "A05"
            bookingId: trip.bookingId
        };
    },


    getUsers: async (query: string = '', page: number = 1, limit: number = 10): Promise<UserResponse> => 
    {
        const response = await axiosClient.get("/user", {
            params: { query, page, limit },
        });
        return response.data;
    },

    getUserById: async (id: string): Promise<User> => {
        const response = await axiosClient.get(`/user/${id}`);
        // response.data lúc này là { user: {...}, totalSpent: 100, orders: 5 }
        
        return response.data;
    },

    updateUserById: async (id: string, payload: any): Promise<User> => {
        const response = await axiosClient.put(`/user/${id}`, payload);
        // response.data lúc này là { user: {...}, totalSpent: 100, orders: 5 }
        
        return response.data.user
    },

    resetPassword: async (id: string, password: string): Promise<User> => {
        const response = await axiosClient.put(`/user/password/${id}`, { 
        password: password 
    });
        // response.data lúc này là { user: {...}, totalSpent: 100, orders: 5 }
        
        return response.data.user
    },
}

export default userService 