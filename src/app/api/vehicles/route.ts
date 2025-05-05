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
  const user = await verifyToken(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Here you would typically fetch vehicles from your database
    // For now, we'll return mock data
    const vehicles = [
      {
        id: '1',
        plate: 'ABC123',
        model: 'Toyota Camry',
        year: '2020',
        color: 'Silver',
        vin: '1HGCM82633A123456',
      },
      // Add more mock vehicles as needed
    ];

    return NextResponse.json(vehicles);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  const user = await verifyToken(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['plate', 'model', 'year', 'color', 'vin'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Here you would typically save the vehicle to your database
    // For now, we'll just return the created vehicle with a mock ID
    const newVehicle = {
      id: Date.now().toString(),
      ...body,
    };

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
} 