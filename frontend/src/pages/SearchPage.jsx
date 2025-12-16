import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { portfolioApi } from '../utils/api'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery) {
      setQuery(initialQuery)
      performSearch(initialQuery)
    }
  }, [])

  const performSearch = async (searchQuery) => {
    setIsLoading(true)
    
    try {
      // Try Meilisearch first
      try {
        const response = await portfolioApi.get(`/api/search/portfolios?q=${encodeURIComponent(searchQuery)}`)
        if (response.data.success) {
          setResults(response.data.data.hits || [])
          setIsLoading(false)
          return
        }
      } catch (searchError) {
        console.warn('Meilisearch failed, falling back to database search:', searchError)
      }
      
      // Fallback to database search
      const response = await portfolioApi.get(`/api/portfolios?search=${encodeURIComponent(searchQuery)}&status=published&isPublic=true`)
      if (response.data.success) {
        const portfolios = response.data.data.portfolios || []
        setResults(portfolios)
      } else {
        toast.error('Search failed. Please try again.')
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error(error.response?.data?.message || 'Search failed. Please try again.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setSearchParams({ q: query })
    performSearch(query)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gh-text mb-2">
        Search Portfolios
      </h1>
      <p className="text-gray-600 dark:text-gh-text-secondary mb-8">
        Find portfolios from all lecturers
      </p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari portofolio futuristik..."
            className="input pl-11 pr-12 w-full"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gh-text-tertiary" />
          <button
            type="submit"
            className="absolute right-3 top-2.5 text-primary-600 dark:text-gh-accent hover:text-primary-700 dark:hover:text-gh-accent-light"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Search Results */}
      {query && (
        <p className="text-gray-600 dark:text-gh-text-secondary mb-6">
          {isLoading ? 'Searching...' : `Search results for "${query}"`}
        </p>
      )}

      {!query && !isLoading && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 dark:text-gh-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gh-text mb-2">
            Search for portfolios
          </h3>
          <p className="text-gray-600 dark:text-gh-text-secondary">
            Enter keywords to find portfolios, projects, or tags
          </p>
        </div>
      )}

      {query && !isLoading && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 dark:text-gh-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gh-text mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gh-text-secondary">
            Try adjusting your search terms or browse all portfolios
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((portfolio) => {
            const ownerInitials = (portfolio.user?.firstName?.[0] || portfolio.user?.username?.[0] || '?').toUpperCase()
            
            const handleOpenPortfolio = () => navigate(`/portfolio/${portfolio.id}`)
            const handleOpenCreator = (event) => {
              event.stopPropagation()
              if (portfolio.user?.username) navigate(`/u/${portfolio.user.username}`)
            }
            
            return (
              <article
                key={portfolio.id}
                role="button"
                tabIndex={0}
                onClick={handleOpenPortfolio}
                onKeyDown={(event) => event.key === 'Enter' && handleOpenPortfolio()}
                className="card overflow-hidden hover:shadow-lg transition-all flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {portfolio.thumbnail && (
                  <img 
                    src={portfolio.thumbnail} 
                    alt={portfolio.title}
                    className="w-full h-48 object-cover bg-gray-100 dark:bg-gh-bg-tertiary"
                  />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gh-text hover:text-primary-600 dark:hover:text-gh-accent">{portfolio.title}</h3>
                  <p className="text-gray-600 dark:text-gh-text-secondary mb-4 line-clamp-2 flex-1">{portfolio.description}</p>
                  
                  {/* Owner Info */}
                  {portfolio.user && (
                    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gh-border">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {portfolio.user.avatar ? (
                            <img
                              src={portfolio.user.avatar}
                              alt={portfolio.user.username}
                              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {ownerInitials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gh-text truncate">{portfolio.user.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gh-text-tertiary truncate">
                              {portfolio.user.university || 'Universitas Futuristik'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenCreator}
                          className="btn btn-secondary btn-compact whitespace-nowrap flex-shrink-0"
                        >
                          Profil
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 text-sm rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
