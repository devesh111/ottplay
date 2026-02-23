"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Episodes from "@/components/content/Episodes";

/**
 * SeasonSelector — Client Component.
 * Manages the selected season state and renders the Episodes list.
 * Receives initial episode data from the Server Component as a prop,
 * then fetches subsequent seasons client-side via /api/episodes.
 */
export default function SeasonSelector({
    seasons,
    defaultSeason,
    seoUrl,
    initialEpisodes,
}) {
    const [seasonNumber, setSeasonNumber] = useState(defaultSeason);

    return (
        <>
            {seasons.length > 0 && (
                <Select
                    onValueChange={(v) => setSeasonNumber(Number(v))}
                    value={String(seasonNumber)}
                >
                    <SelectTrigger className="w-full max-w-48 border-border border-2">
                        <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Seasons</SelectLabel>
                            {seasons.map((season, index) => (
                                <SelectItem
                                    key={index}
                                    value={String(season.season_number)}
                                >
                                    Season {season.season_number}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}

            <Episodes
                seasonNumber={seasonNumber}
                seoUrl={seoUrl}
                initialEpisodes={
                    seasonNumber === defaultSeason ? initialEpisodes : null
                }
            />
        </>
    );
}
