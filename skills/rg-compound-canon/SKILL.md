---
name: rg-compound-canon
description: "Post-session compounding loop: ingests session outcomes, updates NPC statuses, advances faction clocks, and records durable facts into WORLD_CANON.md."
argument-hint: "[session number or debrief note, e.g. 'Session 14' or 'Sessions/Session-14-Notes.md']"
---

# Post-Session Compounding Loop (`rg-compound-canon`)

`rg-compound-canon` embodies the core compounding philosophy: *Every unit of worldbuilding and prep must make future prep easier, not harder.*

Immediately after a game session, this skill absorbs what actually occurred at the table, reconciles player choices, updates NPC statuses, ticks faction clocks, and locks established facts into `WORLD_CANON.md`.

## When to Use

- After every played session or when processing a raw session recap.
- Precedes `/rg-prep-plan` for the subsequent session, ensuring future plans build on true game events.

## Operating Principles

- **What Happened at the Table Is Canon:** If the players befriended the goblin or burned down the tavern, reality shifted. Record the truth without nostalgia for unused prep.
- **In-Place Compounding (No-Git):** Update existing notes directly in the vault (`World/NPCs/`, `CAMPAIGN_FRAMEWORK.md`, `WORLD_CANON.md`).
- **Preserve WikiLink Integrity:** Link every mentioned entity with `[[WikiLinks]]`.

## Execution Workflow

### Phase 1: Ingest Session Outcomes
1. Read the debrief notes or prompt the DM with focused questions:
   - What major decisions did the party make?
   - Which key NPCs did they encounter, help, offend, or kill?
   - What secrets were revealed, and what new mysteries emerged?
   - Where did the session end, and what is the party's immediate next intention?

### Phase 2: NPC & Faction State Updates
1. **NPC Status Reconcile:**
   - For every involved NPC, update their Obsidian note frontmatter or status section:
     - State: `allied`, `hostile`, `neutral`, `deceased`, `imprisoned`, `missing`.
     - Add a brief bullet to their note history: `Session <N>: <Key event>`.
2. **Faction Clocks & Fronts:**
   - Update `CAMPAIGN_FRAMEWORK.md` faction escalation clocks:
     - Advance clocks for factions that moved unchecked: `[x] [ ] [ ] [ ] (1/4)`.
     - Regress or disrupt clocks where the party intervened.

### Phase 3: Canonize in `WORLD_CANON.md`
Append durable facts to `WORLD_CANON.md`:
- Chronological entry under `# Session Log`:
  ```markdown
  ### Session <N>: <Date> — <Brief Title>
  - **Kanonische Ereignisse:**
    - ...
  - **Veränderte Fraktionsbeziehungen:**
    - ...
  - **Neue offene Fäden:**
    - ...
  ```

### Phase 4: Output & Next Steps Summary
Present a clear debrief summary:
- NPCs updated
- Faction clocks moved
- Next session starting hook identified
- Offer to run `/rg-table-pulse` or generate a Discord teaser with `/rg-teaser`.
