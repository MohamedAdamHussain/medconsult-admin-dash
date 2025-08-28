import { useQuery } from '@tanstack/react-query';
import { safeGet } from '@/lib/api';
import { DoctorDetailsResponse } from '@/types/doctors';

export function useDoctorDetails(doctorId: number | null) {
  return useQuery({
    queryKey: ['doctor-details', doctorId],
    queryFn: async () => {
      if (!doctorId) throw new Error('Doctor ID is required');
      const { data, error } = await safeGet<DoctorDetailsResponse>(`/public/doctors/${doctorId}`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!doctorId,
  });
}

export default useDoctorDetails;
