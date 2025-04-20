'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import TopBar from '@/components/TopBar'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [mbtiRestaurants, setMbtiRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const resultRef = useRef(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      const typeToUse = parsedUser.MBTItype || 'ENFJ'
      fetch(`/api/restaurant/mbti/${typeToUse}`)
        .then(res => res.json())
        .then(data => {
          setMbtiRestaurants(data.restaurants || [])
        })
        .catch(err => console.error('❌ Fetch MBTI restaurants failed', err))
    }
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    try {
      const res = await fetch(`/api/restaurant/search?q=${searchTerm}`)
      if (!res.ok) throw new Error('Search API returned HTML')
  
      const data = await res.json()
      setSearchResults(data.restaurants || [])
  
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error('❌ Search failed', err)
      setSearchResults([])
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-5xl font-bold text-gray-700 text-center mb-8">Welcome </h1>

      {/* 🔍 Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
        className="flex justify-center gap-2 mb-10"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search restaurants..."
          className="w-96 p-2 border border-pink-300 rounded focus:outline-none"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Search
        </button>
      </form>

      {/* 🌟 MBTI Recommends */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4 text-pink-500">
          MBTI [{user?.MBTItype || 'ENFJ'}] recommends
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mbtiRestaurants.map((r) => (
            <div key={r.id} className="relative bg-white p-4 rounded-lg shadow-md">
              <img
                src={r.image_url || '/default-restaurant.png'}
                alt={r.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <p className="text-lg font-semibold text-pink-500">{r.name}</p>
              <p className="text-sm text-gray-500">{r.description}</p>
              <Link
                href={`/tastology/restaurant/${r.id}`}
                className="inline-block mt-3 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 🔍 Search Results */}
      {searchTerm && (
        <section ref={resultRef} className="mt-8">
          
          <h2 className="text-xl font-semibold mb-4 text-pink-500">Search Results</h2>
          {searchResults.length === 0 ? (
            <p className="text-center text-gray-500">ไม่พบผลลัพธ์ที่คุณค้นหา</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((r) => (
                <div key={r.id} className="relative bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={r.image_url || '/default-restaurant.png'}
                    alt={r.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <p className="text-lg font-semibold text-pink-500">{r.name}</p>
                  <p className="text-sm text-gray-500">{r.description}</p>
                  <Link
                    href={`/tastology/restaurant/${r.id}`}
                    className="inline-block mt-3 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
