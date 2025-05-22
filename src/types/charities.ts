
export interface Beneficiary {
  id: string;
  name: string;
  fileNumber: string;
  benefitDate: string;
  discountAmount: number;
}

export interface CharityData {
  id: string;
  name: string;
  discountPercentage: number;
  isActive: boolean;
  partnershipTerms?: string;
  beneficiariesCount: number;
  beneficiaries?: Beneficiary[];
}

export interface CharityFormData {
  name: string;
  discountPercentage: number;
  partnershipTerms?: string;
  isActive: boolean;
}
