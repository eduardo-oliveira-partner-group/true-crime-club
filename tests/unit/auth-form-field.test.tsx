import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AuthFormField } from '@/src/components/public-design/auth-form'

describe('AuthFormField', () => {
  it('associa label, obrigatoriedade e mensagem de erro ao campo', () => {
    render(
      <AuthFormField
        id="email"
        label="E-mail"
        type="email"
        error="E-mail inválido."
        required
      />,
    )

    const field = screen.getByRole('textbox', { name: /E-mail/ })
    const error = screen.getByText('E-mail inválido.')

    expect(field).toBeRequired()
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('E-mail inválido.')
    expect(error).toHaveAttribute('id', 'email-error')
  })
})
