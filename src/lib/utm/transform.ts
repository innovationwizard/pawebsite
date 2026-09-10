/**
 * Deep snake_case ↔ camelCase key converters.
 *
 * The UTM tables in Postgres use snake_case columns (pawebsite convention), but
 * the ported UTM UI consumes the camelCase shape the original Prisma app returned.
 * These converters bridge the two at the API boundary so the UI stays unchanged.
 */

function snakeKey(s: string): string {
  return s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
}

function camelKey(s: string): string {
  return s.replace(/_([a-z0-9])/g, (_m, c: string) => c.toUpperCase());
}

function convert(value: unknown, keyFn: (k: string) => string): unknown {
  if (Array.isArray(value)) return value.map((v) => convert(v, keyFn));
  if (value !== null && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [keyFn(k), convert(v, keyFn)])
    );
  }
  return value;
}

/**
 * Recursively convert all object keys to camelCase. The caller names the
 * resulting shape via `T`; the conversion itself is structural, so this is a
 * declared (not verified) type.
 */
export function keysToCamel<T = unknown>(value: unknown): T {
  return convert(value, camelKey) as T;
}

/** Recursively convert all object keys to snake_case. See keysToCamel. */
export function keysToSnake<T = unknown>(value: unknown): T {
  return convert(value, snakeKey) as T;
}
