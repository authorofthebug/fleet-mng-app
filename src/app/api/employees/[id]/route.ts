import { NextResponse, NextRequest } from 'next/server';
import { employees as mockEmployees, Employee } from '@/lib/mock/employees';

// Create a mutable copy of the employees array
const employeesArray = [...mockEmployees];

// GET /api/employees/[id]
export async function GET(
    request: NextRequest, context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const employee = employeesArray.find(emp => emp.id === parseInt(id));

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error in GET /api/employees/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/employees/[id]
export async function PUT(
    request: NextRequest, context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'agencyId', 'positionId', 'roleId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const index = employeesArray.findIndex(emp => emp.id === parseInt(id));
    if (index === -1) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const updatedEmployee: Employee = {
      ...employeesArray[index],
      ...body,
      id,
      agencyId: parseInt(body.agencyId),
      positionId: parseInt(body.positionId),
      roleId: parseInt(body.roleId)
    };

    employeesArray[index] = updatedEmployee;

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error('Error in PUT /api/employees/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[id]
export async function DELETE(
    request: NextRequest, context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const index = employeesArray.findIndex(emp => emp.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    employeesArray.splice(index, 1);

    return NextResponse.json(
      { message: 'Employee deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/employees/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 