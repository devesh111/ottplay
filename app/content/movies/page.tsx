'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { ContentCard } from '@/components/content/ContentCard'
import { Button } from '@/components/ui/button'

interface Movie {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  posterUrl?: string
  rating: number
  releaseYear: number
}

export default function MoviesPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLang) setLanguage(savedLang)
  }, [])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/content/movies', {
          params: {
            page,
            limit: 20,
          },
        })
        setMovies(response.data.data || [])
        setTotal(response.data.pagination?.total || 0)
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [page])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{language === 'en' ? 'Movies' : 'الأفلام'}</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {movies.map((movie) => (
              <ContentCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                titleAr={movie.titleAr}
                description={movie.description}
                descriptionAr={movie.descriptionAr}
                posterUrl={movie.posterUrl}
                rating={movie.rating}
                type="movie"
                language={language}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              {language === 'en' ? 'Previous' : 'السابق'}
            </Button>
            <span className="flex items-center">
              {language === 'en' ? `Page ${page} of ${Math.ceil(total / 20)}` : `الصفحة ${page} من ${Math.ceil(total / 20)}`}
            </span>
            <Button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
            >
              {language === 'en' ? 'Next' : 'التالي'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
