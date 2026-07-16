# Abacus Website

Modern marketing website for Abacus — "The Conversation Gym"

## Tech Stack

- **Next.js 15** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Supabase** — Database + authentication (optional)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to see your changes.

## Project Structure

```
website/
├── app/              # Next.js App Router (pages)
├── components/       # Reusable React components
│   ├── layout/      # Header, Footer, Navigation
│   └── sections/    # Page sections (Hero, Pricing, etc.)
├── lib/             # Utilities, constants, types
│   ├── constants/   # Colors, scenarios, pricing
│   └── utils/       # Helper functions
├── content/         # Static content (blog, scenarios)
├── public/          # Assets (images, icons)
└── styles/          # Global CSS
```

## Getting Started

1. Create design system and branding (Phase 3)
2. Implement hero section with "wow" interactions (Phase 5)
3. Build scenario showcase cards (Phase 5)
4. Add community and leaderboard features (Phase 7)
5. Publish content and optimize (Phase 8)

See the root `DESIGN_BRIEF.md` for full redesign strategy.
