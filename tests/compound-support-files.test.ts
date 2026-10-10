import { readFile } from "fs/promises"
import path from "path"
import { describe, expect, test } from "bun:test"
import { load } from "js-yaml"

const PLUGIN_ROOT = path.join(process.cwd(), "skills")

/** Canonical copies live in rg-compound-canon; mirrors must stay identical. */
const SHARED_SUPPORT_FILES = [
  "references/schema.yaml",
  "references/yaml-schema.md",
  "assets/resolution-template.md",
]

const SKILLS_WITH_COPIES = ["rg-compound-canon", "rg-canon-refresh"]

describe("rg-compound-canon support file drift", () => {
  for (const file of SHARED_SUPPORT_FILES) {
    test(`${file} is identical across ${SKILLS_WITH_COPIES.join(", ")}`, async () => {
      const contents = await Promise.all(
        SKILLS_WITH_COPIES.map((skill) =>
          readFile(path.join(PLUGIN_ROOT, skill, file), "utf8"),
        ),
      )

      for (let i = 1; i < contents.length; i++) {
        expect(contents[i]).toBe(contents[0])
      }
    })
  }
})

// Format-rendering refs (markdown-rendering.md, html-rendering.md) are
// byte-duplicated across rg-prep-plan, rg-flesh-out, and rg-spark. There is no
// cross-skill shared-file mechanism (see AGENTS.md
// "Runtime vs Authoring Context"); all copies must stay identical so the
// agent renders artifacts the same way regardless of which skill composed
// them.
const RENDERING_SKILLS = ["rg-prep-plan", "rg-flesh-out", "rg-spark"]
const RENDERING_REFS = [
  "references/markdown-rendering.md",
  "references/html-rendering.md",
]

describe("format-rendering ref drift across rg-plan and rg-brainstorm", () => {
  for (const ref of RENDERING_REFS) {
    test(`${ref} is identical across ${RENDERING_SKILLS.join(", ")}`, async () => {
      const contents = await Promise.all(
        RENDERING_SKILLS.map((skill) =>
          readFile(path.join(PLUGIN_ROOT, skill, ref), "utf8"),
        ),
      )

      for (let i = 1; i < contents.length; i++) {
        expect(contents[i]).toBe(contents[0])
      }
    })
  }
})

/**
 * Regression tests for the YAML-safety quoting rule for array items.
 *
 * Array items in frontmatter fields like `symptoms:` that start with a YAML
 * reserved indicator (`, [, *, &, !, |, >, %, @, ?) or contain `: ` must be
 * wrapped in double quotes — otherwise strict YAML parsers reject the file.
 * See issue #606.
 */
describe("rg-compound YAML safety rule presence", () => {
  for (const skill of SKILLS_WITH_COPIES) {
    test(`${skill}/references/schema.yaml validation_rules includes YAML-safety entry`, async () => {
      const raw = await readFile(
        path.join(PLUGIN_ROOT, skill, "references/schema.yaml"),
        "utf8",
      )
      const parsed = load(raw) as { validation_rules?: string[] } | null
      expect(parsed).not.toBeNull()
      expect(Array.isArray(parsed?.validation_rules)).toBe(true)
      const hasSafetyRule = (parsed?.validation_rules ?? []).some((rule) =>
        /array.*(quote|reserved indicator)|reserved indicator.*quote|YAML[- ]safety/i.test(rule),
      )
      expect(hasSafetyRule).toBe(true)
    })

    test(`${skill}/references/yaml-schema.md contains YAML Safety Rules section`, async () => {
      const raw = await readFile(
        path.join(PLUGIN_ROOT, skill, "references/yaml-schema.md"),
        "utf8",
      )
      expect(/^##\s+YAML\s+Safety\s+Rules/mi.test(raw)).toBe(true)
      // Concrete example stays present so the rule remains actionable.
      expect(raw).toMatch(/"`sudo dscacheutil/)
    })

    test(`${skill}/assets/resolution-template.md references YAML safety rules`, async () => {
      const raw = await readFile(
        path.join(PLUGIN_ROOT, skill, "assets/resolution-template.md"),
        "utf8",
      )
      expect(/YAML[- ]safety/i.test(raw)).toBe(true)
      expect(raw).toMatch(/yaml-schema\.md/)
    })
  }

  test("rg-compound-canon/SKILL.md enforces in-place compounding and WikiLinks", async () => {
    const raw = await readFile(
      path.join(PLUGIN_ROOT, "rg-compound-canon", "SKILL.md"),
      "utf8",
    )
    expect(raw).toMatch(/In-Place Compounding \(No-Git\)/)
    expect(raw).toMatch(/\[\[WikiLinks\]\]/)
  })

  test("rg-canon-refresh per-action-flows reference points at YAML-safety rules in the Replace flow", async () => {
    // The Replace Flow content lives in references/per-action-flows.md after the
    // Phase 4 extraction; SKILL.md keeps a stub that delegates to it.
    const raw = await readFile(
      path.join(PLUGIN_ROOT, "rg-canon-refresh", "references", "per-action-flows.md"),
      "utf8",
    )
    // Anchor to the Replace Flow section so a drifted or deleted pointer is
    // caught even if the phrase still appears elsewhere in the file.
    const replaceFlowMatch = raw.match(
      /##\s+Replace\s+Flow\b([\s\S]*?)(?=\n##\s+\w|$)/,
    )
    expect(replaceFlowMatch).not.toBeNull()
    const replaceFlow = replaceFlowMatch?.[1] ?? ""
    expect(/YAML[- ]safety/i.test(replaceFlow)).toBe(true)
    expect(replaceFlow).toMatch(/yaml-schema\.md/)
  })
})
