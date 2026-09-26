# CMM Navigator

No database

No Supabase

No external backend

No API calls

No authentication backend

 Use local mock/static data for the prototype

 Build the admin interface as a frontend-only 
Créateur Centre Monastir (CMM) — Complete Website Redesign

Redesign the website for Créateur Centre Monastir (CMM) from scratch with a modern, professional, premium and trustworthy visual identity.

The existing website belongs to the client and needs a complete UX/UI redesign. Use the attached client content/document as the source of truth for the website structure, services, courses, Germany opportunities, contact information and existing content.

MOST IMPORTANT DESIGN REQUIREMENT

The client's logo is the main source of the visual identity.

Use the colors extracted/inspired from the logo throughout the entire website:

Primary color

Secondary color

Accent color

Light/background variations

Text colors that complement the logo

Do NOT introduce a completely unrelated color palette.

The website should feel coherent with the client's logo while still looking modern and high-end.

Do not simply reproduce the existing website. Create a completely redesigned interface with better hierarchy, spacing, typography, cards, navigation, calls-to-action and responsive behavior.

BRAND / BUSINESS

Name:

Créateur Centre Monastir

The center provides:

Language courses

Professional training

German language preparation

Ausbildung opportunities in Germany

Work opportunities in Germany

Support and guidance for people planning to study or work in Germany

The website should communicate:

Trust

Professionalism

Education

Career development

International opportunities

Personal support

PUBLIC WEBSITE

Create the following pages.

1. HOME

Create a strong modern hero section.

Hero content:

Créateur Centre Monastir

"Le partenaire de votre réussite"

Short description explaining language training, professional training and support for Germany.

Primary CTA:

Découvrir nos formations

Secondary CTA:

Nous contacter

Below the hero, include:

Language Courses

Show the available languages:

German

English

French

Italian

Spanish

Dutch

Use attractive cards with icons or visual elements.

CTA:

Voir les formations en langues

Germany

Create a visually strong section explaining that Créateur Centre supports candidates with:

German language learning

Application preparation

Training opportunities

Work opportunities

Administrative support

CTA:

Découvrir les opportunités en Allemagne

Professional Training

Show:

Broderie

Crochet

Bougies parfumées

Use modern course cards.

CTA:

Voir les formations professionnelles

Why Choose Us

Show the main advantages:

Accompagnement personnalisé

Méthodes d’apprentissage modernes et pratiques

Préparation aux examens de langue

Accompagnement des projets en Allemagne

Testimonials

Display client/student testimonials in a modern carousel/grid.

Final CTA

A strong final section:

"Parlons de votre projet"

Buttons:

S'inscrire

Nous contacter

2. ABOUT US

Create a modern About page.

Include:

Who Créateur Centre Monastir is

Founded in 2022

Language education

International study/work support

Germany orientation

Personalized student support

Include a "Nos engagements" section.

Use a professional visual layout rather than a simple wall of text.

3. LANGUAGE COURSES

Create a dedicated page for language training.

Display the six languages:

Allemand

Anglais

Français

Italien

Espagnol

Néerlandais

Each language should be represented by a beautiful card.

Clicking a language should show its available courses.

For German, the content should support:

A1 to B2

Group courses

Individual courses

Speaking

Listening

Grammar

Vocabulary

Exam preparation

For English:

Beginner to advanced

Group/individual

Intensive courses

Conversation

Professional English

IELTS / TOEIC / TOEFL preparation

The exact course information should ultimately come from the application's local editable data rather than being hardcoded.

4. PROFESSIONAL TRAINING

Display professional courses such as:

Broderie

Crochet

Bougies parfumées

Each should be a dynamic course card.

Clicking a course opens its Course Details page.

5. GERMANY / AUSBILDUNG

Create a dedicated Germany page.

Explain:

"What is Ausbildung?"

Show available opportunities such as:

Paramedical training

LKW Fahrer

Each opportunity should have:

Description

Requirements

German level

Duration

Age requirements if applicable

Sessions

Benefits

Application CTA

CTA:

Vérifier mon éligibilité

Important:

Germany opportunities must be manageable from the admin interface.

6. WORK OPPORTUNITIES IN GERMANY

Create a dedicated page for medical and paramedical professionals.

Profiles can include:

Nurses

Instrumentistes

Radiology technicians

Show:

Profile

Required conditions

Support provided

Diploma recognition

German language preparation

Connection with German institutions

Follow-up

CTA:

Lancer mon projet en Allemagne

This content must also be editable from the admin interface.

7. COURSE DETAILS

Create a reusable dynamic course details page.

Example URL concept:

/courses/:slug

The page should support:

Course title

Category

Cover image

Gallery

Description

Objectives

Program/content

Level

Duration

Schedule

Price

Location

Instructor

Available sessions

Requirements

What is included

Maximum participants

Registration CTA

Primary button:

S'inscrire à cette formation

The design should work for BOTH:

Language courses

Professional courses

Do not create separate hardcoded page designs for every course.

8. CONTACT

Create a modern contact page.

Display:

Address

Phone

Email

WhatsApp

Opening hours

Social media

Map

Contact form:

Nom et prénom

Téléphone

E-mail

Message

Consent checkbox

CTA:

Envoyer ma demande

9. REGISTRATION / APPLICATION

Create a dedicated registration page.

Form fields:

Nom et prénom

Téléphone

E-mail

Formation souhaitée

Niveau actuel

Message

Consentement

After submission:

"Merci. Votre demande a bien été envoyée. Notre équipe vous contactera prochainement."

The selected course should automatically be populated when the user clicks "S'inscrire" from a course details page.

10. LEGAL / PRIVACY

Create pages for:

Mentions légales

Politique de confidentialité

Cookie information if analytics/tracking is implemented

ADMIN INTERFACE

This is a VERY IMPORTANT part of the project.

The client must NOT need a developer to manage courses and website content.

Create a separate professional admin dashboard.

Admin route concept:

/admin

Create a frontend admin login screen.

For this prototype, authentication can be simulated with frontend-only mock credentials. Do not implement external authentication services.

ADMIN DASHBOARD

Create a clean professional dashboard showing:

Total courses

Active courses

New registrations

Contact requests

Germany opportunities

Testimonials

Recent activity

Use cards/statistics and simple charts where useful.

COURSES MANAGEMENT

Create a complete frontend CRUD management interface.

Admin must be able to:

Add course

Edit course

Delete course

Activate/deactivate course

Duplicate course

Search courses

Filter courses

Sort courses

Course fields:

Title

Slug

Category

Language

Short description

Full description

Cover image

Gallery

Objectives

Program

Level

Duration

Schedule

Price

Location

Instructor

Start date

End date

Available places

Requirements

Included items

Status

Featured course

Categories should include at minimum:

Language

Professional Training

Germany / Ausbildung

The admin should be able to create additional categories.

COURSE MANAGEMENT UX

Use a professional admin table:

Course | Category | Level | Price | Status | Date | Actions

Actions:

View

Edit

Duplicate

Activate/Deactivate

Delete

Add confirmation dialogs before destructive actions.

Use image upload/preview for course images.

CATEGORIES MANAGEMENT

Admin can:

Add category

Edit category

Delete category

Activate/deactivate category

REGISTRATIONS / APPLICATIONS

Create an admin page where the client can see all registration requests.

Columns:

Name

Phone

Email

Course

Date

Status

Statuses:

New

Contacted

In Progress

Confirmed

Rejected

Completed

Admin can open an application to see all details.

Add search and filtering.

CONTACT MESSAGES

Create a message management page.

Admin can:

View messages

Mark as read/unread

Change status

Delete messages

GERMANY OPPORTUNITIES MANAGEMENT

Create an admin section where the client can manage:

Ausbildung opportunities

Work opportunities

Medical/paramedical opportunities

Admin must be able to add/edit/remove opportunities without changing code.

Fields should include:

Title

Description

Requirements

German level

Duration

Age requirement

Location

Sessions

Benefits

Application information

Images

Status

TESTIMONIAL MANAGEMENT

Admin can:

Add testimonial

Edit testimonial

Delete testimonial

Publish/unpublish testimonial

Fields:

Name

Testimonial

Photo

Language

Published status

HOMEPAGE MANAGEMENT

The homepage should NOT be completely hardcoded.

Create an admin interface allowing the client to manage:

Hero title

Hero description

Hero image

Hero buttons

Featured courses

Why choose us content

Germany section

Professional training section

Testimonials

CTA sections

The admin should be able to change text and images without developer intervention.

WEBSITE SETTINGS

Create an admin settings page for:

Center name

Logo

Phone

WhatsApp

Email

Address

Opening hours

Facebook URL

Instagram URL

TikTok URL

Footer text

Social media links

FRONTEND-ONLY DATA ARCHITECTURE

IMPORTANT: This project must remain frontend-only.

Do NOT create or connect any:

Database

Backend

Supabase

Firebase

PostgreSQL

MySQL

MongoDB

REST API

GraphQL API

External CMS

External authentication service

Server-side data storage

Use local frontend data only.

Create clean local data models/interfaces for:

Course

Category

Registration

ContactMessage

GermanyOpportunity

Testimonial

HomepageContent

WebsiteSettings

Use local state and/or localStorage to store and manage the data.

The admin interface should behave like a real CMS within the prototype:

Adding a course updates the local course list.

Editing a course updates the course information.

Deleting a course removes it from the local data.

Activating/deactivating a course changes its visibility.

Changes made in the admin interface should immediately be reflected on the public website within the same browser/prototype.

Homepage content changes should update the public homepage.

Germany opportunity changes should update the public Germany pages.

Testimonial changes should update the public testimonials.

Website settings changes should update the public website.

Use realistic initial mock data based on the provided Créateur Centre Monastir content.

The local data architecture should be organized cleanly so that a real backend could be added in the future without needing to redesign the application.

Do not spend tokens implementing any real backend infrastructure.

DESIGN SYSTEM

Create a reusable design system based on the client's logo.

Requirements:

Modern typography

Strong visual hierarchy

Generous spacing

Elegant cards

Subtle animations

Professional buttons

Consistent border radius

Consistent shadows

Accessible contrast

Responsive layout

Avoid:

Generic template appearance

Excessive gradients

Excessive animations

Overly colorful UI

Huge amounts of text

Cluttered layouts

Outdated education-center designs

The result should feel like a professional modern education and career center, not a generic school template.

RESPONSIVE DESIGN

The website must work perfectly on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Use a clean hamburger menu

Keep the main CTA visible

Make course cards easy to browse

Make phone/WhatsApp actions easy to access

Keep forms simple and mobile-friendly

Include a floating WhatsApp button.

TECHNICAL ARCHITECTURE

Build the frontend and admin interface as a real application, not just static mockups.

Use reusable components.

Courses, categories, registrations, testimonials, Germany opportunities and website settings should be represented as dynamic local data.

Do not hardcode course information into individual pages.

The Course Details page must dynamically load its content based on the selected course.

The admin dashboard must control the public website content through local application state/storage.

Use proper:

Loading states

Empty states

Error states

Confirmation dialogs

Form validation

Success feedback

Responsive states

Keep the project structure clean and modular.

Do not over-engineer the application.

IMPORTANT CONTENT RULE

Use the attached Créateur Centre Monastir document as the source for the initial content.

Do not invent additional services or claims about the company.

Some information in the document is explicitly marked as needing validation before publication, including:

Exact address

WhatsApp availability

Language levels

Certifications

Ausbildung conditions

Age limits

Training duration

Professional course pricing/details

Testimonials and image usage rights

For those items, create the appropriate editable fields/placeholders rather than presenting unverified information as permanently confirmed.

FINAL RESULT

The final application should feel like a complete production-ready website prototype for Créateur Centre Monastir with:

A beautiful modern public website

A complete course catalog

Dynamic course detail pages

Registration system

Contact system

Germany/Ausbildung sections

Testimonials

Fully responsive design

Professional admin dashboard

Full CRUD management for courses

Dynamic homepage management

Dynamic Germany opportunity management

Registration/message management

Website settings management

Visual identity based on the client's logo colors

Fully functional frontend-only content management

Local data persistence for the prototype

There must be NO database or backend integration in this version.

Prioritize UX/UI quality, clarity, professionalism and ease of administration.

The client should be able to run the website and manage its courses/content through the frontend admin interface without needing a developer.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/36fb5643-54da-4a18-9374-7f966415eeec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
