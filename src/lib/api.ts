import axios from "axios";
import { toast } from '@/hooks/use-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api", // يمكنك تغيير العنوان لاحقًا
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

// دالة مساعدة لمعالجة الأخطاء
function handleApiError(error: any) {
  if (error.response) {
    // السيرفر رد بكود خطأ
    return {
      type: 'response',
      status: error.response.status,
      message: error.response.data?.message || 'حدث خطأ في الخادم',
      data: error.response.data,
    };
  } else if (error.request) {
    // لم يتم تلقي أي رد من السيرفر (انقطاع اتصال)
    return {
      type: 'network',
      message: 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.',
    };
  } else {
    // خطأ غير متوقع (exception)
    return {
      type: 'exception',
      message: error.message || 'حدث خطأ غير متوقع',
    };
  }
}

// مثال على دوال جاهزة لاستدعاء API مع معالجة الأخطاء
export async function safeGet(url: string, config?: any) {
  try {
    const response = await api.get(url, config);
    console.log(response.data)
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error: handleApiError(error) };
  }
}

export async function safePost(url: string, data?: any, config?: any) {
  try {
    const response = await api.post(url, data, config);
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error: handleApiError(error) };
  }
}

export default api; 