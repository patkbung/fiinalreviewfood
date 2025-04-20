import connection from '@/lib/db'

export async function POST(req) {
  try {
    const {
      user_id, restaurant_id, review_text, rating,
      image1_url, image2_url, image3_url, xp
    } = await req.json()

    await connection.query(
      `INSERT INTO review (user_id, restaurant_id, review_text, rating, image1_url, image2_url, image3_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [user_id, restaurant_id, review_text, rating, image1_url, image2_url, image3_url]
    )

    return new Response(JSON.stringify({ message: 'Review created successfully' }), { status: 201 })
  } catch (err) {
    console.error('🔥 Error in POST /review:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
