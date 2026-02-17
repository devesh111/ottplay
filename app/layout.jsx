import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/contexts/AppContext";
import { Header } from "@/components/layout/Header";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import BackToTopButton from "@/components/layout/BackToTopButton";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

/**
 * Root Layout Component
 *
 * Main layout wrapper that:
 * - Provides global app context (auth, language, theme)
 * - Renders header navigation
 * - Sets up dark theme by default
 * - Manages font variables
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @returns {JSX.Element} The root layout
 */
export const metadata = {
    title: "OTTPlay - Stream Movies & TV Shows",
    description: "Watch unlimited movies and TV shows in stunning quality",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0f1e] text-[#e5e5ff]`}
            >
                <AppProvider>
                    <Header />
                    {children}
                    <BackToTopButton />
                    <Footer />
                </AppProvider>
            </body>
        </html>
    );
}
