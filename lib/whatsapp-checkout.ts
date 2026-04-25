// Utilitário para gerar link de checkout via WhatsApp (cliente)

interface CheckoutItem {
  nome: string
  qtd: number
  preco: number
}

interface CheckoutCustomer {
  nomeCompleto: string
  telefone: string
  endereco: string
  rua: string
  numeroCasa: string
  bairro?: string
  cidade?: string
  referencia: string
}

const WHATSAPP_NUMBER = '554999882363'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function generateCustomerWhatsAppLink(
  customer: CheckoutCustomer,
  items: CheckoutItem[],
  total: number
): string {
  const itemsList = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.nome}\n   Qtd: ${item.qtd} x ${formatCurrency(item.preco)} = ${formatCurrency(item.qtd * item.preco)}`
    )
    .join('\n\n')

  const enderecoCompleto = `${customer.rua}, ${customer.numeroCasa}${customer.bairro ? ` - ${customer.bairro}` : ''}${customer.cidade ? `, ${customer.cidade}` : ''}`

  const message = `*NOVO PEDIDO - IMPÉRIO MODAS*

-------------------
*CLIENTE*
-------------------
*Nome:* ${customer.nomeCompleto}
*Telefone:* ${customer.telefone}

-------------------
*ENDEREÇO DE ENTREGA*
-------------------
${enderecoCompleto}
*Referência:* ${customer.referencia}

-------------------
*ITENS DO PEDIDO*
-------------------
${itemsList}

-------------------
*TOTAL:* ${formatCurrency(total)}
-------------------

Aguardo confirmação do pedido. Obrigado!`

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}

