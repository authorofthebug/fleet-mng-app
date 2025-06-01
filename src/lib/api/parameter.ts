import { get, post, put, del } from './base';

export interface Parameter {
  id: number;
  name: string;
  description?: string;
  category: string;
  value: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export const parameterService = {
  getAll: () => get<Parameter[]>('/generic-type'),
  getById: (id: number) => get<Parameter>(`/generic-type/${id}`),
  create: (data: Omit<Parameter, 'id' | 'createdAt' | 'updatedAt'>) => 
    post<Parameter>('/generic-type', data),
  update: (id: number, data: Partial<Parameter>) => 
    put<Parameter>(`/generic-type/${id}`, data),
  delete: (id: number) => del(`/api/generic-type/${id}`),
  
  // Get parameters by category and status
  getByCategoryAndStatus: (category: string, status: string) => 
    get<Parameter[]>(`/generic-type/by-category/${category}/${status}`),
  
  // Get service types (specific helper method)
  getServiceTypes: () => get<Parameter[]>('/generic-type/by-category/SERVICE/status/active')
};
