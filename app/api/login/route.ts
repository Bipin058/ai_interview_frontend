import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const user = result.rows[0];

      // Simple password check as requested
      if (user.password !== password) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        resume_extracted: user.resume_extracted,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
