import { get, post, put, del } from './base';
import { Position } from './agency';

export type { Position };

export const positionService = {
  getAll: () => get<Position[]>('/api/positions'),
  getById: (id: number) => get<Position>(`/api/positions/${id}`),
  create: (data: Omit<Position, 'id'>) => post<Position>('/api/positions', data),
  update: (id: number, data: Omit<Position, 'id'>) => put<Position>(`/api/positions/${id}`, data),
  delete: (id: number) => del(`/api/positions/${id}`)
}; 