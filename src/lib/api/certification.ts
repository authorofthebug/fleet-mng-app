import { get, post, put, del } from './base';

export interface Certification {
  id: number;
  name: string;
  description: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  employeeId: number;
}

const certificationService = {
  getAll: () => get<Certification[]>('/api/certifications'),
  getById: (id: number) => get<Certification>(`/api/certifications/${id}`),
  create: (data: Omit<Certification, 'id'>) => post<Certification>('/api/certifications', data),
  update: (id: number, data: Omit<Certification, 'id'>) => put<Certification>(`/api/certifications/${id}`, data),
  delete: (id: number) => del(`/api/certifications/${id}`),
  getByEmployee: (employeeId: number) => get<Certification[]>(`/api/certifications/employee/${employeeId}`)
};

export { certificationService }; 