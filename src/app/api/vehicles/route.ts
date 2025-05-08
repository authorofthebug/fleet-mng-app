import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

// Initialize the JWT verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
  tokenUse: 'id',
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
});

// Middleware to verify JWT token
async function verifyToken(request: NextRequest) {
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
}

// GET /api/vehicles - Get all vehicles
export async function GET(request: NextRequest) {
  try {
    console.log('API route: Fetching vehicles from backend');
    const response = await fetch('http://localhost:8385/api/vehicles', {
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
    console.log('API route: Successfully fetched vehicles data');
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route: Error fetching vehicles:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('API route: Creating vehicle with data:', body);

    const response = await fetch('http://localhost:8385/api/vehicles', {
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
        const errorText = await response.text();
        console.error('API route: Error response from backend (not JSON):', errorText);
        errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
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