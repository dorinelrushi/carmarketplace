import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const isBuyerRoute = createRouteMatcher(["/dashboard/buyer(.*)"]);
const isSellerRoute = createRouteMatcher(["/dashboard/seller(.*)"]);
const isBaseDashboard = createRouteMatcher(["/dashboard"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();

    // Get user ID
    const { userId } = await auth();

    if (userId) {
      // Fetch user role from API
      try {
        const baseUrl = req.nextUrl.origin;
        const response = await fetch(`${baseUrl}/api/user`, {
          headers: {
            Cookie: req.headers.get("cookie") || "",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userRole = data.data?.role;

          // If user has no role, auto-assign based on which dashboard they're accessing
          if (!userRole) {
            let roleToAssign = null;

            if (isBuyerRoute(req)) {
              roleToAssign = "buyer";
            } else if (isSellerRoute(req)) {
              roleToAssign = "seller";
            }

            // Auto-assign role if determined
            if (roleToAssign) {
              try {
                await fetch(`${baseUrl}/api/user`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Cookie: req.headers.get("cookie") || "",
                  },
                  body: JSON.stringify({ role: roleToAssign }),
                });
                // Allow the request to continue to the dashboard
                return NextResponse.next();
              } catch (error) {
                console.error("Failed to auto-assign role:", error);
              }
            }

            // If accessing base /dashboard without a role, default to buyer
            if (isBaseDashboard(req) && req.nextUrl.pathname === "/dashboard") {
              return NextResponse.redirect(
                new URL("/dashboard/buyer", req.url)
              );
            }
          }

          // If user has a role and accesses base /dashboard, redirect to their dashboard
          if (
            userRole &&
            isBaseDashboard(req) &&
            req.nextUrl.pathname === "/dashboard"
          ) {
            const dashboardUrl =
              userRole === "buyer" ? "/dashboard/buyer" : "/dashboard/seller";
            return NextResponse.redirect(new URL(dashboardUrl, req.url));
          }

          // Redirect buyers away from seller routes
          if (userRole === "buyer" && isSellerRoute(req)) {
            return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
          }

          // Redirect sellers away from buyer routes
          if (userRole === "seller" && isBuyerRoute(req)) {
            return NextResponse.redirect(new URL("/dashboard/seller", req.url));
          }
        }
      } catch (error) {
        console.error("Middleware role check failed:", error);
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
