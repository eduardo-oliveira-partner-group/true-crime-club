import fs from 'fs'
import { load } from 'js-yaml'
import path from 'path'

export type JsonObject = { [key: string]: JsonValue }
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | JsonObject

export interface OpenApiSchema {
  type?: string
  format?: string
  description?: string
  example?: JsonValue
  properties?: Record<string, OpenApiSchema>
  items?: OpenApiSchema
  required?: string[]
  enum?: JsonValue[]
  allOf?: OpenApiSchema[]
  oneOf?: OpenApiSchema[]
  anyOf?: OpenApiSchema[]
}

export interface OpenApiParameter {
  name: string
  in: 'path' | 'query' | 'header' | 'cookie'
  required?: boolean
  description?: string
  schema: OpenApiSchema
}

export interface OpenApiResponse {
  description: string
  content?: {
    'application/json'?: {
      schema: OpenApiSchema
    }
  }
}

export interface OpenApiRoute {
  path: string
  method: string
  tags?: string[]
  summary?: string
  description?: string
  parameters?: OpenApiParameter[]
  requestBody?: {
    required?: boolean
    content: {
      'application/json'?: {
        schema: OpenApiSchema
      }
    }
  }
  responses: Record<string, OpenApiResponse>
}

export interface OpenApiTag {
  name: string
  description?: string
}

export interface OpenApiSpec {
  info: {
    title: string
    description?: string
    version: string
  }
  servers?: { url: string; description?: string }[]
  tags?: OpenApiTag[]
  routes: OpenApiRoute[]
  schemas: Record<string, OpenApiSchema>
}

interface ResolvedOpenApiDocument {
  info?: OpenApiSpec['info']
  servers?: OpenApiSpec['servers']
  tags?: OpenApiTag[]
  paths?: Record<
    string,
    Partial<Record<string, Omit<OpenApiRoute, 'path' | 'method'>>>
  >
  components?: {
    schemas?: Record<string, OpenApiSchema>
  }
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function asOpenApiSchema(value: JsonValue): OpenApiSchema {
  return isJsonObject(value) ? (value as OpenApiSchema) : {}
}

// Helper to resolve $ref recursively
function resolveRefs(
  obj: JsonValue,
  root: JsonObject,
  seen = new Set<string>(),
): JsonValue {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveRefs(item, root, seen))
  }

  if (typeof obj.$ref === 'string') {
    const ref = obj.$ref
    if (seen.has(ref)) {
      return { type: 'object', description: `[Circular Reference to ${ref}]` }
    }
    const newSeen = new Set(seen)
    newSeen.add(ref)

    const refPath = ref.replace(/^#\//, '').split('/')
    let current: JsonValue | undefined = root
    for (const segment of refPath) {
      if (isJsonObject(current)) {
        current = current[segment] ?? null
      } else {
        current = undefined
        break
      }
    }

    // Merge the resolved schema with other properties (like description/examples on the ref caller)
    const resolved = resolveRefs(current ?? null, root, newSeen)
    const rest: JsonObject = { ...obj }
    delete rest.$ref
    return mergeSchemas(
      asOpenApiSchema(resolved),
      asOpenApiSchema(resolveRefs(rest, root, newSeen)),
    ) as JsonObject
  }

  // Handle allOf merging to simplify visual display
  if (Array.isArray(obj.allOf)) {
    const resolvedAllOf = obj.allOf.map((item) => resolveRefs(item, root, seen))
    const merged = resolvedAllOf.reduce<OpenApiSchema>(
      (acc, curr) => mergeSchemas(acc, asOpenApiSchema(curr)),
      {},
    )
    const rest: JsonObject = { ...obj }
    delete rest.allOf
    return mergeSchemas(
      merged,
      asOpenApiSchema(resolveRefs(rest, root, seen)),
    ) as JsonObject
  }

  const result: JsonObject = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = resolveRefs(value, root, seen)
    }
  }
  return result
}

function mergeSchemas(
  base: OpenApiSchema | undefined | null,
  override: OpenApiSchema | undefined | null,
): OpenApiSchema {
  if (!base) return override ?? {}
  if (!override) return base

  const merged: OpenApiSchema = { ...base, ...override }

  if (base.properties && override.properties) {
    merged.properties = { ...base.properties, ...override.properties }
  }

  if (base.required && override.required) {
    merged.required = Array.from(
      new Set([...base.required, ...override.required]),
    )
  }

  return merged
}

export function getOpenApiSpec(): OpenApiSpec {
  const filePath = path.join(process.cwd(), 'docs/openapi.yaml')
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const rawSpec = load(fileContent) as JsonObject

  // 1. Resolve references internally
  const resolvedSpec = resolveRefs(rawSpec, rawSpec) as ResolvedOpenApiDocument

  // 2. Extract paths into a flat array of routes
  const routes: OpenApiRoute[] = []
  if (resolvedSpec.paths) {
    for (const [pathStr, pathObj] of Object.entries(resolvedSpec.paths)) {
      if (typeof pathObj === 'object' && pathObj !== null) {
        for (const [methodStr, methodObj] of Object.entries(pathObj)) {
          // Only process HTTP methods
          if (
            [
              'get',
              'post',
              'put',
              'delete',
              'patch',
              'options',
              'head',
            ].includes(methodStr.toLowerCase())
          ) {
            routes.push({
              path: pathStr,
              method: methodStr.toUpperCase(),
              ...(methodObj as Omit<OpenApiRoute, 'path' | 'method'>),
            })
          }
        }
      }
    }
  }

  // 3. Extract resolved schemas
  const schemas: Record<string, OpenApiSchema> = {}
  if (resolvedSpec.components?.schemas) {
    for (const [name, schema] of Object.entries(
      resolvedSpec.components.schemas,
    )) {
      schemas[name] = schema
    }
  }

  return {
    info: resolvedSpec.info || { title: 'API Documentation', version: '1.0.0' },
    servers: resolvedSpec.servers,
    tags: resolvedSpec.tags,
    routes,
    schemas,
  }
}
