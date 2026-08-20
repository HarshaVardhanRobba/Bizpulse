import { NextResponse } from "next/server";
import { AppError } from "@/lib/shared/app-error";
import { generatePaystub } from "@/lib/payroll/generate-paystub";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paystub = await generatePaystub({
      employeeId: body.employeeId,
      payDate: body.payDate,
      grossPay: body.grossPay,
    });
    return NextResponse.json(paystub, { status: 201 });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }
    throw err;
  }
}
