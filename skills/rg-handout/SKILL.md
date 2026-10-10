---
name: rg-handout
description: "Create immersive diegetic in-game player materials (letters, journal fragments, wanted bounties, ancient cartography legends) with embedded clues and authentic voice."
argument-hint: "[handout type and context, e.g. 'intercepted cultist letter', 'wanted poster for a rogue', 'ship captain journal']"
---

# Diegetic Player Handouts (`rg-handout`)

`rg-handout` drafts authentic in-world artifacts that DMs can print out, export to PDF, or send directly to players. It crafts letters, intercepted missives, bloodstained diary entries, city proclamations, wanted bounties, and cryptic riddle inscriptions.

## When to Use

- When the party searches a desk, loots a courier, or finds an ancient chest with written lore.
- To reveal clues adhering to the Three-Clue Rule through player-held physical or digital props.

## Design Rules for Diegetic Props

1. **Authentic In-World Voice:**
   - Write entirely from the perspective of the fictional author (flawed, biased, terrified, arrogant, or desperate).
   - Never use out-of-game mechanics, rule terms, or DCs in the handout body.
2. **Layered Clues & Riddles:**
   - Embed vital information naturally: an address, a codename, an unusual date, or a passing complaint that reveals an enemy's weakness.
   - Leave room for player deduction without being impenetrably obscure.
3. **Physical & Sensory Styling:**
   - Include brief DM notes on physical staging (e.g. *"Empfehlung: Mit nassem Kaffeesatz altern lassen; Kanten anflämmen; Siegel mit rotem Wachs versehen"*).
   - Format with CSS callout blocks (`> [!quote]` or custom Obsidian handout styles).

## Output Template

Saved to `<paths.handouts>/<Title>.md`:

```markdown
---
type: handout
handout_type: letter # letter | journal | bounty | proclamation | poem
author: "[[Lord Malakor]]"
discovered_in: "[[Bibliothek von Burg Graustein]]"
status: ready
tags:
  - ttrpg/handout
---

# Handout: <Titel>

> [!quote] In-Game Text
> *Mein treuer Freund,*
>
> *Die Vorbereitungen sind abgeschlossen. Wenn die Neumondsichel am dritten Tag des Weinmonds aufgeht, wird das Tor geöffnet sein. Stelle sicher, dass die Wachen am Westtor schlafen — der Wein wurde wie besprochen präpariert.*
>
> *Verbrenne dieses Schreiben nach dem Lesen.*
>
> *— M.*

---

## 🎲 DM-Hintergrund & Enthaltene Hinweise
- **Schlüsselhinweis:** Verrät das Datum (**dritter Tag des Weinmonds**) und den Einstiegspunkt (**Westtor**).
- **Hebel:** Der vergiftete Wein kann im Vorratskeller Raum 4 nachgewiesen werden.
```
