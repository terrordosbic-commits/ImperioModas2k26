// ============================================
// TIPOS DO E-COMMERCE IMPÉRIO MODAS
// ============================================

export interface Product {
  id: number
  nome: string
  cat: Category
  preco: number
  img: string
  descricao?: string
  isBestSeller?: boolean
  isNew?: boolean
}

export type Category = 'conjuntos' | 'camisas' | 'tenis' | 'calcas' | 'bermudas' | 'vestidos' | 'moletons' | 'acessorios'

export const CATEGORY_LABELS: Record<Category, string> = {
  conjuntos: 'Conjuntos',
  camisas: 'Camisas',
  tenis: 'Tênis',
  calcas: 'Calças',
  bermudas: 'Bermudas',
  vestidos: 'Vestidos',
  moletons: 'Moletons',
  acessorios: 'Acessórios',
}

export const CATEGORY_PRICES: Record<Category, number> = {
  conjuntos: 120,
  camisas: 50,
  calcas: 80,
  tenis: 100,
  bermudas: 70,
  vestidos: 100,
  moletons: 120,
  acessorios: 40,
}

export interface CartItem extends Product {
  qtd: number
}

export interface Customer {
  cpf: string
  nomeCompleto: string
  email?: string
  telefone?: string
  endereco: string
  rua: string
  numeroCasa: string
  referencia: string
  bairro?: string
  cidade?: string
}

export interface OrderItem {
  id: number
  nome: string
  qtd: number
  preco: number
}

export interface Order {
  id: number
  createdAt: string
  customer: Customer
  items: OrderItem[]
  total: number
  status: OrderStatus
}

export type OrderStatus = 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  passwordHash?: string
  createdAt: string
}

export interface AuthPayload {
  id: number
  username: string
  role: 'admin' | 'user'
}

export interface ApiResponse<T = unknown> {
  ok: boolean
  data?: T
  error?: string
}

// ============================================
// CONFIGURAÇÃO DO AGENTE IA
// ============================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface BotConfig {
  enabled: boolean
  tone: 'formal' | 'friendly' | 'salesy'
  systemPrompt: string
  fallbackMessage: string
  maxHistory: number
}
