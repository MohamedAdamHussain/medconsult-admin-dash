# أمثلة اختبار API للتخصصات الطبية

## 1. إنشاء تخصص طبي جديد

### الطلب
```http
POST /api/admin/medical-tags
Content-Type: multipart/form-data
Authorization: Bearer {token}

name: "طب القلب"
name_ar: "Cardiology"
description: "تخصص طب القلب والأوعية الدموية"
icon: [image file]
is_active: "true"
```

### الاستجابة المتوقعة
```json
{
  "data": {
    "id": 1,
    "name": "طب القلب",
    "name_ar": "Cardiology",
    "description": "تخصص طب القلب والأوعية الدموية",
    "icon": "http://example.com/storage/icons/cardiology.png",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 2. تحديث تخصص طبي

### الطلب
```http
POST /api/admin/medical-tags/1
Content-Type: multipart/form-data
Authorization: Bearer {token}

_method: "PUT"
name: "طب القلب المحدث"
is_active: "false"
```

### الاستجابة المتوقعة
```json
{
  "data": {
    "id": 1,
    "name": "طب القلب المحدث",
    "name_ar": "Cardiology",
    "description": "تخصص طب القلب والأوعية الدموية",
    "icon": "http://example.com/storage/icons/cardiology.png",
    "is_active": false,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:01.000000Z"
  }
}
```

## 3. جلب جميع التخصصات

### الطلب
```http
GET /api/admin/medical-tags
Authorization: Bearer {token}
```

### الاستجابة المتوقعة
```json
{
  "data": [
    {
      "id": 1,
      "name": "طب القلب",
      "name_ar": "Cardiology",
      "description": "تخصص طب القلب والأوعية الدموية",
      "icon": "http://example.com/storage/icons/cardiology.png",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "total": 1,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1
  }
}
```

## 4. جلب تخصص واحد

### الطلب
```http
GET /api/admin/medical-tags/1
Authorization: Bearer {token}
```

### الاستجابة المتوقعة
```json
{
  "data": {
    "id": 1,
    "name": "طب القلب",
    "name_ar": "Cardiology",
    "description": "تخصص طب القلب والأوعية الدموية",
    "icon": "http://example.com/storage/icons/cardiology.png",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 5. حذف تخصص

### الطلب
```http
DELETE /api/admin/medical-tags/1
Authorization: Bearer {token}
```

### الاستجابة المتوقعة
```json
{
  "message": "Medical tag deleted successfully"
}
```

## معالجة الأخطاء

### خطأ في التحقق من صحة البيانات
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name field is required."],
    "icon": ["The icon must be an image.", "The icon may not be greater than 2048 kilobytes."]
  }
}
```

### خطأ عدم وجود التخصص
```json
{
  "message": "Medical tag not found"
}
```

### خطأ عدم الصلاحية
```json
{
  "message": "Unauthorized"
}
```

## ملاحظات مهمة

1. **حقل is_active**: يُرسل كنص `"true"` أو `"false"` في FormData
2. **رفع الصور**: يجب أن تكون الصورة أقل من 2MB
3. **الحقول المطلوبة**: `name` و `icon` فقط
4. **التحديث**: يستخدم `_method: "PUT"` مع POST لدعم رفع الملفات
5. **المصادقة**: جميع الطلبات تحتاج إلى Bearer token

## اختبار من المتصفح

يمكنك اختبار الـ API من خلال:
1. فتح صفحة التخصصات في التطبيق
2. محاولة إضافة تخصص جديد
3. تحديث تخصص موجود
4. حذف تخصص
5. مراقبة Network tab في Developer Tools