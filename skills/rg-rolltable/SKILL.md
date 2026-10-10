---
name: rg-rolltable
description: "Generate atmospheric, balanced random roll tables (d6, d8, d10, d20, d100) with structured weighting across mundane details, immediate dangers, and campaign hooks."
argument-hint: "[table topic and die size, e.g. 'd20 Tavern Rumors in Baldur's Gate' or 'd10 Weird Dungeon Hazards']"
---

# Atmospheric Random Roll Tables (`rg-rolltable`)

`rg-rolltable` generates evocative, campaign-grounded random tables (d6, d8, d10, d12, d20, or d100). Rather than generic lists of filler entries, it structures rolls using a proven ratio of mundane atmosphere, tactical hazards, and campaign plot hooks.

## When to Use

- When needing random encounter tables, pocket loot, weird dungeon curiosities, tavern rumors, or wilderness weather events.
- To enrich session notes (`/rg-prep-plan`) with on-the-fly improvisation tools.

## The Balanced Weighting Model

For any random table (e.g. a d20 table), entries follow an intentional distribution:

1. **Alltägliches & Lokalkolorit (40% — e.g. Rolls 1–8):**
   - Mundane but atmospheric environmental details, harmless quirks, local gossip that builds the world without threatening the party.
2. **Direkte Gefahr & Taktische Hindernisse (30% — e.g. Rolls 9–14):**
   - Immediate obstacles: minor traps, hostile scouts, unstable terrain, sudden downpours, pickpockets.
3. **Kampagnen-Relevanz & Große Hooks (30% — e.g. Rolls 15–20):**
   - Tied directly to active factions, foreshadowed villains, ancient lore secrets, or rare magic items. Linked with `[[WikiLinks]]`.

## Output Format

Formatted as pipe-delimited Markdown tables ready for Obsidian (and Dice Roller plugin compatible):

```markdown
### [[Zufallstabelle]]: <Thema> (d20)

| d20 | Begegnung / Ereignis | Typ & Auswirkung |
| :---: | :--- | :--- |
| **1-2** | Ein zerschlissener Marktwagen blockiert die Gasse; der Esel weigert sich weiterzugehen. | Lokalkolorit |
| ... | ... | ... |
| **11-12** | Zwei Schläger der [[Diebesgilde]] verlangen Wegezoll (**DC 13 Intimidation**). | Gefahr |
| ... | ... | ... |
| **19-20** | Ein sterbender Bote drückt dem Charakter ein Siegel von [[Haus Vane]] in die Hand. | Kampagnen-Hook |
```

Saves directly into `<paths.lore>/Tabellen/` or within the active session prep note.
