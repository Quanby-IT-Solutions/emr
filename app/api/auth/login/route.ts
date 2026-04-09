import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/src/generated/client/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: { staff: true }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In a real app, you'd hash and compare passwords
    // For demo purposes, we'll do a simple check
    if (password !== 'password') { // Replace with proper password verification
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Return user data (without password)
    const { passwordHash: _passwordHash, ...userData } = user

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}