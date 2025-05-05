import { get, post, put, del } from './base';

export interface Permit {
  id: number;
  vehicleId: number;
  type: 'registration' | 'insurance' | 'inspection' | 'other';
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  issuingAuthority: string;
  documents: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const permitService = {
  getAll: () => get<Permit[]>('/api/permit'),
  getById: (id: number) => get<Permit>(`/api/permit/${id}`),
  create: (data: Omit<Permit, 'id' | 'createdAt' | 'updatedAt'>) => 
    post<Permit>('/api/permit', data),
  update: (id: number, data: Partial<Permit>) => 
    put<Permit>(`/api/permit/${id}`, data),
  delete: (id: number) => del(`/api/permit/${id}`),
  uploadDocument: (formData: FormData) => 
    post<{ url: string }>('/api/permit/upload', formData),
  removeDocument: (documentUrl: string) => 
    del(`/api/permit/document?url=${encodeURIComponent(documentUrl)}`)
};

export { permitService }; 