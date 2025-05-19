'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle redirect after successful login
  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (success) {
      redirectTimer = setTimeout(() => {
        router.push('/');
      }, 2000); // Redirect after 2 seconds
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await signIn(email, password);
      if (response.success) {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        setSuccess(true); // Set success state instead of immediate redirect
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Generate particles only on client-side
  const renderParticles = () => {
    if (!isMounted) return null;
    
    return [...Array(20)].map((_, i) => (
      <div 
        key={i} 
        className={`particle particle-${i % 4}`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${15 + Math.random() * 15}s`
        }}
      ></div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - animated background */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-700/80 to-purple-800/80 animate-gradient-x"></div>
          
          {/* Floating particles - client-side only */}
          <div className="particle-container">
            {isMounted && renderParticles()}
          </div>
          
          {/* Animated lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
              </linearGradient>
            </defs>
            <g className="lines">
              {[...Array(6)].map((_, i) => (
                <path 
                  key={i}
                  d={`M0,${100 + i * 150} Q${400 + i * 50},${50 + i * 100} ${800 + i * 100},${200 + i * 50}`}
                  stroke="url(#line-gradient)"
                  strokeWidth="1"
                  fill="none"
                  className={`animate-dash-${i % 3}`}
                />
              ))}
            </g>
          </svg>
          
          {/* Glowing orbs */}
          <div className="absolute inset-0">
            <div className="glow-orb glow-orb-1"></div>
            <div className="glow-orb glow-orb-2"></div>
            <div className="glow-orb glow-orb-3"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white animate-fade-in">Fleet Manager</h1>
          <p className="text-blue-100 mt-4 text-lg animate-slide-up">Manage your fleet operations with ease and efficiency</p>
        </div>
        
        <div className="space-y-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl animate-fade-in-delay-1 hover:bg-white/20 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-2">Streamlined Operations</h3>
            <p className="text-blue-100">Manage vehicles, drivers, and maintenance in one place</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl animate-fade-in-delay-2 hover:bg-white/20 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Tracking</h3>
            <p className="text-blue-100">Monitor your fleet&rsquo;s performance and location in real-time</p>
          </div>
        </div>
      </div>
      
      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <svg className="h-16 w-16 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
          </div>
          
          {success ? (
            <div className="mt-8 text-center">
              <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                <svg className="h-12 w-12 text-green-500 mx-auto animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-green-800">Login Successful!</h3>
                <p className="mt-2 text-green-600">Redirecting to dashboard...</p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full animate-[progress_2s_ease-in-out]"></div>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg 
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                           text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 
                           hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign in
                      <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&rsquo;t have an account?{' '}
              <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Contact your administrator
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 