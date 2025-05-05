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

export const alerts: Alert[] = [
  {
    id: 1,
    title: 'Vehicle Maintenance Due',
    message: 'Vehicle #123 is due for maintenance in 5 days.',
    type: 'warning',
    status: 'active',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    title: 'Insurance Expiring',
    message: 'Insurance for vehicle #456 will expire in 10 days.',
    type: 'error',
    status: 'active',
    priority: 'high',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 3,
    title: 'New Driver Assigned',
    message: 'Driver John Doe has been assigned to vehicle #789.',
    type: 'info',
    status: 'active',
    priority: 'low',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString()
  }
]; 