import { NextResponse } from 'next/server'

export async function POST() {
  // Webhook MP removido
  return new Response('Webhook desativado', { status: 410 })
}

export async function GET() {
  return new Response('Webhook desativado', { status: 410 })
}

