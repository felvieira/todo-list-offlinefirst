import { test, expect } from '@playwright/test'
import { login, createTodo, deleteTodo, toggleTodo, goOffline, goOnline, waitForSync, selectors } from './helpers'

test.describe('Tarefas - Modo Offline', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste (online)
    await login(page)
  })

  test('deve criar e deletar uma tarefa no modo offline', async ({ page }) => {
    const taskTitle = `Tarefa Offline - ${Date.now()}`

    // Simular modo offline
    await goOffline(page)

    // Criar tarefa offline
    await createTodo(page, taskTitle)

    // Verificar que a tarefa foi criada localmente
    await expect(
      page.locator(selectors.todos.todoItem(taskTitle))
    ).toBeVisible({ timeout: 5000 })

    // Deletar tarefa offline
    await deleteTodo(page, taskTitle)

    // Verificar que a tarefa foi deletada localmente
    await expect(
      page.locator(selectors.todos.todoItem(taskTitle))
    ).not.toBeVisible({ timeout: 5000 })

    // Voltar online para limpar o teste
    await goOnline(page)
  })
})
