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

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-black"
        >
            {/* Video Player Container */}
            <div className="relative bg-black overflow-hidden">
                <video
                    ref={videoRef}
                    className="video-js vjs-default-skin w-full h-full"
                    playsInline
                    crossOrigin="anonymous"
                />
            </div>
        </div>
    );
}
