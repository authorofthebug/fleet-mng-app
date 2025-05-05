import { get, post, put, del } from './base';

export interface Insurance {
  id: string;
  vehicleId: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  coverage: string;
  premium: number;
  status: 'active' | 'inactive' | 'pending';
  documents: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const insuranceService = {
  getAll: () => get<Insurance[]>('/api/insurance'),
  getById: (id: string) => get<Insurance>(`/api/insurance/${id}`),
  create: (data: Omit<Insurance, 'id' | 'createdAt' | 'updatedAt'>) => 
    post<Insurance>('/api/insurance', data),
  update: (id: string, data: Omit<Insurance, 'id' | 'createdAt' | 'updatedAt'>) => 
    put<Insurance>(`/api/insurance/${id}`, data),
  delete: (id: string) => del(`/api/insurance/${id}`),
  uploadDocument: (formData: FormData) => 
    post<string>('/api/insurance/documents', formData),
  removeDocument: (documentUrl: string) => 
    del(`/api/insurance/documents?url=${encodeURIComponent(documentUrl)}`)
}; 