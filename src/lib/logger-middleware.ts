import type { NextMiddleware } from "next/server";
import { logger } from "@/lib/shared/logger";

export function withRequestLogging(middleware: NextMiddleware): NextMiddleware {
  return async (req, event) => {
    const requestId = crypto.randomUUID();
    const start = Date.now();

    logger.info("request.start", {
      requestId,
      method: req.method,
      path: req.nextUrl.pathname,
    });

    const response = await middleware(req, event);

    logger.info("request.end", {
      requestId,
      method: req.method,
      path: req.nextUrl.pathname,
      status: response?.status,
      durationMs: Date.now() - start,
    });

    response?.headers.set("x-request-id", requestId);

    return response;
  };
}
