"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { authApi } from "@/lib/api/client";
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await authApi.register(formData);
            setSuccess(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-green-600">
                        Success!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Your account has been created. Redirecting to login...
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="w-full max-w-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            First Name
                        </label>
                        <Input
                            type="text"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Last Name
                        </label>
                        <Input
                            type="text"
                            name="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone
                        </label>
                        <Input
                            type="tel"
                            name="phone"
                            placeholder="+1234567890"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
