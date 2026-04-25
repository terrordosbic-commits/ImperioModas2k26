// ============================================
// AUTENTICAÇÃO DE CLIENTE (localStorage)
// Sistema simples para usuários comuns
// ============================================

export interface UserAccount {
  id: string
  nome: string
  email: string
  telefone?: string
  createdAt: string
}

const USER_KEY = 'imperio-user'

export function getCurrentUser(): UserAccount | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(USER_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored) as UserAccount
    } catch {
      return null
    }
  } catch {
    // Safari modo privado pode lançar exceção ao acessar localStorage
    return null
  }
}

export function setCurrentUser(user: UserAccount): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // Safari modo privado pode lançar exceção ao gravar localStorage
  }
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(USER_KEY)
  } catch {
    // Safari modo privado pode lançar exceção ao acessar localStorage
  }
}

function generateUUID(): string {
  // Fallback robusto para navegadores sem crypto.randomUUID (Safari antigo)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Polyfill baseado em timestamp + random
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function createUserAccount(data: { nome: string; email: string; telefone?: string }): UserAccount {
  const user: UserAccount = {
    id: generateUUID(),
    nome: data.nome,
    email: data.email,
    telefone: data.telefone,
    createdAt: new Date().toISOString(),
  }
  setCurrentUser(user)
  return user
}

export function isUserLoggedIn(): boolean {
  return getCurrentUser() !== null
}

