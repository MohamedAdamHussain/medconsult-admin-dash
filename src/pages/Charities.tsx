
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CharitiesList from '@/components/charities/CharitiesList';
import CharityDetails from '@/components/charities/CharityDetails';
import AddEditCharityDialog from '@/components/charities/AddEditCharityDialog';
import { useCharitiesData } from '@/hooks/useCharitiesData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Charities = () => {
  const {
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
  } = useCharitiesData();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">الجمعيات الخيرية</h1>
        <p className="text-gray-500 mt-1 text-right">إدارة الجمعيات الداعمة لتخفيض تكاليف العلاج</p>
      </div>

      <CharitiesList 
        charities={charities} 
        onViewDetails={viewCharityDetails}
        onAddCharity={() => setIsAddEditDialogOpen(true)}
        onEditCharity={(charity) => {
          setSelectedCharity(charity);
          setIsAddEditDialogOpen(true);
        }}
        onDeleteCharity={handleDeleteCharity}
      />

      {/* Dialog for charity details and beneficiaries */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">تفاصيل الجمعية الخيرية</DialogTitle>
          </DialogHeader>
          
          {selectedCharity && (
            <CharityDetails charity={selectedCharity} />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for adding/editing charity */}
      <AddEditCharityDialog 
        open={isAddEditDialogOpen}
        setOpen={setIsAddEditDialogOpen}
        charity={selectedCharity || undefined}
        onSave={(data) => {
          if (selectedCharity) {
            handleEditCharity(selectedCharity.id, data);
          } else {
            handleAddCharity(data);
          }
          setIsAddEditDialogOpen(false);
        }}
      />
    </DashboardLayout>
  );
};

export default Charities;
