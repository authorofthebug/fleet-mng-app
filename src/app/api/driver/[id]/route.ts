import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
//import { API_SERVER_URL } from '@/lib/config';

// GET /api/driver/[id] - Get a driver by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const response = await fetch(`/api/driver/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Driver not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch driver');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching driver:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver' },
      { status: 500 }
    );
  }
}