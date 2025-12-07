import { Link } from 'react-router-dom'
import { ArrowRight, Award, Play, Search, Sparkles, Users, Zap, UserPlus } from 'lucide-react'
import { useQuery } from 'react-query'
import { portfolioApi } from '../utils/api'

export default function HomePage() {
  // Fetch featured portfolios
  const { data: featuredPortfolios } = useQuery(
    'featuredPortfolios',
    async () => {
      const response = await portfolioApi.get('/api/portfolios?featured=true&limit=6')
      return response.data.data.portfolios
    },
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  )

  // Fetch recommended users
  const { data: recommendedUsers } = useQuery(
    'recommendedUsers',
    async () => {
      const response = await portfolioApi.get('/api/users?limit=5')
      return response.data.data.users || []
    },
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  )

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-future-border dark:border-gh-border">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50 to-primary-100 dark:from-gh-bg dark:via-gh-bg-secondary dark:to-gh-bg" />
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary-200/45 blur-3xl dark:bg-primary-400/25" />
          <div className="absolute bottom-[-15%] right-[-10%] h-96 w-96 rounded-full bg-primary-300/35 blur-[120px] dark:bg-primary-500/25" />
        </div>
        <div className="absolute inset-0 bg-future-grid opacity-20 dark:opacity-10" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-900 dark:text-gh-text">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary-200 text-xs font-semibold uppercase tracking-[0.35em] text-primary-600 shadow-sm dark:bg-white/10 dark:border-white/20 dark:text-gh-text mb-8">
            FUTURE-READY PORTFOLIO HUB
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Portal Portofolio Dosen
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-future-muted dark:text-gh-text-secondary max-w-3xl mx-auto">
            Platform modern untuk mengelola dan menampilkan portofolio akademik dengan estetika futuristik dan
            komposisi warna putih-hijau yang fresh. Dibangun di atas arsitektur sistem terdistribusi yang scalable
            dan aman.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.1fr,0.9fr,1.1fr] items-stretch">
            <Link
              to="/register"
              className="btn btn-primary btn-xl h-full sm:col-span-2 lg:col-span-1 flex flex-col items-start justify-between gap-4 text-left"
            >
              <span className="text-xs font-semibold tracking-[0.35em] text-white/70">
                MULAI SEKARANG
              </span>
              <div>
                <span className="text-2xl font-semibold block">Bangun akun futuristik</span>
                <p className="text-sm text-white/75 mt-2">
                  Dapatkan akses ke editor portofolio neon dengan tema hijau modern.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                Buat akun baru
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <div className="glass-panel p-6 sm:col-span-1 flex flex-col justify-between gap-4 dark:bg-gh-bg-secondary/60 dark:border-gh-border">
              <div>
                <p className="text-sm font-semibold text-primary-600 dark:text-gh-accent uppercase tracking-[0.2em] mb-2">
                  Jelajah cepat
                </p>
                <p className="text-future-muted dark:text-gh-text-secondary">
                  Temukan karya unggulan dan temukan kolaborator baru dengan kurasi cerdas.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  to="/search"
                  className="btn btn-secondary btn-compact justify-between"
                >
                  <span>Cari portofolio terbaik</span>
                  <Search className="h-4 w-4" />
                </Link>
                <Link
                  to="/search?sort=views"
                  className="btn btn-outline btn-compact justify-between"
                >
                  <span>Trending minggu ini</span>
                  <Sparkles className="h-4 w-4 text-primary-500" />
                </Link>
              </div>
            </div>

            <div className="glass-panel p-6 sm:col-span-2 lg:col-span-1 flex flex-col justify-between gap-5 dark:bg-gh-bg-secondary/60 dark:border-gh-border">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-primary-600 dark:text-gh-accent uppercase tracking-[0.2em]">
                  inspirasi cepat
                </p>
                <p className="text-future-muted dark:text-gh-text-secondary">
                  Lihat kategori paling populer dan temukan ide baru untuk portofoliomu.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['AI Research', 'UI Futuristik', 'Sistem Terdistribusi'].map((topic) => (
                  <Link
                    key={topic}
                    to={`/search?q=${encodeURIComponent(topic)}`}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 dark:border-gh-border px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-gh-accent hover:bg-primary-50 dark:hover:bg-gh-bg-tertiary"
                  >
                    #{topic}
                  </Link>
                ))}
              </div>
              <Link
                to="/portfolios"
                className="self-end btn btn-outline btn-compact"
              >
                Lihat inspirasi terbaru
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-future-surface-strong/60 dark:bg-gh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-gh-text mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-future-muted dark:text-gh-text-secondary max-w-2xl mx-auto">
              Sistem terdistribusi dengan teknologi modern untuk pengalaman terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
              icon: Users,
              title: 'Manajemen Profil',
              description: 'Kelola profil akademik lengkap dengan informasi pendidikan dan pengalaman',
              gradient: 'from-primary-50 via-primary-100 to-primary-200',
              iconClass: 'text-primary-600'
            }, {
              icon: Award,
              title: 'Portfolio CRUD',
              description: 'Buat, edit, dan kelola portofolio proyek dengan mudah dan intuitif',
              gradient: 'from-primary-100 via-primary-200 to-primary-300',
              iconClass: 'text-primary-600'
            }, {
              icon: Search,
              title: 'Pencarian Cerdas',
              description: 'Temukan portofolio dengan pencarian full-text menggunakan Meilisearch',
              gradient: 'from-primary-50 via-future-highlight to-primary-200',
              iconClass: 'text-primary-600'
            }, {
              icon: Zap,
              title: 'Performa Tinggi',
              description: 'Sistem terdistribusi dengan caching Redis dan async processing',
              gradient: 'from-primary-100 via-primary-200 to-primary-400',
              iconClass: 'text-primary-600'
            }].map(({ icon: Icon, title, description, gradient, iconClass }) => (
              <div key={title} className="card text-center p-8">
                <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary-100/70 dark:border-gh-border bg-gradient-to-br ${gradient} shadow-glow`}
                >
                  <Icon className={`h-9 w-9 ${iconClass}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-gh-text">{title}</h3>
                <p className="text-future-muted dark:text-gh-text-secondary">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolios */}
      {featuredPortfolios && featuredPortfolios.length > 0 && (
        <section className="py-20 bg-future-bg dark:bg-gh-bg-secondary border-b border-future-border dark:border-gh-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-gh-text mb-4">
                Portofolio Unggulan
              </h2>
              <p className="text-xl text-future-muted dark:text-gh-text-secondary">
                Temukan karya-karya terbaik dari para dosen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPortfolios.map((portfolio) => (
                <div key={portfolio.id} className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {portfolio.thumbnail && (
                    <img
                      src={portfolio.thumbnail}
                      alt={portfolio.title}
                      className="w-full h-48 object-cover rounded-xl mb-4 border border-future-border/70 dark:border-gh-border"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-gh-text">{portfolio.title}</h3>
                  <p className="text-future-muted dark:text-gh-text-secondary mb-4 line-clamp-3">
                    {portfolio.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {portfolio.tags?.slice(0, 3).map((tag, idx) => {
                      const colors = [
                        'bg-primary-100 dark:bg-gh-info-light/20 text-primary-700 dark:text-gh-info border-primary-200 dark:border-gh-info/50',
                        'bg-green-100 dark:bg-gh-success-light/20 text-green-700 dark:text-gh-success border-green-200 dark:border-gh-success/50',
                        'bg-purple-100 dark:bg-gh-purple-light/20 text-purple-700 dark:text-gh-purple border-purple-200 dark:border-gh-purple/50',
                      ]
                      return (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-sm rounded border ${colors[idx % colors.length]}`}
                        >
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                  <Link
                    to={`/portfolio/${portfolio.id}`}
                    className="text-primary-500 dark:text-gh-accent hover:text-primary-600 dark:hover:text-gh-accent-hover font-medium transition-colors"
                  >
                    Lihat Detail →
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/search"
                className="btn btn-primary px-8 py-3"
              >
                Lihat Semua Portofolio
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Teachers Section */}
      {recommendedUsers && recommendedUsers.length > 0 && (
        <section className="py-20 bg-future-bg dark:bg-gh-bg-secondary border-b border-future-border dark:border-gh-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-gh-text mb-4">
                Para Dosen Unggulan
              </h2>
              <p className="text-xl text-future-muted dark:text-gh-text-secondary">
                Akun aktif dengan portofolio menarik untuk kamu ikuti
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {recommendedUsers.map((profile) => {
                const initials = (profile.firstName?.[0] || profile.username?.[0] || '?')
                return (
                  <div key={profile.id} className="card p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-4">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.username}
                          className="h-20 w-20 rounded-full object-cover border-2 border-primary-200 dark:border-gh-border"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 flex items-center justify-center text-2xl font-bold border-2 border-primary-200 dark:border-gh-border">
                          {initials.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-gh-text mb-1">
                      {profile.username}
                    </h3>
                    <p className="text-sm text-future-muted dark:text-gh-text-secondary mb-4">
                      {profile.university || 'Universitas Futuristik'} • {profile.department || 'Informatika'}
                    </p>
                    <Link
                      to={`/u/${profile.username}`}
                      className="btn btn-secondary btn-compact w-full justify-center inline-flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Lihat Profil
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/search?type=users"
                className="btn btn-primary px-8 py-3"
              >
                Lihat Semua Dosen
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack Section */}
      <section className="py-20 bg-future-surface-strong/70 dark:bg-gh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-gh-text mb-4">
              Teknologi Modern
            </h2>
            <p className="text-xl text-future-muted dark:text-gh-text-secondary">
              Dibangun dengan arsitektur microservices dan teknologi terdepan
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-80 dark:opacity-60">
            {[
              'React', 'Node.js', 'PostgreSQL', 'Docker',
              'RabbitMQ', 'MinIO', 'Meilisearch', 'Nginx'
            ].map((tech) => (
              <div key={tech} className="text-center">
                <div className="w-20 h-20 glass-panel flex items-center justify-center mx-auto mb-3 text-center">
                  <span className="text-sm font-semibold text-future-muted dark:text-gh-text-secondary">{tech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
