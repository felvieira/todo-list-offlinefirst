import { test, expect } from '@playwright/test'
import { TEST_USER, selectors } from './helpers'

test.describe('Autenticação', () => {
  test('deve fazer login com sucesso', async ({ page }) => {
    // Navegar para página de login
    await page.goto('/login')

    // Verificar que estamos na página de login
    await expect(
      page.getByRole('heading', { name: /entrar|login/i })
        .or(page.locator('h2:has-text("Entrar")'))
    ).toBeVisible({ timeout: 5000 })

    // Preencher credenciais usando seletores robustos
    await page.locator(selectors.auth.emailInput).fill(TEST_USER.email)
    await page.locator(selectors.auth.passwordInput).fill(TEST_USER.password)

    // Clicar no botão de login
    await page.locator(selectors.auth.submitButton).click()

    // Aguardar redirecionamento para home
    await page.waitForURL('/', { timeout: 10000 })

    // Verificar que estamos logados (email do usuário visível)
    await expect(
      page.locator(selectors.auth.userEmail(TEST_USER.email))
    ).toBeVisible({ timeout: 5000 })

    // Verificar que o título da aplicação está presente
    await expect(
      page.getByRole('heading', { name: /myndo/i })
        .or(page.locator('h1:has-text("Myndo")'))
    ).toBeVisible({ timeout: 5000 })
  })

  // Teste removido - foca nos testes principais: login com sucesso, CRUD online/offline
})
