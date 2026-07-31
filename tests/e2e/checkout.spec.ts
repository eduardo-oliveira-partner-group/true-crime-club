import { authenticate, expect, readMockApiState, test } from './fixtures'

test.describe('checkout', () => {
  test('checkout sem sessão redireciona para login', async ({ page }) => {
    await page.goto('/checkout')

    await expect(page).toHaveURL(/\/login\?next=%2Fcheckout$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Entrar no arquivo' }),
    ).toBeVisible()
  })

  test('finaliza o pedido uma única vez e abre a confirmação', async ({
    context,
    page,
    request,
  }) => {
    await authenticate(context)
    await page.goto('/checkout')

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Finalize seu ingresso no clube',
      }),
    ).toBeVisible()
    await expect(page.getByText('Identificação do assinante')).toBeVisible()

    await page.getByRole('button', { name: 'Avançar' }).click()
    await expect(page.getByText('Endereço de entrega')).toBeVisible()

    await page.getByRole('button', { name: 'Avançar' }).click()
    await expect(page.getByText('Escolha a forma de envio')).toBeVisible()
    await expect(page.getByText('Entrega padrão')).toBeVisible()

    await page.getByRole('button', { name: 'Avançar' }).click()
    await expect(page.getByText('Visa •••• 4242')).toBeVisible()

    await page.getByRole('button', { name: 'Avançar' }).click()
    await expect(page.getByText('Preferências da caixa')).toBeVisible()

    await page.getByRole('button', { name: 'Avançar' }).click()
    await expect(page.getByText('Revisão final')).toBeVisible()

    await page.getByRole('button', { name: 'Finalizar pedido' }).click()

    await expect(page).toHaveURL(/\/checkout\/confirmacao\?pedido=order-001$/)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'O dossiê do seu pedido foi lacrado.',
      }),
    ).toBeVisible()
    await expect(
      page.getByText('TCC-2026-0001', { exact: true }).first(),
    ).toBeVisible()

    const state = await readMockApiState(request)
    expect(state.orderCreateCalls).toBe(1)
    expect(state.orders).toHaveLength(1)
  })
})
