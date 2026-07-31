import { expect, test } from './fixtures'

test.describe('jornada pública', () => {
  test('visitante abre a home, a loja e o detalhe de um produto', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /Um único caso.+Doze caixas.+Um ano de investigação/i,
      }),
    ).toBeVisible()

    await page.goto('/loja')

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Arquivos abertos para colecionadores.',
      }),
    ).toBeVisible()
    await expect(
      page
        .getByRole('heading', {
          name: 'Box 10 — Arquivo Copa do Mundo',
        })
        .first(),
    ).toBeVisible()

    await page.locator('a[href="/loja/edicao-copa-do-mundo"]').first().click()

    await expect(page).toHaveURL(/\/loja\/edicao-copa-do-mundo$/)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Box 10 — Arquivo Copa do Mundo',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Adicionar ao carrinho' }).first(),
    ).toBeVisible()
  })

  test('loja apresenta o estado de erro controlado', async ({ page }) => {
    await page.goto('/loja?simularErroApi=true')

    await expect(
      page.getByRole('heading', { name: 'Não foi possível abrir a loja' }),
    ).toBeVisible()
    await expect(
      page.getByText('Catálogo temporariamente fechado'),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Tentar novamente/i }),
    ).toBeVisible()
  })
})
