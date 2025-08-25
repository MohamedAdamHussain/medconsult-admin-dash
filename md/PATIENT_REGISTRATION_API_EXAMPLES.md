# أمثلة اختبار API تسجيل المرضى

## 1. تسجيل مريض بالحد الأدنى من البيانات

### الطلب
```http
POST /api/register
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

name=أحمد محمد علي
email=ahmed@example.com
password=123456
password_confirmation=123456
gender=male
```

### الاستجابة المتوقعة
```json
{
  "status": "success",
  "message": "تم تسجيل المريض بنجاح",
  "data": {
    "id": 1,
    "name": "أحمد محمد علي",
    "email": "ahmed@example.com",
    "phone": null,
    "gender": "male",
    "birthday": null,
    "address": null,
    "height": null,
    "weight": null,
    "general_diseases": [],
    "chronic_diseases": [],
    "allergies": [],
    "permanent_medications": [],
    "previous_surgeries": [],
    "profile_image": null,
    "medical_images": [],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 2. تسجيل مريض مع بيانات كاملة

### الطلب
```http
POST /api/register
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

name=فاطمة أحمد علي
email=fatima@example.com
password=securepass123
password_confirmation=securepass123
phone=+966501234567
gender=female
birthday=1985-05-15
address=جدة، المملكة العربية السعودية
height=165
weight=60
general_diseases[0]=ضغط الدم
general_diseases[1]=الصداع النصفي
chronic_diseases[0]=السكري النوع الثاني
allergies[0]=البنسلين
allergies[1]=الفول السوداني
permanent_medications[0]=الأنسولين
permanent_medications[1]=دواء الضغط
previous_surgeries[0]=عملية المرارة
profile_image={image_file}
medical_images[0]={medical_image_1}
medical_images[1]={medical_image_2}
```

### الاستجابة المتوقعة
```json
{
  "status": "success",
  "message": "تم تسجيل المريض بنجاح",
  "data": {
    "id": 2,
    "name": "فاطمة أحمد علي",
    "email": "fatima@example.com",
    "phone": "+966501234567",
    "gender": "female",
    "birthday": "1985-05-15",
    "address": "جدة، المملكة العربية السعودية",
    "height": 165,
    "weight": 60,
    "general_diseases": ["ضغط الدم", "الصداع النصفي"],
    "chronic_diseases": ["السكري النوع الثاني"],
    "allergies": ["البنسلين", "الفول السوداني"],
    "permanent_medications": ["الأنسولين", "دواء الضغط"],
    "previous_surgeries": ["عملية المرارة"],
    "profile_image": "https://example.com/storage/profiles/2_profile.jpg",
    "medical_images": [
      "https://example.com/storage/medical/2_medical_1.jpg",
      "https://example.com/storage/medical/2_medical_2.jpg"
    ],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 3. تسجيل مريض ذكر مع معلومات طبية متقدمة

### الطلب
```http
POST /api/register
Content-Type: multipart/form-data

name=محمد عبدالله الأحمد
email=mohammed@example.com
password=mypassword123
password_confirmation=mypassword123
phone=+966555123456
gender=male
birthday=1978-12-10
address=الرياض، حي النخيل
height=180
weight=85
general_diseases[0]=ارتفاع الكوليسترول
chronic_diseases[0]=ارتفاع ضغط الدم
chronic_diseases[1]=مرض السكري
allergies[0]=الأسبرين
allergies[1]=المأكولات البحرية
permanent_medications[0]=الميتفورمين
permanent_medications[1]=أملوديبين
permanent_medications[2]=أتورفاستاتين
previous_surgeries[0]=عملية القلب المفتوح
previous_surgeries[1]=استئصال الزائدة الدودية
profile_image={profile_image_file}
medical_images[0]={ecg_image}
medical_images[1]={xray_image}
medical_images[2]={blood_test_image}
```

## 4. تسجيل مريضة مع حساسية متعددة

### الطلب
```http
POST /api/register
Content-Type: multipart/form-data

name=عائشة سالم المطيري
email=aisha@example.com
password=aisha2024
password_confirmation=aisha2024
phone=+966502987654
gender=female
birthday=1992-03-22
address=الدمام، حي الشاطئ
height=160
weight=55
general_diseases[0]=الربو
allergies[0]=حبوب اللقاح
allergies[1]=الغبار
allergies[2]=شعر القطط
allergies[3]=البنسلين
allergies[4]=الإيبوبروفين
permanent_medications[0]=بخاخ الربو
permanent_medications[1]=مضادات الهيستامين
profile_image={profile_image_file}
```

## 5. تسجيل مريض كبير السن مع تاريخ طبي مفصل

### الطلب
```http
POST /api/register
Content-Type: multipart/form-data

name=عبدالرحمن إبراهيم الخالد
email=abdulrahman@example.com
password=oldpatient123
password_confirmation=oldpatient123
phone=+966503456789
gender=male
birthday=1950-08-05
address=مكة المكرمة، حي العزيزية
height=170
weight=75
general_diseases[0]=التهاب المفاصل
general_diseases[1]=ضعف السمع
chronic_diseases[0]=مرض السكري النوع الثاني
chronic_diseases[1]=ارتفاع ضغط الدم
chronic_diseases[2]=أمراض القلب
allergies[0]=السلفا
permanent_medications[0]=الأنسولين طويل المفعول
permanent_medications[1]=أملوديبين
permanent_medications[2]=أسبرين الأطفال
permanent_medications[3]=ميتفورمين
previous_surgeries[0]=عملية المياه البيضاء
previous_surgeries[1]=عملية البروستاتا
previous_surgeries[2]=تركيب دعامة القلب
medical_images[0]={heart_scan}
medical_images[1]={diabetes_report}
```

## معالجة الأخطاء

### 1. خطأ في البيانات المطلوبة
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name field is required."],
    "email": ["The email field is required."],
    "password": ["The password field is required."],
    "gender": ["The gender field is required."]
  }
}
```

### 2. خطأ في تنسيق البريد الإلكتروني
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email must be a valid email address."]
  }
}
```

### 3. خطأ في كلمة المرور
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "password": ["The password must be at least 6 characters."],
    "password_confirmation": ["The password confirmation does not match."]
  }
}
```

### 4. خطأ البريد الإلكتروني المكرر
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

### 5. خطأ في الصور
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "profile_image": ["The profile image must be an image.", "The profile image may not be greater than 2048 kilobytes."],
    "medical_images.0": ["The medical images.0 must be an image."]
  }
}
```

### 6. خطأ في النطاقات الرقمية
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "height": ["The height must be between 50 and 250."],
    "weight": ["The weight must be between 20 and 300."]
  }
}
```

### 7. خطأ في الجنس
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "gender": ["The selected gender is invalid."]
  }
}
```

## اختبار من المتصفح

### 1. اختبار أساسي
```javascript
// في console المتصفح
const formData = new FormData();
formData.append('name', 'مريض تجريبي');
formData.append('email', 'test@example.com');
formData.append('password', '123456');
formData.append('password_confirmation', '123456');
formData.append('gender', 'male');

fetch('/api/register', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### 2. اختبار مع بيانات طبية
```javascript
const formData = new FormData();
formData.append('name', 'مريض بيانات كاملة');
formData.append('email', 'complete@example.com');
formData.append('password', '123456');
formData.append('password_confirmation', '123456');
formData.append('gender', 'female');
formData.append('phone', '+966501234567');
formData.append('birthday', '1990-01-01');
formData.append('height', '165');
formData.append('weight', '60');
formData.append('general_diseases[0]', 'ضغط الدم');
formData.append('allergies[0]', 'البنسلين');

fetch('/api/register', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## ملاحظات مهمة للتطوير

### 1. الحقول المطلوبة
- `name`: الاسم الكامل
- `email`: البريد الإلكتروني (فريد)
- `password`: كلمة المرور (6 أحرف على الأقل)
- `password_confirmation`: تأكيد كلمة المرور
- `gender`: الجنس (`male` أو `female`)

### 2. تنسيق المصفوفات
```
general_diseases[0]=المرض الأول
general_diseases[1]=المرض الثاني
chronic_diseases[0]=المرض المزمن الأول
```

### 3. رفع الصور
- الصورة الشخصية: `profile_image`
- الصور الطبية: `medical_images[0]`, `medical_images[1]`, إلخ
- الحد الأقصى: 2MB لكل صورة
- الأنواع المدعومة: jpg, jpeg, png, gif

### 4. التواريخ
- تنسيق تاريخ الميلاد: `YYYY-MM-DD`
- مثال: `1990-01-01`

### 5. الأرقام
- الطول: 50-250 سم
- الوزن: 20-300 كغ

### 6. النصوص
- الاسم: 2-255 حرف
- البريد الإلكتروني: تنسيق صحيح + فريد
- العنوان: حتى 500 حرف
- الهاتف: حتى 20 حرف

النظام جاهز لاختبار تسجيل المرضى مع جميع السيناريوهات! 🧪