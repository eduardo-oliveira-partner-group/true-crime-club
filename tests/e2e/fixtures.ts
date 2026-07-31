import {
  type APIRequestContext,
  type BrowserContext,
  expect,
  test as base,
} from '@playwright/test'

export const MOCK_API_URL = 'http://127.0.0.1:4100'

type Fixtures = {
  resetMockApi: void
}

export const test = base.extend<Fixtures>({
  resetMockApi: [
    async ({ request }, use) => {
      const response = await request.post(`${MOCK_API_URL}/__test/reset`)
      expect(response.ok()).toBe(true)
      await use()
    },
    { auto: true },
  ],
})

export { expect }

export async function authenticate(context: BrowserContext) {
  await context.addCookies([
    {
      name: 'tcc_test_session',
      value: 'authenticated',
      domain: '127.0.0.1',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ])
}

export async function readMockApiState(request: APIRequestContext) {
  const response = await request.get(`${MOCK_API_URL}/__test/state`)
  expect(response.ok()).toBe(true)
  return response.json() as Promise<{
    cart: {
      itens: Array<{ id: string; quantidade: number }>
    }
    orderCreateCalls: number
    orders: Array<{ id: string }>
  }>
}

export async function hideCookieBanner(context: BrowserContext) {
  await context.addInitScript(() => {
    window.localStorage.setItem('tcc:cookie-consent', 'accepted')
  })
}
