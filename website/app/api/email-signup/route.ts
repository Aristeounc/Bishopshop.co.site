import { NextRequest, NextResponse } from 'next/server';

interface SignupRequest {
  email: string;
  scenario?: string;
  goal?: string;
}

// Simple in-memory storage for demo
// In production, this would write to a database (Supabase, MongoDB, etc.)
const subscribers: SignupRequest[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json();

    // Validate email
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check for duplicates
    if (subscribers.some((s) => s.email === body.email)) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Add to subscribers (in production, save to DB)
    subscribers.push(body);

    // TODO: Integrate with SendGrid or similar
    // await sendWelcomeEmail(body.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed!',
        email: body.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Email signup error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
