---
name: rg-resolve-audit
description: "Directly apply lore audit feedback, rule balance adjustments, and continuity fixes into Obsidian vault notes without Git or PR comments."
argument-hint: "[path to audited note or report, e.g. 'Sessions/Session-14.md']"
---

# Resolve Lore Audit Feedback (`rg-resolve-audit`)

`rg-resolve-audit` takes the corrective findings from `/rg-lore-audit` and applies them directly to the prepped notes inside the Obsidian vault. It resolves continuity bugs, adjusts broken monster DCs, injects missing mystery clues, and tightens descriptions.

## When to Use

- Directly after running `/rg-lore-audit`.
- Part of autonomous workflows (`lfg` / `rg-autoprep`) to automatically polish and harden prep drafts.

## Operating Principles

- **Direct In-Place Editing (No-Git):** Edit the target markdown notes directly in the vault. Do not make git commits or PR comments.
- **Diegetic Solutions:** Resolve plot issues by integrating in-world explanations rather than deleting narrative content.
- **Status Promotion:** When all P0 and P1 issues are resolved, update the note's frontmatter from `status: draft` to `status: ready`.

## Resolution Protocol

1. **Intake Findings:**
   - Parse findings from the recent `/rg-lore-audit` report or input argument.
2. **Prioritized Application:**
   - **P0/P1 Canon & Safety Fixes:** Fix contradictions with `WORLD_CANON.md`, purge any Line violations, and decouple bottleneck clues into at least 3 distinct discovery paths.
   - **Mechanics & DCs:** Correct arithmetic in monster attacks, saves, or spell slots; normalize skill check DCs.
   - **Sensory & Immersion Polish:** Trim verbose read-aloud boxes to 2–3 sentences and weave in lighting, scent, or acoustic cues.
   - **WikiLinks:** Wrap newly introduced lore terms and NPCs in `[[WikiLinks]]`.
3. **Verification:**
   - Confirm that applied changes did not break YAML frontmatter or overwrite unrelated sections.
   - Mark `status: ready` in frontmatter.
4. **Summary:**
   - Present a concise diff/changelog of resolved points to the DM.
