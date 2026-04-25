// Motor de respostas locais do chatbot (funciona sem OpenAI API)

import { products } from './data/products'

const PRICE_MAP: Record<string, string> = {
  conjunto: 'R$ 120',
  conjuntos: 'R$ 120',
  camisa: 'R$ 50',
  camisas: 'R$ 50',
  camiseta: 'R$ 50',
  camisetas: 'R$ 50',
  calça: 'R$ 80',
  calças: 'R$ 80',
  calca: 'R$ 80',
  calcas: 'R$ 80',
  masc: 'R$ 80',
  fem: 'R$ 80',
  masculino: 'R$ 80',
  feminino: 'R$ 80',
  'masc/fem': 'R$ 80',
  tênis: 'R$ 100',
  tenis: 'R$ 100',
  bermuda: 'R$ 70',
  bermudas: 'R$ 70',
  vestido: 'R$ 100',
  vestidos: 'R$ 100',
  moletom: 'R$ 120',
  moletons: 'R$ 120',
  acessório: 'R$ 40',
  acessórios: 'R$ 40',
  acessorio: 'R$ 40',
  acessorios: 'R$ 40',
}

const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  conjunto: 'Conjuntos',
  conjuntos: 'Conjuntos',
  camisa: 'Camisetas',
  camisas: 'Camisetas',
  camiseta: 'Camisetas',
  camisetas: 'Camisetas',
  calça: 'Calças',
  calças: 'Calças',
  calca: 'Calças',
  calcas: 'Calças',
  masc: 'Calças',
  fem: 'Calças',
  masculino: 'Calças',
  feminino: 'Calças',
  'masc/fem': 'Calças',
  tênis: 'Tênis',
  tenis: 'Tênis',
  bermuda: 'Bermudas',
  bermudas: 'Bermudas',
  vestido: 'Vestidos',
  vestidos: 'Vestidos',
  moletom: 'Moletons',
  moletons: 'Moletons',
  acessório: 'Acessórios',
  acessórios: 'Acessórios',
  acessorio: 'Acessórios',
  acessorios: 'Acessórios',
}

function findProductMention(text: string): string | null {
  const lower = text.toLowerCase()
  for (const p of products) {
    const nameWords = p.nome.toLowerCase().split(' ')
    for (const word of nameWords) {
      if (word.length > 3 && lower.includes(word)) {
        return p.nome
      }
    }
  }
  return null
}

function findCategoryMention(text: string): string | null {
  const lower = text.toLowerCase()
  const categories = [
    'conjunto',
    'conjuntos',
    'camisa',
    'camiseta',
    'calça',
    'calças',
    'calca',
    'calcas',
    'masc/fem',
    'masculino',
    'feminino',
    'masc',
    'fem',
    'tênis',
    'tenis',
    'bermuda',
    'bermudas',
    'vestido',
    'vestidos',
    'moletom',
    'moletons',
    'acessório',
    'acessórios',
    'acessorio',
    'acessorios',
  ]

  for (const cat of categories) {
    if (lower.includes(cat)) return cat
  }

  return null
}

export function generateLocalResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  const mentionedProduct = findProductMention(lower)

  // Saudações
  if (/^(oi|olá|ola|hey|eai|e aí|bom dia|boa tarde|boa noite|oi!|olá!)/.test(lower)) {
    return 'Olá! Bem-vindo à Império Modas! Sou seu assistente virtual. Posso te ajudar com produtos, preços, tamanhos, frete e formas de pagamento. O que você precisa? 😊'
  }

  // Produto específico
  if (mentionedProduct && /(tem|mostrar|ver|detalhe|detalhes|sobre|gostei)/.test(lower)) {
    return `Temos o produto ${mentionedProduct} disponível no catálogo! Se quiser, você pode abrir o item para ver a descrição completa e adicionar ao carrinho.`
  }

  // Produtos / o que vende
  if (/(produto|vende|tem|loja|roupa|moda|infantil|criança|oque|o que)/.test(lower)) {
    return 'Na Império Modas trabalhamos com moda infantil! Temos conjuntos, camisetas, calças, tênis, bermudas, vestidos, moletons e acessórios. Tudo com qualidade e preço justo. Quer ver alguma categoria específica?'
  }

  // Preços
  if (/(preço|preco|quanto|custa|valor|reais|\$)/.test(lower)) {
    const cat = findCategoryMention(lower)
    if (cat) {
      const price = PRICE_MAP[cat]
      const label = CATEGORY_DISPLAY_MAP[cat] ?? cat
      if (price) return `A categoria ${label} custa ${price} na Império Modas! Temos várias opções disponíveis. Quer que eu te ajude a escolher?`
    }
    return 'Nossos preços são:\n• Conjuntos: R$ 120\n• Camisetas: R$ 50\n• Calças: R$ 80\n• Tênis: R$ 100\n• Bermudas: R$ 70\n• Vestidos: R$ 100\n• Moletons: R$ 120\n• Acessórios: R$ 40\n\nQual categoria te interessa?'
  }

  // Tamanhos
  if (/(tamanho|medida|qual tamanho|numeração|serve|serve em)/.test(lower)) {
    return 'Trabalhamos com diversos tamanhos infantis! Cada produto tem sua numeração específica. Se quiser, posso te ajudar a escolher o tamanho ideal. Qual a idade ou tamanho da criança?'
  }

  // Frete / entrega
  if (/(frete|entrega|envia|envio|entrega em|chega|quando chega|prazo)/.test(lower)) {
    return 'Fazemos entrega em Lages e região via motoboy! O prazo e valor do frete dependem do endereço. Você é de Lages - SC? Me informa o bairro que verifico a disponibilidade de entrega!'
  }

  // Pagamento
  if (/(pagamento|pagar|pix|cartão|boleto|dinheiro|forma de pagar|como pago)/.test(lower)) {
    return 'O pagamento é feito de forma simples: você finaliza o pedido aqui no site e recebe todos os dados para pagamento via WhatsApp! Aceitamos Pix e dinheiro na entrega. Fácil e seguro!'
  }

  // Trocas / devoluções
  if (/(troca|trocar|devolver|devolução|devolucao|não serviu|nao serviu|tamanho errado)/.test(lower)) {
    return 'Aceitamos trocas em até 7 dias desde que o produto esteja com a etiqueta e sem sinais de uso. A troca pode ser feita diretamente na loja ou via motoboy em Lages. Fique tranquilo!'
  }

  // Status de pedido
  if (/(pedido|status|meu pedido|rastrear|onde está|chegou|confirmar)/.test(lower)) {
    return 'Para consultar o status do seu pedido, você pode falar diretamente conosco pelo WhatsApp (49) 99988-2363. Informe o número do pedido que verificamos pra você!'
  }

  // Localização / endereço
  if (/(onde fica|endereço|endereco|local|loja física|fisica|presencial)/.test(lower)) {
    return 'Nossa loja fica em Lages - SC! Atendemos tanto presencialmente quanto pelo WhatsApp (49) 99988-2363. Você pode vir conhecer nossos produtos ou comprar pelo site com entrega em casa!'
  }

  // Horário / atendimento
  if (/(horário|horario|funciona|aberto|fecha|atende|que horas)/.test(lower)) {
    return 'Nosso atendimento online funciona todos os dias! Para atendimento mais rápido, fale pelo WhatsApp (49) 99988-2363. Estamos sempre prontos para te ajudar!'
  }

  // Agradecimento / despedida
  if (/(obrigado|obrigada|valeu|tchau|até|ate logo|flw|grato|agradeço)/.test(lower)) {
    return 'Por nada! Fico feliz em poder ajudar. Se precisar de mais alguma coisa, é só chamar. Boa compra na Império Modas! 👋'
  }

  // Ajuda / não entendeu
  if (/(ajuda|help|não entendi|nao entendi|como funciona|o que faz)/.test(lower)) {
    return 'Posso te ajudar com:\n• Produtos e preços\n• Tamanhos disponíveis\n• Frete e entrega\n• Formas de pagamento\n• Trocas e devoluções\n\nO que você gostaria de saber?'
  }

  // Resposta padrão
  return 'Entendi! Para te ajudar melhor, posso falar sobre nossos produtos, preços, tamanhos, frete ou pagamento. O que você precisa? Se preferir, fale direto pelo WhatsApp (49) 99988-2363!'
}
