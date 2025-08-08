// أنواع البيانات للأسئلة الطبية الشائعة

export interface MedicalQuestion {
  id: number;
  specialty_id: number;
  parent_question_id: number | null;
  parent_answer_value: string | null;
  isActive: number; // 1 أو 0 بدلاً من boolean
  content: string;
  medical_tags: MedicalTag[];
  created_at: string;
  updated_at: string;
}

export interface MedicalTag {
  id: number;
  name: string;
  name_ar: string;
  is_active: boolean;
  pivot: {
    question_id: number;
    medical_tag_id: number;
  };
}

// للتوافق مع الكود الموجود
export interface MedicalSpecialty {
  id: number;
  name: string;
  name_ar?: string;
}

export interface CreateMedicalQuestionRequest {
  content: string;
  isActive: boolean;
  specialty_ids: number[];
}

export interface UpdateMedicalQuestionRequest {
  content?: string;
  isActive?: boolean;
  specialty_ids?: number[];
}

export interface MedicalQuestionsResponse {
  status: string;
  data: MedicalQuestion[];
}

export interface MedicalQuestionResponse {
  status: string;
  data: MedicalQuestion;
}

// نوع البيانات للفلاتر
export interface QuestionFilterOption {
  type: 'specialty' | 'status';
  value: string;
  label: string;
}