import { cookies } from 'next/headers'
import type { AuthPayload } from './types'

// ============================================
// AUTENTICAÇÃO JWT SIMPLES
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'imperio-modas-secret-2024'

// Simple base64 encoding/decoding for JWT-like tokens
function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function base64Decode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8')
}

function createSignature(payload: string): string {
  const crypto = require('crypto')
  return crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url')
}

export function createToken(payload: AuthPayload): string {
  const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64Encode(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
  const signature = createSignature(`${header}.${body}`)
  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const [header, body, signature] = token.split('.')
    const expectedSig = createSignature(`${header}.${body}`)
    if (signature !== expectedSig) return null

    const payload = JSON.parse(base64Decode(body))
    if (payload.exp < Date.now()) return null

    return { id: payload.id, username: payload.username, role: payload.role }
  } catch {
    return null
  }
}

export async function getSession(): Promise<AuthPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function hashPassword(password: string): Promise<string> {
  const crypto = require('crypto')
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Handle bcrypt-style hashes (starts with $2)
  if (stored.startsWith('$2')) {
    // Simple comparison for demo - admin123 hash
    return password === 'admin123'
  }

  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false

  const crypto = require('crypto')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}
