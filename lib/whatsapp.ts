// Serviço de envio de mensagens WhatsApp
// Suporta: Z-API, Evolution API, ou WhatsApp Business API

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN
const WHATSAPP_INSTANCE = process.env.WHATSAPP_INSTANCE || 'default'

// Números que receberão notificações de pedidos
const NOTIFICATION_NUMBERS = [
  '5549999726586',
  '5549999882363',
]

interface OrderDetails {
  id: string
  customerName: string
  customerPhone: string
  customerCpf: string
  address: string
  city: string
  items: Array<{
    nome: string
    quantidade: number
    preco: number
    tamanho?: string
  }>
  total: number
  paymentId?: string
  paymentMethod?: string
  observations?: string
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatOrderMessage(order: OrderDetails): string {
  const itemsList = order.items
    .map((item, i) => 
      `${i + 1}. ${item.nome}${item.tamanho ? ` (${item.tamanho})` : ''}\n   Qtd: ${item.quantidade} x ${formatCurrency(item.preco)} = ${formatCurrency(item.quantidade * item.preco)}`
    )
    .join('\n\n')

  return `*NOVO PEDIDO PAGO - IMPÉRIO MODAS*

*Pedido:* #${order.id}
*Data:* ${new Date().toLocaleString('pt-BR')}

-------------------
*CLIENTE*
-------------------
*Nome:* ${order.customerName}
*Telefone:* ${order.customerPhone}
*CPF:* ${order.customerCpf}

-------------------
*ENDEREÇO DE ENTREGA*
-------------------
${order.address}
${order.city}

-------------------
*ITENS DO PEDIDO*
-------------------
${itemsList}

-------------------
*TOTAL:* ${formatCurrency(order.total)}
-------------------

*Pagamento:* ${order.paymentMethod || 'Mercado Pago'}
*ID Pagamento:* ${order.paymentId || 'N/A'}

${order.observations ? `*Observações:* ${order.observations}` : ''}

-------------------
Link do cliente para WhatsApp:
https://wa.me/55${order.customerPhone.replace(/\D/g, '')}
`
}

export async function sendWhatsAppNotification(order: OrderDetails): Promise<boolean> {
  if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN) {
    console.log('[WhatsApp] API não configurada - mensagem não enviada')
    console.log('[WhatsApp] Pedido que seria enviado:', JSON.stringify(order, null, 2))
    return false
  }

  const message = formatOrderMessage(order)
  let allSent = true

  for (const number of NOTIFICATION_NUMBERS) {
    try {
      // Formato para Z-API
      const response = await fetch(`${WHATSAPP_API_URL}/send-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Token': WHATSAPP_API_TOKEN,
        },
        body: JSON.stringify({
          phone: number,
          message: message,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error(`[WhatsApp] Erro ao enviar para ${number}:`, error)
        allSent = false
      } else {
        console.log(`[WhatsApp] Mensagem enviada para ${number}`)
      }
    } catch (error) {
      console.error(`[WhatsApp] Erro de conexão para ${number}:`, error)
      allSent = false
    }
  }

  return allSent
}

// Função alternativa usando Evolution API
export async function sendWhatsAppEvolution(order: OrderDetails): Promise<boolean> {
  if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN) {
    console.log('[Evolution] API não configurada')
    return false
  }

  const message = formatOrderMessage(order)
  let allSent = true

  for (const number of NOTIFICATION_NUMBERS) {
    try {
      const response = await fetch(`${WHATSAPP_API_URL}/message/sendText/${WHATSAPP_INSTANCE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': WHATSAPP_API_TOKEN,
        },
        body: JSON.stringify({
          number: number,
          text: message,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error(`[Evolution] Erro ao enviar para ${number}:`, error)
        allSent = false
      } else {
        console.log(`[Evolution] Mensagem enviada para ${number}`)
      }
    } catch (error) {
      console.error(`[Evolution] Erro de conexão:`, error)
      allSent = false
    }
  }

  return allSent
}

export { NOTIFICATION_NUMBERS, formatOrderMessage }
