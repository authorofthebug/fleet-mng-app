import { NextResponse } from 'next/server';
import { API_SERVER_URL } from '@/lib/config';

// GET /api/driver - Get all drivers
export async function GET() {
  try {
    const response = await fetch(`${API_SERVER_URL}/driver`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error(response);
      throw new Error('Failed to fetch drivers');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}