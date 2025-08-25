# ربط تسجيل المرضى مع API

## نظرة عامة
تم إنشاء نظام شامل لتسجيل المرضى الجدد من خلال لوحة التحكم الإدارية مع ربط كامل بـ API `/register`.

## الملفات المُنشأة

### 1. Hook تسجيل المرضى
**الملف:** `src/hooks/usePatientRegistration.ts`
- `usePatientRegistration()`: Hook رئيسي لتسجيل المرضى
- معالجة FormData للصور والبيانات المعقدة
- معالجة الأخطاء وعرض الرسائل
- دعم React Query للتخزين المؤقت

### 2. نموذج تسجيل المريض
**الملف:** `src/components/patients/PatientRegistrationForm.tsx`
- نموذج شامل مقسم إلى 4 تبويبات
- التحقق من صحة البيانات باستخدام Zod
- دعم رفع الصور (شخصية وطبية)
- إدارة القوائم الطبية (أمراض، حساسية، أدوية، إلخ)

### 3. تحديث صفحة المرضى
**الملف:** `src/pages/Patients.tsx`
- إضافة زر "تسجيل مريض جديد"
- ربط نموذج التسجيل بالصفحة الرئيسية

## مواصفات API المدعومة

### Endpoint
```
POST /register
```

### هيكل البيانات المرسلة

#### البيانات الأساسية (مطلوبة)
```json
{
  "name": "أحمد محمد علي",
  "email": "ahmed@example.com",
  "password": "123456",
  "password_confirmation": "123456",
  "gender": "male"
}
```

#### البيانات الاختيارية
```json
{
  "phone": "+966501234567",
  "birthday": "1990-01-01",
  "address": "الرياض، المملكة العربية السعودية",
  "height": 175,
  "weight": 70
}
```

#### البيانات الطبية (مصفوفات)
```json
{
  "general_diseases": ["ضغط الدم", "السكري"],
  "chronic_diseases": ["الربو"],
  "allergies": ["البنسلين", "الفول السوداني"],
  "permanent_medications": ["الأنسولين", "دواء الضغط"],
  "previous_surgeries": ["استئصال الزائدة الدودية"]
}
```

#### الصور (Files)
```
profile_image: File (صورة شخصية)
medical_images[0]: File (صورة طبية 1)
medical_images[1]: File (صورة طبية 2)
...
```

### استجابة API المتوقعة
```json
{
  "status": "success",
  "message": "تم تسجيل المريض بنجاح",
  "data": {
    "id": 1,
    "name": "أحمد محمد علي",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "gender": "male",
    "birthday": "1990-01-01",
    "address": "الرياض، المملكة العربية السعودية",
    "height": 175,
    "weight": 70,
    "general_diseases": ["ضغط الدم", "السكري"],
    "chronic_diseases": ["الربو"],
    "allergies": ["البنسلين", "الفول السوداني"],
    "permanent_medications": ["الأنسولين", "دواء الضغط"],
    "previous_surgeries": ["استئصال الزائدة الدودية"],
    "profile_image": "https://example.com/images/profile/1.jpg",
    "medical_images": [
      "https://example.com/images/medical/1_1.jpg",
      "https://example.com/images/medical/1_2.jpg"
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## الحقول المدعومة

### الحقول المطلوبة
- `name`: الاسم الكامل (نص، 2 أحرف على الأقل)
- `email`: البريد الإلكتروني (تنسيق صحيح)
- `password`: كلمة المرور (6 أحرف على الأقل)
- `password_confirmation`: تأكيد كلمة المرور (يجب أن تطابق)
- `gender`: الجنس (`male` أو `female`)

### الحقول الاختيارية
- `phone`: رقم الهاتف
- `birthday`: تاريخ الميلاد (YYYY-MM-DD)
- `address`: العنوان
- `height`: الطول (50-250 سم)
- `weight`: الوزن (20-300 كغ)

### القوائم الطبية (اختيارية)
- `general_diseases[]`: الأمراض العامة
- `chronic_diseases[]`: الأمراض المزمنة
- `allergies[]`: الحساسية
- `permanent_medications[]`: الأدوية الدائمة
- `previous_surgeries[]`: العمليات الجراحية السابقة

### الصور (اختيارية)
- `profile_image`: الصورة الشخصية (ملف صورة)
- `medical_images[]`: الصور الطبية (مصفوفة ملفات صور)

## ميزات النموذج

### 1. تبويبات منظمة
- **البيانات الأساسية**: الاسم، البريد، الهاتف، الجنس، تاريخ الميلاد، العنوان، الطول، الوزن
- **الأمان**: كلمة المرور وتأكيدها
- **المعلومات الطبية**: الأمراض، الحساسية، الأدوية، العمليات السابقة
- **الصور**: الصورة الشخصية والصور الطبية

### 2. إدارة القوائم الطبية
- إضافة عناصر جديدة بالضغط على Enter أو زر الإضافة
- عرض العناصر كـ badges قابلة للحذف
- دعم قوائم متعددة منفصلة

### 3. رفع الصور
- دعم الصورة الشخصية (ملف واحد)
- دعم الصور الطبية المتعددة
- عرض أسماء الملفات المختارة
- إمكانية حذف الصور قبل الإرسال

### 4. التحقق من صحة البيانات
- التحقق من الحقول المطلوبة
- التحقق من تنسيق البريد الإلكتروني
- التحقق من طول كلمة المرور
- التحقق من تطابق كلمات المرور
- التحقق من نطاقات الطول والوزن

### 5. واجهة مستخدم محسنة
- تصميم متجاوب ومتسق
- أيقونات واضحة للتبويبات
- مؤشرات التحميل
- رسائل الأخطاء والنجاح

## كيفية الاستخدام

### 1. الوصول للنموذج
- انتقل إلى صفحة المرضى: `/patients`
- انقر على زر "تسجيل مريض جديد"

### 2. ملء البيانات
1. **البيانات الأساسية**: أدخل الاسم، البريد، الهاتف، الجنس، إلخ
2. **الأمان**: أدخل كلمة المرور وأكدها
3. **المعلومات الطبية**: أضف الأمراض والحساسية والأدوية
4. **الصور**: ارفع الصورة الشخصية والصور الطبية

### 3. إرسال النموذج
- انقر على "تسجيل المريض"
- انتظر رسالة التأكيد
- سيتم إغلاق النموذج تلقائياً عند النجاح

## أمثلة الاستخدام

### 1. تسجيل مريض بالحد الأدنى من البيانات
```javascript
const minimalData = {
  name: "أحمد محمد",
  email: "ahmed@example.com",
  password: "123456",
  password_confirmation: "123456",
  gender: "male"
};
```

### 2. تسجيل مريض مع بيانات كاملة
```javascript
const completeData = {
  name: "فاطمة أحمد علي",
  email: "fatima@example.com",
  password: "securepass123",
  password_confirmation: "securepass123",
  phone: "+966501234567",
  gender: "female",
  birthday: "1985-05-15",
  address: "جدة، المملكة العربية السعودية",
  height: 165,
  weight: 60,
  general_diseases: ["ضغط الدم"],
  chronic_diseases: ["السكري النوع الثاني"],
  allergies: ["البنسلين"],
  permanent_medications: ["الأنسولين"],
  previous_surgeries: ["عملية المرارة"],
  profile_image: profileImageFile,
  medical_images: [medicalImage1, medicalImage2]
};
```

## معالجة الأخطاء

### أخطاء التحقق من صحة البيانات
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name field is required."],
    "email": ["The email field must be a valid email address."],
    "password": ["The password field must be at least 6 characters."],
    "password_confirmation": ["The password confirmation does not match."],
    "gender": ["The selected gender is invalid."]
  }
}
```

### أخطاء الصور
```json
{
  "errors": {
    "profile_image": ["The profile image must be an image."],
    "medical_images.0": ["The medical images.0 must be an image."]
  }
}
```

### أخطاء البريد الإلكتروني المكرر
```json
{
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

## التوصيات للخادم (Laravel)

### Controller
```php
public function register(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6|confirmed',
        'phone' => 'nullable|string|max:20',
        'gender' => 'required|in:male,female',
        'birthday' => 'nullable|date',
        'address' => 'nullable|string|max:500',
        'height' => 'nullable|integer|min:50|max:250',
        'weight' => 'nullable|integer|min:20|max:300',
        'general_diseases' => 'nullable|array',
        'chronic_diseases' => 'nullable|array',
        'allergies' => 'nullable|array',
        'permanent_medications' => 'nullable|array',
        'previous_surgeries' => 'nullable|array',
        'profile_image' => 'nullable|image|max:2048',
        'medical_images' => 'nullable|array',
        'medical_images.*' => 'image|max:2048'
    ]);

    // معالجة رفع الصور
    if ($request->hasFile('profile_image')) {
        $validated['profile_image'] = $request->file('profile_image')->store('profiles');
    }

    if ($request->hasFile('medical_images')) {
        $medicalImages = [];
        foreach ($request->file('medical_images') as $image) {
            $medicalImages[] = $image->store('medical');
        }
        $validated['medical_images'] = $medicalImages;
    }

    // تشفير كلمة المرور
    $validated['password'] = Hash::make($validated['password']);

    // إنشاء المستخدم
    $user = User::create($validated);

    return response()->json([
        'status' => 'success',
        'message' => 'تم تسجيل المريض بنجاح',
        'data' => $user
    ]);
}
```

### Model
```php
class User extends Model
{
    protected $fillable = [
        'name', 'email', 'password', 'phone', 'gender', 'birthday',
        'address', 'height', 'weight', 'general_diseases', 'chronic_diseases',
        'allergies', 'permanent_medications', 'previous_surgeries',
        'profile_image', 'medical_images'
    ];

    protected $casts = [
        'general_diseases' => 'array',
        'chronic_diseases' => 'array',
        'allergies' => 'array',
        'permanent_medications' => 'array',
        'previous_surgeries' => 'array',
        'medical_images' => 'array',
        'birthday' => 'date'
    ];

    protected $hidden = [
        'password', 'remember_token'
    ];
}
```

النظام جاهز لتسجيل المرضى الجدد مع جميع البيانات والصور! 🚀