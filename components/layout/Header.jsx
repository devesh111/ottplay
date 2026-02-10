"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useApp } from "@/contexts/AppContext";
import Image from "next/image";

/**
 * Header component - Main navigation header for the application
 * Displays logo, navigation links, search bar, language switcher, and auth buttons
 * Supports both desktop and mobile responsive layouts
 *
 * Features:
 * - Responsive navigation (desktop and mobile)
 * - Search functionality
 * - Language switching (English, Arabic)
 * - Authentication dialogs (Login/Register)
 * - User profile and watchlist links
 * - Logout functionality
 *
 * @returns {JSX.Element} Header component
 */
export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { isAuthenticated, language, changeLanguage, logout } = useApp();

    /**
     * Handle search form submission
     * Navigates to search page with query and language parameters
     *
     * @param {Event} e - Form submission event
     */
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(
                `/search?q=${encodeURIComponent(searchQuery)}&lang=${language}`,
            );
            setSearchQuery("");
        }
    };

    /**
     * Handle language change
     * Updates language in global context and localStorage
     *
     * @param {string} lang - Language code (e.g., 'en', 'ar')
     */
    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
        window.location.reload();
    };

    /**
     * Handle user logout
     * Clears authentication state and redirects to home
     */
    const handleLogout = () => {
        logout();
        router.push("/");
    };

    /**
     * Translation strings for different languages
     * @type {Object}
     */
    const translations = {
        en: {
            movies: "Movies",
            shows: "Shows",
            liveTV: "Live TV",
            watchlist: "Watchlist",
            profile: "Profile",
            logout: "Logout",
            login: "Login",
            signup: "Sign Up",
            subscribe: "Subscribe",
            search: "Search...",
        },
        ar: {
            movies: "الأفلام",
            shows: "المسلسلات",
            liveTV: "التلفاز المباشر",
            watchlist: "قائمة المشاهدة",
            profile: "الملف الشخصي",
            logout: "تسجيل الخروج",
            login: "تسجيل الدخول",
            signup: "إنشاء حساب",
            subscribe: "اشتراك",
            search: "بحث...",
        },
    };

    const t = translations[language] || translations.en;

    return (
        <header className="bg-header shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="https://images.ottplay.com/static/newImages/OTTplayWhiteLogo.svg"
                            width={10}
                            height={10}
                            className="h-10 w-auto"
                            alt="Ottplay"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/content/movies"
                            className="text-gray-100 hover:text-primary"
                        >
                            {t.movies}
                        </Link>
                        <Link
                            href="/content/shows"
                            className="text-gray-100 hover:text-primary"
                        >
                            {t.shows}
                        </Link>
                        <Link
                            href="/content/live-tv"
                            className="text-gray-100 hover:text-primary"
                        >
                            {t.liveTV}
                        </Link>
                    </nav>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden sm:flex items-center"
                    >
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
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2 hover:bg-[#ec4899] hover:text-white"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {language.toUpperCase()}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleLanguageChange("en")}
                            >
                                English
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleLanguageChange("ar")}
                            >
                                العربية
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link href="/watchlist">
                                    <Button variant="outline">
                                        {t.watchlist}
                                    </Button>
                                </Link>
                                <Link href="/profile">
                                    <Button variant="outline">
                                        {t.profile}
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                >
                                    {t.logout}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Dialog
                                    open={loginOpen}
                                    onOpenChange={setLoginOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="text-white hover:text-[#ec4899]"
                                        >
                                            {t.login}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <LoginForm
                                            onSuccess={() => {
                                                setLoginOpen(false);
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                                <Dialog
                                    open={registerOpen}
                                    onOpenChange={setRegisterOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button className="text-white">
                                            {t.signup}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <RegisterForm
                                            onSuccess={() => {
                                                setRegisterOpen(false);
                                                setLoginOpen(true);
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            {t.subscribe}
                        </Button>
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
                        <Link
                            href="/content/movies"
                            className="block py-2 text-gray-100 hover:text-primary"
                        >
                            {t.movies}
                        </Link>
                        <Link
                            href="/content/shows"
                            className="block py-2 text-gray-100 hover:text-primary"
                        >
                            {t.shows}
                        </Link>
                        <Link
                            href="/content/live-tv"
                            className="block py-2 text-gray-100 hover:text-primary"
                        >
                            {t.liveTV}
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/watchlist"
                                    className="block py-2 text-gray-700"
                                >
                                    {t.watchlist}
                                </Link>
                                <Link
                                    href="/profile"
                                    className="block py-2 text-gray-700"
                                >
                                    {t.profile}
                                </Link>
                                <Button
                                    onClick={handleLogout}
                                    className="w-full"
                                >
                                    {t.logout}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Dialog
                                    open={loginOpen}
                                    onOpenChange={setLoginOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                        >
                                            {t.login}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <LoginForm
                                            onSuccess={() => {
                                                setLoginOpen(false);
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                                <Dialog
                                    open={registerOpen}
                                    onOpenChange={setRegisterOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button className="w-full">
                                            {t.signup}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <RegisterForm
                                            onSuccess={() => {
                                                setRegisterOpen(false);
                                                setLoginOpen(true);
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
