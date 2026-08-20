import type { FilingStatus } from "./employee-entity";

export interface TaxBracket {
  upTo: number | null;
  rate: number;
}

export interface TaxSchedule {
  standardDeduction: number;
  brackets: TaxBracket[];
}

export type TaxBracketDefinition = Record<FilingStatus, TaxSchedule>;

export interface TaxRuleVersion {
  id: number;
  effectiveDate: string;
  bracketDefinition: TaxBracketDefinition;
}
