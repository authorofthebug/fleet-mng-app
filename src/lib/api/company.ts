import { get, post, put, del } from './base';

export interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

const companyService = {
  getAll: () => get<Company[]>('/api/companies'),
  getById: (id: number) => get<Company>(`/api/companies/${id}`),
  create: (data: Omit<Company, 'id'>) => post<Company>('/api/companies', data),
  update: (id: number, data: Omit<Company, 'id'>) => put<Company>(`/api/companies/${id}`, data),
  delete: (id: number) => del(`/api/companies/${id}`)
};

export { companyService }; 