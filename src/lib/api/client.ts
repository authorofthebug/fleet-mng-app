import { get, post, put, del } from './base';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

const clientService = {
  getAll: () => get<Client[]>('/client'),
  getById: (id: string) => get<Client>(`/client/${id}`),
  create: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => post<Client>('/client', data),
  update: (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>) =>
    put<Client>(`/client/${id}`, data),
  delete: (id: string) => del(`/client/${id}`),
  getByStatus: (status: Client['status']) => get<Client[]>(`/client/status/${status}`)
};

export { clientService };