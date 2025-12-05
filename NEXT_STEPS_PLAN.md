# Next Steps Plan - Onvlo Agency OS

## Status Implementasi Saat Ini

### ✅ Selesai (Fase 0-1 Core)
- Database schema lengkap untuk semua entities MVP
- Dashboard dengan KPI cards dan recent activity
- Basic CRUD operations untuk: Leads, Clients, Projects, Tasks, Invoices, Proposals, Onboarding Funnels
- Server actions dengan multi-tenancy security
- Stripe integration setup (webhook + payment link)
- Navigation structure
- Type definitions dan utilities

### ⚠️ Partial (Perlu Penyempurnaan)
- Onboarding Funnel: Structure ada, tapi form handling belum lengkap
- Client Portal: Layout ada, tapi belum functional dengan data
- Proposals: CRUD ada, tapi public view belum
- Invoices: CRUD ada, tapi PDF generation belum

---

## Prioritas Next Steps (MVP Completion)

### Phase 1: Core Functionality Completion (2-3 minggu)

#### 1.1 Detail Pages & Forms (Priority: HIGH)
**Tujuan**: User bisa create, edit, dan view detail semua entities

**Tasks**:
- [ ] **Leads Detail Page** (`/dashboard/leads/[id]`)
  - View lead details dengan notes
  - Edit lead form
  - Convert to Client button (sudah ada action, perlu UI)
  - Activity timeline
  - Delete confirmation

- [ ] **Clients Detail Page** (`/dashboard/clients/[id]`)
  - Client info dengan edit form
  - Related projects list
  - Related invoices list
  - Notes section
  - Delete confirmation

- [ ] **Projects Detail Page** (`/dashboard/projects/[id]`)
  - Project info dengan edit form
  - Tasks list dengan filter (status, assignee)
  - Files section (placeholder untuk file upload)
  - Timeline view
  - Delete confirmation

- [ ] **Tasks Detail Page** (`/dashboard/tasks/[id]`)
  - Task info dengan edit form
  - Comments section (internal notes)
  - Status change dengan drag-drop
  - Delete confirmation

- [ ] **Invoices Detail Page** (`/dashboard/invoices/[id]`)
  - Invoice preview dengan line items
  - Edit invoice form
  - Send invoice button
  - Generate payment link button
  - PDF download (placeholder)
  - Delete confirmation

- [ ] **Proposals Detail Page** (`/dashboard/proposals/[id]`)
  - Proposal preview
  - Edit proposal form
  - Send proposal button
  - Public link generation
  - Delete confirmation

- [ ] **Onboarding Funnel Detail Page** (`/dashboard/onboarding-funnels/[id]`)
  - Funnel config editor
  - Form builder UI (static fields untuk MVP)
  - Agreement template editor
  - Toggle active/inactive
  - Public URL display
  - Delete confirmation

**Files to Create**:
```
src/app/[locale]/(auth)/dashboard/leads/[id]/page.tsx
src/app/[locale]/(auth)/dashboard/leads/new/page.tsx
src/app/[locale]/(auth)/dashboard/clients/[id]/page.tsx
src/app/[locale]/(auth)/dashboard/clients/new/page.tsx
src/app/[locale]/(auth)/dashboard/projects/[id]/page.tsx
src/app/[locale]/(auth)/dashboard/projects/new/page.tsx
src/app/[locale]/(auth)/dashboard/tasks/[id]/page.tsx
src/app/[locale]/(auth)/dashboard/tasks/new/page.tsx
src/app/[locale]/(auth)/dashboard/invoices/[id]/page.tsx
src/app/[locale]/(auth)/dashboard/invoices/new/page.tsx
src/app/[locale]/(auth)/dashboard/proposals/[id]/page.tsx
src/app/[locale]/(auth)/dashboard/proposals/new/page.tsx
src/app/[locale]/(auth)/dashboard/onboarding-funnels/[id]/page.tsx
src/app/[locale]/(auth)/dashboard/onboarding-funnels/new/page.tsx
```

**Components to Create**:
```
src/components/forms/LeadForm.tsx
src/components/forms/ClientForm.tsx
src/components/forms/ProjectForm.tsx
src/components/forms/TaskForm.tsx
src/components/forms/InvoiceForm.tsx
src/components/forms/ProposalForm.tsx
src/components/forms/FunnelForm.tsx
```

#### 1.2 Kanban Views (Priority: HIGH)
**Tujuan**: Visual drag-and-drop untuk Leads dan Tasks

**Tasks**:
- [ ] **Leads Kanban View** (`/dashboard/leads?view=kanban`)
  - Columns: New, Qualified, Proposal Sent, Won, Lost
  - Drag-and-drop untuk change stage
  - Card preview dengan name, company, source
  - Click card → open detail modal atau navigate

- [ ] **Tasks Kanban View** (`/dashboard/tasks?view=kanban`)
  - Columns: Backlog, In Progress, Review, Done
  - Filter by project (optional)
  - Drag-and-drop untuk change status
  - Card preview dengan title, assignee, priority, due date
  - Click card → open detail modal atau navigate

**Dependencies**: Install `@dnd-kit/core` dan `@dnd-kit/sortable`

**Files to Create**:
```
src/components/kanban/LeadsKanban.tsx
src/components/kanban/TasksKanban.tsx
src/components/kanban/KanbanColumn.tsx
src/components/kanban/KanbanCard.tsx
```

#### 1.3 Public Onboarding Flow (Priority: HIGH)
**Tujuan**: Client bisa complete onboarding dari public link

**Tasks**:
- [ ] **Onboarding Form Handler**
  - Multi-step form berdasarkan funnel config
  - Form fields: text, textarea, select, checkbox
  - Agreement view dengan checkbox
  - Payment step (opsional, jika ada package)
  - Success page dengan next steps

- [ ] **Onboarding Submission Processing**
  - Create client record dari form data
  - Create project (jika template ada)
  - Save submission responses
  - Send confirmation email ke client & agency owner

**Files to Update/Create**:
```
src/app/onboard/[slug]/[funnelSlug]/page.tsx (update)
src/app/onboard/[slug]/[funnelSlug]/actions.ts (create)
src/app/onboard/[slug]/[funnelSlug]/success/page.tsx (create)
src/components/onboarding/OnboardingForm.tsx (create)
src/components/onboarding/OnboardingStep.tsx (create)
```

#### 1.4 Client Portal Functional (Priority: HIGH)
**Tujuan**: Client bisa login dan view their data

**Tasks**:
- [ ] **Client Authentication**
  - Setup Clerk untuk client role
  - Magic link login untuk clients
  - Client-specific routes protection

- [ ] **Client Portal Home**
  - Active projects summary
  - Tasks summary (visibleToClient only)
  - Invoices summary (due & paid)
  - Quick actions

- [ ] **Client Projects View**
  - List projects untuk client
  - Project detail dengan tasks (visibleToClient only)
  - Timeline view

- [ ] **Client Invoices View**
  - List invoices untuk client
  - Invoice detail dengan line items
  - Pay button (redirect ke Stripe checkout)

- [ ] **Client Files View**
  - Files per project
  - Download files
  - Upload files (jika permission ada)

**Files to Update/Create**:
```
src/app/[locale]/(client)/page.tsx (update dengan data)
src/app/[locale]/(client)/projects/page.tsx (update dengan data)
src/app/[locale]/(client)/projects/[id]/page.tsx (create)
src/app/[locale]/(client)/invoices/page.tsx (update dengan data)
src/app/[locale]/(client)/invoices/[id]/page.tsx (create)
src/app/[locale]/(client)/files/page.tsx (create)
src/app/[locale]/(client)/actions.ts (create)
```

#### 1.5 Settings Page (Priority: MEDIUM)
**Tujuan**: Agency bisa manage settings

**Tasks**:
- [ ] **Agency Settings Page** (`/dashboard/settings`)
  - Agency profile: name, slug, logo upload
  - Branding: brand color picker
  - Billing: currency, default invoice terms, timezone
  - Integrations: Stripe keys display (read-only, setup via env)

**Files to Create**:
```
src/app/[locale]/(auth)/dashboard/settings/page.tsx
src/app/[locale]/(auth)/dashboard/settings/actions.ts
src/components/settings/AgencyProfileForm.tsx
src/components/settings/BrandingForm.tsx
src/components/settings/BillingForm.tsx
```

---

### Phase 2: Enhanced Features (2-3 minggu)

#### 2.1 Proposal Public View (Priority: MEDIUM)
**Tujuan**: Client bisa view dan sign proposal dari public link

**Tasks**:
- [ ] **Public Proposal Page** (`/proposals/[id]`)
  - Display proposal content (rendered dari template)
  - E-signature form: name input + checkbox
  - Submit signature → update proposal status
  - Log: timestamp, IP address, name

**Files to Create**:
```
src/app/proposals/[id]/page.tsx
src/app/proposals/[id]/actions.ts
src/components/proposals/ProposalViewer.tsx
src/components/proposals/SignatureForm.tsx
```

#### 2.2 Invoice PDF Generation (Priority: MEDIUM)
**Tujuan**: Generate PDF untuk invoice

**Tasks**:
- [ ] **PDF Generation**
  - Use library: `@react-pdf/renderer` atau `puppeteer`
  - Invoice template dengan branding agency
  - Download PDF button
  - Email invoice dengan PDF attachment (optional)

**Files to Create**:
```
src/app/[locale]/(auth)/dashboard/invoices/[id]/pdf/route.ts
src/components/invoices/InvoicePDF.tsx
src/utils/pdf-generator.ts
```

#### 2.3 File Upload & Storage (Priority: MEDIUM)
**Tujuan**: Upload dan manage files per project

**Tasks**:
- [ ] **File Upload Setup**
  - Choose storage: Vercel Blob, AWS S3, atau local (dev)
  - Upload component dengan drag-and-drop
  - File validation (size, type)
  - Progress indicator

- [ ] **File Management**
  - List files per project
  - Download files
  - Delete files (with permission check)
  - File preview (images, PDFs)

**Files to Create**:
```
src/app/api/files/upload/route.ts
src/app/api/files/[id]/route.ts (GET, DELETE)
src/components/files/FileUpload.tsx
src/components/files/FileList.tsx
src/components/files/FilePreview.tsx
src/utils/storage.ts
```

#### 2.4 Search & Filter Enhancement (Priority: LOW)
**Tujuan**: Better UX untuk finding data

**Tasks**:
- [ ] **Advanced Filters**
  - Leads: filter by stage, source, date range
  - Clients: filter by status, date range
  - Projects: filter by status, client, date range
  - Tasks: filter by status, priority, assignee, project, date range
  - Invoices: filter by status, client, date range

- [ ] **Search Functionality**
  - Global search (optional)
  - Per-page search dengan debounce
  - Search by name, email, company

- [ ] **Pagination**
  - Add pagination untuk semua list views
  - Page size options (10, 25, 50, 100)
  - URL query params untuk page state

**Files to Create/Update**:
```
src/components/filters/LeadFilters.tsx
src/components/filters/ClientFilters.tsx
src/components/filters/ProjectFilters.tsx
src/components/filters/TaskFilters.tsx
src/components/filters/InvoiceFilters.tsx
src/components/pagination/Pagination.tsx
src/hooks/usePagination.ts
```

#### 2.5 Dashboard Enhancements (Priority: LOW)
**Tujuan**: Better analytics dan insights

**Tasks**:
- [ ] **Revenue Chart**
  - Monthly revenue chart (use `recharts`)
  - Filter by date range
  - Export chart data (optional)

- [ ] **Activity Feed**
  - Recent activities dengan timestamps
  - Filter by type (client created, invoice sent, etc.)
  - Link ke related entities

**Files to Create**:
```
src/components/dashboard/RevenueChart.tsx
src/components/dashboard/ActivityFeed.tsx
```

---

### Phase 3: Polish & UX Improvements (1-2 minggu)

#### 3.1 Error Handling & Validation (Priority: MEDIUM)
**Tasks**:
- [ ] **Form Validation**
  - Zod schemas untuk semua forms
  - Client-side validation dengan react-hook-form
  - Error messages yang user-friendly
  - Loading states untuk all async operations

- [ ] **Error Boundaries**
  - Global error boundary
  - Per-page error handling
  - Error logging ke Sentry (sudah ada setup)

**Files to Create**:
```
src/components/errors/ErrorBoundary.tsx
src/components/errors/ErrorFallback.tsx
src/utils/validation.ts (consolidate all Zod schemas)
```

#### 3.2 Loading States & Skeleton (Priority: LOW)
**Tasks**:
- [ ] **Skeleton Loaders**
  - Skeleton untuk list views
  - Skeleton untuk detail pages
  - Skeleton untuk dashboard cards

**Files to Create**:
```
src/components/ui/skeleton.tsx (jika belum ada)
src/components/loading/ListSkeleton.tsx
src/components/loading/DetailSkeleton.tsx
```

#### 3.3 Toast Notifications (Priority: LOW)
**Tasks**:
- [ ] **Toast System**
  - Success notifications untuk create/update/delete
  - Error notifications untuk failures
  - Use `sonner` atau `react-hot-toast`

**Files to Create**:
```
src/components/ui/toast.tsx (jika belum ada)
src/utils/toast.ts
```

#### 3.4 Responsive Design (Priority: MEDIUM)
**Tasks**:
- [ ] **Mobile Optimization**
  - Responsive tables (convert ke cards di mobile)
  - Mobile-friendly forms
  - Hamburger menu untuk navigation
  - Touch-friendly buttons

---

### Phase 4: Post-MVP Features (Future)

#### 4.1 Email Notifications (Priority: LOW)
- Invoice sent email
- Invoice paid confirmation
- Proposal sent email
- Proposal signed notification
- Task assigned notification

#### 4.2 Advanced Features
- Brain/SOP & Docs
- Chat & Communication
- Automations
- Website/Link-in-bio builder

---

## Implementation Order (Recommended)

### Sprint 1 (Week 1-2): Core Functionality
1. Detail pages untuk Leads, Clients, Projects, Tasks
2. Create/Edit forms untuk semua entities
3. Client Portal functional dengan authentication

### Sprint 2 (Week 3-4): Enhanced Views
1. Kanban views untuk Leads dan Tasks
2. Public onboarding flow completion
3. Proposal public view dengan e-signature

### Sprint 3 (Week 5-6): Polish & Features
1. Settings page
2. File upload & storage
3. Invoice PDF generation
4. Search & filter enhancements

### Sprint 4 (Week 7-8): UX Improvements
1. Error handling & validation
2. Loading states & skeletons
3. Toast notifications
4. Responsive design polish

---

## Technical Considerations

### Dependencies to Add
```json
{
  "@dnd-kit/core": "^6.0.0",
  "@dnd-kit/sortable": "^7.0.0",
  "@dnd-kit/utilities": "^3.2.0",
  "recharts": "^2.10.0",
  "date-fns": "^2.30.0",
  "@react-pdf/renderer": "^3.4.0",
  "sonner": "^1.4.0",
  "zod": "^3.23.0" // already exists
}
```

### Environment Variables Needed
```env
# File Storage (choose one)
VERCEL_BLOB_READ_WRITE_TOKEN=...
# OR
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...

# Email (optional for MVP)
RESEND_API_KEY=...
# OR
SENDGRID_API_KEY=...
```

### Database Considerations
- Add indexes untuk performance:
  - `clients.organizationId`
  - `projects.organizationId, clientId`
  - `tasks.projectId, assigneeId`
  - `invoices.organizationId, clientId, status`

---

## Testing Strategy

### Unit Tests
- Server actions dengan Vitest
- Form validation logic
- Utility functions

### Integration Tests
- CRUD flows end-to-end
- Payment flow dengan Stripe test mode
- Onboarding flow completion

### E2E Tests (Playwright)
- User signup → create client → create project → create task
- Create invoice → send → pay → verify status
- Onboarding flow → client creation
- Client portal login → view projects → view invoices

---

## Success Metrics

### MVP Completion Criteria
- [ ] User bisa create, edit, delete semua core entities
- [ ] Client bisa complete onboarding dari public link
- [ ] Client bisa login ke portal dan view their data
- [ ] Invoice bisa dibuat, dikirim, dan dibayar via Stripe
- [ ] Proposal bisa dibuat dan di-sign oleh client
- [ ] Dashboard menampilkan accurate metrics
- [ ] All pages responsive dan user-friendly

### Post-MVP Metrics
- Time to first client created < 5 minutes
- Time to first invoice sent < 10 minutes
- Client portal login success rate > 95%
- Invoice payment completion rate tracking

---

## Notes

- **Prioritize MVP features first** - Don't jump to post-MVP features
- **Iterate based on user feedback** - Test dengan real agency owners
- **Keep it simple** - MVP should be functional, not perfect
- **Document as you go** - Update README dengan setup instructions
- **Security first** - Always verify organizationId in all queries

---

**Last Updated**: Based on current implementation status
**Next Review**: After Sprint 1 completion

