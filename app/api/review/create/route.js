//อันนี้ card review 

import connection from 'lib/db.js'

export async function POST(req) {
  const body = await req.json() //ดึงข้อมูลที่ส่งมาจาก client ใดๆ  
  const {
    user_id,
    restaurant_id,
    review_text,
    rating,
    image1_url,
    image2_url,
    image3_url,
    xp
  } = body

  try {
    const [[restaurant]] = await connection.query(//เช็คว่ามี restaurant_id นี้แม่นบ่อ้าย
      'SELECT id FROM restaurant WHERE id = ?',
      [restaurant_id]
    )

    if (!restaurant) { // if ไม่มี ก็เอาไป 400
      return new Response(JSON.stringify({ error: 'Invalid restaurant_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
//  save the review to the database เวลาด้วย
    await connection.query(
      `INSERT INTO review (user_id, restaurant_id, review_text, rating, image1_url, image2_url, image3_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [user_id, restaurant_id, review_text, rating, image1_url, image2_url, image3_url]
    )

    await connection.query( //อันนี้เอา zp ที่ได้ client บวกในฟิล point  
      `UPDATE user SET point = point + ? WHERE id = ?`,
      [xp, user_id]
    )
// เห็น 200 แสดงว่า ถูกต้องเรียบร้อย ไม่มีอะไรผิดพลาด
    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err) {//เช็ค error ปกติ เอาไป 500 
    console.error(' Review Insert Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
