---
name: rg-thread-sweep
description: "Scan the entire Obsidian vault for unresolved quest hooks, forgotten NPCs, unfulfilled promises, and dangling narrative threads."
argument-hint: "[optional scope, e.g. 'factions' or 'quests' or blank for full vault]"
---

# Narrative Thread & Hook Sweep (`rg-thread-sweep`)

`rg-thread-sweep` crawls session notes, quest lists, and NPC files across the Obsidian vault to unearth forgotten plot hooks, unfulfilled promises, overlooked items, and lingering mysteries. It prevents the campaign from accumulating "lore debt" and gives the DM rich material to re-incorporate into future sessions.

## When to Use

- When planning a new adventure arc or preparing for a session and wondering: *"What did the party leave behind?"*
- Mid-campaign when notes have accumulated over dozens of sessions.

## Thread Sweep Taxonomy

1. **Unresolved Quest Hooks & Rumors:**
   - Hooks offered by tavern patrons, notice boards, or mentors that the party never followed up on.
2. **Forgotten NPCs & Oaths:**
   - NPCs the party promised to revisit, rescue, or pay.
   - Enemies who escaped with an oath of vengeance and have been biding their time.
3. **Unsolved Mysteries & Unlocked Relics:**
   - Mysterious keys, untranslated runes, or sealed dungeon doors the party bypassed.
4. **Faction Reactions & Neglected Threats:**
   - Fronts that have continued to advance while the party was busy elsewhere.

## Workflow

1. Scan all notes under `<paths.sessions>` and `<paths.lore>`.
2. Extract open questions, unchecked markdown checkboxes (`- [ ]`), and unanswered rumors.
3. Classify threads into:
   - **Hot (Immediate relevance):** Directly tied to current region or active party goals.
   - **Simmering (Evolving in background):** Faction moves, distant NPC agendas.
   - **Cold (Forgotten relics):** Minor rumors from early sessions ripe for a surprise callback.
4. Present an actionable table of Narrative Hooks with suggested re-introduction prompts.
