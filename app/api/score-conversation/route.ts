import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Call the FastAPI backend scoring endpoint
    const fastApiUrl = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${fastApiUrl}/score_conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FastAPI backend error:', response.status, errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.detail || 'Scoring failed' },
          { status: response.status }
        );
      } catch (e) {
        return NextResponse.json(
          { error: `Scoring failed: ${errorText}` },
          { status: response.status }
        );
      }
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calling scoring endpoint:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
