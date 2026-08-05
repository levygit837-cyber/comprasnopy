import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  detectLanguage,
  isLang,
  LANGUAGE_COOKIE,
  LANGUAGE_REQUEST_HEADER,
} from "@/lib/language";

/**
 * Refreshes the Supabase auth session on every request. Reads the session
 * from request cookies, calls `getUser()` (which validates the token and
 * refreshes it if needed), then writes the refreshed cookies back to both
 * the request and the response so subsequent server components see the
 * fresh session.
 *
 * Without this middleware the server-side `supabase.auth.getUser()` would
 * see expired tokens and the user would be silently signed out.
 */
export async function proxy(request: NextRequest) {
  const savedLanguage = request.cookies.get(LANGUAGE_COOKIE)?.value;
  const detectedLanguage = detectLanguage({
    savedLanguage,
    acceptLanguage: request.headers.get("accept-language"),
    country: request.headers.get("cf-ipcountry"),
  });

  const nextResponse = () => {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LANGUAGE_REQUEST_HEADER, detectedLanguage);
    return NextResponse.next({ request: { headers: requestHeaders } });
  };

  const persistDetectedLanguage = (response: NextResponse) => {
    if (!isLang(savedLanguage)) {
      response.cookies.set(LANGUAGE_COOKIE, detectedLanguage, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      });
    }
    return response;
  };

  let supabaseResponse = nextResponse();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Skip the cookie dance when Supabase isn't configured (e.g. local dev
  // without env vars). The store/build still works because the rest of the
  // app degrades to the disabled-UI fallback.
  if (!supabaseUrl || !supabaseKey) {
    return persistDetectedLanguage(supabaseResponse);
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = nextResponse();
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touch the session so the JWT is validated and refreshed. We don't need
  // the result on every page; middleware runs on every request and we only
  // need to keep cookies in sync.
  await supabase.auth.getUser();

  return persistDetectedLanguage(supabaseResponse);
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - image files (.png, .jpg, .svg, .webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)",
  ],
};
