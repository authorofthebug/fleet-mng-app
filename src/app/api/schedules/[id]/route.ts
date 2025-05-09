import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET /api/schedules/[id] - Get a schedule by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const response = await fetch(`http://0.0.0.0:8385/api/schedules/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Schedule not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch schedule');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

// PUT /api/schedules/[id] - Update a schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log(`Updating schedule with ID: ${id}`, body);

    // Validate required fields
    const requiredFields = ['description', 'status', 'clientId', 'vehicleId', 'origin', 'plate', 'zone', 'destination', 'startTime', 'endTime', 'createdAt', 'updatedAt'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      console.error(`Missing required fields for schedule update: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const response = await fetch(`http://0.0.0.0:8385/api/schedules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from API (${response.status}):`, errorText);

      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Schedule not found' },
          { status: 404 }
        );
      }

      let errorMessage = 'Failed to update schedule';
      try {
        // Try to parse as JSON
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If not JSON, use the text directly
        if (errorText) errorMessage = errorText;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    console.log('Schedule updated successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE /api/schedules/[id] - Delete a schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const response = await fetch(`http://0.0.0.0:8385/api/schedules/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Schedule not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to delete schedule');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
