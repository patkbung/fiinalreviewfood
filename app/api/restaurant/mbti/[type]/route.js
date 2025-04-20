import { NextResponse } from 'next/server'
import db from 'lib/db.js'

export async function GET() {
  try {
    const [restaurants] = await db.query(`
      SELECT DISTINCT r.*, u.MBTItype
      FROM review rv
      JOIN user u ON rv.user_id = u.id
      JOIN restaurant r ON rv.restaurant_id = r.id
      ORDER BY RAND()
      LIMIT 3
    `)

    return NextResponse.json({ restaurants })
  } catch (err) {
    console.error('❌ Random MBTI API Error:', err)
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 })
  }
}
