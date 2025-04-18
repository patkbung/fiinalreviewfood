import connection from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await connection.query('SELECT id, username, email,password, avatar_url, MBTItype,Point FROM user');
    return Response.json(rows);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password, MBTItype } = body;

    console.log('Registering:', { username, email, password, MBTItype });

    if (!username || !email || !password || !MBTItype) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const [result] = await connection.query(
      `INSERT INTO user (username, email, password, MBTItype, Point) VALUES (?, ?, ?, ?, ?)`,
      [username, email, password, MBTItype, 0]
    );

    return new Response(JSON.stringify({ message: 'User created', id: result.insertId }), { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
