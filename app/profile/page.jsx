"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/");
    };

    if (!user) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">My Profile</h1>

            <Card className="p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <p className="mt-1 text-lg">
                        {user.firstName} {user.lastName}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <p className="mt-1 text-lg">{user.email}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <p className="mt-1 text-lg">{user.phone}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Preferred Language
                    </label>
                    <p className="mt-1 text-lg">
                        {user.preferredLanguage === "en"
                            ? "English"
                            : "العربية"}
                    </p>
                </div>

                <div className="pt-6 border-t">
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full"
                    >
                        Logout
                    </Button>
                </div>
            </Card>
        </div>
    );
}
