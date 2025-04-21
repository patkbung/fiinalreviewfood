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
    <div className="flex items-center justify-between px-6 py-4 bg-pink-100 shadow-md mb-4">
      <Link href="/tastology/home" className="text-2xl font-bold text-black">
        Tastology
      </Link>

      <div className="flex items-center space-x-4">
        <Link href="/tastology/contact" className="text-black hover:text-pink-500">Contact</Link>
        <Link href="/tastology/about" className="text-black hover:text-pink-500">About</Link>

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
                className="w-10 h-10 rounded-full object-cover border border-pink-600"
              />
              <span className="text-pink-500 font-semibold">{user.username}</span>
            </Link>

            {/* Logout hover */}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="absolute top-10 right-2 bg-pink-200 text-black text-sm px-3 py-1 rounded shadow hover:bg-pink-500 z-10"
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
