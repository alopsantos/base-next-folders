import {
  type NextRequest,
  type MiddlewareConfig,
  NextResponse
} from "next/server";

const publicRoutes = [
  { path: "/sign-in", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/", whenAuthenticated: "next" },
  { path: "/dashboard", whenAuthenticated: "next" },
  { path: "/pricing", whenAuthenticated: "next" }
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/sign-in";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("token");

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    console.log(publicRoute);
    // Checar se o JWT está Expirado
    // Se sim, redirecionar para a tela de login
    // Aplicar uma estratégia de refresh token
    return NextResponse.next();
  }
  // return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};
