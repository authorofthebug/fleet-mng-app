import { get, post, put, del } from './base';

export interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'on_leave';
}

export const driverService = {
  getAll: () => get<Driver[]>('/api/drivers'),
  
  getById: (id: number) => get<Driver>(`/api/drivers/${id}`),
  
  create: (data: Omit<Driver, 'id'>) => post<Driver>('/api/drivers', data),
  
  update: (id: number, data: Omit<Driver, 'id'>) => put<Driver>(`/api/drivers/${id}`, data),
  
  delete: (id: number) => del(`/api/drivers/${id}`),
}; 