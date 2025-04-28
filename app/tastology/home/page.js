// หน้า home 
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
    fetch('/api/restaurant/mbti/random')//อันนี้ตัวที่ สุ่ม mbti
      .then(res => res.json())
      .then(data => {
        setMbtiRestaurants(data.restaurants)
        setRandomMBTI(data.mbtiType) //  set MBTI ที่สุ่ม
      })
      .catch(err => console.error(' Fetch random MBTI restaurants failed', err))
  }, [])
  //ค้นหาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาา
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
    <div className="scroll-smooth">
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* HERO SECTION */}
        <div
          className="relative h-screen w-full bg-fixed bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dla8rkqp6/image/upload/v1745654280/vuo1qo47wd4wzrnc7yjv.avif')",
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
  
          {/* Welcome Text + Search */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white text-5xl md:text-7xl font-bold drop-shadow-xl mb-6">
              Welcome to Tastology
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl">
              Discover restaurants recommended by your MBTI and your mood.
            </p>
  
            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSearch()
              }}
              className="w-full max-w-md placeholder-gray-500 backdrop-blur-md rounded-full overflow-hidden shadow-lg flex items-center px-4"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search restaurants..."
                className="w-full px-3 py-3 text-gray-900 placeholder-gray-400 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="bg-black text-white px-5 py-2 rounded-full hover:bg-pink-300 transition font-medium"
              >
                Search
              </button>
            </form>
          </div>
        </div>
  
        {/* MBTI RECOMMENDS */}
        <div
          className="relative w-full bg-fixed bg-cover bg-center py-20"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dla8rkqp6/image/upload/v1745654280/vuo1qo47wd4wzrnc7yjv.avif')",
          }}
        >
          <div className="max-w-7xl mx-auto px-4">
            {mbtiRestaurants.length > 0 && (
              <section className="bg-white/60 backdrop-blur-md rounded-3xl p-10 shadow-lg mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
                  MBTI <span className="text-pink-500">[{randomMBTI}]</span> Recommends
                </h2>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {mbtiRestaurants.map((r, index) => (
                    <div
                      key={`mbti-${r.id}-${index}`}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col"
                    >
                      <img
                        src={r.image_url || '/default-restaurant.png'}
                        alt={r.name}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                      <h3 className="text-xl font-semibold text-gray-800">{r.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-3 flex-grow">{r.description}</p>
                      <Link
                        href={`/tastology/restaurant/${r.id}`}
                        className="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium text-center hover:bg-black transition"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
  
        {/* SEARCH RESULTS */}
        {searchTerm && (
          <div
            className="relative w-full bg-fixed bg-cover bg-center py-20"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/dla8rkqp6/image/upload/v1745654280/vuo1qo47wd4wzrnc7yjv.avif')",
            }}
            ref={resultRef}
          >
            <div className="max-w-7xl mx-auto px-4">
              <section className="bg-white/60 backdrop-blur-md rounded-3xl p-10 shadow-lg mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                  Search Results
                </h2>
  
                {searchResults.length === 0 ? (
                  <p className="text-center text-gray-500">ไม่พบผลลัพธ์ที่คุณค้นหา</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {searchResults.map((r, index) => (
                      <div
                        key={`search-${r.id}-${index}`}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col"
                      >
                        <img
                          src={r.image_url || '/default-restaurant.png'}
                          alt={r.name}
                          className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">{r.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-3 flex-grow">{r.description}</p>
                        <Link
                          href={`/tastology/restaurant/${r.id}`}
                          className="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium text-center hover:bg-black transition"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )}