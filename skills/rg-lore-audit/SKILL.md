---
name: rg-lore-audit
description: "Multi-agent review for TTRPG session prep and worldbuilding notes: audits canon consistency, rule mechanics, player agency, chaos exploits, sensory immersion, and safety boundaries."
argument-hint: "[optional path to note, e.g. 'Sessions/Session-14.md', or blank to pick recently edited notes]"
---

# Multi-Agent Lore Audit (`rg-lore-audit`)

`rg-lore-audit` is the quality assurance engine of the RG Worldbuilding plugin. It runs prepared session notes, dungeons, NPCs, and lore drafts through a multi-agent review team composed of 6 specialized TTRPG personas.

## When to Use

- Before running a session to catch continuity plotholes, balance issues, or railroading.
- When creating major world elements (boss statblocks, complex dungeons, political factions).
- Follows `/rg-prep-plan` or `/rg-craft`; followed by `/rg-resolve-audit` to apply fixes.

## Audit Personas

The audit orchestrates 6 distinct lenses from `references/personas/`:

1. **`the-chronicler.md`:** Validates canon, timeline, geography, and NPC relationship continuity against `WORLD_CANON.md` and existing vault notes.
2. **`the-rules-lawyer.md`:** Audits mechanics, action economy, spell legality, and check DCs (5e/PF2e).
3. **`the-player-advocate.md`:** Guards player agency, prevents railroading, and verifies the Three-Clue Rule for critical mysteries.
4. **`the-murderhobo-exploit.md`:** Simulates chaotic player behavior, aggressive shortcuts, and utility spell exploits (*Pass without Trace*, *Fly*, *Locate Object*).
5. **`the-sensory-immersionist.md`:** Evaluates read-aloud boxed text (max 3-4 sentences) and verifies engagement of multi-sensory channels.
6. **`the-safety-officer.md`:** Enforces group boundaries (Lines & Veils) established in `CAMPAIGN_FRAMEWORK.md`.

## Target Scope Determination (No-Git)

Unlike code reviews that read git diffs, `rg-lore-audit` operates in an Obsidian vault where automated sync plugins run:

1. **Explicit Target:** If an argument is provided (e.g. `/rg-lore-audit Sessions/Session-14.md`), audit that specific file.
2. **Recent Notes:** If no argument is provided, inspect the vault for recently modified notes (or files marked with `status: draft` in frontmatter).
3. **Interactive Selection:** If ambiguous, ask the DM using the question tool: *"Welche Session- oder Lore-Notiz möchtest du heute prüfen?"*

## Review Execution Pipeline

1. **Load Target Material:** Read the selected note(s), `CAMPAIGN_FRAMEWORK.md`, and relevant entries from `WORLD_CANON.md`.
2. **Dispatch Reviewer Personas:**
   - Execute parallel sub-agents or persona prompts with the target draft and grounding context.
   - Each persona identifies findings categorized by severity:
     - **P0 (Kritisch):** Direkte Kanon-Brüche, Line-Verletzungen, fatale Railroading-Flaschenhälse, unspielbare DC/Encounter-Gefahren.
     - **P1 (Bedeutend):** Fehlende Hinweise (Three-Clue Rule nicht erfüllt), Solo-Boss ohne Aktionsökonomie, fehlende Sinnesanker, Zauber-Exploits.
     - **P2 (Verbesserung):** Zu lange Vorlesetexte, unpräzise DC-Angaben, vage Motivationen.
     - **P3 (Politur):** Fehlende `[[WikiLinks]]`, atmosphärische Feinjustierung.
3. **Deduplicate & Synthesize:**
   - Merge overlapping observations.
   - Formulate concrete, diegetic solutions (not just complaints).

## Report Output Format

Render a consolidated Markdown review report:

```markdown
# 🎲 Lore-Audit Report: <Titel der Notiz>

**Geprüfte Datei:** `<Pfad>`
**Status:** <Bereit für den Spieltisch / Nachbesserung empfohlen>

### 🚨 Kritische Prüfpunkte (P0 / P1)
| Persona | Problem | Empfohlene Lösung / Diegetischer Fix |
| :--- | :--- | :--- |
| Chronicler | Malakor starb in Session 4 | Es handelt sich um seinen Zwillingsbruder oder ein Simulacrum |
| Player Advocate | Nur 1 Hinweis auf den Mörder | 2 zusätzliche Spuren in der Bibliothek und am Tatort platzieren |

### 💡 Spieltisch- & Atmosphären-Tipps (P2 / P3)
- **Sensorik:** Vorlesetext in Szene 2 um Brandgeruch und Hall ergänzen.
- **Chaos-Check:** Wenn Spieler den Priester angreifen, flieht er durch die Falltür in Raum 3.

### 🛠️ Nächste Schritte
Möchtest du diese Punkte automatisch einarbeiten? Führe `/rg-resolve-audit` aus.
```
