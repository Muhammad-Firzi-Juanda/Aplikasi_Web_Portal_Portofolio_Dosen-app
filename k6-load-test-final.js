/**
 * ============================================================================
 * PENGUJIAN BEBAN (LOAD TEST) MENGGUNAKAN K6
 * ============================================================================
 * 
 * Deskripsi:
 * - Mengujian performa API dengan 50-200 user simultan
 * - Durasi: ~2 menit dengan ramp-up bertahap
 * - Mengukur: Response time, error rate, throughput
 * 
 * Cara menjalankan:
 * k6 run k6-load-test-final.js
 * 
 * ============================================================================
 */

// Impor library k6 yang diperlukan
import http from 'k6/http';                    // Untuk membuat HTTP request
import { check, group, sleep } from 'k6';     // Utility untuk testing
import { Rate, Trend, Counter } from 'k6/metrics'; // Custom metrics

// ============================================================================
// KONFIGURASI - URL LAYANAN
// ============================================================================
// URL service yang akan ditest (bisa di-override via environment variable)
const PORTFOLIO_SERVICE = __ENV.PORTFOLIO_SERVICE || 'http://localhost:3004';
const SEARCH_SERVICE = __ENV.SEARCH_SERVICE || 'http://localhost:3006';
const USER_SERVICE = __ENV.USER_SERVICE || 'http://localhost:3002';

// ============================================================================
// METRIK CUSTOM - Untuk mengukur performa
// ============================================================================
// Rate: Mengukur persentase error
const errorRate = new Rate('tingkat_error');

// Trend: Mengukur statistik response time (min, max, avg, p95, p99)
const latency = new Trend('latensi_ms');

// Counter: Menghitung total request
const requestCounter = new Counter('total_request');

// Counter: Menghitung request yang berhasil
const successCounter = new Counter('request_berhasil');

// ============================================================================
// KONFIGURASI PENGUJIAN - Tahapan beban user
// ============================================================================
export const options = {
  // Tahapan (stages) untuk simulasi user yang bertahap
  stages: [
    { duration: '10s', target: 50 },    // 10 detik: naik ke 50 user
    { duration: '20s', target: 100 },   // 20 detik: naik ke 100 user
    { duration: '20s', target: 150 },   // 20 detik: naik ke 150 user
    { duration: '20s', target: 200 },   // 20 detik: naik ke 200 user
    { duration: '30s', target: 200 },   // 30 detik: tetap 200 user (sustained load)
    { duration: '10s', target: 0 },     // 10 detik: turun ke 0 user (ramp down)
  ],
  
  // Threshold (kriteria keberhasilan)
  thresholds: {
    // Response time: 95% request harus < 2000ms, 99% request harus < 3000ms
    'http_req_duration': ['p(95)<2000', 'p(99)<3000'],
    
    // Error rate: Maksimal 10% request boleh gagal
    'http_req_failed': ['rate<0.1'],
  },
};

// ============================================================================
// FUNGSI HELPER - Untuk validasi response
// ============================================================================

/**
 * Fungsi untuk mengecek response yang harus berhasil (status 200)
 * 
 * @param {Object} response - Response dari HTTP request
 * @param {string} name - Nama test untuk ditampilkan di report
 * @returns {boolean} - True jika berhasil, false jika gagal
 */
function checkSuccess(response, name) {
  // Validasi response
  const success = check(response, {
    // Cek apakah status code adalah 200 (OK)
    [`${name} - Status 200`]: (r) => r.status === 200,
    
    // Cek apakah response time < 2000ms (2 detik)
    [`${name} - Response time < 2s`]: (r) => r.timings.duration < 2000,
  });

  // Catat response time ke metrik latensi
  latency.add(response.timings.duration);
  
  // Increment counter total request
  requestCounter.add(1);
  
  // Jika berhasil, increment success counter; jika gagal, increment error rate
  if (success) {
    successCounter.add(1);
  } else {
    errorRate.add(1);
  }
  
  return success;
}

// ============================================================================
// SKENARIO PENGUJIAN BEBAN - ENDPOINT YANG SUDAH TERBUKTI BERHASIL
// ============================================================================

/**
 * Fungsi default yang dijalankan oleh k6
 * Setiap VU (Virtual User) akan menjalankan fungsi ini secara berulang
 * sampai test selesai
 */
export default function () {
  
  // ========== LAYANAN PORTFOLIO (PORT 3004) ==========
  
  /**
   * TEST 1: Ambil semua portfolio
   * Endpoint: GET /api/portfolios?page=1&limit=10
   * Deskripsi: Mengambil daftar portfolio dengan pagination
   * Expected: Status 200 dengan data portfolio
   */
  group('Portfolio - Ambil Semua', () => {
    // Buat request GET ke endpoint portfolio dengan pagination
    const res = http.get(`${PORTFOLIO_SERVICE}/api/portfolios?page=1&limit=10`);
    
    // Validasi response
    checkSuccess(res, 'Ambil Semua Portfolio');
  });
  sleep(0.1); // Tunggu 0.1 detik sebelum request berikutnya
  
  /**
   * TEST 2: Cari portfolio dengan filter pencarian
   * Endpoint: GET /api/portfolios?search=...
   * Deskripsi: Mencari portfolio berdasarkan keyword
   * Expected: Status 200 dengan hasil pencarian atau kosong
   */
  group('Portfolio - Filter Pencarian', () => {
    // Array keyword pencarian
    const searchTerms = ['react', 'nodejs', 'python', 'java', 'web'];
    
    // Pilih keyword secara random
    const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    // Buat request dengan parameter search
    const res = http.get(`${PORTFOLIO_SERVICE}/api/portfolios?search=${term}&limit=10`);
    
    // Validasi response
    checkSuccess(res, 'Filter Pencarian Portfolio');
  });
  sleep(0.1);
  
  /**
   * TEST 3: Filter portfolio berdasarkan kategori
   * Endpoint: GET /api/portfolios?category=...
   * Deskripsi: Mengambil portfolio dengan kategori tertentu
   * Expected: Status 200 dengan portfolio sesuai kategori
   */
  group('Portfolio - Filter Kategori', () => {
    // Array kategori yang tersedia
    const categories = ['web-development', 'mobile-development', 'data-science', 'devops'];
    
    // Pilih kategori secara random
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Buat request dengan parameter category
    const res = http.get(`${PORTFOLIO_SERVICE}/api/portfolios?category=${category}&limit=10`);
    
    // Validasi response
    checkSuccess(res, 'Filter Kategori Portfolio');
  });
  sleep(0.1);
  
  /**
   * TEST 4: Ambil portfolio publik saja
   * Endpoint: GET /api/portfolios?isPublic=true
   * Deskripsi: Mengambil portfolio yang bersifat publik
   * Expected: Status 200 dengan portfolio publik
   */
  group('Portfolio - Hanya Publik', () => {
    // Request dengan filter isPublic=true
    const res = http.get(`${PORTFOLIO_SERVICE}/api/portfolios?isPublic=true&limit=10`);
    
    // Validasi response
    checkSuccess(res, 'Ambil Portfolio Publik');
  });
  sleep(0.1);

  // ========== LAYANAN PENCARIAN (PORT 3006) ==========

  /**
   * TEST 5: Cari portfolio menggunakan search service
   * Endpoint: GET /api/search/portfolios?q=...
   * Deskripsi: Pencarian portfolio dengan Meilisearch
   * Expected: Status 200 dengan hasil pencarian
   */
  group('Pencarian - Portfolio', () => {
    // Array query pencarian
    const queries = ['react', 'nodejs', 'python', 'java', 'golang', 'web', 'mobile', 'backend', 'frontend', 'database'];
    
    // Pilih query secara random
    const query = queries[Math.floor(Math.random() * queries.length)];
    
    // Buat request ke search service
    const res = http.get(`${SEARCH_SERVICE}/api/search/portfolios?q=${query}&limit=10`);
    
    // Validasi response
    checkSuccess(res, 'Cari Portfolio');
  });
  sleep(0.1);

  /**
   * TEST 6: Dapatkan saran pencarian
   * Endpoint: GET /api/search/suggestions
   * Deskripsi: Mendapatkan saran keyword untuk pencarian
   * Expected: Status 200 dengan daftar saran
   */
  group('Pencarian - Saran', () => {
    // Request untuk mendapatkan saran
    const res = http.get(`${SEARCH_SERVICE}/api/search/suggestions`);
    
    // Validasi response
    checkSuccess(res, 'Dapatkan Saran');
  });
  sleep(0.1);

  // ========== LAYANAN USER (PORT 3002) ==========

  /**
   * TEST 7: Ambil semua user
   * Endpoint: GET /api/users
   * Deskripsi: Mengambil daftar semua user
   * Expected: Status 200 dengan daftar user
   */
  group('User - Ambil Semua', () => {
    // Request untuk mendapatkan semua user
    const res = http.get(`${USER_SERVICE}/api/users`);
    
    // Validasi response
    checkSuccess(res, 'Ambil Semua User');
  });
  sleep(0.1);

  /**
   * TEST 8: Cari user berdasarkan username
   * Endpoint: GET /api/users/username/:username
   * Deskripsi: Mencari user dengan username tertentu
   * Expected: Status 200 jika ditemukan, 404 jika tidak ditemukan
   */
  group('User - Cari Berdasarkan Username', () => {
    // Array username untuk testing
    const usernames = ['john', 'jane', 'bob', 'alice', 'charlie', 'david', 'emma', 'frank', 'grace', 'henry'];
    
    // Pilih username secara random
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    
    // Request untuk mencari user
    const res = http.get(`${USER_SERVICE}/api/users/username/${username}`);
    
    // Validasi response (bisa 200 jika ditemukan atau 404 jika tidak)
    check(res, {
      'Cari User - Status 200 atau 404': (r) => r.status === 200 || r.status === 404,
      'Cari User - Response time < 2s': (r) => r.timings.duration < 2000,
    });

    // Catat metrik
    latency.add(res.timings.duration);
    requestCounter.add(1);
    
    // Update counter success atau error
    if (res.status === 200 || res.status === 404) {
      successCounter.add(1);
    } else {
      errorRate.add(1);
    }
  });
  sleep(0.1);

  // ========== HEALTH CHECK - MEMASTIKAN SEMUA SERVICE BERJALAN ==========

  /**
   * TEST 9: Health check layanan Portfolio
   * Endpoint: GET /health
   * Deskripsi: Memastikan service portfolio sedang berjalan
   * Expected: Status 200
   */
  group('Health Check - Layanan Portfolio', () => {
    // Request ke endpoint health
    const res = http.get(`${PORTFOLIO_SERVICE}/health`);
    
    // Validasi response
    checkSuccess(res, 'Health Check Portfolio');
  });
  sleep(0.1);

  /**
   * TEST 10: Health check layanan Search
   * Endpoint: GET /health
   * Deskripsi: Memastikan service search sedang berjalan
   * Expected: Status 200
   */
  group('Health Check - Layanan Pencarian', () => {
    // Request ke endpoint health
    const res = http.get(`${SEARCH_SERVICE}/health`);
    
    // Validasi response
    checkSuccess(res, 'Health Check Pencarian');
  });
  sleep(0.1);

  /**
   * TEST 11: Health check layanan User
   * Endpoint: GET /health
   * Deskripsi: Memastikan service user sedang berjalan
   * Expected: Status 200
   */
  group('Health Check - Layanan User', () => {
    // Request ke endpoint health
    const res = http.get(`${USER_SERVICE}/health`);
    
    // Validasi response
    checkSuccess(res, 'Health Check User');
  });
  sleep(0.1);
}
