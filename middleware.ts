import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/forgot-password", "/api/auth"]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Check if the request is for static files
  const isStaticFile = request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|ttf|woff|woff2)$/)

  // For development, allow access without authentication
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  // If the user is not authenticated and trying to access a protected route
  if (!token && !isPublicRoute && !isStaticFile) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access an auth route
  if (token && isPublicRoute && !request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
