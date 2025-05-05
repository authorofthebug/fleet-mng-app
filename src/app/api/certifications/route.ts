import { NextResponse } from 'next/server';
import { certifications as mockCertifications, Certification } from '@/lib/mock/certifications';

// Create a mutable copy of the certifications array
const certificationsArray = [...mockCertifications];

// GET /api/certifications
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    let filteredCertifications = [...certificationsArray];

    if (status) {
      filteredCertifications = filteredCertifications.filter(cert => cert.status === status);
    }

    if (employeeId) {
      filteredCertifications = filteredCertifications.filter(cert => cert.employeeId === parseInt(employeeId));
    }

    return NextResponse.json(filteredCertifications);
  } catch (error) {
    console.error('Error in GET /api/certifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/certifications
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'expiryDate', 'status', 'employeeId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate field values
    if (!['active', 'expired', 'pending'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const newCertification: Certification = {
      id: certificationsArray.length + 1,
      ...body,
      employeeId: parseInt(body.employeeId)
    };

    certificationsArray.push(newCertification);

    return NextResponse.json(newCertification, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/certifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 