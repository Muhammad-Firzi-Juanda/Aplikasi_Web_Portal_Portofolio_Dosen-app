# Portal Portofolio Dosen - Sistem Terdistribusi

## 📋 Deskripsi Proyek
Portal portofolio berbasis arsitektur microservices yang memungkinkan dosen untuk mengelola profil dan portofolio proyek mereka secara online. Sistem ini dibangun dengan prinsip sistem terdistribusi untuk skalabilitas dan ketahanan tinggi.

## 🏗️ Arsitektur Sistem

### Microservices:
1. **Auth Service** - Autentikasi & Otorisasi (JWT)
2. **User Service** - Manajemen data user
3. **Profile Service** - Manajemen profil dosen
4. **Portfolio Service** - CRUD proyek portofolio
5. **Media Service** - Upload & manajemen media
6. **Search Service** - Pencarian proyek dengan indexing
7. **Worker Service** - Asynchronous thumbnail generation

### Infrastructure:
- **API Gateway** - Nginx reverse proxy
- **Message Broker** - RabbitMQ untuk async processing
- **Database** - PostgreSQL (per service)
- **Object Storage** - MinIO untuk media files
- **Cache** - Redis untuk performa
- **Search Engine** - Meilisearch untuk full-text search

## 🚀 Teknologi Stack

### Backend:
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- RabbitMQ
- MinIO

### Frontend:
- React + Vite
- TailwindCSS
- Axios
- React Router

### DevOps:
- Docker & Docker Compose
- Nginx

## 📦 Fitur Utama

### Fitur Minimal:
- ✅ Registrasi & Login dengan JWT
- ✅ Manajemen Profil (nama, bio, kontak, social links)
- ✅ CRUD Proyek Portofolio (judul, deskripsi, tag, link)
- ✅ Upload Gambar dengan auto thumbnail generation
- ✅ Halaman Profil Publik: `/u/{username}`
- ✅ Pencarian Proyek (nama/tag)

### Fitur Bonus:
- ✅ Mode publik/privat proyek
- ✅ Dashboard analytics
- ✅ Caching untuk performa

## 🛠️ Instalasi & Menjalankan

### Prerequisites:
- Docker & Docker Compose
- Node.js 18+ (untuk development)
- Git

### Quick Start:

```bash
# Clone repository
git clone <repository-url>
cd Aplikasi_Web_Portal_Portofolio_Dosen-app

# Jalankan semua services dengan Docker Compose
docker-compose up -d

# Tunggu hingga semua services ready (~30 detik)

# Akses aplikasi
Frontend: http://localhost:3000
API Gateway: http://localhost:8080
MinIO Console: http://localhost:9001
RabbitMQ Management: http://localhost:15672
```

### Development Mode:

```bash
# Install dependencies untuk semua services
npm run install-all

# Jalankan infrastructure (DB, RabbitMQ, MinIO, Redis)
docker-compose up -d postgres rabbitmq minio redis meilisearch

# Jalankan services secara individual
cd services/auth-service && npm run dev
cd services/user-service && npm run dev
cd services/profile-service && npm run dev
cd services/portfolio-service && npm run dev
cd services/media-service && npm run dev
cd services/search-service && npm run dev
cd services/worker-service && npm run dev

# Jalankan frontend
cd frontend && npm run dev
```

## 📁 Struktur Proyek

```
.
├── services/
│   ├── auth-service/          # JWT Authentication
│   ├── user-service/          # User management
│   ├── profile-service/       # Profile management
│   ├── portfolio-service/     # Portfolio CRUD
│   ├── media-service/         # Media upload & storage
│   ├── search-service/        # Search & indexing
│   └── worker-service/        # Async thumbnail worker
├── frontend/                  # React frontend
├── api-gateway/              # Nginx configuration
├── docker-compose.yml        # Docker orchestration
├── docs/                     # Dokumentasi & laporan
└── README.md
```

## 🔌 API Endpoints

### Auth Service (Port 3001)
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/verify` - Verify token

### User Service (Port 3002)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/username/:username` - Get by username

### Profile Service (Port 3003)
- `GET /api/profiles/:userId` - Get profile
- `PUT /api/profiles/:userId` - Update profile
- `GET /api/profiles/public/:username` - Public profile

### Portfolio Service (Port 3004)
- `GET /api/portfolios` - List portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios/:id` - Get portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio
- `GET /api/portfolios/user/:userId` - Get by user

### Media Service (Port 3005)
- `POST /api/media/upload` - Upload file
- `GET /api/media/:id` - Get media info
- `DELETE /api/media/:id` - Delete media

### Search Service (Port 3006)
- `GET /api/search/portfolios` - Search portfolios
- `POST /api/search/index` - Index portfolio

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# Load testing dengan Apache Benchmark
ab -n 1000 -c 10 http://localhost:8080/api/portfolios

# Load testing dengan Artillery
npm run test:load
```

## 📊 Monitoring & Logging

- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **Logs**: `docker-compose logs -f [service-name]`

## 🔒 Security

- JWT token dengan expiry
- Password hashing dengan bcrypt
- CORS configuration
- Rate limiting pada API Gateway
- Input validation & sanitization

## 📈 Scalability

- Horizontal scaling untuk semua services
- Load balancing via Nginx
- Asynchronous processing dengan RabbitMQ
- Caching dengan Redis
- Database connection pooling

## 👥 Tim Pengembang

[Isi dengan nama anggota kelompok]

## 📄 Lisensi

MIT License

## 📞 Kontak

[Isi dengan informasi kontak]
