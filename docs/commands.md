# Commands — FloryderBot 4.0

This document lists planned user-facing commands for V1 and notes on parameters and permissions.

## Public commands (user-facing)

### /pickoftheday
- Description: Provide one prioritized statistical pick for today.
- Options:
  - mode: enum [safe, normal, moonshot] (default: normal)
  - region/timezone: optional (affects schedule display)
- Output:
  - pick summary (team/player + market type)
  - confidence badge (🟢 / 🟠 / 🔴)
  - short explanation (2–3 lines)
  - supporting numbers / trend windows
  - cooldown: 24 hours per channel by default
- Permissions: everyone (server config to allow/disable)

Example:
/pickoftheday mode:safe

---

### /parlay
- Description: Experimental multi-leg suggestion (2–3 legs).
- Options:
  - legs: integer (2–3)
  - mode: enum [safe, normal]
- Output:
  - legs with individual confidence
  - combined explanation (why legs were chosen)
  - warning / non-betting disclaimer
- Permissions: restricted to configured channels or roles

---

### /trend
- Description: Show trend statistics for a team or player.
- Options:
  - scope: enum [team, player] (required)
  - id/name: string (team or player identifier)
  - window: enum [5, 10, 15] (default: 5)
- Output:
  - raw stats for the selected window (offense, defense, efficiency)
  - delta vs. season average
  - short interpretation

Example:
/trend scope:team id:"LAL" window:10

---

### /confidence
- Description: Explain how a confidence badge was calculated for a given pick or team.
- Options:
  - reference_id: id of recent pick or team
- Output:
  - metric breakdown (trend, matchup, injuries, recency)
  - numeric score and thresholds used

---

### /feedback
- Description: Let users mark a suggested pick as hit/miss and optionally add comment.
- Options:
  - pick_id: required
  - result: enum [hit, miss]
  - comment: optional string (why)
- Usage:
  - Saves feedback to a private telemetry store (or local DB)
  - Optional opt-in to share aggregated feedback publicly

---

### /stats
- Description: Returns quick box-score or stat lines for a player or team.
- Options:
  - scope: enum [player, team]
  - id/name: string
  - period: enum [last5, last10, season]
- Output:
  - tabular stats and a short note on recent changes

---

### /help
- Description: Usage help and basic philosophy/disclaimer.

---

## Admin commands

### /set-schedule
- Set daily pick time per server (timezone-aware).

### /set-channel
- Limit picks to specific channels.

### /import-source
- Add or configure a data source (admin-level).

### /override-pick
- Admin-only: post an admin-selected pick (always labeled admin override).

---

## Messaging & UX rules
- Every pick must include:
  - Timestamp and timezone
  - Confidence badge and short explanation
  - "Not betting advice" disclaimer
- Keep text concise — mobile-first layout.
- Use embeds where supported (title, fields, footer).
