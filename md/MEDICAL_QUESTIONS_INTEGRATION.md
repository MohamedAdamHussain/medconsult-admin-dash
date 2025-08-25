# ربط الأسئلة الطبية الشائعة مع API

## نظرة عامة
تم تحديث نظام إدارة الأسئلة الطبية الشائعة ليتوافق مع API الخاص بـ `/questions` مع دعم ربط الأسئلة بالتخصصات الطبية.

## الملفات المُحدثة

### 1. أنواع البيانات الجديدة
**الملف:** `src/types/questions.ts`
- `MedicalQuestion`: نوع البيانات الأساسي للسؤال الطبي
- `CreateMedicalQuestionRequest`: نوع البيانات لإنشاء سؤال جديد
- `UpdateMedicalQuestionRequest`: نوع البيانات لتحديث سؤال موجود
- `MedicalQuestionsResponse`: نوع استجابة API للقائمة
- `MedicalQuestionResponse`: نوع استجابة API لسؤال واحد

### 2. Hook مخصص للتعامل مع API
**الملف:** `src/hooks/useMedicalQuestions.ts`
- `useMedicalQuestions()`: Hook رئيسي لإدارة الأسئلة
- `useMedicalQuestion(id)`: Hook لجلب سؤال واحد
- دعم العمليات: إنشاء، تحديث، حذف، جلب البيانات
- معالجة الأخطاء وعرض الرسائل

### 3. مكونات الواجهة الجديدة
**الملف:** `src/components/medical-questions/AddEditQuestionDialog.tsx`
- نموذج إضافة/تعديل الأسئلة
- دعم اختيار متعدد للتخصصات
- التحقق من صحة البيانات

**الملف:** `src/components/medical-questions/QuestionsList.tsx`
- قائمة الأسئلة مع التخصصات المرتبطة
- عرض حالة النشاط
- أزرار التعديل والحذف

### 4. الصفحة الرئيسية المُحدثة
**الملف:** `src/pages/MedicalQuestions.tsx`
- استخدام Hook الجديد بدلاً من البيانات الثابتة
- إضافة فلاتر متقدمة (التخصص، الحالة، البحث)
- إحصائيات شاملة
- معالجة حالات التحميل والأخطاء

## مواصفات API المدعومة

### Endpoint
```
POST /questions
PUT /questions/{id}
GET /questions
DELETE /questions/{id}
```

### هيكل البيانات المطلوب

#### إنشاء سؤال جديد
```json
{
  "content": "هل تعاني من أمراض مزمنة؟",
  "isActive": true,
  "specialty_ids": [1, 2, 3]
}
```

#### تحديث سؤال موجود
```json
{
  "content": "هل تعاني من أمراض مزمنة محدثة؟",
  "isActive": false,
  "specialty_ids": [1, 4]
}
```

#### استجابة API
```json
{
  "data": {
    "id": 1,
    "content": "هل تعاني من أمراض مزمنة؟",
    "isActive": true,
    "specialty_ids": [1, 2, 3],
    "specialties": [
      {
        "id": 1,
        "name": "طب القلب",
        "name_ar": "Cardiology"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## الحقول المطلوبة والاختيارية

### الحقول المطلوبة
- `content`: نص السؤال (نص، حد أقصى 1000 حرف)
- `specialty_ids`: مصفوفة معرفات التخصصات (مصفوفة أرقام، عنصر واحد على الأقل)

### الحقول الاختيارية
- `isActive`: حالة النشاط (قيمة منطقية، افتراضي: true)

## الميزات الجديدة

### 1. ربط متعدد بالتخصصات
- إمكانية ربط السؤال الواحد بعدة تخصصات
- عرض التخصصات المرتبطة في القائمة
- فلترة الأسئلة حسب التخصص

### 2. إدارة حالة النشاط
- تفعيل/إلغاء تفعيل الأسئلة
- فلترة حسب الحالة (نشط/غير نشط)

### 3. البحث والفلترة المتقدمة
- البحث في محتوى السؤال
- فلترة حسب التخصص
- فلترة حسب حالة النشاط
- مسح جميع الفلاتر

### 4. الإحصائيات التفصيلية
- إجمالي الأسئلة
- الأسئلة النشطة/غير النشطة
- معدل النشاط
- عرض تفصيلي لكل سؤال مع تخصصاته

### 5. واجهة مستخدم محسنة
- تصميم متجاوب
- مؤشرات التحميل
- رسائل الأخطاء والنجاح
- تحديث البيانات تلقائياً

## كيفية الاستخدام

### 1. إضافة سؤال جديد
```typescript
const { createMedicalQuestion } = useMedicalQuestions();

const newQuestion = {
  content: "هل تعاني من أمراض مزمنة؟",
  isActive: true,
  specialty_ids: [1, 2, 3]
};

createMedicalQuestion(newQuestion);
```

### 2. تحديث سؤال موجود
```typescript
const { updateMedicalQuestion } = useMedicalQuestions();

updateMedicalQuestion({
  id: 1,
  data: {
    content: "هل تعاني من أمراض مزمنة محدثة؟",
    isActive: false,
    specialty_ids: [1, 4]
  }
});
```

### 3. حذف سؤال
```typescript
const { deleteMedicalQuestion } = useMedicalQuestions();
deleteMedicalQuestion(1);
```

### 4. فلترة الأسئلة
```typescript
// فلترة حسب التخصص
const cardioQuestions = medicalQuestions.filter(q => 
  q.specialty_ids.includes(1)
);

// فلترة حسب الحالة
const activeQuestions = medicalQuestions.filter(q => q.isActive);
```

## التحقق من صحة البيانات

### في الواجهة الأمامية
- التحقق من وجود محتوى السؤال
- التحقق من طول المحتوى (أقل من 1000 حرف)
- التحقق من اختيار تخصص واحد على الأقل

### في الخادم (مطلوب)
```php
$validated = $request->validate([
    'content' => 'required|string|max:1000',
    'isActive' => 'boolean',
    'specialty_ids' => 'required|array|min:1',
    'specialty_ids.*' => 'integer|exists:medical_tags,id'
]);
```

## معالجة الأخطاء
- رسائل خطأ واضحة للمستخدم
- التحقق من صحة البيانات قبل الإرسال
- معالجة أخطاء الشبكة والخادم
- إعادة المحاولة التلقائية

## الأداء
- استخدام React Query للتخزين المؤقت
- تحديث البيانات بذكاء
- فلترة محلية للبيانات
- تحميل البيانات عند الحاجة فقط

## أمثلة الاختبار

### 1. إنشاء سؤال مع تخصص واحد
```json
POST /questions
{
  "content": "هل تعاني من ضغط الدم؟",
  "isActive": true,
  "specialty_ids": [1]
}
```

### 2. إنشاء سؤال مع عدة تخصصات
```json
POST /questions
{
  "content": "هل لديك حساسية من أدوية معينة؟",
  "isActive": true,
  "specialty_ids": [1, 2, 3, 4]
}
```

### 3. تحديث حالة السؤال
```json
PUT /questions/1
{
  "isActive": false
}
```

النظام جاهز للاستخدام والاختبار مع الخادم! 🚀