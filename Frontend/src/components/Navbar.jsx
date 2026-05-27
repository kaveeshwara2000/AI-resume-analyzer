import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Sun, Moon, LogOut, LayoutDashboard, Sparkles, Menu, X } from 'lucide-react'

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">

          {/* Logo / Brand */}
          <div className="flex items-center min-w-0 shrink-0">
            <Link to="/dashboard" className="flex items-center space-x-2 min-w-0" onClick={closeMobile}>
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-200 dark:shadow-none">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400 truncate">
                Resume Analyzer
              </span>
              <span className="sm:hidden text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                ResumeAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/analyze"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/analyze')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>New Analysis</span>
            </Link>
          </div>

          {/* Right Side Action Area */}
          <div className="flex items-center space-x-1 sm:space-x-2">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Profile (Desktop) */}
            {user && (
              <div className="hidden md:flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-3">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[120px]">
                    {user.username}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold uppercase text-sm">
                  {user.username.charAt(0)}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Avatar only on mobile (when logged in) */}
            {user && (
              <div className="flex md:hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold uppercase text-xs">
                {user.username.charAt(0)}
              </div>
            )}

            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md animate-slide-down">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            <Link
              to="/dashboard"
              onClick={closeMobile}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/analyze"
              onClick={closeMobile}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive('/analyze')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>New Analysis</span>
            </Link>

            {/* Divider + user info + logout */}
            {user && (
              <>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 mt-2">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold uppercase text-xs">
                        {user.username.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.username}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); closeMobile() }}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex-shrink-0"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
