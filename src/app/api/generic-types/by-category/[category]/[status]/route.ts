import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET /api/generic-types/by-category/[category]/[status]
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; status: string } }
) {
  try {
    const { category, status } = params;

    const response = await fetch(`http://0.0.0.0:8385/api/generic-types/${category}/${status}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Parameters not found' },
          { status: 404 }
        );
      }
      throw new Error('Failed to fetch parameters');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${params.category} parameters:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch parameters' },
      { status: 500 }
    );
  }
}