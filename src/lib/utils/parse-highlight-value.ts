/**
 * Splits an admin-entered stat like "Q15", "1,200" or "8%" into the parts the
 * counter animation needs: prefix, numeric end value and suffix.
 */
export function parseHighlightValue(raw: string): {
  prefix: string;
  end: number;
  suffix: string;
} {
  const match = String(raw ?? "").match(/^(\D*)([\d,.]*)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const digits = (match?.[2] ?? "").replace(/,/g, "");
  const suffix = match?.[3] ?? "";
  const end = Number(digits);
  return { prefix, end: Number.isFinite(end) ? end : 0, suffix };
}
