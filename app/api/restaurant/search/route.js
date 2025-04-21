//สำหรับค้นหา ในหน้า home  เซมๆกันหมด ก็หาหมดนั่นแหละ ชื่อ type des อะไรที่ตรงกัน ก็เอามาแสดงหมด แต่แค่ 12 ร้านเท่านั้น
// http://localhost:3000/api/restaurant/search?q=อาหารไทย
import { NextResponse } from 'next/server'
import db from 'lib/db.js'

export async function GET(req) {
  const { searchParams } = new URL(req.url)//อันนี้ก็ดึงค่าที่พิมมาในช่องค้นหา
  const q = searchParams.get('q')

  try {
    const [restaurants] = await db.query(`
      SELECT * FROM restaurant
      WHERE name LIKE ? OR type LIKE ? OR description LIKE ?
      LIMIT 12
    `, [`%${q}%`, `%${q}%`, `%${q}%`])

    return NextResponse.json({ restaurants })
  } catch (err) {
    console.error(' Search API Error:', err)//ดัก error  500 ไม่มีคำที่ใกล้เคียง
    return NextResponse.json({ error: 'Failed to search restaurants' }, { status: 500 })
  }
}
