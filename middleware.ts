import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware: never run for Next.js static assets and API.
 * This ensures /_next/static/*, /_next/image/*, favicon.ico are never
 * intercepted — preventing 404 on chunks when adding auth/redirects later.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all pathnames except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
