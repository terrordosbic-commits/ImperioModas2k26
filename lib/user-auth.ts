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
  const stored = localStorage.getItem(USER_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as UserAccount
  } catch {
    return null
  }
}

export function setCurrentUser(user: UserAccount): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
}

export function createUserAccount(data: { nome: string; email: string; telefone?: string }): UserAccount {
  const user: UserAccount = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
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

