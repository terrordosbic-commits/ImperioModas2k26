'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Package, CreditCard, Loader2, MessageCircle, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { isUserLoggedIn } from '@/lib/user-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { generateCustomerWhatsAppLink } from '@/lib/whatsapp-checkout'
import { LoginModal } from '@/components/login-modal'

export function Cart() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [orderResult, setOrderResult] = useState<{ id: number } | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [formData, setFormData] = useState({
    cpf: '',
    nomeCompleto: '',
    email: '',
    telefone: '',
    endereco: '',
    rua: '',
    numeroCasa: '',
    bairro: '',
    cidade: '',
    referencia: '',
  })

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cpf' ? formatCPF(value) : value,
    }))
  }

  const handleConfirmWhatsApp = () => {
    if (!orderResult) return

    const link = generateCustomerWhatsAppLink(
      {
        nomeCompleto: formData.nomeCompleto,
        telefone: formData.telefone,
        endereco: formData.endereco,
        rua: formData.rua,
        numeroCasa: formData.numeroCasa,
        bairro: formData.bairro || formData.endereco,
        cidade: formData.cidade || 'Lages - SC',
        referencia: formData.referencia,
      },
      items.map((item) => ({
        nome: item.nome,
        qtd: item.qtd,
        preco: item.preco,
      })),
      totalPrice
    )

    window.open(link, '_blank')
    clearCart()
    setFormData({
      cpf: '',
      nomeCompleto: '',
      email: '',
      telefone: '',
      endereco: '',
      rua: '',
      numeroCasa: '',
      bairro: '',
      cidade: '',
      referencia: '',
    })
    setShowConfirmModal(false)
    setOrderResult(null)
    router.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isUserLoggedIn()) {
      setLoginOpen(true)
      return
    }

    if (items.length === 0) {
      toast.error('Adicione produtos à sacola')
      return
    }

    const cpfDigits = formData.cpf.replace(/\D/g, '')
    if (cpfDigits.length !== 11) {
      toast.error('CPF invalido')
      return
    }

    setIsSubmitting(true)

    try {
      // Tenta checkout (agora sempre placeholder)
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            nome: item.nome,
            quantidade: item.qtd,
            preco: item.preco,

          })),
          customer: {
            nome: formData.nomeCompleto,
            telefone: formData.telefone,
            cpf: formData.cpf,
            endereco: `${formData.rua}, ${formData.numeroCasa} - ${formData.endereco}`,
            cidade: formData.cidade || 'Lages - SC',
            observacoes: formData.referencia,
          },
        }),
      })

      // Fallback: usa o pedido normal via WhatsApp
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: items.map((item) => ({
            id: item.id,
            nome: item.nome,
            qtd: item.qtd,
            preco: item.preco,
          })),
          total: totalPrice,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar pedido')
      }

      setOrderResult(result.order)
      setShowConfirmModal(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar pedido')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Sua sacola está vazia</h2>
        <p className="mb-6 text-muted-foreground">Adicione produtos para continuar</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ver Produtos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar Comprando
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Carrinho ({totalItems})</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.img ? (
                      <Image src={item.img} alt={item.nome} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{item.nome}</h3>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.preco)} cada</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.qtd}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{formatPrice(item.preco * item.qtd)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-between border-t pt-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
            </CardFooter>
          </Card>
        </div>

        {/* Checkout Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Dados para Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(49) 99999-9999"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço/Bairro *</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Nome do bairro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rua">Rua *</Label>
                  <Input
                    id="rua"
                    name="rua"
                    value={formData.rua}
                    onChange={handleChange}
                    placeholder="Nome da rua"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="numeroCasa">Número *</Label>
                    <Input
                      id="numeroCasa"
                      name="numeroCasa"
                      value={formData.numeroCasa}
                      onChange={handleChange}
                      placeholder="Nº"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      placeholder="Lages - SC"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referencia">Referência *</Label>
                  <Input
                    id="referencia"
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleChange}
                    placeholder="Próximo a..."
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Finalizar Pedido via WhatsApp
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Pedido Registrado!
            </DialogTitle>
            <DialogDescription>
              Seu pedido #{orderResult?.id} foi salvo. Agora envie os detalhes pelo WhatsApp para confirmar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-lg border bg-muted/40 p-3 text-sm">
            <p><strong>Cliente:</strong> {formData.nomeCompleto}</p>
            <p><strong>Telefone:</strong> {formData.telefone}</p>
            <p><strong>Endereço:</strong> {formData.rua}, {formData.numeroCasa} - {formData.endereco}</p>
            <p><strong>Total:</strong> {formatPrice(totalPrice)}</p>
            <p><strong>Itens:</strong> {totalItems}</p>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="w-full sm:w-auto">
              <X className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={handleConfirmWhatsApp} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <MessageCircle className="mr-2 h-4 w-4" />
              Enviar pelo WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  )
}
