import { useQuery } from '@tanstack/react-query';

import { AppointmentsResponse } from '@/types/appointments';
import { safeGet } from '@/lib/api';

export const useAppointmentsData = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await safeGet<AppointmentsResponse>(`/admin/web/appointments/doctors${queryString}`);
      return response.data;
    },
  });
};