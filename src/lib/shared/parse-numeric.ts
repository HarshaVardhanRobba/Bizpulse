export function parseNumericColumn(value: string, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`corrupt numeric value for ${field}: ${value}`);
  }
  return parsed;
}
