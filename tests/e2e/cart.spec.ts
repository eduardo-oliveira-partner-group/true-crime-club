import { authenticate, expect, readMockApiState, test } from './fixtures'

test.describe('carrinho autenticado', () => {
  test.beforeEach(async ({ context }) => {
    await authenticate(context)
  })

  test('adiciona um produto pelo detalhe', async ({ page, request }) => {
    await page.goto('/loja/edicao-copa-do-mundo')

    await page
      .getByRole('button', { name: 'Adicionar ao carrinho' })
      .first()
      .click()

    await expect(
      page.getByRole('button', { name: 'Adicionado!' }).first(),
    ).toBeVisible()

    const state = await readMockApiState(request)
    expect(state.cart.itens[0]?.quantidade).toBe(2)
  })

  test('visualiza, altera a quantidade e remove o item', async ({ page }) => {
    await page.goto('/carrinho')

    await expect(
      page.getByRole('heading', { level: 1, name: 'Seu carrinho' }),
    ).toBeVisible()
    await expect(page.getByText('Box 10 — Arquivo Copa do Mundo')).toBeVisible()

    const increaseButton = page.getByRole('button', {
      name: 'Aumentar quantidade',
    })
    const quantityControl = increaseButton.locator('..').locator('..')
    await increaseButton.click()
    await expect(quantityControl.getByText('2', { exact: true })).toBeVisible()

    await page
      .locator('button:visible')
      .filter({ hasText: /^Remover$/ })
      .first()
      .click()
    await expect(
      page.getByRole('heading', { name: 'Remover item?' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Remover item' }).click()

    await expect(
      page.getByText('Nenhuma evidência selecionada ainda.'),
    ).toBeVisible()
  })
})
