---
name: lfg
description: "Autonomous end-to-end TTRPG prep workflow without Git: from session outline and NPC crafting through multi-agent audit, fix resolution, and table distillation."
disable-model-invocation: true
argument-hint: "[session topic or prompt, e.g. 'Session 15: Heist at the Clockwork Vault']"
---

# Autonomous Session Autoprep (`lfg` / `rg-autoprep`)

`lfg` runs the complete hands-off TTRPG prep cycle directly inside an Obsidian vault without any Git branches, commits, or PRs.

It executes the full compounding loop:
1. **Plan:** Structured Session Prep (`rg-prep-plan`)
2. **Craft:** Vault Entity Creation & Linking (`rg-craft`)
3. **Audit:** Multi-Agent Lore & Balance Review (`rg-lore-audit`)
4. **Resolve:** Autonomous Incorporation of Audit Fixes (`rg-resolve-audit`)
5. **Distill:** At-the-Table Usability Quick-Reference (`rg-distill`)

## Execution Sequence

### Step 1: Session Planning (`rg-prep-plan`)
Invoke `rg-prep-plan` with `$ARGUMENTS`.
- Derives the strong start, 3-5 modular scenes/nodes, 10 portable secrets & clues, fantastic locations, NPC pool, encounters, and rewards.
- Saves `Sessions/Session-<XX>-Prep.md` with frontmatter `status: draft`.
- Record the generated plan path for downstream steps.

### Step 2: Entity & Scene Crafting (`rg-craft`)
Invoke `rg-craft` targeting the generated session plan.
- Systematically generates or updates individual NPC notes, location dossiers, and encounter statblocks.
- Links all entities bidirectionally using Obsidian `[[WikiLinks]]`.

### Step 3: Multi-Agent Lore Audit (`rg-lore-audit`)
Invoke `rg-lore-audit` on the session prep note and newly crafted material.
- Dispatches the 6 TTRPG reviewer personas:
  - `the-chronicler` (canon continuity)
  - `the-rules-lawyer` (mechanics, DCs, action economy)
  - `the-player-advocate` (agency, Three-Clue Rule)
  - `the-murderhobo-exploit` (chaos tactics & spell exploits)
  - `the-sensory-immersionist` (atmosphere & senses)
  - `the-safety-officer` (Lines & Veils)
- Compiles actionable findings (P0–P3).

### Step 4: Resolve Audit Findings (`rg-resolve-audit`)
Invoke `rg-resolve-audit` to apply fixes directly into the notes in the vault:
- Fixes canon discrepancies, inserts missing clues, tunes encounter DCs, and tightens read-aloud text.
- Updates frontmatter from `status: draft` to `status: ready`.

### Step 5: At-the-Table Distillation (`rg-distill`)
Invoke `rg-distill` on the finalized session note.
- Generates an executive quick-reference cheat sheet with bolded DCs (**DC 14 Investigation**), sensory cue icons, and lean 3-line NPC cards for rapid scanning during live play.

## Completion
Report the generated prep suite:
- Plan: `<path>`
- Crafted Entities: `<list of links>`
- Audit Status: All P0/P1 issues resolved
- Quick-Reference Cheat Sheet generated
