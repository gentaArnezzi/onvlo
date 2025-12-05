# PRD – Onvlo Agency OS (Flozy‑like All‑in‑One Agency Management)

---

## 1. Ringkasan Produk

**Nama produk sementara**: **Onvlo – Agency OS**
**Jenis produk**: SaaS multi‑tenant untuk agency owners, coaches, consultants, dan service businesses.
**Tujuan utama**: Menjadi **"all‑in‑one workspace"** untuk operasional agency: client onboarding, CRM, proposals & contracts, projects & tasks, komunikasi, dan invoicing/payments – dalam satu platform, mirip Flozy/AgenciFlow.

**Tagline konsep**:

> "One place to get clients onboarded, served, and billed."

---

## 2. Masalah yang Ingin Diselesaikan

1. **Tool berserakan**
   Agency kecil–menengah biasanya pakai kombinasi: Notion/Docs (SOP), Trello/Asana (tasks), WhatsApp/Email (chat), Google Drive (file), dan invoicing terpisah.
   Konsekuensi:

   * Data tercerai‑berai, sulit dilacak.
   * Onboarding tiap klien makan waktu (copy‑paste template, manual invite ke berbagai tool).
   * Owner sulit punya **single source of truth** tentang klien & proyek.

2. **Client experience buruk**
   Klien sering nanya hal yang sama:

   * "Progress kami sampai mana?"
   * "Invoice mana ya?"
   * "Link file terakhir yang mana?"
     Karena tidak ada **client portal** terpusat.

3. **Invoicing dan pembayaran manual**

   * Owner/finance kirim invoice pakai PDF, link payment terpisah.
   * Tidak ada recurring billing otomatis untuk retainer.

4. **Onboarding tidak terstandar**

   * Setiap klien baru → welcome email manual.
   * Form intake tercecer (Google Forms, Typeform, WA).
   * Kontrak dan proposal pakai doc terpisah.

Onvlo menjawab semua ini dengan: **Single platform** untuk onboarding → delivery → communication → billing.

---

## 3. Sasaran & Non‑Goals

### 3.1 Sasaran (Goals)

1. **MVP (3–4 bulan)**

   * Klien bisa **di‑onboard** dari satu link (onboarding funnel) dan otomatis dibuatkan:

     * Akun/record client.
     * Proyek awal.
     * Kontrak/Agreement tersimpan.
   * Agency bisa:

     * Melihat **pipeline client & projects** dalam satu dashboard.
     * Mengelola **tasks** per project.
     * Mengirim **invoice & link pembayaran**.
   * Klien punya **client portal** (minimal):

     * Lihat progress tasks & projects.
     * Lihat invoice & status pembayaran.
     * Upload/download file.

2. **Post‑MVP (v2+)**

   * Chat 1:1 & group (team–client) dalam portal.
   * Brain / Knowledge base (SOP & notes internal).
   * Automations (mis: saat invoice overdue → auto reminder email).
   * Website / Link‑in‑bio builder sederhana.

### 3.2 Non‑Goals (Fase Awal)

* Tidak membuat drag‑and‑drop landing page builder sekompleks Webflow.
* Tidak membuat automation engine selengkap Zapier/Make (cukup rules basic).
* Tidak mensimulasikan semua fitur CRM enterprise (fokus ke use case agency).

---

## 4. Target Pengguna & Persona

### 4.1 Persona Utama

1. **Agency Owner (Primary)**

   * Usia 23–40, menjalankan digital marketing agency, creative studio, social media agency, atau software agency.
   * Pain point:

     * Sibuk konteks switching antara tools.
     * Kesulitan tracking semua client & project.
     * Client experience terasa berantakan.

2. **Account Manager / Project Manager**

   * Fokus pada koordinasi deliverables.
   * Butuh tool yang mudah assign tasks, track progress, komunikasikan status ke klien.

3. **Client (Business Owner / Marketing Manager)**

   * Hanya ingin:

     * Lihat apa yang sedang dikerjakan.
     * Lihat timeline & hasil.
     * Lihat dan bayar invoice dengan mudah.

### 4.2 Use Case Utama (High‑Level)

1. Owner meng‑onboard klien baru menggunakan 1 link funnel.
2. Owner/AM mengelola pipeline leads → clients.
3. Owner/PM mengelola proyek dan tasks.
4. Klien login ke portal untuk melihat progress & invoice.
5. Finance/Owner mengirim invoice & menerima pembayaran.

---

## 5. Scope Fitur (MVP vs Post‑MVP)

### 5.1 Modul MVP

1. **Authentication & Multi‑Tenancy**

   * Menggunakan Clerk + organisasi (sudah disediakan boilerplate).
   * Setiap agency = 1 organization.
   * Role minimal:

     * `Owner`
     * `Admin`
     * `Member`
     * `Client` (akses portal terbatas)

2. **Client Onboarding Funnel**

   * Agency membuat **Onboarding Link** (misal: `app.onvlo.com/onboard/{agency_slug}/{funnel_id}`).
   * Flow onboarding:

     1. Halaman Welcome (branding agency + summary).
     2. Form intake (kebutuhan client, data bisnis, akses dsb).
     3. Pemilihan paket (jika paket ditentukan di config).
     4. Agreement/Terms (checkbox + tampilan kontrak simple).
     5. Redirect ke langkah pembayaran (opsional untuk retainer awal pertama).
   * Hasil onboarding:

     * Record **Client** baru.
     * Record **Project** awal (opsional; based on template).
     * Dokumen **Agreement** tersimpan (PDF/render dari template).

3. **Client & Lead Management (CRM Ringan)**

   * Entity: `Lead`, `Client`.
   * Fitur:

     * Pipeline kanban sederhana: `New`, `Qualified`, `Proposal Sent`, `Won`, `Lost`.
     * Kontak dan data client.
     * Catatan (notes) & aktivitas.
     * Konversi Lead → Client dengan 1 klik.

4. **Proposals & Contracts (Basic)**

   * Template proposal/contract dengan placeholder (nama klien, harga, scope, durasi).
   * Kirim ke client via link yang bisa di‑view & "accept" (checkbox + timestamp + IP log).
   * Status: Draft, Sent, Accepted, Rejected.

5. **Projects & Tasks**

   * Entity: `Project`, `Task`.
   * Fitur Project:

     * Hubungkan ke 1 Client.
     * Status: `Planned`, `Active`, `On Hold`, `Completed`, `Cancelled`.
     * Ringkasan scope, budget (opsional), timeline.
   * Fitur Task:

     * Title, description, assignee (user), due date, labels (tag), priority.
     * Status: `Backlog`, `In Progress`, `Review`, `Done`.
     * View: table + board (kanban) minimal.

6. **Client Portal (MVP)**

   * URL: `client.onvlo.com/{agency_slug}/{client_id}` atau subdomain.
   * Klien dapat:

     * Melihat list Projects & status.
     * Melihat list Tasks (yang visible ke client) & progress.
     * Melihat list Invoices & status bayar.
     * Download/upload file (folder per project).
   * Tidak ada internal notes/komentar internal (itu hanya untuk team).

7. **Invoices & Payments (MVP)**

   * Entity: `Invoice` + `InvoiceItem`.
   * Fitur:

     * Buat invoice manual.
     * Status: Draft, Sent, Paid, Overdue.
     * Integrasi **Stripe** dulu (core), PayPal/transfer manual bisa di later.
     * Generate **payment link**.
     * Pembayaran sukses → update status invoice otomatis.

8. **Dashboard & Analytics Ringan**

   * Di level organization (agency):

     * Total active clients.
     * Total active projects.
     * Revenue 30 hari terakhir (from Paid invoices).
     * Invoice overdue count.

9. **Settings Agency**

   * Branding: logo, brand color, nama agency.
   * Default currency.
   * Timezone.
   * Default invoice terms (Net 7/14/30).

### 5.2 Modul Post‑MVP

1. **Chat & Communication**

   * 1:1 chat team–client.
   * Group chat per project.
   * Voice message (opsional, bisa pakai file upload audio dulu).

2. **Brain / SOP & Docs**

   * Folder + notes.
   * Tagging per client/project.
   * Sharing level: internal vs client‑visible.

3. **Automations**

   * Rule engine sederhana: "IF event THEN action".

     * Event contoh:

       * Invoice overdue X hari.
       * Lead jadi status `Won`.
       * Task masuk status `Done`.
     * Action contoh:

       * Kirim email template ke client.
       * Auto create task follow‑up.

4. **Website / Link‑in‑Bio Builder Sederhana**

   * Template simple (hero, services, testimonials, CTA).
   * Form contact terhubung ke Leads.
   * Link‑in‑bio: satu halaman dengan beberapa link CTA, terhubung ke onboarding funnel.

5. **Integrations (Zapier / Webhooks)**

   * Webhooks per event.
   * Integrasi Zapier/Make (later).

---

## 6. Detail Fitur per Modul (MVP)

### 6.1 Authentication & Multi‑Tenancy

**Functional Requirements**

* User dapat sign up via email/password, social login (disediakan Clerk).
* User dapat membuat/bergabung ke Organization.
* Role per organization:

  * Owner: full access, billing, settings.
  * Admin: manage clients, projects, invoices, team.
  * Member: manage tasks & projects, view assigned clients.
  * Client: hanya akses client portal.

**Non‑Functional**

* Semua query & mutation ter‑scoped ke `organizationId`.
* Tidak boleh ada data bocor antar organization.

---

### 6.2 Client Onboarding Funnel

**User Story**

* Sebagai **Agency Owner**, saya ingin membuat 1 onboarding link yang bisa saya kirim ke client baru, sehingga seluruh proses intake, agreement, dan (opsional) payment terjadi otomatis.

**Main Flow**

1. Owner membuka menu **Onboarding Funnels** dan klik "Create Funnel".
2. Owner mengatur:

   * Nama funnel (mis. "FB Ads Retainer").
   * Paket & harga (opsional).
   * Template intake form (fields).
   * Agreement template.
3. Sistem generate URL funnel.
4. Client membuka link → jalanin step per step hingga finish.
5. Setelah finish, sistem:

   * Membuat Client.
   * Membuat Project (berdasarkan template, jika diaktifkan).
   * Menyimpan responses intake & agreement record.
   * Mengirim email konfirmasi ke client & owner.

**Key Requirements**

* Form builder sederhana (untuk MVP bisa statis + beberapa tipe field: text, textarea, select, checkbox).
* Per funnel bisa diaktifkan/disable.
* Log funnel submissions.

---

### 6.3 CRM – Leads & Clients

**User Stories**

* Sebagai Owner, saya ingin melihat semua **leads** dan statusnya agar saya tahu siapa yang harus di‑follow up.
* Sebagai Owner, saya ingin mengubah Lead menjadi Client tanpa input ulang data.

**Fitur**

* List view & Kanban view.
* Actions:

  * Create / edit / delete lead.
  * Pindah stage dengan drag‑and‑drop (kanban).
  * Convert Lead → Client (membuat record Client baru, mark Lead as Won).
* Fields Lead:

  * Name, email, phone, company.
  * Source, tags.
  * Stage.
  * Notes.

---

### 6.4 Proposals & Contracts (Basic)

**User Story**

* Sebagai Owner, saya ingin membuat proposal & contract dengan template sehingga saya tidak perlu merapikan dokumen manual setiap kali.

**Fitur**

* Template management:

  * Create/edit template dengan simple editor (Markdown/Rich text).
  * Placeholder ({{client_name}}, {{price}}, {{scope}}, {{start_date}}).
* Proposal instance:

  * Terhubung ke Lead/Client.
  * Status: Draft, Sent, Accepted, Rejected.
  * Link publik yang bisa dibuka client.
* Client action:

  * Checkbox "I agree" + ketik nama + timestamp → dianggap e‑signature sederhana.

---

### 6.5 Projects & Tasks

**User Stories**

* Sebagai PM, saya ingin melihat semua project aktif serta statusnya.
* Sebagai Member, saya ingin melihat daftar tugas saya dan prioritasnya.
* Sebagai Client, saya ingin melihat progress project saya.

**Fitur Project**

* CRUD projects.
* Hubungkan ke Client.
* Tambah field:

  * Title, description, status, start date, end date, budget (opsional), owner (agency member).

**Fitur Tasks**

* CRUD tasks.
* Field:

  * Title, description, projectId, assigneeId, status, priority, dueDate, `visibleToClient` (boolean).
* View:

  * List/table view dengan filter.
  * Kanban board by status.

**Permissions**

* Only Owner/Admin/Member pada agency dapat mengedit tasks.
* Client hanya melihat tasks di project miliknya dengan `visibleToClient = true`.

---

### 6.6 Client Portal (MVP)

**User Story**

* Sebagai Client, saya ingin punya satu link login ke portal untuk melihat semuanya terkait kerja sama saya dengan agency.

**Fitur**

* Client login (via email magic link atau password – gunakan subset fitur Clerk).
* Home overview:

  * Ringkasan project aktif.
  * Tasks summary (To Do / In Progress / Done).
  * Invoice due & paid.
* Project detail:

  * List tasks (visibleToClient).
  * Timeline sederhana.
* Invoices:

  * List invoice: nomor, tanggal, total, status.
  * Tombol "Pay" yang membuka payment link (Stripe checkout).
* Files:

  * Folder per project.
  * Upload/download file.

---

### 6.7 Invoices & Payments

**User Story**

* Sebagai Owner, saya ingin mengirim invoice dari platform dan client bisa bayar langsung dari link.

**Fitur**

* Create invoice:

  * Select Client (dan optional Project).
  * Tambah line items: description, qty, unit price.
  * Hitung subtotal, tax %, total.
* Integrasi Stripe:

  * Simpan `stripeCustomerId` di Client.
  * Generate payment link/checkout session.
  * Update status invoice saat payment sukses.
* Status & filter:

  * Filter by `Paid`, `Unpaid`, `Overdue`.
  * Auto mark `Overdue` ketika dueDate < today & status masih `Sent`.

---

### 6.8 Dashboard & Settings

**Dashboard**

* KPI cards:

  * Active Clients.
  * Active Projects.
  * Revenue 30 hari.
  * Overdue Invoices.
* Grafik sederhana revenue by month.

**Settings**

* Agency profile: nama, logo, domain, timezone.
* Billing preferences: currency, default tax.

---

## 7. Informasi Arsitektur & Navigasi

### 7.1 Struktur Navigasi (Agency Side)

Top‑level menu (sidebar):

1. Dashboard
2. Leads
3. Clients
4. Projects
5. Tasks (My Tasks)
6. Proposals & Contracts
7. Invoices
8. Onboarding Funnels
9. Brain (post‑MVP)
10. Settings

### 7.2 Struktur Navigasi (Client Portal)

1. Home
2. Projects
3. Invoices
4. Files
5. (Chat – post‑MVP)

---

## 8. Data Model (High‑Level)

> Catatan: ini high‑level; implementasi menggunakan Drizzle ORM di `Schema.ts`.

### 8.1 Entities Utama

* `organizations`
* `users` (dikelola Clerk, plus table internal untuk mapping roles)
* `organization_memberships`
* `clients`
* `leads`
* `projects`
* `tasks`
* `invoices`
* `invoice_items`
* `files`
* `onboarding_funnels`
* `onboarding_submissions`
* `proposal_templates`
* `proposals`
* `events` (activity log, optional v2)

### 8.2 Relasi Utama

* `organization` 1‑N `clients`, `leads`, `projects`, `invoices`.
* `client` 1‑N `projects`, `invoices`.
* `project` 1‑N `tasks`, `files`.
* `invoice` 1‑N `invoice_items`.
* `onboarding_funnel` 1‑N `onboarding_submissions`.
* `onboarding_submission` → create `client` (+ `project`).

---

## 9. Non‑Functional Requirements

1. **Performance**

   * Page utama dashboard harus load < 2–3 detik di koneksi normal.
   * Query harus di‑paginate (especially tasks, invoices, leads).

2. **Security**

   * Multi‑tenancy strict: semua access via `organizationId`.
   * Role‑based access control di tingkat route & server actions.
   * Data sensitif (keys, tokens) di environment (Vercel env vars).

3. **Reliability**

   * Gunakan Postgres managed (Neon/Supabase/Prisma Postgres).
   * Backup otomatis database.

4. **Scalability**

   * Next.js + edge‑friendly endpoints untuk beberapa read‑heavy API (opsional).

5. **Compliance (Soft)**

   * Terms & Privacy minimal tersedia.
   * Log e‑signature (timestamp, IP) untuk legal minimal.

---

## 10. Analytics & Success Metrics

### 10.1 Product Metrics

* **Activation**:

  * Waktu dari sign‑up → first client created.
  * Waktu dari sign‑up → first invoice sent.
* **Engagement**:

  * Jumlah active clients per agency.
  * Jumlah tasks created per project.
  * Jumlah logins client portal per minggu.
* **Revenue (untuk kita)**: MRR, churn, ARPA (nanti ketika pricing sudah fixed).

---

## 11. Roadmap (High‑Level)

### Fase 0 – Setup & Foundation (1–2 minggu)

* Setup Onvlo (boilerplate) untuk environment lokal & staging.
* Rancang schema Drizzle untuk entities baru: clients, leads, projects, tasks, invoices, funnels.

### Fase 1 – Core Agency CRM (2–4 minggu)

* CRUD **Clients & Leads** (list, detail, kanban).
* **Projects & Tasks** dengan basic views.
* Dashboard basic (counter + table).

### Fase 2 – Onboarding Funnel + Proposals (3–4 minggu)

* Builder Funnel sederhana.
* Public onboarding flow.
* Proposal templates + public proposal view.

### Fase 3 – Invoicing & Client Portal (3–5 minggu)

* Invoice creation + Stripe integration.
* Client portal: overview + projects + invoices + files.

### Fase 4 – Polishing & Post‑MVP (Berjalan)

* UX polish, permissions, error handling.
* Brain/SOP, chat, automations (prioritas bisa diurutkan berdasarkan feedback pengguna awal).

---

## 12. Risiko & Asumsi

**Risiko**

* Kompleksitas multi‑tenancy + role bisa tinggi jika tidak didesain jelas.
* Integrasi payments (Stripe, PayPal) butuh waktu testing & compliance.
* Chat & file upload bisa jadi sumber beban storage & security ekstra.

**Asumsi**

* Target awal: agency kecil–menengah dengan willingness to pay untuk retainer tools.
* Sebagian besar client comfortable login ke portal berbasis web.

---

## 13. Next Steps Setelah PRD Ini

1. Validasi cepat struktur fitur ke user (agency owner di sekitar kamu).
2. Breakdown PRD → **task teknis** (issue / ticket per modul).
3. Mulai dari modul yang paling core untuk value:

   * Clients + Projects + Tasks.
   * Invoices minimal.
   * Client portal read‑only.
4. Iterasi UI/UX sambil membatasi scope (jangan langsung ke fitur post‑MVP).

---

Dokumen ini dimaksudkan sebagai **living document** – bisa diupdate seiring implementasi Onvlo berkembang dan setelah kamu punya feedback dari agency nyata yang pakai produk ini.
