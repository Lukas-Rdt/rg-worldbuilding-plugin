---
name: rg-ruling-pov
description: "Structured rulings and trade-off analysis for contentious TTRPG rules, house rules, RAW vs RAI debates, or major lore decisions."
argument-hint: "[question or rule debate, e.g. 'Can Silvery Barbs affect Legendary Resistance?' or 'Flanking house rule trade-offs']"
---

# TTRPG Ruling & Point of View (`rg-ruling-pov`)

`rg-ruling-pov` provides balanced, thorough adjudications on contentious rules interpretations, house rule propositions, or consequential lore rulings. It dissects questions across RAW (Rules as Written), RAI (Rules as Intended), and Table Flow (Action economy, martial/caster balance, speed of play).

## When to Use

- When the DM or players debate a contentious spell interaction or edge-case mechanic.
- Before adopting a house rule (e.g., Gritty Realism rests, modified critical hits, flanking changes) to evaluate cascading side effects.
- To formulate a consistent, written ruling for `CAMPAIGN_FRAMEWORK.md`.

## The 4-Lens Adjudication Framework

1. **Rules as Written (RAW):**
   - Literal text analysis of the official rulebooks (D&D 5e / 2024 / PF2e).
   - Specific-beats-general hierarchy, exact wording of action costs, conditions, and triggers.
2. **Rules as Intended (RAI):**
   - Designer intent, official errata, Sage Advice compendiums, and developer clarifications.
3. **Table Flow & Game Balance (RAF / Practical Impact):**
   - Does this ruling bog down combat with extra math or rolling?
   - Does it unintentionally invalidate a class feature (e.g. Rogue Sneak Attack, Barbarian Reckless Attack)?
   - Does it widen the caster-martial divide?
4. **The Recommendation:**
   - A single, unambiguous default recommendation with a short rationalization.

## Output Structure

Presents a clear ruling memo:

```markdown
# ⚖️ Ruling: <Regel-Thema>

## Die Schnelle Entscheidung (Quick Ruling)
> **Empfohlene Auslegung:** <1 prägnanter Satz für den Spieltisch>

## Detaillierte Analyse
- **RAW (Regeltext):** ...
- **RAI (Designer-Absicht):** ...
- **Spieltisch-Auswirkung (Pacing & Balance):** ...

## Potenzielle Nebenwirkungen & Exploits
- Worauf muss der DM achten, wenn diese Regel so angewendet wird?

## Übernahme ins Kampagnen-Framework
Biete an, die Regel direkt als Hausregel in `CAMPAIGN_FRAMEWORK.md` einzutragen.
```
