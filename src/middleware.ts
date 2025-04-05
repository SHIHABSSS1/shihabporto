import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip maintenance mode check for admin routes and API routes
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Check for maintenance mode cookie
  const maintenanceMode = request.cookies.get('maintenance_mode')?.value === 'true';
  let maintenanceMessage = request.cookies.get('maintenance_message')?.value;
  
  // Decode the message if it exists
  if (maintenanceMessage) {
    try {
      maintenanceMessage = decodeURIComponent(maintenanceMessage);
    } catch (e) {
      console.error('Error decoding maintenance message:', e);
      maintenanceMessage = 'Our website is currently under maintenance. Please check back soon!';
    }
  } else {
    maintenanceMessage = 'Our website is currently under maintenance. Please check back soon!';
  }
  
  // If maintenance mode is enabled, show the maintenance page
  if (maintenanceMode) {
    // Create a response with the maintenance message
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Site Maintenance</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #111827;
            color: #e5e7eb;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .container {
            max-width: 600px;
            padding: 40px;
            background-color: #1f2937;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            border: 1px solid #374151;
          }
          h1 {
            color: #60a5fa;
            margin-top: 0;
            font-size: 28px;
          }
          p {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 20px;
            color: #60a5fa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🔧</div>
          <h1>Site Under Maintenance</h1>
          <p>${maintenanceMessage}</p>
        </div>
      </body>
      </html>
      `,
      {
        status: 503,
        headers: {
          'Content-Type': 'text/html',
          'Retry-After': '3600',
        },
      }
    );
  }
  
  // Not in maintenance mode, continue as normal
  return NextResponse.next();
}

// Only run the middleware on these paths
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}; 