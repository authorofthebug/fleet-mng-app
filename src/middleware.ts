import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if it's a preflight request
  const isPreflight = request.method === 'OPTIONS'
  
  const response = isPreflight 
    ? new NextResponse(null, { status: 204 }) 
    : NextResponse.next()
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  
  return response
}

export const config = {
  matcher: '/api/:path*',
} 