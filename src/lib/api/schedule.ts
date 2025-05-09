import { get, post, put, del } from './base';

export interface Schedule {
  id: string;
  description: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PROGRAMED' | 'ALMOST_ON_ARRIVAL' | 'STARTED' | 'ON_CLIENT' | 'BACK_FROM_CLIENT' | string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  vehicleId: string;
  driverId?: string;
  origin: string;
  plate: string;
  zone: string;
  destination: string;
  startTime: string;
  endTime: string;
  // Additional fields from ProgramacionTab
  startDate?: string;
  endDate?: string;
  days?: number;
  client?: string;
  serviceType?: string;
  condition?: string;
}

const scheduleService = {
  getAll: async () => {
    try {
      // Use the Next.js API route instead of directly accessing the backend
      const response = await fetch('/api/schedules', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      // Use the Next.js API route instead of directly accessing the backend
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },
  create: async (data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Use the Next.js API route instead of directly accessing the backend
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to create schedule';

        try {
          // Try to parse as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use the text directly
          if (errorText) errorMessage = errorText;
        }

        console.error('API error response:', errorText);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },
  update: async (id: string, data: Partial<Schedule>) => {
    try {
      // Use the Next.js API route instead of directly accessing the backend
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      // Use the Next.js API route instead of directly accessing the backend
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }
};

export { scheduleService };
