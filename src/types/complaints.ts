
export interface Complaint {
  id: string;
  type: 'technical' | 'doctor_behavior' | 'payment' | 'service' | 'other';
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  patientName: string;
  patientId: string;
  doctorName?: string;
  doctorId?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  comments: ComplaintComment[];
}

export interface ComplaintComment {
  id: string;
  complaintId: string;
  authorName: string;
  authorRole: 'admin' | 'patient' | 'doctor';
  content: string;
  createdAt: string;
}

export interface ComplaintFilters {
  type?: string;
  status?: string;
  priority?: string;
  search?: string;
}
