
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  status: string;
  city: string;
  joinDate: string;
  patients: number;
  consultations: number;
  documents: {
    certificate: string;
    license: string;
    id: string;
  };
  contacts: {
    phone: string;
    email: string;
  };
}

export type FilterOption = {
  type: 'specialty' | 'status' | 'city';
  value: string;
}
