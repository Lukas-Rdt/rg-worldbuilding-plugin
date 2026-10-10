# Challenge Rating (CR) Calculation Guide (D&D 5e / DMG)

## Defensive CR Calculation
1. **Effective HP:**
   - Base HP adjusted for resistances/immunities and defensive traits (e.g. *Magic Resistance* adds +2 effective AC, *Nimble Escape* adds +4 effective AC).
   - Find preliminary Defensive CR from DMG Monster Statistics Table.
2. **Effective AC:**
   - Compare base AC against expected AC for that preliminary Defensive CR.
   - For every 2 points of AC difference, adjust Defensive CR by +1 or -1.

## Offensive CR Calculation
1. **Damage per Round (DPR):**
   - Calculate maximum average damage across the first 3 rounds assuming all attacks hit.
   - Account for recharge abilities (assume recharge 5-6 used on Round 1 and Round 3).
   - Find preliminary Offensive CR from DMG Monster Statistics Table.
2. **Attack Bonus / Save DC:**
   - Compare attack bonus (or save DC for spellcasters/breath weapons) against expected value for that preliminary Offensive CR.
   - For every 2 points of difference, adjust Offensive CR by +1 or -1.

## Final CR
$$\text{Final CR} = \text{round}\left(\frac{\text{Defensive CR} + \text{Offensive CR}}{2}\right)$$

## Hit Dice by Monster Size
- Tiny: d4
- Small: d6
- Medium: d8
- Large: d10
- Huge: d12
- Gargantuan: d20
$$\text{Average HP} = \text{Count} \times (\text{Die Average}) + (\text{Count} \times \text{Con Mod})$$
