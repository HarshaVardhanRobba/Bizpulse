import { withErrorHandling } from "@/lib/api/with-error-handling";
import { created } from "@/lib/api/response";
import { generatePaystub } from "@/lib/payroll/generate-paystub";

export const POST = withErrorHandling(async (req) => {
  const body = await req.json();
  const paystub = await generatePaystub({
    employeeId: body.employeeId,
    payDate: body.payDate,
    grossPay: body.grossPay,
  });
  return created(paystub);
});
