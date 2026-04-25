import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByUsername } from '@/lib/db'
import { createToken, verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body as { username: string; password: string }

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Usuário e senha são obrigatórios' }, { status: 400 })
    }

    const user = await getUserByUsername(username)

    if (!user || !user.passwordHash) {
      return NextResponse.json({ ok: false, error: 'Credenciais inválidas' }, { status: 401 })
    }

    const validPassword = await verifyPassword(password, user.passwordHash)

    if (!validPassword) {
      return NextResponse.json({ ok: false, error: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    })

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Erro no login' }, { status: 500 })
  }
}
