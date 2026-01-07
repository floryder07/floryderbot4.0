# Data Sources — FloryderBot 4.0

This doc lists planned data sources, priorities, and usage guidance.

## Minimum required data
- Game schedule & times (timezone-aware)
- Team box score aggregates (offense/defense efficiency)
- Player box scores and minutes
- Injury/status updates (PA, probable, out)
- Basic rest/fatigue info (back-to-back)

## Recommended sources (priority)
1. Official/primary stats
   - NBA stats endpoints or partner APIs (if available)
   - Public endpoints with full box score and player splits
2. Play-by-play / advanced stats
   - Third-party providers (SofaScore, StatMuse, Basketball-Reference scrapes)
3. Injury and news
   - Rotowire, official team reports, Twitter feeds (filtered)
4. Aggregators (fast fallback)
   - Sportdata.io, Sportradar (commercial), other paid APIs

## Example sources & notes
- NBA.com / stats.nba.com — rich, but rate-limited and subject to change
- Basketball-Reference — reliable historical data (scraping may be required)
- SofaScore / StatMuse — good for injury + live updates (check TOS)
- Twitter streams — for real-time injury notes; must be verified and filtered
- Optional: odds feeds for market context (V2) — only use to show market awareness, not to recommend stakes

## Data priorities & hygiene
- Primary: accuracy (injury & lineup correctness)
- Secondary: latency (how fresh the data is)
- Tertiary: coverage (completeness across players/teams)

## Polling vs webhooks
- Polling (V1): scheduled pulls every 1–5 minutes for live windows (depends on provider limits)
- Webhooks: preferred when supported (lower latency and fewer rate issues)

## Caching & storage
- Cache raw API responses for 24–72 hours, persist normalized derived metrics (trend windows) longer.
- Store:
  - raw_game_data (for audit)
  - derived_trend_metrics (last5/last10/15)
  - pick_history + feedback (private telemetry DB)
- Use a small relational DB (SQLite for early dev, Postgres for production) and a fast cache (Redis) for ephemeral data.

## Data fields to normalize
- Game time (ISO8601)
- Team key (standardized abbrev)
- Player key (unique ID)
- Minutes, usage, points, rebounds, assists, advanced metrics (offRTG/defRTG if available)
- Injury status (enum: probable, questionable, out, day-to-day)

## Privacy & legal
- Respect provider terms of service.
- Do not redistribute paid data.
- Keep user telemetry private by default; surface aggregated stats only if server/admin has opted in.
