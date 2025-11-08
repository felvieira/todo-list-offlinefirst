import { test, expect } from '@playwright/test'
import { login, createTodo, deleteTodo, toggleTodo, waitForSync, selectors } from './helpers'

test.describe('Tarefas - Modo Online', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await login(page)
  })

  test('deve criar e deletar uma tarefa no modo online', async ({ page }) => {
    const taskTitle = `Tarefa Online - ${Date.now()}`

    // Criar tarefa
    await createTodo(page, taskTitle)

    // Verificar que a tarefa foi criada
    await expect(
      page.locator(selectors.todos.todoItem(taskTitle))
    ).toBeVisible({ timeout: 5000 })

    // Deletar tarefa
    await deleteTodo(page, taskTitle)

    // Verificar que a tarefa foi deletada
    await expect(
      page.locator(selectors.todos.todoItem(taskTitle))
    ).not.toBeVisible({ timeout: 5000 })
  })
})
