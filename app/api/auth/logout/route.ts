// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log("Processing logout request...");

    // Get cookies
    const cookieStore = cookies();
    
    // Clear all authentication-related cookies
    const authCookies = [
      'session', 
      'token', 
      'auth-token',
      'jwt',
      'access_token',
      'refresh_token',
      'user-session',
      // Add any other cookie names your app uses
    ];

    // Create response
    const response = NextResponse.json(
      { message: "Logged out successfully" }, 
      { status: 200 }
    );

    // Clear each authentication cookie
    authCookies.forEach(cookieName => {
      // Check if cookie exists before trying to clear it
      const cookie = cookieStore.get(cookieName);
      if (cookie) {
        console.log(`Clearing cookie: ${cookieName}`);
      }
      
      // Clear the cookie by setting it to expire in the past
      response.cookies.set({
        name: cookieName,
        value: '',
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });

    // If you're using a database session, clear it here
    // Example:
    // const sessionId = cookieStore.get('session')?.value;
    // if (sessionId) {
    //   await clearSessionFromDatabase(sessionId);
    // }

    // If you're using JWT, you might want to add it to a blacklist
    // Example:
    // const token = cookieStore.get('token')?.value;
    // if (token) {
    //   await addTokenToBlacklist(token);
    // }

    console.log("Logout completed successfully");
    return response;

  } catch (error) {
    console.error("Logout error:", error);
    
    // Even if there's an error, try to clear cookies
    const response = NextResponse.json(
      { message: "Logout completed with errors" }, 
      { status: 200 }
    );

    // Clear cookies anyway
    ['session', 'token', 'auth-token', 'jwt'].forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        expires: new Date(0),
        path: '/',
      });
    });

    return response;
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}