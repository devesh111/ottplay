'use client'

import { useEffect, useState } from 'react'
import { contentApi } from '@/lib/api/client'
import { MovieCard } from '@/components/content/MovieCard'
import { ShowCard } from '@/components/content/ShowCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const [movies, setMovies] = useState<any[]>([])
  const [shows, setShows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [moviesRes, showsRes] = await Promise.all([
          contentApi.getMovies(1, 8),
          contentApi.getShows(1, 8),
        ])
        setMovies(moviesRes.data)
        setShows(showsRes.data)
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Stream Everything</h1>
          <p className="text-xl">Movies, Shows, and Live TV in one place</p>
          <div className="flex gap-4 justify-center">
            <Link href="/content/movies">
              <Button size="lg" variant="secondary">
                Browse Movies
              </Button>
            </Link>
            <Link href="/content/shows">
              <Button size="lg" variant="secondary">
                Browse Shows
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Movies</h2>
          <Link href="/content/movies">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Shows */}
      <section className="px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Shows</h2>
          <Link href="/content/shows">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
