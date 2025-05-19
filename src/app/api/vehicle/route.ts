import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {API_SERVER_URL} from "@/lib/config";



// Middleware to verify JWT token
/*async function verifyToken(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return null;
    }

    const payload = await verifier.verify(token);
    return payload;
  } catch (err) {
    console.log(err);
    return null;
  }
}*/

// GET /api/vehicle - Get all vehicle
export async function GET() {
  try {
    console.log('API route: Fetching vehicle from backend');
    const response = await fetch(`${API_SERVER_URL}/vehicle`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('API route: Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API route: Error response from backend:', errorText);
      throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API route: Successfully fetched vehicle data');
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route: Error fetching vehicle:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

// POST /api/vehicle - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('API route: Creating vehicle with data:', body);

    const response = await fetch(`${API_SERVER_URL}/vehicle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.log('API route: Backend response status for vehicle creation:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to create vehicle';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        console.error('API route: Error response from backend (not JSON):', parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API route: Successfully created vehicle:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API route: Error creating vehicle:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}