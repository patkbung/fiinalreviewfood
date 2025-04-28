// app/api/user/route.js
import connection from 'lib/db.js'

export async function GET() {
  // ❌ ตอนนี้ดึง user ทั้งหมด ยังไม่ใช้สำหรับ SignIn แล้ว
  try {
    const [rows] = await connection.query(
      'SELECT id, username, email, password, avatar_url, MBTItype, Point FROM user'
    );
    return Response.json(rows);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password, MBTItype, type } = body;

    if (type === 'signin') {
      // ▶️ Sign in flow
      if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }

      const [rows] = await connection.query(
        'SELECT id, username, email, password, avatar_url, MBTItype, Point FROM user WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Username not found' }), { status: 401 });
      }

      const user = rows[0];

      if (user.password !== password) {
        return new Response(JSON.stringify({ error: 'Incorrect password' }), { status: 401 });
      }

      // ถ้า login ถูก เอา user กลับ แต่ไม่ส่ง password
      const { password: _, ...userWithoutPassword } = user;

      return new Response(JSON.stringify(userWithoutPassword), { status: 200 });

    } else {
      // ▶️ Sign up flow
      if (!username || !email || !password || !MBTItype) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }

      const defaultAvatarUrl = 'https://res.cloudinary.com/dla8rkqp6/image/upload/v1745021698/uer5cx0m4e4xuwejbcxj.png';

      const [result] = await connection.query(
        `INSERT INTO user (username, email, password, MBTItype, Point, avatar_url) VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, password, MBTItype, 0, defaultAvatarUrl]
      );

      return new Response(JSON.stringify({ message: 'User created', id: result.insertId }), { status: 201 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
