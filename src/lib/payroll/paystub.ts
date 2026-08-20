import { ValidationError } from "@/lib/shared/validation-error";

export class Paystub {
  private constructor(
    readonly grossPay: number,
    readonly deductions: number,
    readonly netPay: number,
    readonly taxRuleVersionId: number
  ) {}

  static create(grossPay: number, deductions: number, taxRuleVersionId: number): Paystub {
    if (grossPay <= 0) {
      throw new ValidationError("grossPay must be positive");
    }
    if (deductions < 0) {
      throw new ValidationError("deductions must be non-negative");
    }
    if (deductions > grossPay) {
      throw new ValidationError("deductions cannot exceed grossPay");
    }
    const netPay = Math.round((grossPay - deductions) * 100) / 100;
    return new Paystub(grossPay, deductions, netPay, taxRuleVersionId);
  }
}
