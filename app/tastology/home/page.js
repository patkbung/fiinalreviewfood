'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import TopBar from '@/components/TopBar'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [mbtiRestaurants, setMbtiRestaurants] = useState([])
  const [randomMBTI, setRandomMBTI] = useState('ENFP') // เก็บ MBTI ที่สุ่มมา
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const resultRef = useRef(null)

  useEffect(() => {
    fetch('/api/restaurant/mbti/random')
      .then(res => res.json())
      .then(data => {
        setMbtiRestaurants(data.restaurants)
        setRandomMBTI(data.mbtiType) //  set MBTI ที่สุ่ม
      })
      .catch(err => console.error(' Fetch random MBTI restaurants failed', err))
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
      console.error(' Search failed', err)
      setSearchResults([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-9xl mask-b-from-neutral-400 text-pink-500 text-center mb-8">Welcome</h1>

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
          className="bg-pink-100 text-black px-4 py-2 rounded hover:bg-pink-300"
        >
          Search
        </button>
      </form>

      {/* 🌟 MBTI Recommends */}
      {mbtiRestaurants.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-4 text-black">
            MBTI [{randomMBTI}] recommends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mbtiRestaurants.map((r, index) => (
              <div key={`mbti-${r.id}-${index}`} className="relative bg-pink-200 p-4 rounded-lg shadow-md">
                <img
                  src={r.image_url || '/default-restaurant.png'}
                  alt={r.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <p className="text-lg font-light text-black">{r.name}</p>
                <p className="text-sm text-gray-500">{r.description}</p>
                <Link
                  href={`/tastology/restaurant/${r.id}`}
                  className="inline-block mt-3 border-white text-black px-4 py-2 rounded-2xl hover:bg-pink-300"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔍 Search Results */}
      {searchTerm && (
        <section ref={resultRef} className="mt-8">
          <h2 className="text-4xl font-bold mb-4 text-black text-center">Search Results</h2>
          {searchResults.length === 0 ? (
            <p className="text-center text-gray-500">ไม่พบผลลัพธ์ที่คุณค้นหา</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((r, index) => (
                <div key={`search-${r.id}-${index}`} className="relative bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={r.image_url || '/default-restaurant.png'}
                    alt={r.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <p className="text-lg font-light text-black">{r.name}</p>
                  <p className="text-sm text-gray-500">{r.description}</p>
                  <Link
                    href={`/tastology/restaurant/${r.id}`}
                    className="inline-block mt-3 bg-pink-300 text-white px-4 py-2 rounded-2xl hover:bg-pink-600"
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
