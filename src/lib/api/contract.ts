import { get, post, put, del } from './base';

export interface Contract {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending' | 'terminated';
  type: 'lease' | 'rental' | 'maintenance' | 'service';
  value: number;
  clientId: number;
  vehicleId: number;
  terms: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

const contractService = {
  getAll: () => get<Contract[]>('/api/contracts'),
  getById: (id: number) => get<Contract>(`/api/contracts/${id}`),
  create: (data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => post<Contract>('/api/contracts', data),
  update: (id: number, data: Partial<Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>>) => 
    put<Contract>(`/api/contracts/${id}`, data),
  delete: (id: number) => del(`/api/contracts/${id}`),
  getByStatus: (status: Contract['status']) => get<Contract[]>(`/api/contracts/status/${status}`),
  getByType: (type: Contract['type']) => get<Contract[]>(`/api/contracts/type/${type}`),
  getByClient: (clientId: number) => get<Contract[]>(`/api/contracts/client/${clientId}`),
  getByVehicle: (vehicleId: number) => get<Contract[]>(`/api/contracts/vehicle/${vehicleId}`),
  uploadDocument: (contractId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<{ url: string }>(`/api/contracts/${contractId}/documents`, formData);
  },
  removeDocument: (contractId: number, documentUrl: string) => 
    del(`/api/contracts/${contractId}/documents?url=${encodeURIComponent(documentUrl)}`)
};

export { contractService }; 