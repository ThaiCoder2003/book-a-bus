import axiosClient from './axiosConfig'
import type { Route } from "@/types/route.type";

interface PaginatedData {
  routes: Route[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface BackendResponse {
  message: string;
  routes: PaginatedData; // Lưu ý: Backend bạn đang trả về key 'routes' chứa cả data và phân trang
}

const routeService = {
    getRoutes: async (q: string = '', page: number = 1, limit: number = 10): Promise<PaginatedData> => 
    {
        const response = await axiosClient.get<BackendResponse>("/routes", {
            params: { q, page, limit },
        });
        return response.data.routes;
    },

    getById: async (id: string): Promise<Route> => {
        const response = await axiosClient.get(`/routes/${id}`);
        return response.data;
    },

    create: async (payload: any) => {
        const response = await axiosClient.post("/routes/register", payload);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axiosClient.delete(`/routes/delete/${id}`);
        return response.data;
    },
}

export default routeService
