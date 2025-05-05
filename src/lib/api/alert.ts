import { get, post, put, del } from './base';

export interface Alert {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  status: 'active' | 'inactive';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export const alertService = {
  getAll: () => get<Alert[]>('/api/alerts'),
  
  getById: (id: number) => get<Alert>(`/api/alerts/${id}`),
  
  create: (data: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => 
    post<Alert>('/api/alerts', data),
  
  update: (id: number, data: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => 
    put<Alert>(`/api/alerts/${id}`, data),
  
  delete: (id: number) => del(`/api/alerts/${id}`)
};