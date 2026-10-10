---
name: rg-lore-primer
description: "Generate player-facing lore primers and handouts tailored to a character's background, lineage, or knowledge (e.g. 'What an elf scholar from Evermeet knows about Myth Drannor')."
argument-hint: "[topic and character, e.g. 'The Sunken Spire for Varus the Wizard' or 'The Red Cult for a local rogue']"
---

# Player Lore Primer (`rg-lore-primer`)

`rg-lore-primer` creates targeted, spoiler-free lore handouts for players, calibrated strictly to their character's background, lineage, religion, or proficiencies. Instead of dumping a massive DM lore doc on players, it answers: *"What does my character actually know about this?"*

## When to Use

- When a player character arrives in a new region or encounters a faction related to their backstory.
- When a player asks for their character's common or specialized knowledge before a session.
- To provide printable or shareable Markdown handouts for Discord or Obsidian.

## Principles of Character-Grounded Lore

1. **Spoiler Defense:** Never leak DM-only secrets, upcoming ambush triggers, or true villain identities. Distinguish firmly between objective historical fact and in-world legend.
2. **Cultural Flavor & Perspective:** A dwarf from the Iron Hills views the Underdark differently than a High Elf astrologer. Reflect cultural biases, myths, and idioms in the writing.
3. **Actionable Table Nuggets:** Include 2-3 specific rumors, landmarks, or etiquette tips the character can actively use at the table during social or exploration scenes.

## Structure of a Primer Note

```markdown
---
type: handout
recipient: "<Character Name or Class/Background>"
topic: "<Topic>"
status: ready
tags:
  - ttrpg/handout
  - player-lore
---

# Was [[<Character Name>]] über [[<Topic>]] weiß

> *"<Atmosphärisches In-World-Sprichwort oder Überlieferung>"*

## Allgemeines Wissen (Common Lore)
- Was jedes Kind in der Region über diesen Ort / diese Person erzählt...

## Kulturelle & Fachliche Einblicke (Specialist Knowledge)
- Durch deinen Hintergrund als [[Hintergrund / Klasse]] erinnerst du dich an folgende Details...
- **Bedeutende Namen & Fraktionen:** [[Name 1]], [[Name 2]]

## Lokale Gerüchte & Warnungen (Rumors & Taboos)
- 1. ...
- 2. ...
- 3. ...
```

Write the primer to `<paths.handouts>/` and suggest formatting with `/rg-proof` if desired.
