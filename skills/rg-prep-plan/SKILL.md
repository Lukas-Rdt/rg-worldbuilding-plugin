---
name: rg-prep-plan
description: "Structured session preparation combining Lazy DM and Node-Based design: strong start, scenes/nodes, 10 secrets & clues, fantastic locations, NPC pool, and encounters."
argument-hint: "[session number or topic, e.g. 'Session 15' or 'Infiltration of the Sunken Spire']"
---

# Session Prep Plan (`rg-prep-plan`)

`rg-prep-plan` prepares a tabletop RPG session using proven worldbuilding and prep frameworks (Sly Flourish's *Return of the Lazy DM* and Justin Alexander's *Node-Based Design*). It generates modular, high-impact prep notes designed for fluid improvisation without railroading.

## When to Use

- Before running a session or arc.
- Follows `/rg-spark` or `/rg-flesh-out`.
- Directly feeds into `/rg-craft` (for statblocks and detailed scenes) and `/rg-lore-audit` (for balance and plothole review).

## Operating Principles

- **Prep What Matters at the Table:** Focus on actionable hooks, secrets, and adaptable scenes. Don't write rigid novels or railroad scripts.
- **Decoupled Secrets (Three-Clue Rule):** Secrets are portable. Players can discover them through investigation, social interaction, or exploration.
- **Direct Vault Integration:** Write the plan directly into the configured sessions directory (e.g. `Sessions/Session-XX-Prep.md`) with frontmatter `status: draft`. No git commands.

## The 8-Step Prep Structure

### 1. Character Check-in
- Review active player characters, passive stats (Perception, Insight), and personal backstories/goals.
- Identify at least one character spotlight moment for the session.

### 2. The Strong Start
- Frame a vivid, immediate opening situation that hooks players right away (in media res, an arrival, an unexpected visitor, or a sudden crisis).
- Include 2-3 sensory details (sounds, weather, lighting).

### 3. Modular Scenes / Investigation Nodes
- Outline 3-5 adaptable scenes/nodes.
- Map connections between nodes using clues and choices rather than a single linear path.

### 4. 10 Secrets & Clues
- List exactly 10 short, portable lore facts, revelations, or historical clues the characters might uncover during this session.
- Keep them independent of specific locations or NPCs so they can be dropped wherever the party explores.

### 5. Fantastic Locations
- Detail 2-3 key sites with memorable descriptors:
  - Evocative name and high-concept appearance.
  - 3 sensory aspects (smell, sound, texture/light).
  - An interactive terrain feature (elevated catwalk, bubbling acid, crumbling altar).

### 6. Important NPCs
- Select 2-4 NPCs likely to interact with the party.
- For each: brief archetype, active goal, distinctive vocal/behavioral quirk, and vault link (`[[NPC Name]]`).

### 7. Relevant Encounters & Hazards
- 2-3 combat, social, or hazard encounters appropriate for party level.
- Include dynamic terrain elements or escalation triggers.

### 8. Treasure & Rewards
- Concrete rewards: magic items, currency, titles, faction favors, or pivotal lore handouts.

## Output Document

Write to `<paths.sessions>/Session-<XX>-Prep.md`:

```markdown
---
type: session-prep
session: "<XX>"
campaign: "<Campaign Name>"
status: draft
date: YYYY-MM-DD
tags:
  - ttrpg/session-prep
---

# Session <XX> Prep: <Title / Arc>

## 1. Character Spotlight
- ...

## 2. Der Starke Auftakt (Strong Start)
> *<Vorlesetext / Eröffnungsszene mit sensorischen Details>*

## 3. Szenen-Knoten (Node Map)
- **Knoten A:** ...
- **Knoten B:** ...

## 4. 10 Geheimnisse & Hinweise
1. ...
2. ...
3. ...
4. ...
5. ...
6. ...
7. ...
8. ...
9. ...
10. ...

## 5. Schauplätze & Kulissen
- **[[Schauplatz A]]:** ...

## 6. Wichtige NSCs
- [[NSC Name]]: ...

## 7. Begegnungen & Monster
- ...

## 8. Belohnungen & Schätze
- ...
```

After writing the plan, recommend running `/rg-lore-audit` to verify balance, agency, and lore continuity, or `/rg-craft` to flesh out specific handouts and statblocks.
