import { authenticate, expect, hideCookieBanner, test } from './fixtures'

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const

for (const viewport of viewports) {
  test(`regressão visual da home em ${viewport.name}`, async ({
    context,
    page,
  }) => {
    await hideCookieBanner(context)
    await page.setViewportSize(viewport)
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.addStyleTag({
      content: 'nextjs-portal { display: none !important; }',
    })
    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`)
  })

  test(`regressão visual do checkout em ${viewport.name}`, async ({
    context,
    page,
  }) => {
    await authenticate(context)
    await hideCookieBanner(context)
    await page.setViewportSize(viewport)
    await page.goto('/checkout')

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Finalize seu ingresso no clube',
      }),
    ).toBeVisible()
    await expect(page.getByText('Identificação do assinante')).toBeVisible()
    await page.addStyleTag({
      content: 'nextjs-portal { display: none !important; }',
    })
    await expect(page).toHaveScreenshot(`checkout-${viewport.name}.png`)
  })
}
