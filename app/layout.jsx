import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "OTT Platform - Stream Your Favorite Content",
    description:
        "Discover and stream movies, shows, and live TV from all your favorite platforms in one place",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://ott-platform.com",
        siteName: "OTT Platform",
        title: "OTT Platform - Stream Your Favorite Content",
        description:
            "Discover and stream movies, shows, and live TV from all your favorite platforms",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "OTT Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "OTT Platform",
        description: "Stream your favorite content",
        images: ["/og-image.png"],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
