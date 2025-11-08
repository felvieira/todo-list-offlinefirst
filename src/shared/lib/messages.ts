/**
 * Centralized messages for the application
 * All user-facing messages (toasts, errors, success) are defined here
 * This makes it easy to maintain consistency and enable future i18n
 */

export const MESSAGES = {
  // Todo Operations - Success
  TODO_CREATED_AND_SYNCED: 'Tarefa criada e sincronizada!',
  TODO_SAVED_LOCALLY: 'Tarefa salva localmente',
  TODO_DELETED_SUCCESS: 'Tarefa excluída com sucesso!',
  TODO_DELETED_LOCALLY: 'Tarefa excluída localmente',
  TODO_UPDATED_LOCALLY: 'Alteração salva localmente',

  // Todo Operations - Errors
  TODO_CREATE_ERROR: 'Erro ao criar tarefa',
  TODO_UPDATE_ERROR: 'Erro ao atualizar tarefa',
  TODO_DELETE_ERROR: 'Erro ao excluir tarefa',

  // Sync Messages
  SYNC_SUCCESS_SINGULAR: 'tarefa sincronizada',
  SYNC_SUCCESS_PLURAL: 'tarefas sincronizadas',
  SYNC_SUCCESS_SUFFIX: 'com sucesso!',
  SYNC_ERROR: 'Erro ao sincronizar algumas tarefas. Tentaremos novamente.',

  // Sync Descriptions
  SYNC_WHEN_ONLINE: 'Será sincronizada quando voltar online',
  SYNC_ERROR_DESCRIPTION: 'Erro ao sincronizar',

  // Sync Indicator Labels
  SYNC_STATUS_SYNCING: 'Sincronizando...',
  SYNC_STATUS_OFFLINE: 'Offline',
  SYNC_STATUS_SYNCED: 'Sincronizado',

  // Auth Messages
  AUTH_LOGIN_SUCCESS: 'Login realizado com sucesso!',
  AUTH_LOGIN_OFFLINE: 'Login offline realizado!',
  AUTH_LOGIN_OFFLINE_DESC: 'Suas tarefas serão sincronizadas quando voltar online',
  AUTH_LOGIN_ERROR: 'Erro ao fazer login',
  AUTH_SIGNUP_SUCCESS: 'Conta criada com sucesso!',
  AUTH_SIGNUP_ERROR: 'Erro ao criar conta',
  AUTH_LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  AUTH_INVALID_CREDENTIALS: 'Email ou senha inválidos',
  AUTH_EMAIL_NOT_CONFIRMED: 'Confirme seu email antes de fazer login',
  AUTH_OFFLINE_EXPIRED: 'Credenciais offline expiraram',
  AUTH_OFFLINE_EXPIRED_DESC: 'Conecte-se à internet para fazer login novamente',
  AUTH_NO_OFFLINE_CACHE: 'Login offline indisponível',
  AUTH_NO_OFFLINE_CACHE_DESC: 'Faça login online pelo menos uma vez primeiro',

  // Generic Messages
  GENERIC_ERROR: 'Ocorreu um erro. Tente novamente.',
  GENERIC_SUCCESS: 'Operação realizada com sucesso!',
} as const

/**
 * Helper function to format sync success message
 * @param count Number of tasks synced
 * @returns Formatted message
 */
export function getSyncSuccessMessage(count: number): string {
  const taskWord = count === 1
    ? MESSAGES.SYNC_SUCCESS_SINGULAR
    : MESSAGES.SYNC_SUCCESS_PLURAL
  return `${count} ${taskWord} ${MESSAGES.SYNC_SUCCESS_SUFFIX}`
}

/**
 * Helper function to get appropriate description based on online status
 * @param isOnline Whether user is online
 * @returns Description for toast
 */
export function getSyncDescription(isOnline: boolean): string {
  return isOnline
    ? MESSAGES.SYNC_ERROR_DESCRIPTION
    : MESSAGES.SYNC_WHEN_ONLINE
}
