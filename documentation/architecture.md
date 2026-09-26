# Créateur Centre Monastir (CMM)

## Technical Architecture & Technology Choices

---

## 1. Project Context

The CMM website is a **single-client website**, not a SaaS platform.

The expected data volume is relatively small and the server provided for deployment may have limited resources.

The main technical priorities are:

* Easy deployment
* Easy maintenance
* Low server resource consumption
* Simple database administration
* Reliable data storage
* Good performance
* Clean and maintainable architecture
* Ability to migrate to a larger database solution in the future if necessary

The application contains:

* Public website
* Course catalog
* Course details
* Registration/application forms
* Contact forms
* Germany/Ausbildung opportunities
* Testimonials
* Admin dashboard
* Content management
* Course management
* Website settings

---

# 2. Selected Technology Stack

## Frontend

**React**

Responsibilities:

* Public website UI
* Course catalog
* Course details
* Registration forms
* Contact forms
* Germany opportunity pages
* Admin dashboard
* Admin CRUD interfaces
* Responsive design

Architecture:

```text
React Frontend
      ↓
   HTTP API
      ↓
 Node.js Backend
```

---

# 3. Backend

## Node.js

Node.js will be used as the backend runtime.

Responsibilities:

* REST API
* Business logic
* Request validation
* Authentication
* Authorization
* Course management
* Registration management
* Contact message management
* Germany opportunity management
* Testimonial management
* Website settings
* File/image handling
* Database communication

The backend will expose API endpoints consumed by the React frontend.

Example:

```text
GET    /api/courses
GET    /api/courses/:slug

POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id

POST   /api/registrations
GET    /api/registrations

POST   /api/contact
GET    /api/contact

GET    /api/germany-opportunities
POST   /api/germany-opportunities
PUT    /api/germany-opportunities/:id
DELETE /api/germany-opportunities/:id
```

---

# 4. Database

## SQLite

SQLite will be used as the database.

The main reason is that this project:

* Is not SaaS
* Has one client
* Has relatively small data volume
* Is expected to run on a small server
* Does not require a dedicated database server
* Needs simple deployment
* Needs simple maintenance

The database will essentially be a file:

```text
cmm.db
```

There is no separate PostgreSQL/MySQL database server to install and maintain.

---

# 5. Why SQLite

SQLite is appropriate for this project because the expected workload is relatively small.

The application will mainly have:

### Reads

* Viewing courses
* Viewing course details
* Viewing Germany opportunities
* Viewing testimonials
* Loading homepage content
* Loading website settings

### Writes

* Course registration
* Contact form submission
* Admin course changes
* Admin content changes
* Admin testimonials
* Admin Germany opportunities

The number of visitors is not expected to translate into a similarly large number of database writes.

For example:

```text
10,000 visitors
       ↓
Mostly page views
       ↓
Small number of registrations/contact requests
       ↓
Low database write volume
```

This makes SQLite a suitable choice.

---

# 6. Database ORM

## Prisma

Prisma will be used as the database ORM.

Architecture:

```text
Node.js
   ↓
Prisma
   ↓
SQLite
   ↓
cmm.db
```

Prisma will handle:

* Database models
* Queries
* Inserts
* Updates
* Deletes
* Relations
* Migrations
* Type-safe database access

Example conceptual model:

```text
Course
  ↓
Category
  ↓
CourseSession

Registration
  ↓
Course

Testimonial
  ↓
Website

GermanyOpportunity
  ↓
OpportunityType
```

The application should interact with the database through Prisma rather than spreading raw SQL throughout the Node.js application.

---

# 7. SQLite WAL Mode

SQLite will use **WAL (Write-Ahead Logging) mode**.

Conceptually:

```text
             SQLite
                │
       ┌────────┴────────┐
       │                 │
     READS             WRITES
       │                 │
   Multiple             Controlled
   readers              writes
```

This is useful for the website because many users may be reading courses/pages while administrators or users are performing database writes.

WAL should be configured as part of the SQLite setup.

---

# 8. Overall Architecture

The proposed architecture is:

```text
                    ┌───────────────────────┐
                    │      Public Users     │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     React Frontend    │
                    │                       │
                    │  Public Website       │
                    │  Course Catalog       │
                    │  Registration         │
                    │  Contact              │
                    │  Germany Opportunities│
                    └───────────┬───────────┘
                                │
                           HTTP / REST
                                │
                                ▼
                    ┌───────────────────────┐
                    │     Node.js Backend   │
                    │                       │
                    │  API                  │
                    │  Business Logic       │
                    │  Validation           │
                    │  Authentication       │
                    │  Authorization        │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │        Prisma         │
                    │       ORM Layer       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   SQLite + WAL Mode   │
                    │                       │
                    │       cmm.db          │
                    └───────────────────────┘
```

---

# 9. Server Structure

A simple deployment could look like:

```text
CMM/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── validators/
│   │   └── utils/
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── data/
│   │   └── cmm.db
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── types/
│   │
│   └── package.json
│
├── uploads/
│
└── backups/
```

The exact folder structure can be adjusted during implementation.

---

# 10. Public Website Architecture

The React application will contain the public website.

Main routes:

```text
/
 /about
 /courses
 /courses/:slug
 /professional-training
 /germany
 /germany/work
 /contact
 /registration
 /legal
 /privacy
```

The frontend should retrieve content through the Node.js API.

For example:

```text
React
   ↓
GET /api/courses
   ↓
Node.js
   ↓
Prisma
   ↓
SQLite
```

---

# 11. Admin Architecture

The admin interface will be part of the React application.

Main route:

```text
/admin
```

Possible admin pages:

```text
/admin
/admin/courses
/admin/courses/new
/admin/courses/:id/edit
/admin/categories
/admin/registrations
/admin/messages
/admin/germany
/admin/testimonials
/admin/homepage
/admin/settings
```

Admin flow:

```text
Admin
  ↓
React Admin UI
  ↓
Node.js API
  ↓
Authentication / Authorization
  ↓
Prisma
  ↓
SQLite
```

The admin must never communicate directly with SQLite from the browser.

---

# 12. Core Database Entities

The initial database can contain the following entities.

## Course

```text
Course
- id
- title
- slug
- shortDescription
- description
- categoryId
- language
- coverImage
- level
- duration
- schedule
- price
- location
- instructor
- startDate
- endDate
- availablePlaces
- requirements
- includedItems
- status
- featured
- createdAt
- updatedAt
```

---

## Category

```text
Category
- id
- name
- slug
- description
- status
- createdAt
- updatedAt
```

Initial categories:

```text
Language
Professional Training
Germany / Ausbildung
```

---

## Course Gallery

```text
CourseImage
- id
- courseId
- imageUrl
- sortOrder
```

---

## Registration

```text
Registration
- id
- name
- phone
- email
- courseId
- currentLevel
- message
- consent
- status
- createdAt
- updatedAt
```

Statuses:

```text
NEW
CONTACTED
IN_PROGRESS
CONFIRMED
REJECTED
COMPLETED
```

---

## Contact Message

```text
ContactMessage
- id
- name
- phone
- email
- message
- consent
- status
- createdAt
- updatedAt
```

---

## Germany Opportunity

```text
GermanyOpportunity
- id
- title
- type
- description
- requirements
- germanLevel
- duration
- ageRequirement
- location
- sessions
- benefits
- applicationInformation
- image
- status
- createdAt
- updatedAt
```

---

## Testimonial

```text
Testimonial
- id
- name
- testimonial
- photo
- language
- published
- createdAt
- updatedAt
```

---

## Homepage Content

Homepage content should be editable from the admin panel.

Possible structure:

```text
HomepageContent
- id
- heroTitle
- heroDescription
- heroImage
- heroPrimaryButton
- heroSecondaryButton
- whyChooseUsContent
- germanySectionContent
- professionalTrainingContent
- finalCtaContent
- updatedAt
```

---

## Website Settings

```text
WebsiteSettings
- id
- centerName
- logo
- phone
- whatsapp
- email
- address
- openingHours
- facebookUrl
- instagramUrl
- tiktokUrl
- footerText
- updatedAt
```

---

# 13. Authentication

The admin area requires authentication.

Authentication should be handled by the Node.js backend.

The browser should never store or expose database credentials.

Conceptually:

```text
Admin Login
     ↓
Node.js
     ↓
Authentication
     ↓
Session / Token
     ↓
Protected Admin API
```

Public users do not need accounts.

Only administrators require authentication.

---

# 14. File / Image Handling

Images will be used for:

* Course covers
* Course galleries
* Germany opportunities
* Testimonials
* Homepage
* Logo

Images should not be stored directly inside SQLite as large binary data unless there is a specific reason to do so.

Instead:

```text
uploads/
├── courses/
├── germany/
├── testimonials/
├── homepage/
└── branding/
```

The database stores the image path/URL.

Example:

```text
Course
  ↓
coverImage = "/uploads/courses/german-a1.jpg"
```

---

# 15. Backup Strategy

Because SQLite is file-based, backups are simple.

Example:

```text
data/
└── cmm.db

backups/
├── cmm-2026-09-22.db
├── cmm-2026-09-23.db
└── cmm-2026-09-24.db
```

A scheduled backup process can periodically create database backups.

Uploads should also be backed up:

```text
Database backup
+
Uploads backup
```

Both are required for a complete website restoration.

---

# 16. Scalability Strategy

The initial architecture is intentionally simple.

Start with:

```text
React
  ↓
Node.js
  ↓
Prisma
  ↓
SQLite
```

If the project grows significantly, the architecture can later move to:

```text
React
  ↓
Node.js
  ↓
Prisma
  ↓
PostgreSQL
```

The goal is to keep the application architecture independent from the specific database engine as much as reasonably possible.

This means the project does not need to start with PostgreSQL simply because it may potentially need it in the future.

---

# 17. Why This Stack Fits CMM

The selected architecture prioritizes:

### Simplicity

Only one application backend and one database file are required.

### Low resource consumption

No dedicated database server is required.

### Easy deployment

The application can be deployed to a small server without setting up a separate database infrastructure.

### Easy maintenance

The database is a single SQLite file.

### Good developer experience

Prisma provides a structured and type-safe way to work with the database.

### Future migration

If requirements change, Prisma can continue to be used while the database provider changes.

---

# 18. Final Technology Stack

The agreed stack is:

```text
Frontend:
React

Backend:
Node.js

API:
REST

Database:
SQLite

ORM:
Prisma

SQLite configuration:
WAL mode

Authentication:
Node.js backend authentication

File storage:
Server filesystem

Database migrations:
Prisma Migrations

Database backup:
SQLite database + uploads backup
```

Final architecture:

```text
                         USERS
                           │
                           ▼
                  ┌─────────────────┐
                  │  React Frontend │
                  │                 │
                  │ Public Website  │
                  │ Admin Dashboard │
                  └────────┬────────┘
                           │
                         REST
                           │
                           ▼
                  ┌─────────────────┐
                  │    Node.js      │
                  │                 │
                  │ API             │
                  │ Auth            │
                  │ Validation      │
                  │ Business Logic  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     Prisma      │
                  │       ORM       │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ SQLite + WAL    │
                  │                 │
                  │    cmm.db       │
                  └─────────────────┘
                           │
                           ▼
                       Backups
```

**Core decision:**

> **React + Node.js + Prisma + SQLite + WAL**

This is the initial architecture for the CMM website, optimized for a small server, small dataset, simple deployment and easy maintenance while keeping a clean migration path to PostgreSQL if the application's requirements grow.
