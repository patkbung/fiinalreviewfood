import Link from "next/link";

export default function adoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-11/12 max-w-3xl bg-white p-12 rounded-2xl shadow-xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-900">About</h1>

        <p className="text-xl text-gray-700">Something kub</p>

        <Link
          href="/home"
          className="inline-block mt-6 px-6 py-3 bg-pink-300 text-white rounded-full shadow hover:bg-black transition"
        >
          Back to HomePage
        </Link>
      </div>
    </div>
  );
}
