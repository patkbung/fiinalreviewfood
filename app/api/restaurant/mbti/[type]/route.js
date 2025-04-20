import { NextResponse } from 'next/server'
import db from 'lib/db.js'

export async function GET(req, { params }) {
  const { type } = params
  console.log('📌 MBTI type param:', type)

  try {
    const [restaurants] = await db.query(`
      SELECT DISTINCT r.*
      FROM review rv
      JOIN user u ON rv.user_id = u.id
      JOIN restaurant r ON rv.restaurant_id = r.id
      WHERE u.MBTItype = ?
      ORDER BY RAND()
      LIMIT 3
    `, [type])

    return NextResponse.json({ restaurants })
  } catch (err) {
    console.error('❌ MBTI API Error:', err)
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 })
  }
}
