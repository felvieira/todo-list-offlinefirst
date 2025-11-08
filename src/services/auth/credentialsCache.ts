/**
 * Secure Credentials Cache Service
 * Allows offline login after first successful online login
 *
 * Security features:
 * - SHA-256 password hashing (one-way)
 * - Cache expiration (30 days without online validation)
 * - Never stores plain-text passwords
 */

interface CachedCredentials {
  email: string
  passwordHash: string
  lastValidated: number // timestamp
  userId?: string
}

const CACHE_EXPIRY_DAYS = 30

/**
 * Generate SHA-256 hash of password
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Cache credentials after successful online login
 */
export async function cacheCredentials(
  email: string,
  password: string,
  userId?: string
): Promise<void> {
  const passwordHash = await hashPassword(password)

  // Store in IndexedDB using a separate table
  const cached: CachedCredentials = {
    email: email.toLowerCase(),
    passwordHash,
    lastValidated: Date.now(),
    userId
  }

  // For now, store in localStorage (could be moved to IndexedDB)
  localStorage.setItem('auth_cache', JSON.stringify(cached))
}

/**
 * Verify credentials against cache (offline login)
 */
export async function verifyCachedCredentials(
  email: string,
  password: string
): Promise<{ valid: boolean; userId?: string; expired: boolean }> {
  try {
    const cacheStr = localStorage.getItem('auth_cache')
    if (!cacheStr) {
      return { valid: false, expired: false }
    }

    const cached: CachedCredentials = JSON.parse(cacheStr)

    // Check if email matches
    if (cached.email !== email.toLowerCase()) {
      return { valid: false, expired: false }
    }

    // Check expiration (30 days)
    const daysSinceValidation = (Date.now() - cached.lastValidated) / (1000 * 60 * 60 * 24)
    if (daysSinceValidation > CACHE_EXPIRY_DAYS) {
      return { valid: false, expired: true }
    }

    // Verify password hash
    const inputHash = await hashPassword(password)
    const valid = inputHash === cached.passwordHash

    return { valid, userId: cached.userId, expired: false }
  } catch (error) {
    console.error('Error verifying cached credentials:', error)
    return { valid: false, expired: false }
  }
}

/**
 * Update last validation timestamp (called after successful online login)
 */
export async function updateCacheValidation(): Promise<void> {
  try {
    const cacheStr = localStorage.getItem('auth_cache')
    if (!cacheStr) return

    const cached: CachedCredentials = JSON.parse(cacheStr)
    cached.lastValidated = Date.now()

    localStorage.setItem('auth_cache', JSON.stringify(cached))
  } catch (error) {
    console.error('Error updating cache validation:', error)
  }
}

/**
 * Clear cached credentials (on logout)
 */
export function clearCachedCredentials(): void {
  localStorage.removeItem('auth_cache')
}

/**
 * Check if credentials are cached for email
 */
export function hasCachedCredentials(email: string): boolean {
  try {
    const cacheStr = localStorage.getItem('auth_cache')
    if (!cacheStr) return false

    const cached: CachedCredentials = JSON.parse(cacheStr)
    return cached.email === email.toLowerCase()
  } catch {
    return false
  }
}

/**
 * Save offline session to localStorage
 */
export function saveOfflineSession(email: string, userId: string): void {
  const offlineSession = {
    email,
    userId,
    isOffline: true,
    timestamp: Date.now()
  }
  localStorage.setItem('offline_session', JSON.stringify(offlineSession))
}

/**
 * Get offline session from localStorage
 */
export function getOfflineSession(): { email: string; userId: string } | null {
  try {
    const sessionStr = localStorage.getItem('offline_session')
    if (!sessionStr) return null

    const session = JSON.parse(sessionStr)

    // Validate session hasn't expired (30 days)
    const daysSinceLogin = (Date.now() - session.timestamp) / (1000 * 60 * 60 * 24)
    if (daysSinceLogin > CACHE_EXPIRY_DAYS) {
      clearOfflineSession()
      return null
    }

    return { email: session.email, userId: session.userId }
  } catch {
    return null
  }
}

/**
 * Clear offline session
 */
export function clearOfflineSession(): void {
  localStorage.removeItem('offline_session')
}
