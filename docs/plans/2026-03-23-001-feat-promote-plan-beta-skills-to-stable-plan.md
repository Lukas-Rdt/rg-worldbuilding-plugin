---
title: "feat: promote rg:plan-beta and deepen-plan-beta to stable"
type: feat
status: completed
date: 2026-03-23
---

# Promote rg:plan-beta and deepen-plan-beta to stable

## Overview

Replace the stable `rg:plan` and `deepen-plan` skills with their validated beta counterparts, following the documented 9-step promotion path from `docs/solutions/skill-design/beta-skills-framework.md`.

## Problem Statement

The beta versions of `rg:plan` and `deepen-plan` have been tested and are ready for promotion. They currently sit alongside the stable versions as separate skill directories with `disable-model-invocation: true`, meaning users must invoke them manually. Promotion makes them the default for all workflows including `lfg`/`slfg` orchestration.

## Proposed Solution

Follow the beta-skills-framework promotion checklist exactly, applied to both skill pairs simultaneously.

## Implementation Plan

### Phase 1: Replace stable SKILL.md content with beta content

**Files to modify:**

1. **`skills/rg-plan/SKILL.md`** -- Replace entire content with `skills/rg-plan-beta/SKILL.md`
2. **`skills/deepen-plan/SKILL.md`** -- Replace entire content with `skills/deepen-plan-beta/SKILL.md`

### Phase 2: Restore stable frontmatter and remove beta markers

**In promoted `skills/rg-plan/SKILL.md`:**

- Change `name: rg:plan-beta` to `name: rg:plan`
- Remove `[BETA] ` prefix from description
- Remove `disable-model-invocation: true` line

**In promoted `skills/deepen-plan/SKILL.md`:**

- Change `name: deepen-plan-beta` to `name: deepen-plan`
- Remove `[BETA] ` prefix from description
- Remove `disable-model-invocation: true` line

### Phase 3: Update all internal references from beta to stable names

**In promoted `skills/rg-plan/SKILL.md`:**

- All references to `/deepen-plan-beta` become `/deepen-plan`
- All references to `rg:plan-beta` become `rg:plan` (in headings, prose, etc.)
- All references to `-beta-plan.md` file suffix become `-plan.md`
- Example filenames using `-beta-plan.md` become `-plan.md`

**In promoted `skills/deepen-plan/SKILL.md`:**

- All references to `rg:plan-beta` become `rg:plan`
- All references to `deepen-plan-beta` become `deepen-plan`
- Scratch directory paths: `deepen-plan-beta` becomes `deepen-plan`

### Phase 4: Clean up rg-work-beta cross-reference

**In `skills/rg-work-beta/SKILL.md` (line 450):**

- Remove `rg:plan-beta or ` from the text so it reads just `rg:plan`

### Phase 5: Delete beta skill directories

- Delete `skills/rg-plan-beta/` directory entirely
- Delete `skills/deepen-plan-beta/` directory entirely

### Phase 6: Update README.md

**In `plugins/rg-engineering/README.md`:**

1. **Update `rg:plan` description** in the Workflow Commands table (line 81): Change from `Create implementation plans` to `Transform features into structured implementation plans grounded in repo patterns`
2. **Update `deepen-plan` description** in the Utility Commands table (line 93): Description already says `Stress-test plans and deepen weak sections with targeted research` which matches the beta -- verify and keep
3. **Remove the entire Beta Skills section** (lines 156-165): The `### Beta Skills` heading, explanatory paragraph, table with `rg:plan-beta` and `deepen-plan-beta` rows, and the "To test" line
4. **Update skill count**: Currently `40+` in the Components table. Removing 2 beta directories decreases the count. Verify with `bun run release:validate` and update if needed

### Phase 7: Validation

1. **Search for remaining `-beta` references**: Grep all files under `plugins/rg-engineering/` for leftover `plan-beta` strings -- every hit is a bug, except historical entries in `CHANGELOG.md` which are expected and must not be modified
2. **Run `bun run release:validate`**: Check plugin/marketplace consistency, skill counts
3. **Run `bun test`**: Ensure converter tests still pass (they use skill names as fixtures)
4. **Verify `lfg`/`slfg` references**: Confirm they reference stable `/rg:plan` and `/deepen-plan` (they already do -- no change needed)
5. **Verify `rg:brainstorm` handoff**: Confirms it hands off to stable `/rg:plan` (already does -- no change needed)
6. **Verify `rg:work` compatibility**: Plans from promoted skills use `-plan.md` suffix, same as before

## Files Changed

| File | Action | Notes |
|------|--------|-------|
| `skills/rg-plan/SKILL.md` | Replace | Beta content with stable frontmatter |
| `skills/deepen-plan/SKILL.md` | Replace | Beta content with stable frontmatter |
| `skills/rg-plan-beta/` | Delete | Entire directory |
| `skills/deepen-plan-beta/` | Delete | Entire directory |
| `skills/rg-work-beta/SKILL.md` | Edit | Remove `rg:plan-beta or` reference at line 450 |
| `README.md` | Edit | Remove Beta Skills section, verify counts and descriptions |

## Files NOT Changed (verified safe)

These files reference stable `rg:plan` or `deepen-plan` and require **no changes** because stable names are preserved:

- `skills/lfg/SKILL.md` -- calls `/rg:plan` and `/deepen-plan`
- `skills/slfg/SKILL.md` -- calls `/rg:plan` and `/deepen-plan`
- `skills/rg-brainstorm/SKILL.md` -- hands off to `/rg:plan`
- `skills/rg-ideate/SKILL.md` -- explains pipeline
- `skills/document-review/SKILL.md` -- references `/rg:plan`
- `skills/rg-compound/SKILL.md` -- references `/rg:plan`
- `skills/rg-review/SKILL.md` -- references `/rg:plan`
- `AGENTS.md` -- lists `rg:plan`
- `agents/research/learnings-researcher.md` -- references both
- `agents/research/git-history-analyzer.md` -- references `/rg:plan`
- `agents/review/code-simplicity-reviewer.md` -- references `/rg:plan`
- `plugin.json` / `marketplace.json` -- no individual skill listings

## Acceptance Criteria

- [ ] `skills/rg-plan/SKILL.md` contains the beta planning approach (decision-first, phase-structured)
- [ ] `skills/deepen-plan/SKILL.md` contains the beta deepening approach (selective stress-test, risk-weighted)
- [ ] No `disable-model-invocation` in either promoted skill
- [ ] No `[BETA]` prefix in either description
- [ ] No remaining `-beta` references in any file under `plugins/rg-engineering/`
- [ ] `skills/rg-plan-beta/` and `skills/deepen-plan-beta/` directories deleted
- [ ] README Beta Skills section removed
- [ ] `bun run release:validate` passes
- [ ] `bun test` passes

## Sources

- **Promotion checklist:** `docs/solutions/skill-design/beta-skills-framework.md` (steps 1-9)
- **Versioning rules:** `docs/solutions/plugin-versioning-requirements.md` (no manual version bumps)
