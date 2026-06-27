import { NextResponse } from 'next/server'

import {
  getActiveCase,
  getSubscriberProgress,
  listClues,
} from '@/src/lib/domain/repositories'

export async function GET() {
  const activeCase = getActiveCase()
  const clues = listClues()
  const progress = getSubscriberProgress()
  return NextResponse.json({ activeCase, clues, progress })
}
