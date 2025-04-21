// อันนี้คือ เอารีวิวไปที่รีวิวไปขึ้น เป็นรีวิวทั้งหมดของร้านนี้

import connection from 'lib/db.js'

export async function GET(_, { params }) {
  const id = params.id
  console.log('Fetching reviews for restaurant id:', id)

  try {
    const [rows] = await connection.query(
      `SELECT r.*, u.username, u.avatar_url, restaurant.name AS restaurant_name
       FROM review r
       JOIN user u ON r.user_id = u.id
       JOIN restaurant ON r.restaurant_id = restaurant.id 
       WHERE r.restaurant_id = ?`,
      [id]
    )    
//ก็คือ ดึงข้อมูลจากตารางรีวิว มีชื่อ มีรูป -- แล้วก็ดึง user id ต่างๆ มา แล้วก็เอามาเฉพาะรีวิวของ id ที่ส่งมา
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error(' SQL Error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
