import connection from '@/lib/db'

export async function GET(_, { params }) {
  const id = params.id

  try {
    const [rows] = await connection.query(
      'SELECT * FROM restaurant WHERE id = ?',
      [id]
    )
    console.log('📦 rows:', rows)
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
