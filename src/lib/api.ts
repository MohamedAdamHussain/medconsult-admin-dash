import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from '@/hooks/use-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://baraa.mahmoudalhabash.com/api", // يمكنك تغيير العنوان لاحقًا
  // يمكن إضافة إعدادات أخرى هنا مثل headers أو timeout
  timeout: 10000, // 10 ثواني كحد أقصى للانتظار
});

// إضافة Interceptor لإرفاق التوكن تلقائيًا مع كل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medconsult_token');
  if (token) {
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      config.headers = Object.assign({}, config.headers, { Authorization: `Bearer ${token}` });
    }
  }
  return config;
});

// Interceptor للاستجابة: تسجيل خروج تلقائي عند انتهاء صلاحية التوكن
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // حذف بيانات المستخدم والتوكن
      localStorage.removeItem('medconsult_user');
      localStorage.removeItem('medconsult_token');
      // عرض رسالة انتهاء الجلسة
      toast({
        title: 'انتهت الجلسة',
        description: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.',
        variant: 'destructive',
      });
      // إعادة التوجيه لصفحة تسجيل الدخول بعد قليل
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    return Promise.reject(error);
  }
);

// Types
export type ApiError =
  | { type: 'response'; status: number; message: string; data?: unknown }
  | { type: 'network'; message: string }
  | { type: 'exception'; message: string };

export interface ApiResult<T> {
  data: T | null;
  error: ApiError | null;
}

// دالة مساعدة لمعالجة الأخطاء
function handleApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<unknown>;
  if (axiosError && axiosError.response) {
    // السيرفر رد بكود خطأ
    const responseData = axiosError.response.data as { message?: string } | null | undefined;
    return {
      type: 'response',
      status: axiosError.response.status,
      message: (responseData && responseData.message) || 'حدث خطأ في الخادم',
      data: axiosError.response.data,
    };
  } else if (axiosError && axiosError.request) {
    // لم يتم تلقي أي رد من السيرفر (انقطاع اتصال)
    return {
      type: 'network',
      message: 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.',
    };
  } else {
    // خطأ غير متوقع (exception)
    return {
      type: 'exception',
      message: (error as Error)?.message || 'حدث خطأ غير متوقع',
    };
  }
}

// مثال على دوال جاهزة لاستدعاء API مع معالجة الأخطاء
export async function safeGet<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const response = await api.get<T>(url, config);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    return { data: null, error: handleApiError(error) };
  }
}

export async function safePost<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const response = await api.post<T>(url, body, config);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    return { data: null, error: handleApiError(error) };
  }
}

export async function safePut<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const response = await api.put<T>(url, body, config);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    return { data: null, error: handleApiError(error) };
  }
}

export async function safePatch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const response = await api.patch<T>(url, body, config);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    return { data: null, error: handleApiError(error) };
  }
}

export async function safeDelete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const response = await api.delete<T>(url, config);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    return { data: null, error: handleApiError(error) };
  }
}

export default api; 

// Expose API base URL and origin for building absolute asset URLs
export const apiBaseURL: string = api.defaults.baseURL || '';
export const apiOrigin: string = (() => {
  try {
    const url = new URL(apiBaseURL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return '';
  }
})();