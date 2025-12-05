Berikut adalah Product Requirements Document (PRD) lengkap untuk membuat kloning fitur Invoices dari Flozy, disesuaikan untuk pengembangan aplikasi Anda.Dokumen ini mencakup spesifikasi teknis, alur pengguna (user flow), dan struktur data yang diperlukan.Product Requirements Document (PRD): Modul Invoicing & RetainerMetadataDetailProject NameInvoicing Module Clone (Flozy Style)Version1.0StatusDraft / Ready for ReviewObjectiveMembangun sistem pembuatan faktur (sekali bayar & berulang) yang terintegrasi dengan manajemen klien dan payment gateway.1. Pendahuluan & TujuanMembangun modul tagihan yang memungkinkan pengguna (Admin/Freelancer) untuk membuat, mengirim, dan melacak faktur kepada klien. Fitur utama meliputi dukungan untuk Single Invoice, Retainer (Langganan), manajemen database klien, dan integrasi pembayaran (Stripe).2. Fitur Utama (High Level Scope)Dashboard/Summary: Ringkasan status faktur (Paid, Pending, Draft, Overdue).Invoice Creation: Form pembuatan faktur dinamis (Single & Retainer).Client Management: CRM sederhana untuk menyimpan data klien.Settings: Pengaturan default untuk mata uang, pajak, dan catatan.Payment Integration: Koneksi ke Stripe (atau gateway lain).3. Spesifikasi Fungsional (Functional Requirements)3.1 Halaman Dashboard (Summary)List View: Menampilkan daftar semua invoice dan subscription.Kolom Data: Nama Klien, Tanggal, Nominal, Status (Active, Paid, Draft), Tipe (One-off/Retainer).Actions: Tombol pintas untuk View, Edit, Delete, dan Send Reminder.Filtering: Filter berdasarkan Status dan Klien.3.2 Halaman Pembuatan Invoice (Create Invoice)Ini adalah fitur inti. UI harus dibagi menjadi form input dan kalkulasi otomatis.A. Header & Konfigurasi DasarInvoice Type Selector: Toggle antara Single Invoice vs Retainer.Currency Selector: Dropdown pilihan mata uang (USD, IDR, dll).Payment Requirement: Toggle "Require Payment" (Jika dimatikan, invoice hanya sebagai catatan/gratis).B. Informasi KlienClient Selector: Dropdown pencarian klien yang sudah ada (Autocomplete).Add New Client: Tombol/Modal untuk menambah klien baru langsung di halaman ini (Input: Nama, Email, Alamat).Autopay Toggle: Opsi untuk menagih kartu klien secara otomatis (hanya jika klien sudah ada payment_method_id tersimpan di Stripe).C. Detail Penagihan (Billing Details)Invoice Name/Title: Judul faktur (misal: "Jasa Web Development").Scheduling (Khusus Retainer):Start Date: Tanggal mulai penagihan.Frequency: Harian, Mingguan, Bulanan, Tahunan.Invoice Note/Description: Text area untuk catatan tambahan.D. Item Baris (Line Items)Tabel dinamis di mana pengguna bisa menambah baris (Add Row).Kolom: Deskripsi Item, Quantity (Qty), Harga Satuan (Price).Kalkulasi: Total Row = Qty * Price.E. Kalkulasi Keuangan (Financials)Subtotal: Jumlah total dari semua baris item.Discount: Input field (Nominal tetap atau Persentase). Mengurangi subtotal.Tax (Pajak): Input field (Persentase). Menambah ke total setelah diskon.Grand Total: Hasil akhir yang harus dibayar.F. Action ButtonsSave as Draft: Menyimpan di database tanpa mengirim ke klien/Stripe.Create & Send: Membuat objek Invoice/Subscription di Stripe dan mengirim email ke klien.3.3 Manajemen Klien (Client Page)Client List: Daftar nama, email, dan total pendapatan (Lifetime Value) dari klien tersebut.Client Detail: Melihat riwayat invoice per klien.Multi-currency Support: Menampilkan total pendapatan yang dipisahkan berdasarkan mata uang (seperti di video: Total USD, Total IDR).3.4 Pengaturan (Settings)Mengatur nilai default agar tidak perlu input ulang setiap membuat invoice:Default Currency.Default Tax Rate (%).Next Invoice Number (Format penomoran).Default Payment Terms / Notes.4. Struktur Database (Schema Recommendation)Berikut adalah rancangan skema database relasional (SQL) untuk mendukung fitur ini.SQL-- Tabel Users (Admin/Freelancer)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    stripe_account_id VARCHAR(255), -- Untuk Stripe Connect
    business_name VARCHAR(255)
);

-- Tabel Clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id), -- Milik siapa klien ini
    name VARCHAR(255),
    email VARCHAR(255),
    stripe_customer_id VARCHAR(255), -- ID Customer di Stripe
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Invoices
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    client_id INT REFERENCES clients(id),
    type ENUM('SINGLE', 'RETAINER'),
    status ENUM('DRAFT', 'SENT', 'PAID', 'VOID', 'OVERDUE'),
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- Financials
    subtotal DECIMAL(15, 2),
    discount_amount DECIMAL(15, 2),
    tax_percent DECIMAL(5, 2),
    total_amount DECIMAL(15, 2),
    
    -- Scheduling (Khusus Retainer)
    is_recurring BOOLEAN DEFAULT FALSE,
    billing_cycle ENUM('WEEKLY', 'MONTHLY', 'YEARLY'),
    next_payment_date DATE,
    
    -- Stripe Info
    stripe_invoice_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Invoice Items (Baris detail produk/jasa)
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT,
    quantity INT,
    unit_price DECIMAL(15, 2),
    amount DECIMAL(15, 2) -- (quantity * unit_price)
);

-- Tabel Settings (Preferensi User)
CREATE TABLE user_settings (
    user_id INT PRIMARY KEY REFERENCES users(id),
    default_currency VARCHAR(10),
    default_tax_percent DECIMAL(5, 2),
    default_note TEXT
);
5. Alur Pengguna (User Flow) - Happy PathStart: User klik menu "Invoices" -> Klik tombol "New Invoice".Input:User memilih Klien (atau buat baru).User memilih Tipe: "Retainer" (Langganan).User mengisi item jasa: "Social Media Management", Qty: 1, Price: $1000.User set diskon 0% dan pajak 0%.Review: Sistem menghitung Total: $1000.Action: User klik "Create Subscription".Backend Process:Aplikasi memanggil API Stripe untuk membuat Product & Price.Aplikasi membuat Subscription di Stripe untuk Customer tersebut.Simpan data ke database lokal (invoices table).End: User diarahkan kembali ke Dashboard dengan status invoice "Active/Sent".6. Integrasi Pihak Ketiga (Tech Stack)Payment Gateway: Stripe (Wajib, sesuai referensi).Menggunakan Stripe Invoicing API untuk One-off.Menggunakan Stripe Billing/Subscription API untuk Retainer.Frontend: React/Vue/Next.js (Disarankan untuk reaktivitas form yang tinggi).Backend: Node.js/Python/Go (Untuk menangani logika scheduling dan webhook dari Stripe).7. Fase Pengembangan (Roadmap)Fase 1 (MVP):CRUD Klien.Buat Single Invoice & Retainer sederhana.Integrasi Stripe dasar (Kirim link pembayaran).Fase 2:Dashboard analitik (Grafik pendapatan).Fitur Autopay (Charging kartu tersimpan).Export PDF Invoice.Fase 3 (Future Scope - Sesuai Video):Metode pembayaran alternatif (Bank Transfer, Crypto).