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
    <header className="sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/tastology/home" className="text-2xl font-bold text-gray-800 hover:text-pink-500 transition">
          Tastology
        </Link>

        {/* Nav */}
        <nav className="flex items-center space-x-6">
          <Link href="/tastology/contact" className="text-gray-700 hover:text-pink-500 transition">Contact</Link>
          <Link href="/tastology/about" className="text-gray-700 hover:text-pink-500 transition">About</Link>

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
                  className="w-9 h-9 rounded-full object-cover border border-pink-500 shadow"
                />
                <span className="text-pink-600 font-medium hover:underline">{user.username}</span>
              </Link>

              {/* Logout */}
              {showLogout && (
                <button
                  onClick={handleLogout}
                  className="absolute top-8 right-0 bg-white/90 text-black px-3 py-1 text-sm rounded-full shadow-md hover:bg-pink-200 transition"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <Link href="/sign-in" className="text-pink-500 hover:underline">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
