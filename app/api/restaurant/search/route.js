import { NextResponse } from 'next/server'
import db from 'lib/db.js'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  try {
    const [restaurants] = await db.query(`
      SELECT * FROM restaurant
      WHERE name LIKE ? OR type LIKE ? OR description LIKE ?
      LIMIT 12
    `, [`%${q}%`, `%${q}%`, `%${q}%`])

    return NextResponse.json({ restaurants })
  } catch (err) {
    console.error('❌ Search API Error:', err)
    return NextResponse.json({ error: 'Failed to search restaurants' }, { status: 500 })
  }
}
