import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET /api/generic-types
export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://0.0.0.0:8385/api/generic-types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch parameters');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching parameters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parameters' },
      { status: 500 }
    );
  }
}

// POST /api/generic-types - Create a new parameter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('http://0.0.0.0:8385/api/generic-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create parameter');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating parameter:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create parameter' },
      { status: 500 }
    );
  }
}