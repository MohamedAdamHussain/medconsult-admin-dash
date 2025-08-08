import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  MedicalQuestion, 
  CreateMedicalQuestionRequest, 
  UpdateMedicalQuestionRequest,
  MedicalQuestionsResponse,
  MedicalQuestionResponse 
} from '@/types/questions';

// دالة لجلب جميع الأسئلة الطبية
const fetchMedicalQuestions = async (): Promise<MedicalQuestion[]> => {
  const response = await api.get<MedicalQuestionsResponse>('/questions');
  return response.data.data;
};

// دالة لجلب سؤال طبي واحد
const fetchMedicalQuestion = async (id: number): Promise<MedicalQuestion> => {
  const response = await api.get<MedicalQuestionResponse>(`/questions/${id}`);
  return response.data.data;
};

// دالة لإنشاء سؤال طبي جديد
const createMedicalQuestion = async (data: CreateMedicalQuestionRequest): Promise<MedicalQuestion> => {
  const response = await api.post<MedicalQuestionResponse>('/questions', data);
  return response.data.data;
};

// دالة لتحديث سؤال طبي
const updateMedicalQuestion = async (id: number, data: UpdateMedicalQuestionRequest): Promise<MedicalQuestion> => {
  const response = await api.put<MedicalQuestionResponse>(`/questions/${id}`, data);
  return response.data.data;
};

// دالة لحذف سؤال طبي
const deleteMedicalQuestion = async (id: number): Promise<void> => {
  await api.delete(`/questions/${id}`);
};

// Hook رئيسي لإدارة الأسئلة الطبية
export const useMedicalQuestions = () => {
  const queryClient = useQueryClient();

  // جلب جميع الأسئلة
  const {
    data: medicalQuestions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['medical-questions'],
    queryFn: fetchMedicalQuestions,
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  // إنشاء سؤال جديد
  const createMutation = useMutation({
    mutationFn: createMedicalQuestion,
    onSuccess: (newQuestion) => {
      queryClient.invalidateQueries({ queryKey: ['medical-questions'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم إضافة السؤال الطبي بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء إضافة السؤال الطبي',
        variant: 'destructive',
      });
    },
  });

  // تحديث سؤال
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMedicalQuestionRequest }) =>
      updateMedicalQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-questions'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم تحديث السؤال الطبي بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء تحديث السؤال الطبي',
        variant: 'destructive',
      });
    },
  });

  // حذف سؤال
  const deleteMutation = useMutation({
    mutationFn: deleteMedicalQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-questions'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم حذف السؤال الطبي بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء حذف السؤال الطبي',
        variant: 'destructive',
      });
    },
  });

  return {
    // البيانات
    medicalQuestions,
    isLoading,
    error,
    
    // العمليات
    refetch,
    createMedicalQuestion: createMutation.mutate,
    updateMedicalQuestion: updateMutation.mutate,
    deleteMedicalQuestion: deleteMutation.mutate,
    
    // حالات التحميل
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook لجلب سؤال واحد
export const useMedicalQuestion = (id: number) => {
  return useQuery({
    queryKey: ['medical-question', id],
    queryFn: () => fetchMedicalQuestion(id),
    enabled: !!id,
  });
};