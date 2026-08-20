import type { FilingStatus } from "./employee-entity";
import type { TaxRuleVersion } from "./tax-rule-version";

export function calculateTaxDeductions(
  income: number,
  filingStatus: FilingStatus,
  taxRule: TaxRuleVersion
): number {
  const schedule = taxRule.bracketDefinition[filingStatus];
  const taxableIncome = Math.max(0, income - schedule.standardDeduction);

  let tax = 0;
  let previousThreshold = 0;
  for (const bracket of schedule.brackets) {
    const bracketCap = bracket.upTo ?? Infinity;
    const amountInBracket = Math.max(0, Math.min(taxableIncome, bracketCap) - previousThreshold);
    tax += amountInBracket * bracket.rate;
    if (taxableIncome <= bracketCap) break;
    previousThreshold = bracketCap;
  }

  return Math.round(tax * 100) / 100;
}
