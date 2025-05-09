import { get, post, put, del } from './base';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  licenseExpiration?: string;
  address?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
}

export const driverService = {
  getAll: () => get<Driver[]>('/api/drivers'),

  getById: (id: string) => get<Driver>(`/api/drivers/${id}`),

  create: (data: Omit<Driver, 'id'>) => post<Driver>('/api/drivers', data),

  update: (id: string, data: Omit<Driver, 'id'>) => put<Driver>(`/api/drivers/${id}`, data),

  delete: (id: string) => del(`/api/drivers/${id}`),
};