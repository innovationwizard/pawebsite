/**
 * Deep snake_case ↔ camelCase key converters.
 *
 * The UTM tables in Postgres use snake_case columns (pawebsite convention), but
 * the ported UTM UI consumes the camelCase shape the original Prisma app returned.
 * These converters bridge the two at the API boundary so the UI stays unchanged.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

function snakeKey(s: string): string {
  return s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
}

function camelKey(s: string): string {
  return s.replace(/_([a-z0-9])/g, (_m, c: string) => c.toUpperCase());
}

function convert(value: any, keyFn: (k: string) => string): any {
  if (Array.isArray(value)) return value.map((v) => convert(v, keyFn));
  if (value !== null && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [keyFn(k), convert(v, keyFn)])
    );
  }
  return value;
}

/** Recursively convert all object keys to camelCase. */
export function keysToCamel<T = any>(value: any): T {
  return convert(value, camelKey);
}

/** Recursively convert all object keys to snake_case. */
export function keysToSnake<T = any>(value: any): T {
  return convert(value, snakeKey);
}
