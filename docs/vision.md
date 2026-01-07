# Vision — FloryderBot 4.0

## Purpose
FloryderBot 4.0 helps Discord communities explore NBA data and learn how statistical signals form. The bot focuses on transparency and education, not on issuing bets or financial advice.

## High-level goals
- Provide clear, explainable statistical picks and trends
- Teach users how signals are formed and what they mean
- Maintain rigorous safety and non-gambling posture
- Collect feedback to improve explanations and signal quality over time

## Scope (V1)
- NBA games, team & player stats, injury flags, and timeline-based signals
- Public servers with opt-in channels for picks
- No real-money betting advice; all outputs are informational

## Philosophy
- If we can’t explain a pick in plain language and with supporting data, we don’t recommend it.
- Transparency over opacity: show the signals and how confidence was computed.
- Conservative-by-default: prefer safe modes and require explicit admin opt-in for higher-risk modes.

## Safety rules & non-gambling stance
- All pick text must include a clear, visible disclaimer: "Not betting advice."
- Do not provide odds, stake recommendations, bankroll guidance, or gambling strategy.
- Avoid imperative language that instructs users to place money (e.g., "bet", "wager"); use educational phrasing (e.g., "statistical suggestion", "observed edge").
- Provide users a way to opt-out or disable picks in their server.

## Success metrics
- Accuracy of picks (tracked privately in telemetry)
- User engagement with explanations and trend tools
- Quality of user feedback (hit/miss + reason tags)

## Roadmap (high level)
- Design & docs (current)
- V1: CLI + Discord bot skeleton, /pickoftheday, confidence display
- V2: Feedback loop + lightweight learning from hits/misses
- V3: Expanded sources, model improvements, hosted deployment
