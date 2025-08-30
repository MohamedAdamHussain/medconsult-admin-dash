import { useQuery } from '@tanstack/react-query';
import { safeGet } from '@/lib/api';
import { AdminsResponse } from '@/types/admins';

interface UseAdminsParams {
  page?: number;
  search?: string;
}

export const useAdmins = ({ page = 1, search }: UseAdminsParams = {}) => {
  return useQuery({
    queryKey: ['admins', page, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (search) {
        params.append('search', search);
      }

      const { data, error } = await safeGet<AdminsResponse>(
        `/superAdmin/admins?${params.toString()}`
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};