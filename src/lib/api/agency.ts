import { get, post, put, del } from './base';

export interface Agency {
  id: number;
  name: string;
  company: Company | null;
  employeeCount: number;
  employees: Employee[];
  status: 'active' | 'inactive' | 'pending';
  //employees: Employee[];
}

export interface Company {
  id: number;
  name: string;
  agencies: Agency[];
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: Position;
  agency: Agency;
  roles: Role[];
}

export interface Position {
  id: number;
  name: string;
  description: number;
  status: string;
  employees: Employee[];
}

export interface Role {
  id: number;
  name: string;
  employees: Employee[];
}

export const agencyService = {
  getAll: () => get<Agency[]>('/api/agencies'),
  
  getById: (id: number) => get<Agency>(`/api/agencies/${id}`),
  
  create: (data: Omit<Agency, 'id'>) => post<Agency>('/api/agencies', data),
  
  update: (id: number, data: Omit<Agency, 'id'>) => put<Agency>(`/api/agencies/${id}`, data),
  
  delete: (id: number) => del<void>(`/api/agencies/${id}`)
}; 