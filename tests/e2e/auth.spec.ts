import { expect, test } from './fixtures'

test.describe('autenticação', () => {
  test('rota protegida redireciona para login preservando o destino', async ({
    page,
  }) => {
    await page.goto('/cliente/perfil')

    await expect(page).toHaveURL(/\/login\?next=%2Fcliente%2Fperfil$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Entrar no arquivo' }),
    ).toBeVisible()
  })

  test('login inválido apresenta a mensagem devolvida pela API', async ({
    page,
  }) => {
    await page.goto('/login')

    await page.getByLabel('E-mail').fill('investigador@truecrime.test')
    await page.getByLabel('Senha').fill('senha-incorreta')
    await page.getByRole('button', { name: 'Entrar no clube' }).click()

    await expect(
      page.getByText('E-mail ou senha inválidos.', { exact: true }).first(),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })
})
