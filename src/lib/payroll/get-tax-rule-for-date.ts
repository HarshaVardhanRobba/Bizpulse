import { NotFoundError } from "@/lib/shared/not-found-error";
import { PayrollRepository } from "./payroll-repository";
import type { TaxRuleVersion } from "./tax-rule-version";

export async function getTaxRuleForDate(
  payDate: string,
  repository: PayrollRepository = new PayrollRepository()
): Promise<TaxRuleVersion> {
  const taxRule = await repository.findTaxRuleEffectiveOn(payDate);
  if (!taxRule) {
    throw new NotFoundError("TaxRuleVersion effective on", payDate);
  }
  return taxRule;
}
