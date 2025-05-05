import { get, post, put, del } from './base';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  status: 'active' | 'inactive';
  type: 'individual' | 'corporate';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const clientService = {
  getAll: () => get<Client[]>('/api/clients'),
  getById: (id: number) => get<Client>(`/api/clients/${id}`),
  create: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => post<Client>('/api/clients', data),
  update: (id: number, data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>) => 
    put<Client>(`/api/clients/${id}`, data),
  delete: (id: number) => del(`/api/clients/${id}`),
  getByStatus: (status: Client['status']) => get<Client[]>(`/api/clients/status/${status}`),
  getByType: (type: Client['type']) => get<Client[]>(`/api/clients/type/${type}`)
};

export { clientService }; 