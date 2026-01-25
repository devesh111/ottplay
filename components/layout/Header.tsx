'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Menu, X, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsLoggedIn(!!token)
    const savedLang = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLang) setLanguage(savedLang)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&lang=${language}`)
    }
  }

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    router.push('/')
  }

  const translations = {
    en: {
      movies: 'Movies',
      shows: 'Shows',
      liveTV: 'Live TV',
      watchlist: 'Watchlist',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up',
      subscribe: 'Subscribe',
      search: 'Search...',
    },
    ar: {
      movies: 'الأفلام',
      shows: 'المسلسلات',
      liveTV: 'التلفاز المباشر',
      watchlist: 'قائمة المشاهدة',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      subscribe: 'اشتراك',
      search: 'بحث...',
    },
  }

  const t = translations[language]

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
              {t.movies}
            </Link>
            <Link href="/content/shows" className="text-gray-700 hover:text-blue-600">
              {t.shows}
            </Link>
            <Link href="/content/live-tv" className="text-gray-700 hover:text-blue-600">
              {t.liveTV}
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative">
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('ar')}>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/watchlist">
                  <Button variant="outline">{t.watchlist}</Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline">{t.profile}</Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive">
                  {t.logout}
                </Button>
              </>
            ) : (
              <>
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">{t.login}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <LoginForm onSuccess={() => {
                      setLoginOpen(false)
                      setIsLoggedIn(true)
                    }} />
                  </DialogContent>
                </Dialog>
                <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button>{t.signup}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <RegisterForm onSuccess={() => {
                      setRegisterOpen(false)
                      setLoginOpen(true)
                    }} />
                  </DialogContent>
                </Dialog>
              </>
            )}
            <Button className="bg-purple-600 hover:bg-purple-700">{t.subscribe}</Button>
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
              {t.movies}
            </Link>
            <Link href="/content/shows" className="block py-2 text-gray-700">
              {t.shows}
            </Link>
            <Link href="/content/live-tv" className="block py-2 text-gray-700">
              {t.liveTV}
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/watchlist" className="block py-2 text-gray-700">
                  {t.watchlist}
                </Link>
                <Link href="/profile" className="block py-2 text-gray-700">
                  {t.profile}
                </Link>
                <Button onClick={handleLogout} className="w-full">
                  {t.logout}
                </Button>
              </>
            ) : (
              <>
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      {t.login}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <LoginForm onSuccess={() => {
                      setLoginOpen(false)
                      setIsLoggedIn(true)
                    }} />
                  </DialogContent>
                </Dialog>
                <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">{t.signup}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <RegisterForm onSuccess={() => {
                      setRegisterOpen(false)
                      setLoginOpen(true)
                    }} />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
