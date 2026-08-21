import { NextResponse } from "next/server";
import { AppError } from "@/lib/shared/app-error";
import { ValidationError } from "@/lib/shared/validation-error";

type RouteHandler<Ctx> = (req: Request, ctx: Ctx) => Promise<Response>;

export function withErrorHandling<Ctx = unknown>(handler: RouteHandler<Ctx>): RouteHandler<Ctx> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { error: err.message, code: err.code, fieldErrors: err.fieldErrors },
          { status: err.statusCode }
        );
      }
      if (err instanceof AppError) {
        return NextResponse.json(
          { error: err.message, code: err.code },
          { status: err.statusCode }
        );
      }
      throw err;
    }
  };
}
