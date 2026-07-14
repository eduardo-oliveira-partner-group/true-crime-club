import { cookies } from 'next/headers'

export async function getCookieToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get('tcc_session')?.value || null
  } catch {
    return null
  }
}
