# PRD — Platform Pembelian Produk Digital Multi-Vendor

## 1. Ringkasan Produk

Platform ini adalah aplikasi pembelian produk digital seperti pulsa, paket data, dan produk digital lain yang dibeli menggunakan saldo internal. Sistem mendukung integrasi beberapa vendor pihak ketiga melalui REST API, dengan vendor utama/default **KMSP**. Bila vendor API tersedia, transaksi diproses otomatis. Bila tidak tersedia, transaksi bisa diproses manual oleh admin internal.

Platform terdiri dari dua aplikasi frontend terpisah:

1. **Customer App** — untuk pelanggan membeli produk, top up saldo, dan melihat riwayat transaksi.
2. **Admin App** — untuk pengelolaan produk, vendor, harga, user, transaksi, dan proses manual.

Backend menggunakan **Laravel**, dengan autentikasi **Laravel Sanctum**. Frontend menggunakan **Next.js** dengan **static export**.

---

## 2. Tujuan Produk

Tujuan utama sistem ini adalah menyediakan platform yang:

* memungkinkan customer membeli produk digital secara cepat dan terkontrol;
* mengelola saldo user seperti e-wallet internal;
* mendukung vendor lebih dari satu;
* dapat memproses transaksi otomatis maupun manual;
* menjaga konsistensi saldo melalui mekanisme refund instan;
* memisahkan konsep **provider** dan **vendor** secara tegas.

---

## 3. Definisi Konsep Penting

### Provider

Provider adalah operator seluler yang dimiliki pelanggan, misalnya:

* Telkomsel
* XL
* Indosat
* Tri
* Smartfren

Provider dipakai untuk:

* deteksi nomor HP;
* filtering produk yang sesuai;
* pengelompokan katalog produk.

### Vendor

Vendor adalah pihak ketiga penyedia produk digital, misalnya:

* KMSP
* Kaje Store
* vendor lain yang menyediakan REST API atau proses manual.

Vendor dipakai untuk:

* eksekusi pembelian;
* pengecekan status transaksi;
* fallback routing jika vendor utama bermasalah.

### Product

Product adalah item yang dijual ke customer, misalnya:

* Pulsa Telkomsel 10.000
* Paket Data XL 5GB
* dan seterusnya.

Satu product dapat dipetakan ke satu atau lebih vendor product.

---

## 4. Target Pengguna

### 4.1 Customer / External User

Fungsi utama:

* register/login;
* top up saldo;
* input nomor HP;
* melihat produk sesuai provider;
* membeli produk;
* memantau status transaksi;
* melihat riwayat transaksi dan saldo.

### 4.2 Internal User / Admin

Fungsi utama:

* mengelola produk;
* mengelola harga;
* mengelola vendor;
* mengelola mapping vendor-product;
* memproses order manual;
* mengelola user dan role;
* memantau wallet, top up, refund, dan order;
* melihat laporan transaksi.

---

## 5. Ruang Lingkup Produk

### 5.1 In Scope

* Auth customer dan admin menggunakan Laravel Sanctum.
* Wallet internal berbasis ledger.
* Top up saldo via payment gateway Mayar.
* Order pembelian produk digital.
* Deteksi provider dari nomor HP.
* Filter produk berdasarkan provider.
* Multi-vendor support.
* Vendor default: KMSP.
* Harga produk dengan pricing dinamis.
* Konfigurasi default pricing dengan flat margin.
* Refund instan jika transaksi gagal.
* Admin dashboard untuk pengelolaan operasional.
* Customer app untuk transaksi dan monitoring.

### 5.2 Out of Scope untuk versi awal

* Aplikasi mobile native.
* Multi-currency.
* Sistem reseller bertingkat.
* Kecerdasan buatan untuk routing vendor.
* Program loyalty dan poin.
* Auto-reconciliation keuangan tingkat lanjut.

---

## 6. Tech Stack

### 6.1 Backend

* Laravel
* Laravel Sanctum untuk autentikasi API
* PostgreSQL sebagai database utama
* Redis untuk cache, queue, dan job asynchronous
* Laravel Queue untuk proses background
* Laravel Scheduler untuk task terjadwal

### 6.2 Frontend

* Next.js
* Static export untuk deployment ringan
* Dua aplikasi frontend terpisah:

  * Customer App
  * Admin App

### 6.3 Payment Gateway

* Mayar untuk proses top up saldo

### 6.4 Vendor Integrations

* KMSP sebagai vendor default
* Vendor lain dapat ditambahkan kemudian

---

## 7. Prinsip Desain Sistem

### 7.1 Ledger-Based Wallet

Saldo tidak disimpan hanya sebagai angka statis. Sistem memakai ledger agar setiap top up, debit, refund, dan adjustment tercatat jelas.

### 7.2 Order State Machine

Setiap transaksi order memiliki status yang terdefinisi dan berubah secara terkontrol.

### 7.3 Vendor Abstraction

Vendor tidak di-hardcode. Semua vendor mengikuti kontrak interface yang sama.

### 7.4 Idempotency

Semua proses penting harus aman dari request ganda.

### 7.5 Refund Instan

Jika transaksi gagal, refund dilakukan langsung, tanpa menunggu antrian panjang.

---

## 8. User Journey

### 8.1 Customer Journey

1. Customer register/login.
2. Customer top up saldo.
3. Customer membuka halaman pembelian.
4. Customer memasukkan nomor HP.
5. Sistem mendeteksi provider.
6. Sistem menampilkan produk yang sesuai provider.
7. Customer memilih produk dan menekan beli.
8. Sistem memotong saldo.
9. Sistem memproses order ke vendor atau manual.
10. Customer melihat status transaksi.
11. Jika gagal, saldo otomatis kembali.

### 8.2 Admin Journey

1. Admin login.
2. Admin melihat dashboard.
3. Admin mengelola produk, vendor, dan harga.
4. Admin memonitor order masuk.
5. Jika transaksi manual, admin memproses success atau failed.
6. Admin memeriksa top up, refund, dan log aktivitas.

---

## 9. Functional Requirements

## 9.1 Authentication & Authorization

### Customer

* Register.
* Login.
* Logout.
* Reset password.
* Akses hanya ke data milik sendiri.

### Admin

* Login.
* Role-based authorization.
* Permission-based access control.

### Roles minimal

* Super Admin
* Admin Operasional
* Staff
* Customer

---

## 9.2 Wallet / Saldo

Sistem saldo internal wajib mendukung:

* top up saldo;
* debit saat purchase;
* refund saat gagal;
* adjustment manual oleh admin;
* riwayat transaksi lengkap;
* saldo tidak boleh minus.

### Aturan penting

* transaksi wallet harus atomic;
* debit harus memakai locking;
* setiap perubahan saldo harus masuk ledger.

---

## 9.3 Top Up via Mayar

### Alur

1. Customer memilih nominal top up.
2. Sistem membuat invoice.
3. Customer diarahkan ke flow pembayaran Mayar.
4. Mayar mengirim callback/webhook ke backend.
5. Backend memverifikasi callback.
6. Jika valid, saldo customer bertambah.
7. Transaksi top up ditandai sukses.

### Ketentuan

* callback harus diverifikasi;
* callback ganda harus diabaikan lewat idempotency;
* nominal harus sesuai;
* top up yang sukses harus segera masuk saldo.

---

## 9.4 Provider Detection

Saat customer memasukkan nomor HP:

* sistem memvalidasi format nomor;
* sistem mendeteksi provider berdasarkan prefix;
* sistem menampilkan produk yang relevan untuk provider tersebut.

### Contoh

* 0812 → Telkomsel
* 0857 → Indosat
* 0817/0818 → XL

Daftar prefix harus configurable.

---

## 9.5 Product Catalog

Produk harus dapat:

* ditampilkan per provider;
* difilter berdasarkan kategori;
* diaktifkan/nonaktifkan;
* diberi harga jual;
* dipetakan ke vendor tertentu;
* memiliki status ketersediaan.

### Kategori contoh

* Pulsa
* Paket Data
* Token PLN
* Voucher
* Produk digital lain yang nanti ditambahkan

---

## 9.6 Pricing Engine

Pricing memakai dua level konfigurasi:

### Default

* default pricing = flat margin

### Custom per product

* bisa override dengan pricing dinamis per product

### Aturan harga

* harga vendor menjadi basis cost;
* sistem menambahkan margin sesuai konfigurasi;
* jika product memiliki pricing khusus, maka pricing product itu yang dipakai;
* jika tidak ada, gunakan default flat margin.

---

## 9.7 Order System

Order adalah inti transaksi.

### Alur order

1. Customer memilih product.
2. Customer memasukkan nomor tujuan.
3. Sistem memvalidasi input.
4. Sistem cek saldo.
5. Sistem membuat order.
6. Saldo didebit.
7. Order dikirim ke vendor default atau vendor yang dipilih sistem.
8. Jika vendor API tersedia, proses otomatis.
9. Jika vendor tidak tersedia, order masuk mode manual.
10. Status order diperbarui sampai final.

### Status order

* created
* debited
* processing
* pending_vendor
* manual_processing
* success
* failed
* refunded

---

## 9.8 Vendor System

Vendor adalah pihak eksekusi transaksi, bukan provider.

### Vendor requirements

* dapat lebih dari satu;
* vendor default adalah KMSP;
* mendukung API-based processing;
* mendukung manual fallback;
* mendukung status check;
* mendukung routing prioritas.

### Vendor behavior

* bila vendor default aktif, gunakan KMSP;
* bila KMSP gagal dan ada vendor lain yang mendukung product tersebut, sistem dapat fallback;
* bila semua vendor gagal, order masuk manual.

---

## 9.9 Manual Processing

Jika order tidak dapat diproses otomatis:

* order masuk ke antrian manual;
* admin melihat order tersebut;
* admin memilih success atau failed;
* jika failed, saldo customer direfund instan;
* jika success, order ditutup sukses.

---

## 9.10 Refund

Refund harus instan.

### Kondisi refund

* vendor gagal;
* vendor timeout;
* order manual dinyatakan gagal;
* sistem mendeteksi kegagalan transaksi.

### Aturan refund

* refund harus langsung mengembalikan saldo;
* refund harus tercatat di ledger;
* refund harus terhubung ke order asal;
* refund ganda tidak boleh terjadi.

---

## 9.11 Admin Dashboard

Admin dashboard harus dapat:

* melihat ringkasan transaksi;
* melihat saldo user;
* mengelola produk;
* mengelola vendor;
* mengelola pricing;
* memproses order manual;
* memantau top up via Mayar;
* memeriksa refund;
* melihat log aktivitas;
* mengelola role dan permission.

---

## 9.12 Customer App

Customer app harus dapat:

* login/register;
* melihat saldo;
* top up saldo;
* input nomor HP;
* melihat produk sesuai provider;
* membeli produk;
* melihat status order;
* melihat riwayat top up dan transaksi.

---

## 10. Non-Functional Requirements

### 10.1 Performance

* API internal harus responsif.
* Daftar produk dan deteksi provider harus cepat.
* Proses vendor boleh asynchronous jika perlu, tapi status harus ter-update tepat waktu.

### 10.2 Reliability

* transaksi tidak boleh double debit;
* callback payment harus idempotent;
* order vendor harus punya reference unik;
* jika vendor gagal, sistem harus bisa recover.

### 10.3 Security

* Sanctum untuk autentikasi API;
* role-based access;
* validation ketat di backend;
* rate limiting;
* audit log untuk aksi admin;
* callback payment harus diverifikasi signature-nya.

### 10.4 Auditability

Semua hal penting harus tercatat:

* top up;
* debit saldo;
* refund;
* order status change;
* admin action;
* vendor response.

---

## 11. Arsitektur Sistem

```text
Customer App (Next.js static)
        |
        v
Laravel API + Sanctum
        |
        +--> Wallet Service
        +--> Order Service
        +--> Product Service
        +--> Vendor Service
        +--> Payment Service (Mayar)
        +--> Audit Service
        |
        +--> PostgreSQL
        +--> Redis / Queue
        |
        +--> Vendor APIs (KMSP, Kaje Store, dll)
        +--> Manual Processing by Admin
```

---

## 12. Domain Model Utama

### 12.1 User

* customer
* admin
* staff

### 12.2 Provider

* nama provider
* code provider
* daftar prefix nomor

### 12.3 Vendor

* nama vendor
* tipe: API / manual
* default / non-default
* prioritas
* status aktif

### 12.4 Product

* nama produk
* kategori
* provider terkait
* active/inactive

### 12.5 Vendor Product Mapping

* product_id
* vendor_id
* vendor_sku
* cost_price
* status mapping

### 12.6 Wallet

* wallet account
* wallet transactions
* wallet ledger entries

### 12.7 Order

* order data
* status log
* reference vendor
* reference payment
* refund relation

---

## 13. Database Requirements

### Tabel inti yang wajib ada

* users
* roles
* permissions
* wallet_accounts
* wallet_transactions
* wallet_ledger_entries
* providers
* products
* pricing_rules
* vendors
* vendor_products
* orders
* order_status_logs
* payment_topups
* refund_transactions
* audit_logs
* notifications

---

## 14. Order & Wallet Rules

### 14.1 Debit Flow

Saat order dibuat:

* saldo harus dicek;
* saldo didebit secara atomic;
* order dan wallet transaction harus dibuat dalam DB transaction.

### 14.2 Refund Flow

Jika order gagal:

* order status jadi failed;
* refund dibuat;
* saldo customer bertambah kembali;
* status order menjadi refunded.

### 14.3 Idempotency

Request yang sama tidak boleh menyebabkan:

* double top up;
* double debit;
* double refund;
* double order submission.

---

## 15. Vendor Routing Rules

### Default rule

* vendor default adalah KMSP.

### Routing logic

1. sistem cari product mapping untuk provider tersebut;
2. sistem cek mapping vendor-product aktif;
3. sistem pilih vendor default jika tersedia;
4. jika vendor default tidak available, sistem pilih fallback sesuai prioritas;
5. jika semua vendor tidak tersedia, order manual.

### Catatan

Vendor dan provider wajib dipisah di level domain dan database.

---

## 16. Payment Flow via Mayar

### Top up flow

1. Customer request top up.
2. Sistem membuat record topup.
3. Sistem membuat invoice/payment request ke Mayar.
4. Customer menyelesaikan pembayaran.
5. Mayar mengirim callback.
6. Backend validasi callback.
7. Jika valid, saldo customer bertambah.
8. Status topup = success.

### Validasi callback

* signature valid;
* amount sesuai;
* invoice/reference cocok;
* callback belum pernah diproses sebelumnya.

---

## 17. API Modules

### 17.1 Auth

* POST /api/login
* POST /api/register
* POST /api/logout
* GET /api/me

### 17.2 Wallet

* GET /api/wallet
* POST /api/topup
* GET /api/wallet/transactions

### 17.3 Products

* GET /api/products
* GET /api/products?provider=telkomsel

### 17.4 Orders

* POST /api/orders
* GET /api/orders
* GET /api/orders/{id}

### 17.5 Admin

* GET /api/admin/dashboard
* GET /api/admin/orders
* POST /api/admin/orders/{id}/success
* POST /api/admin/orders/{id}/failed
* CRUD products
* CRUD vendors
* CRUD pricing rules

### 17.6 Payment Callback

* POST /api/payment/mayar/callback

---

## 18. UI/UX Requirements

## 18.1 Customer App

Halaman minimal:

* login/register
* dashboard
* saldo
* top up
* beli produk
* detail order
* riwayat transaksi

### Fitur halaman beli

* input nomor HP
* auto detect provider
* show produk yang sesuai
* tombol beli

## 18.2 Admin App

Halaman minimal:

* login
* dashboard ringkasan
* user management
* product management
* vendor management
* pricing management
* orders management
* top up management
* refund management
* audit log

---

## 19. Error Handling

### Error umum yang harus ditangani

* nomor HP tidak valid;
* provider tidak dikenali;
* saldo tidak cukup;
* vendor timeout;
* vendor error;
* payment callback invalid;
* duplicate callback;
* duplicate order;
* manual order gagal.

### Respons sistem

* tampilkan pesan yang jelas;
* simpan error detail untuk admin;
* jangan bocorkan data sensitif ke customer.

---

## 20. Logging & Monitoring

Sistem harus memiliki:

* application log;
* order log;
* wallet log;
* payment callback log;
* vendor response log;
* admin action log.

Monitoring minimal:

* jumlah order sukses/gagal;
* saldo user;
* top up berhasil/gagal;
* vendor health status;
* manual queue count;
* refund count.

---

## 21. Acceptance Criteria

Produk dianggap memenuhi PRD ini jika:

* customer bisa login, top up, dan membeli produk;
* saldo terpotong saat order berhasil dibuat;
* jika order gagal, saldo kembali otomatis;
* payment top up via Mayar berjalan;
* provider dapat dideteksi dari nomor HP;
* produk tampil sesuai provider;
* vendor default KMSP bisa dipakai;
* vendor lebih dari satu bisa didukung;
* admin bisa memproses order manual;
* pricing bisa memakai default flat margin dan override per product;
* seluruh transaksi tercatat di ledger dan audit log;
* frontend customer dan admin terpisah;
* backend Laravel Sanctum bekerja untuk auth.

---

## 22. Release Plan

### Phase 1 — Core Foundation

* auth
* wallet ledger
* product catalog
* provider detection
* order flow dasar
* admin panel dasar
* manual processing

### Phase 2 — Payment & Automation

* integrasi Mayar
* top up otomatis
* vendor integration KMSP
* refund instan
* order status logging

### Phase 3 — Multi-Vendor

* vendor kedua dan seterusnya
* fallback routing
* vendor priority
* pricing override per product

### Phase 4 — Hardening

* audit lengkap
* monitoring
* retry dan recovery
* optimasi performa
* analytics dasar

---

## 23. Risks

### Risiko utama

* saldo tidak konsisten;
* double processing;
* vendor timeout;
* callback payment gagal;
* kesalahan admin saat manual process;
* mapping provider vs vendor yang salah.

### Mitigasi

* ledger system;
* DB transaction;
* locking;
* idempotency key;
* audit log;
* explicit domain separation antara provider dan vendor;
* manual action confirmation.

---

## 24. Assumptions

* Mayar adalah payment gateway untuk top up saldo.
* KMSP adalah vendor default.
* Vendor lain bisa menyusul.
* Refund harus instan.
* Frontend menggunakan static export.
* Backend akan menjadi source of truth untuk seluruh transaksi.

---

## 25. Final Summary

PRD ini mendefinisikan platform pembelian produk digital yang aman, scalable, dan siap multi-vendor. Pondasi utamanya adalah:

* **wallet ledger**
* **order state machine**
* **vendor abstraction**
* **provider detection**
* **instant refund**
* **role-based admin/customer apps**
* **Laravel + Sanctum + Next.js static export**