'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [showLogout, setShowLogout] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])
  

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setShowLogout(false)
    router.push('/home') // หรือ '/' ก็ได้
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-end">
        {user ? (
          <div
            className="relative flex items-center gap-2 cursor-pointer"
            onClick={() => router.push(`/tastology/dashboard/${user.id}`)}
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-pink-300 hover:scale-105 transition"
            />
            <span className="text-pink-500 font-semibold">{user.username}</span>

            {/* ปุ่ม Logout เมื่อ hover */}
            {showLogout && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleLogout()
                }}
                className="absolute top-10 right-0 bg-red-400 text-white px-3 py-1 rounded shadow hover:bg-red-500"
              >
                Logout
              </button>
            )}
          </div>
        ) : (
          <Link href="/sign-in">
            <button className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500">
              Sign In
            </button>
          </Link>
        )}
      </div>

      {/* Body content */}
      <div className="mt-12 text-center text-2xl font-bold text-gray-600">
        Welcome to Tastology 🍽️
      </div>
    </div>
  )
}
