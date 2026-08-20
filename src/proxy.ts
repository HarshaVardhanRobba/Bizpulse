import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextMiddleware } from "next/server";
import { withRequestLogging } from "@/lib/logger-middleware";

const isPublicApiRoute = createRouteMatcher(["/api/health", "/api/webhooks(.*)"]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith("/api") && !isPublicApiRoute(req)) {
    await auth.protect();
  }
});

const withCors: NextMiddleware = async (req, event) => {
  const response = (await clerk(req, event)) ?? NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export default withRequestLogging(withCors);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
