import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Eye } from 'lucide-react'
import { useQuery } from 'react-query'
import { portfolioApi } from '../utils/api'

export default function AllPortfoliosPage() {
  const [page, setPage] = useState(1)
  const limit = 12

  // Fetch all portfolios
  const { data: portfoliosData, isLoading } = useQuery(
    ['allPortfolios', page],
    async () => {
      const response = await portfolioApi.get(`/api/portfolios?page=${page}&limit=${limit}&status=published`)
      return response.data.data
    },
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  )

  const portfolios = portfoliosData?.portfolios || []
  const pagination = portfoliosData?.pagination || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gh-text mb-4">
          Semua Portofolio
        </h1>
        <p className="text-xl text-gray-600 dark:text-gh-text-secondary">
          Jelajahi portofolio dari semua dosen yang telah dipublikasikan
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="w-full h-48 bg-gray-200 dark:bg-gh-bg-tertiary rounded-t-lg" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gh-bg-tertiary rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gh-bg-tertiary rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gh-bg-tertiary rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Portfolios Grid */}
      {!isLoading && portfolios.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {portfolios.map((portfolio) => {
              const ownerInitials = (portfolio.user?.firstName?.[0] || portfolio.user?.username?.[0] || '?')
              return (
                <div key={portfolio.id} className="card overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  {portfolio.thumbnail && (
                    <img
                      src={portfolio.thumbnail}
                      alt={portfolio.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <Link to={`/portfolio/${portfolio.id}`} className="hover:text-primary-600 dark:hover:text-gh-accent">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gh-text">{portfolio.title}</h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gh-text-secondary mb-4 line-clamp-2 flex-1">{portfolio.description}</p>

                    {/* Owner Info */}
                    {portfolio.user && (
                      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gh-border">
                        <Link to={`/u/${portfolio.user.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                          {portfolio.user.avatar ? (
                            <img
                              src={portfolio.user.avatar}
                              alt={portfolio.user.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 flex items-center justify-center text-sm font-bold">
                              {ownerInitials.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gh-text truncate">{portfolio.user.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gh-text-tertiary truncate">
                              {portfolio.user.university || 'Universitas Futuristik'}
                            </p>
                          </div>
                        </Link>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gh-text-tertiary">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(portfolio.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {portfolio.views || 0}
                      </span>
                    </div>

                    {/* Tags */}
                    {portfolio.tags && portfolio.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {portfolio.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn btn-secondary btn-compact disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      page === p
                        ? 'bg-primary-600 text-white dark:bg-gh-accent'
                        : 'bg-gray-200 dark:bg-gh-bg-tertiary text-gray-900 dark:text-gh-text hover:bg-gray-300 dark:hover:bg-gh-border'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="btn btn-secondary btn-compact disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && portfolios.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gh-text mb-2">
            Tidak ada portofolio
          </h3>
          <p className="text-gray-600 dark:text-gh-text-secondary mb-6">
            Belum ada portofolio yang dipublikasikan
          </p>
          <Link to="/search" className="btn btn-primary">
            Cari Portofolio
          </Link>
        </div>
      )}
    </div>
  )
}
