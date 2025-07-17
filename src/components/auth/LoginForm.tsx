
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      });
    } else {
      // دعم أنواع الأخطاء القادمة من safePost
      let description = "حدث خطأ غير متوقع";
      const error = result.error;
      if (error && error.type) {
        if (error.type === 'network') {
          description = "تعذر الاتصال بالخادم. يرجى المحاولة لاحقًا.";
        } else if (error.type === 'response' && (error.status === 401 || error.status === 422)) {
          description = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (error.type === 'response' && error.status >= 500) {
          description = "حدث خطأ في الخادم. يرجى المحاولة لاحقًا.";
        } else {
          description = error.message || description;
        }
      } else if (error && error.message) {
        description = error.message;
      }
      toast({
        title: "خطأ في تسجيل الدخول",
        description,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "البريد الإلكتروني مطلوب",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "البريد الإلكتروني غير صالح"
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@medconsult.com"
                  className="text-right"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          rules={{
            required: "كلمة المرور مطلوبة",
            minLength: {
              value: 6,
              message: "كلمة المرور يجب أن تكون على الأقل 6 أحرف"
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">كلمة المرور</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="text-right pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            "جاري تسجيل الدخول..."
          ) : (
            <>
              <LogIn className="ml-2 h-4 w-4" />
              تسجيل الدخول
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
