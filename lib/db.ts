import { promises as fs } from 'fs'
import path from 'path'
import type { Order, User } from './types'

// ============================================
// SUPABASE CONFIGURATION
// ============================================
let supabase: import('@supabase/supabase-js').SupabaseClient | null = null

function getSupabase() {
  if (supabase) return supabase
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (url && key) {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(url, key)
    return supabase
  }
  return null
}

function isSupabaseEnabled(): boolean {
  return !!process.env.SUPABASE_URL && !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
}

// ============================================
// JSON FILESYSTEM FALLBACK (local dev)
// ============================================

const DATA_DIR = path.join(process.cwd(), 'data')

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {
    // Directory already exists
  }
}

async function readJson<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data) as T
  } catch {
    return defaultValue
  }
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  try {
    await ensureDir()
    const filePath = path.join(DATA_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    console.warn('[DB] Falha ao escrever arquivo local (filesystem pode ser read-only):', err)
  }
}

// ============================================
// ORDERS
// ============================================

export async function getOrders(): Promise<Order[]> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('[Supabase] getOrders error:', error)
      return []
    }
    return (data || []).map(mapOrderFromDb)
  }
  return readJson<Order[]>('orders.json', [])
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('orders').select('*').eq('id', id).single()
    if (error || !data) return undefined
    return mapOrderFromDb(data)
  }
  const orders = await readJson<Order[]>('orders.json', [])
  return orders.find((o) => o.id === id)
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  const sb = getSupabase()
  const now = new Date().toISOString()

  if (sb) {
    const { data, error } = await sb
      .from('orders')
      .insert({
        customer: order.customer,
        items: order.items,
        total: order.total,
        status: 'pendente',
        created_at: now,
      })
      .select()
      .single()

    if (error) {
      console.error('[Supabase] createOrder error:', error)
      throw new Error('Erro ao criar pedido no banco de dados')
    }
    return mapOrderFromDb(data)
  }

  // Fallback local
  const orders = await readJson<Order[]>('orders.json', [])
  const newOrder: Order = {
    ...order,
    id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
    createdAt: now,
    status: 'pendente',
  }
  orders.push(newOrder)
  await writeJson('orders.json', orders)
  return newOrder
}

export async function updateOrderStatus(id: number, status: Order['status']): Promise<Order | null> {
  const sb = getSupabase()

  if (sb) {
    const { data, error } = await sb.from('orders').update({ status }).eq('id', id).select().single()
    if (error || !data) return null
    return mapOrderFromDb(data)
  }

  const orders = await readJson<Order[]>('orders.json', [])
  const index = orders.findIndex((o) => o.id === id)
  if (index === -1) return null
  orders[index].status = status
  await writeJson('orders.json', orders)
  return orders[index]
}

// ============================================
// USERS
// ============================================

export async function getUsers(): Promise<User[]> {
  const sb = getSupabase()

  if (sb) {
    const { data, error } = await sb.from('users').select('*')
    if (error) {
      console.error('[Supabase] getUsers error:', error)
      return []
    }
    return (data || []).map(mapUserFromDb)
  }

  const defaultUsers: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@imperiomodas.com',
      role: 'admin',
      passwordHash: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu8V2', // admin123
      createdAt: new Date().toISOString(),
    },
  ]
  return readJson<User[]>('users.json', defaultUsers)
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const sb = getSupabase()

  if (sb) {
    const { data, error } = await sb.from('users').select('*').eq('username', username).single()
    if (error || !data) return undefined
    return mapUserFromDb(data)
  }

  const users = await readJson<User[]>('users.json', [])
  return users.find((u) => u.username === username)
}

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const sb = getSupabase()
  const now = new Date().toISOString()

  if (sb) {
    const { data, error } = await sb
      .from('users')
      .insert({
        username: user.username,
        email: user.email,
        role: user.role,
        password_hash: user.passwordHash,
        created_at: now,
      })
      .select()
      .single()

    if (error) {
      console.error('[Supabase] createUser error:', error)
      throw new Error('Erro ao criar usuario no banco de dados')
    }
    return mapUserFromDb(data)
  }

  const users = await readJson<User[]>('users.json', [])
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    createdAt: now,
  }
  users.push(newUser)
  await writeJson('users.json', users)
  return newUser
}

// ============================================
// DB MAPPERS
// ============================================

function mapOrderFromDb(row: Record<string, unknown>): Order {
  return {
    id: row.id as number,
    createdAt: row.created_at as string,
    customer: row.customer as Order['customer'],
    items: row.items as Order['items'],
    total: row.total as number,
    status: row.status as Order['status'],
  }
}

function mapUserFromDb(row: Record<string, unknown>): User {
  return {
    id: row.id as number,
    username: row.username as string,
    email: row.email as string,
    role: row.role as User['role'],
    passwordHash: row.password_hash as string | undefined,
    createdAt: row.created_at as string,
  }
}

