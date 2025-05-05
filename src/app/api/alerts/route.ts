import {NextRequest, NextResponse} from 'next/server';
import { alerts as mockAlerts, Alert } from '@/lib/mock/alerts';

// Create a mutable copy of the alerts array
let alertsArray = [...mockAlerts];

// GET /api/alerts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');

    let filteredAlerts = [...alertsArray];

    if (status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }

    if (type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === type);
    }

    if (priority) {
      filteredAlerts = filteredAlerts.filter(alert => alert.priority === priority);
    }

    return NextResponse.json(filteredAlerts);
  } catch (error) {
    console.error('Error in GET /api/alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// POST /api/alerts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'message', 'type', 'status', 'priority'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate field values
    if (!['info', 'warning', 'error', 'success'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid type value' },
        { status: 400 }
      );
    }

    if (!['active', 'inactive'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    if (!['low', 'medium', 'high'].includes(body.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority value' },
        { status: 400 }
      );
    }

    const newAlert: Alert = {
      id: alertsArray.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    alertsArray.push(newAlert);

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/alerts/[id]
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  
  const index = alertsArray.findIndex(a => a.id === parseInt(id));
  
  if (index === -1) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }
  
  alertsArray[index] = {
    ...alertsArray[index],
    ...body,
    updatedAt: new Date().toISOString()
  };
  
  return NextResponse.json(alertsArray[index]);
}

// DELETE /api/alerts/[id]
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  const index = alertsArray.findIndex(a => a.id === parseInt(id));
  
  if (index === -1) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }
  
  alertsArray = alertsArray.filter(a => a.id !== parseInt(id));
  
  return NextResponse.json({ success: true });
}
