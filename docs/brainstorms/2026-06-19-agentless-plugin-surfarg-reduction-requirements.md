---
title: "Agentless plugin surface reduction"
date: 2026-06-19
topic: agentless-plugin-surface-reduction
---

# Agentless Plugin Surface Reduction

## Summary

Move RG Engineering away from standalone plugin agents and toward skill-local subagent prompt assets. Public skills should represent user-facing jobs, not convenience wrappers around specialist agents. Surviving skills that need subagents will dispatch generic subagents using prompt definitions stored inside that skill's own directory, such as `references/agents/*.md` or `references/personas/*.md`.

The goal is maximum deletion: remove redundant public skills, delete `plugins/rg-engineering/agents/`, and make the Codex plugin fully self-contained through native skills rather than a hybrid native-skill plus Bun-installed custom-agent setup.

## Problem Frame

RG Engineering currently defines specialist behavior in two forms:

- standalone agent files under `plugins/rg-engineering/agents/`
- skill-local prompt/persona files under skill `references/` directories

The standalone-agent model creates portability and install friction. Codex native plugins load the CE skills, but standalone agent registration has required a second Bun install path that converts Claude Markdown agents to Codex TOML agents. That split is brittle, profile-sensitive, and prevents the Codex plugin from behaving as a normal self-contained plugin.

Other plugin ecosystems, including Superpowers, use a cleaner pattern: the skill owns the workflow and carries prompt templates for subagents in its own directory. That gives the skill custom subagent behavior without requiring a platform-level custom-agent registry.

## Decisions

- **Delete standalone CE agents.** Remove `plugins/rg-engineering/agents/` after moving still-needed behavior into surviving skills as local prompt assets.
- **Delete redundant public skills.** Public skills must map to real user jobs. Skills that only make an agent easy to call should be removed.
- **Prefer skill-local duplication over shared agent infrastructure.** Duplicating prompt text across a few skills is acceptable when it removes cross-platform agent registration and makes each skill self-contained.
- **Do not preserve compatibility wrappers.** This migration intentionally uses maximum deletion. Removed skills and agents go into legacy cleanup registries; no deprecated skill stubs or one-release grace wrappers.
- **Keep generic converter support where it serves non-CE plugins.** The CLI may still convert agents for other plugin payloads, but CE-specific Codex installation should no longer require generated custom agents.

## Skill Decisions

### Delete

| Skill | Disposition |
| --- | --- |
| `rg-agent-native-audit` | Delete; fold useful checklist material into `rg-agent-native-architecture` or `rg-code-review` only if needed. |
| `rg-clean-gone-branches` | Delete. |
| `rg-dhh-rails-style` | Delete. |
| `rg-frontend-design` | Delete; salvage durable frontend rules into `rg-work`, `rg-work-beta`, and `rg-polish` where relevant. |
| `rg-gemini-imagegen` | Delete. |
| `rg-release-notes` | Delete. |
| `rg-report-bug` | Delete. |
| `rg-sessions` | Delete as a public product surface; fold discovery/extraction scripts and historian synthesis into `rg-compound` only for compounding/documentation workflows. |
| `rg-slack-research` | Delete; fold Slack research prompts into `rg-brainstorm`, `rg-ideate`, and `rg-plan`. |
| `rg-update` | Delete. |

### Keep

| Skill | Notes |
| --- | --- |
| `rg-agent-native-architecture` | Keep as a domain guide for agent-native systems. |
| `rg-brainstorm` | Keep; localize Slack research prompt. |
| `rg-code-review` | Keep; localize code-review personas. |
| `rg-commit` | Keep. |
| `rg-commit-push-pr` | Keep. |
| `rg-compound` | Keep; absorb session-history workflow. |
| `rg-compound-refresh` | Keep. |
| `rg-debug` | Keep. |
| `rg-demo-reel` | Keep. |
| `rg-doc-review` | Keep; localize document-review personas. |
| `rg-dogfood-beta` | Keep. |
| `rg-ideate` | Keep; localize research prompts. |
| `rg-optimize` | Keep; localize research prompts. |
| `rg-plan` | Keep; localize research and deepening prompts. |
| `rg-polish` | Keep; absorb frontend-design rules where useful. |
| `rg-product-pulse` | Keep. |
| `rg-promote` | Keep. |
| `rg-proof` | Keep. |
| `rg-resolve-pr-feedback` | Keep; localize PR comment resolver prompt. |
| `rg-riffrec-feedback-analysis` | Keep. |
| `rg-setup` | Keep. |
| `rg-simplify-code` | Keep. |
| `rg-strategy` | Keep. |
| `rg-test-browser` | Keep. |
| `rg-test-xcode` | Keep. |
| `rg-work` | Keep; localize Figma/design-sync prompt if still needed. |
| `rg-work-beta` | Keep. |
| `rg-worktree` | Keep. |
| `lfg` | Keep. |

## Agent Decisions

### Preserve as Skill-Local Prompt Assets

| Agent | Destination |
| --- | --- |
| `rg-adversarial-document-reviewer` | `rg-doc-review/references/personas/` |
| `rg-coherence-reviewer` | `rg-doc-review/references/personas/` |
| `rg-design-lens-reviewer` | `rg-doc-review/references/personas/` |
| `rg-feasibility-reviewer` | `rg-doc-review/references/personas/` |
| `rg-product-lens-reviewer` | `rg-doc-review/references/personas/` |
| `rg-scope-guardian-reviewer` | `rg-doc-review/references/personas/` |
| `rg-security-lens-reviewer` | `rg-doc-review/references/personas/` |
| `rg-adversarial-reviewer` | `rg-code-review/references/personas/` |
| `rg-agent-native-reviewer` | `rg-code-review/references/personas/` |
| `rg-api-contract-reviewer` | `rg-code-review/references/personas/` |
| `rg-correctness-reviewer` | `rg-code-review/references/personas/` |
| `rg-julik-frontend-races-reviewer` | `rg-code-review/references/personas/` |
| `rg-maintainability-reviewer` | `rg-code-review/references/personas/` |
| `rg-performance-reviewer` | `rg-code-review/references/personas/` |
| `rg-previous-comments-reviewer` | `rg-code-review/references/personas/` |
| `rg-project-standards-reviewer` | `rg-code-review/references/personas/` |
| `rg-reliability-reviewer` | `rg-code-review/references/personas/` |
| `rg-security-reviewer` | `rg-code-review/references/personas/` |
| `rg-swift-ios-reviewer` | `rg-code-review/references/personas/` |
| `rg-testing-reviewer` | `rg-code-review/references/personas/` |
| `rg-pr-comment-resolver` | `rg-resolve-pr-feedback/references/agents/` |
| `rg-figma-design-sync` | `rg-work/references/agents/` and `rg-work-beta/references/agents/` |
| `rg-session-historian` | `rg-compound/references/agents/`; move supporting scripts from `rg-sessions`. |
| `rg-slack-researcher` | Workflow-tuned local copies in `rg-brainstorm`, `rg-ideate`, and `rg-plan`. |
| `rg-learnings-researcher` | Local copies in `rg-code-review`, `rg-ideate`, `rg-optimize`, and `rg-plan`; slim per workflow if practical. |
| `rg-repo-research-analyst` | Local copies in `rg-plan` and `rg-optimize`. |
| `rg-web-researcher` | Local copies in `rg-plan` and `rg-ideate`. |
| `rg-best-practices-researcher` | Local copies in `rg-plan` and `rg-compound`, or merge with framework-docs prompt where it improves clarity. |
| `rg-framework-docs-researcher` | Local copies in `rg-plan` and `rg-compound`, or merge with best-practices prompt where it improves clarity. |
| `rg-data-migration-reviewer` | Local copies in `rg-code-review` and `rg-plan`. |
| `rg-deployment-verification-agent` | Local copies in `rg-code-review` and `rg-plan`. |
| `rg-data-integrity-guardian` | Local copies in `rg-plan` and `rg-compound`, or merge into nearby data prompts if redundant. |
| `rg-security-sentinel` | Local copies in `rg-plan` and `rg-compound`, or merge into nearby security prompts if redundant. |
| `rg-performance-oracle` | Local copies in `rg-plan` and `rg-compound`, or merge into nearby performance prompts if redundant. |
| `rg-pattern-recognition-specialist` | Local copies in `rg-plan` and `rg-compound`, or fold into repo research/maintainability prompts if redundant. |
| `rg-spec-flow-analyzer` | `rg-plan/references/agents/` |
| `rg-architecture-strategist` | `rg-plan/references/agents/` |
| `rg-git-history-analyzer` | `rg-plan/references/agents/` |
| `rg-issue-intelligence-analyst` | `rg-ideate/references/agents/` |

### Delete

| Agent | Reason |
| --- | --- |
| `rg-ankane-readme-writer` | No runtime consumer. |
| `rg-design-implementation-reviewer` | No runtime consumer. |
| `rg-design-iterator` | Only consumed by deleted `rg-frontend-design`; salvage useful frontend rules elsewhere if needed. |
| `rg-code-simplicity-reviewer` | Delete as a standalone agent; preserve code simplification as an important capability owned by `rg-simplify-code`. |

## Requirements

- R1. No surviving CE skill may dispatch a standalone `rg-*` agent by name.
- R2. Every surviving subagent dispatch must identify a skill-local prompt asset or inline local prompt block as the source of specialist behavior.
- R3. No `plugins/rg-engineering/agents/` directory remains after migration.
- R4. Deleted skills and agents are added to both legacy cleanup registries:
  - `src/utils/legacy-cleanup.ts`
  - `src/data/plugin-legacy-artifacts.ts`
- R5. Plugin README and docs catalogs no longer advertise standalone agents.
- R6. Codex docs no longer require `bunx @every-env/compound-plugin install rg-engineering --to codex` for CE custom agents once CE no longer ships standalone agents.
- R7. CE-specific converter tests are updated so current CE output is skills-only for Codex. Generic non-CE agent conversion coverage may remain.
- R8. `bun run release:validate` passes after manifest, README, and marketplace metadata are updated.
- R9. Behavioral validation for modified skills uses the repo's skill-validation path rather than stale in-session plugin agent dispatch.
- R10. Install documentation is overhauled everywhere it appears, including plugin READMEs, marketplace/catalog README content, and tracked Markdown docs, so users no longer see obsolete custom-agent install guidance.
- R11. `bun test` passes after converter, writer, cleanup, and plugin inventory changes.
- R12. The implementation run is tracked under a single `/goal` objective tied to this requirements doc so long-running work can resume without losing the source of truth.
- R13. High-risk surviving skills produce skill-eval receipts after migration, comparing revised behavior against a pre-migration snapshot where possible.
- R14. Static validation proves there are no surviving CE standalone-agent dependencies: no `plugins/rg-engineering/agents/` directory, no surviving skill dispatches a standalone `rg-*` agent by name, and deleted artifacts are present in both cleanup registries.

## Validation Strategy

Use `/goal` for continuity, not as the proof mechanism. The goal should reference this requirements doc and remain active until implementation, docs, cleanup registries, automated tests, release validation, and eval receipts are complete.

Skill-level evals should use `skill-eval` with `old_skill` baselines for revised skills. Snapshot each target skill before edits when possible, then run the same prompts against the migrated skill and the snapshot. Store artifacts under `/tmp/skill-eval/<skill-name>/<run-id>/` with prompts, transcripts, outputs, grading, benchmark summaries, and review notes.

Minimum eval coverage:

| Skill | Eval purpose |
| --- | --- |
| `rg-code-review` | Prove localized reviewer personas still produce schema-valid, confidence-gated findings on a small diff. |
| `rg-doc-review` | Prove localized document-review personas still classify requirements/plan documents, synthesize findings, and apply safe-auto fixes correctly. |
| `rg-plan` | Prove localized research/deepening prompts still produce a structured plan from a requirements doc without standalone agent dispatch. |
| `rg-compound` | Prove folded session-history support works only inside the compounding workflow and no standalone `rg-sessions` path is required. |
| `rg-brainstorm` | Prove localized Slack research prompt can be invoked as workflow context without the deleted `rg-slack-research` skill. |
| `rg-ideate` | Prove localized research prompts still ground ideas and preserve the expected artifact shape. |
| `rg-optimize` | Prove localized repo/learnings research prompts still support optimization setup without standalone agents. |
| `rg-resolve-pr-feedback` | Prove the localized PR comment resolver prompt still evaluates review feedback and emits actionable resolution guidance. |
| `rg-work` / `rg-work-beta` | Prove any localized Figma/design-sync prompt remains accessible where the work skills need it; explicitly state the stable/beta sync decision. |
| `rg-simplify-code` | Prove code simplification remains available even though `rg-code-simplicity-reviewer` is deleted as a standalone agent. |

Automated validation should include:

- `bun test`
- `bun run release:validate`
- targeted static scans for removed skill names, removed agent names, stale install instructions, and forbidden standalone `rg-*` agent dispatches
- native Codex plugin smoke validation when the local Codex plugin install path is available; otherwise record the unavailable command/tooling as a validation gap

## Open Implementation Notes

- Prefer moving agent bodies mechanically first, then slimming/merging prompts only where the consuming skill's context clearly warrants it.
- For shared prompts, duplication must happen inside each consuming skill directory. Do not create cross-skill shared files.
- The implementation plan should sequence this migration by workflow cluster to keep reviewable diffs:
  1. Delete no-consumer agents and wrapper skills.
  2. Localize `rg-code-review` and `rg-doc-review` personas.
  3. Localize planning/research prompts.
  4. Fold sessions into `rg-compound`.
  5. Localize remaining one-off prompts.
  6. Remove CE standalone agent install assumptions from Codex docs, READMEs, Markdown guides, and tests.
  7. Run static checks, automated tests, release validation, and skill-eval receipts for the high-risk surviving skills.
