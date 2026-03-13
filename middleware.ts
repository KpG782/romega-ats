import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/jobs",
  "/candidates",
  "/talent-pool",
  "/analytics",
  "/automations",
  "/departments",
  "/settings",
  "/internal-tools",
];

// Routes only for unauthenticated users (redirect away if already logged in)
const AUTH_ROUTES = ["/login"];
const ONBOARDING_ROUTE = "/onboarding";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isOnboardingRoute = pathname.startsWith(ONBOARDING_ROUTE);

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtected || isOnboardingRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options as CookieOptions);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && (isProtected || isOnboardingRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!user) {
    return response;
  }

  const { data: membership } = await supabase
    .from("workspace_memberships")
    .select("workspace_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .eq("membership_status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const hasWorkspace = !!membership?.workspace_id;

  if (!hasWorkspace && !isOnboardingRoute) {
    return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
  }

  if (hasWorkspace && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(hasWorkspace ? "/dashboard" : ONBOARDING_ROUTE, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
