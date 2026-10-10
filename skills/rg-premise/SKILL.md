---
name: rg-premise
description: "Create or update CAMPAIGN_FRAMEWORK.md. Establishes campaign tone, setting premise, pillars of play, safety tools, house rules, and faction front countdowns."
argument-hint: "[optional: section to revisit, e.g. 'factions', 'safety', 'pillars']"
---

# Campaign Premise & Framework (`rg-premise`)

`rg-premise` produces and maintains `CAMPAIGN_FRAMEWORK.md` — the foundational anchor document for the campaign in an Obsidian vault. It captures setting high-concept, tone, pillars of play, safety tools, house rules, and faction escalation clocks.

Downstream prep skills (`rg-spark`, `rg-flesh-out`, `rg-prep-plan`, `rg-craft`) read `CAMPAIGN_FRAMEWORK.md` as grounding canon.

## Interaction Method

Use the platform question tool (`AskUserQuestion` / `request_user_input` / `ask_question`) to ask one question at a time. Accept free-form DM descriptions for narrative, setting, and factions.

## Execution Flow

### Phase 0: Route by File State

Check if `CAMPAIGN_FRAMEWORK.md` exists in the vault root or notes path:
- **File does not exist:** First run. Announce: "Kein Kampagnen-Framework gefunden — wir erstellen die Basis." Proceed to Phase 1.
- **File exists with argument:** Targeted update for the specified section (e.g. `factions`, `house-rules`). Proceed to Phase 2.
- **File exists without argument:** Review current framework, ask the DM which section needs updating or refinement, then proceed to Phase 2.

### Phase 1: First-Run Interview

Read `references/interview.md` and `references/framework-template.md`. Run the interview in order:

1. **Setting Prämisse & High Concept:** Welt, Zeitalter, Ausgangslage der Gruppe.
2. **Tonalität & Leitmotive:** Atmosphäre, Genremix, sensorische Motive.
3. **Pillars of Play:** Verteilung von Social, Combat und Exploration (z. B. 40/30/30).
4. **Safety Tools:** Lines & Veils der Spielrunde.
5. **Hausregeln & Mechaniken:** Relevante Regelerweiterungen oder Vereinfachungen.
6. **Fraktionsfronten & Eskalations-Uhren:** 2-3 aktive Mächte mit Countdown-Fortschritt (Uhren).

### Phase 2: In-Place Update (Targeted)

Read the existing `CAMPAIGN_FRAMEWORK.md`. Prompt the DM specifically on the sections being revised. Preserve all existing unedited sections, notes, and Obsidian `[[WikiLinks]]`.

### Phase 3: Writing the Framework

Using `references/framework-template.md`, write or update `CAMPAIGN_FRAMEWORK.md` directly in the vault root.
Ensure:
- YAML frontmatter includes `campaign:`, `system:`, `tone:`, `pillars:`, and `last_updated: YYYY-MM-DD`.
- Output is formatted with clean Markdown headings and Obsidian `[[WikiLinks]]` for referenced factions or locations.
- No git commands are run. Work is saved in-place.
