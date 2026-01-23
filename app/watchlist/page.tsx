'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { watchlistApi } from '@/lib/api/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/auth/login')
      return
    }

    const fetchWatchlist = async () => {
      try {
        setLoading(true)
        const res = await watchlistApi.getWatchlist()
        setWatchlist(res.data)
      } catch (error) {
        console.error('Error fetching watchlist:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWatchlist()
  }, [router])

  const handleRemove = async (id: string) => {
    try {
      await watchlistApi.removeFromWatchlist(id)
      setWatchlist(watchlist.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error removing from watchlist:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Watchlist</h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : watchlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your watchlist is empty</p>
          <Button onClick={() => router.push('/content/movies')}>
            Browse Movies
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {watchlist.map((item) => (
            <Card key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  Status: {item.status}
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
