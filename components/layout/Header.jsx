'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { Search, Crown, Menu, X } from 'lucide-react';

/**
 * Header Component
 * 
 * Main navigation header with:
 * - Logo and branding
 * - Search functionality with transparent border-only design
 * - Language switcher
 * - Authentication buttons with gradient styling
 * - Subscribe button with crown icon and gradient
 * - Mobile responsive menu
 * 
 * @component
 * @returns {JSX.Element} The header component
 */
export default function Header() {
  const { isAuthenticated, user, language, changeLanguage, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] border-b border-[#2d2d44] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ec4899] to-[#a855f7] flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">OT</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#10b981] bg-clip-text text-transparent hidden sm:inline">
              OTTPlay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#e5e5ff] hover:text-[#ec4899] transition-colors font-medium">
              Home
            </Link>
            <Link href="/content/movies" className="text-[#e5e5ff] hover:text-[#ec4899] transition-colors font-medium">
              Movies
            </Link>
            <Link href="/content/shows" className="text-[#e5e5ff] hover:text-[#ec4899] transition-colors font-medium">
              Shows
            </Link>
          </nav>

          {/* Search Box - Border only with transparent background */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border border-[#ec4899] rounded-lg text-[#e5e5ff] placeholder-[#9ca3af] focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#ec4899]/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ec4899] hover:text-[#a855f7] transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-3 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-[#e5e5ff] text-sm focus:outline-none focus:border-[#ec4899] transition-colors cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-[#1a1a2e] rounded-lg border border-[#2d2d44]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ec4899] to-[#a855f7] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-[#e5e5ff] text-sm font-medium">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-[#0f0f1e] font-semibold bg-[#10b981] hover:bg-[#059669] transition-all transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-[#e5e5ff] border border-[#ec4899] hover:bg-[#ec4899]/10 transition-all font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-lg text-[#0f0f1e] font-semibold bg-gradient-to-r from-[#ec4899] to-[#a855f7] hover:shadow-lg hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <Crown size={18} />
                  <span>Subscribe</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#e5e5ff] hover:text-[#ec4899] transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4 border-t border-[#2d2d44] pt-4">
            <Link href="/" className="block text-[#e5e5ff] hover:text-[#ec4899] transition-colors font-medium">
              Home
            </Link>
            <Link href="/content/movies" className="block text-[#e5e5ff] hover:text-[#ec4899] transition-colors font-medium">
              Movies
            </Link>
            <Link href="/content/shows" className="block text-[#e5e5ff] hover:text-[#ec4899] transition-colors font-medium">
              Shows
            </Link>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-[#ec4899] rounded-lg text-[#e5e5ff] placeholder-[#9ca3af] focus:outline-none focus:border-[#a855f7]"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ec4899]"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Mobile Language Switcher */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-[#e5e5ff] text-sm focus:outline-none focus:border-[#ec4899]"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-[#1a1a2e] rounded-lg border border-[#2d2d44]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ec4899] to-[#a855f7] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-[#e5e5ff] text-sm font-medium">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 rounded-lg text-[#0f0f1e] font-semibold bg-[#10b981] hover:bg-[#059669] transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block text-center px-4 py-2 rounded-lg text-[#e5e5ff] border border-[#ec4899] hover:bg-[#ec4899]/10 transition-all font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block text-center px-4 py-2 rounded-lg text-[#0f0f1e] font-semibold bg-gradient-to-r from-[#ec4899] to-[#a855f7] hover:shadow-lg hover:shadow-[#ec4899]/50 transition-all flex items-center justify-center space-x-2"
                >
                  <Crown size={18} />
                  <span>Subscribe</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
