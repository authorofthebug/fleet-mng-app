import { get, post, put, del } from './base';

export interface Maintenance {
  id: number;
  vehicleId: number;
  type: 'preventive' | 'corrective' | 'inspection';
  description: string;
  date: string;
  cost: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  provider: string;
  documents: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const maintenanceService = {
  getAll: () => get<Maintenance[]>('/api/maintenance'),
  getById: (id: number) => get<Maintenance>(`/api/maintenance/${id}`),
  create: (data: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => 
    post<Maintenance>('/api/maintenance', data),
  update: (id: number, data: Partial<Maintenance>) => 
    put<Maintenance>(`/api/maintenance/${id}`, data),
  delete: (id: number) => del(`/api/maintenance/${id}`),
  uploadDocument: (formData: FormData) => 
    post<{ url: string }>('/api/maintenance/upload', formData),
  removeDocument: (documentUrl: string) => 
    del(`/api/maintenance/document?url=${encodeURIComponent(documentUrl)}`)
};

export { maintenanceService }; 