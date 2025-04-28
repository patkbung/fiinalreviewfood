// app/api/user/route.js
import connection from 'lib/db.js'

// export async function GET() {  
//   // ตอนนี้ดึง user ทั้งหมด ยังไม่ใช้ SignIn แล้ว งง ๆ   ไม่ได้ใช้แล้ว 
//   try {
//     const [rows] = await connection.query(
//       'SELECT id, username, email, password, avatar_url, MBTItype, Point FROM user'
//     );
//     return Response.json(rows);
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }

// ไม่ได้ใช้แล้ว รวมไปใน post แล้ว


export async function POST(request) {
  try {
    const body = await request.json(); //ดึงข้อมูลจาก body ที่cli ส่งมา
    const { username, email, password, MBTItype, type } = body;

    if (type === 'signin') {
      //  Sign in 
      if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }
      
      const [rows] = await connection.query(
        'SELECT id, username, email, password, avatar_url, MBTItype, Point FROM user WHERE username = ?',
        [username]
      );
//ไปดูซิ ว่าตรงกับที่มีอยู่ไหมจ๊ะ
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Username not found' }), { status: 401 });
      }

      const user = rows[0];

      if (user.password !== password) {
        return new Response(JSON.stringify({ error: 'Incorrect password' }), { status: 401 });
      }

      // ถ้า login ถูก เอา user กลับ แต่ไม่ส่ง password แล้ว
      const { password: _, ...userWithoutPassword } = user;

      return new Response(JSON.stringify(userWithoutPassword), { status: 200 });

    } else {
      //  Sign up 
      if (!username || !email || !password || !MBTItype) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }

      // เช็ค email หรือ username ซ้ำ ไหม
      const [existingUsers] = await connection.query(
        'SELECT * FROM user WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUsers.length > 0) {
        const existing = existingUsers[0];
        if (existing.email === email) {
          return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 409 });
        }
        if (existing.username === username) {
          return new Response(JSON.stringify({ error: 'Username already taken' }), { status: 409 });
        }
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
