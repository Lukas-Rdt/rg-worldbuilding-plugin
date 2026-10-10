---
name: rg-spark
description: "Generate 10+ divergent creative ideas for quests, factions, twists, or monsters, filter clichés, and deliver the top 3 table-ready concepts grounded in vault lore."
argument-hint: "[theme, quest hook, faction, monster, or twist] [output:md]"
---

# Creative Spark (`rg-spark`)

`rg-spark` generates high-divergence creative hooks and concepts for tabletop RPG campaigns. It explores unconventional angles, discards first-order genre clichés, and distills 10+ initial sparks into the 3 strongest, gameable options grounded in the campaign's active lore.

## When to Use

- When needing fresh ideas for the next session's hook, a mysterious faction, an unusual monster encounter, or a dramatic campaign twist.
- Precedes `/rg-flesh-out`: `rg-spark` brainstorms a broad spread of options; `/rg-flesh-out` takes the chosen option and deeply details it.

## Interaction Method

Use the platform question tool (`AskUserQuestion` / `request_user_input` / `ask_question`). Conduct the ideation interactively: ask clarifying questions if the prompt is broad, then present the top options.

## Execution Flow

### Phase 1: Vault & Lore Grounding

1. Check for `CAMPAIGN_FRAMEWORK.md` to ground tone, themes, and pillars (e.g., Grimdark vs Heroic, social intrigue vs wilderness exploration).
2. Check `WORLD_CANON.md` or scan recent session notes to identify current locations, active factions, and unresolved dilemmas so sparks seamlessly integrate.
3. Respect all Lines and Veils defined in safety tools.

### Phase 2: Divergent Spark Generation (10+ Concepts)

Generate a raw list of at least 10 varied concepts across multiple dimensions:
- **Twists on Tropes:** Invert common expectations (e.g. not a greedy necromancer, but an ancestral guardian trying to prevent an ecological collapse).
- **Faction Entanglements:** Connect hooks to at least two competing interests.
- **Sensory & Environmental Anchors:** Unsettling weather, strange architecture, dying magic.
- **Player Agency & Stakes:** Clear dilemmas with no obvious "correct" solution.

### Phase 3: The Cliché Filter & Curated Selection

Screen out the first 3 obvious tropes that come to mind. Select and refine the **Top 3 Concepts**:

For each top concept, provide:
1. **The Hook / Spark:** One evocative paragraph describing the premise.
2. **The Dramatic Twist:** What is not as it seems?
3. **The Stake / Escalation:** What happens if the players do nothing?
4. **Key NPCs / Factions:** Who is involved? (using `[[WikiLinks]]`).
5. **Sensory Cue:** One memorable image or sound at the table.

### Phase 4: Output & Vault Integration

Offer the DM:
1. Save the concepts into the vault (e.g., `<paths.lore>/Sparks - <Topic>.md` or directly into the relevant prep note).
2. Immediately launch `/rg-flesh-out` on the favorite spark to conduct a focused interview.
