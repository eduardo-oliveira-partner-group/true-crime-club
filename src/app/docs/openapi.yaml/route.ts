import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export function GET() {
  const filePath = path.join(process.cwd(), 'docs/openapi.yaml')
  const content = fs.readFileSync(filePath, 'utf8')

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'application/yaml; charset=utf-8',
      'Content-Disposition': 'attachment; filename="openapi.yaml"',
    },
  })
}
