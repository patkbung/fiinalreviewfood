'use client'

import { useState } from 'react'

export default function ReviewEditModal({ review, onClose, onReviewUpdated, onReviewDeleted }) {
  const [reviewText, setReviewText] = useState(review.review_text || '')
  const [rating, setRating] = useState(review.rating || 0)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState([
    review.image1_url,
    review.image2_url,
    review.image3_url
  ].filter(Boolean))
  const [newImages, setNewImages] = useState([])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3)
    setNewImages(files)
  }

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
  }

  const handleRemoveNewImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index)
    setNewImages(updatedNewImages)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let uploadedUrls = [...images]
      if (newImages.length > 0) {
        for (const image of newImages) {
          const formData = new FormData()
          formData.append('file', image)
          formData.append('upload_preset', 'profile foodreview')
      
          const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
          })
      
          const data = await res.json()
          if (data.secure_url) {
            uploadedUrls.push(data.secure_url) // แค่ push รูปใหม่เข้าไป ไม่ลบรูปเก่า
          }
        }
      }
      

      await fetch(`http://localhost:3000/api/review/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review_text: reviewText,
          rating,
          image1_url: uploadedUrls[0] || null,
          image2_url: uploadedUrls[1] || null,
          image3_url: uploadedUrls[2] || null,
        }),
      })

      onReviewUpdated()
      onClose()
    } catch (err) {
      console.error('Edit error:', err)
      alert('เกิดข้อผิดพลาดในการแก้ไขรีวิว')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return
    await fetch(`http://localhost:3000/api/review/${review.id}`, {
      method: 'DELETE',
    })
    onReviewDeleted()
    onClose()
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full">

        {/* ปุ่มกากบาท */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
          ✕
        </button>

        <h1 className="text-2xl font-bold text-pink-500 mb-4 text-center">Edit Review</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <textarea
            rows={4}
            placeholder="Type your review..."
            className="w-full p-3 border rounded focus:outline-pink-300"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          {/* ดาวให้คะแนน */}
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setRating(num)}
                className={num <= rating ? 'text-yellow-400 text-3xl' : 'text-gray-300 text-3xl'}
              >
                ★
              </button>
            ))}
          </div>

          {/* รูปเก่า */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`uploaded-${i}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* รูปใหม่ (ที่เลือกมาใหม่) */}
          {newImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {newImages.map((file, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(file)} alt={`new-upload-${i}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* อัปโหลดรูปใหม่ */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block mt-2"
          />
          <p className="text-sm text-gray-500">Maximum 3 pictures</p>

          <div className="flex flex-col items-center space-y-3">
            <button
              type="submit"
              className={`w-50 px-6 py-2 rounded text-white ${rating > 0 ? 'bg-pink-500 hover:bg-black' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={uploading || rating === 0}
            >
              {uploading ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="w-50 px-6 py-2 rounded text-white bg-red-500 hover:bg-black"
            >
              Delete Review
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
