"use client";
import {
    Captions,
    Check,
    ChevronLeft,
    Gauge,
    Maximize2,
    Minimize2,
    Pause,
    Play,
    Redo,
    Settings,
    Undo,
    Volume1,
    Volume2,
    VolumeX,
    X,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";

/* ── time formatter ─────────────────────────────────────────────────── */
function fmt(sec) {
    if (!sec || isNaN(sec)) return "0:00";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0)
        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
}

const SPEEDS = [
    { label: "0.5x", value: 0.5 },
    { label: "0.75x", value: 0.75 },
    { label: "1x (Normal)", value: 1 },
    { label: "1.25x", value: 1.25 },
    { label: "1.5x", value: 1.5 },
    { label: "1.75x", value: 1.75 },
    { label: "2x", value: 2 },
];

/* ── Vertical volume slider ─────────────────────────────────────────── */
function VolumePanel({ volume, onChange }) {
    // volume 0‥1
    const pct = Math.round(volume * 100);
    const trackH = 120;
    const thumbY = trackH - (pct * trackH) / 100; // 0 = top = full, trackH = bottom = mute

    return (
        <div
            className="absolute z-50"
            style={{ bottom: 72, left: 10 }}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="flex flex-col items-center py-4 px-3 rounded-xl"
                style={{
                    background: "rgba(22,18,38,0.97)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    width: 52,
                    gap: 6,
                }}
            >
                {/* vertical slider */}
                <div className="relative" style={{ width: 14, height: trackH }}>
                    {/* track */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 rounded-full"
                        style={{
                            width: 4,
                            background: "rgba(255,255,255,0.2)",
                        }}
                    />
                    {/* fill */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-full"
                        style={{
                            width: 4,
                            background: "#22c55e",
                            height: `${pct}%`,
                        }}
                    />
                    {/* thumb */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white shadow-lg"
                        style={{
                            width: 14,
                            height: 14,
                            top: thumbY - 7,
                            transition: "top 0.05s",
                        }}
                    />
                    {/* invisible input */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={pct}
                        onChange={(e) => onChange(e.target.value / 100)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        style={{
                            writingMode: "vertical-lr",
                            direction: "rtl",
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

/* ── Quality panel (bottom-right popup) ─────────────────────────────── */
function QualityPanel({ qualities, current, onSelect, onClose }) {
    return (
        <div
            className="absolute z-50 rounded-xl overflow-hidden"
            style={{
                bottom: 60,
                left: 0,
                background: "#1c1630",
                border: "1px solid rgba(255,255,255,0.1)",
                minWidth: 200,
                boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* header */}
            <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
                <span className="text-white font-semibold text-sm">
                    Quality
                </span>
                <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white"
                >
                    <X />
                </button>
            </div>
            {/* options */}
            {[{ label: "Auto", value: "auto" }, ...qualities].map((q) => (
                <button
                    key={q.value}
                    onClick={() => {
                        onSelect(q.value);
                        onClose();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                >
                    <span
                        className={`text-sm flex items-center gap-2 ${q.value === current ? "text-[#22c55e]" : "text-white/80"}`}
                    >
                        {q.label}
                        {q.value !== "auto" && parseInt(q.value) >= 1080 && (
                            <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                                style={{
                                    background: "#e53e3e",
                                    lineHeight: 1.4,
                                }}
                            >
                                HD
                            </span>
                        )}
                    </span>
                    {q.value === current && <Check />}
                </button>
            ))}
        </div>
    );
}

/* ── Speed panel (full-height overlay) ─────────────────────────────── */
function SpeedPanel({ current, onApply, onClose }) {
    const [sel, setSel] = useState(current);
    return (
        <div
            className="absolute inset-0 z-50 flex flex-col"
            style={{ background: "rgba(0,0,0,0.88)" }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* header */}
            <div
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
                <Gauge />
                <span className="text-white font-semibold flex-1">
                    Playback Speed
                </span>
                <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white"
                >
                    <X />
                </button>
            </div>
            {/* list */}
            <div className="flex-1 overflow-auto">
                {SPEEDS.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => setSel(s.value)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                    >
                        <span
                            className={`text-sm ${s.value === sel ? "text-[#22c55e]" : "text-white/80"}`}
                        >
                            {s.label}
                        </span>
                        {s.value === sel && <Check />}
                    </button>
                ))}
            </div>
            {/* footer */}
            <div
                className="flex gap-3 px-5 py-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
            >
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-lg text-white/80 text-sm font-medium hover:bg-white/5 transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        onApply(sel);
                        onClose();
                    }}
                    className="flex-1 py-2.5 rounded-lg text-black text-sm font-bold hover:opacity-90 transition-opacity"
                    style={{ background: "#22c55e" }}
                >
                    Apply
                </button>
            </div>
        </div>
    );
}

/* ── Main VideoPlayer ───────────────────────────────────────────────── */
export function VideoPlayer({
    videoUrl,
    onClose,
    title = "",
    certification = "",
}) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const wrapRef = useRef(null);
    const seekRef = useRef(null);
    const hideRef = useRef(null);
    const seekingRef = useRef(false);

    const [playing, setPlaying] = useState(false);
    const [curTime, setCurTime] = useState(0);
    const [dur, setDur] = useState(0);
    const [vol, setVol] = useState(1);
    const [muted, setMuted] = useState(false);
    const [isFS, setIsFS] = useState(false);
    const [ctrlVis, setCtrlVis] = useState(true);
    const [qualities, setQualities] = useState([]);
    const [curQuality, setCurQuality] = useState("auto");
    const [curSpeed, setCurSpeed] = useState(1);
    // panel: null | "volume" | "quality" | "speed"
    const [panel, setPanel] = useState(null);

    /* ── init video.js (HLS, no native controls) ── */
    useEffect(() => {
        if (!videoRef.current) return;
        const player = videojs(videoRef.current, {
            controls: false,
            autoplay: false,
            preload: "auto",
            techOrder: ["html5"],
            fill: true, // makes vjs-tech fill its parent
            responsive: false,
        });
        player.src({ src: videoUrl, type: "application/x-mpegURL" });

        try {
            player.hlsQualitySelector({ displayCurrentQuality: false });
        } catch {}

        player.on("play", () => setPlaying(true));
        player.on("pause", () => setPlaying(false));
        player.on("ended", () => setPlaying(false));
        player.on("timeupdate", () => setCurTime(player.currentTime()));
        player.on("durationchange", () => setDur(player.duration()));
        player.on("volumechange", () => {
            setVol(player.volume());
            setMuted(player.muted());
        });
        player.ready(() => {
            const ql = player.qualityLevels?.();
            if (!ql) return;
            const refresh = () => {
                const seen = new Set();
                const list = [];
                for (let i = 0; i < ql.length; i++) {
                    const h = ql[i].height;
                    if (h && !seen.has(h)) {
                        seen.add(h);
                        list.push({
                            label: `${h}p`,
                            value: `${h}p`,
                            height: h,
                        });
                    }
                }
                list.sort((a, b) => b.height - a.height);
                setQualities(list);
            };
            ql.on("addqualitylevel", refresh);
        });

        playerRef.current = player;
        return () => {
            if (!player.isDisposed()) player.dispose();
        };
    }, [videoUrl]);

    /* ── fullscreen listener ── */
    useEffect(() => {
        const h = () => setIsFS(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", h);
        return () => document.removeEventListener("fullscreenchange", h);
    }, []);

    /* ── auto-hide controls ── */
    const resetHide = useCallback(() => {
        setCtrlVis(true);
        clearTimeout(hideRef.current);
        hideRef.current = setTimeout(() => setCtrlVis(false), 3500);
    }, []);

    useEffect(() => {
        resetHide();
        return () => clearTimeout(hideRef.current);
    }, [resetHide]);

    // keep visible while panel open
    useEffect(() => {
        if (panel) {
            clearTimeout(hideRef.current);
            setCtrlVis(true);
        } else resetHide();
    }, [panel, resetHide]);

    /* ── actions ── */
    const togglePlay = useCallback(() => {
        const p = playerRef.current;
        if (!p) return;
        p.paused() ? p.play() : p.pause();
    }, []);

    const skip = useCallback((sec) => {
        const p = playerRef.current;
        if (!p) return;
        p.currentTime(
            Math.max(0, Math.min(p.currentTime() + sec, p.duration() || 0)),
        );
    }, []);

    const seekTo = useCallback(
        (clientX) => {
            if (!seekRef.current) return;
            const rect = seekRef.current.getBoundingClientRect();
            const ratio = Math.min(
                1,
                Math.max(0, (clientX - rect.left) / rect.width),
            );
            const p = playerRef.current;
            if (p && dur) p.currentTime(ratio * dur);
        },
        [dur],
    );

    const changeVol = useCallback((v) => {
        const p = playerRef.current;
        if (!p) return;
        p.volume(v);
        p.muted(v === 0);
    }, []);

    const applySpeed = useCallback((s) => {
        const p = playerRef.current;
        if (p) p.playbackRate(s);
        setCurSpeed(s);
    }, []);

    const selectQuality = useCallback((q) => {
        setCurQuality(q);
        const p = playerRef.current;
        if (!p) return;
        const ql = p.qualityLevels?.();
        if (!ql) return;
        for (let i = 0; i < ql.length; i++) {
            ql[i].enabled = q === "auto" || `${ql[i].height}p` === q;
        }
    }, []);

    const toggleFS = useCallback(() => {
        if (!document.fullscreenElement) wrapRef.current?.requestFullscreen();
        else document.exitFullscreen();
    }, []);

    const togglePanel = (name) => setPanel((p) => (p === name ? null : name));

    /* ── seek bar pointer events ── */
    const onSeekDown = (e) => {
        seekingRef.current = true;
        seekTo(e.clientX);
    };
    const onSeekMove = (e) => {
        if (seekingRef.current) seekTo(e.clientX);
    };
    const onSeekUp = () => {
        seekingRef.current = false;
    };

    const progress = dur ? (curTime / dur) * 100 : 0;
    const effVol = muted ? 0 : vol;
    const isHDActive = curQuality !== "auto" && parseInt(curQuality) >= 1080;

    return (
        /* Full-screen black wrapper */
        <div
            ref={wrapRef}
            className="relative w-full h-full bg-black overflow-hidden"
            style={{ minHeight: 320 }}
            onMouseMove={resetHide}
            onTouchStart={resetHide}
        >
            {/* ── video.js container — must be sized explicitly so the tech fills it ── */}
            <div
                className="absolute inset-0"
                style={{ width: "100%", height: "100%" }}
            >
                <video
                    ref={videoRef}
                    className="video-js"
                    playsInline
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            </div>

            {/* ── centre tap zone (play/pause) ── */}
            <div
                className="absolute inset-0 z-10"
                onClick={() => {
                    if (!panel) {
                        togglePlay();
                        resetHide();
                    } else setPanel(null);
                }}
            />

            {/* ══════════ TOP BAR ══════════ */}
            <div
                className="absolute top-0 left-0 right-0 z-30 flex items-start gap-3 px-4 pt-4 pb-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
                    transition: "opacity 0.3s",
                    opacity: ctrlVis ? 1 : 0,
                }}
            >
                {/* back button */}
                <button
                    className="text-white hover:text-white/70 transition-colors mt-0.5 pointer-events-auto"
                    onClick={onClose}
                >
                    <ChevronLeft />
                </button>
                {/* title + cert */}
                <div className="flex flex-col gap-1.5">
                    {title && (
                        <span className="text-white font-bold text-base leading-tight">
                            {title}
                        </span>
                    )}
                    {certification && (
                        <span
                            className="text-white text-xs font-semibold px-2 py-0.5 rounded w-fit"
                            style={{
                                border: "1.5px solid rgba(255,255,255,0.55)",
                            }}
                        >
                            {certification}
                        </span>
                    )}
                </div>
            </div>

            {/* ══════════ CENTRE CONTROLS ══════════ */}
            <div
                className="absolute inset-0 z-20 flex items-center justify-center gap-10 pointer-events-none"
                style={{ transition: "opacity 0.3s", opacity: ctrlVis ? 1 : 0 }}
            >
                <button
                    className="pointer-events-auto hover:scale-110 transition-transform active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation();
                        skip(-10);
                        resetHide();
                    }}
                >
                    <Undo size={40} /> <span className="text-xs">- 10</span>
                </button>
                <button
                    className="pointer-events-auto hover:scale-110 transition-transform active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                        resetHide();
                    }}
                >
                    {playing ? <Pause size={40} /> : <Play size={40} />}
                </button>
                <button
                    className="pointer-events-auto hover:scale-110 transition-transform active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation();
                        skip(10);
                        resetHide();
                    }}
                >
                    <Redo size={40} /> <span className="text-xs">+ 10</span>
                </button>
            </div>

            {/* ══════════ PANELS (rendered above everything) ══════════ */}
            {panel === "volume" && (
                <VolumePanel volume={effVol} onChange={changeVol} />
            )}

            {panel === "speed" && (
                <SpeedPanel
                    current={curSpeed}
                    onApply={applySpeed}
                    onClose={() => setPanel(null)}
                />
            )}

            {/* ══════════ BOTTOM BAR ══════════ */}
            <div
                className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                    transition: "opacity 0.3s",
                    opacity: ctrlVis ? 1 : 0,
                }}
            >
                {/* ── seek row ── */}
                <div
                    className="flex items-center gap-3 px-4 pt-4 pb-2 pointer-events-auto"
                    onMouseMove={onSeekMove}
                    onMouseUp={onSeekUp}
                >
                    {/* seek bar */}
                    <div
                        ref={seekRef}
                        className="flex-1 relative cursor-pointer"
                        style={{ height: 4 }}
                        onMouseDown={onSeekDown}
                        onMouseMove={onSeekMove}
                        onMouseUp={onSeekUp}
                        onTouchStart={(e) => seekTo(e.touches[0].clientX)}
                        onTouchMove={(e) => seekTo(e.touches[0].clientX)}
                    >
                        {/* track */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{ background: "rgba(255,255,255,0.25)" }}
                        />
                        {/* fill */}
                        <div
                            className="absolute left-0 top-0 bottom-0 rounded-full bg-white"
                            style={{ width: `${progress}%` }}
                        />
                        {/* thumb */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow"
                            style={{
                                width: 16,
                                height: 16,
                                left: `${progress}%`,
                            }}
                        />
                    </div>
                    {/* timestamp */}
                    <span className="text-white text-xs font-medium tabular-nums whitespace-nowrap">
                        {fmt(curTime)}/{fmt(dur)}
                    </span>
                </div>

                {/* ── controls row ── */}
                <div className="flex items-center justify-between px-4 pb-4 pointer-events-auto">
                    {/* left buttons */}
                    <div className="flex items-center gap-5 md:gap-7">
                        {/* Volume */}
                        <button
                            onClick={() => togglePanel("volume")}
                            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                            {muted || effVol === 0 ? (
                                <VolumeX />
                            ) : effVol < 0.5 ? (
                                <Volume1 />
                            ) : (
                                <Volume2 />
                            )}
                            <span className="text-white text-[10px] tracking-wide">
                                Volume
                            </span>
                        </button>

                        {/* Language */}
                        <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity relative">
                            <Captions />
                            <span className="text-white text-[10px] tracking-wide">
                                Language
                            </span>
                        </button>

                        {/* Settings / Quality */}
                        <button
                            onClick={() => togglePanel("quality")}
                            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity relative"
                        >
                            {isHDActive && (
                                <span
                                    className="absolute -top-1 -right-2 text-[9px] font-bold px-1 py-px rounded text-white"
                                    style={{
                                        background: "#e53e3e",
                                        lineHeight: 1.4,
                                        pointerEvents: "none",
                                    }}
                                >
                                    HD
                                </span>
                            )}
                            <Settings />
                            <span className="text-white text-[10px] tracking-wide">
                                Settings
                            </span>
                            <div className="relative">
                                {panel === "quality" && (
                                    <QualityPanel
                                        qualities={qualities}
                                        current={curQuality}
                                        onSelect={selectQuality}
                                        onClose={() => setPanel(null)}
                                    />
                                )}
                            </div>
                        </button>

                        {/* Speed */}
                        <button
                            onClick={() => togglePanel("speed")}
                            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                            <Gauge />
                            <span className="text-white text-[10px] tracking-wide">
                                Speed
                            </span>
                        </button>
                    </div>

                    {/* right — Full Screen (desktop only) */}
                    <button
                        onClick={toggleFS}
                        className="flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity"
                    >
                        {isFS ? <Minimize2 /> : <Maximize2 />}
                        <span className="text-white text-[10px] tracking-wide">
                            {isFS ? "Exit" : "Full Screen"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
