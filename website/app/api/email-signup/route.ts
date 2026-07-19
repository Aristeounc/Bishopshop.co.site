import { NextRequest, NextResponse } from 'next/server';

interface SignupRequest {
  email: string;
  scenario?: string;
  goal?: string;
}

const subscribers: Map<string, SignupRequest> = new Map();

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const email = sanitizeEmail(body.email);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      );
    }

    if (subscribers.has(email)) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    const signupData: SignupRequest = {
      email,
      scenario: body.scenario,
      goal: body.goal,
    };

    subscribers.set(email, signupData);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        email: email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Email signup error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  const sanitized = sanitizeEmail(email);
  const isSubscribed = subscribers.has(sanitized);

  return NextResponse.json({
    email: sanitized,
    subscribed: isSubscribed,
  });
}
