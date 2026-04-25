'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  ShoppingCart,
  Clock,
  LogOut,
  RefreshCw,
  Home,
  CheckCircle,
  Truck,
  XCircle,
  Bot,
  MessageSquare,
  Save,
  Trash2,
  Power,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import type { Order, OrderStatus, AuthPayload, ChatSession, BotConfig } from '@/lib/types'
import { ORDER_STATUS_LABELS } from '@/lib/types'
import { getBotConfig, saveBotConfig, getChatHistory, clearChatHistory, DEFAULT_BOT_CONFIG } from '@/lib/bot-config'

interface AdminDashboardProps {
  user: AuthPayload
}

const statusIcons: Record<OrderStatus, typeof Clock> = {
  pendente: Clock,
  confirmado: CheckCircle,
  enviado: Truck,
  entregue: CheckCircle,
  cancelado: XCircle,
}

const statusColors: Record<OrderStatus, string> = {
  pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  confirmado: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  enviado: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  entregue: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')

  // Bot config state
  const [botConfig, setBotConfig] = useState<BotConfig>(DEFAULT_BOT_CONFIG)
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const result = await response.json()
      if (result.ok) {
        setOrders(result.orders)
      }
    } catch {
      toast.error('Erro ao carregar pedidos')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    setBotConfig(getBotConfig())
    setChatHistory(getChatHistory())
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchOrders()
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const result = await response.json()
      if (result.ok) {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
        toast.success('Status atualizado')
      } else {
        throw new Error(result.error)
      }
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleSaveBotConfig = () => {
    saveBotConfig(botConfig)
    toast.success('Configuração do agente salva!')
  }

  const handleClearHistory = () => {
    clearChatHistory()
    setChatHistory([])
    toast.success('Histórico de conversas limpo')
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const totalRevenue = orders.filter((o) => o.status !== 'cancelado').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pendente').length
  const todayOrders = orders.filter((o) => {
    const today = new Date().toDateString()
    return new Date(o.createdAt).toDateString() === today
  }).length

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Badge variant="secondary">{user.username}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Ver Loja
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="orders">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="bot">
              <Bot className="mr-2 h-4 w-4" />
              Agente IA
            </TabsTrigger>
          </TabsList>

          {/* Aba Pedidos */}
          <TabsContent value="orders" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">Excluindo cancelados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">Todos os pedidos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayOrders}</div>
                  <p className="text-xs text-muted-foreground">Novos pedidos</p>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pedidos</CardTitle>
                  <CardDescription>Gerencie os pedidos da loja</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">Nenhum pedido encontrado</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const StatusIcon = statusIcons[order.status]
                      return (
                        <div key={order.id} className="rounded-lg border p-4">
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Pedido #{order.id}</span>
                                <Badge className={statusColors[order.status]}>
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {ORDER_STATUS_LABELS[order.status]}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-bold">{formatPrice(order.total)}</span>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="mb-2 font-medium">Cliente</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p><strong>Nome:</strong> {order.customer.nomeCompleto}</p>
                                <p><strong>CPF:</strong> {order.customer.cpf}</p>
                                {order.customer.telefone && <p><strong>Telefone:</strong> {order.customer.telefone}</p>}
                                {order.customer.email && <p><strong>Email:</strong> {order.customer.email}</p>}
                              </div>
                            </div>
                            <div>
                              <h4 className="mb-2 font-medium">Endereço</h4>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>{order.customer.rua}, {order.customer.numeroCasa}</p>
                                <p>{order.customer.endereco}</p>
                                {order.customer.cidade && <p>{order.customer.cidade}</p>}
                                <p><strong>Ref:</strong> {order.customer.referencia}</p>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div>
                            <h4 className="mb-2 font-medium">Itens ({order.items.length})</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.qtd}x {item.nome}</span>
                                  <span className="font-medium">{formatPrice(item.preco * item.qtd)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Agente IA */}
          <TabsContent value="bot" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Configurações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Configurações do Agente
                  </CardTitle>
                  <CardDescription>Personalize o comportamento do assistente virtual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ativar/Desativar */}
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="bot-enabled" className="text-base">Status do Agente</Label>
                      <p className="text-sm text-muted-foreground">
                        {botConfig.enabled ? 'Agente ativo e respondendo clientes' : 'Agente desativado'}
                      </p>
                    </div>
                    <Switch
                      id="bot-enabled"
                      checked={botConfig.enabled}
                      onCheckedChange={(checked) => setBotConfig((p) => ({ ...p, enabled: checked }))}
                    />
                  </div>

                  {/* Tom de voz */}
                  <div className="space-y-2">
                    <Label>Tom de voz</Label>
                    <Select
                      value={botConfig.tone}
                      onValueChange={(value) =>
                        setBotConfig((p) => ({ ...p, tone: value as BotConfig['tone'] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Amigável</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="salesy">Vendedor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* System Prompt */}
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">Instruções do sistema (System Prompt)</Label>
                    <Textarea
                      id="system-prompt"
                      rows={8}
                      value={botConfig.systemPrompt}
                      onChange={(e) => setBotConfig((p) => ({ ...p, systemPrompt: e.target.value }))}
                      placeholder="Defina como o bot deve se comportar..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Essas instruções definem a personalidade e conhecimento do agente.
                    </p>
                  </div>

                  {/* Fallback Message */}
                  <div className="space-y-2">
                    <Label htmlFor="fallback-msg">Mensagem de fallback</Label>
                    <Textarea
                      id="fallback-msg"
                      rows={3}
                      value={botConfig.fallbackMessage}
                      onChange={(e) => setBotConfig((p) => ({ ...p, fallbackMessage: e.target.value }))}
                      placeholder="Mensagem quando o bot não conseguir responder..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Exibida quando a API do OpenAI não estiver disponível.
                    </p>
                  </div>

                  {/* Max History */}
                  <div className="space-y-2">
                    <Label htmlFor="max-history">Máximo de mensagens no contexto</Label>
                    <Input
                      id="max-history"
                      type="number"
                      min={2}
                      max={50}
                      value={botConfig.maxHistory}
                      onChange={(e) => setBotConfig((p) => ({ ...p, maxHistory: parseInt(e.target.value) || 10 }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Quantidade de mensagens anteriores enviadas para a API como contexto.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveBotConfig} className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Configurações
                    </Button>
                    <Button variant="outline" onClick={() => setBotConfig(DEFAULT_BOT_CONFIG)}>
                      Resetar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Conversas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Histórico de Conversas
                    </CardTitle>
                    <CardDescription>Últimas interações dos clientes com o agente</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleClearHistory}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpar
                  </Button>
                </CardHeader>
                <CardContent>
                  {chatHistory.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">Nenhuma conversa registrada</div>
                  ) : (
                    <div className="max-h-[600px] space-y-3 overflow-y-auto pr-2">
                      {chatHistory.slice().reverse().map((session) => (
                        <div key={session.id} className="rounded-lg border p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                              {new Date(session.updatedAt).toLocaleString('pt-BR')}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {session.messages.length} msgs
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            {session.messages.slice(-4).map((msg, i) => (
                              <p key={i} className="text-sm line-clamp-1">
                                <span className={msg.role === 'user' ? 'font-medium text-primary' : 'text-muted-foreground'}>
                                  {msg.role === 'user' ? 'Cliente' : 'Bot'}:
                                </span>{' '}
                                {msg.content}
                              </p>
                            ))}
                            {session.messages.length > 4 && (
                              <p className="text-xs text-muted-foreground">
                                +{session.messages.length - 4} mensagens anteriores
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

