import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Eye, Heart, ExternalLink, Github, Calendar, User } from 'lucide-react'
import { portfolioApi } from '../utils/api'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export default function PortfolioDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [portfolio, setPortfolio] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        // Increment view count
        await portfolioApi.post(`/api/portfolios/${id}/view`).catch(err => {
          console.log('View increment failed (expected for guests):', err.message)
        })

        // Load portfolio data
        const response = await portfolioApi.get(`/api/portfolios/${id}`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.data && response.data.success) {
          setPortfolio(response.data.data)
          console.log('Loaded portfolio:', response.data.data)
        } else if (response.status === 304) {
          // Handle 304 Not Modified - retry with fresh request
          console.log('Got 304, retrying...')
          const freshResponse = await portfolioApi.get(`/api/portfolios/${id}`)
          if (freshResponse.data && freshResponse.data.success) {
            setPortfolio(freshResponse.data.data)
            console.log('Loaded portfolio:', freshResponse.data.data)
          } else {
            toast.error('Failed to load portfolio')
          }
        } else {
          toast.error('Failed to load portfolio')
        }
      } catch (error) {
        console.error('Failed to load portfolio:', error)
        toast.error('Failed to load portfolio')
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolio()
  }, [id])

  // Check if user liked this portfolio
  useEffect(() => {
    const checkLike = async () => {
      if (!isAuthenticated || !portfolio) return
      
      try {
        const response = await portfolioApi.get(`/api/portfolios/${portfolio.id}/like/check`)
        if (response.data && response.data.success) {
          setIsLiked(response.data.data.isLiked)
        }
      } catch (error) {
        console.error('Failed to check like status:', error)
      }
    }

    checkLike()
  }, [portfolio?.id, isAuthenticated])

  const handleLike = async () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error('Please login to like portfolios')
      navigate('/login')
      return
    }

    if (!portfolio || isLiking) return

    setIsLiking(true)
    try {
      const response = await portfolioApi.post(`/api/portfolios/${portfolio.id}/like`)
      
      if (response.data && response.data.success) {
        setPortfolio(prev => ({
          ...prev,
          likes: response.data.data.likes
        }))
        setIsLiked(response.data.data.isLiked)
        
        if (response.data.data.isLiked) {
          toast.success('Portfolio liked!')
        } else {
          toast.success('Portfolio unliked')
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      if (error.response?.status === 401) {
        toast.error('Please login to like portfolios')
        navigate('/login')
      } else {
        toast.error(error.response?.data?.message || 'Failed to toggle like')
      }
    } finally {
      setIsLiking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio not found</h1>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gh-text mb-4">
          {portfolio.title}
        </h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gh-text-secondary">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(portfolio.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {portfolio.views} views
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`btn flex items-center space-x-2 transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'btn-outline hover:bg-red-50'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isAuthenticated ? 'Like this portfolio' : 'Login to like'}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{portfolio.likes}</span>
            </button>
            
            {portfolio.demoUrl && (
              <a
                href={portfolio.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Demo</span>
              </a>
            )}
            
            {portfolio.repositoryUrl && (
              <a
                href={portfolio.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {portfolio.tags && portfolio.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Thumbnail */}
      {portfolio.thumbnail && (
        <div className="mb-8">
          <img 
            src={portfolio.thumbnail} 
            alt={portfolio.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Images */}
      {portfolio.images && portfolio.images.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4">
            {portfolio.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${portfolio.title} - Image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gh-text mb-4">
          About This Project
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 dark:text-gh-text-secondary leading-relaxed">
            {portfolio.description}
          </p>
        </div>
      </div>

      {/* Project Details */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gh-text mb-4">
          Project Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gh-text mb-2">Category</h3>
            <p className="text-gray-600 dark:text-gh-text-secondary">{portfolio.category}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gh-text mb-2">Status</h3>
            <span className={`px-2 py-1 rounded text-sm ${
              portfolio.status === 'published' 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
            }`}>
              {portfolio.status}
            </span>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gh-text mb-2">Created</h3>
            <p className="text-gray-600 dark:text-gh-text-secondary">
              {new Date(portfolio.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gh-text mb-2">Last Updated</h3>
            <p className="text-gray-600 dark:text-gh-text-secondary">
              {new Date(portfolio.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
