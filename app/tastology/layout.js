// app/tastology/layout.js
import TopBar from '@/components/TopBar'

export default function TastologyLayout({ children }) {
  return (
    <>
      <TopBar />
      <main>{children}</main>
    </>
  )
}
