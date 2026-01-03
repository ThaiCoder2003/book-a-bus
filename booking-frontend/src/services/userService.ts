import axiosClient from './axiosConfig'
import type { User } from '@/types/admin/user'

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
        const { user, totalSpent, orders } = response.data;
        
        return {
            ...user,
            totalSpent,
            orders
        };
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