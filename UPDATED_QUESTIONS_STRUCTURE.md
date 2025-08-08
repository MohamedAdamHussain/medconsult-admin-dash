# هيكل البيانات المحدث للأسئلة الطبية

## نظرة عامة
تم تحديث النظام ليتوافق مع هيكل الاستجابة الجديد من API الأسئلة الطبية مع عرض جميع المعلومات الأساسية.

## هيكل الاستجابة الجديد

### استجابة API
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "specialty_id": 1,
      "parent_question_id": null,
      "parent_answer_value": null,
      "isActive": 1,
      "content": "هل تعاني من ارتفاع ضغط",
      "created_at": "2025-08-07T19:47:39.000000Z",
      "updated_at": "2025-08-07T19:47:39.000000Z",
      "medical_tags": [
        {
          "id": 1,
          "name": "heart",
          "name_ar": "قلبية",
          "is_active": true,
          "pivot": {
            "question_id": 1,
            "medical_tag_id": 1
          }
        }
      ]
    }
  ]
}
```

## التحديثات المُطبقة

### 1. أنواع البيانات المحدثة
**الملف:** `src/types/questions.ts`

```typescript
export interface MedicalQuestion {
  id: number;
  specialty_id: number;                    // التخصص الرئيسي
  parent_question_id: number | null;       // معرف السؤال الأب
  parent_answer_value: string | null;      // قيمة الإجابة الأب
  isActive: number;                        // 1 أو 0 بدلاً من boolean
  content: string;                         // محتوى السؤال
  medical_tags: MedicalTag[];              // التخصصات المرتبطة
  created_at: string;                      // تاريخ الإنشاء
  updated_at: string;                      // تاريخ التحديث
}

export interface MedicalTag {
  id: number;
  name: string;                            // الاسم بالإنجليزية
  name_ar: string;                         // الاسم بالعربية
  is_active: boolean;                      // حالة النشاط
  pivot: {
    question_id: number;
    medical_tag_id: number;
  };
}
```

### 2. المكونات المحدثة

#### أ. QuestionsList.tsx
- عرض `medical_tags` بدلاً من `specialties`
- استخدام `question.isActive === 1` للتحقق من النشاط
- عرض الأسماء العربية للتخصصات

#### ب. AddEditQuestionDialog.tsx
- تحويل `question.isActive === 1` إلى boolean للنموذج
- استخراج معرفات التخصصات من `medical_tags`

#### ج. MedicalQuestions.tsx (الصفحة الرئيسية)
- تحديث منطق الفلترة للتعامل مع `medical_tags`
- تحديث الإحصائيات للتعامل مع `isActive === 1`

### 3. مكون جديد: QuestionCard.tsx
مكون بطاقة مفصل يعرض:
- معرف السؤال
- التخصص الرئيسي (`specialty_id`)
- التخصصات المرتبطة (`medical_tags`)
- السؤال الأب (`parent_question_id`)
- قيمة الإجابة الأب (`parent_answer_value`)
- حالة النشاط
- تواريخ الإنشاء والتحديث

## المعلومات المعروضة

### 1. المعلومات الأساسية
- **معرف السؤال**: `id`
- **محتوى السؤال**: `content`
- **حالة النشاط**: `isActive` (1 = نشط، 0 = غير نشط)

### 2. معلومات التخصصات
- **التخصص الرئيسي**: `specialty_id`
- **التخصصات المرتبطة**: `medical_tags` مع الأسماء العربية

### 3. معلومات التسلسل الهرمي
- **السؤال الأب**: `parent_question_id`
- **قيمة الإجابة الأب**: `parent_answer_value`

### 4. معلومات التوقيت
- **تاريخ الإنشاء**: `created_at`
- **تاريخ التحديث**: `updated_at`

## طرق العرض المتاحة

### 1. عرض القائمة (Table View)
- جدول مضغوط يعرض المعلومات الأساسية
- أعمدة: المحتوى، التخصصات، الحالة، تاريخ الإنشاء، الإجراءات

### 2. عرض البطاقات (Card View)
- بطاقات مفصلة تعرض جميع المعلومات
- تصميم متجاوب ومنظم
- عرض التخصصات كـ badges
- معلومات التسلسل الهرمي والتوقيت

### 3. عرض الإحصائيات (Stats View)
- إحصائيات عامة (إجمالي، نشط، غير نشط، معدل النشاط)
- بطاقات مفصلة لكل سؤال مع جميع المعلومات

## الفلترة والبحث

### 1. البحث النصي
- البحث في محتوى السؤال (`content`)

### 2. فلترة حسب التخصص
- فلترة حسب التخصصات المرتبطة (`medical_tags`)

### 3. فلترة حسب الحالة
- نشط: `isActive === 1`
- غير نشط: `isActive === 0`

## الإحصائيات المحسوبة

```typescript
// الأسئلة النشطة
const activeQuestions = medicalQuestions.filter(q => q.isActive === 1).length;

// الأسئلة غير النشطة
const inactiveQuestions = medicalQuestions.filter(q => q.isActive === 0).length;

// معدل النشاط
const activityRate = medicalQuestions.length > 0 
  ? Math.round((activeQuestions / medicalQuestions.length) * 100) 
  : 0;
```

## أمثلة الاستخدام

### 1. عرض التخصصات المرتبطة
```jsx
{question.medical_tags && question.medical_tags.length > 0 ? (
  question.medical_tags.map((tag) => (
    <Badge key={tag.id} variant="secondary">
      {tag.name_ar || tag.name}
    </Badge>
  ))
) : (
  <span className="text-gray-500">لا توجد تخصصات مرتبطة</span>
)}
```

### 2. عرض حالة النشاط
```jsx
<Badge variant={question.isActive === 1 ? "default" : "destructive"}>
  {question.isActive === 1 ? 'نشط' : 'غير نشط'}
</Badge>
```

### 3. عرض معلومات التسلسل الهرمي
```jsx
{question.parent_question_id && (
  <div>
    <span>السؤال الأب:</span>
    <span>#{question.parent_question_id}</span>
  </div>
)}

{question.parent_answer_value && (
  <div>
    <span>قيمة الإجابة الأب:</span>
    <Badge variant="outline">{question.parent_answer_value}</Badge>
  </div>
)}
```

## الميزات الجديدة

### 1. عرض شامل للمعلومات
- جميع الحقول من API معروضة بشكل منظم
- معلومات التسلسل الهرمي للأسئلة
- تواريخ الإنشاء والتحديث

### 2. طرق عرض متعددة
- قائمة مضغوطة للعرض السريع
- بطاقات مفصلة للمراجعة الشاملة
- إحصائيات تفاعلية

### 3. فلترة محسنة
- فلترة حسب التخصصات المرتبطة الفعلية
- دعم البحث النصي المتقدم

### 4. واجهة مستخدم محسنة
- تصميم متسق ومتجاوب
- ألوان مميزة للحالات المختلفة
- عرض واضح للعلاقات الهرمية

النظام الآن يعرض جميع المعلومات الأساسية من API بشكل شامل ومنظم! 🎉