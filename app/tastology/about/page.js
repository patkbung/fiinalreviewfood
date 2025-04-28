'use client'

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dla8rkqp6/image/upload/v1745665258/gsbi2stkjf1nv3rjbn4z.avif"
          alt="background"
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
      
        <div className="flex flex-1 justify-center items-center p-6">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-pink-200 text-white text-center">
            <h1 className="text-4xl font-bold mb-6 text-black">About</h1>
            <p className="text-white text-lg leading-relaxed">
              เว็บไซต์ที่ให้นักชิมมารีวิวอาหาร<br />
              เพื่อรับฉายาสุดพิเศษจากการรีวิวอาหารแต่ละร้าน
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}