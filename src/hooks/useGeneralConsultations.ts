import { useQuery } from '@tanstack/react-query';
import { safeGet } from '@/lib/api';
import { PaginatedConsultationsResponse } from '@/types/consultations';

const ENDPOINT = '/all/consultations/general';

export function useGeneralConsultations(page: number = 1) {
  return useQuery({
    queryKey: ['general-consultations', page],
    queryFn: async () => {
      const { data, error } = await safeGet<PaginatedConsultationsResponse>(`${ENDPOINT}?page=${page}`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    placeholderData: (prevData) => prevData,
  });
}

export default useGeneralConsultations;


