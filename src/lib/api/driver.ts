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
  rut?:string;
  docType?: string;
  folio?: string;
}

export const driverService = {
  getAll: () => get<Driver[]>('/driver'),

  getById: (id: string) => get<Driver>(`/driver/${id}`),

  create: (data: Omit<Driver, 'id'>) => post<Driver>('/driver', data),

  update: (id: string, data: Omit<Driver, 'id'>) => put<Driver>(`/driver/${id}`, data),

  delete: (id: string) => del(`/driver/${id}`),
};