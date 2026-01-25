'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiClient } from '@/lib/api/client'
import { Play, Plus, Share2, Download } from 'lucide-react'

interface ContentDetail {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  posterUrl?: string
  rating: number
  releaseYear: number
  genre?: string
  duration?: number
  director?: string
  cast?: string[]
  reviews?: Review[]
}

interface Review {
  id: string
  userId: string
  rating: number
  comment: string
  commentAr: string
  createdAt: string
}

export default function ContentDetailPage() {
  const params = useParams()
  const type = params.type as string
  const id = params.id as string
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [content, setContent] = useState<ContentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLang) setLanguage(savedLang)
  }, [])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const endpoint = type === 'movie' ? '/content/movies' : '/content/shows'
        const response = await apiClient.get(`${endpoint}/${id}`, {
          params: { lang: language },
        })
        setContent(response.data.data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchContent()
  }, [id, type, language])

  const handleAddToWatchlist = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Please login to add to watchlist')
        return
      }

      await apiClient.post('/watchlist', {
        contentId: id,
        contentType: type,
      })
      setIsInWatchlist(true)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add to watchlist')
    }
  }

  const translations = {
    en: {
      description: 'Description',
      ratings: 'Ratings & Reviews',
      cast: 'Cast',
      director: 'Director',
      genre: 'Genre',
      duration: 'Duration',
      year: 'Year',
      play: 'Play Now',
      resume: 'Resume',
      addToWatchlist: 'Add to Watchlist',
      share: 'Share',
      download: 'Download',
      noReviews: 'No reviews yet',
      rating: 'Rating',
      minutes: 'minutes',
    },
    ar: {
      description: 'الوصف',
      ratings: 'التقييمات والتعليقات',
      cast: 'الممثلون',
      director: 'المخرج',
      genre: 'النوع',
      duration: 'المدة',
      year: 'السنة',
      play: 'تشغيل الآن',
      resume: 'استئناف',
      addToWatchlist: 'إضافة إلى قائمة المشاهدة',
      share: 'مشاركة',
      download: 'تحميل',
      noReviews: 'لا توجد تعليقات حتى الآن',
      rating: 'التقييم',
      minutes: 'دقيقة',
    },
  }

  const t = translations[language]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Skeleton className="w-full h-96" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Content not found'}</p>
        </div>
      </div>
    )
  }

  const title = language === 'en' ? content.title : content.titleAr
  const description = language === 'en' ? content.description : content.descriptionAr

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        {content.posterUrl ? (
          <img
            src={content.posterUrl}
            alt={title}
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              {/* Poster */}
              <div className="hidden md:block flex-shrink-0 relative">
                {content.posterUrl ? (
                  <img
                    src={content.posterUrl}
                    alt={title}
                    className="w-48 h-72 object-cover rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="w-48 h-72 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg shadow-2xl flex items-center justify-center">
                    <span className="text-white text-center px-4">{title}</span>
                  </div>
                )}
                {/* Rating Badge on Poster */}
                <div className="absolute -bottom-2 -left-2 bg-yellow-500 text-white px-3 py-2 rounded-tr-lg font-bold text-lg shadow-lg">
                  ⭐ {content.rating.toFixed(1)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
                <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
                  <span>{content.releaseYear}</span>
                  {content.genre && <span>•</span>}
                  {content.genre && <span>{content.genre}</span>}
                  {content.duration && <span>•</span>}
                  {content.duration && (
                    <span>
                      {content.duration} {t.minutes}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                    <Play className="w-5 h-5 mr-2" />
                    {t.play}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20"
                    onClick={handleAddToWatchlist}
                    disabled={isInWatchlist}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {isInWatchlist ? 'In Watchlist' : t.addToWatchlist}
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    <Share2 className="w-5 h-5 mr-2" />
                    {t.share}
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    <Download className="w-5 h-5 mr-2" />
                    {t.download}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">{t.description}</TabsTrigger>
            <TabsTrigger value="ratings">{t.ratings}</TabsTrigger>
            {content.cast && <TabsTrigger value="cast">{t.cast}</TabsTrigger>}
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description" className="mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">{t.description}</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{description}</p>

              {content.director && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-gray-600">
                    <span className="font-bold">{t.director}:</span> {content.director}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Ratings & Reviews Tab */}
          <TabsContent value="ratings" className="mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{t.ratings}</h2>

              {/* Overall Rating */}
              <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-yellow-500">
                    {content.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="text-2xl">⭐⭐⭐⭐⭐</div>
                    <p className="text-gray-600">
                      {language === 'en' ? 'Based on user ratings' : 'بناءً على تقييمات المستخدمين'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                {content.reviews && content.reviews.length > 0 ? (
                  content.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">
                        {language === 'en' ? review.comment : review.commentAr}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">{t.noReviews}</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Cast Tab */}
          {content.cast && (
            <TabsContent value="cast" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">{t.cast}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {content.cast.map((actor, index) => (
                    <div key={index} className="text-center">
                      <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-gray-500">{actor}</span>
                      </div>
                      <p className="font-semibold text-sm">{actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  )
}
