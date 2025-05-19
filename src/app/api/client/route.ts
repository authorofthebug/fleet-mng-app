import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_SERVER_URL } from '@/lib/config';

// GET /api/client - Get all client
export async function GET() {
  try {
    const response = await fetch(`${API_SERVER_URL}/client`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch client');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

// POST /api/client - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_SERVER_URL}/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create client');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create client' },
      { status: 500 }
    );
  }
}
