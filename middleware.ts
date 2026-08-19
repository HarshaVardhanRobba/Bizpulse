import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { withRequestLogging } from "@/lib/logger-middleware";

const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default withRequestLogging(
  clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  })
);

export const config = {
  matcher: ["/api/(.*)"],
};
