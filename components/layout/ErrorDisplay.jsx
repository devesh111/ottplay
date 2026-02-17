"use client";

const ErrorDisplay = () => {
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <p className="text-gray-400">
                        Please try refreshing the page
                    </p>
                </div>
            </div>
        </main>
    );
};

export default ErrorDisplay;
