//  app/api/restaurant/mbti/random/route.js
import { NextResponse } from 'next/server'
import db from 'lib/db.js'

export async function GET() {
  try {
    // 1. ดึง MBTI ทั้งหมดที่มี
    const [mbtiRows] = await db.query(`
      SELECT DISTINCT MBTItype
      FROM user
      WHERE MBTItype IS NOT NULL AND MBTItype != ''
    `)

    if (mbtiRows.length === 0) {
      return NextResponse.json({ restaurants: [], mbtiType: null })
    }

    // 2. สุ่ม MBTI มา 1 อัน
    const randomMBTI = mbtiRows[Math.floor(Math.random() * mbtiRows.length)].MBTItype

    // 3. หา restaurant ที่มีคน MBTI นี้ไปรีวิว
    const [mbtiRestaurants] = await db.query(`
      SELECT DISTINCT r.*
      FROM review rv
      JOIN user u ON rv.user_id = u.id
      JOIN restaurant r ON rv.restaurant_id = r.id
      WHERE u.MBTItype = ?
      ORDER BY RAND()
    `, [randomMBTI])

    let finalRestaurants = [...mbtiRestaurants]

    // 4. ถ้าไม่ถึง 3 ร้าน → ไปสุ่มร้านอื่นมาจากทั้งหมด
    if (finalRestaurants.length < 3) {
      const needed = 3 - finalRestaurants.length
      
      // ดึงร้านทั้งหมด (ที่ยังไม่ได้เลือกไปแล้ว) มาสุ่มเพิ่ม
      const [otherRestaurants] = await db.query(`
        SELECT DISTINCT r.*
        FROM restaurant r
        WHERE r.id NOT IN (${finalRestaurants.map(r => r.id).join(',') || 'NULL'})
        ORDER BY RAND()
        LIMIT ?
      `, [needed])

      finalRestaurants = [...finalRestaurants, ...otherRestaurants]
    }

    // 5. จำกัดที่ 3 ร้าน
    finalRestaurants = finalRestaurants.slice(0, 3)

    return NextResponse.json({ restaurants: finalRestaurants, mbtiType: randomMBTI })
  } catch (err) {
    console.error(' Random MBTI API Error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}


