import { useState, useEffect } from "react";
import { safeGet } from "@/lib/api";

export type ResponseRateData = {
  medical_tag: string;
  total_consultations: number;
  responded_consultations: number;
  response_rate: string;
};

type ResponseRatesResponse = {
  status: boolean;
  data: ResponseRateData[];
};

export const useResponseRates = () => {
  const [responseRates, setResponseRates] = useState<ResponseRateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const fetchResponseRates = async () => {
      setLoading(true);
      try {
        const { data, error } = await safeGet<ResponseRatesResponse>('/admin/consultations/response-rates-by-specialty');
        if (data && Array.isArray(data.data)) {
          // Group by medical_tag and sum values for duplicates
          const grouped = data.data.reduce((acc, item) => {
            if (acc[item.medical_tag]) {
              acc[item.medical_tag].total_consultations += item.total_consultations;
              acc[item.medical_tag].responded_consultations += item.responded_consultations;
            } else {
              acc[item.medical_tag] = { ...item };
            }
            return acc;
          }, {} as Record<string, ResponseRateData>);

          // Calculate response rates and convert to array
          const processedData = Object.values(grouped).map(item => ({
            ...item,
            response_rate: item.total_consultations > 0 
              ? `${Math.round((item.responded_consultations / item.total_consultations) * 100)}%`
              : '0%'
          }));

          setResponseRates(processedData);
        }
        setError(error);
      } catch (err) {
        setError({ message: 'فشل في جلب بيانات معدلات الاستجابة' });
      } finally {
        setLoading(false);
      }
    };

    fetchResponseRates();
  }, []);

  return { responseRates, loading, error };
};