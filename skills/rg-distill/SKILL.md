---
name: rg-distill
description: "At-the-table usability distillation: compresses dense narrative notes into scannable bullet points, bolds key checks (DC 15 Athletics), extracts sensory cues, and tightens read-aloud text."
argument-hint: "[note path or text to distill, e.g. 'Sessions/Session-14.md' or 'World/Locations/Old-Crypt.md']"
---

# At-the-Table Note Distillation (`rg-distill`)

`rg-distill` converts dense, prose-heavy worldbuilding notes and session prep into scannable, bullet-pointed cheat sheets optimized for live table execution during gameplay.

## When to Use

- Before the game starts, when prep notes are too long or prose-heavy to scan quickly mid-combat or during dialogue.
- To distill dungeon room descriptions, NPC dialogue trees, or complex encounter mechanics.

## Principles of At-the-Table Usability

1. **Eliminate Narrative Fat:** The DM needs facts and actionable triggers in under 3 seconds. Replace dense background paragraphs with bullet points.
2. **Bold Game Mechanics & DCs:** Every check must pop out visually:
   - **DC 14 Wisdom (Perception)**
   - **Passive Perception 15**
   - **DC 13 Constitution saving throw** (fail: **3d6 poison damage** and **Poisoned** condition)
3. **Explicit Sensory Anchors:** Separate what players experience across sensory channels:
   - 👁️ **Sehen:** ...
   - 👂 **Hören:** ...
   - 👃 **Riechen / Schmecken:** ...
   - ✋ **Fühlen / Atmosphäre:** ...
4. **Lean NPC Cards:** NPCs reduced to 3 essential lines:
   - **Erscheinung & Stimme:** (1 Satz)
   - **Wille & Ziel:** (Was will er JETZT von den Spielern?)
   - **Geheimnis / Hebel:** (Wie bringt man ihn zum Reden?)
5. **Tight Boxed Text:** Limit read-aloud atmospheric text to a maximum of 2–3 evocative sentences.

## Workflow

1. Read the target note specified by the DM.
2. Parse each section (scenes, rooms, NPCs, hazards).
3. Transform the content applying the distillation rules.
4. Update the note in-place in the Obsidian vault (or append a `# Schnellreferenz (At-the-Table)` section if the DM prefers preserving original lore text).
5. Preserve all YAML frontmatter and `[[WikiLinks]]`.
