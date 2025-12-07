import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Heart, Edit, Trash2, Sparkles, ArrowRight } from 'lucide-react'
import { portfolioApi } from '../utils/api'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import ConfirmDialog from '../components/ConfirmDialog'

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, portfolioId: null, portfolioTitle: null })
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    fetchPortfolios()
    
    // Refresh portfolios when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPortfolios()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user?.id, user?.userId])

  const fetchPortfolios = async () => {
    if (!user) {
      console.warn('User not authenticated')
      setPortfolios([])
      return
    }

    const userId = user.id || user.userId
    if (!userId) {
      console.warn('User ID not available in user object:', user)
      setPortfolios([])
      return
    }

    setIsLoading(true)
    try {
      console.log('Fetching portfolios for user:', userId)
      const response = await portfolioApi.get(`/api/portfolios/user/${userId}`)
      console.log('Portfolios response:', response.data)
      
      if (response.data && response.data.success) {
        // The API returns data as an array directly, not nested
        const portfolioData = response.data.data
        console.log('Portfolios data:', portfolioData)
        
        if (Array.isArray(portfolioData)) {
          setPortfolios(portfolioData)
        } else {
          console.warn('Portfolio data is not an array:', portfolioData)
          setPortfolios([])
        }
      } else {
        console.warn('Unexpected response format:', response.data)
        setPortfolios([])
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error)
      toast.error('Failed to load portfolios')
      setPortfolios([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (portfolioId, portfolioTitle) => {
    setDeleteConfirm({
      isOpen: true,
      portfolioId,
      portfolioTitle
    })
  }

  const handleConfirmDelete = async () => {
    const { portfolioId } = deleteConfirm
    setDeleteConfirm({ isOpen: false, portfolioId: null, portfolioTitle: null })

    try {
      const response = await portfolioApi.delete(`/api/portfolios/${portfolioId}`)
      
      if (response.data && response.data.success) {
        toast.success('Portfolio deleted successfully!')
        // Remove from local state
        setPortfolios(portfolios.filter(p => p.id !== portfolioId))
      } else {
        toast.error('Failed to delete portfolio')
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error)
      toast.error(error.response?.data?.message || 'Failed to delete portfolio')
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirm({ isOpen: false, portfolioId: null, portfolioTitle: null })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-primary-100/70 bg-white/80 dark:bg-gh-bg-secondary/70 backdrop-blur-xl mb-10 px-6 py-8 md:px-10">
        <div className="absolute inset-0 bg-future-radial opacity-70"></div>
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary-200/40 blur-3xl"></div>
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-500 dark:bg-gh-bg/80">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span>Workspace</span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-gh-text">
              My Portfolios
            </h1>
            <p className="mt-2 max-w-xl text-future-muted dark:text-gh-text-secondary">
              Kelola koleksi proyek dosenmu, kembangkan ide baru, dan hadirkan karya terbaik dengan tampilan futuristik konsisten di seluruh platform.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchPortfolios}
              className="btn btn-secondary btn-compact"
            >
              Refresh
            </button>
            <Link
              to="/my-portfolios/create"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Portofolio</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-primary-400 border-t-transparent"></div>
          <p className="mt-3 text-future-muted dark:text-gh-text-secondary">Memuat portofolio terbaikmu...</p>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="card relative overflow-hidden py-12 px-6 text-center">
          <div className="absolute inset-0 bg-future-radial opacity-60"></div>
          <div className="relative">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100/60 text-primary-500 shadow-inner">
              <Plus className="h-12 w-12" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-gh-text">
              Belum ada portofolio
            </h3>
            <p className="mx-auto mb-8 max-w-md text-future-muted dark:text-gh-text-secondary">
              Mulai perjalanan kreatifmu dengan menyusun portofolio pertama dan dapatkan rekomendasi futuristik dari kami.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={fetchPortfolios}
                className="btn btn-outline btn-compact"
              >
                Segarkan Data
              </button>
              <Link
                to="/my-portfolios/create"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Ciptakan Portofolio</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="card group relative overflow-hidden border border-primary-100/60 bg-white/80 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-gh-bg-secondary/70">
              {portfolio.thumbnail ? (
                <img
                  src={portfolio.thumbnail}
                  alt={portfolio.title}
                  className="object-contain h-48 w-full"
                />
              ) : (
                <div className="h-48 w-full bg-slate-100 dark:bg-gh-bg-secondary/70"></div>
              )}
              <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-gh-text">
                {portfolio.title}
              </h2>
              <p className="mb-4 line-clamp-3 text-future-muted dark:text-gh-text-secondary">
                {portfolio.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {portfolio.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-green-200/60 dark:border-green-700/60 bg-green-50/70 dark:bg-green-900/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between text-sm text-future-muted dark:text-gh-text-secondary">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-4 w-4 text-primary-500" />
                    {portfolio.views || 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-4 w-4 text-primary-500" />
                    {portfolio.likes || 0}
                  </span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    portfolio.status === 'published'
                      ? 'bg-green-50/80 dark:bg-green-900/40 text-green-600 dark:text-green-200 border border-green-200/60 dark:border-green-700/60'
                      : portfolio.status === 'draft'
                      ? 'bg-amber-50/80 dark:bg-amber-900/40 text-amber-600 dark:text-amber-200 border border-amber-200/60 dark:border-amber-700/60'
                      : 'bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60'
                  }`}
                >
                  {portfolio.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-primary-200/60 pt-4 dark:border-gh-border">
                <Link
                  to={`/my-portfolios/${portfolio.id}/edit`}
                  className="btn btn-outline btn-compact flex-1 justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => handleDeleteClick(portfolio.id, portfolio.title)}
                  className="btn btn-outline btn-compact border-red-200 text-red-500 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                  title="Delete portfolio"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Portfolio"
        message={`Are you sure you want to delete "${deleteConfirm.portfolioTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}
