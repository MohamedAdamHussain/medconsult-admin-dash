# أمثلة اختبار API للأسئلة الطبية الشائعة

## 1. إنشاء سؤال طبي جديد

### الطلب
```http
POST /api/questions
Content-Type: application/json
Authorization: Bearer {token}

{
  "content": "هل تعاني من أمراض مزمنة؟",
  "isActive": true,
  "specialty_ids": [1, 2, 3]
}
```

### الاستجابة المتوقعة
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
      },
      {
        "id": 2,
        "name": "طب الأطفال",
        "name_ar": "Pediatrics"
      },
      {
        "id": 3,
        "name": "الأمراض الجلدية",
        "name_ar": "Dermatology"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 2. تحديث سؤال طبي موجود

### الطلب
```http
PUT /api/questions/1
Content-Type: application/json
Authorization: Bearer {token}

{
  "content": "هل تعاني من أمراض مزمنة محدثة؟",
  "isActive": false,
  "specialty_ids": [1, 4]
}
```

### الاستجابة المتوقعة
```json
{
  "data": {
    "id": 1,
    "content": "هل تعاني من أمراض مزمنة محدثة؟",
    "isActive": false,
    "specialty_ids": [1, 4],
    "specialties": [
      {
        "id": 1,
        "name": "طب القلب",
        "name_ar": "Cardiology"
      },
      {
        "id": 4,
        "name": "طب العظام",
        "name_ar": "Orthopedics"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:01.000000Z"
  }
}
```

## 3. جلب جميع الأسئلة الطبية

### الطلب
```http
GET /api/questions
Authorization: Bearer {token}
```

### الاستجابة المتوقعة
```json
{
  "data": [
    {
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
    },
    {
      "id": 2,
      "content": "هل لديك حساسية من أدوية معينة؟",
      "isActive": true,
      "specialty_ids": [2, 3],
      "specialties": [
        {
          "id": 2,
          "name": "طب الأطفال",
          "name_ar": "Pediatrics"
        },
        {
          "id": 3,
          "name": "الأمراض الجلدية",
          "name_ar": "Dermatology"
        }
      ],
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "total": 2,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1
  }
}
```

## 4. جلب سؤال واحد

### الطلب
```http
GET /api/questions/1
Authorization: Bearer {token}
```

### الاستجابة المتوقعة
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
      },
      {
        "id": 2,
        "name": "طب الأطفال",
        "name_ar": "Pediatrics"
      },
      {
        "id": 3,
        "name": "الأمراض الجلدية",
        "name_ar": "Dermatology"
      }
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 5. حذف سؤال

### الطلب
```http
DELETE /api/questions/1
Authorization: Bearer {token}
```

### الاستجابة المتوقعة
```json
{
  "message": "Question deleted successfully"
}
```

## أمثلة متنوعة للاختبار

### 1. سؤال مع تخصص واحد
```json
{
  "content": "هل تعاني من ضغط الدم المرتفع؟",
  "isActive": true,
  "specialty_ids": [1]
}
```

### 2. سؤال مع عدة تخصصات
```json
{
  "content": "هل لديك تاريخ عائلي مع الأمراض الوراثية؟",
  "isActive": true,
  "specialty_ids": [1, 2, 3, 4, 5]
}
```

### 3. سؤال غير نشط
```json
{
  "content": "سؤال قديم لا يُستخدم حالياً",
  "isActive": false,
  "specialty_ids": [1]
}
```

### 4. تحديث جزئي (تغيير الحالة فقط)
```json
{
  "isActive": false
}
```

### 5. تحديث التخصصات فقط
```json
{
  "specialty_ids": [2, 4, 6]
}
```

## معالجة الأخطاء

### خطأ في التحقق من صحة البيانات
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "content": ["The content field is required."],
    "specialty_ids": ["The specialty ids field is required.", "The specialty ids must contain at least 1 items."],
    "specialty_ids.0": ["The selected specialty ids.0 is invalid."]
  }
}
```

### خطأ محتوى طويل جداً
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "content": ["The content may not be greater than 1000 characters."]
  }
}
```

### خطأ تخصص غير موجود
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "specialty_ids.0": ["The selected specialty ids.0 is invalid."]
  }
}
```

### خطأ عدم وجود السؤال
```json
{
  "message": "Question not found"
}
```

### خطأ عدم الصلاحية
```json
{
  "message": "Unauthorized"
}
```

## ملاحظات مهمة للتطوير

1. **الحقول المطلوبة**: `content` و `specialty_ids`
2. **الحقول الاختيارية**: `isActive` (افتراضي: true)
3. **حد المحتوى**: 1000 حرف كحد أقصى
4. **التخصصات**: يجب أن تكون موجودة في جدول `medical_tags`
5. **العلاقات**: يجب إرجاع معلومات التخصصات مع السؤال
6. **المصادقة**: جميع الطلبات تحتاج إلى Bearer token

## اختبار من المتصفح

يمكنك اختبار الـ API من خلال:
1. فتح صفحة الأسئلة الطبية في التطبيق
2. محاولة إضافة سؤال جديد مع تخصصات متعددة
3. تحديث سؤال موجود
4. تغيير حالة النشاط
5. حذف سؤال
6. مراقبة Network tab في Developer Tools

## مثال كامل للاختبار

```javascript
// في console المتصفح
const testQuestion = {
  content: "هل تتناول أدوية بشكل دائم؟",
  isActive: true,
  specialty_ids: [1, 2, 3]
};

fetch('/api/questions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify(testQuestion)
})
.then(response => response.json())
.then(data => console.log(data));
```