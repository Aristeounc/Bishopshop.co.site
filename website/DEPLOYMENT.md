# Deployment Guide — Abacus Website

## Overview

The Abacus website is optimized for deployment on Vercel, which provides:
- Automatic deployments from git
- Edge functions for server-side rendering
- Incremental Static Regeneration (ISR)
- Built-in analytics and monitoring

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Domain configured (bishopshop.co.site)

## Deployment Steps

### 1. Connect Repository to Vercel

```bash
# From Vercel dashboard:
# 1. Click "New Project"
# 2. Select the bishopshop.co.site GitHub repository
# 3. Configure project settings
```

### 2. Environment Variables

Set these in Vercel project settings:

```
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX  (if using Google Analytics)
```

### 3. Deploy

```bash
# Automatic: Push to main branch
git push origin main

# Manual: Deploy from Vercel dashboard
# Visit vercel.com and click "Deploy"
```

## Performance Optimization

### Images

- All images are optimized automatically by Next.js
- Formats: AVIF (best) → WebP → JPEG (fallback)
- Lazy loading enabled by default

### Fonts

- Google Fonts are preloaded in `app/layout.tsx`
- Subset to Latin characters only for smaller file size

### CSS & JS

- Tailwind CSS is tree-shaken (unused styles removed)
- JavaScript code is split per route
- Only necessary code loads per page

## Monitoring

### Core Web Vitals

Monitor these metrics in Vercel Analytics:
- **LCP (Largest Contentful Paint)** - Target: < 2.5s
- **FID (First Input Delay)** - Target: < 100ms
- **CLS (Cumulative Layout Shift)** - Target: < 0.1

### Tools

- Vercel Analytics (built-in)
- Google Lighthouse (chrome devtools)
- WebPageTest (webpagetest.org)

## Content Updates

### Blog Posts

1. Create a new `.md` file in `content/blog/`
2. Add frontmatter (title, description, date, etc.)
3. Commit and push to main
4. Vercel auto-rebuilds and deploys

### Home Page Content

1. Edit section components in `components/sections/`
2. Commit and push
3. Automatic rebuild and deploy

## SEO Checklist

- ✅ Sitemap.xml auto-generated
- ✅ robots.txt in place
- ✅ Open Graph meta tags set
- ✅ Twitter Card meta tags set
- ✅ Structured data (Schema markup) — can be added per page
- ✅ Mobile responsive
- ✅ Fast load times

## Troubleshooting

### Build Fails

```bash
# Check for errors locally first
npm run build

# Review Vercel build logs
# Settings → Deployments → Failed → View Build Log
```

### Slow Performance

```bash
# Analyze bundle size
npm run build

# Check Vercel Analytics
# Production → Real Experience Monitoring
```

### 404 Errors on Blog Posts

Ensure markdown files are in `content/blog/` with correct naming.

## Rollback

If a deployment has issues:

1. Vercel dashboard → Deployments
2. Find previous stable deployment
3. Click "Promote to Production"

Or revert git:

```bash
git revert HEAD
git push origin main
```

## Next Steps

### Phase 5: Advanced Features

- Add database integration (Supabase)
- Implement user authentication
- Add API routes for form submissions
- Set up email notifications (SendGrid)

### Performance

- Add image optimization library (sharp)
- Implement edge caching strategies
- Add service worker for offline support

### Analytics

- Integrate Google Analytics
- Set up conversion tracking
- Monitor user behavior with PostHog or Segment
