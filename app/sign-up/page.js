'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    MBTItype: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { fullName, email, username, password, MBTItype } = formData;
    if (!fullName || !email || !username || !password || !MBTItype) {
      setError('Please fill out all fields.');
      return;
    }

    const checkRes = await fetch('http://localhost:3000/api/user');
    const users = await checkRes.json();
    const emailExists = users.some((u) => u.email === email);
    if (emailExists) {
      setError('This email is already registered.');
      return;
    }

    const res = await fetch('http://localhost:3000/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/sign-in');
    } else {
      setError('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-4xl font-bold text-[#ec96a4]  text-center mb-8">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded placeholder:italic"
          />

          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded placeholder:italic"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded placeholder:italic"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded pr-10 placeholder:italic"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl"
            >
              {showPassword ? '🙉' : '🙈'}
            </button>
          </div>

          <select
            name="MBTItype"
            value={formData.MBTItype}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded text-gray-800"
          >
            <option value="">Select your MBTI type</option>
            {[
              'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
              'ISTP', 'ISFP', 'INFP', 'INTP',
              'ESTP', 'ESFP', 'ENFP', 'ENTP',
              'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
            ].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-pink-300 text-white p-3 rounded hover:bg-black transition"
          >
            Sign Up
          </button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <a href="/sign-in" className="text-pink-500 hover:underline">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
