'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api/client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Play, Plus } from 'lucide-react'

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

interface Show {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  posterUrl?: string
  rating: number
  releaseYear: number
}

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [movies, setMovies] = useState<Movie[]>([])
  const [shows, setShows] = useState<Show[]>([])
  const [moviesLoading, setMoviesLoading] = useState(true)
  const [showsLoading, setShowsLoading] = useState(true)
  const [moviesError, setMoviesError] = useState('')
  const [showsError, setShowsError] = useState('')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLang) setLanguage(savedLang)
  }, [])

  // Fetch movies independently
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setMoviesLoading(true)
        const response = await apiClient.get('/content/movies', {
          params: {
            limit: 10,
            lang: language,
          },
        })
        setMovies(response.data.data || [])
      } catch (err: any) {
        setMoviesError(err.response?.data?.message || 'Failed to load movies')
      } finally {
        setMoviesLoading(false)
      }
    }

    fetchMovies()
  }, [language])

  // Fetch shows independently
  useEffect(() => {
    const fetchShows = async () => {
      try {
        setShowsLoading(true)
        const response = await apiClient.get('/content/shows', {
          params: {
            limit: 10,
            lang: language,
          },
        })
        setShows(response.data.data || [])
      } catch (err: any) {
        setShowsError(err.response?.data?.message || 'Failed to load shows')
      } finally {
        setShowsLoading(false)
      }
    }

    fetchShows()
  }, [language])

  const translations = {
    en: {
      welcome: 'Welcome to OTT Platform',
      featuredMovies: 'Featured Movies',
      featuredShows: 'Featured Shows',
      viewAll: 'View All',
      play: 'Play',
      addToWatchlist: 'Add to Watchlist',
      rating: 'Rating',
      year: 'Year',
    },
    ar: {
      welcome: 'مرحبا بك في منصة OTT',
      featuredMovies: 'الأفلام المميزة',
      featuredShows: 'المسلسلات المميزة',
      viewAll: 'عرض الكل',
      play: 'تشغيل',
      addToWatchlist: 'إضافة إلى قائمة المشاهدة',
      rating: 'التقييم',
      year: 'السنة',
    },
  }

  const t = translations[language]

  const ContentCard = ({ item, type }: { item: Movie | Show; type: 'movie' | 'show' }) => {
    const title = language === 'en' ? item.title : item.titleAr
    const description = language === 'en' ? item.description : item.descriptionAr

    return (
      <Link href={`/content/${type}/${item.id}`}>
        <div className="relative group cursor-pointer h-80 rounded-lg overflow-hidden bg-gray-200">
          {item.posterUrl ? (
            <img
              src={item.posterUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              <span className="text-gray-600 text-center px-4">{title}</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-200 text-sm mb-4 line-clamp-2">{description}</p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                {t.play}
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-bold">
            ⭐ {item.rating.toFixed(1)}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.welcome}</h1>
          <p className="text-xl text-blue-100">
            {language === 'en'
              ? 'Discover thousands of movies, shows, and live TV channels'
              : 'اكتشف آلاف الأفلام والمسلسلات وقنوات التلفاز المباشرة'}
          </p>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{t.featuredMovies}</h2>
          <Link href="/content/movies">
            <Button variant="outline">{t.viewAll}</Button>
          </Link>
        </div>

        {moviesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : moviesError ? (
          <div className="text-red-500 text-center py-8">{moviesError}</div>
        ) : movies.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {movies.map((movie) => (
                <CarouselItem key={movie.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/5">
                  <ContentCard item={movie} type="movie" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {language === 'en' ? 'No movies available' : 'لا توجد أفلام متاحة'}
          </div>
        )}
      </section>

      {/* Featured Shows Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{t.featuredShows}</h2>
          <Link href="/content/shows">
            <Button variant="outline">{t.viewAll}</Button>
          </Link>
        </div>

        {showsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : showsError ? (
          <div className="text-red-500 text-center py-8">{showsError}</div>
        ) : shows.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {shows.map((show) => (
                <CarouselItem key={show.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/5">
                  <ContentCard item={show} type="show" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {language === 'en' ? 'No shows available' : 'لا توجد مسلسلات متاحة'}
          </div>
        )}
      </section>
    </main>
  )
}
