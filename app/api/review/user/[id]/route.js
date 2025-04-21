// อันนี้หน้า  แบบ ไม่สวยงาม // นี่คือฟังก์ชันสำหรับดึงรีวิวของผู้ใช้จากฐานข้อมูล
import connection from 'lib/db.js'

export async function GET(req) {
  // ดึง id จาก URL
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() // ดึงค่าหลังสุดจาก path เช่น /api/review/user/28 


  //เอาข้อมูลที่เคยรีวิวมาแสดง
  try {
    const [rows] = await connection.query(
      `SELECT 
         r.*, 
         restaurant.name AS restaurant_name, 
         restaurant.image_url AS restaurant_image
       FROM review r
       JOIN restaurant ON r.restaurant_id = restaurant.id
       WHERE r.user_id = ?`,
      [id]
    )
//อ่าวไม่เคยรีวิวร้านอาหารเลยหรอ
    if (rows.length === 0) {
      return new Response(JSON.stringify({
        message: 'คุณยังไม่ได้รีวิวร้านอาหารเลย เริ่มรีวิวร้านอาหารเพื่อรับ badge!',
        reviews: []
      }), { status: 200 }) //ใช่แล้ว
    }

    return new Response(JSON.stringify({ reviews: rows }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
