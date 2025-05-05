import {NextRequest, NextResponse} from 'next/server';
import { certifications as mockCertifications, Certification } from '@/lib/mock/certifications';

// Create a mutable copy of the certifications array
const certificationsArray = [...mockCertifications];

// GET /api/certifications/[id]
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
)  {
  try {
    const { id } = await context.params;
    const certification = certificationsArray.find(c => c.id === parseInt(id));
    
    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(certification);
  } catch (error) {
    console.error('Error in GET /api/certifications/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/certifications/[id]
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const index = certificationsArray.findIndex(c => c.id === parseInt(id));
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    // Validate field values if provided
    if (body.status && !['active', 'expired', 'pending'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    const updatedCertification: Certification = {
      ...certificationsArray[index],
      ...body,
      employeeId: body.employeeId ? parseInt(body.employeeId) : certificationsArray[index].employeeId
    };
    
    certificationsArray[index] = updatedCertification;
    
    return NextResponse.json(updatedCertification);
  } catch (error) {
    console.error('Error in PUT /api/certifications/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/certifications/[id]
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    
    const index = certificationsArray.findIndex(c => c.id === parseInt(id));
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }
    
    certificationsArray.splice(index, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/certifications/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 