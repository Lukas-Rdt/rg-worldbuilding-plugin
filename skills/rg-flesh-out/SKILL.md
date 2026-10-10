---
name: rg-flesh-out
description: "Interactive one-question-at-a-time interview to deeply detail a campaign element (NPC, artifact, faction, dungeon concept) focusing on motivation, flaws, secrets, and sensory anchors."
argument-hint: "[entity name or concept, e.g. 'Malakor the Red', 'The Ashen Dagger', 'Cult of the Eclipse']"
---

# Flesh Out Lore Entity (`rg-flesh-out`)

`rg-flesh-out` conducts a structured, interactive one-question-at-a-time interview with the DM to turn a rough idea into a fully dimensional, table-ready lore note directly inside the Obsidian vault.

## When to Use

- When developing an important NPC, faction, magic item/artifact, or dungeon site.
- After `/rg-spark` selected a hook, or whenever inspiration strikes during prep.
- Precedes `/rg-prep-plan` and `/rg-craft`.

## Operating Principles

- **One Question at a Time:** Never overwhelm the DM with a massive wall of prompts. Ask a single focused question, absorb the answer, and build upon it.
- **Push for Depth & Flaws:** Flat characters and items are boring. Probe for contradictory motivations, hidden vulnerabilities, and secrets.
- **Non-Destructive & In-Place:** Search the vault before creating a note. Link existing entities via `[[Name|Alias]]` and preserve existing frontmatter properties.

## Interactive Interview Sequence

### Step 1: Entity Identification & Type
- Determine entity type: **NPC**, **Faction/Cult**, **Artifact/Item**, or **Location/Site**.
- Verify if a note for this entity already exists in the vault. If yes, load it and update in-place.

### Step 2: The Core Motivation & Urgency
- What does this entity desperately want right now? What drives their daily actions or existence?
- What happens if they fail to achieve this?

### Step 3: The Crucial Flaw or Vulnerability
- What is their blind spot, moral compromise, or physical weakness?
- How could clever players exploit or influence this flaw?

### Step 4: Ties to the Web of Lore (Factions & NPCs)
- Who are their closest allies, rivals, or puppets?
- Connect these relationships directly to established vault lore using `[[WikiLinks]]`.

### Step 5: The Secret / Hidden Truth
- What do they keep hidden from the world or from their closest associates?
- How can players discover hints of this secret (adhering to the Three-Clue Rule)?

### Step 6: Sensory Anchor & Table Persona
- **For NPCs:** What is their distinctive voice, physical mannerism, or sensory quirk (e.g. scent of clove, scarred left eye, nervous ring-turning)?
- **For Artifacts/Sites:** What sensory cues hit the players first (humming magic, cold iron, ozone)?

## Phase 3: Vault Note Creation

Synthesize the interview into a structured Obsidian note written to the configured path (e.g. `World/NPCs/<Name>.md`):

```markdown
---
type: npc # npc | faction | item | location
name: "<Entity Name>"
aliases: []
tags:
  - ttrpg/npc
status: draft
campaign: "<Campaign Name>"
---

# [[<Entity Name>]]

> *"<Memorable Quote or One-Line Persona Summary>"*

## Übersicht & Rolle
<Prägnanter Überblick über die Rolle in der Kampagne>

## Motivation & Ziele
- **Hauptziel:** ...
- **Dringlichkeit:** ...

## Schwächen & Verwundbarkeiten
- ...

## Beziehungen & Verflechtungen
- **Alliierte:** [[Name|Alias]]
- **Rivalen:** [[Name|Alias]]

## Geheimnisse & Hinweise (Three-Clue Rule)
- **Geheimnis:** ...
- **Hinweise in der Welt:**
  1. ...
  2. ...
  3. ...

## Am Spieltisch (Roleplaying & Sensory)
- **Stimme / Pacing:** ...
- **Sinnesanker:** ...
```

Notify the DM of note creation and suggest running `/rg-lore-audit` or integrating it into session prep via `/rg-prep-plan`.
