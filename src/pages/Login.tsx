
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            منصة MedConsult
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            إدارة النظام
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right">تسجيل الدخول</CardTitle>
            <CardDescription className="text-right">
              أدخل بيانات الاعتماد للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
