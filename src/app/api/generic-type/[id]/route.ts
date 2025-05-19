import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {API_SERVER_URL} from "@/lib/config";

// GET /api/generic-type/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const response = await fetch(`${API_SERVER_URL}/generic-type/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Parameter not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch parameter');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching parameter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parameter' },
      { status: 500 }
    );
  }
}

// PUT /api/generic-type/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${API_SERVER_URL}/generic-type/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Parameter not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to update parameter');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating parameter:', error);
    return NextResponse.json(
      { error: 'Failed to update parameter' },
      { status: 500 }
    );
  }
}

// DELETE /api/generic-type/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const response = await fetch(`${API_SERVER_URL}/generic-type/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Parameter not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to delete parameter');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting parameter:', error);
    return NextResponse.json(
      { error: 'Failed to delete parameter' },
      { status: 500 }
    );
  }
}
