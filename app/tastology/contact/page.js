'use client'
import TopBar from '@/components/TopBar'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center items-center py-16 px-4">
        <div className="bg-white shadow-lg rounded-xl p-20 max-w-md w-full border border-pink-100">
          <h1 className="text-3xl font-bold text-pink-500 mb-4 text-center">Contact Us</h1>
          <p className="text-gray-700 text-center">
            หากมีคำถาม หรือต้องการความช่วยเหลือ <br />
            ติดต่อเราผ่านอีเมล: <span className="text-pink-600 font-medium">support@tastology.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}
