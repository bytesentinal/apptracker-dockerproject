'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome back</h1>
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none"
            placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none"
            placeholder="Password" type="password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition">
            Login
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-4">
          No account? <Link href="/register" className="text-indigo-400">Register</Link>
        </p>
      </div>
    </div>
  );
}