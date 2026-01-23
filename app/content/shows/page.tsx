'use client'

import { useEffect, useState } from 'react'
import { contentApi } from '@/lib/api/client'
import { ShowCard } from '@/components/content/ShowCard'
import { Button } from '@/components/ui/button'

export default function ShowsPage() {
  const [shows, setShows] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true)
        const res = await contentApi.getShows(page, 20)
        setShows(res.data)
        setTotal(res.pagination.total)
      } catch (error) {
        console.error('Error fetching shows:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [page])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">TV Shows</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center">
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <Button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
