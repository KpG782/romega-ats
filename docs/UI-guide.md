# Roméga Solutions - Image Asset Guide

This guide catalogs all images in the `public/images` directory and explains how each image is used across the Roméga Solutions website. Use this as a reference for implementing similar designs in other Roméga Studios projects.

**Last Updated:** March 5, 2026

---

## Table of Contents

1. [Root Level Images](#root-level-images)
2. [About Page Images](#about-page-images)
3. [Careers Page Images](#careers-page-images)
4. [Contact Page Images](#contact-page-images)
5. [Footer Images](#footer-images)
6. [Home Page Images](#home-page-images)
7. [Services Page Images](#services-page-images)
8. [Usage Patterns](#usage-patterns)

---

## Root Level Images

### Brand Assets

#### `navbar-company-logo.svg` / `navbar-company-logo.png`
- **Usage:** Main navigation bar logo (all pages)
- **Component:** `components/organisms/layout/Header.tsx`
- **Path:** `/images/navbar-company-logo.svg`
- **Purpose:** Primary brand identifier in the header
- **SEO:** Schema.org organization logo reference
- **Dimensions:** Optimized for navbar (typically 150-200px width)

#### `bg-cta.png`
- **Usage:** Background for Call-to-Action sections
- **Component:** `components/organisms/shared/ContactCTA.tsx`
- **Path:** `/images/bg-cta.png`
- **Purpose:** Decorative background for contact CTA sections
- **Style:** Applied via inline CSS `backgroundImage`

#### `bg-romega-logo.png`
- **Usage:** Background branding element
- **Purpose:** Watermark or subtle branding overlay
- **Type:** PNG for transparency support

### Icons

#### `fav-icon.ico` / `fav-icon.png`
- **Usage:** Browser favicon
- **Location:** Root of public directory
- **Purpose:** Browser tab icon, bookmarks

#### `icon-accordion-arrow-down.svg`
- **Usage:** Indicates expanded accordion state
- **Components:**
  - `components/organisms/services/ServiceDetails.tsx`
- **Purpose:** Visual indicator for open accordion items

#### `icon-accordion-arrow-right.svg`
- **Usage:** Indicates collapsed accordion state
- **Components:**
  - `components/organisms/services/FAQ.tsx`
- **Purpose:** Visual indicator for closed accordion items

#### `icon-bookcase.svg`
- **Usage:** Service/feature icon
- **Purpose:** Represents knowledge, learning, or HR services

#### `icon-calendar-days.svg` / `icon-calendar-days.png` / `icon-calendar-days-2.svg`
- **Usage:** Schedule meeting or booking functionality
- **Components:**
  - `components/organisms/contact/ContactForm.tsx`
  - `components/organisms/services/CultureFitDiagnostic.tsx`
- **Purpose:** Indicates scheduling or time-based features

#### `icon-menu.svg`
- **Usage:** Mobile navigation hamburger menu
- **Component:** `components/organisms/layout/Header.tsx`
- **Path:** `/images/icon-menu.svg`
- **Purpose:** Toggle mobile navigation menu

#### `icon-send.svg`
- **Usage:** Contact form submit button
- **Component:** `components/organisms/contact/ContactForm.tsx`
- **Path:** `/images/icon-send.svg`
- **Purpose:** Visual indicator for form submission

#### `Color Pallete Section.png`
- **Usage:** Design reference (not used in production)
- **Purpose:** Internal design documentation

---

## About Page Images

### Hero & Background

#### `about.webp`
- **Usage:** About page hero image
- **Component:** `components/organisms/about/AboutHero.tsx`
- **Path:** `/images/about/about.webp`
- **Purpose:** Main visual for About page hero section
- **Format:** WebP for optimal performance

#### `team-bg.webp`
- **Usage:** Team section background
- **Location:** About page team section
- **Purpose:** Decorative background for team showcase

#### `team-top.webp` / `team-bot.webp`
- **Usage:** Team section decorative elements
- **Purpose:** Visual dividers or decorative overlays for team sections

### Team Member Photos - Individual Contributors (IC)

**Path Pattern:** `/images/about/IC/IC_[Role]_[Name].[ext]`

#### `IC_CEO_Robbie.png`
- **Role:** Chief Executive Officer
- **Name:** Robbie
- **Component:** `lib/constants.ts` - Team members data
- **Usage:** Team member profile in About page

#### `IC_Graphics_Designer_Mich.png`
- **Role:** Graphics Designer
- **Name:** Mich
- **Usage:** Team member profile

#### `IC_Bookkeeper_Eliza.png`
- **Role:** Bookkeeper
- **Name:** Eliza
- **Usage:** Team member profile

#### `IC_Marketing_Audrey.png`
- **Role:** Marketing
- **Name:** Audrey
- **Usage:** Team member profile

#### `IC_HR_Cherry.png`
- **Role:** Human Resources
- **Name:** Cherry
- **Usage:** Team member profile

#### `IC_Recruitment_Christine.jpg`
- **Role:** Recruitment
- **Name:** Christine
- **Usage:** Team member profile

#### `IC_Web_Developer_Ken.jpg`
- **Role:** Web Developer
- **Name:** Ken
- **Usage:** Team member profile

#### `IC_Recruiter_Duane.jpg`
- **Role:** Recruiter
- **Name:** Duane
- **Usage:** Team member profile

#### `IC_Recruitment_Jyrra.png`
- **Role:** Recruitment
- **Name:** Jyrra
- **Usage:** Team member profile

#### `IC_UI_UX_Designer_Mark.png`
- **Role:** UI/UX Designer
- **Name:** Mark
- **Usage:** Team member profile

#### `IC_Account_Executive_Associate_Rich.png`
- **Role:** Account Executive Associate
- **Name:** Rich
- **Usage:** Team member profile

#### `VA_Joyce.png`
- **Role:** Virtual Assistant
- **Name:** Joyce
- **Usage:** Team member profile

### Team Photos - Leadership

#### `Rob.webp` / `Rob.png`
- **Name:** Rob (Leadership)
- **Component:** `lib/constants.ts` - advisorsData
- **Usage:** Advisor/Leadership profile

#### `PALMA.webp` / `PALMA.jpg`
- **Name:** Palma (Leadership)
- **Usage:** Advisor/Leadership profile

#### `Peñaflor.webp` / `Peñaflor.png`
- **Name:** Peñaflor (Leadership)
- **Usage:** Advisor/Leadership profile

#### `Katrina.webp` / `Katrina.JPG`
- **Name:** Katrina (Leadership)
- **Usage:** Advisor/Leadership profile

#### `Edmayelle.jpg`
- **Name:** Edmayelle (Leadership)
- **Usage:** Advisor/Leadership profile

### Team Photos - Additional Names

#### `Audrey.webp` / `Audrey.png` / `Auudrey.webp`
- **Note:** Multiple versions/spellings
- **Usage:** Team member photo

#### `Ken.webp` / `Ken.jpg`
- **Usage:** Team member photo (both webp and jpg versions)

#### `Ricardo.webp` / `Ricardo.png`
- **Usage:** Team member photo

#### `mark.webp` / `mark.png`
- **Usage:** Team member photo (UI/UX Designer)

### Intern Photos

**Path Pattern:** `/images/about/Intern/Intern_[Department]_[Name].[ext]`

#### `Intern_HR_Erich.jpg`
- **Department:** Human Resources
- **Name:** Erich

#### `Intern_Marketing_Anay_Nica.png`
- **Department:** Marketing
- **Name:** Anay Nica

#### `Intern_Marketing_Co_Mickey.png`
- **Department:** Marketing Coordinator
- **Name:** Mickey

#### `Intern_Marketing_Tang_Jillian.jpg`
- **Department:** Marketing
- **Name:** Tang Jillian

#### `Intern_Market_Intelligence_Edmayelle.jpg`
- **Department:** Market Intelligence
- **Name:** Edmayelle

#### `Intern_Market_Intelligence_Jill.jpg`
- **Department:** Market Intelligence
- **Name:** Jill

#### `Intern_Market_Intelligence_RoAnn Rivero.jpg`
- **Department:** Market Intelligence
- **Name:** RoAnn Rivero

#### `Intern_Market_Intelligence_Sarah.jpg`
- **Department:** Market Intelligence
- **Name:** Sarah

#### `Intern_Sales_Jayber.jpg`
- **Department:** Sales
- **Name:** Jayber

#### `Intern_Sales_Kailynne_Lee.png`
- **Department:** Sales
- **Name:** Kailynne Lee

#### `Intern_Sales_Mari.jpeg`
- **Department:** Sales
- **Name:** Mari

#### `Intern_Sales_Ryjed.jpg`
- **Department:** Sales
- **Name:** Ryjed

### About Page Icons

#### `books.svg`
- **Usage:** Represents learning, knowledge, or training
- **Purpose:** Icon for educational services or culture

#### `calendar.svg`
- **Usage:** Schedule or time-related features
- **Purpose:** Represents scheduling or events

#### `career.svg`
- **Usage:** Career-related sections
- **Purpose:** Represents career opportunities or growth

#### `btn-up.svg`
- **Usage:** Scroll-to-top button
- **Also used in:** Footer section
- **Purpose:** Navigation aid to return to page top

#### `rs-footer.svg`
- **Usage:** Footer logo
- **Also used in:** Footer section across all pages
- **Purpose:** Brand identity in footer

---

## Careers Page Images

### Hero & Background

#### `bg-top.png`
- **Usage:** Top decorative background for careers page
- **Components:**
  - `components/organisms/careers/CareersHero.tsx`
  - `components/organisms/careers/PrivacyPriority.tsx`
- **Purpose:** Decorative hero section background

#### `human.png`
- **Usage:** Hero illustration (people-focused)
- **Component:** `components/organisms/careers/CareersHero.tsx`
- **Purpose:** Represents workforce, talent, or recruitment

#### `curve-top.png` / `curve-bottom.png`
- **Usage:** Section dividers
- **Purpose:** Visual separation between page sections

### Values & Culture Icons

#### `excellence.svg`
- **Usage:** Core value representation
- **Component:** `components/organisms/careers/WhyJoinUs.tsx`
- **Purpose:** Represents excellence or quality standards

#### `people.svg`
- **Usage:** Team/people-focused value
- **Component:** `components/organisms/careers/WhyJoinUs.tsx`
- **Purpose:** Represents teamwork or collaboration

#### `growht.svg` _(Note: appears to be typo of "growth")_
- **Usage:** Growth/development value
- **Component:** `components/organisms/careers/WhyJoinUs.tsx`
- **Purpose:** Represents career growth or learning

#### `world.svg`
- **Usage:** Global/remote work indicator
- **Components:**
  - `components/organisms/careers/WhyJoinUs.tsx`
  - `lib/api/jobs.ts` (job location type icon)
- **Purpose:** Indicates remote work or global opportunities

#### `location.svg`
- **Usage:** Location information
- **Components:**
  - `components/organisms/careers/WhyJoinUs.tsx`
  - `components/organisms/careers/JobCard.tsx`
- **Purpose:** Indicates office location or geographic information

#### `shield.svg` / `shield.png`
- **Usage:** Security/privacy indicators
- **Components:**
  - `components/organisms/careers/WhyJoinUs.tsx`
  - `components/organisms/careers/PrivacyPriority.tsx`
- **Purpose:** Represents data security, privacy protection

#### `more.svg`
- **Usage:** Additional options or information indicator
- **Component:** `components/organisms/careers/WhyJoinUs.tsx`
- **Purpose:** "Learn more" or expandable content trigger

#### `curiosity.svg`
- **Usage:** Core value representation
- **Purpose:** Represents curiosity or innovation culture

#### `heart-handshake.svg`
- **Usage:** Partnership or care value
- **Component:** `components/organisms/careers/CareersHero.tsx`
- **Purpose:** Represents collaboration, care, or partnership

### Privacy & Security Icons

#### `eye.svg`
- **Usage:** Visibility/transparency indicator
- **Component:** `components/organisms/careers/PrivacyPriority.tsx`
- **Purpose:** Represents transparency or data visibility controls

#### `human-check.svg`
- **Usage:** Verification or approval
- **Component:** `components/organisms/careers/PrivacyPriority.tsx`
- **Purpose:** Represents human verification or approval process

#### `lock.svg`
- **Usage:** Security/privacy indicator
- **Components:**
  - `components/organisms/careers/PrivacyPriority.tsx`
  - `components/organisms/careers/JobCard.tsx`
- **Purpose:** Indicates secure or private data

### Job Card Icons

#### `link.svg`
- **Usage:** External link or job details link
- **Component:** `components/organisms/careers/JobCard.tsx`
- **Purpose:** Indicates clickable/external link

#### `envelope.svg`
- **Usage:** Email or contact method
- **Component:** `components/organisms/careers/JobCard.tsx`
- **Purpose:** Email application or contact option

#### `linkedin.svg`
- **Usage:** LinkedIn application option
- **Component:** `components/organisms/careers/JobCard.tsx`
- **Purpose:** Apply via LinkedIn feature

#### `bag-white.svg`
- **Usage:** Job/briefcase icon (white variant)
- **Component:** `components/organisms/careers/CareersHero.tsx`
- **Purpose:** Represents job or career opportunity

### Job Type/Location Icons

#### `office.svg`
- **Usage:** On-site work location type
- **Component:** `lib/api/jobs.ts`
- **Path:** `/images/careers/office.svg`
- **Purpose:** Indicates on-site job positions

#### `part.svg`
- **Usage:** Part-time or employment type
- **Component:** `lib/api/jobs.ts`
- **Purpose:** Indicates part-time, full-time, or internship positions

#### `contract.svg` _(referenced but may not exist)_
- **Usage:** Contract employment type
- **Component:** `lib/api/jobs.ts`
- **Purpose:** Indicates contract positions
- **Note:** Referenced in code but file may not exist in directory

#### `hybrid.svg` _(referenced but may not exist)_
- **Usage:** Hybrid work location type
- **Component:** `lib/api/jobs.ts`
- **Purpose:** Indicates hybrid work arrangements
- **Note:** Referenced in code but file may not exist in directory

### UI Elements

#### `close.svg`
- **Usage:** Close button for modals/sidebars
- **Component:** `components/organisms/careers/JobsSidebar.tsx`
- **Purpose:** Dismiss or close UI elements

#### `notification.svg`
- **Usage:** Notification or alert icons
- **Component:** `components/organisms/careers/JobsSidebar.tsx`
- **Purpose:** Job alerts or notifications feature

#### `search-check.svg` / `search-check.png`
- **Usage:** Search or verification success
- **Component:** `components/organisms/careers/CareersHero.tsx`
- **Purpose:** Represents talent search or verified candidates

#### `image.svg`
- **Purpose:** Generic image placeholder or icon
- **Usage:** Utility icon

---

## Contact Page Images

### Background & Branding

#### `bg-romega.svg`
- **Usage:** Background branding element
- **Components:**
  - `app/contact/ContactPageClient.tsx`
  - `components/organisms/services/ServicesHero.tsx`
- **Path:** `/images/contact/bg-romega.svg`
- **Purpose:** Roméga brand watermark or decorative background
- **Format:** SVG for scalability
- **Performance Note:** Used with `loading="lazy"` for optimization

#### `bg-letter-send.png`
- **Usage:** Contact form success visual
- **Component:** `components/organisms/contact/ContactForm.tsx`
- **Path:** `/images/contact/bg-letter-send.png`
- **Purpose:** Confirmation illustration after form submission

---

## Footer Images

### Navigation & Branding

#### `btn-up.svg`
- **Usage:** Scroll-to-top button
- **Components:**
  - `components/organisms/layout/Footer.tsx`
  - `components/layout/Footer.tsx`
- **Path:** `/images/footer/btn-up.svg`
- **Purpose:** Quick navigation to page top

#### `rs-footer.svg`
- **Usage:** Footer logo
- **Components:**
  - `components/organisms/layout/Footer.tsx`
  - `components/layout/Footer.tsx`
- **Path:** `/images/footer/rs-footer.svg`
- **Purpose:** Roméga Solutions footer branding

#### `calendar.svg`
- **Usage:** Schedule/booking link
- **Purpose:** Links to scheduling or calendar functionality

#### `facebook.svg`
- **Usage:** Facebook social media link
- **Purpose:** Footer social media icon

#### `linkedin.svg`
- **Usage:** LinkedIn social media link
- **Purpose:** Footer social media icon

---

## Home Page Images

### Hero Section

#### `hero-bg-romega.png`
- **Usage:** Hero section background
- **Components:**
  - `components/organisms/home/HeroSection.tsx`
  - `components/organisms/about/AboutHero.tsx`
- **Path:** `/images/home/hero-bg-romega.png`
- **Purpose:** Main hero background with Roméga branding
- **Performance:** Priority loading for above-the-fold content

#### `hero-rs-text-hd.png`
- **Usage:** Hero headline text (graphic)
- **Component:** `components/organisms/home/HeroSection.tsx`
- **Path:** `/images/home/hero-rs-text-hd.png`
- **Purpose:** Stylized headline text (likely "Roméga Solutions")
- **Note:** Appears twice in component (mobile/desktop variants)

#### `hero-right.png`
- **Usage:** Video poster/fallback image
- **Component:** `components/organisms/home/HeroSection.tsx`
- **Path:** `/images/home/hero-right.png`
- **Purpose:** Fallback poster for hero video

### Icons

#### `search-check.svg` / `search-check.png`
- **Usage:** Feature highlights in hero
- **Component:** `components/organisms/home/HeroSection.tsx`
- **Path:** `/images/home/search-check.svg`
- **Purpose:** Checkmark icon for key value propositions

#### `bag.png` / `bag.svg`
- **Usage:** Job/career related icon
- **Purpose:** Represents employment or career services

#### `books.png`
- **Usage:** Learning/training icon
- **Purpose:** Represents educational services

#### `calendar-days.png`
- **Usage:** Scheduling features
- **Purpose:** Represents time-based or scheduling services

#### `Btn_Arrow - Scroll UP.png`
- **Usage:** Scroll to top button (alternate version)
- **Purpose:** Navigation utility

### Service Cards

#### `webp/talent-acquisition.webp`
- **Usage:** Service category card
- **Component:** `components/organisms/home/ServicesOverview.tsx`
- **Path:** `/images/home/webp/talent-acquisition.webp`
- **Purpose:** Represents Talent Acquisition service

#### `webp/hr-services.webp`
- **Usage:** Service category card
- **Component:** `components/organisms/home/ServicesOverview.tsx`
- **Path:** `/images/home/webp/hr-services.webp`
- **Purpose:** Represents HR Services

#### `webp/sales-and-marketing.webp`
- **Usage:** Service category card
- **Component:** `components/organisms/home/ServicesOverview.tsx`
- **Path:** `/images/home/webp/sales-and-marketing.webp`
- **Purpose:** Represents Sales and Marketing services

### LinkedIn Social Proof

#### `webp/linkedin-post-1.webp`
- **Usage:** LinkedIn feed showcase
- **Component:** `components/organisms/home/LinkedInSection.tsx`
- **Purpose:** Social proof via LinkedIn posts

#### `webp/linkedin-post-2.webp`
- **Usage:** LinkedIn feed showcase
- **Component:** `components/organisms/home/LinkedInSection.tsx`
- **Purpose:** Social proof via LinkedIn posts

#### `webp/linkedin-post-3.webp`
- **Usage:** LinkedIn feed showcase
- **Component:** `components/organisms/home/LinkedInSection.tsx`
- **Purpose:** Social proof via LinkedIn posts

#### `webp/linkedin-post-4.webp`
- **Usage:** LinkedIn feed showcase
- **Component:** `components/organisms/home/LinkedInSection.tsx`
- **Purpose:** Social proof via LinkedIn posts

### Case Study

#### `webp/Case Study Photo.webp`
- **Usage:** Case study section image
- **Component:** `components/organisms/home/CaseStudy.tsx`
- **Path:** `/images/home/webp/Case Study Photo.webp`
- **Purpose:** Visual for case study showcase
- **Note:** Used in both mobile and desktop variants

### Video

#### `webp/WebsiteAssetVideo.mp4`
- **Usage:** Hero video content
- **Component:** `components/organisms/home/HeroSection.tsx`
- **Path:** `/images/home/webp/WebsiteAssetVideo.mp4`
- **Purpose:** Animated hero content
- **Format:** MP4 video
- **Note:** Technically not an image but stored in webp folder

### Team & Background Images

#### `team-bg.png`
- **Usage:** Team section background
- **Component:** `components/organisms/careers/WhyJoinUs.module.css`
- **Note:** Also exists as webp version

#### `team-top.png` / `team-bot.png`
- **Usage:** Team section decorative elements
- **Note:** Also exist as webp versions

#### `bg-mission.png`
- **Usage:** Mission/vision section background
- **Component:** `components/organisms/about/MissionVision.module.css`
- **Note:** Also exists as webp version

#### `bg-intern.png`
- **Usage:** Intern/testimonial section background
- **Component:** `components/organisms/about/TestimonialsCarousel.module.css`
- **Note:** Also exists as webp version

#### `bg-contact.jpg` / `bg-contact.webp`
- **Usage:** Contact section backgrounds
- **Purpose:** Decorative backgrounds for contact sections

### Ratings & Social

#### `full-start.png`
- **Usage:** Filled star rating icon
- **Component:** `components/organisms/about/TestimonialsCarousel.tsx`
- **Path:** `/images/home/full-start.png`
- **Purpose:** Display ratings/reviews

#### `no-star.png`
- **Usage:** Empty star rating icon
- **Component:** `components/organisms/about/TestimonialsCarousel.tsx`
- **Path:** `/images/home/no-star.png`
- **Purpose:** Display ratings/reviews

#### `facebook.png`
- **Usage:** Facebook icon
- **Purpose:** Social media link

#### `linkedinIcon.png` / `linkedinIcon.webp`
- **Usage:** LinkedIn icon
- **Purpose:** Social media link

### Legacy/Alternate Formats

The following exist in both standard and WebP formats in `/images/home/webp/`:

- `about2.webp` / `about2.png`
- `bag.webp`
- `books.webp`
- `calendar-days.webp`
- `cardIcon.webp` / `cardIcon.png`
- `career.webp` / `career.png`
- `case-study.webp` / `case-study.png`
- `cherry.webp` / `cherry.png`
- `christine.webp` / `christine.png`
- `duane.webp` / `duane.png`
- `footerLogo.webp` / `footerLogo.png`
- `handshake.webp` / `handshake.png`
- `intern-person.webp` / `intern-person.png`
- `jem.webp` / `jem.png`
- `jennilyn.webp` / `jennilyn.png`
- `jyrra.webp` / `jyrra.png`
- `logo.webp` / `logo.png`
- `mail.webp` / `mail.png`
- `map.webp` / `map.png`
- `palm.webp` / `palm.png`
- `robbie.webp` / `robbie.png` (also used in talent page CTA)
- `send.webp` / `send.png`
- `service1.webp` / `service1.png`
- `service2.webp` / `service2.png`
- `service3.webp` / `service3.png`

#### `hero-bg-romega.webp`
- **Note:** WebP version of hero background

#### `hero-rs-text-hd.webp`
- **Note:** WebP version of hero headline

#### `Btn_Arrow - Scroll UP.webp`
- **Note:** WebP version of scroll button

### Other Images

#### `arrowRight.svg`
- **Usage:** Navigation arrows or CTAs
- **Purpose:** Directional indicator

#### `smlogo.png`
- **Usage:** Small logo variant
- **Purpose:** Compact branding (possibly for mobile)

#### `top-wave.png`
- **Usage:** Section divider/wave decoration
- **Purpose:** Visual separator

#### `w-bag.png`
- **Usage:** White variation of bag icon
- **Purpose:** Alternate color scheme

---

## Services Page Images

### Feature 1 - Service Details

**Path:** `/images/services/feature-1/`

#### Hero Cards

- `hero-card-1.svg` - Service feature icon
- `hero-card-2.svg` - Service feature icon
- `hero-card-3.svg` - Service feature icon
- `hero-card-4.svg` - Service feature icon

**Usage:** `components/organisms/services/ServicesHero.tsx`  
**Purpose:** Four main service offering icons in hero section

#### Accordion Icons & Backgrounds

- `accordion-icon-1.svg` - HR/Recruitment icon
- `accordion-icon-2.svg` - Training/Development icon
- `accordion-icon-3.svg` - Performance Management icon
- `accordion-icon-4.svg` - Compliance icon
- `accordion-icon-5.svg` - Benefits Administration icon
- `accordion-icon-6.svg` - Employee Relations icon

**Usage:** `components/organisms/services/ServiceDetails.tsx`  
**Purpose:** Icons for expandable service detail sections

- `accordion-bg-1.svg` - Background pattern variant 1
- `accordion-bg-2.svg` - Background pattern variant 2
- `accordion-bg-3.svg` - Background pattern variant 3

**Usage:** `components/organisms/services/ServiceDetails.tsx`  
**Purpose:** Decorative backgrounds for expanded accordion content

### Feature 2 - Culture Fit Diagnostic

**Path:** `/images/services/feature-2/`

#### `rs-services-road-bg.png`
- **Usage:** Roadmap/process background
- **Component:** `components/organisms/services/CultureFitDiagnostic.module.css`
- **Path:** `/images/services/feature-2/rs-services-road-bg.png`
- **Purpose:** Visual roadmap or process flow background
- **Style:** CSS background-image

#### Process Icons

- `rs-services-road-icon-1.png` - Step 1 in process
- `rs-services-road-icon-2.png` - Step 2 in process
- `rs-services-road-icon-3.png` - Step 3 in process
- `rs-services-road-icon-4.png` - Step 4 in process

**Usage:** `components/organisms/services/CultureFitDiagnostic.tsx`  
**Purpose:** Step-by-step process visualization icons

#### `rs-services-cta-icon.svg`
- **Usage:** Call-to-action icon
- **Purpose:** CTA button or section icon

### General Service Icons

#### `services-cta-icon-1.svg`
- **Usage:** Service CTA section
- **Component:** `components/organisms/shared/ContactCTA.tsx`
- **Purpose:** Contact CTA icon

#### `services-cta-icon-2.svg`
- **Usage:** Secondary CTA icon
- **Purpose:** Alternative CTA visual

#### `services-qna-icon.svg`
- **Usage:** Q&A or FAQ section
- **Component:** `components/organisms/services/FAQ.tsx`
- **Purpose:** FAQ section icon

### Navigation & UI

#### `arrow-right.svg`
- **Usage:** Navigation or progression indicator
- **Purpose:** Directional navigation arrows

#### `carousel-arrow-left.svg`
- **Usage:** Carousel/slider previous button
- **Purpose:** Navigate to previous slide

#### `carousel-arrow-right.svg`
- **Usage:** Carousel/slider next button
- **Purpose:** Navigate to next slide

### Testimonials

**Path:** `/images/services/testimonials/`

- `1.png` - Testimonial client/company logo or photo
- `2.png` - Testimonial client/company logo or photo
- `3.png` - Testimonial client/company logo or photo
- `4.png` - Testimonial client/company logo or photo
- `5.png` - Testimonial client/company logo or photo

**Purpose:** Client testimonials, logos, or review imagery for services page

---

## Usage Patterns

### Image Format Strategy

The project uses a **progressive enhancement** approach with image formats:

1. **WebP Format** (`.webp`)
   - Primary format for modern browsers
   - Superior compression and quality
   - Used extensively in `/images/home/webp/` folder
   - Fallback to PNG/JPG for older browsers

2. **SVG Format** (`.svg`)
   - Used for all icons and logos
   - Scalable without quality loss
   - Smaller file sizes for simple graphics
   - Preferred for UI elements

3. **PNG Format** (`.png`)
   - Used for images requiring transparency
   - Fallback format alongside WebP
   - Team photos and complex graphics

4. **JPG Format** (`.jpg`, `.jpeg`)
   - Used for photographic content
   - Some team member photos
   - Smaller than PNG for photos

### Loading Strategies

#### Priority Loading
```typescript
<Image
  src="/images/home/hero-bg-romega.png"
  priority
  loading="eager"
/>
```
- Used for above-the-fold images (hero sections)
- Prevents layout shift
- Better LCP (Largest Contentful Paint) scores

#### Lazy Loading
```typescript
<Image
  src="/images/contact/bg-romega.svg"
  loading="lazy"
/>
```
- Default for below-the-fold images
- Improves initial page load time
- Better performance metrics

### Path Conventions

All images use **absolute paths** from the public directory:

```typescript
// Correct
src="/images/navbar-company-logo.svg"

// Incorrect
src="images/navbar-company-logo.svg"
src="./images/navbar-company-logo.svg"
```

### Component Integration Patterns

#### Direct Image Import (Static)
```typescript
import Image from 'next/image';

<Image
  src="/images/home/hero-bg-romega.png"
  alt="Hero Background"
  width={1920}
  height={1080}
  priority
/>
```

#### Background Image (CSS)
```css
.hero {
  background-image: url('/images/bg-cta.png');
  background-size: cover;
}
```

#### Inline Styles (Dynamic)
```typescript
<div style={{ backgroundImage: "url('/images/bg-cta.png')" }}>
```

#### Data-Driven (Constants)
```typescript
// lib/constants.ts
export const TEAM_MEMBERS = [
  {
    name: 'Robbie',
    role: 'CEO',
    image: '/images/about/IC/IC_CEO_Robbie.png'
  },
  // ...
];

// Component usage
{TEAM_MEMBERS.map(member => (
  <Image src={member.image} alt={member.name} />
))}
```

### SEO & Metadata

#### Open Graph Images
```typescript
// app/page.tsx metadata
export const metadata = {
  openGraph: {
    images: ['/images/og-image.png'],
  },
};
```

**OG Images Reference:**
- `/images/og-image.png` - Homepage
- `/images/og-about.png` - About page
- `/images/og-contact.png` - Contact page
- `/images/og-careers.png` - Careers page
- `/images/og-services.png` - Services page
- `/images/og-talent.png` - Talent page

#### Schema.org Logo
```typescript
// app/page.tsx
organization: {
  logo: 'https://www.romegasolutions.com/images/navbar-company-logo.svg',
}
```

### Accessibility

All images should include descriptive alt text:

```typescript
// Decorative images
<Image src="/images/bg-cta.png" alt="" />

// Meaningful images
<Image 
  src="/images/about/IC/IC_CEO_Robbie.png" 
  alt="Robbie, Chief Executive Officer" 
/>
```

### Performance Optimization

1. **Use WebP** when possible with fallbacks
2. **Lazy load** below-fold images
3. **Priority load** hero/LCP images
4. **Optimize dimensions** - serve appropriately sized images
5. **CDN caching** - leverage Vercel's image optimization
6. **Use SVG** for icons and logos (infinitely scalable)

### CDN & Caching

Images are served through Vercel's CDN with automatic optimization:

```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
}
```

Cache headers configured in `vercel.json`:
```json
{
  "source": "/images/(.*)",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
  ]
}
```

---

## Missing Image References

The following images are **referenced in code** but **not found** in the directory structure. These should be added or references should be removed:

### Careers Page
- `/images/careers/hybrid.svg` - Referenced in `lib/api/jobs.ts`
- `/images/careers/contract.svg` - Referenced in `lib/api/jobs.ts`

### OG Images
- `/images/og-image.png` - Referenced in metadata
- `/images/og-about.png` - Referenced in about page metadata
- `/images/og-contact.png` - Referenced in contact page metadata
- `/images/og-careers.png` - Referenced in careers page metadata
- `/images/og-services.png` - Referenced in services page metadata
- `/images/og-talent.png` - Referenced in talent page metadata

**Action Required:** Create these OG images (1200x630px recommended) for social media sharing.

---

## Best Practices for Other Roméga Projects

### 1. Consistent Naming Convention

Follow this pattern:
- **Descriptive names:** `hero-bg-romega.png` not `img1.png`
- **Hyphen-separated:** Use kebab-case
- **Role prefix for team:** `IC_Role_Name.png` or `Intern_Dept_Name.jpg`
- **Feature folders:** Organize by page/feature (`/careers`, `/services/feature-1`)

### 2. Format Selection Guide

| Use Case | Recommended Format |
|----------|-------------------|
| Logos, Icons | SVG |
| UI Elements | SVG |
| Photos (with transparency) | WebP with PNG fallback |
| Photos (no transparency) | WebP with JPG fallback |
| Backgrounds | WebP or optimized JPG |
| Animations | MP4 (video) or SVG (simple) |

### 3. Organization Structure

```
public/images/
├── [page-name]/          # Page-specific images
│   ├── [feature]/       # Optional sub-organization
│   └── webp/           # WebP versions if needed
├── [icon-name].svg      # Root-level icons
└── [brand-asset].svg    # Global brand assets
```

### 4. Performance Checklist

- [ ] Compress images before adding to repo
- [ ] Create WebP versions for photos
- [ ] Use SVG for icons and logos
- [ ] Add proper alt text for accessibility
- [ ] Use lazy loading for below-fold images
- [ ] Set proper dimensions to prevent layout shift
- [ ] Configure CDN caching headers

### 5. Component Integration

```typescript
// 1. Import Next.js Image component
import Image from 'next/image';

// 2. Use absolute paths from /public
<Image 
  src="/images/page/image-name.webp"
  alt="Descriptive alt text"
  width={800}
  height={600}
  loading="lazy" // or "eager" for above-fold
/>

// 3. For icons, consider inline SVG for better control
import IconName from '@/public/images/icon-name.svg';
<IconName className="icon-class" />
```

### 6. Team Photo Guidelines

When adding team photos:
- **Resolution:** Minimum 400x400px for profiles
- **Format:** WebP with JPG fallback
- **Naming:** `IC_Role_FirstName.ext` or `Intern_Dept_FirstName.ext`
- **Background:** Consistent style (solid color or blurred)
- **Aspect Ratio:** Maintain consistency (1:1 for profile circles)

---

## Quick Reference: Most Commonly Used Images

| Image | Path | Primary Use |
|-------|------|-------------|
| **Logo** | `/images/navbar-company-logo.svg` | Header navigation |
| **Hero BG** | `/images/home/hero-bg-romega.png` | Homepage/About hero |
| **Contact BG** | `/images/contact/bg-romega.svg` | Contact/Services hero |
| **Scroll Up** | `/images/footer/btn-up.svg` | Footer scroll button |
| **Footer Logo** | `/images/footer/rs-footer.svg` | Footer branding |
| **Search Check** | `/images/home/search-check.svg` | Hero checkmarks |
| **Calendar** | `/images/icon-calendar-days.svg` | Booking features |
| **Send Icon** | `/images/icon-send.svg` | Form submissions |
| **Menu Icon** | `/images/icon-menu.svg` | Mobile navigation |

---

## Conclusion

This guide provides a comprehensive reference for all image assets used in the Roméga Solutions website. When implementing similar features in other Roméga Studios projects:

1. **Maintain consistency** in naming and organization
2. **Optimize for performance** using appropriate formats
3. **Follow accessibility standards** with proper alt text
4. **Leverage modern frameworks** like Next.js Image optimization
5. **Document usage** to maintain clarity for future development

For questions or additions to this guide, please update this document and maintain version history.

---

**Related Documentation:**
- [BEM Implementation Guide](./BEM_IMPLEMENTATION_GUIDE.md)
- [Design System](./DESIGN_SYSTEM.md)
- [Lighthouse Optimization](./LIGHTHOUSE_100_OPTIMIZATION.md)
- [Vercel CDN Setup](./VERCEL_CDN_SETUP.md)
