---
date: 2026-03-27
topic: rg-skill-prefix-rename
---

# Consistent `rg-` Prefix for All Skills and Agents

## Problem Frame

As the Claude Code plugin ecosystem grows, generic skill names like `setup`, `plan`, `review`, and `frontend-design` collide when users have multiple plugins installed. Typing `/plan` surfaces every plugin's plan skill, forcing users to scan descriptions. Agent names also collide across plugins — generic names like `adversarial-reviewer` or `security-reviewer` are common enough that multiple plugins could define them. The rg-engineering plugin currently uses an inconsistent mix: 8 core workflow skills have a `rg:` colon prefix, while 33 others have no prefix at all. Agents use verbose 3-segment references (`rg-engineering:<category>:<agent-name>`) that are cumbersome and can be simplified now that agents will have a unique `rg-` prefix. This creates collision risk, a confusing naming taxonomy, and unnecessarily verbose agent references.

Standardizing on a `rg-` hyphen prefix for all owned skills and agents eliminates collisions, creates a consistent namespace, simplifies agent references, and removes the colon character that requires filesystem sanitization on Windows.

Related: [GitHub Issue #337](https://github.com/Lukas-Rdt/rg-engineering-plugin/issues/337)

## Requirements

When doing renames of files and folders, you are required to use `git mv` whenever possible for simplicity and explicit intent and history preservation.  You can fallback provided you notify when it happens and why.

### Naming Rules

- R1. All rg-engineering-owned skills and agents adopt a `rg-` hyphen prefix
- R2. Skills currently using `rg:` colon prefix change to `rg-` hyphen prefix (e.g., `rg:plan` -> `rg-plan`)
- R3. Skills and Agents currently without a prefix get `rg-` prepended (e.g., `setup` -> `rg-setup`, `frontend-design` -> `rg-frontend-design`, `repo-research-analyst` -> `rg-repo-research-analyst`)
- R4. `git-*` skills replace the `git-` prefix with `rg-` (e.g., `git-commit` -> `rg-commit`, `git-worktree` -> `rg-worktree`)
- R5. `report-bug-ce` normalizes to `rg-report-bug` (drops redundant suffix)

### Exclusions

- R6. `agent-browser` and `rclone` are excluded (sourced from upstream, not our skills)
- R7. `lfg` and `slfg` are excluded from renaming (short memorable workflow entry points), but their internal skill invocations must be updated per R12	

### Propagation

- R8. The skill and agent frontmatter `name:` field must match after rename (no more colon-vs-hyphen divergence). Directories need to reflect the new names as well when applicable.
- R9. All cross-references updated: skill-to-skill invocations (`/rg:plan` -> `/rg-plan`), fully-qualified references (`/rg-engineering:todo-resolve` -> `/rg-engineering:rg-todo-resolve`), `Skill("rg-engineering:...")` programmatic invocations, prose mentions, skill `description:` frontmatter fields, and intra-skill path references (`${CLAUDE_PLUGIN_ROOT}/skills/<old-name>/...`)
- R10. Active documentation updated: root README, plugin README, AGENTS.md. Note: the AGENTS.md "Why `rg:`?" rationale section (lines 53-60) needs a conceptual rewrite explaining the `rg-` convention, not just find-and-replace. Historical docs in `docs/` (past brainstorms, plans, solutions) are left as-is -- they are records of past decisions.
- R11. Agent prompt files updated where they reference skill names.
- R11b. Skill prompt files updated where they reference Agent names.
- R11c. Agent references drop the `rg-engineering:` plugin prefix and keep the category. The agent name itself gets the `rg-` prefix. (e.g. `rg-engineering:review:adversarial-reviewer` -> `review:rg-adversarial-reviewer`)
- R12. lfg and slfg orchestration chains updated to use new skill names (lfg/slfg themselves are not renamed per R7, but their internal skill and agent invocations must reflect new names)
- R13. Converter infrastructure preserved: `sanitizePathName()` and colon-handling logic stays as future protection, not removed. Add a test assertion that no skill `name:` field contains a colon, so the sanitizer is defense-in-depth rather than a silent workaround.
- R17. Codex converter's `isCanonicalCodexWorkflowSkill()` and `toCanonicalWorkflowSkillName()` in `src/converters/claude-to-codex.ts` updated to match `rg-` prefix pattern (currently hardcodes `rg:` prefix check). Related test fixtures in `tests/codex-converter.test.ts` and `tests/codex-writer.test.ts` updated accordingly.

### Testing

- R14. Path sanitization tests updated to reflect new naming (collision detection still works)
- R15. `bun test` passes after all changes
- R16. `bun run release:validate` passes after all changes
- R18. Converter test fixtures that hardcode `rg:plan` etc. updated to `rg-plan` where they test rg-engineering plugin behavior. Fixtures testing abstract colon-handling for other plugins may remain.
- R19. Sanity check and for every skill and agent name, grep to confirm new names are correct and old names do not persist except in historical planning, requirements, etc docs.

---

## Complete Rename Map

### Excluded (no change) - 4 skills

| Current Name | Reason |
|---|---|
| `agent-browser` | External/upstream |
| `rclone` | External/upstream |
| `lfg` | Exception (memorable name) |
| `slfg` | Exception (memorable name) |

### `rg:` -> `rg-` (frontmatter only, dirs already match) - 8 skills

| Current Name | New Name | Dir Rename? |
|---|---|---|
| `rg:brainstorm` | `rg-brainstorm` | No |
| `rg:compound` | `rg-compound` | No |
| `rg:compound-refresh` | `rg-compound-refresh` | No |
| `rg:ideate` | `rg-ideate` | No |
| `rg:plan` | `rg-plan` | No |
| `rg:review` | `rg-review` | No |
| `rg:work` | `rg-work` | No |
| `rg:work-beta` | `rg-work-beta` | No |

### `git-*` -> `rg-*` (replace prefix) - 4 skills

| Current Name | New Name | Dir Rename |
|---|---|---|
| `git-clean-gone-branches` | `rg-clean-gone-branches` | `git-clean-gone-branches/` -> `rg-clean-gone-branches/` |
| `git-commit` | `rg-commit` | `git-commit/` -> `rg-commit/` |
| `git-commit-push-pr` | `rg-commit-push-pr` | `git-commit-push-pr/` -> `rg-commit-push-pr/` |
| `git-worktree` | `rg-worktree` | `git-worktree/` -> `rg-worktree/` |

### Special normalization - 1 skill

| Current Name | New Name | Dir Rename |
|---|---|---|
| `report-bug-ce` | `rg-report-bug` | `report-bug-ce/` -> `rg-report-bug/` |

### Standard prefix addition - 24 skills

| Current Name | New Name | Dir Rename |
|---|---|---|
| `agent-native-architecture` | `rg-agent-native-architecture` | `agent-native-architecture/` -> `rg-agent-native-architecture/` |
| `agent-native-audit` | `rg-agent-native-audit` | `agent-native-audit/` -> `rg-agent-native-audit/` |
| `andrew-kane-gem-writer` | `rg-andrew-kane-gem-writer` | `andrew-kane-gem-writer/` -> `rg-andrew-kane-gem-writer/` |
| `changelog` | `rg-changelog` | `changelog/` -> `rg-changelog/` |
| `claude-permissions-optimizer` | `rg-claude-permissions-optimizer` | `claude-permissions-optimizer/` -> `rg-claude-permissions-optimizer/` |
| `deploy-docs` | `rg-deploy-docs` | `deploy-docs/` -> `rg-deploy-docs/` |
| `dhh-rails-style` | `rg-dhh-rails-style` | `dhh-rails-style/` -> `rg-dhh-rails-style/` |
| `document-review` | `rg-document-review` | `document-review/` -> `rg-document-review/` |
| `dspy-ruby` | `rg-dspy-ruby` | `dspy-ruby/` -> `rg-dspy-ruby/` |
| `every-style-editor` | `rg-every-style-editor` | `every-style-editor/` -> `rg-every-style-editor/` |
| `feature-video` | `rg-feature-video` | `feature-video/` -> `rg-feature-video/` |
| `frontend-design` | `rg-frontend-design` | `frontend-design/` -> `rg-frontend-design/` |
| `gemini-imagegen` | `rg-gemini-imagegen` | `gemini-imagegen/` -> `rg-gemini-imagegen/` |
| `onboarding` | `rg-onboarding` | `onboarding/` -> `rg-onboarding/` |
| `orchestrating-swarms` | `rg-orchestrating-swarms` | `orchestrating-swarms/` -> `rg-orchestrating-swarms/` |
| `proof` | `rg-proof` | `proof/` -> `rg-proof/` |
| `reproduce-bug` | `rg-reproduce-bug` | `reproduce-bug/` -> `rg-reproduce-bug/` |
| `resolve-pr-feedback` | `rg-resolve-pr-feedback` | `resolve-pr-feedback/` -> `rg-resolve-pr-feedback/` |
| `setup` | `rg-setup` | `setup/` -> `rg-setup/` |
| `test-browser` | `rg-test-browser` | `test-browser/` -> `rg-test-browser/` |
| `test-xcode` | `rg-test-xcode` | `test-xcode/` -> `rg-test-xcode/` |
| `todo-create` | `rg-todo-create` | `todo-create/` -> `rg-todo-create/` |
| `todo-resolve` | `rg-todo-resolve` | `todo-resolve/` -> `rg-todo-resolve/` |
| `todo-triage` | `rg-todo-triage` | `todo-triage/` -> `rg-todo-triage/` |

**Total: 37 skills renamed, 4 excluded (41 skills total)**

### Agent renames - 49 agents

All agents are renamed with `rg-` prefix within their existing category subdirs. The `rg-engineering:` plugin prefix is dropped from references, keeping the `<category>:rg-<agent-name>` format. Category subdirs are preserved for organization.

| Current File | New File | Old Reference | New Reference |
|---|---|---|---|
| `agents/design/design-implementation-reviewer.md` | `agents/design/rg-design-implementation-reviewer.md` | `rg-engineering:design:design-implementation-reviewer` | `design:rg-design-implementation-reviewer` |
| `agents/design/design-iterator.md` | `agents/design/rg-design-iterator.md` | `rg-engineering:design:design-iterator` | `design:rg-design-iterator` |
| `agents/design/figma-design-sync.md` | `agents/design/rg-figma-design-sync.md` | `rg-engineering:design:figma-design-sync` | `design:rg-figma-design-sync` |
| `agents/docs/ankane-readme-writer.md` | `agents/docs/rg-ankane-readme-writer.md` | `rg-engineering:docs:ankane-readme-writer` | `docs:rg-ankane-readme-writer` |
| `agents/document-review/adversarial-document-reviewer.md` | `agents/document-review/rg-adversarial-document-reviewer.md` | `rg-engineering:document-review:adversarial-document-reviewer` | `document-review:rg-adversarial-document-reviewer` |
| `agents/document-review/coherence-reviewer.md` | `agents/document-review/rg-coherence-reviewer.md` | `rg-engineering:document-review:coherence-reviewer` | `document-review:rg-coherence-reviewer` |
| `agents/document-review/design-lens-reviewer.md` | `agents/document-review/rg-design-lens-reviewer.md` | `rg-engineering:document-review:design-lens-reviewer` | `document-review:rg-design-lens-reviewer` |
| `agents/document-review/feasibility-reviewer.md` | `agents/document-review/rg-feasibility-reviewer.md` | `rg-engineering:document-review:feasibility-reviewer` | `document-review:rg-feasibility-reviewer` |
| `agents/document-review/product-lens-reviewer.md` | `agents/document-review/rg-product-lens-reviewer.md` | `rg-engineering:document-review:product-lens-reviewer` | `document-review:rg-product-lens-reviewer` |
| `agents/document-review/scope-guardian-reviewer.md` | `agents/document-review/rg-scope-guardian-reviewer.md` | `rg-engineering:document-review:scope-guardian-reviewer` | `document-review:rg-scope-guardian-reviewer` |
| `agents/document-review/security-lens-reviewer.md` | `agents/document-review/rg-security-lens-reviewer.md` | `rg-engineering:document-review:security-lens-reviewer` | `document-review:rg-security-lens-reviewer` |
| `agents/research/best-practices-researcher.md` | `agents/research/rg-best-practices-researcher.md` | `rg-engineering:research:best-practices-researcher` | `research:rg-best-practices-researcher` |
| `agents/research/framework-docs-researcher.md` | `agents/research/rg-framework-docs-researcher.md` | `rg-engineering:research:framework-docs-researcher` | `research:rg-framework-docs-researcher` |
| `agents/research/git-history-analyzer.md` | `agents/research/rg-git-history-analyzer.md` | `rg-engineering:research:git-history-analyzer` | `research:rg-git-history-analyzer` |
| `agents/research/issue-intelligence-analyst.md` | `agents/research/rg-issue-intelligence-analyst.md` | `rg-engineering:research:issue-intelligence-analyst` | `research:rg-issue-intelligence-analyst` |
| `agents/research/learnings-researcher.md` | `agents/research/rg-learnings-researcher.md` | `rg-engineering:research:learnings-researcher` | `research:rg-learnings-researcher` |
| `agents/research/repo-research-analyst.md` | `agents/research/rg-repo-research-analyst.md` | `rg-engineering:research:repo-research-analyst` | `research:rg-repo-research-analyst` |
| `agents/review/adversarial-reviewer.md` | `agents/review/rg-adversarial-reviewer.md` | `rg-engineering:review:adversarial-reviewer` | `review:rg-adversarial-reviewer` |
| `agents/review/agent-native-reviewer.md` | `agents/review/rg-agent-native-reviewer.md` | `rg-engineering:review:agent-native-reviewer` | `review:rg-agent-native-reviewer` |
| `agents/review/api-contract-reviewer.md` | `agents/review/rg-api-contract-reviewer.md` | `rg-engineering:review:api-contract-reviewer` | `review:rg-api-contract-reviewer` |
| `agents/review/architecture-strategist.md` | `agents/review/rg-architecture-strategist.md` | `rg-engineering:review:architecture-strategist` | `review:rg-architecture-strategist` |
| `agents/review/cli-agent-readiness-reviewer.md` | `agents/review/rg-cli-agent-readiness-reviewer.md` | `rg-engineering:review:cli-agent-readiness-reviewer` | `review:rg-cli-agent-readiness-reviewer` |
| `agents/review/cli-readiness-reviewer.md` | `agents/review/rg-cli-readiness-reviewer.md` | `rg-engineering:review:cli-readiness-reviewer` | `review:rg-cli-readiness-reviewer` |
| `agents/review/code-simplicity-reviewer.md` | `agents/review/rg-code-simplicity-reviewer.md` | `rg-engineering:review:code-simplicity-reviewer` | `review:rg-code-simplicity-reviewer` |
| `agents/review/correctness-reviewer.md` | `agents/review/rg-correctness-reviewer.md` | `rg-engineering:review:correctness-reviewer` | `review:rg-correctness-reviewer` |
| `agents/review/data-integrity-guardian.md` | `agents/review/rg-data-integrity-guardian.md` | `rg-engineering:review:data-integrity-guardian` | `review:rg-data-integrity-guardian` |
| `agents/review/data-migration-expert.md` | `agents/review/rg-data-migration-expert.md` | `rg-engineering:review:data-migration-expert` | `review:rg-data-migration-expert` |
| `agents/review/data-migrations-reviewer.md` | `agents/review/rg-data-migrations-reviewer.md` | `rg-engineering:review:data-migrations-reviewer` | `review:rg-data-migrations-reviewer` |
| `agents/review/deployment-verification-agent.md` | `agents/review/rg-deployment-verification-agent.md` | `rg-engineering:review:deployment-verification-agent` | `review:rg-deployment-verification-agent` |
| `agents/review/dhh-rails-reviewer.md` | `agents/review/rg-dhh-rails-reviewer.md` | `rg-engineering:review:dhh-rails-reviewer` | `review:rg-dhh-rails-reviewer` |
| `agents/review/julik-frontend-races-reviewer.md` | `agents/review/rg-julik-frontend-races-reviewer.md` | `rg-engineering:review:julik-frontend-races-reviewer` | `review:rg-julik-frontend-races-reviewer` |
| `agents/review/kieran-python-reviewer.md` | `agents/review/rg-kieran-python-reviewer.md` | `rg-engineering:review:kieran-python-reviewer` | `review:rg-kieran-python-reviewer` |
| `agents/review/kieran-rails-reviewer.md` | `agents/review/rg-kieran-rails-reviewer.md` | `rg-engineering:review:kieran-rails-reviewer` | `review:rg-kieran-rails-reviewer` |
| `agents/review/kieran-typescript-reviewer.md` | `agents/review/rg-kieran-typescript-reviewer.md` | `rg-engineering:review:kieran-typescript-reviewer` | `review:rg-kieran-typescript-reviewer` |
| `agents/review/maintainability-reviewer.md` | `agents/review/rg-maintainability-reviewer.md` | `rg-engineering:review:maintainability-reviewer` | `review:rg-maintainability-reviewer` |
| `agents/review/pattern-recognition-specialist.md` | `agents/review/rg-pattern-recognition-specialist.md` | `rg-engineering:review:pattern-recognition-specialist` | `review:rg-pattern-recognition-specialist` |
| `agents/review/performance-oracle.md` | `agents/review/rg-performance-oracle.md` | `rg-engineering:review:performance-oracle` | `review:rg-performance-oracle` |
| `agents/review/performance-reviewer.md` | `agents/review/rg-performance-reviewer.md` | `rg-engineering:review:performance-reviewer` | `review:rg-performance-reviewer` |
| `agents/review/previous-comments-reviewer.md` | `agents/review/rg-previous-comments-reviewer.md` | `rg-engineering:review:previous-comments-reviewer` | `review:rg-previous-comments-reviewer` |
| `agents/review/project-standards-reviewer.md` | `agents/review/rg-project-standards-reviewer.md` | `rg-engineering:review:project-standards-reviewer` | `review:rg-project-standards-reviewer` |
| `agents/review/reliability-reviewer.md` | `agents/review/rg-reliability-reviewer.md` | `rg-engineering:review:reliability-reviewer` | `review:rg-reliability-reviewer` |
| `agents/review/schema-drift-detector.md` | `agents/review/rg-schema-drift-detector.md` | `rg-engineering:review:schema-drift-detector` | `review:rg-schema-drift-detector` |
| `agents/review/security-reviewer.md` | `agents/review/rg-security-reviewer.md` | `rg-engineering:review:security-reviewer` | `review:rg-security-reviewer` |
| `agents/review/security-sentinel.md` | `agents/review/rg-security-sentinel.md` | `rg-engineering:review:security-sentinel` | `review:rg-security-sentinel` |
| `agents/review/testing-reviewer.md` | `agents/review/rg-testing-reviewer.md` | `rg-engineering:review:testing-reviewer` | `review:rg-testing-reviewer` |
| `agents/workflow/bug-reproduction-validator.md` | `agents/workflow/rg-bug-reproduction-validator.md` | `rg-engineering:workflow:bug-reproduction-validator` | `workflow:rg-bug-reproduction-validator` |
| `agents/workflow/lint.md` | `agents/workflow/rg-lint.md` | `rg-engineering:workflow:lint` | `workflow:rg-lint` |
| `agents/workflow/pr-comment-resolver.md` | `agents/workflow/rg-pr-comment-resolver.md` | `rg-engineering:workflow:pr-comment-resolver` | `workflow:rg-pr-comment-resolver` |
| `agents/workflow/spec-flow-analyzer.md` | `agents/workflow/rg-spec-flow-analyzer.md` | `rg-engineering:workflow:spec-flow-analyzer` | `workflow:rg-spec-flow-analyzer` |

**Total: 49 agents renamed in place (category subdirs preserved)**

---

## Success Criteria

- Every owned skill (except the 4 exclusions) has a `rg-` prefix in both directory name and frontmatter
- Every agent has a `rg-` prefix in filename and frontmatter within its category subdir
- All cross-references across skills, agents, docs, and orchestration chains use new names
- All 3-segment agent references (`rg-engineering:<category>:<agent>`) simplified to `<category>:rg-<agent>`
- `bun test` and `bun run release:validate` pass
- No colon characters remain in any skill `name:` field (though sanitization infra is preserved)
- Slash command invocations work with new names (e.g., `/rg-plan`)
- lfg and slfg orchestration chains reference new skill and agent names (R12)
- Grep sanity check confirms no old names persist in active code (R19)

## Scope Boundaries

- **Not removing sanitization infrastructure** — `sanitizePathName()` stays as future protection for any colons
- **Not adding backward-compatibility aliases** — No alias mechanism exists; this is a clean break
- **Not renaming external skills** — `agent-browser` and `rclone` are upstream
- **Not renaming lfg/slfg** — Kept as memorable exceptions
- **Historical docs are not updated** — Past brainstorms, plans, and solutions in `docs/` reference old names; this is expected and acceptable (they're historical records). R10 applies only to active docs (README, AGENTS.md), not historical docs.

## Key Decisions

- **Hyphen over colon**: `rg-` not `rg:` — eliminates filesystem sanitization divergence and is more portable
- **git-* replaces prefix**: `git-commit` -> `rg-commit` rather than `rg-git-commit` — avoids verbose double-prefix
- **report-bug-ce normalizes**: Drops redundant `-ce` suffix -> `rg-report-bug`
- **Agents renamed in place**: Category subdirs preserved for organization. Agent files get `rg-` prefix within their category dir. 3-segment refs drop plugin prefix: `rg-engineering:review:adversarial-reviewer` -> `review:rg-adversarial-reviewer`.
- **Major version bump**: This is a breaking change; plugin version will bump the major version to signal it.
- **Clean break, no aliases**: Users learn new names immediately; the old names stop working
- **Preserve sanitization**: Keep colon-handling code even though no skills currently use colons — future-proofing
- **git mv required**: All renames use `git mv` for history preservation. Fallback only with notification.

## Dependencies / Assumptions

- Skill directory renames via `git mv` preserve git history. Commit strategy (single vs multiple commits) deferred to planning.
- lfg/slfg reference other skills both by short name (`/rg:plan`) and fully-qualified (`/rg-engineering:todo-resolve`) — both patterns need updating
- README may contain stale skill references (e.g., `/sync`) — clean up during R10 documentation pass

## Outstanding Questions

### Deferred to Planning

- [Affects R9][Needs research] Exact inventory of every cross-reference in every SKILL.md, agent file, and doc that needs updating — planner should grep comprehensively
- [Affects R8][Technical] Should directory renames be done via `git mv` in a single commit or spread across multiple commits for reviewability?
- [Affects R14, R18][Technical] What specific test assertions reference skill names and need updating? Which test fixtures test rg-engineering behavior (should update) vs abstract colon-handling (may keep)?

## Next Steps

-> `/rg:plan` for structured implementation planning (will itself be renamed to `/rg-plan` as part of this work)
