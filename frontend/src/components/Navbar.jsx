import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Search, User, LogOut, Plus, Menu, X, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ isDark, setIsDark }) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navLinkClass = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-primary-600/80 hover:text-primary-600 hover:bg-primary-50 transition-all dark:text-gh-text-secondary dark:hover:text-gh-accent dark:hover:bg-gh-bg-tertiary/60"

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <nav className="sticky top-0 z-[120] bg-future-surface/80 dark:bg-gh-bg-secondary/90 backdrop-blur-xs border-b border-future-border dark:border-gh-border shadow-halo transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="text-2xl transition-transform duration-300 group-hover:-translate-y-0.5">📝</span>
            <span className="font-bold text-xl text-slate-800 dark:text-gh-text tracking-wide">Portfolio</span>
          </Link>


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Navigation Links */}
            <Link to="/" className={navLinkClass}>
              Home
            </Link>
            <Link to="/search" className={navLinkClass}>
              Search
            </Link>
            <Link to="/portfolios" className={navLinkClass}>
              Portfolios
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl text-future-muted dark:text-gh-text-secondary hover:bg-white/60 hover:-translate-y-0.5 dark:hover:bg-gh-bg-tertiary transition-all duration-300"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 rounded-full border border-primary-100/70 bg-white/80 px-3 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/10">
                  <Link to="/dashboard" className={navLinkClass}>
                    Dashboard
                  </Link>
                  <span className="h-5 w-px bg-primary-100/60 dark:bg-white/10" aria-hidden />
                  <Link to="/my-portfolios" className={navLinkClass}>
                    My Portfolios
                  </Link>
                </div>
                <Link
                  to="/my-portfolios/create"
                  className="btn btn-primary btn-compact hidden lg:inline-flex gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Buat Baru</span>
                </Link>
                <div className="relative group z-[60]">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent hover:bg-primary-50 dark:hover:bg-gh-bg-tertiary/60 transition-all">
                    <User className="h-4 w-4" />
                    <span>{user?.username}</span>
                  </button>

                  <div className="absolute right-0 mt-3 w-56 bg-future-surface-strong dark:bg-gh-bg-secondary rounded-2xl shadow-xl py-2 z-[70] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-future-border dark:border-gh-border backdrop-blur-xs">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-future-muted dark:text-gh-text-secondary hover:bg-white/70 dark:hover:bg-gh-bg-tertiary transition-colors rounded-xl mx-2"
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to={`/u/${user?.username}`}
                      className="block px-4 py-2 text-sm text-future-muted dark:text-gh-text-secondary hover:bg-white/70 dark:hover:bg-gh-bg-tertiary transition-colors rounded-xl mx-2"
                    >
                      Public Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-future-muted dark:text-gh-text-secondary hover:bg-white/70 dark:hover:bg-gh-bg-tertiary flex items-center space-x-2 transition-colors rounded-xl mx-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-compact hidden lg:inline-flex"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-compact"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-future-muted dark:text-gh-text-tertiary hover:text-primary-500 dark:hover:text-gh-accent transition-all"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-future-border dark:border-gh-border">
            {/* Theme Toggle Mobile */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-full text-left px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent flex items-center space-x-2 transition-all"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              <Link
                to="/"
                className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/portfolios"
                className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolios
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-portfolios"
                    className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Portfolios
                  </Link>
                  <Link
                    to="/my-portfolios/create"
                    className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Portfolio
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-future-muted dark:text-gh-text-secondary hover:text-primary-600 dark:hover:text-gh-accent transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
