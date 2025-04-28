import { NextResponse } from 'next/server'
import db from 'lib/db.js'

// ✅ ลบรีวิว
export async function DELETE(_, { params }) {
  const { id } = params

  try {
    const [result] = await db.query(
      'DELETE FROM review WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ Review Delete Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ✅ แก้ไขรีวิว
export async function PATCH(req, { params }) {
  const { id } = params
  const body = await req.json()
  const { review_text, rating, image1_url, image2_url, image3_url } = body

  try {
    const [result] = await db.query(`
      UPDATE review
      SET review_text = ?, rating = ?, image1_url = ?, image2_url = ?, image3_url = ?
      WHERE id = ?
    `, [review_text, rating, image1_url, image2_url, image3_url, id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ Review Update Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
