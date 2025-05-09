import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET /api/schedules - Get all schedules
export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://0.0.0.0:8385/api/schedules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch schedules');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

// POST /api/schedules - Create a new schedule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('http://0.0.0.0:8385/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create schedule');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create schedule' },
      { status: 500 }
    );
  }
}
