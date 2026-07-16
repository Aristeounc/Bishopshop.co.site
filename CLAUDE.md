# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the marketing and product website for **Abacus** (formerly Peitho/Attune AI) — a conversation gym for mastering high-stakes communication. The site combines marketing content, product showcase, community features, and educational resources under one domain.

**Domain**: bishopshop.co.site  
**Company**: Bishop Shop Enterprises LLC  
**Package/Brand Names**: Abacus, Peitho (legacy)

## Architecture

### Current Structure
- **index.html** — Main landing page; single-page static HTML with embedded CSS and custom JavaScript
- **android-app/** — React Native test/preview app for showcasing the mobile product
- **gtm/** — Go-To-market strategy and launch planning documents (reference only)
- **docs/** — Static pages (privacy.html, terms.html, website-terms.html, ip-notice.html)
- **assets/** — SVG logos and brand graphics (peitho-app-icon.svg, peitho-app-icon-minimal.svg)

### Design System
**Color Palette** (CSS variables in index.html):
- Primary: `--purple: #8E44AD`, `--purple-dark: #6C3483`, `--purple-light: #A569BD`
- Accent: `--gold: #D4AF37`, `--gold-dark: #B8961E`
- Neutral: `--tan: #F5EFE3`, `--tan-dark: #E8DEC8`
- Text: `--ink: #0D1117`, `--ink-soft: #1c2535`, `--white: #FAFAF8`

**Typography**:
- Display: `Bebas Neue` (headline wordmark, bold)
- Serif: `DM Serif Display` (elegant accents)
- Body: `DM Sans` (readable sans-serif for content)

**Animations**:
- Global easing: `cubic-bezier(0.16, 1, 0.3, 1)` for modern feel
- Custom cursor with tracking (gold dot + ring)
- Grid background animation
- Scroll-triggered fade-up animations

### Key Features
1. **Hero Section** — Full-height with animated background grid, headline, CTA buttons, phone mockup
2. **Navigation** — Fixed header with logo, links, and glass-morphism scroll effect
3. **Custom Cursor** — Replaces default; scales on hover
4. **Interactive Elements** — Buttons with shine effects, hover states, smooth transitions
5. **Stats Display** — Key metrics at bottom of hero
6. **Responsive Layout** — Grid-based for desktop, adapts for mobile

## Development

### Local Development
Since the site is currently static HTML, simply open `index.html` in a browser:
```bash
# Option 1: Drag index.html into browser
# Option 2: Serve locally with Python
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Styling & Customization
All styles are embedded in `<style>` tags within index.html. To modify:
1. Edit CSS variables in `:root { ... }`
2. Update component classes (`.hero`, `.nav-links`, etc.)
3. Modify font imports in `<link href="...fonts.googleapis.com..." />`
4. Test responsive breakpoints by resizing browser

### Adding Sections
Follow the existing pattern:
1. Create a new `<section class="section-name">` with semantic HTML
2. Add styles to `<style>` block with BEM naming (e.g., `.section-name`, `.section-name__element`, `.section-name__element--modifier`)
3. Use CSS variables for colors and spacing
4. Animate with keyframes and `animation` property for consistency

### SEO & Meta Tags
Located at top of `<head>`:
- **Open Graph** tags for social media sharing
- **Twitter Card** metadata
- **Structured Data** (JSON-LD) for schema.org SoftwareApplication
- **Canonical URL** for search engines
- Update these when adding new sections or changing messaging

### Security
CSP headers are enforced via meta tags (GitHub Pages limitation):
- Scripts: self + unsafe-inline (necessary for embedded styles)
- Styles: self + unsafe-inline + fonts.googleapis.com
- Fonts: fonts.gstatic.com
- Images: self + data: + https:
- No external CDNs or trackers loaded

## Android App (Preview/Testing)

The `android-app/` directory contains a React Native application for previewing the Abacus mobile product within a web browser or on Android devices.

### Commands
```bash
cd android-app

# Web preview (port 8080)
npm run web

# Production build
npm run web:build

# Android development
npm run android

# Tests
npm test
npm run test:coverage

# Linting & type checking
npm run lint
npm type-check
```

### Structure
- `src/` — React Native components and logic
- `android/` — Android native platform config
- `web/` — Web-specific adaptations
- `__tests__/` — Unit and integration tests

## Commands

### Website
```bash
# View the site (static HTML)
python3 -m http.server 8000
# Visit http://localhost:8000

# No build step required; index.html is complete and self-contained
```

### Android App
```bash
cd android-app

# Development
npm install              # Install dependencies
npm run web             # Start Webpack dev server (port 8080)
npm run lint            # ESLint across .ts/.tsx
npm run type-check      # TypeScript type checking
npm test                # Jest unit tests
npm run test:coverage   # Coverage report

# Production
npm run web:build       # Webpack production bundle
npm run build:release   # Android release APK
```

## Conventions

### HTML & CSS
- **BEM naming** for styles: `.block__element--modifier`
- **CSS variables** for theming (colors, spacing, easing)
- **Semantic HTML** (section, nav, header, footer where appropriate)
- **Inline SVG** preferred over img tags for logos and icons (control, no extra requests)
- **No frameworks** — vanilla HTML/CSS/JS for simplicity and performance

### Git & Commits
- Branch naming: `feature/<name>`, `fix/<name>`, `docs/<name>`
- Commit messages: Clear, present tense ("Add hero section" not "Added")
- Keep content changes separate from style/structure changes

### Performance
- Index.html is single-file, no external dependencies (performance critical for landing page)
- Animations use CSS (GPU-accelerated) not JavaScript
- Grid background uses CSS patterns, not images
- No tracking libraries loaded (privacy-first)

## Known Constraints

1. **GitHub Pages** — Site is hosted on GitHub Pages, so:
   - No server-side rendering
   - Security headers must be in `<meta>` tags, not HTTP headers
   - `.html` extension required (no clean URLs)

2. **Static Site** — Current implementation is pure HTML/CSS/JS:
   - No build process or package manager
   - No component reuse (copy-paste sections as needed)
   - No dynamic content loading

3. **Android App** — Separate Node.js project:
   - Requires `node` + `npm` to develop
   - Android builds need Android SDK and Gradle

## Redesign Roadmap

When redesigning, consider:
- **Branding**: Update color palette, typography, logo throughout
- **Content Sections**: Add features, testimonials, pricing, blog, leaderboards
- **Performance**: Minimize HTTP requests, optimize images, use Web Fonts efficiently
- **Mobile**: Current design is responsive; test on real devices
- **Accessibility**: WCAG 2.1 AA standard; ensure color contrast, keyboard nav, alt text
- **SEO**: Update meta tags, add structured data for each new section, maintain canonical URLs
- **Community**: Add leaderboards, user testimonials, blog integration if needed

## Reference Files

- **PROJECT.md** (in main repo) — Mobile app architecture and philosophy
- **gtm/01-ICP-and-offer.md** — Target audience and value proposition
- **gtm/04-asset-checklist.md** — Marketing assets and copy guidelines
- **index.html** — Full website source (one file; start here for understanding)

## Useful Resources

- Google Fonts: https://fonts.google.com (Bebas Neue, DM Serif Display, DM Sans)
- Color tools: https://color.adobe.com, https://www.tinter.app
- Animation inspiration: https://animate.style, https://easings.net
- SEO & meta tags: https://ogp.me, https://schema.org
