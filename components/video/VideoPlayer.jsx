"use client";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';

export function VideoPlayer({ videoUrl, onClose }) {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [currentSpeed, setCurrentSpeed] = useState(1);
    const [currentQuality, setCurrentQuality] = useState("auto");

    // Initialize video.js player
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            if (!videoRef.current) {
                console.error("Video ref not available");
                return;
            }

            try {
                // Dispose of existing player if any
                if (playerRef.current && !playerRef.current.isDisposed()) {
                    playerRef.current.dispose();
                }

                // Create player instance
                const player = videojs(videoRef.current, {
                    controls: true,
                    autoplay: true,
                    preload: "auto",
                    responsive: true,
                    fluid: true,
                    playbackRates: [0.5, 1, 1.25, 1.5, 2],
                    controlBar: {
                        children: [
                            "playToggle",
                            "volumePanel",
                            "currentTimeDisplay",
                            "timeDivider",
                            "durationDisplay",
                            "progressControl",
                            "remainingTimeDisplay",
                            "fullscreenToggle",
                            "PlaybackRateMenuButton",
                            "qualitySelector",
                        ],
                    },
                });

                playerRef.current = player;

                // Set video source
                player.src({
                    src: videoUrl,
                    type: "application/x-mpegURL",
                });

                player.hlsQualitySelector({ displayCurrentQuality: true });
                

                // Handle player ready
                player.on("ready", () => {
                    console.log("Player ready, video loaded");
                });

                // Handle errors
                player.on("error", () => {
                    const error = player.error();
                    console.error("Video error:", error);
                });

                // Handle loadstart
                player.on("loadstart", () => {
                    console.log("Video loading started");
                });

                // Handle canplay
                player.on("canplay", () => {
                    console.log("Video can play");
                });
            } catch (error) {
                console.error("Failed to initialize player:", error);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            // Don't dispose on unmount - let it clean up naturally
        };
    }, [videoUrl]);

    // Handle playback speed change
    const handleSpeedChange = (speed) => {
        if (playerRef.current) {
            playerRef.current.playbackRate(speed);
            setCurrentSpeed(speed);
        }
    };

    // Handle quality change
    const handleQualityChange = (quality) => {
        setCurrentQuality(quality);
        console.log(`Quality changed to: ${quality}`);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-black flex flex-col"
        >
            {/* Video Player Container */}
            <div className="flex-1 relative bg-black overflow-hidden">
                <video
                    ref={videoRef}
                    className="video-js vjs-default-skin w-full h-full"
                    playsInline
                    crossOrigin="anonymous"
                />
            </div>

            {/* Custom Controls - Positioned at bottom inside player */}
            {/* <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/50 to-transparent p-4 flex items-center justify-between z-40"> */}
                {/* Speed Controls */}
                {/* <div className="flex gap-2">
                    <span className="text-white text-sm font-semibold mr-2">
                        Speed:
                    </span>
                    {[0.5, 1, 1.5, 2].map((speed) => (
                        <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                currentSpeed === speed
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                            }`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div> */}

                {/* Quality Controls */}
                {/* <div className="flex items-center gap-2">
                    <label className="text-white text-sm font-semibold">
                        Quality:
                    </label>
                    <select
                        value={currentQuality}
                        onChange={(e) => handleQualityChange(e.target.value)}
                        className="px-3 py-1 rounded bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                        <option value="auto">Auto</option>
                        <option value="1080">1080p</option>
                        <option value="720">720p</option>
                        <option value="480">480p</option>
                        <option value="360">360p</option>
                    </select>
                </div> */}

                {/* Close Button */}
                {/* <button
                    onClick={onClose}
                    className="px-4 py-1 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                >
                    Close
                </button>
            </div> */}
        </div>
    );
}
