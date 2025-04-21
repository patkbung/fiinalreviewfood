// app/api/user/route.js
import connection from 'lib/db.js'
export async function GET() { //อันนี้อย่าหาทำ ส่งข้อมูล user มาทั้งหมด  เพื่อเอาไปใช้ใน sign in 
  try {
    const [rows] = await connection.query(
      'SELECT id, username, email, password, avatar_url, MBTItype, Point FROM user'
    )
    return Response.json(rows)
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
 } 
//สำหรับ this endpoint is used to create a new user in the database ช่ายยยย สำหรับ endpoint ให้ผู้ใช้สามารถสร้างบัญชีใหม่ในฐานข้อมูล ถูกต้องๆ
export async function POST(request) {
  try {
    const body = await request.json()
    const { username, email, password, MBTItype } = body

    if (!username || !email || !password || !MBTItype) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }

    const defaultAvatarUrl = 'https://res.cloudinary.com/dla8rkqp6/image/upload/v1745021698/uer5cx0m4e4xuwejbcxj.png'

    const [result] = await connection.query(
      `INSERT INTO user (username, email, password, MBTItype, Point, avatar_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, password, MBTItype, 0, defaultAvatarUrl]
    )

    return new Response(JSON.stringify({ message: 'User created', id: result.insertId }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
