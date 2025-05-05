import { get, post, put, del } from './base';

export interface Checklist {
  id: number;
  name: string;
  description: string;
  items: ChecklistItem[];
  status: 'active' | 'inactive';
  vehicleId: number;
}

export interface ChecklistItem {
  id: number;
  description: string;
  isCompleted: boolean;
  checklistId: number;
}

const checklistService = {
  getAll: () => get<Checklist[]>('/api/checklists'),
  getById: (id: number) => get<Checklist>(`/api/checklists/${id}`),
  create: (data: Omit<Checklist, 'id'>) => post<Checklist>('/api/checklists', data),
  update: (id: number, data: Omit<Checklist, 'id'>) => put<Checklist>(`/api/checklists/${id}`, data),
  delete: (id: number) => del(`/api/checklists/${id}`),
  getByVehicle: (vehicleId: number) => get<Checklist[]>(`/api/checklists/vehicle/${vehicleId}`),
  updateItem: (checklistId: number, itemId: number, data: Partial<ChecklistItem>) => 
    put<ChecklistItem>(`/api/checklists/${checklistId}/items/${itemId}`, data),
  addItem: (checklistId: number, data: Omit<ChecklistItem, 'id' | 'checklistId'>) =>
    post<ChecklistItem>(`/api/checklists/${checklistId}/items`, data),
  deleteItem: (checklistId: number, itemId: number) =>
    del(`/api/checklists/${checklistId}/items/${itemId}`)
};

export { checklistService }; 