# 🤖 FloryderBot 4.0

**FloryderBot 4.0** is an NBA analytics and learning Discord bot that provides statistical insights, trend analysis, and concise explanations to help users understand game data.

> ⚠️ **Not betting advice**  
> This bot provides statistical analysis only. All betting involves risk. Use responsibly.

---

## Quick overview (V1)
- NBA-only analysis (team & player level)
- Modes: Safe / Normal / Moonshot
- Trend windows: Last 5, Last 10, 15-game average
- Confidence indicators: 🟢 (High) / 🟠 (Medium) / 🔴 (Low)
- Transparent pick explanations with supporting stats
- Cooldowns and admin bypass
- Learning loop: user hit/miss feedback improves future behavior

---

## Repo layout (starter)
```
floryderbot4.0/
├── README.md
├── docs/
│   ├── vision.md
│   ├── commands.md
│   ├── confidence-system.md
│   └── data-sources.md
├── bot/
│   ├── commands/
│   ├── utils/
│   └── core/
├── .gitignore
└── LICENSE
```

---

## Getting started (developer)
1. Create the GitHub repo named `floryderbot4.0` and add these files.
2. Pick an architecture (TypeScript + discord.js recommended for production; Python + discord.py is an option).
3. Add secrets in `.env` or GitHub Actions Secrets (do not commit tokens).
4. Implement V1 commands in `bot/commands`.

Suggested initial commands:
- `/pickoftheday` — single daily pick with confidence + explanation
- `/parlay` — (experimental) small multi-leg suggestion
- `/trend team|player` — show trend window stats
- `/feedback` — record hit/miss & note

---

## Philosophy & safety
See docs/vision.md for mission, scope, and non-gambling stance. See docs/confidence-system.md for how confidence is derived and presented.

---

## Contributing
- Use small, focused PRs
- Add tests for data transformations and confidence calculations
- Keep message text clear and non-prescriptive (no betting instructions)

---

## Status
Design & planning phase. Paste the docs from /docs to lock down rules before coding.
