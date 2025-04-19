'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [reviews, setReviews] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [showEditMBTI, setShowEditMBTI] = useState(false)

    const MBTItypes = [
        'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
        'ISTP', 'ISFP', 'INFP', 'INTP',
        'ESTP', 'ESFP', 'ENFP', 'ENTP',
        'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
    ]

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`http://localhost:3000/api/user/${id}`)
            const data = await res.json()
            setUser(data)
        }
        if (id) fetchUser()
    }, [id])

    useEffect(() => {
        const fetchReviews = async () => {
            const res = await fetch(`http://localhost:3000/api/review/user/${id}`)
            const data = await res.json()
            setReviews(data)
        }
        if (id) fetchReviews()
    }, [id])

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
      
      
    const handleSaveAll = async () => {
        const updatedData = {
            avatar_url: previewUrl || user.avatar_url,
            MBTItype: user.MBTItype
        }
        await fetch(`http://localhost:3000/api/user/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        const updatedUser = { ...user, ...updatedData }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser)) // อัปเดต localStorage

        setShowPopup(false)
        setShowEditMBTI(false)

    }

    if (!user) return <div className="p-6 text-center">Loading...</div>

    const getBadge = (point) => {
        if (point <= 100) return 'นักชิมมือใหม่'
        if (point <= 200) return 'อร่อยหละสิ'
        if (point <= 300) return 'นักชิมเริ่มติดลมละ'
        if (point <= 400) return 'สุดยอดนักชิม'
        return 'วัยรุ่นร้อยโล'
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 relative">
        {/* โลโก้ Tastology มุมบนซ้าย */}
        <Link
          href="/home"
          className="absolute top-6 left-6 text-3xl font-bold text-pink-400 hover:underline"
        >
          Tastology
        </Link>

        
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="bg-white max-w-4xl mx-auto p-8 rounded-xl shadow-md">
                <div className="flex gap-6 items-center">
                    <div className="relative">
                        <img
                            src={user.avatar_url}
                            alt="avatar"
                            className="w-28 h-28 rounded-full border-4 border-pink-300"
                        />
                        <button
                            className="block mt-2 text-sm text-blue-500 hover:underline mx-auto"
                            onClick={() => setShowPopup(true)}
                        >
                            Change Image
                        </button>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-pink-400">{user.username}</h1>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-700">
                            MBTI: {user.MBTItype}{' '}
                            <button
                                className="text-blue-500 underline ml-2 text-xs"
                                onClick={() => setShowEditMBTI(true)}
                            >
                                edit
                            </button>
                        </p>
                        <p className="text-sm text-gray-700">Point: {user.Point}</p>
                        <p className="text-sm text-gray-700">Badge: {getBadge(user.Point)}</p>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSaveAll}
                        className="bg-pink-400 text-white px-6 py-2 rounded hover:bg-pink-500"
                    >
                        Save All Changes
                    </button>
                </div>
                </div>
                {/* Recent section */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Recent</h2>
                    <div className="flex gap-4">
                        {reviews.slice(0, 3).map((r, i) => (
                            <div key={i} className="p-4 border rounded w-32 text-center text-sm">
                                {r.rating}/5<br />{r.review_text.slice(0, 10)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Reviews */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">All your reviews</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {reviews.map((r) => (
                            <div key={r.id} className="p-4 bg-gray-100 rounded">
                                <p className="text-sm font-bold">{r.rating}/5</p>
                                <p className="text-xs">{r.review_text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popup: Change Avatar */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
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

            {/* Popup: Edit MBTI */}
            {showEditMBTI && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h3 className="text-lg font-bold mb-4">Edit MBTI Type</h3>
                        <select
                            className="w-full p-2 border rounded mb-4"
                            defaultValue={user.MBTItype}
                            onChange={(e) => setUser({ ...user, MBTItype: e.target.value })}
                        >
                            {MBTItypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                onClick={() => setShowEditMBTI(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500"
                                onClick={handleSaveAll}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
    
}
