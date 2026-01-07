# Confidence System — FloryderBot 4.0

This doc defines how the bot assigns confidence badges (🟢 / 🟠 / 🔴) and how those badges map to signals and messaging.

## Goals
- Make confidence interpretable and reproducible.
- Use simple, auditable rules (no opaque model in V1).
- Provide reasons for each confidence level.

## Inputs (examples)
- Trend delta: change in relevant metric over windows (last5, last10, 15-game average)
- Signal count: number of independent signals aligned (e.g., offensive rating trend + matchup advantage)
- Injury impact: presence of key player injuries or rest
- Recency weight: more weight to last 5 games vs season average
- Market clarity (optional): is the market likely to incorporate the signal? (experimental)

## Score computation (V1 rule-based)
1. Compute sub-scores (each 0–100):
   - trend_score (0–100): based on relative improvement/worsening in target metric
   - matchup_score (0–100): matchup advantage/disadvantage derived from opponent metrics
   - injury_score (0–100): 0 if adverse injury, 100 if favorable/no adverse injuries
   - recency_boost (0–20): extra weight if last5 strongly diverges from season
2. Weighted total score:
   total = 0.4 * trend_score + 0.3 * matchup_score + 0.2 * injury_score + 0.1 * recency_boost
   total normalized to 0–100

## Confidence thresholds (V1)
- 🟢 High confidence: total >= 75
  - Requirements:
    - At least 2 independent signals aligned (e.g., trend + matchup)
    - No major adverse injuries
- 🟠 Medium confidence: 50 <= total < 75
  - Requirements:
    - 1–2 signals aligned, or stronger trend but weaker matchup/injury
- 🔴 Low confidence: total < 50
  - Requirements:
    - Weak or conflicting signals, or high uncertainty (injuries, small sample)

## Messaging templates
- High (🟢):
  - "🟢 High confidence — Reason: [short reason]. Supporting stats: [trend window numbers]."
- Medium (🟠):
  - "🟠 Medium confidence — Reason: [short reason]. Caveats: [caveats]."
- Low (🔴):
  - "🔴 Low confidence — Reason: [short reason]. Not recommended for risk exposure."

Always append: "Not betting advice."

## Cooldowns & modes
- Default cooldown per channel:
  - pickoftheday: 24 hours
  - parlay: 48 hours (experimental)
- Modes:
  - Safe: increase thresholds (High: >= 80, Medium: >=60)
  - Normal: default thresholds
  - Moonshot: allow picks with weaker signals and mark as high-risk (explicit opt-in per server)

## Feedback & learning
- Record feedback (hit/miss + comment) with the pick metadata.
- Periodically (weekly) compute:
  - Hit rates by confidence bucket
  - Signal precision (which signals correlated with hits)
- Use these metrics to tune weights and thresholds.

## Auditability
- Every pick payload must include:
  - computed_total_score
  - each sub-score and the thresholds used
  - the exact stats used (trend window numbers)
- Store raw data and derived fields for debugging.
