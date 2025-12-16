import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Eye, Heart, Search, User, Sparkles, UserPlus, ArrowRight, TrendingUp, Calendar, FileText, Zap } from 'lucide-react'
import { portfolioApi, userApi } from '../utils/api'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalProjects: 0,
    avgViewsPerProject: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recommended, setRecommended] = useState([])
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true)
  const [recommendedUsers, setRecommendedUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [userPortfolios, setUserPortfolios] = useState([])
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id && !user?.userId) {
        setIsLoading(false)
        return
      }

      try {
        const userId = user.id || user.userId
        const response = await portfolioApi.get(`/api/portfolios/user/${userId}`)
        
        if (response.data && response.data.success) {
          const portfolios = response.data.data || []
          
          // Calculate stats
          const totalViews = portfolios.reduce((sum, p) => sum + (p.views || 0), 0)
          const totalLikes = portfolios.reduce((sum, p) => sum + (p.likes || 0), 0)
          const totalProjects = portfolios.length
          const avgViewsPerProject = totalProjects > 0 ? Math.round(totalViews / totalProjects) : 0
          
          setStats({
            totalViews,
            totalLikes,
            totalProjects,
            avgViewsPerProject
          })

          // Store user portfolios for recent section
          setUserPortfolios(portfolios.slice(0, 5))
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Don't show error toast, just log it
      } finally {
        setIsLoading(false)
        setIsLoadingPortfolios(false)
      }
    }

    fetchStats()
  }, [user?.id, user?.userId])

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await portfolioApi.get('/api/portfolios?limit=4&status=published')
        const portfolios = response.data?.data?.portfolios ?? []
        setRecommended(portfolios)
      } catch (error) {
        console.error('Failed to fetch recommended portfolios:', error)
      } finally {
        setIsLoadingRecommended(false)
      }
    }

    fetchRecommended()
  }, [])

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      try {
        const response = await userApi.get('/api/users?limit=4')
        const users = response.data?.data?.users ?? []
        setRecommendedUsers(users)
      } catch (error) {
        console.error('Failed to fetch recommended users:', error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchRecommendedUsers()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-primary-600 dark:bg-gh-bg-secondary/60 dark:text-gh-text-secondary">
          <Sparkles className="h-4 w-4 text-primary-500" />
          <span>Selamat datang</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-gh-text">
          Halo, {user?.username}! 🌱
        </h1>
        <p className="text-future-muted dark:text-gh-text-secondary mt-2 max-w-2xl">
          Kelola portofolio, pantau performa, dan temukan inspirasi terbaru yang kami rekomendasikan khusus untukmu.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/portfolios/create"
          className="card p-6 hover:-translate-y-1 hover:shadow-lg transition-all text-left"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="w-14 h-14 bg-primary-100/80 dark:bg-gh-bg-tertiary rounded-2xl flex items-center justify-center shadow-inner">
              <Plus className="h-6 w-6 text-primary-600 dark:text-gh-accent" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500 dark:text-gh-accent">
              Buat baru
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gh-text text-xl mb-3">Workspace Portofolio</h3>
          <p className="text-sm text-gray-600 dark:text-gh-text-secondary mb-6">
            Mulai proyek baru dengan template futuristik dan pemantauan metrik langsung.
          </p>
          <div className="inline-flex items-center gap-2 text-primary-600 dark:text-gh-accent font-semibold">
            Mulai dari konsep
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>

        <Link
          to="/portfolios"
          className="card p-6 hover:-translate-y-1 hover:shadow-lg transition-all text-center"
        >
          <div className="w-14 h-14 bg-primary-50 dark:bg-gh-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Eye className="h-6 w-6 text-primary-500 dark:text-gh-accent" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gh-text mb-2">My Portfolios</h3>
          <p className="text-sm text-gray-600 dark:text-gh-text-secondary">View and manage your projects</p>
        </Link>

        <Link
          to="/profile"
          className="card p-6 hover:-translate-y-1 hover:shadow-lg transition-all text-center"
        >
          <div className="w-14 h-14 bg-primary-50/80 dark:bg-gh-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <User className="h-6 w-6 text-primary-500 dark:text-gh-accent" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gh-text mb-2">Edit Profile</h3>
          <p className="text-sm text-gray-600 dark:text-gh-text-secondary">Update your profile information</p>
        </Link>

        <Link
          to="/search"
          className="card p-6 hover:-translate-y-1 hover:shadow-lg transition-all text-center"
        >
          <div className="w-14 h-14 bg-primary-50/80 dark:bg-gh-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Search className="h-6 w-6 text-primary-500 dark:text-gh-accent" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gh-text mb-2">Explore</h3>
          <p className="text-sm text-gray-600 dark:text-gh-text-secondary">Discover other portfolios</p>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gh-text-secondary mb-1">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gh-text">
                {isLoading ? '-' : stats.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gh-text-secondary mb-1">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gh-text">
                {isLoading ? '-' : stats.totalLikes.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gh-text-secondary mb-1">Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gh-text">
                {isLoading ? '-' : stats.totalProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gh-text-secondary mb-1">Avg Views/Project</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gh-text">
                {isLoading ? '-' : stats.avgViewsPerProject}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Portfolios Section */}
      {!isLoadingPortfolios && userPortfolios.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-gh-text flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600 dark:text-gh-accent" />
                Portofolio Terbaru
              </h2>
              <p className="text-sm text-future-muted dark:text-gh-text-secondary mt-1">
                Kelola dan pantau portofolio terbaru Anda
              </p>
            </div>
            <Link
              to="/my-portfolios"
              className="btn btn-outline btn-compact"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                onClick={() => navigate(`/my-portfolios/${portfolio.id}/edit`)}
                className="card p-5 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer"
              >
                {portfolio.thumbnail && (
                  <img
                    src={portfolio.thumbnail}
                    alt={portfolio.title}
                    className="w-full h-32 object-cover rounded-lg mb-4 border border-future-border/60 dark:border-gh-border"
                  />
                )}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-gh-text mb-2 line-clamp-2">
                  {portfolio.title}
                </h3>
                <p className="text-sm text-future-muted dark:text-gh-text-secondary line-clamp-2 mb-4">
                  {portfolio.description}
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-future-border/70 dark:border-gh-border">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gh-text-secondary">
                    <Eye className="h-4 w-4" />
                    <span>{portfolio.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gh-text-secondary">
                    <Heart className="h-4 w-4" />
                    <span>{portfolio.likes || 0}</span>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      portfolio.status === 'published'
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                    }`}>
                      {portfolio.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1fr] gap-6 mb-8">
        <div className="card p-6 h-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-gh-text">Rekomendasi Portofolio</h2>
              <p className="text-sm text-future-muted dark:text-gh-text-secondary">
                Koleksi pilihan tim kami untuk menginspirasi pengembangan portofoliomu.
              </p>
            </div>
            <Link
              to="/search"
              className="btn btn-outline btn-compact"
            >
              Lihat Semua
            </Link>
          </div>

          {isLoadingRecommended ? (
            <div className="py-8 text-center text-future-muted dark:text-gh-text-secondary">
              Memuat rekomendasi terbaik untukmu...
            </div>
          ) : recommended.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommended.map((portfolio) => {
                const creator = portfolio.user || portfolio.owner
                const initials = (creator?.firstName?.[0] || creator?.username?.[0] || '?').toUpperCase()

                const handleOpenPortfolio = () => navigate(`/portfolio/${portfolio.id}`)
                const handleOpenCreator = (event) => {
                  event.stopPropagation()
                  if (creator?.username) navigate(`/u/${creator.username}`)
                }

                return (
                  <article
                    key={portfolio.id}
                    role="button"
                    tabIndex={0}
                    onClick={handleOpenPortfolio}
                    onKeyDown={(event) => event.key === 'Enter' && handleOpenPortfolio()}
                    className="card p-5 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {portfolio.thumbnail && (
                      <img
                        src={portfolio.thumbnail}
                        alt={portfolio.title}
                        className="w-full h-36 object-cover rounded-xl mb-4 border border-future-border/60 dark:border-gh-border"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gh-text mb-2 line-clamp-2">
                      {portfolio.title}
                    </h3>
                    <p className="text-sm text-future-muted dark:text-gh-text-secondary line-clamp-3 mb-4">
                      {portfolio.description}
                    </p>

                    {creator && (
                      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-future-border/70 dark:border-gh-border">
                        <div className="flex items-center gap-3">
                          {creator.avatar ? (
                            <img
                              src={creator.avatar}
                              alt={creator.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 flex items-center justify-center text-sm font-bold">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-gh-text truncate">{creator.username}</p>
                            <p className="text-xs text-future-muted dark:text-gh-text-tertiary truncate">
                              {creator.university || 'Universitas Futuristik'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenCreator}
                          className="btn btn-secondary btn-compact whitespace-nowrap"
                        >
                          Profil Dosen
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {portfolio.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary-50/80 text-primary-600 px-3 py-1 text-xs font-medium border border-primary-200/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-future-muted dark:text-gh-text-secondary">
              Belum ada rekomendasi. Mulai eksplor portofolio lain untuk mendapatkan inspirasi.
            </div>
          )}
        </div>

        <div className="card p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-gh-text">Para Dosen Unggulan</h2>
              <p className="text-sm text-future-muted dark:text-gh-text-secondary">
                Akun aktif dengan portofolio menarik untuk kamu ikuti.
              </p>
            </div>
            <Link
              to="/search?type=users"
              className="text-sm font-semibold text-primary-600 hover:text-primary-500"
            >
              Lihat akun
            </Link>
          </div>

          {isLoadingUsers ? (
            <div className="py-6 text-center text-future-muted dark:text-gh-text-secondary">
              Mengambil profil unggulan...
            </div>
          ) : recommendedUsers.length > 0 ? (
            <div className="space-y-4">
              {recommendedUsers.map((profile) => {
                const initials = (profile.firstName?.[0] || profile.username?.[0] || '?')
                return (
                  <div key={profile.id} className="bg-white dark:bg-gh-bg-tertiary px-4 py-3 flex items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gh-border">
                    <div className="flex items-center gap-3">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.username}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 flex items-center justify-center text-lg font-bold">
                          {initials.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-gh-text">{profile.username}</p>
                        <p className="text-xs text-future-muted dark:text-gh-text-secondary">
                          {profile.university || 'Universitas Futuristik'} • {profile.department || 'Informatika'}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/u/${profile.username}`}
                      className="btn btn-secondary btn-compact inline-flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Lihat Profil
                    </Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-future-muted dark:text-gh-text-secondary">
              Belum ada akun yang direkomendasikan.
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
