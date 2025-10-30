import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  // Check if the request is for protected API routes
  if (request.nextUrl.pathname.startsWith('/api/quizzes') || 
      request.nextUrl.pathname.startsWith('/api/questions') ||
      request.nextUrl.pathname.startsWith('/api/results')) {
    
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add user ID to headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('userId', decoded.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/quizzes/:path*', '/api/questions/:path*', '/api/results/:path*']
};