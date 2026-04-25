import type { Product } from '@/lib/types'

// ============================================
// CATÁLOGO DE PRODUTOS - IMPÉRIO MODAS
// Organizado por categoria para facilitar manutenção
// ============================================

const conjuntos: Product[] = [
  {
    id: 1,
    nome: 'Mickey Mouse',
    cat: 'conjuntos',
    preco: 120,
    img: 'https://i.imgur.com/ieoyPu7.jpeg',
    descricao:
      'Conjunto infantil Mickey Mouse com estampa vibrante, toque macio e caimento soltinho para acompanhar a brincadeira com muito conforto.',
    isBestSeller: true,
    isNew: false,
  },
  {
    id: 2,
    nome: 'Conjunto Gucci',
    cat: 'conjuntos',
    preco: 120,
    img: 'https://i.imgur.com/21lqxX1.jpeg',
    descricao:
      'Conjunto Gucci com visual premium, acabamento caprichado e estilo marcante para montar um look elegante e moderno.',
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 3,
    nome: 'Conjunto Nike Infantil',
    cat: 'conjuntos',
    preco: 120,
    img: 'https://i.imgur.com/kGpcXUL.jpeg',
    descricao:
      'Conjunto Nike infantil com pegada esportiva, tecido leve e modelagem confortável para os pequenos se movimentarem com liberdade.',
    isBestSeller: false,
    isNew: true,
  },
    {
    id: 4,
    nome: 'Conjunto Nike Infantil',
    cat: 'conjuntos',
    preco: 120,
    img: 'https://i.imgur.com/mkw6fr3.jpeg',
    descricao:
      'Conjunto Nike infantil com pegada esportiva, tecido leve e modelagem confortável para os pequenos se movimentarem com liberdade.',
    isBestSeller: false,
    isNew: true,
  },
      {
    id: 5,
    nome: 'Conjunto Nike',
    cat: 'conjuntos',
    preco: 120,
    img: 'https://i.imgur.com/HKmaEvi.jpeg',
    descricao:
      'Conjunto Nike infantil com pegada esportiva, tecido leve e modelagem confortável para os pequenos se movimentarem com liberdade.',
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 6,
    nome: 'Conjunto Lacoste Infantil',
    cat: 'conjuntos',
    preco: 120,
    img: 'https://i.imgur.com/XefmO1r.jpeg',
    descricao:
      'Conjunto Lacoste infantil com pegada esportiva, tecido leve e modelagem confortável para os pequenos se movimentarem com liberdade.',
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 7,
    nome: 'Conjunto Feminino + Acessório',
    cat: 'conjuntos',
    preco: 120,
    img: 'https://i.imgur.com/L77B2uU.jpeg',
    descricao:
      'Conjunto Feminino + Acessório com pegada esportiva, tecido leve e modelagem confortável para os pequenos se movimentarem com liberdade.',
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 8,
    nome: 'Conjunto Nike infantil',
    cat: 'conjuntos',
    preco: 120,
    img: 'https://i.imgur.com/9Qhhumf.jpeg',
    descricao:
      'Conjunto Nike infantil  com pegada esportiva, tecido leve e modelagem confortável para os pequenos se movimentarem com liberdade.',
    isBestSeller: false,
    isNew: true,
  }
  
]

const camisas: Product[] = [
  {
    id: 20,
    nome: 'Camiseta Polo Gucci Premium',
    cat: 'camisas',
    preco: 50,
    img: 'https://i.imgur.com/mk0WH0x.jpeg',
    descricao:
      'Camiseta polo Gucci com gola estruturada, toque macio e presença elegante para ocasiões especiais e produções mais alinhadas.',
    isBestSeller: true,
    isNew: false,
  },
  
  {
    id: 21,
    nome: 'Camiseta High',
    cat: 'camisas',
    preco: 50,
    img: 'https://i.imgur.com/mtvxUbw.jpeg',
    descricao:
      'Camiseta High infantil com estilo urbano, tecido leve e modelagem moderna para quem gosta de um visual cheio de atitude.',
    isBestSeller: false,
    isNew: false,
  },
]

const tenis: Product[] = [
  {
    id: 9,
    nome: 'Tênis Puma Infantil',
    cat: 'tenis',
    preco: 100,
    img: 'https://i.imgur.com/e1gNmn9.jpeg',
    descricao:
      'Tênis Puma infantil com sola confortável, visual esportivo e ajuste prático para acompanhar a rotina com segurança e estilo.',
    isBestSeller: true,
    isNew: false,
  },
  {
    id: 10,
    nome: 'Tênis Nike Infantil',
    cat: 'tenis',
    preco: 100,
    img: 'https://i.imgur.com/IhtxtHP.jpeg',
    descricao:
      'Tênis Nike infantil com design marcante, estrutura firme e conforto ideal para passeios, escola e momentos de diversão.',
    isBestSeller: false,
    isNew: true,
  },
]

const calcas: Product[] = [
  {
    id: 16,
    nome: 'Calça Rasgada',
    cat: 'calcas',
    preco: 80,
    img: 'https://i.imgur.com/jr1Izex.jpeg',
    descricao:
      'Calça Rasgada com modelagem confortável, bolsos funcionais e visual estiloso para compor looks modernos em qualquer estação.',
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 17,
    nome: 'Calça Cargo Feminina Infantil',
    cat: 'calcas',
    preco: 80,
    img: 'https://i.imgur.com/Rj4oIDk.jpeg',
    descricao:
      'Calça cargo feminina infantil com modelagem confortável, bolsos utilitários e visual moderno para montar looks estilosos em qualquer ocasião.',
    isBestSeller: false,
    isNew: true,
  },
]

const bermudas: Product[] = [
  {
    id: 22,
    nome: 'Bermuda Lacoste Infantil',
    cat: 'bermudas',
    preco: 70,
    img: 'https://i.imgur.com/LaoQuul.jpeg',
    descricao:
      'Bermuda Lacoste com visual versátil, tecido confortável e acabamento leve para montar looks frescos e estilosos no dia a dia.',
    isBestSeller: false,
    isNew: false,
  },
]

const vestidos: Product[] = [
  {
    id: 23,
    nome: 'Vestido Azul Infantil',
    cat: 'vestidos',
    preco: 100,
    img: 'https://i.imgur.com/oVQ2dWX.jpeg',
    descricao:
      'Vestido azul infantil com caimento leve, visual delicado e toque confortável para deixar os passeios ainda mais estilosos.',
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 24,
    nome: 'Vestido Vermelho Infantil',
    cat: 'vestidos',
    preco: 100,
    img: 'https://i.imgur.com/ZGYpnxL.jpeg',
    descricao:
      'Vestido vermelho infantil com presença marcante, modelagem confortável e acabamento delicado para ocasiões especiais e do dia a dia.',
    isBestSeller: true,
    isNew: true,
  },
]

const moletons: Product[] = [
  {
    id: 12,
    nome: 'Moletom Nike',
    cat: 'moletons',
    preco: 120,
    img: 'https://i.imgur.com/3V4FTQc.jpeg',
    descricao:
      'Moletom Nike infantil com toque macio, ótimo caimento e visual esportivo para aquecer os dias frios com muito estilo.',
    isBestSeller: true,
    isNew: true,
  },
  {
    id: 13,
    nome: 'Moletom Lacoste',
    cat: 'moletons',
    preco: 120,
    img: 'https://i.imgur.com/z5dVECo.jpeg',
    descricao:
      'Moletom Lacoste com acabamento premium, tecido encorpado e aparência sofisticada para um look infantil elegante e confortável.',
    isBestSeller: false,
    isNew: true,
  },
]

const acessorios: Product[] = [
  {
    id: 18,
    nome: 'Boné LA Street',
    cat: 'acessorios',
    preco: 40,
    img: 'https://i.imgur.com/5vXp6fU.jpeg',
    descricao:
      'Boné LA Street com estilo street, ajuste confortável e detalhe moderno para finalizar o look com personalidade.',
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 19,
    nome: 'Relógio Infantil Digital',
    cat: 'acessorios',
    preco: 40,
    img: 'https://i.imgur.com/XRSWKvp.jpeg',
    descricao:
      'Relógio infantil com visual moderno, pulseira confortável e ajuste prático para completar o look com estilo no dia a dia.',
    isBestSeller: false,
    isNew: true,
  }
]

export const products: Product[] = [
  ...conjuntos,
  ...camisas,
  ...tenis,
  ...calcas,
  ...bermudas,
  ...vestidos,
  ...moletons,
  ...acessorios,
]

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(cat: string): Product[] {
  return products.filter((p) => p.cat === cat)
}
