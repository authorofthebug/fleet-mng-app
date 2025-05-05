import { NextResponse } from 'next/server';
import { employees as mockEmployees, Employee } from '@/lib/mock/employees';

// Create a mutable copy of the employees array
const employeesArray = [...mockEmployees];

// GET /api/employees
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');

    let filteredEmployees = [...employeesArray];

    if (agencyId) {
      filteredEmployees = filteredEmployees.filter(emp => emp.agencyId === parseInt(agencyId));
    }

    return NextResponse.json(filteredEmployees);
  } catch (error) {
    console.error('Error in GET /api/employees:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/employees
export async function POST(request: Request) {
  try {
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

    const newEmployee: Employee = {
      id: employeesArray.length + 1,
      ...body,
      agencyId: parseInt(body.agencyId),
      positionId: parseInt(body.positionId),
      roleId: parseInt(body.roleId)
    };

    employeesArray.push(newEmployee);

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/employees:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 