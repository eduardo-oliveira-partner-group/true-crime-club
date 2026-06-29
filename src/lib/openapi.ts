import fs from 'fs'
import path from 'path'
import { load } from 'js-yaml'

export interface OpenApiSchema {
  type?: string
  format?: string
  description?: string
  example?: any
  properties?: Record<string, OpenApiSchema>
  items?: OpenApiSchema
  required?: string[]
  enum?: any[]
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

// Helper to resolve $ref recursively
function resolveRefs(obj: any, root: any, seen = new Set<string>()): any {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveRefs(item, root, seen))
  }

  if (obj.$ref) {
    const ref = obj.$ref
    if (seen.has(ref)) {
      return { type: 'object', description: `[Circular Reference to ${ref}]` }
    }
    const newSeen = new Set(seen)
    newSeen.add(ref)

    const refPath = ref.replace(/^#\//, '').split('/')
    let current = root
    for (const segment of refPath) {
      current = current?.[segment]
    }
    
    // Merge the resolved schema with other properties (like description/examples on the ref caller)
    const resolved = resolveRefs(current, root, newSeen)
    const { $ref, ...rest } = obj
    return mergeSchemas(resolved, resolveRefs(rest, root, newSeen))
  }

  // Handle allOf merging to simplify visual display
  if (obj.allOf && Array.isArray(obj.allOf)) {
    const resolvedAllOf = obj.allOf.map((item: any) => resolveRefs(item, root, seen))
    const merged = resolvedAllOf.reduce((acc: any, curr: any) => mergeSchemas(acc, curr), {})
    const { allOf, ...rest } = obj
    return mergeSchemas(merged, resolveRefs(rest, root, seen))
  }

  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = resolveRefs(value, root, seen)
  }
  return result
}

function mergeSchemas(base: any, override: any): any {
  if (!base) return override
  if (!override) return base
  
  const merged = { ...base, ...override }
  
  if (base.properties && override.properties) {
    merged.properties = { ...base.properties, ...override.properties }
  }
  
  if (base.required && override.required) {
    merged.required = Array.from(new Set([...base.required, ...override.required]))
  }

  return merged
}

export function getOpenApiSpec(): OpenApiSpec {
  const filePath = path.join(process.cwd(), 'docs/openapi.yaml')
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const rawSpec = load(fileContent) as any

  // 1. Resolve references internally
  const resolvedSpec = resolveRefs(rawSpec, rawSpec)

  // 2. Extract paths into a flat array of routes
  const routes: OpenApiRoute[] = []
  if (resolvedSpec.paths) {
    for (const [pathStr, pathObj] of Object.entries(resolvedSpec.paths)) {
      if (typeof pathObj === 'object' && pathObj !== null) {
        for (const [methodStr, methodObj] of Object.entries(pathObj)) {
          // Only process HTTP methods
          if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(methodStr.toLowerCase())) {
            routes.push({
              path: pathStr,
              method: methodStr.toUpperCase(),
              ...(methodObj as any),
            })
          }
        }
      }
    }
  }

  // 3. Extract resolved schemas
  const schemas: Record<string, OpenApiSchema> = {}
  if (resolvedSpec.components?.schemas) {
    for (const [name, schema] of Object.entries(resolvedSpec.components.schemas)) {
      schemas[name] = schema as OpenApiSchema
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
