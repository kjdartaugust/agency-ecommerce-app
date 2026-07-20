import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/env";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh the session so Server Components get a valid token.
  //
  // This runs on every matched request, so it must never be able to hang. A
  // visitor holding a session cookie for an auth backend that has gone away
  // (deleted project, outage, DNS failure) would otherwise block here until the
  // platform kills the invocation — turning one dead dependency into a 504 on
  // every page, for exactly the users who once signed in.
  //
  // Losing a refresh is recoverable: the request proceeds unauthenticated and
  // protected routes redirect to login as usual. Blocking the request is not.
  try {
    await withTimeout(supabase.auth.getUser(), SESSION_REFRESH_TIMEOUT_MS);
  } catch (cause) {
    console.warn("[middleware] session refresh skipped:", cause);
  }

  return response;
}

/**
 * Budget for the session refresh. Middleware sits in front of every page, so
 * this is deliberately far below the platform's invocation limit: a slow auth
 * backend should cost a fraction of a second, not the whole request.
 */
const SESSION_REFRESH_TIMEOUT_MS = 2500;

/**
 * Rejects if `promise` has not settled within `ms`.
 *
 * The underlying request is not cancelled — it is abandoned. Nothing depends on
 * its result once we have given up, and the invocation ends regardless.
 */
function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms),
    ),
  ]);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
