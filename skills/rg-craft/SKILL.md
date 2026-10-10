---
name: rg-craft
description: "Systematically create, link, and write prepared TTRPG documents, scenes, encounters, and notes directly into the Obsidian vault without Git."
argument-hint: "[path to session prep plan or description of elements to craft]"
---

# Vault Worldcraft (`rg-craft`)

`rg-craft` executes and implements prepared campaign material into the Obsidian vault. It turns prep plans, sketches, and outlines into connected, formatted notes, statblocks, and encounters directly in the user's vault without git, branches, or PR workflows.

## When to Use

- After `/rg-prep-plan` has drafted a session plan and the individual scenes, NPCs, and encounter notes need to be created and linked.
- When creating batches of location descriptions, faction notes, or dungeon rooms in the vault.

## Operating Principles

- **No Git / No Branching:** Do not execute `git branch`, `git commit`, `git checkout`, or `gh pr`. Modify files directly in the vault.
- **Draft vs Ready Status:** Mark in-progress work in YAML frontmatter with `status: draft` and finalized material with `status: ready`.
- **Relational Linking:** Scan the vault first. Ensure every new note links back to related NPCs, parent regions, or active factions via `[[WikiLinks]]`.
- **Frontmatter Preservation:** Never wipe existing frontmatter properties; merge or update them cleanly.

## Execution Sequence

### Phase 1: Input Analysis & Scope
1. Read the provided prep document (e.g. `Sessions/Session-XX-Prep.md`) or argument scope.
2. Build an execution checklist of notes to create or update:
   - NPCs to create/update under `<paths.npcs>`
   - Locations to create/update under `<paths.locations>`
   - Encounter/monster statblocks to generate
   - Handouts to format under `<paths.handouts>`

### Phase 2: Systematic Creation & Linking
Work through the checklist note by note:
1. **NPC Notes:**
   - Write standard frontmatter (`type: npc`, `tags: [ttrpg/npc]`, `status: ready`).
   - Include persona, goals, secrets, roleplaying cues, and bidirectional `[[WikiLinks]]`.
2. **Location Notes:**
   - Write frontmatter (`type: location`, `tags: [ttrpg/location]`).
   - Include high-concept summary, 3 sensory anchors, prominent features, and connected areas.
3. **Encounters & Hazards:**
   - Format statblocks (using Obsidian 5e syntax or markdown tables).
   - Detail terrain features, enemy tactics, and escalation triggers.
4. **Session Plan Updating:**
   - Update the parent `Session-XX-Prep.md` note with direct `[[Links]]` to all newly crafted notes.

### Phase 3: Review & Summary
Provide a concise summary table of crafted notes:

| Note / Entity | Path | Type | Status |
| :--- | :--- | :--- | :--- |
| [[Name]] | `World/NPCs/Name.md` | NPC | ready |
| [[Location]] | `World/Locations/Place.md` | Location | ready |

Suggest running `/rg-distill` for table-ready cheat sheets or `/rg-lore-audit` for multi-agent quality checks.
