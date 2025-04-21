// อันนี้ของหน้า home ที่ดึง mbti  recom  สุ่มมา  3 ร้าน ที่ bmti คนนั้นเคยไปรีวิว มาขึ้น
import { NextResponse } from 'next/server'
import db from 'lib/db.js'

export async function GET() {   //handler ให้ request GET
  try {
    const [restaurants] = await db.query(`
      SELECT DISTINCT r.*, u.MBTItype
      FROM review rv
      JOIN user u ON rv.user_id = u.id
      JOIN restaurant r ON rv.restaurant_id = r.id
      ORDER BY RAND()
      LIMIT 3
    `)
//อันนี้งงๆ คือไปที่ตารางรีวิว แล้วไปดึง id ของ user ที่รีวิว แล้วไปดึง MBTItype ของ user นั้น 
//แล้วก็ไปเอา  รีวิวร้านอาหาร   
    return NextResponse.json({ restaurants })//อันนี้ไม่มีอะไร แค่ ดัก error จะได้รู้
  } catch (err) {
    console.error(' Random MBTI API Error:', err)
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 })
  }
}
