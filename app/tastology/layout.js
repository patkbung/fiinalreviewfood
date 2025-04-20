// app/tastology/layout.js
'use client'

import TopBar from '@/components/TopBar'

export default function TastologyLayout({ children }) {
  return (
    <div>
      <TopBar />
      <main>{children}</main>
    </div>
  )
}
