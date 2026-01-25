"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { authApi } from "@/lib/api/client";
import Link from "next/link";

export default function LoginPage() {
    const [step, setStep] = useState("phone");
    const [phoneOrEmail, setPhoneOrEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await authApi.requestOTP(phoneOrEmail);
            setStep("otp");
        } catch (err) {
            setError(err.message || "Failed to request OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await authApi.verifyOTP(phoneOrEmail, otp);
            router.push("/");
        } catch (err) {
            setError(err.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="w-full max-w-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Login to OTT Platform
                </h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                        {error}
                    </div>
                )}

                {step === "phone" ? (
                    <form onSubmit={handleRequestOTP} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Phone or Email
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter your phone or email"
                                value={phoneOrEmail}
                                onChange={(e) =>
                                    setPhoneOrEmail(e.target.value)
                                }
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Enter OTP
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                OTP sent to {phoneOrEmail}
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setStep("phone")}
                        >
                            Back
                        </Button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-blue-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
