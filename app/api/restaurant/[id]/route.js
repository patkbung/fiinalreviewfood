// ของร้านอาหาร แต่ละร้าน http://localhost:3000/api/restaurant/2    //1 ไม่ต้องเทส ไม่มีdata

import connection from 'lib/db.js'

export async function GET(_, { params }) {   //เรียกให้ get ใช้ params.id จ้า  แล้วไงต่อ นั่นสิ?  เอาไอดีเป็นหลัก ดึงข้อมูลตาม id
  const id = params.id

  try {
    const [rows] = await connection.query(
      'SELECT * FROM restaurant WHERE id = ?', //อันนี้จ้าา
      [id]
    )
    console.log(' rows:', rows)
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not found' }), {  //ไปแล้วไม่มีข้อมูลร้าน ก็เลย ต้องบอกด้วยนะ ว่า 404
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }// 200 เจอข้อมูล
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }// น่าจะ ฐานข้อมูลล่ม อันนี้บอกสเตตัสเฉยๆ
    })
  }
}
