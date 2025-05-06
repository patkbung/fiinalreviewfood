'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import TopBar from '@/components/TopBar'
import ReviewEditModal from '@/tastology/review/components/ReviewEditModal'

export default function DashboardPage() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [editingReview, setEditingReview] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [showEditMBTI, setShowEditMBTI] = useState(false)
  const [noReviewMsg, setNoReviewMsg] = useState('')

  const MBTItypes = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
  ]
  //---------------------------------------------------------------------------------
//ดึงข้อมมูล user มา
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/api/user/${id}`);
      const data = await res.json();
      setUser(data);
    };
    if (id) fetchUser();
  }, [id]);

  //โหลดรีวิวของ user นั้นมาด้วย
  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);
 
  const fetchReviews = async () => {
    const res = await fetch(`http://localhost:3000/api/review/user/${id}`);
    const data = await res.json();
//เรียงลำดับจาก ล่าสุด -> เก่าสุด
    if (data.reviews && data.reviews.length > 0) {
      const sortedReviews = data.reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setReviews(sortedReviews);
      setNoReviewMsg('');
    } else {
      setReviews([]);
      setNoReviewMsg(data.message || 'ยังไม่มีรีวิว');
    }
  };
//----------------------------------------------------------------------------
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'profile foodreview')

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (data.secure_url) {
      setPreviewUrl(data.secure_url)
      setSelectedFile(file)
    } else {
      alert('Upload failed')
    }
  }
//----------------------------------------------------------------------------
  const handleSaveAll = async () => {
    const updatedData = {
      avatar_url: previewUrl || user.avatar_url,
      MBTItype: user.MBTItype
    }
    await fetch(`http://localhost:3000/api/user/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))

    setShowPopup(false)
    setShowEditMBTI(false)
  }
//--------------------โหลดข้อมูลใหม่ รึเฟรชข้อมุลใหม่--------------------------------------------------------
  const handleReviewUpdated = () => {
    fetchReviews();
  }

  const handleReviewDeleted = () => {
    fetchReviews();
  }
//---------------------------------------------------------------------------
  if (!user) return <div className="p-6 text-center">Loading...</div>

  const getBadge = (point) => {
    if (point <= 100) return 'นักชิมมือใหม่'
    if (point <= 200) return 'อร่อยหละสิ'
    if (point <= 300) return 'นักชิมเริ่มติดลมละ'
    if (point <= 400) return 'สุดยอดนักชิม'
    return 'วัยรุ่นร้อยโล'
  }
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center brightness-99" style={{ backgroundImage: "url('https://res.cloudinary.com/dla8rkqp6/image/upload/v1745665906/gxkedroc0htwqm77lqwo.avif')" }} />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      </div>

      {/* Main Content top  */}
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-pink-200">
          <div className="flex gap-6 items-center">
            <div className="relative">
              <img src={user.avatar_url?.trim() ? user.avatar_url : '/default-avatar.png'} alt="avatar" className="w-32 h-32 rounded-full border-4 border-pink-300 object-cover shadow-md" />
              <button className="block mt-2 text-sm text-pink-500 hover:underline mx-auto" onClick={() => setShowPopup(true)}>Change Image</button>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-pink-500 drop-shadow-sm">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-3sm text-gray-700">MBTI: {user.MBTItype}<button className="text-pink-400 hover:underline ml-2 text-x" onClick={() => setShowEditMBTI(true)}>edit</button></p>
              <p className="text-3sm text-gray-700">Point: {user.Point}</p>
              <p className="text-3sm text-gray-700">Badge: {getBadge(user.Point)}</p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={handleSaveAll} className="bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-black shadow transition-all">confirm</button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          {reviews.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-xl mb-4">ยังไม่มีรีวิว เริ่มรีวิวเลย</p>
              <Link href="/tastology/home">
                <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-full">
                  เริ่มรีวิว
                </button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-4 text-black">All your reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">



                {reviews.map((r) => (
                  <div key={r.id} className="relative bg-white p-4 rounded-lg shadow-md">
                    <span className="absolute top-2 right-2 bg-pink-400 text-white text-xs px-2 py-1 rounded">{r.rating}/5</span>
                    <div className="flex gap-2 mb-2">
                      <img src={r.restaurant_image || '/default-restaurant.png'} alt="restaurant" className="w-14 h-14 rounded-full object-cover" />
                      <div>
                        <Link href={`/tastology/restaurant/${r.restaurant_id}`}>
                          <p className="text-sm font-semibold text-pink-500 hover:underline cursor-pointer">{r.restaurant_name}</p>
                        </Link>
                        <p className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{r.review_text}</p>
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      {[r.image1_url, r.image2_url, r.image3_url].filter(Boolean).map((img, i) => (
                        <img key={i} src={img} alt="review" className="w-full h-20 object-cover rounded" />
                      ))}
                    </div>
                    <button onClick={() => setEditingReview(r)} className="w-full mt-2 bg-pink-500 text-white py-2 rounded hover:bg-pink-600">
                      Edit Review
                      </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showPopup && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h3 className="text-lg font-bold mb-4">Change Profile Image</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded mb-4"
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full mx-auto mb-4" />
              )}
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500"
                  onClick={handleSaveAll}
                >
                  Save Change
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditMBTI && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
              <h3 className="text-lg font-bold mb-4">Edit MBTI Type</h3>
              <select
                className="w-full p-2 border rounded mb-4"
                value={user.MBTItype}
                onChange={(e) => setUser({ ...user, MBTItype: e.target.value })}
              >
                {MBTItypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  onClick={() => setShowEditMBTI(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
                  onClick={handleSaveAll}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


        {editingReview && (
          <ReviewEditModal
            review={editingReview}
            onClose={() => setEditingReview(null)}
            onReviewUpdated={handleReviewUpdated}
            onReviewDeleted={handleReviewDeleted}
          />
        )}
      </div>
    </div>
  )
}
