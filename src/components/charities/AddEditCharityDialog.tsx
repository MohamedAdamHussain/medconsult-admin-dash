
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CharityData, CharityFormData } from '@/types/charities';

interface AddEditCharityDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  charity?: CharityData;
  onSave: (data: CharityFormData) => void;
}

const AddEditCharityDialog: React.FC<AddEditCharityDialogProps> = ({
  open,
  setOpen,
  charity,
  onSave,
}) => {
  const form = useForm<CharityFormData>({
    defaultValues: {
      name: charity?.name || '',
      discountPercentage: charity?.discountPercentage || 0,
      partnershipTerms: charity?.partnershipTerms || '',
      isActive: charity?.isActive || true,
    },
  });

  React.useEffect(() => {
    if (open && charity) {
      form.reset({
        name: charity.name,
        discountPercentage: charity.discountPercentage,
        partnershipTerms: charity.partnershipTerms,
        isActive: charity.isActive,
      });
    } else if (open && !charity) {
      form.reset({
        name: '',
        discountPercentage: 0,
        partnershipTerms: '',
        isActive: true,
      });
    }
  }, [open, charity, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-right">
            {charity ? 'تعديل جمعية خيرية' : 'إضافة جمعية خيرية'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">اسم الجمعية</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم الجمعية" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">نسبة التخفيض (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100"
                      placeholder="أدخل نسبة التخفيض" 
                      {...field} 
                      className="text-right"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="partnershipTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">شروط الشراكة</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل شروط الشراكة" 
                      {...field} 
                      className="text-right min-h-[100px]" 
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="text-right">حالة الشراكة (نشطة)</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {charity ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCharityDialog;
