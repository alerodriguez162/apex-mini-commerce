# Orilla — Mini E-Commerce

Mini e-commerce for **Apex Bench — Week 2: Advanced Frontend Engineering**.

Built with an AI-assisted workflow. Courses in focus: *Advanced Features in React* and *React Performance Playbook*.

## Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite (`better-sqlite3`)

## Daily plan

| Day | Date | Branch | Focus |
|-----|------|--------|--------|
| 1 | 10 Aug | `w2-day-1-scaffold` | Monorepo, health API, branded storefront shell |
| 2 | 11 Aug | `w2-day-2-catalog-api` | Product catalog REST API + seed |
| 3 | 12 Aug | `w2-day-3-storefront` | Catalog UI, detail, cart context & hooks |
| 4 | 13 Aug | `w2-day-4-cart` | Cart persistence, checkout, orders |
| 5 | 14 Aug | `w2-day-5-performance` | Search, code splitting, polish, Vercel |

Workflow: one branch per day → merge into `main` at end of day.

## Getting started

```bash
npm install
npm run dev:server   # http://localhost:3001
npm run dev:client   # http://localhost:5173
```

Health check: `GET http://localhost:3001/api/health`
