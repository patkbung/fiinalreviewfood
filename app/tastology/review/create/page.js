'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' 
//import { useRouter, useSearchParams } from 'next/navigation'

export default function ReviewCreateModal({ restaurantId, onClose, onReviewSubmitted }) {
    const router = useRouter()
    //const searchParams = useSearchParams()
    const [reviewText, setReviewText] = useState('')
    const [images, setImages] = useState([])
    const [rating, setRating] = useState(0)
    const [uploading, setUploading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 3)
        setImages(files)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!restaurantId) {
            alert('ไม่พบ restaurantId กรุณาลองใหม่')
            return
        }

        if (rating === 0) {
            alert('กรุณาให้คะแนนดาวก่อนส่งรีวิว ⭐')
            return
        }

        setUploading(true)

        try {
            // ✅ อัปโหลดรูปภาพขึ้น Cloudinary
            const uploadedUrls = []
            for (const image of images) {
                const formData = new FormData()
                formData.append('file', image)
                formData.append('upload_preset', 'profile foodreview')

                const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                })

                const data = await res.json()
                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url)
                }
            }

            const user = JSON.parse(localStorage.getItem('user'))

            // ✅ คำนวณคะแนน XP
            let xp = 0
            if (reviewText.trim()) xp += 5
            xp += uploadedUrls.length * 5
            xp += rating // ⭐ รวมคะแนนดาวด้วย

            // ✅ ส่งข้อมูลแบบ JSON ไป backend
            const res = await fetch('http://localhost:3000/api/review/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    restaurant_id: restaurantId,
                    review_text: reviewText,
                    rating,
                    image1_url: uploadedUrls[0] || null,
                    image2_url: uploadedUrls[1] || null,
                    image3_url: uploadedUrls[2] || null,
                    xp
                })
            })

            if (res.ok) {
                await onReviewSubmitted()
                onClose()
            } else {
                alert('ส่งรีวิวไม่สำเร็จ')
            }

        } catch (err) {
            console.error('❌ Submit error:', err)
            alert('เกิดข้อผิดพลาดในการส่งรีวิว')
        } finally {
            setUploading(false)
        }

    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-xl p-6 rounded-lg relative shadow-lg">
                {/* ปุ่มกากบาท */}
                <button
                    onClick={() => setShowConfirm(true)}
                    className="absolute top-4 right-4 text-gray-500 text-xl"
                >
                    ✕
                </button>

                <h1 className="text-2xl font-bold text-pink-500 mb-4">รีวิวร้านอาหาร</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        rows={4}
                        placeholder="พิมพ์รีวิวของคุณ..."
                        className="w-full p-3 border rounded"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />

                    {/* ดาวให้คะแนน */}
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                type="button"
                                key={num}
                                onClick={() => setRating(num)}
                                className={num <= rating ? 'text-yellow-400 text-2xl' : 'text-gray-300 text-2xl'}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="block"
                    />
                    <p className="text-sm text-gray-500">เลือกรูปได้สูงสุด 3 รูป</p>

                    <button
                        type="submit"
                        className={`px-6 py-2 rounded text-white ${rating > 0 ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={uploading || rating === 0}
                    >
                        {uploading ? 'กำลังอัปโหลด...' : 'ส่งรีวิว'}
                    </button>

                </form>
            </div>

            {/* Confirm Popup */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
                        <p className="text-lg">แน่ใจหรือไม่ว่าคุณไม่ต้องการรีวิว?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-gray-200 px-4 py-2 rounded"
                                onClick={() => setShowConfirm(false)}
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => router.push('/home')}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
