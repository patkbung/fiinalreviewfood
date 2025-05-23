//ข้อมูลส่วนตัวข้างบน

import connection from 'lib/db.js'

// ดึงข้อมูล user ตาม id
export async function GET(req) {
  const url = new URL(req.url)
  const id = Number(url.pathname.split('/').pop())

  try {
    const [rows] = await connection.query(
      'SELECT id, username, email, avatar_url, MBTItype, Point FROM user WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

// แก้ไขข้อมูล avatar MBTI
export async function PATCH(req) {
  const url = new URL(req.url)
  const id = Number(url.pathname.split('/').pop())

  const body = await req.json()
  const { avatar_url, MBTItype } = body

  try {
    const [result] = await connection.query(
      'UPDATE user SET avatar_url = ?, MBTItype = ? WHERE id = ?',
      [avatar_url, MBTItype, id]
    )

    return new Response(JSON.stringify({ message: 'Updated successfully' }), {
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}
