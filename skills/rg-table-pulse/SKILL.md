---
name: rg-table-pulse
description: "Analyze campaign health, player engagement, spotlight balance, open narrative threads, and pacing trends across recent sessions."
argument-hint: "[recent session range, e.g. 'Sessions 10-14' or blank for latest]"
---

# Campaign Table Pulse (`rg-table-pulse`)

`rg-table-pulse` takes the pulse of the campaign across a span of recent sessions. It measures whether the game is delivering on its intended tone and pillars, audits character spotlight balance, and tracks open story threads so the DM can re-align future prep.

## When to Use

- Every 3–5 sessions, at the conclusion of a story arc, or whenever table momentum feels sluggish or unbalanced.
- To detect if a player character has been overlooked in recent sessions.

## Core Pulse Metrics

1. **Spotlight Balance:**
   - Did each player character receive meaningful agency, dramatic choices, or backstory integration recently?
   - Identify players who have taken a backseat for multiple sessions and suggest tailored hooks.
2. **Pillars of Play Reality Check:**
   - Compare actual gameplay time against the target balance defined in `CAMPAIGN_FRAMEWORK.md` (e.g. Target: 40% Social / 30% Combat / 30% Exploration vs. Observed Reality).
3. **Open Threads & Mystery Velocity:**
   - How many unanswered questions or open quest hooks are currently active?
   - Are players overwhelmed with 15 disconnected quests, or laser-focused on one thread?
4. **Party Drive & Morale:**
   - Are the party's current short-term and long-term goals crystal clear?

## Workflow

1. Scan recent session notes under `<paths.sessions>` (default: last 3–5 sessions) and `WORLD_CANON.md`.
2. Analyze spotlight distribution across player characters.
3. Generate a structured Pulse Report with actionable adjustments for the next prep cycle (`/rg-prep-plan`).
