import { NextResponse, NextRequest } from 'next/server';
import { alerts as mockAlerts, Alert } from '@/lib/mock/alerts';

// Create a mutable copy of the alerts array
const alertsArray = [...mockAlerts];

// GET /api/alerts/[id]
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const alertId = parseInt(id, 10);
    const alert = alertsArray.find((a) => a.id === alertId);

    if (!alert) {
      return NextResponse.json(
          { error: 'Alert not found' },
          { status: 404 }
      );
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error in GET /api/alerts/[id]:', error);
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
  }
}
// PUT /api/alerts/[id]
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const alertId = parseInt(id, 10);
    
    //const index = alertsArray.find((a) => a.id === alertId);
    
    if (alertId === -1) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    // Validate field values if provided
    if (body.type && !['info', 'warning', 'error', 'success'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid type value' },
        { status: 400 }
      );
    }

    if (body.status && !['active', 'inactive'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    if (body.priority && !['low', 'medium', 'high'].includes(body.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority value' },
        { status: 400 }
      );
    }
    
    const updatedAlert: Alert = {
      ...alertsArray[alertId],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    alertsArray[alertId] = updatedAlert;
    
    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error('Error in PUT /api/alerts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/alerts/[id]
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await context.params;
    const alertId = parseInt(id, 10);

    if (alertId === -1) {
      return NextResponse.json(
          { error: 'Alert not found' },
          { status: 404 }
      );
    }
    
    alertsArray.splice(alertId, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/alerts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 