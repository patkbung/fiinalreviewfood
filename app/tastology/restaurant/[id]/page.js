'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReviewCreateModal from '../../review/components/ReviewCreateModal'

export default function RestaurantDetailPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showModal, setShowModal] = useState(false)

  const fetchRestaurant = async () => {
    const res = await fetch(`http://localhost:3000/api/restaurant/${id}`)
    if (res.ok) {
      const data = await res.json()
      setRestaurant(data)
    }
  }

  const fetchReviews = async () => {
    const res = await fetch(`http://localhost:3000/api/review/restaurant/${id}`)
    if (res.ok) {
      const data = await res.json()
      setReviews(data)
    }
  }

  useEffect(() => {
    if (id) {
      fetchRestaurant()
      fetchReviews()
    }
  }, [id])

  const handleReviewSubmitted = async () => {
    await fetchReviews()
  }

  if (!restaurant) {
    return <div className="text-center mt-10 text-gray-500">Loading restaurants...</div>
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-3xl font-bold text-pink-500 mb-2">{restaurant.name}</h1>
        <p className="text-gray-600 mb-1">category: {restaurant.type}</p>
        <p className="text-gray-600 mb-1">
          open: {restaurant.open_time || 'ไม่ระบุ'} - close: {restaurant.close_time || 'ไม่ระบุ'}
        </p>
        <p className="mt-4 text-gray-800">{restaurant.description}</p>

        <button
          className="mt-6 bg-pink-500 hover:bg-black text-white px-6 py-2 rounded-md"
          onClick={() => setShowModal(true)}
        >
          review
        </button>
      </div>

      {/* รีวิวของลูกค้า */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-black mb-4">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="relative bg-white p-4 rounded-lg shadow-md">
              <span className="absolute top-2 right-2 bg-pink-400 text-white text-xs px-2 py-1 rounded">
                {r.rating}/5
              </span>
              <div className="flex gap-2 mb-2">
                <img
                  src={r.avatar_url || '/default-avatar.png'}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-black">{r.username}</p>
                  <p className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-black mb-2">{r.review_text}</p>
              <div className="grid grid-cols-3 gap-1">
                {[r.image1_url, r.image2_url, r.image3_url].filter(Boolean).map((img, i) => (
                  <img key={i} src={img} alt="review" className="w-full h-20 object-cover rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* แสดง popup เมื่อกดปุ่มเท่านั้น */}
      {showModal && (
        <ReviewCreateModal
          restaurantId={id}
          onClose={() => setShowModal(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  )
}
