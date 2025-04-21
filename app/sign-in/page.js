'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:3000/api/user');
    const users = await res.json();

    const match = users.find(
      (u) => u.username === formData.username && u.password === formData.password
    );

    if (match) {
      localStorage.setItem('user', JSON.stringify(match));
      router.push('tastology/home');
    } else {
      setError('username or password is incorrect.');
    }
  };
//ถ้าเคย log in เข้ามาแล้วก็ข้ามไปหน้า home เลย
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      router.push('/home');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-6 text-center">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="username"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl"
            >
              {showPassword ? '🙉' : '🙈'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-pink-300 text-white p-3 rounded hover:bg-black transition"
          >
            Sign In
          </button>

          <p className="mt-4 text-center text-sm">
            Don’t have an account?{' '}
            <Link href="/sign-up" className="text-red-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
