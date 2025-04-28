'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  
    const { email, username, password, MBTItype } = formData;
  
    if (!email || !username || !password || !MBTItype) {
      setError('Please fill out all fields.');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'signup',
          email,
          username,
          password,
          MBTItype,
        }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        router.push('/sign-in');
      } else {
        setError(result.error || 'Sign-up failed. Please try again.');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('Something went wrong.');
    }
  };
  
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-pink-200 text-white">
          <h2 className="text-4xl font-bold mb-6 text-center text-black">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl placeholder:italic"
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl placeholder:italic"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl pr-10 placeholder:italic"
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

            <select
              name="MBTItype"
              value={formData.MBTItype}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl text-gray-800"
              required
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

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-pink-400 text-white p-3 rounded-xl hover:bg-black transition"
            >
              Sign Up
            </button>

            <p className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <a href="/sign-in" className="text-black hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
