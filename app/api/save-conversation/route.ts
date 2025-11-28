import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: Request) {
  try {
    const { email, conversation_text } = await req.json();

    if (!email || !conversation_text) {
      return NextResponse.json(
        { error: 'Email and conversation_text are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Update the user's row with the conversation text
      // We assume the user exists because they must have logged in
      const result = await client.query(
        'UPDATE users SET conversation_text = $1 WHERE email = $2 RETURNING *',
        [conversation_text, email]
      );

      if (result.rowCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
