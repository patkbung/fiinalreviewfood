'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReviewCreateModal from '../../review/components/ReviewCreateModal'

export default function RestaurantDetailPage() {
  const { id } = useParams() //id ของร้านนั่นแหละ
  const [restaurant, setRestaurant] = useState(null) //ข้อมูลร้าน
  const [reviews, setReviews] = useState([]) //รีวิวของร้าน
  const [showModal, setShowModal] = useState(false) //ที่เอาไว้เขียนรีวิวอะ

  //ข้อมูลร้าน
  const fetchRestaurant = async () => {
    const res = await fetch(`/api/restaurant/${id}`)
    if (res.ok) {
      const data = await res.json()
      setRestaurant(data)
    }
  }
  //ข้อมูลรีวิว
  const fetchReviews = async () => {
    const res = await fetch(`/api/review/restaurant/${id}`)
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
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 text-gray-500">
        Loading restaurant...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Banner  */}
      <div
        className="relative h-[400px] w-full bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url(${restaurant.image_url || 'https://res.cloudinary.com/dla8rkqp6/image/upload/v1745654280/vuo1qo47wd4wzrnc7yjv.avif'})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{restaurant.name}</h1>
          <p className="text-md md:text-lg mt-2">{restaurant.description}</p>
        </div>
      </div>

      {/* Details Card */}
      <div className="max-w-4xl mx-auto -mt-20 p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-pink-500 mb-4">{restaurant.name}</h2>
        <p className="text-gray-700 mb-2"><strong>Category:</strong> {restaurant.type}</p>
        <p className="text-gray-700 mb-2">
          <strong>Open:</strong> {restaurant.open_time || 'N/A'} - <strong>Close:</strong> {restaurant.close_time || 'N/A'}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-400 backdrop-blur-md transition"
        >
          Review
        </button>
      </div>

{/* Reviews Section */}
<div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {reviews.map((r) => (
            <div key={r.id} className="relative bg-white rounded-2xl shadow-md hover:shadow-xl p-5 flex flex-col">
              <span className="absolute top-2 right-2 bg-pink-400 text-white text-xs px-2 py-1 rounded">
                {r.rating}/5
              </span>
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={r.avatar_url || '/default-avatar.png'}
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-black font-bold">{r.username}</p>
                  <p className="text-sm text-gray-500">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3 flex-grow">{r.review_text}</p>
              <div className="flex gap-2">
                {[r.image1_url, r.image2_url, r.image3_url].filter(Boolean).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="review"
                    className="w-1/3 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal  ไปที่ edit model ลิ้งไป*/}
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