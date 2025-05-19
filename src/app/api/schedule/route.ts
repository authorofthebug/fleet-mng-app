import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {API_SERVER_URL} from "@/lib/config";

// GET /api/schedule - Get all schedule
export async function GET() {
  try {
    const response = await fetch(`${API_SERVER_URL}/schedule`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
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

// POST /api/schedule - Create a new schedule
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

    const response = await fetch(`${API_SERVER_URL}/schedule`, {
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
        console.error('Error parsing error response:', e);
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
