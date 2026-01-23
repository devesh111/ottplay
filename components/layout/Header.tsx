'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsLoggedIn(!!token)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              OTT
            </div>
            <span className="font-bold text-lg hidden sm:inline">OTT Platform</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/content/movies" className="text-gray-700 hover:text-blue-600">
              Movies
            </Link>
            <Link href="/content/shows" className="text-gray-700 hover:text-blue-600">
              Shows
            </Link>
            <Link href="/content/live-tv" className="text-gray-700 hover:text-blue-600">
              Live TV
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/watchlist">
                  <Button variant="outline">Watchlist</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline">Profile</Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/content/movies" className="block py-2 text-gray-700">
              Movies
            </Link>
            <Link href="/content/shows" className="block py-2 text-gray-700">
              Shows
            </Link>
            <Link href="/content/live-tv" className="block py-2 text-gray-700">
              Live TV
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/watchlist" className="block py-2 text-gray-700">
                  Watchlist
                </Link>
                <Link href="/profile" className="block py-2 text-gray-700">
                  Profile
                </Link>
                <Button onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block">
                  <Button className="w-full" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
