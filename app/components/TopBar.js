'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TopBar() {
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
    router.push('/sign-in')
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md mb-4">
      <Link href="/tastology/home" className="text-2xl font-bold text-pink-500">
        Tastology
      </Link>

      <div className="flex items-center space-x-4">
        <Link href="/tastology/contact" className="text-gray-600 hover:text-pink-500">Contact</Link>
        <Link href="/tastology/about" className="text-gray-600 hover:text-pink-500">About</Link>

        {user ? (
          <div
            className="relative flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            <Link href={`/tastology/dashboard/${user.id}`} className="flex items-center gap-2">
              <img
                src={user?.avatar_url?.trim() || '/default-avatar.png'}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border border-pink-300"
              />
              <span className="text-pink-500 font-semibold">{user.username}</span>
            </Link>

            {/* Logout Button on hover */}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="absolute top-9 left-4 bg-pink-200 text-white text-sm px-3 py-1 rounded shadow hover:bg-pink-500 z-10"
              >
                Logout
              </button>
            )}
          </div>
        ) : (
          <Link href="/sign-in" className="text-pink-400 hover:underline">Sign In</Link>
        )}
      </div>
    </div>
  )
}
