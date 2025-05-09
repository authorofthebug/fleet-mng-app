import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET /api/drivers - Get all drivers
export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://0.0.0.0:8385/api/drivers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
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

// POST /api/drivers - Create a new driver
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('http://0.0.0.0:8385/api/drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create driver');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create driver' },
      { status: 500 }
    );
  }
}
