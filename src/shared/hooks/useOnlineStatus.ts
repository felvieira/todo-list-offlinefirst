import { useOnline } from './useOnline'

/**
 * Hook that returns the online status of the browser
 * Alias for useOnline for better semantics
 */
export function useOnlineStatus() {
  return useOnline()
}
