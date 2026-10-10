---
name: rg-statblock
description: "Create and mathematically verify D&D 5e / D&D 2024 / PF2e monster and NPC statblocks with exact CR calculation, hit dice validation, and Obsidian statblock markdown syntax."
argument-hint: "[monster or NPC concept and desired CR, e.g. 'Abyssal Clockwork Stalker CR 5' or 'Drow Infiltrator']"
---

# Monster & NPC Statblock Creator (`rg-statblock`)

`rg-statblock` builds and mathematically verifies balanced monster and NPC statblocks for tabletop RPGs (D&D 5e, D&D 2024, Pathfinder 2e). It prevents arithmetic errors in proficiency bonus, hit dice, attack modifiers, saving throws, and Challenge Rating (CR).

## When to Use

- When designing custom monsters, boss encounters, or elite NPC adversaries.
- To convert narrative monster ideas into game-ready stats.
- Supported outputs: Obsidian 5e Statblocks plugin YAML codeblock, Markdown tables, or VTT JSON.

## Features & Verification Checks

1. **Exact CR Calibration:**
   - Evaluates Defensive CR (Effective HP vs AC) and Offensive CR (Average DPR over 3 rounds vs Attack Bonus/Save DC).
   - Verifies that final CR accurately reflects table lethality.
2. **Hit Dice & Stat Consistency:**
   - Hit die matches creature size (Tiny = d4, Small = d6, Medium = d8, Large = d10, Huge = d12, Gargantuan = d20).
   - Average HP accurately calculates die count $\times$ average + Constitution modifier $\times$ count.
3. **Proficiency Bonus Scaling:**
   - Attack modifiers strictly adhere to $\text{Ability Mod} + \text{Proficiency Bonus}$.
   - Save DCs strictly adhere to $8 + \text{Ability Mod} + \text{Proficiency Bonus}$.
4. **Action Economy & Tactical Identity:**
   - Includes distinct action types: Actions, Bonus Actions, Reactions, and Legendary/Lair Actions for boss monsters.

## Output Syntax Options

### Option 1: Obsidian 5e-Statblock Codeblock (Default)
```yaml
```statblock
name: "Creature Name"
size: "Medium"
type: "monstrosity"
alignment: "neutral evil"
ac: 15
hp: 68
hit_dice: "8d8 + 32"
speed: "30 ft., climb 30 ft."
stats: [16, 14, 18, 10, 12, 8]
saves:
  constitution: 6
skills:
  stealth: 4
  perception: 3
senses: "darkvision 60 ft., passive Perception 13"
languages: "undercommon"
cr: "4"
traits:
  - name: "Ambusher"
    desc: "The creature has advantage on attack rolls against any creature it surprised."
actions:
  - name: "Multiattack"
    desc: "The creature makes two claw attacks."
  - name: "Claw"
    desc: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage."
```
```

### Option 2: Clean Markdown Table
Formatted for standard Obsidian without community plugins.

Save statblocks directly into notes under `<paths.npcs>` or `<paths.sessions>`.
