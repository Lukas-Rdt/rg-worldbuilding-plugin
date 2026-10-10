# Skill Documentation

End-user-facing documentation for rg-engineering plugin skills. Each page covers the skill's high-level purpose, novel mechanics, use cases, and chain position relative to other skills.

For runtime behavior and contributor reference, the `SKILL.md` in each skill's source folder under `skills/` is authoritative.

---

## The rg-engineering core loop

```text
   [/rg-ideate]       (optional) "What's worth exploring?"
        │
        ▼
┌─→ /rg-brainstorm    "What does this need to be?"
│       │
│       ▼
│   /rg-plan          "What's needed to accomplish this?"
│       │
│       ▼
│   /rg-work          "Build it."
│       │
│       ▼
└── /rg-compound      "Capture what we learned."
```

`/rg-compound` is the closer that makes the loop *compound*: it writes learnings into `docs/solutions/`, which the next iteration's `/rg-brainstorm` and `/rg-plan` read as grounding — that return arrow is the whole point. `/rg-ideate` is an optional prelude for when you don't yet know what to work on. Everything else in this catalog is either an anchor around the loop or an on-demand tool used when a specific need arises — not a step you walk through every time.

---

## The Core Loop

The steps of every engineering iteration. `/rg-ideate` runs only when you need to find a direction first; the other four run in order per piece of work.

| Skill | Description |
|-------|-------------|
| [`/rg-ideate`](./rg-ideate.md) | *Optional first step* — discover strong, qualified directions worth exploring with six conceptual frames, warrant requirement, adversarial filtering |
| [`/rg-brainstorm`](./rg-brainstorm.md) | Define what something should become — collaborative dialogue, named gap lenses, requirements-only unified plan |
| [`/rg-plan`](./rg-plan.md) | Bound execution with guardrails — enrich unified plans with U-IDs, test scenarios, automatic confidence check; WHAT decisions, not HOW code |
| [`/rg-work`](./rg-work.md) | Execute against implementation-ready plan guardrails — figure out the HOW with code in front of you, ship through quality gates |
| [`/rg-compound`](./rg-compound.md) | Close the loop by capturing what you learned into `docs/solutions/` so the next iteration starts smarter — bug track + knowledge track |

---

## Around the Loop

Skills that anchor, feed, or maintain the loop without being steps inside it.

| Skill | Description |
|-------|-------------|
| [`/rg-strategy`](./rg-strategy.md) | Create or maintain `STRATEGY.md` — the upstream anchor read by `rg-ideate`, `rg-brainstorm`, and `rg-plan` as grounding |
| [`/rg-product-pulse`](./rg-product-pulse.md) | Outer feedback loop — single-page time-windowed report on usage, performance, errors, followups; saved to `docs/pulse-reports/` as a timeline |
| [`/rg-sweep`](./rg-sweep.md) | Recurring feedback sweep — ingest Slack/GitHub items (email experimental) since per-source cursors, acknowledge at source, analyze recordings, verify fixes merged, and reconcile an `/lfg`-ready rolling plan |
| [`/rg-compound-refresh`](./rg-compound-refresh.md) | Maintain `docs/solutions/` over time — five outcomes (Keep / Update / Consolidate / Replace / Delete), Interactive + Autofix modes |

---

## On-Demand

Invoked when a specific need arises — not part of any chain.

| Skill | Description |
|-------|-------------|
| [`/rg-pov`](./rg-pov.md) | Form a decisive, project-grounded verdict on an external input (framework, library, CVE, pattern) — dual-grounding floors, cold or warm (mid-session) invocation, graded Adopt/Trial/Hold/Reject/Not-our-problem with a reasoned handoff |
| [`/rg-explain`](./rg-explain.md) | Turn a concept, a diff, an idea, or a window of your own recent work into a dense, visual explainer written for you personally — optional check-in (predict-then-reveal for diffs, corrected exercises), capability-detected destination ask |
| [`/rg-debug`](./rg-debug.md) | Find root causes systematically — causal chain gate, predictions, post-fix polish/review, PR handoff |
| [`/rg-code-review`](./rg-code-review.md) | Structured code review with skill-local reviewer personas, confidence-gated findings, four modes |
| [`/rg-doc-review`](./rg-doc-review.md) | Review requirements or plan documents using skill-local reviewer personas — coherence, feasibility, product-lens, design-lens, security-lens, scope-guardian, adversarial |
| [`/rg-simplify-code`](./rg-simplify-code.md) | Refine recently changed code — reuse, quality, and efficiency review; behavior preservation verified |
| [`/rg-optimize`](./rg-optimize.md) | Metric-driven iterative optimization loops — three-tier evaluation, parallel experiments, persistence discipline |

---

## Research & Context

| Skill | Description |
|-------|-------------|
| [`/rg-riffrec-feedback-analysis`](./rg-riffrec-feedback-analysis.md) | Turn raw [Riffrec](https://github.com/kieranklaassen/riffrec) recordings into structured feedback — quick bug or extensive analysis with `rg-brainstorm` handoff |

---

## Autonomous Pipeline

| Skill | Description |
|-------|-------------|
| [`/lfg`](./lfg.md) | Run the full hands-off engineering pipeline from planning through a green PR — plan, work, simplify, review, fix, browser-test, ship, and watch CI |

---

## Frontend Design

| Skill | Description |
|-------|-------------|
| [`/rg-polish`](./rg-polish.md) | Conversational UX polish — start dev server, open browser, iterate together; auto-detects 8 frameworks (manual invocation only) |

---

## Collaboration

| Skill | Description |
|-------|-------------|
| [`/rg-proof`](./rg-proof.md) | Publish, view, comment on, and edit markdown via [Proof](https://www.proofeditor.ai), Every's collaborative editor — Web API and Local Bridge surfaces |

---

## Workflow Utilities

| Skill | Description |
|-------|-------------|
| [`/rg-promote`](./rg-promote.md) | Draft user-facing announcement copy for a shipped feature (X, changelog, LinkedIn, email) — voice-matched via the optional Spiral CLI, a lite layer of editorial & social expertise without it, drafts only |
| [`/rg-resolve-pr-feedback`](./rg-resolve-pr-feedback.md) | Evaluate, fix, and reply to PR review feedback in parallel — including nitpicks |
| [`/rg-setup`](./rg-setup.md) | Diagnose optional tool capabilities and bootstrap safe project-local config |

---

## See also

For the top-level install and usage guide, see [`README.md`](../../README.md). Each skill's authoritative runtime spec is in `skills/<skill>/SKILL.md`.
