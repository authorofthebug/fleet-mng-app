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
    console.log('Schedule creation request body:', body);

    // Ensure required fields are present
    const requiredFields = ['description', 'status', 'clientId', 'vehicleId', 'origin', 'plate', 'zone', 'destination', 'startTime', 'endTime'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PROGRAMED', 'ALMOST_ON_ARRIVAL', 'STARTED', 'ON_CLIENT', 'BACK_FROM_CLIENT'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status value. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const response = await fetch('http://0.0.0.0:8385/api/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
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

      console.error('Backend error response:', errorText);
      throw new Error(errorMessage);
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
