# Architecture — FloryderBot 4.0

This document proposes a concrete, pragmatic architecture for FloryderBot 4.0, focused on a safe, auditable V1 that is easy to develop, test, and operate.

High-level goals
- Predictable, rule-based confidence engine (auditable)
- Clean separation: data ingestion → signal engine → decision/compose → Discord delivery
- Safe defaults (slash-commands, interaction-only UX, clear disclaimers)
- Easy local dev (SQLite) and smooth production upgrade (Postgres + Redis)

---

## Recommended stack (primary — production-ready)
- Language: TypeScript (Node.js 18+)
- Discord library: discord.js v14 (slash commands & interactions)
- HTTP/server: Fastify or express (admin endpoints / webhooks)
- DB: SQLite for dev, Postgres for production
- ORM: Prisma (Type-safe + good migrations)
- Cache & job queue: Redis (caching, rate-limit, BullMQ for background jobs)
- Scheduler: node-cron or BullMQ repeatable jobs
- Container: Docker
- CI/CD: GitHub Actions
- Monitoring: Sentry for errors, Prometheus/StatsD for metrics (optional)
- Hosted on: Render / Fly / Railway / AWS Fargate (choose based on budget)

Alternate (Python) stack
- Language: Python 3.10+
- Discord lib: discord.py (interactions API)
- DB: SQLModel or SQLAlchemy + Alembic
- Queue: RQ / Celery + Redis

Why TypeScript?
- Good ecosystem for Discord (discord.js), strong typing for rules/engine, better DX for frontend-like dev teams, easier Prisma integration.

---

## High-level components & responsibilities
- Bot process (Node)
  - Interaction handler (slash commands)
  - Event handlers (presence, guild join, config changes)
  - Posting/embeds builder
- Data ingestion & normalization
  - Source adapters (NBA API, SofaScore, news/injury feeds)
  - Normalizer module to common schema
  - Polling workers or webhooks
- Signal/Confidence Engine
  - Rule-based computation (trend_score, matchup_score, injury_score, recency_boost)
  - Exposes API used by pick generator
  - Unit-tests for every rule
- Pick generator & orchestrator
  - Builds pick payload (score breakdown, explanation text, badges)
  - Applies server policy (safe/normal/moonshot)
  - Cooldown and publishing policy
- Persistence & telemetry
  - Pick history, feedback (hit/miss + comment), raw data snapshots
  - Audit logs for each pick (scores + inputs)
- Admin HTTP endpoints (small)
  - Manage server config (channels, schedule)
  - Manual override endpoint (auth-protected)
- Background workers
  - Polling data, refresh caches, scheduled picks, feedback processing
- Observability
  - Error tooling (Sentry), basic metrics, request logging

---

## Data flow (sequence)
1. Scheduler or manual trigger fires for a pick window.
2. Ingestion worker requests latest data from adapters (caching responses).
3. Normalizer transforms provider responses to canonical shapes.
4. Signal engine computes sub-scores (trend, matchup, injuries) for candidates.
5. Pick generator ranks candidates, computes total score and confidence badge.
6. Moderation rules applied (cooldowns, channel rules, admin overrides).
7. Bot posts pick as a Discord interaction response or scheduled message.
8. Persist pick payload and raw input for audit.
9. Users optionally provide /feedback which updates telemetry and influences tuning.

---

## Command & interactions model
- Use slash commands and message components (buttons, select menus). Avoid reliance on MESSAGE_CONTENT intent.
- Commands:
  - /pickoftheday [mode]
  - /parlay [legs]
  - /trend <team|player> <window>
  - /feedback <pick_id> (hit|miss)
  - Admin: /set-channel, /set-schedule, /override-pick
- Interaction examples:
  - Post pick as embed + action buttons: [Mark Hit] [Mark Miss] [Explain Confidence]
  - Use ephemeral responses for admin-only actions

Intents:
- GUILDS — required
- GUILD_MESSAGES — for message components (not MESSAGE_CONTENT)
- GUILD_MEMBERS — only if role-based permissions needed
Note: MESSAGE_CONTENT is restricted by Discord and not necessary for slash commands.

---

## Persistence model (suggested tables)
- servers (id, guild_id, config_json)
- channels (id, guild_id, purpose)
- picks (id, pick_time, server_id, payload_json, computed_total, sub_scores_json, status)
- feedback (id, pick_id, user_id, result, comment, created_at)
- raw_game_data (id, source, game_time, raw_payload)
- users (id, discord_id, preferences)
- audit_logs (id, action, actor, payload, ts)

Use Prisma schema to model these. Keep raw_payload for reproducibility.

---

## Caching & rate-limiting
- Redis caches normalized game data and rate-limits per-channel / per-command.
- Use Redis TTLs aligned with data freshness (e.g., schedule: 24h; live stats: 60s).
- Use Redis for job deduplication and repeatable jobs.

---

## Background jobs & scheduler
- Polling jobs: run every N seconds/minutes (respect provider rate limits).
- Scheduled pick job: cron per-server (e.g., daily at 12:00 local).
- Use BullMQ (Redis-backed) to ensure retries, backoff, visibility.

---

## Deployment & hosting options
- Small scale / cheapest: Railway or Render (managed Postgres + Redis)
- Container-first: Docker + Fly / DigitalOcean App Platform
- Production with scale: AWS ECS/Fargate or EKS (use managed Postgres and Redis)
- Local dev: docker-compose with Postgres, Redis

Recommended initial target: Render or Railway — simple, auto-deploy from GitHub.

---

## CI/CD (GitHub Actions)
- Workflows:
  - lint.yml — run eslint / prettier
  - test.yml — run unit tests (Jest), prisma generate, typecheck
  - build.yml — build and push docker image (optionally to registry)
  - deploy.yml — deploy to chosen host (Render/GitHub Deploy)
- Protect main branch with tests & lint required.

---

## Security & secrets
- Never commit tokens. Use:
  - .env for local dev (gitignored)
  - GitHub Secrets for CI & Deploy
- Rotate bot token periodically.
- Use least-privilege for DB users.
- Validate / sanitize data from third parties.
- Ensure admin endpoints require signed tokens (JWT) or GitHub App OAuth.

---

## Observability & logging
- Structured logs (JSON) to stdout (platform captures them).
- Capture exceptions in Sentry.
- Track metrics: picks created, feedback rates, latency, errors.
- Keep raw payload retention policy (e.g., 90 days) and prune older raw data.

---

## Testing strategy
- Unit tests for:
  - Confidence engine rules (deterministic)
  - Normalizers per data source
  - Pick generator output text templates
- Integration tests:
  - Simulated ingestion + engine runs (use stored fixtures)
- E2E:
  - A test Discord server with test bot for command flows (optional)

---

## Folder structure (recommended)
```
bot/
├── commands/             # slash-command handlers (one file per command)
├── core/                 # bot bootstrap, interaction dispatcher
├── data/                 # adapters & normalizers (sources)
├── engine/               # confidence engine, scoring rules
├── jobs/                 # background job definitions (polling, scheduled picks)
├── services/             # DB, cache, external API clients
├── utils/                # helpers, text templates, formatting
├── web/                  # minimal admin server (optional)
├── tests/
prisma/
docker/
.env.example
package.json
tsconfig.json
```

---

## Dev environment & scripts (example)
- env vars (sample)
  - DISCORD_TOKEN
  - DATABASE_URL
  - REDIS_URL
  - NODE_ENV
  - SENTRY_DSN (optional)
- npm scripts (suggested)
  - dev: nodemon + ts-node for local dev
  - build: tsc
  - start: node dist/index.js
  - lint: eslint
  - test: jest
  - format: prettier --write
  - prisma:migrate
- Docker
  - Provide Dockerfile and docker-compose.dev.yml with Postgres + Redis + app service

---

## Example environment variables (paste into .env.example)
```
DISCORD_TOKEN=your-bot-token
DISCORD_CLIENT_ID=your-client-id
DATABASE_URL=postgresql://user:pass@localhost:5432/floryder
REDIS_URL=redis://localhost:6379
SENTRY_DSN=
APP_ORIGIN=https://your-host.example
LOG_LEVEL=info
```

---

## Developer checklist / immediate next steps
1. Create repository, push design docs (done).
2. Initialize TypeScript project and install dependencies:
   - discord.js, prisma, @prisma/client, fastify (optional), bullmq, ioredis, node-cron, dotenv, winston/pino, jest, eslint, prettier.
3. Add Prisma schema and run `prisma migrate dev` (SQLite for dev).
4. Implement data adapters & normalizers with fixtures for tests.
5. Implement the confidence engine with full unit test coverage.
6. Implement /pickoftheday command then staged rollout to one test server.
7. Deploy using Docker and a small managed host (Render/Railway).

---

## Example packages (TypeScript)
- discord.js
- @discordjs/rest
- @prisma/client, prisma
- ioredis, bullmq
- node-cron
- fastify (or express)
- pino or winston (logging)
- jest, ts-jest (testing)
- eslint, prettier, husky (pre-commit)

---

## Appendix — Sample pick generation workflow (text)
- Worker triggered (cron or API)
- Query cached candidate list (games starting in next window)
- For each candidate:
  - pull normalized stats
  - compute trend_score, matchup_score, injury_score, recency_boost
  - compute total score and convert to badge per mode
  - build explanation text with supporting values
- Select top candidate(s) meeting threshold
- Post embed to configured channel with "Not betting advice" disclaimer
- Persist audit record and open buttons for /feedback

---

If you'd like, I can:
- scaffold the TypeScript project structure and give exact package.json + tsconfig + sample command handler files,
- or generate a Dockerfile + docker-compose.dev.yml and GitHub Actions workflows next.

Which do you want next? (Reply "Next: scaffold" to get the repo scaffold files, or "Next: ci" for CI/CD + Docker.)
