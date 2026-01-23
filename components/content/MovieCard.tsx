'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface MovieCardProps {
  movie: {
    id: string
    slug: string
    title: string
    posterUrl?: string
    rating?: number
    genre?: { name: string }
  }
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/content/movies/${movie.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-64 bg-gray-200">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{movie.title}</h3>
          <div className="flex items-center justify-between mt-2">
            {movie.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{movie.rating.toFixed(1)}</span>
              </div>
            )}
            {movie.genre && (
              <Badge variant="secondary">{movie.genre.name}</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
