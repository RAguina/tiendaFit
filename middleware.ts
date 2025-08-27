import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin") && 
        req.nextauth.token?.role !== "ADMIN") {
      return Response.redirect(new URL("/auth/signin", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!req.nextUrl.pathname.startsWith("/admin")) return true
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}