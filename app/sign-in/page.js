'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter(); //sign in เสร็จเปลี่ยนหน้า ไป home ใช้อันนี้
  const [formData, setFormData] = useState({
    //email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
//เอาไปเช็คจ้าาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาาา
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch('http://localhost:3000/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'signin',
        username: formData.username,
        password: formData.password,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(result));
      router.push('/tastology/home');
    } else {
      setError(result.error || 'Sign in failed.');
    }
  } catch (err) {
    console.error('Sign in error:', err);
    setError('Something went wrong.');
  }
};

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    router.push('/tastology/home');
  }
}, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="https://res.cloudinary.com/dla8rkqp6/image/upload/v1745665258/gsbi2stkjf1nv3rjbn4z.avif" alt="background" className="w-full h-full object-cover brightness-90" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-pink-200 text-white">
          <h2 className="text-4xl font-bold mb-6 text-center text-black">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl"
              >
                {showPassword ? '🙉' : '🙈'}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-pink-400 text-white p-3 rounded-xl hover:bg-black transition"
            >
              Sign In
            </button>

            <p className="mt-4 text-center text-sm">
              Don’t have an account?{' '}
              <Link href="/sign-up" className="text-black hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
