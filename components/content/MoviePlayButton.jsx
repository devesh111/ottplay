"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/video/VideoPlayer";

/**
 * MoviePlayButton — Client Component.
 * Handles only the play-button click and the video dialog.
 * The surrounding page remains a Server Component.
 */
export default function MoviePlayButton({ videoUrl }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="px-8 py-4 rounded-sm bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105 mt-5"
            >
                <PlayIcon fill="white" /> Play
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-full h-auto p-0 bg-black border-slate-700 flex flex-col">
                    <DialogTitle className="sr-only">Video Player</DialogTitle>
                    <div className="flex-1 w-full h-full">
                        <VideoPlayer
                            videoUrl={videoUrl}
                            onClose={() => setIsOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
