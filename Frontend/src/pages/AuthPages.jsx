import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Mail, Lock, User, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'

// Common Auth Layout Sidebar Component
const AuthSidebar = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative overflow-hidden flex-col justify-between p-12">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/50 via-slate-950 to-violet-950/50 z-0"></div>
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl z-0"></div>
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl z-0"></div>

      <div className="relative z-10 flex items-center space-x-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          Resume Analyzer
        </span>
      </div>

      <div className="relative z-10 my-auto space-y-8 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
          Optimize Your Resume For ATS Filters.
        </h1>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-300">Deep AI Matching Engine</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-300">ATS Compatibility Feedback</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-300">Improvement Suggestions</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-xs text-slate-500">
        © 2026 Resume Analyzer. All rights reserved.
      </div>
    </div>
  )
}

export const LoginPage = ({ darkMode, toggleDarkMode }) => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(usernameOrEmail, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left side sidebar */}
      <AuthSidebar />

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="w-full max-w-md space-y-6 animate-fade-in">

          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center space-x-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Resume Analyzer
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign in to manage and analyze your resumes
            </p>
          </div>

          {error && (
            <div className="flex items-start space-x-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-3 rounded-lg text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Username or Email
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 transition-all duration-200"
                    placeholder="Enter your username or email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 px-4 text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
              ) : (
                <span className="flex items-center">
                  Sign in <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const RegisterPage = ({ darkMode, toggleDarkMode }) => {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await register(username, email, password)
    if (result.success) {
      setSuccess(true)
      // Automatically login user
      const loginResult = await login(username, password)
      if (loginResult.success) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left side sidebar */}
      <AuthSidebar />

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="w-full max-w-md space-y-6 animate-fade-in">

          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center space-x-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Resume Analyzer
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Start parsing your resumes with AI filters today
            </p>
          </div>

          {error && (
            <div className="flex items-start space-x-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-3 rounded-lg text-rose-600 dark:text-rose-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start space-x-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-3 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>Account created successfully! Logging you in...</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Username
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 transition-all duration-200"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 transition-all duration-200"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 px-4 text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
              ) : (
                <span className="flex items-center">
                  Sign up <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
