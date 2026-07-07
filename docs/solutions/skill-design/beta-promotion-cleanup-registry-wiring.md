---
title: "Beta-to-stable skill promotion: wiring legacy cleanup so the stale beta dir is actually swept"
category: skill-design
date: 2026-06-28
module: legacy-cleanup
problem_type: convention
component: tooling
severity: medium
applies_when:
  - "promoting a skill from beta (rg-X-beta) to stable (rg-X) and registering the old dir for legacy flat-install cleanup"
tags:
  - skill-promotion
  - legacy-cleanup
  - beta-rename
  - stale-skill-dirs
  - flat-install
related:
  - docs/solutions/skill-design/beta-skills-framework.md
  - docs/solutions/skill-design/beta-promotion-orchestration-contract.md
---

## Context

When a rg-engineering skill graduates from beta to stable, its directory is renamed `rg-X-beta` -> `rg-X`. Users who installed the plugin before the rename will have a stale `rg-X-beta/` directory sitting next to the new `rg-X/` in their flat-install layout. `src/utils/legacy-cleanup.ts` is supposed to sweep that stale dir on the next upgrade.

The trap: the two edits that *look* sufficient — adding the old name to `STALE_SKILL_DIRS` and adding a `LEGACY_SKILL_DESCRIPTION_ALIASES` entry — are a **silent no-op** on their own. The existing precedent (`rg-polish-beta`) shipped with exactly that incomplete wiring, so its cleanup never ran, and there was no error, log, or failing test to reveal it. The `rg-dogfood-beta -> rg-dogfood` promotion would have inherited the same dead code by copying the precedent.

## Guidance

A correct beta-to-stable rename requires **four edits across two files plus a regression test**. The load-bearing one is easy to miss.

### How the mechanism works

`cleanupStaleSkillDirs(skillsRoot)` iterates `STALE_SKILL_DIRS` and, for each name, calls:

```ts
isLegacyPluginOwned(targetPath, skills.get(name), null)
```

`isLegacyPluginOwned` guards early:

```ts
if (!expectedDescription) return false
```

Only *after* that guard does it read the on-disk `SKILL.md` description and compare it against `expectedDescription` **plus** any `LEGACY_SKILL_DESCRIPTION_ALIASES[basename]` entries. So if `expectedDescription` is `undefined`, the alias list is never consulted.

`expectedDescription` comes from the `skills` map seeded in `loadLegacyFingerprints()`. For each `STALE_SKILL_DIRS` name:

```ts
const currentPath = skillIndex.get(currentSkillNameForLegacy(name))
if (currentPath) {
  // seed = the currently-shipping skill's CURRENT description
} else if (LEGACY_ONLY_SKILL_DESCRIPTIONS[name]) {
  // seed = hardcoded last-shipped description (for FULLY-RETIRED skills, no replacement)
} else {
  // seed = undefined -> isLegacyPluginOwned bails immediately
}
```

`currentSkillNameForLegacy` has explicit `case`s for skills renamed to a *different* name, and a default that returns any `rg-`-prefixed name unchanged:

```ts
default:
  return legacyName.startsWith("rg-") ? legacyName : `rg-${legacyName}`
```

So `currentSkillNameForLegacy("rg-dogfood-beta")` returns `"rg-dogfood-beta"`. After the rename that name is no longer in the skill index, the seed stays `undefined`, the alias is never reached, and nothing is swept.

### The correct wiring

**1 — `STALE_SKILL_DIRS` (`src/utils/legacy-cleanup.ts`)** — register the old name:

```ts
// rg-dogfood-beta -> rg-dogfood (promoted to stable)
"rg-dogfood-beta",
```

**2 (load-bearing) — `currentSkillNameForLegacy` (`src/utils/legacy-cleanup.ts`)** — map the beta name to the shipping stable name so the seed resolves to a real description:

```ts
case "rg-polish-beta":
  return "rg-polish"
case "rg-dogfood-beta":
  return "rg-dogfood"
```

**3 — `LEGACY_SKILL_DESCRIPTION_ALIASES` (`src/utils/legacy-cleanup.ts`)** — the seed is now the *new* stable description, but the stale dir on disk still carries the *old* beta description. Add the **verbatim last-shipped beta `description:`** so the old-on-disk file matches:

```ts
"rg-dogfood-beta": [
  "[BETA] Hands-off end-to-end branch dogfood pass with browser testing, auto-fixes, regression tests, and fix commits.",
],
```

**4 — `EXTRA_LEGACY_ARTIFACTS_BY_PLUGIN["rg-engineering"]` (`src/data/plugin-legacy-artifacts.ts`)** — register the name with the universal artifact sweeper:

```ts
"rg-dogfood-beta",
```

**5 — Regression test (`tests/legacy-cleanup.test.ts`)** — mirror the existing "removes rg-review and rg-document-review (renamed skills)" test, but create the stale dir with its **old beta description** (the realistic upgrade state), not the current stable one. A test seeded with the current description would pass for the wrong reason and would not catch a missing step 2:

```ts
test("removes promoted-from-beta skill dirs via their last-shipped beta description (rg-dogfood-beta, rg-polish-beta)", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "cleanup-beta-promoted-"))
  await createDir(
    path.join(root, "rg-dogfood-beta"),
    skillContent(
      "rg-dogfood-beta",
      "[BETA] Hands-off end-to-end branch dogfood pass with browser testing, auto-fixes, regression tests, and fix commits.",
    ),
  )
  await createDir(
    path.join(root, "rg-polish-beta"),
    skillContent(
      "rg-polish-beta",
      "Start the dev server, open the feature in a browser, and iterate on improvements together. Manual invocation only — type /rg-polish to run it.",
    ),
  )

  const removed = await cleanupStaleSkillDirs(root)

  expect(removed).toBe(2)
  expect(await exists(path.join(root, "rg-dogfood-beta"))).toBe(false)
  expect(await exists(path.join(root, "rg-polish-beta"))).toBe(false)
})
```

`cleanupStaleSkillDirs(root)` takes a single argument; it loads the fingerprint map internally.

## Why This Matters

Cleanup is the only thing stopping stale beta dirs from accumulating in users' flat installs after an upgrade. A lingering `rg-dogfood-beta/` next to `rg-dogfood/` means two skill definitions for the same concept — listing conflicts and extra tokens loaded on every invocation. The failure mode is silent: no error, no log, the dir just stays.

The `rg-polish-beta` cleanup had been shipped live and broken. The existing suite never caught it because the only rename tests (`rg-review -> rg-code-review`, `rg-document-review -> rg-doc-review`) all use names with explicit `currentSkillNameForLegacy` cases — so they pass through step 2 by construction. Any beta promotion that copies the `rg-polish-beta` pattern as a template inherits the same no-op. This wiring was fixed for both `rg-dogfood-beta` and `rg-polish-beta` in the dogfood promotion.

## When to Apply

Apply this every time a skill is promoted from beta to stable (`rg-X-beta` renamed to `rg-X`). Land all four edits plus the test in the same PR that performs the rename — not a follow-up. It does **not** apply to fully-retired skills with no replacement; those seed their fingerprint via `LEGACY_ONLY_SKILL_DESCRIPTIONS` instead of the `currentSkillNameForLegacy` path.

## Examples

### Before — the incomplete `rg-polish-beta` pattern (silent no-op)

```ts
// src/utils/legacy-cleanup.ts
export const STALE_SKILL_DIRS = [
  "rg-polish-beta",          // step 1: present
]
// step 2: MISSING — no currentSkillNameForLegacy case, so the default returns
// "rg-polish-beta" (not a shipping skill) -> seed undefined -> isLegacyPluginOwned
// bails before the alias is read -> nothing swept
const LEGACY_SKILL_DESCRIPTION_ALIASES = {
  "rg-polish-beta": [ /* present, but unreachable */ ],
}
```

Steps 1, 3, 4 present; step 2 missing; step 5 absent. Stale `rg-polish-beta/` dirs survive upgrades forever. No error, no test failure.

### After — complete wiring

Add the `currentSkillNameForLegacy` case (step 2) so the seed resolves to the stable skill's current description, keep the alias (step 3) so the old-on-disk description still matches, and add the regression test (step 5) that proves the sweep fires. Result: `bun test` 1600 pass / 0 fail; `bun run release:validate` in sync; stale beta dirs swept on the first upgrade after the rename.
