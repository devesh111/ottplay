const nextConfig = {
    images: {
        remotePatterns: [
            new URL("https://images.ottplay.com/**"),
            { protocol: "https", hostname: "**" },
        ],
    },
};

export default nextConfig;
