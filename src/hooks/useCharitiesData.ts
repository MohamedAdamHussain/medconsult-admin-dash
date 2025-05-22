
import { useState } from 'react';
import { CharityData, CharityFormData } from '@/types/charities';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Mock data for charity organizations
const mockCharities: CharityData[] = [
  {
    id: '1',
    name: 'جمعية الإحسان الخيرية',
    discountPercentage: 25,
    isActive: true,
    beneficiariesCount: 42,
    partnershipTerms: 'يجب أن يكون المريض من ذوي الدخل المحدود ولديه تقرير طبي معتمد',
    beneficiaries: [
      {
        id: '101',
        name: 'أحمد محمد',
        fileNumber: 'P-2023-1001',
        benefitDate: '12/03/2023',
        discountAmount: 650,
      },
      {
        id: '102',
        name: 'فاطمة علي',
        fileNumber: 'P-2023-1045',
        benefitDate: '20/03/2023',
        discountAmount: 875,
      },
    ],
  },
  {
    id: '2',
    name: 'مؤسسة الرعاية الصحية',
    discountPercentage: 40,
    isActive: true,
    beneficiariesCount: 27,
    partnershipTerms: 'تغطية حالات الأطفال تحت سن 12 عام فقط مع تقديم المستندات اللازمة',
    beneficiaries: [
      {
        id: '103',
        name: 'خالد جاسم',
        fileNumber: 'P-2023-1087',
        benefitDate: '05/04/2023',
        discountAmount: 1200,
      },
    ],
  },
  {
    id: '3',
    name: 'صندوق دعم المرضى',
    discountPercentage: 15,
    isActive: false,
    beneficiariesCount: 8,
    partnershipTerms: 'دعم الحالات الطارئة فقط بعد موافقة مجلس إدارة الصندوق',
    beneficiaries: [],
  },
];

export const useCharitiesData = () => {
  const [charities, setCharities] = useState<CharityData[]>(mockCharities);
  const [selectedCharity, setSelectedCharity] = useState<CharityData | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);

  const viewCharityDetails = (charity: CharityData) => {
    setSelectedCharity(charity);
    setIsDetailsDialogOpen(true);
  };

  const handleAddCharity = (data: CharityFormData) => {
    const newCharity: CharityData = {
      id: uuidv4(),
      name: data.name,
      discountPercentage: data.discountPercentage,
      partnershipTerms: data.partnershipTerms,
      isActive: data.isActive,
      beneficiariesCount: 0,
      beneficiaries: [],
    };
    
    setCharities([...charities, newCharity]);
    toast.success('تم إضافة الجمعية الخيرية بنجاح');
  };

  const handleEditCharity = (charityId: string, data: CharityFormData) => {
    setCharities(charities.map(charity => {
      if (charity.id === charityId) {
        return {
          ...charity,
          name: data.name,
          discountPercentage: data.discountPercentage,
          partnershipTerms: data.partnershipTerms,
          isActive: data.isActive,
        };
      }
      return charity;
    }));
    
    setSelectedCharity(null);
    toast.success('تم تحديث بيانات الجمعية بنجاح');
  };

  const handleDeleteCharity = (id: string) => {
    // For a real application, you might want to show a confirmation dialog here
    setCharities(charities.filter(charity => charity.id !== id));
    toast.success('تم حذف الجمعية الخيرية بنجاح');
  };

  return {
    charities,
    selectedCharity,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    isAddEditDialogOpen,
    setIsAddEditDialogOpen,
    viewCharityDetails,
    handleAddCharity,
    handleEditCharity,
    handleDeleteCharity
  };
};
