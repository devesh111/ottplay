"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/contexts/AppContext";
import Image from "next/image";
import { SearchAutocomplete } from "@/components/home/SearchAutoComplete";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, changeLanguage, logout } = useApp();

    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
        window.location.reload();
    };

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
                            href="/movies"
                            className="text-gray-100 hover:text-primary"
                        >
                            {t.movies}
                        </Link>
                        <Link
                            href="/shows"
                            className="text-gray-100 hover:text-primary"
                        >
                            {t.shows}
                        </Link>
                        <Link
                            href="/live-tv"
                            className="text-gray-100 hover:text-primary"
                        >
                            {t.liveTV}
                        </Link>
                    </nav>

                    {/* Search Bar */}
                    <div>
                        <SearchAutocomplete />
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
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
                    </div>
                )}
            </div>
        </header>
    );
}
