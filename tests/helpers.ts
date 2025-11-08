import { Page, expect } from '@playwright/test'

export const TEST_USER = {
  email: 'teste@teste.com',
  password: '1q2w3e'
}

// Page Object Model - Selectors centralizados
export const selectors = {
  auth: {
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    submitButton: 'button[type="submit"]',
    userEmail: (email: string) => `text=${email}`
  },
  todos: {
    newTodoInput: 'input[placeholder="Digite sua tarefa..."]',
    todoItem: (title: string) => `text=${title}`,
    deleteButton: 'button',
    confirmDeleteButton: 'button:has-text("Excluir")',
    checkbox: 'input[type="checkbox"]'
  },
  status: {
    offline: 'button:has-text("Offline")',
    online: 'button:has-text("Online")'
  }
}

/**
 * Login helper - Melhorado com práticas do MCP Playwright
 */
export async function login(page: Page) {
  await page.goto('/login')

  // Preencher campos usando seletores robustos
  await page.locator(selectors.auth.emailInput).fill(TEST_USER.email)
  await page.locator(selectors.auth.passwordInput).fill(TEST_USER.password)

  // Clicar no botão de submit
  await page.locator(selectors.auth.submitButton).click()

  // Aguardar redirecionamento para home page
  await page.waitForURL('/', { timeout: 10000 })

  // Verificar que estamos logados
  await expect(page.locator(selectors.auth.userEmail(TEST_USER.email))).toBeVisible({
    timeout: 5000
  })
}

/**
 * Create a todo - Melhorado com práticas do MCP Playwright
 */
export async function createTodo(page: Page, title: string) {
  // Localizar o campo de input usando seletor robusto
  const input = page.locator(selectors.todos.newTodoInput).first()

  // Preencher e enviar
  await input.fill(title)
  await input.press('Enter')

  // Aguardar que a tarefa apareça na lista
  await expect(page.locator(selectors.todos.todoItem(title))).toBeVisible({
    timeout: 10000
  })
}

/**
 * Delete a todo by title - Melhorado com práticas do MCP Playwright
 */
export async function deleteTodo(page: Page, title: string) {
  // Encontrar o container da tarefa
  // Busca pelo texto e sobe até encontrar o container com botões
  const todoItem = page.locator(`text=${title}`).locator('xpath=ancestor::*[.//button][1]')

  // Fazer hover para mostrar o botão de deletar
  await todoItem.hover()

  // Clicar no botão de deletar (último botão do item)
  const deleteButton = todoItem.locator(selectors.todos.deleteButton).last()
  await deleteButton.click()

  // Confirmar a deleção no dialog
  await page.locator(selectors.todos.confirmDeleteButton).click()

  // Aguardar o dialog fechar primeiro (a mensagem de confirmação contém o título)
  await expect(page.locator(selectors.todos.confirmDeleteButton)).not.toBeVisible({
    timeout: 5000
  })

  // Aguardar que a tarefa desapareça da lista
  await expect(page.getByRole('heading', { name: title })).not.toBeVisible({
    timeout: 10000
  })
}

/**
 * Go offline - Melhorado com práticas do MCP Playwright
 * Remove waitForTimeout antipadrão
 */
export async function goOffline(page: Page) {
  await page.context().setOffline(true)

  // Aguardar indicador de offline aparecer
  await expect(
    page.locator(selectors.status.offline).first()
  ).toBeVisible({ timeout: 5000 })
}

/**
 * Go online - Melhorado com práticas do MCP Playwright
 * Remove waitForTimeout antipadrão
 */
export async function goOnline(page: Page) {
  await page.context().setOffline(false)

  // Aguardar indicador de offline desaparecer
  await expect(
    page.locator(selectors.status.offline).first()
  ).not.toBeVisible({ timeout: 5000 })
}

/**
 * Aguardar sincronização completar
 */
export async function waitForSync(page: Page) {
  // Aguardar indicador de sincronização aparecer e desaparecer
  const syncIndicator = page.getByText(/sincronizando|syncing/i)
    .or(page.locator('[data-syncing="true"]'))

  // Se o indicador aparecer, aguardar desaparecer
  try {
    await syncIndicator.waitFor({ state: 'visible', timeout: 1000 })
    await syncIndicator.waitFor({ state: 'hidden', timeout: 10000 })
  } catch {
    // Indicador não apareceu, sincronização já completou
  }
}

/**
 * Toggle todo completion
 */
export async function toggleTodo(page: Page, title: string) {
  const todoItem = page.locator(`text=${title}`).locator('xpath=ancestor::*[.//input[@type="checkbox"]][1]')
  const checkbox = todoItem.locator(selectors.todos.checkbox).first()
  await checkbox.click()
}
