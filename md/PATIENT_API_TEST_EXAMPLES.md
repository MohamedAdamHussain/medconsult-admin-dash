# أمثلة اختبار API تسجيل المرضى

## 1. مثال تسجيل مريض بدون صورة

### الطلب
```http
POST /api/register
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

fullName: أحمد محمد علي
email: ahmed.ali@example.com
password: password123
phoneNumber: 01234567890
address: شارع النيل، القاهرة، مصر
birthday: 1990-05-15
gender: male
```

### الاستجابة المتوقعة
```json
{
  "status": "success",
  "message": "Patient registered successfully",
  "data": {
    "id": 1,
    "fullName": "أحمد محمد علي",
    "email": "ahmed.ali@example.com",
    "phoneNumber": "01234567890",
    "address": "شارع النيل، القاهرة، مصر",
    "birthday": "1990-05-15",
    "gender": "male",
    "photo": null,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 2. مثال تسجيل مريض مع صورة

### الطلب
```http
POST /api/register
Content-Type: multipart/form-data
Authorization: Bearer {admin_token}

fullName: فاطمة أحمد محمد
email: fatima.ahmed@example.com
password: securepass123
phoneNumber: 01987654321
address: شارع الجامعة، الإسكندرية، مصر
birthday: 1985-12-20
gender: female
photo: [image file - patient_photo.jpg]
```

### الاستجابة المتوقعة
```json
{
  "status": "success",
  "message": "Patient registered successfully",
  "data": {
    "id": 2,
    "fullName": "فاطمة أحمد محمد",
    "email": "fatima.ahmed@example.com",
    "phoneNumber": "01987654321",
    "address": "شارع الجامعة، الإسكندرية، مصر",
    "birthday": "1985-12-20",
    "gender": "female",
    "photo": "https://example.com/storage/patients/2/photo.jpg",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

## 3. أمثلة معالجة الأخطاء

### خطأ: بريد إلكتروني مكرر
```http
POST /api/register
Content-Type: multipart/form-data

fullName: محمد أحمد
email: ahmed.ali@example.com  // بريد مُستخدم مسبقاً
password: password123
phoneNumber: 01111111111
address: القاهرة
birthday: 1992-01-01
gender: male
```

**الاستجابة:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

### خطأ: كلمة مرور قصيرة
```http
POST /api/register
Content-Type: multipart/form-data

fullName: سارة محمد
email: sara@example.com
password: 123      // أقل من 8 أحرف
phoneNumber: 01222222222
address: الجيزة
birthday: 1988-03-10
gender: female
```

**الاستجابة:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "password": ["The password must be at least 8 characters."]
  }
}
```

### خطأ: صورة كبيرة الحجم
```http
POST /api/register
Content-Type: multipart/form-data

fullName: علي حسن
email: ali@example.com
password: password123
phoneNumber: 01333333333
address: أسوان
birthday: 1995-07-25
gender: male
photo: [large_image.jpg - 5MB]  // أكبر من 2MB
```

**الاستجابة:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "photo": ["The photo may not be greater than 2048 kilobytes."]
  }
}
```

### خطأ: نوع ملف غير مدعوم
```http
POST /api/register
Content-Type: multipart/form-data

fullName: نور الدين
email: nour@example.com
password: password123
phoneNumber: 01444444444
address: الأقصر
birthday: 1987-11-12
gender: male
photo: [document.pdf]  // ليس صورة
```

**الاستجابة:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "photo": ["The photo must be an image."]
  }
}
```

### خطأ: حقول مفقودة
```http
POST /api/register
Content-Type: multipart/form-data

fullName: 
email: incomplete@example.com
password: password123
// phoneNumber مفقود
// address مفقود
// birthday مفقود
// gender مفقود
```

**الاستجابة:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "fullName": ["The full name field is required."],
    "phoneNumber": ["The phone number field is required."],
    "address": ["The address field is required."],
    "birthday": ["The birthday field is required."],
    "gender": ["The gender field is required."]
  }
}
```

## 4. اختبار من المتصفح

### JavaScript Console Test
```javascript
// اختبار تسجيل مريض جديد
const testPatientRegistration = async () => {
  const formData = new FormData();
  
  formData.append('fullName', 'مريض تجريبي');
  formData.append('email', 'test.patient@example.com');
  formData.append('password', 'testpass123');
  formData.append('phoneNumber', '01000000000');
  formData.append('address', 'عنوان تجريبي، القاهرة');
  formData.append('birthday', '1990-01-01');
  formData.append('gender', 'male');
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: formData
    });
    
    const result = await response.json();
    console.log('Registration result:', result);
    
    if (response.ok) {
      console.log('✅ Patient registered successfully!');
    } else {
      console.log('❌ Registration failed:', result.errors);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// تشغيل الاختبار
testPatientRegistration();
```

## 5. اختبار مع صورة

### JavaScript مع File Input
```javascript
const testWithImage = async () => {
  // الحصول على ملف من input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  
  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('fullName', 'مريض مع صورة');
    formData.append('email', 'patient.with.photo@example.com');
    formData.append('password', 'photopass123');
    formData.append('phoneNumber', '01555555555');
    formData.append('address', 'عنوان مع صورة');
    formData.append('birthday', '1985-06-15');
    formData.append('gender', 'female');
    formData.append('photo', file);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
      });
      
      const result = await response.json();
      console.log('Registration with photo result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fileInput.click();
};
```

## 6. اختبار التحقق من البيانات

### بيانات صحيحة
```javascript
const validData = {
  fullName: "اسم صحيح",           // ✅ نص مطلوب
  email: "valid@email.com",      // ✅ بريد صحيح
  password: "validpass123",      // ✅ 8+ أحرف
  phoneNumber: "01234567890",    // ✅ رقم هاتف
  address: "عنوان صحيح",        // ✅ عنوان مطلوب
  birthday: "1990-01-01",       // ✅ تاريخ صحيح
  gender: "male"                // ✅ ذكر أو أنثى
};
```

### بيانات خاطئة
```javascript
const invalidData = {
  fullName: "",                 // ❌ فارغ
  email: "invalid-email",       // ❌ تنسيق خاطئ
  password: "123",              // ❌ أقل من 8 أحرف
  phoneNumber: "",              // ❌ فارغ
  address: "",                  // ❌ فارغ
  birthday: "",                 // ❌ فارغ
  gender: ""                    // ❌ فارغ
};
```

## 7. مراقبة الطلبات

### في Developer Tools
1. افتح Developer Tools (F12)
2. انتقل إلى تبويب Network
3. قم بتسجيل مريض جديد من الواجهة
4. راقب الطلب المُرسل إلى `/api/register`
5. تحقق من:
   - Method: POST
   - Content-Type: multipart/form-data
   - جميع الحقول المُرسلة
   - الاستجابة المُستلمة

### مثال الطلب في Network Tab
```
Request URL: http://localhost:8000/api/register
Request Method: POST
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

Form Data:
fullName: أحمد محمد
email: ahmed@test.com
password: password123
phoneNumber: 01234567890
address: القاهرة، مصر
birthday: 1990-01-01
gender: male
photo: (binary data)
```

النظام جاهز للاختبار الشامل! 🚀