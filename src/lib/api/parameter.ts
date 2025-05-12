import { get, post, put, del } from './base';

export interface Parameter {
  id: number;
  name: string;
  description?: string;
  category: string;
  value: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export const parameterService = {
  getAll: () => get<Parameter[]>('/api/generic-types'),
  getById: (id: number) => get<Parameter>(`/api/generic-types/${id}`),
  create: (data: Omit<Parameter, 'id' | 'createdAt' | 'updatedAt'>) => 
    post<Parameter>('/api/generic-types', data),
  update: (id: number, data: Partial<Parameter>) => 
    put<Parameter>(`/api/generic-types/${id}`, data),
  delete: (id: number) => del(`/api/generic-types/${id}`),
  
  // Get parameters by category and status
  getByCategoryAndStatus: (category: string, status: string) => 
    get<Parameter[]>(`/api/generic-types/by-category/${category}/${status}`),
  
  // Get service types (specific helper method)
  getServiceTypes: () => get<Parameter[]>('/api/generic-types/by-category/SERVICE/status/active')
};
