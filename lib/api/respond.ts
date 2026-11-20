import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ConflictError } from "@/lib/errors";

export { ConflictError } from "@/lib/errors";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return fail("Please check the highlighted fields.", 422, details);
  }

  if (error instanceof ConflictError) {
    return fail(error.message, 409);
  }

  console.error("Scenova API error:", error);
  return fail("Something went wrong. Please try again.", 500);
}
