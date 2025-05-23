'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would call an API for authentication
    // For demo purposes, we're just redirecting to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#273043]">
      {/* Left side with logo */}
      <div className="w-1/2 flex items-center justify-center bg-[#273043]">
        <div className="w-[400px] h-[400px] flex items-center justify-center">
          <img
            src="/purpleE.svg"
            alt="Onryl Logo"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-1/2 bg-[#1a1a1a] flex items-center justify-center">
        <div className="max-w-[400px] w-full p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-blue-500">Welcome back to Onryl!</h2>
            <p className="text-gray-400 mt-1">Please sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-gray-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Log in
              </Button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center">
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
            <div className="mt-2 text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-blue-500 hover:underline">
                Create an Onryl Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
