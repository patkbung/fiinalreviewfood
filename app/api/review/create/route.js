import connection from 'lib/db.js'

export async function POST(req) {
  const body = await req.json()
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
    const [[restaurant]] = await connection.query(
      'SELECT id FROM restaurant WHERE id = ?',
      [restaurant_id]
    )

    if (!restaurant) {
      return new Response(JSON.stringify({ error: 'Invalid restaurant_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    await connection.query(
      `INSERT INTO review (user_id, restaurant_id, review_text, rating, image1_url, image2_url, image3_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [user_id, restaurant_id, review_text, rating, image1_url, image2_url, image3_url]
    )

    await connection.query(
      `UPDATE user SET point = point + ? WHERE id = ?`,
      [xp, user_id]
    )

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err) {
    console.error('🔥 Review Insert Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
