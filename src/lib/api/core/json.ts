export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export type JsonObject = Record<string, JsonValue | undefined>

export function asObject(value: JsonValue | undefined): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonObject)
    : {}
}

export function asArray(value: JsonValue | undefined): JsonObject[] {
  return Array.isArray(value) ? value.map(asObject) : []
}

export function asString(value: JsonValue | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

export function asOptionalString(
  value: JsonValue | undefined,
): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export function asNumber(value: JsonValue | undefined, fallback = 0): number {
  return typeof value === 'number' ? value : fallback
}

export function asOptionalNumber(
  value: JsonValue | undefined,
): number | undefined {
  return typeof value === 'number' ? value : undefined
}
