import { get, post, put, del } from './base';

export interface Tariff {
  id: number;
  name: string;
  description: string;
  rate: number;
  currency: string;
  type: 'hourly' | 'daily' | 'monthly' | 'fixed';
  status: 'active' | 'inactive';
  startDate: string;
  endDate?: string;
  conditions?: string;
  createdAt: string;
  updatedAt: string;
}

const tariffService = {
  getAll: () => get<Tariff[]>('/api/tariff'),
  getById: (id: number) => get<Tariff>(`/api/tariff/${id}`),
  create: (data: Omit<Tariff, 'id' | 'createdAt' | 'updatedAt'>) => 
    post<Tariff>('/api/tariff', data),
  update: (id: number, data: Partial<Tariff>) => 
    put<Tariff>(`/api/tariff/${id}`, data),
  delete: (id: number) => del(`/api/tariff/${id}`)
};

export { tariffService }; 