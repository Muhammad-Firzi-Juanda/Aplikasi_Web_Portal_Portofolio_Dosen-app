import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Link } from 'react-router-dom'
import { Plus, Eye, Heart, Search, User, Sparkles, UserPlus, ArrowRight } from 'lucide-react'
import { portfolioApi, userApi } from '../utils/api'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalProjects: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recommended, setRecommended] = useState([])
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true)
  const [recommendedUsers, setRecommendedUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

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
          const portfolios = response.data.data
          
          // Calculate stats
          const totalViews = portfolios.reduce((sum, p) => sum + (p.views || 0), 0)
          const totalLikes = portfolios.reduce((sum, p) => sum + (p.likes || 0), 0)
          const totalProjects = portfolios.length
          
          setStats({
            totalViews,
            totalLikes,
            totalProjects
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        toast.error('Failed to load dashboard stats')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user?.id, user?.userId])

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await portfolioApi.get('/api/portfolios?featured=true&limit=4')
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
          <span>Selamat datang kembali</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-gh-text">
          Halo, {user?.username}! 🌱
        </h1>
        <p className="text-future-muted dark:text-gh-text-secondary mt-2 max-w-2xl">
          Kelola portofolio, pantau performa, dan temukan inspirasi terbaru yang kami rekomendasikan khusus untukmu.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/portfolios/create"
          className="card p-6 hover:-translate-y-1 hover:shadow-lg transition-all text-left lg:col-span-2"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 dark:bg-gh-bg-tertiary rounded-full flex items-center justify-center">
              <Eye className="h-5 w-5 text-primary-600 dark:text-gh-accent" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gh-text-secondary">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gh-text">
                {isLoading ? '-' : stats.totalViews}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gh-text-secondary">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gh-text">
                {isLoading ? '-' : stats.totalLikes}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gh-text-secondary">Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gh-text">
                {isLoading ? '-' : stats.totalProjects}
              </p>
            </div>
          </div>
        </div>
      </div>

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
              {recommended.map((portfolio) => (
                <div key={portfolio.id} className="card p-5 hover:-translate-y-1 hover:shadow-lg transition-all">
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {portfolio.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary-50/80 text-primary-600 px-3 py-1 text-xs font-medium border border-primary-200/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/portfolio/${portfolio.id}`}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-500 dark:text-gh-accent dark:hover:text-gh-accent-hover text-sm font-semibold"
                  >
                    Lihat Detail
                  </Link>
                </div>
              ))}
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

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gh-text mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gh-text-secondary mb-4">No recent activity</p>
          <Link
            to="/portfolios/create"
            className="btn btn-primary"
          >
            Create Your First Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
