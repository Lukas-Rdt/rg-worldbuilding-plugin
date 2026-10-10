import { describe, expect, test } from "bun:test"
import { promises as fs } from "fs"
import path from "path"
import os from "os"
import { mergeCodexConfig, renderCodexConfig, writeCodexBundle, mergeCodexHooks } from "../src/targets/codex"
import type { CodexBundle } from "../src/types/codex"
import { loadClaudePlugin } from "../src/parsers/claude"
import { convertClaudeToCodex } from "../src/converters/claude-to-codex"
import { parseFrontmatter } from "../src/utils/frontmatter"

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function entryExists(filePath: string): Promise<boolean> {
  try {
    await fs.lstat(filePath)
    return true
  } catch {
    return false
  }
}

async function pluginDescription(relativePath: string): Promise<string> {
  const raw = await fs.readFile(path.join(import.meta.dir, "..", relativePath), "utf8")
  const { data } = parseFrontmatter(raw, relativePath)
  if (typeof data.description !== "string") {
    throw new Error(`Missing description in ${relativePath}`)
  }
  return data.description
}

function skillContent(name: string, description: string): string {
  return `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\n---\n\n# ${name}\n`
}

const HISTORICAL_SKILL_DESCRIPTIONS: Record<string, string> = {
  "rg:plan-beta":
    "[BETA] Transform feature descriptions or requirements into structured implementation plans grounded in repo patterns and research. Use when the user says 'plan this', 'create a plan', 'write a tech plan', 'plan the implementation', 'how should we build', 'what's the approach for', 'break this down', or when a brainstorm/requirements document is ready for technical planning. Best when requirements are at least roughly defined; for exploratory or ambiguous requests, prefer rg:brainstorm first.",
  "rg-plan":
    "Create structured plans for multi-step tasks -- software features, research workflows, events, study plans, or any goal that benefits from breakdown. Also deepens existing plans with interactive sub-agent review. Use when the user says 'plan this', 'create a plan', 'how should we build', 'break this down', or when a brainstorm doc is ready for planning. Use 'deepen the plan' or 'deepening pass' for the deepening flow. For exploratory requests, prefer rg-brainstorm first.",
  "rg-agent-native-architecture":
    "Build applications where agents are first-class citizens. Use this skill when designing autonomous agents, creating MCP tools, implementing self-modifying systems, or building apps where features are outcomes achieved by agents operating in a loop.",
  "rg-demo-reel":
    "Capture a visual demo reel (GIF, terminal recording, screenshots) for PR descriptions. Use when shipping UI changes, CLI features, or any work with observable behavior that benefits from visual proof. Also use when asked to add a demo, record a GIF, screenshot a feature, show what changed visually, create a demo reel, capture evidence, add proof to a PR, or create a before/after comparison.",
  "reproduce-bug":
    "Systematically reproduce and investigate a bug from a GitHub issue. Use when the user provides a GitHub issue number or URL for a bug they want reproduced or investigated.",
}

const HISTORICAL_AGENT_DESCRIPTIONS: Record<string, string> = {
  "bug-reproduction-validator":
    "Systematically reproduces and validates bug reports to confirm whether reported behavior is an actual bug. Use when you receive a bug report or issue that needs verification.",
  "rg-repo-research-analyst":
    "Conducts thorough research on repository structure, documentation, conventions, and implementation patterns. Use when onboarding to a new codebase or understanding project conventions.",
}

function historicalSkillDescription(name: string): string {
  const description = HISTORICAL_SKILL_DESCRIPTIONS[name]
  if (!description) throw new Error(`Missing historical skill description for ${name}`)
  return description
}

function historicalAgentDescription(name: string): string {
  const description = HISTORICAL_AGENT_DESCRIPTIONS[name]
  if (!description) throw new Error(`Missing historical agent description for ${name}`)
  return description
}

describe("writeCodexBundle", () => {
  test("writes prompts, skills, and config", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-test-"))
    const bundle: CodexBundle = {
      prompts: [{ name: "command-one", content: "Prompt content" }],
      skillDirs: [
        {
          name: "skill-one",
          sourceDir: path.join(import.meta.dir, "fixtures", "sample-plugin", "skills", "skill-one"),
        },
      ],
      generatedSkills: [{ name: "agent-skill", content: "Skill content" }],
      agents: [
        {
          name: "research-rg-repo-research-analyst",
          description: "Repo research",
          instructions: "Research the repository.",
        },
      ],
      mcpServers: {
        local: { command: "echo", args: ["hello"], env: { KEY: "VALUE" } },
        remote: {
          url: "https://example.com/mcp",
          headers: { Authorization: "Bearer token" },
        },
      },
    }

    await writeCodexBundle(tempRoot, bundle)

    expect(await exists(path.join(tempRoot, ".codex", "prompts", "command-one.md"))).toBe(true)
    expect(await exists(path.join(tempRoot, ".codex", "skills", "skill-one", "SKILL.md"))).toBe(true)
    expect(await exists(path.join(tempRoot, ".codex", "skills", "agent-skill", "SKILL.md"))).toBe(true)
    const agentPath = path.join(tempRoot, ".codex", "agents", "research-rg-repo-research-analyst.toml")
    expect(await exists(agentPath)).toBe(true)
    const agentToml = await fs.readFile(agentPath, "utf8")
    expect(agentToml).toContain('name = "research-rg-repo-research-analyst"')
    expect(agentToml).toContain('developer_instructions = "Research the repository."')
    const configPath = path.join(tempRoot, ".codex", "config.toml")
    expect(await exists(configPath)).toBe(true)

    const config = await fs.readFile(configPath, "utf8")
    expect(config).toContain("# BEGIN RG Engineering plugin MCP -- do not edit this block")
    expect(config).toContain("# END RG Engineering plugin MCP")
    expect(config).toContain("[mcp_servers.local]")
    expect(config).toContain("command = \"echo\"")
    expect(config).toContain("args = [\"hello\"]")
    expect(config).toContain("[mcp_servers.local.env]")
    expect(config).toContain("KEY = \"VALUE\"")
    expect(config).toContain("[mcp_servers.remote]")
    expect(config).toContain("url = \"https://example.com/mcp\"")
    expect(config).toContain("http_headers")
  })

  test("throws when two agents sanitize to the same Codex filename", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-agent-collision-"))
    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      agents: [
        {
          name: "research:rg-learnings-researcher",
          description: "First",
          instructions: "First agent body.",
        },
        {
          name: "research-rg-learnings-researcher",
          description: "Second",
          instructions: "Second agent body.",
        },
      ],
    }

    await expect(writeCodexBundle(tempRoot, bundle)).rejects.toThrow(
      /Codex agent filename collision/,
    )

    // Verify neither agent was silently dropped: the first agent should not have
    // been written before the collision was detected (guard runs before writes).
    const agentsRoot = path.join(tempRoot, ".codex", "agents")
    expect(
      await exists(path.join(agentsRoot, "research-rg-learnings-researcher.toml")),
    ).toBe(false)
  })

  test("writes directly into a .codex output root", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-home-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const bundle: CodexBundle = {
      prompts: [{ name: "command-one", content: "Prompt content" }],
      skillDirs: [
        {
          name: "skill-one",
          sourceDir: path.join(import.meta.dir, "fixtures", "sample-plugin", "skills", "skill-one"),
        },
      ],
      generatedSkills: [],
    }

    await writeCodexBundle(codexRoot, bundle)

    expect(await exists(path.join(codexRoot, "prompts", "command-one.md"))).toBe(true)
    expect(await exists(path.join(codexRoot, "skills", "skill-one", "SKILL.md"))).toBe(true)
  })

  test("copies generated skill sidecar directories", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-sidecar-"))
    const sidecarDir = path.join(tempRoot, "source", "session-history-scripts")
    await fs.mkdir(sidecarDir, { recursive: true })
    await fs.writeFile(path.join(sidecarDir, "discover-sessions.sh"), "#!/usr/bin/env bash\n")

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [
        {
          name: "session-historian",
          content: "Skill content",
          sidecarDirs: [{ sourceDir: sidecarDir, targetName: "session-history-scripts" }],
        },
      ],
    }

    await writeCodexBundle(tempRoot, bundle)

    expect(await exists(
      path.join(
        tempRoot,
        ".codex",
        "skills",
        "session-historian",
        "session-history-scripts",
        "discover-sessions.sh",
      ),
    )).toBe(true)
  })

  test("preserves same-named user prompts during stale prompt cleanup", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-prompts-preserve-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const promptsDir = path.join(codexRoot, "prompts")
    await fs.mkdir(promptsDir, { recursive: true })
    await fs.writeFile(
      path.join(promptsDir, "rg-plan.md"),
      "---\ndescription: \"Project-local rg-plan helper\"\n---\n\nCustom prompt body\n",
    )

    await writeCodexBundle(codexRoot, { prompts: [], skillDirs: [], generatedSkills: [] })

    expect(await exists(path.join(promptsDir, "rg-plan.md"))).toBe(true)
  })

  test("preserves same-named user prompts when pluginName triggers legacy allow-list cleanup", async () => {
    // Regression: `cleanupKnownLegacyCodexArtifacts` used to move any
    // allow-listed filename under `~/.codex/prompts/` into
    // `rg-engineering/legacy-backup/` whenever `pluginName` was set,
    // without checking that CE authored the file. A user-authored
    // `rg-plan.md` prompt was therefore destroyed on `install --to codex`
    // even though the content was not a CE-emitted wrapper. The install path
    // now requires the same body + frontmatter ownership fingerprint that
    // the standalone `cleanupStalePrompts` helper uses before touching a
    // prompt file at a colliding legacy name.
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-prompts-legacy-preserve-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const promptsDir = path.join(codexRoot, "prompts")
    await fs.mkdir(promptsDir, { recursive: true })
    const userPromptBody =
      "---\ndescription: \"Project-local rg-plan helper\"\n---\n\nCustom prompt body\n"
    await fs.writeFile(path.join(promptsDir, "rg-plan.md"), userPromptBody)

    await writeCodexBundle(codexRoot, {
      pluginName: "rg-engineering",
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
    })

    expect(await exists(path.join(promptsDir, "rg-plan.md"))).toBe(true)
    expect(await fs.readFile(path.join(promptsDir, "rg-plan.md"), "utf8")).toBe(userPromptBody)
    const backupRoot = path.join(codexRoot, "rg-engineering", "legacy-backup")
    // The legacy-backup directory should not contain the user-authored prompt.
    if (await exists(backupRoot)) {
      const timestamps = await fs.readdir(backupRoot)
      for (const timestamp of timestamps) {
        const promptsBackup = path.join(backupRoot, timestamp, "prompts")
        if (await exists(promptsBackup)) {
          const backedUp = await fs.readdir(promptsBackup)
          expect(backedUp).not.toContain("rg-plan.md")
        }
      }
    }
  })

  test("preserves same-named user flat agents when pluginName triggers legacy allow-list cleanup", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-agents-legacy-preserve-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const agentsDir = path.join(codexRoot, "agents")
    await fs.mkdir(agentsDir, { recursive: true })
    const userAgentBody = [
      'description = "Personal repo research helper"',
      'developer_instructions = "Custom user-authored Codex agent."',
      "",
    ].join("\n")
    await fs.writeFile(path.join(agentsDir, "rg-repo-research-analyst.toml"), userAgentBody)

    await writeCodexBundle(codexRoot, {
      pluginName: "rg-engineering",
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
    })

    expect(await exists(path.join(agentsDir, "rg-repo-research-analyst.toml"))).toBe(true)
    expect(await fs.readFile(path.join(agentsDir, "rg-repo-research-analyst.toml"), "utf8")).toBe(userAgentBody)
    const backupRoot = path.join(codexRoot, "rg-engineering", "legacy-backup")
    if (await exists(backupRoot)) {
      const timestamps = await fs.readdir(backupRoot)
      for (const timestamp of timestamps) {
        const agentsBackup = path.join(backupRoot, timestamp, "agents")
        if (!(await exists(agentsBackup))) continue
        const backedUp = await fs.readdir(agentsBackup)
        expect(backedUp).not.toContain("rg-repo-research-analyst.toml")
      }
    }
  })

  test("writes plugin skills under a namespaced Codex skills root without .agents symlinks", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-managed-plugin-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const bundle: CodexBundle = {
      pluginName: "rg-engineering",
      prompts: [{ name: "old-prompt", content: "Prompt content" }],
      skillDirs: [
        {
          name: "skill-one",
          sourceDir: path.join(import.meta.dir, "fixtures", "sample-plugin", "skills", "skill-one"),
        },
      ],
      generatedSkills: [{ name: "old-command", content: "Old command" }],
      agents: [{ name: "old-agent", description: "Old agent", instructions: "Old agent body" }],
    }

    await writeCodexBundle(codexRoot, bundle)

    const managedSkillsRoot = path.join(codexRoot, "skills", "rg-engineering")
    const managedAgentsRoot = path.join(codexRoot, "agents", "rg-engineering")
    expect(await exists(path.join(managedSkillsRoot, "skill-one", "SKILL.md"))).toBe(true)
    expect(await exists(path.join(managedSkillsRoot, "old-command", "SKILL.md"))).toBe(true)
    expect(await exists(path.join(managedAgentsRoot, "old-agent.toml"))).toBe(true)
    expect(await exists(path.join(tempRoot, ".agents", "skills", "skill-one"))).toBe(false)
    expect(await exists(path.join(tempRoot, ".agents", "skills", "old-agent"))).toBe(false)
    expect(await exists(path.join(codexRoot, "rg-engineering", "install-manifest.json"))).toBe(true)

    await writeCodexBundle(codexRoot, {
      pluginName: "rg-engineering",
      prompts: [{ name: "new-prompt", content: "Prompt content" }],
      skillDirs: [],
      generatedSkills: [{ name: "new-command", content: "New command" }],
      agents: [{ name: "new-agent", description: "New agent", instructions: "New agent body" }],
    })

    expect(await exists(path.join(managedSkillsRoot, "skill-one", "SKILL.md"))).toBe(false)
    expect(await exists(path.join(managedSkillsRoot, "old-command", "SKILL.md"))).toBe(false)
    expect(await exists(path.join(managedSkillsRoot, "new-command", "SKILL.md"))).toBe(true)
    expect(await exists(path.join(managedAgentsRoot, "old-agent.toml"))).toBe(false)
    expect(await exists(path.join(managedAgentsRoot, "new-agent.toml"))).toBe(true)
    expect(await exists(path.join(tempRoot, ".agents", "skills", "new-agent"))).toBe(false)
    expect(await exists(path.join(codexRoot, "prompts", "old-prompt.md"))).toBe(false)
    expect(await exists(path.join(codexRoot, "prompts", "new-prompt.md"))).toBe(true)
  })

  ;(process.platform === "win32" ? test.skip : test)("removes legacy .agents symlinks that point to managed Codex skills", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-flat-symlink-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const previousManagedSkillsRoot = path.join(codexRoot, "rg-engineering", "skills")
    const agentsSkillsDir = path.join(tempRoot, ".agents", "skills")

    await fs.mkdir(path.join(previousManagedSkillsRoot, "old-agent"), { recursive: true })
    await fs.mkdir(path.join(previousManagedSkillsRoot, "reproduce-bug"), { recursive: true })
    await fs.writeFile(
      path.join(codexRoot, "rg-engineering", "install-manifest.json"),
      JSON.stringify({ version: 1, pluginName: "rg-engineering", skills: ["old-agent"], prompts: [] }),
    )
    await fs.mkdir(agentsSkillsDir, { recursive: true })
    await fs.symlink(previousManagedSkillsRoot, path.join(agentsSkillsDir, "rg-engineering"))
    await fs.symlink(
      path.join(previousManagedSkillsRoot, "old-agent"),
      path.join(agentsSkillsDir, "old-agent"),
    )
    await fs.symlink(
      path.join(previousManagedSkillsRoot, "reproduce-bug"),
      path.join(agentsSkillsDir, "reproduce-bug"),
    )

    const unrelatedRoot = path.join(tempRoot, "other-skills", "skill-one")
    await fs.mkdir(unrelatedRoot, { recursive: true })
    await fs.symlink(unrelatedRoot, path.join(agentsSkillsDir, "skill-one"))

    await writeCodexBundle(codexRoot, {
      pluginName: "rg-engineering",
      prompts: [],
      skillDirs: [
        {
          name: "skill-one",
          sourceDir: path.join(import.meta.dir, "fixtures", "sample-plugin", "skills", "skill-one"),
        },
      ],
      generatedSkills: [],
    })

    expect(await entryExists(path.join(agentsSkillsDir, "rg-engineering"))).toBe(false)
    expect(await entryExists(path.join(agentsSkillsDir, "old-agent"))).toBe(false)
    expect(await entryExists(path.join(agentsSkillsDir, "reproduce-bug"))).toBe(false)
    expect(await fs.realpath(path.join(agentsSkillsDir, "skill-one"))).toBe(await fs.realpath(unrelatedRoot))
    expect(await exists(previousManagedSkillsRoot)).toBe(false)
  })

  test("moves legacy flat Codex CE artifacts to a namespaced backup", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-legacy-skill-"))
    const codexRoot = path.join(tempRoot, ".codex")
    await fs.mkdir(path.join(codexRoot, "skills", "rg-plan"), { recursive: true })
    await fs.writeFile(path.join(codexRoot, "skills", "rg-plan", "SKILL.md"), skillContent("rg-plan", historicalSkillDescription("rg-plan")))
    if (process.platform !== "win32") {
      await fs.mkdir(path.join(codexRoot, "skills", "rg:plan"), { recursive: true })
      await fs.writeFile(path.join(codexRoot, "skills", "rg:plan", "SKILL.md"), skillContent("rg:plan", await pluginDescription("skills/rg-prep-plan/SKILL.md")))
      await fs.mkdir(path.join(codexRoot, "skills", "rg:plan-beta"), { recursive: true })
      await fs.writeFile(path.join(codexRoot, "skills", "rg:plan-beta", "SKILL.md"), skillContent("rg:plan-beta", historicalSkillDescription("rg:plan-beta")))
    }
    await fs.mkdir(path.join(codexRoot, "skills", "repo-research-analyst"), { recursive: true })
    await fs.writeFile(path.join(codexRoot, "skills", "repo-research-analyst", "SKILL.md"), skillContent("repo-research-analyst", historicalAgentDescription("rg-repo-research-analyst")))
    await fs.mkdir(path.join(codexRoot, "skills", "reproduce-bug"), { recursive: true })
    await fs.writeFile(path.join(codexRoot, "skills", "reproduce-bug", "SKILL.md"), skillContent("reproduce-bug", historicalSkillDescription("reproduce-bug")))
    await fs.mkdir(path.join(codexRoot, "skills", "bug-reproduction-validator"), { recursive: true })
    await fs.writeFile(path.join(codexRoot, "skills", "bug-reproduction-validator", "SKILL.md"), skillContent("bug-reproduction-validator", historicalAgentDescription("bug-reproduction-validator")))
    await fs.mkdir(path.join(codexRoot, "prompts"), { recursive: true })
    await fs.writeFile(path.join(codexRoot, "prompts", "reproduce-bug.md"), "legacy removed prompt")
    await fs.writeFile(path.join(codexRoot, "prompts", "report-bug.md"), "legacy deleted command prompt")

    const plugin = await loadClaudePlugin(path.join(import.meta.dir, ".."))
    const bundle = convertClaudeToCodex(plugin, {
      agentMode: "subagent",
      inferTemperature: true,
      permissions: "none",
    })
    await writeCodexBundle(codexRoot, bundle)

    expect(await exists(path.join(codexRoot, "skills", "rg-plan"))).toBe(false)
    if (process.platform !== "win32") {
      expect(await exists(path.join(codexRoot, "skills", "rg:plan"))).toBe(false)
      expect(await exists(path.join(codexRoot, "skills", "rg:plan-beta"))).toBe(false)
    }
    expect(await exists(path.join(codexRoot, "skills", "repo-research-analyst"))).toBe(false)
    expect(await exists(path.join(codexRoot, "skills", "reproduce-bug"))).toBe(false)
    expect(await exists(path.join(codexRoot, "skills", "bug-reproduction-validator"))).toBe(false)
    expect(await exists(path.join(codexRoot, "prompts", "reproduce-bug.md"))).toBe(false)
    expect(await exists(path.join(codexRoot, "prompts", "report-bug.md"))).toBe(false)
    expect(await exists(path.join(codexRoot, "rg-worldbuilding", "legacy-backup"))).toBe(true)
  })

  test("sweeps removed CE flat skills while preserving unrelated user skills", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-user-skill-collide-"))
    const codexRoot = path.join(tempRoot, ".codex")

    // These removed CE skills were previously shipped at flat skill paths, so
    // cleanup should back them up when the names are no longer in the bundle.
    const demoReelDir = path.join(codexRoot, "skills", "rg-demo-reel")
    await fs.mkdir(demoReelDir, { recursive: true })
    await fs.writeFile(path.join(demoReelDir, "SKILL.md"), skillContent("rg-demo-reel", historicalSkillDescription("rg-demo-reel")))
    const agentNativeDir = path.join(codexRoot, "skills", "rg-agent-native-architecture")
    await fs.mkdir(agentNativeDir, { recursive: true })
    await fs.writeFile(path.join(agentNativeDir, "SKILL.md"), skillContent("rg-agent-native-architecture", historicalSkillDescription("rg-agent-native-architecture")))

    // Same for rg-debug — current CE skill name, never in the historical
    // flat-path allow-list, so a same-named user skill must be preserved.
    const userDebugDir = path.join(codexRoot, "skills", "rg-debug")
    await fs.mkdir(userDebugDir, { recursive: true })
    await fs.writeFile(path.join(userDebugDir, "SKILL.md"), "# user debug skill")
    const userCleanBranchesDir = path.join(codexRoot, "skills", "rg-clean-gone-branches")
    await fs.mkdir(userCleanBranchesDir, { recursive: true })
    await fs.writeFile(
      path.join(userCleanBranchesDir, "SKILL.md"),
      skillContent("rg-clean-gone-branches", "User-authored branch cleanup helper."),
    )

    const plugin = await loadClaudePlugin(path.join(import.meta.dir, ".."))
    const bundle = convertClaudeToCodex(plugin, {
      agentMode: "subagent",
      inferTemperature: true,
      permissions: "none",
    })
    await writeCodexBundle(codexRoot, bundle)

    expect(await exists(path.join(demoReelDir, "SKILL.md"))).toBe(false)
    expect(await exists(path.join(agentNativeDir, "SKILL.md"))).toBe(false)

    // The unrelated user skill survives the install — same path, same content.
    expect(await exists(path.join(userDebugDir, "SKILL.md"))).toBe(true)
    expect(await exists(path.join(userCleanBranchesDir, "SKILL.md"))).toBe(true)

    const backupRoot = path.join(codexRoot, "rg-worldbuilding", "legacy-backup")
    expect(await exists(backupRoot)).toBe(true)
    let backedNames: string[] = []
    if (await exists(backupRoot)) {
      const timestamps = await fs.readdir(backupRoot)
      for (const ts of timestamps) {
        const skillsBackup = path.join(backupRoot, ts, "skills")
        if (!(await exists(skillsBackup))) continue
        backedNames = backedNames.concat(await fs.readdir(skillsBackup))
      }
    }
    expect(backedNames).toContain("rg-demo-reel")
    expect(backedNames).toContain("rg-agent-native-architecture")
    expect(backedNames).not.toContain("rg-debug")
    expect(backedNames).not.toContain("rg-clean-gone-branches")
  })

  test("sweeps flat-alias skill dir left by a prior layout when the new bundle's agent name has embedded -rg-", async () => {
    // Third-party plugins with nested agent directories (e.g. agents/review/rg-foo.md)
    // produce Codex agent names like `review-rg-foo`. If the same logical agent
    // was previously installed under a flat layout (raw codex name `rg-foo`),
    // the now-orphaned skill dir at `.codex/skills/<plugin>/rg-foo/` should be
    // moved into legacy-backup on the next install. This is the only cleanup
    // path available for third-party plugins, which have no entry in the
    // historical allow-list used by getLegacyCodexArtifacts.
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-nested-xmigrate-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const pluginName = "third-party-nested"
    const managedSkillsRoot = path.join(codexRoot, "skills", pluginName)

    // Simulate orphan flat-alias skill dir from the earlier layout.
    await fs.mkdir(path.join(managedSkillsRoot, "rg-foo"), { recursive: true })
    await fs.writeFile(
      path.join(managedSkillsRoot, "rg-foo", "SKILL.md"),
      "stale flat-alias skill from prior install",
    )

    await writeCodexBundle(codexRoot, {
      pluginName,
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      agents: [
        {
          name: "review-rg-foo",
          description: "Nested-layout agent",
          instructions: "Do review work on foo.",
        },
      ],
    })

    // The current install writes the nested-layout agent, not a same-named skill dir.
    expect(await exists(path.join(codexRoot, "agents", pluginName, "review-rg-foo.toml"))).toBe(true)

    // The orphan flat-alias skill dir should have been relocated.
    expect(await exists(path.join(managedSkillsRoot, "rg-foo"))).toBe(false)

    // And should be reachable under legacy-backup.
    const backupRoot = path.join(codexRoot, pluginName, "legacy-backup")
    expect(await exists(backupRoot)).toBe(true)
    const timestamps = await fs.readdir(backupRoot)
    let foundBackup = false
    for (const ts of timestamps) {
      const skillsBackup = path.join(backupRoot, ts, "skills")
      if (!(await exists(skillsBackup))) continue
      const backed = await fs.readdir(skillsBackup)
      if (backed.includes("rg-foo")) foundBackup = true
    }
    expect(foundBackup).toBe(true)
  })

  test("agents-only install preserves namespaced skills previously installed via Codex native plugin flow", async () => {
    // Regression for the bug where re-running `install --to codex` after a
    // native `/plugins` install moved currently-active namespaced skills
    // (e.g., `.codex/skills/rg-engineering/rg-plan/`) into
    // legacy-backup. The agents-only default produces an empty `skillDirs` /
    // `generatedSkills`, but the converter now populates
    // `externallyManagedSkillNames` with the allow-listed current skills so
    // `cleanupLegacyAgentSkillDirs` treats them as current rather than legacy.
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-agents-only-preserve-"))
    const codexRoot = path.join(tempRoot, ".codex")

    // Simulate the tree produced by a native Codex plugin install: active
    // namespaced skills under `.codex/skills/<plugin>/<skill>/SKILL.md`.
    const namespacedSkillsRoot = path.join(codexRoot, "skills", "rg-worldbuilding")
    for (const skillName of ["rg-prep-plan", "rg-patch-plothole", "rg-flesh-out"]) {
      await fs.mkdir(path.join(namespacedSkillsRoot, skillName), { recursive: true })
      await fs.writeFile(
        path.join(namespacedSkillsRoot, skillName, "SKILL.md"),
        `# ${skillName} skill installed via native Codex plugin flow`,
      )
    }

    const plugin = await loadClaudePlugin(path.join(import.meta.dir, ".."))
    const bundle = convertClaudeToCodex(plugin, {
      agentMode: "subagent",
      inferTemperature: true,
      permissions: "none",
      // codexIncludeSkills omitted -> agents-only default
    })

    // Sanity: agents-only bundle does not request any skill writes, but it
    // does advertise the current skill names so cleanup preserves them.
    expect(bundle.skillDirs).toEqual([])
    expect(bundle.generatedSkills).toEqual([])
    expect(bundle.externallyManagedSkillNames).toContain("rg-prep-plan")
    expect(bundle.externallyManagedSkillNames).toContain("rg-patch-plothole")

    await writeCodexBundle(codexRoot, bundle)

    // Currently-active skills survive an agents-only re-install.
    expect(await exists(path.join(namespacedSkillsRoot, "rg-prep-plan", "SKILL.md"))).toBe(true)
    expect(await exists(path.join(namespacedSkillsRoot, "rg-patch-plothole", "SKILL.md"))).toBe(true)
    expect(await exists(path.join(namespacedSkillsRoot, "rg-flesh-out", "SKILL.md"))).toBe(true)

    // And none of them were silently relocated into legacy-backup.
    const backupRoot = path.join(codexRoot, "rg-worldbuilding", "legacy-backup")
    if (await exists(backupRoot)) {
      const timestamps = await fs.readdir(backupRoot)
      for (const ts of timestamps) {
        const skillsBackup = path.join(backupRoot, ts, "skills")
        if (!(await exists(skillsBackup))) continue
        const backed = await fs.readdir(skillsBackup)
        expect(backed).not.toContain("rg-plan")
        expect(backed).not.toContain("rg-debug")
        expect(backed).not.toContain("rg-brainstorm")
      }
    }
  })

  test("preserves existing user config when writing MCP servers", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-backup-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const configPath = path.join(codexRoot, "config.toml")

    // Create existing config with user settings
    await fs.mkdir(codexRoot, { recursive: true })
    const originalContent = "# My original config\n[custom]\nkey = \"value\"\n"
    await fs.writeFile(configPath, originalContent)

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      mcpServers: { test: { command: "echo" } },
    }

    await writeCodexBundle(codexRoot, bundle)

    const newConfig = await fs.readFile(configPath, "utf8")
    // Plugin MCP servers should be present in a managed block
    expect(newConfig).toContain("[mcp_servers.test]")
    expect(newConfig).toContain("# BEGIN RG Engineering plugin MCP -- do not edit this block")
    expect(newConfig).toContain("# END RG Engineering plugin MCP")
    // User's original config should be preserved
    expect(newConfig).toContain("# My original config")
    expect(newConfig).toContain("[custom]")
    expect(newConfig).toContain('key = "value"')

    // Backup should still exist with original content
    const files = await fs.readdir(codexRoot)
    const backupFileName = files.find((f) => f.startsWith("config.toml.bak."))
    expect(backupFileName).toBeDefined()

    const backupContent = await fs.readFile(path.join(codexRoot, backupFileName!), "utf8")
    expect(backupContent).toBe(originalContent)
  })

  test("is idempotent — running twice does not duplicate managed block", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-idempotent-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const configPath = path.join(codexRoot, "config.toml")

    await fs.mkdir(codexRoot, { recursive: true })
    await fs.writeFile(configPath, "[user]\nmodel = \"gpt-4.1\"\n")

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      mcpServers: { test: { command: "echo" } },
    }

    await writeCodexBundle(codexRoot, bundle)
    await writeCodexBundle(codexRoot, bundle)

    const config = await fs.readFile(configPath, "utf8")
    expect(config.match(/# BEGIN RG Engineering plugin MCP/g)?.length).toBe(1)
    expect(config.match(/# END RG Engineering plugin MCP/g)?.length).toBe(1)
    expect(config).toContain("[user]")
  })

  test("migrates old managed block markers to new ones", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-migrate-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const configPath = path.join(codexRoot, "config.toml")

    await fs.mkdir(codexRoot, { recursive: true })
    await fs.writeFile(configPath, [
      "[user]",
      'model = "gpt-4.1"',
      "",
      "# BEGIN compound-plugin Claude Code MCP",
      "[mcp_servers.old]",
      'command = "old"',
      "# END compound-plugin Claude Code MCP",
    ].join("\n"))

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      mcpServers: { fresh: { command: "new" } },
    }

    await writeCodexBundle(codexRoot, bundle)

    const config = await fs.readFile(configPath, "utf8")
    expect(config).not.toContain("# BEGIN compound-plugin Claude Code MCP")
    expect(config).toContain("# BEGIN RG Engineering plugin MCP")
    expect(config).not.toContain("[mcp_servers.old]")
    expect(config).toContain("[mcp_servers.fresh]")
    expect(config).toContain("[user]")
  })

  test("migrates unmarked legacy format (# Generated by compound-plugin)", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-unmarked-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const configPath = path.join(codexRoot, "config.toml")

    // Simulate old writer output: entire file was just the generated config
    await fs.mkdir(codexRoot, { recursive: true })
    await fs.writeFile(configPath, [
      "# Generated by compound-plugin",
      "",
      "[mcp_servers.old]",
      'command = "old"',
      "",
    ].join("\n"))

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      mcpServers: { fresh: { command: "new" } },
    }

    await writeCodexBundle(codexRoot, bundle)

    const config = await fs.readFile(configPath, "utf8")
    expect(config).not.toContain("# Generated by compound-plugin")
    expect(config).not.toContain("[mcp_servers.old]")
    expect(config).toContain("# BEGIN RG Engineering plugin MCP")
    expect(config).toContain("[mcp_servers.fresh]")
    // Should have exactly one BEGIN marker (no duplication)
    expect(config.match(/# BEGIN RG Engineering plugin MCP/g)?.length).toBe(1)
  })

  test("strips stale managed block when plugin has no MCP servers", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-stale-"))
    const codexRoot = path.join(tempRoot, ".codex")
    const configPath = path.join(codexRoot, "config.toml")

    await fs.mkdir(codexRoot, { recursive: true })
    await fs.writeFile(configPath, [
      "[user]",
      'model = "gpt-4.1"',
      "",
      "# BEGIN RG Engineering plugin MCP -- do not edit this block",
      "[mcp_servers.stale]",
      'command = "should-be-removed"',
      "# END RG Engineering plugin MCP",
    ].join("\n"))

    await writeCodexBundle(codexRoot, { prompts: [], skillDirs: [], generatedSkills: [] })

    const config = await fs.readFile(configPath, "utf8")
    expect(config).not.toContain("mcp_servers.stale")
    expect(config).not.toContain("# BEGIN RG Engineering")
    expect(config).toContain("[user]")
  })

  test("transforms copied SKILL.md files using Codex invocation targets", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-skill-transform-"))
    const sourceSkillDir = path.join(tempRoot, "source-skill")
    await fs.mkdir(sourceSkillDir, { recursive: true })
    await fs.writeFile(
      path.join(sourceSkillDir, "SKILL.md"),
      `---
name: rg-brainstorm
description: Brainstorm workflow
---

Continue with /rg-plan when ready.
Or use /workflows:plan if you're following an older doc.
Use /todo-resolve for deeper research.
`,
    )
    await fs.writeFile(
      path.join(sourceSkillDir, "notes.md"),
      "Reference docs still mention /rg-plan here.\n",
    )

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [{ name: "rg-brainstorm", sourceDir: sourceSkillDir }],
      generatedSkills: [],
      invocationTargets: {
        promptTargets: {
          "todo-resolve": "todo-resolve",
        },
        skillTargets: {
          "rg-plan": "rg-plan",
          "workflows-plan": "rg-plan",
        },
      },
    }

    await writeCodexBundle(tempRoot, bundle)

    const installedSkill = await fs.readFile(
      path.join(tempRoot, ".codex", "skills", "rg-brainstorm", "SKILL.md"),
      "utf8",
    )
    expect(installedSkill).toContain("the rg-plan skill")
    expect(installedSkill).not.toContain("/workflows:plan")
    expect(installedSkill).toContain("/prompts:todo-resolve")

    const notes = await fs.readFile(
      path.join(tempRoot, ".codex", "skills", "rg-brainstorm", "notes.md"),
      "utf8",
    )
    expect(notes).toContain("/rg-plan")
  })

  test("transforms namespaced Task calls in copied SKILL.md files", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-ns-task-"))
    const sourceSkillDir = path.join(tempRoot, "source-skill")
    await fs.mkdir(sourceSkillDir, { recursive: true })
    await fs.writeFile(
      path.join(sourceSkillDir, "SKILL.md"),
      `---
name: rg-plan
description: Planning workflow
---

Run these research agents:

- Task rg-engineering:research:repo-research-analyst(feature_description)
- Task rg-engineering:research:learnings-researcher(feature_description)

Also run bare agents:

- Task best-practices-researcher(topic)
- Task rg-engineering:review:code-simplicity-reviewer()
`,
    )

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [{ name: "rg-plan", sourceDir: sourceSkillDir }],
      generatedSkills: [],
      invocationTargets: {
        promptTargets: {},
        skillTargets: {},
      },
    }

    await writeCodexBundle(tempRoot, bundle)

    const installedSkill = await fs.readFile(
      path.join(tempRoot, ".codex", "skills", "rg-plan", "SKILL.md"),
      "utf8",
    )

    // Namespaced Task calls should be rewritten using the final segment
    expect(installedSkill).toContain("Use the $repo-research-analyst skill to: feature_description")
    expect(installedSkill).toContain("Use the $learnings-researcher skill to: feature_description")
    expect(installedSkill).not.toContain("Task rg-engineering:")

    // Bare Task calls should still be rewritten
    expect(installedSkill).toContain("Use the $best-practices-researcher skill to: topic")
    expect(installedSkill).not.toContain("Task best-practices-researcher")

    // Zero-arg Task calls should be rewritten without trailing "to:"
    expect(installedSkill).toContain("Use the $code-simplicity-reviewer skill")
    expect(installedSkill).not.toContain("code-simplicity-reviewer skill to:")
  })

  test("preserves unknown slash text in copied SKILL.md files", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-skill-preserve-"))
    const sourceSkillDir = path.join(tempRoot, "source-skill")
    await fs.mkdir(sourceSkillDir, { recursive: true })
    await fs.writeFile(
      path.join(sourceSkillDir, "SKILL.md"),
      `---
name: proof
description: Proof skill
---

Route examples:
- /users
- /settings

API examples:
- https://www.proofeditor.ai/api/agent/{slug}/state
- https://www.proofeditor.ai/share/markdown

Workflow handoff:
- /rg-plan
`,
    )

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [{ name: "proof", sourceDir: sourceSkillDir }],
      generatedSkills: [],
      invocationTargets: {
        promptTargets: {},
        skillTargets: {
          "rg-plan": "rg-plan",
        },
      },
    }

    await writeCodexBundle(tempRoot, bundle)

    const installedSkill = await fs.readFile(
      path.join(tempRoot, ".codex", "skills", "proof", "SKILL.md"),
      "utf8",
    )

    expect(installedSkill).toContain("/users")
    expect(installedSkill).toContain("/settings")
    expect(installedSkill).toContain("https://www.proofeditor.ai/api/agent/{slug}/state")
    expect(installedSkill).toContain("https://www.proofeditor.ai/share/markdown")
    expect(installedSkill).toContain("the rg-plan skill")
    expect(installedSkill).not.toContain("/prompts:users")
    expect(installedSkill).not.toContain("/prompts:settings")
    expect(installedSkill).not.toContain("https://prompts:www.proofeditor.ai")
  })

  test("removes orphan sidecar dir when retained agent declares no sidecars", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-test-"))
    const agentsRoot = path.join(tempRoot, ".codex", "agents")
    const orphanDir = path.join(agentsRoot, "rg-foo", "stale-content")
    await fs.mkdir(orphanDir, { recursive: true })
    await fs.writeFile(path.join(orphanDir, "leftover.txt"), "stale", "utf8")
    await fs.writeFile(path.join(agentsRoot, "rg-foo.toml"), "old-toml", "utf8")

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      agents: [
        {
          name: "rg-foo",
          description: "Foo agent",
          instructions: "Do foo.",
        },
      ],
      mcpServers: {},
    }

    await writeCodexBundle(tempRoot, bundle)

    expect(await entryExists(path.join(agentsRoot, "rg-foo"))).toBe(false)
    expect(await exists(path.join(agentsRoot, "rg-foo.toml"))).toBe(true)
  })

  test("keeps sidecar dir when retained agent declares sidecars", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-test-"))
    const sidecarSource = await fs.mkdtemp(path.join(os.tmpdir(), "codex-sidecar-src-"))
    await fs.writeFile(path.join(sidecarSource, "script.sh"), "#!/bin/sh\necho hi\n", "utf8")

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      agents: [
        {
          name: "rg-foo",
          description: "Foo agent",
          instructions: "Do foo.",
          sidecarDirs: [{ sourceDir: sidecarSource, targetName: "scripts" }],
        },
      ],
      mcpServers: {},
    }

    await writeCodexBundle(tempRoot, bundle)

    const agentsRoot = path.join(tempRoot, ".codex", "agents")
    expect(await exists(path.join(agentsRoot, "rg-foo.toml"))).toBe(true)
    expect(await exists(path.join(agentsRoot, "rg-foo", "scripts", "script.sh"))).toBe(true)
  })

  test("leaves unrelated directories under agentsRoot alone", async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-test-"))
    const agentsRoot = path.join(tempRoot, ".codex", "agents")
    const unrelatedDir = path.join(agentsRoot, "rg-bar-extra")
    await fs.mkdir(unrelatedDir, { recursive: true })
    await fs.writeFile(path.join(unrelatedDir, "keep-me.txt"), "keep", "utf8")

    const bundle: CodexBundle = {
      prompts: [],
      skillDirs: [],
      generatedSkills: [],
      agents: [
        {
          name: "rg-foo",
          description: "Foo agent",
          instructions: "Do foo.",
        },
      ],
      mcpServers: {},
    }

    await writeCodexBundle(tempRoot, bundle)

    expect(await exists(path.join(unrelatedDir, "keep-me.txt"))).toBe(true)
  })
})

describe("renderCodexConfig", () => {
  test("skips servers with neither command nor url", () => {
    const result = renderCodexConfig({ broken: {} })
    expect(result).toBeNull()
  })

  test("skips malformed servers but keeps valid ones", () => {
    const result = renderCodexConfig({
      valid: { command: "echo" },
      broken: {},
      alsoValid: { url: "https://example.com/mcp" },
    })
    expect(result).not.toBeNull()
    expect(result).toContain("[mcp_servers.valid]")
    expect(result).toContain("[mcp_servers.alsoValid]")
    expect(result).not.toContain("[mcp_servers.broken]")
  })

  test("returns null for empty or undefined input", () => {
    expect(renderCodexConfig(undefined)).toBeNull()
    expect(renderCodexConfig({})).toBeNull()
  })
})

describe("mergeCodexConfig", () => {
  test("returns managed block when no existing content", () => {
    const result = mergeCodexConfig("", "[mcp_servers.test]\ncommand = \"echo\"")
    expect(result).toContain("# BEGIN RG Engineering plugin MCP")
    expect(result).toContain("[mcp_servers.test]")
    expect(result).toContain("# END RG Engineering plugin MCP")
  })

  test("preserves user content and replaces managed block", () => {
    const existing = [
      "[user]",
      'model = "gpt-4.1"',
      "",
      "# BEGIN RG Engineering plugin MCP -- do not edit this block",
      "[mcp_servers.old]",
      'command = "old"',
      "# END RG Engineering plugin MCP",
      "",
      "[after]",
      'key = "value"',
    ].join("\n")

    const result = mergeCodexConfig(existing, "[mcp_servers.new]\ncommand = \"new\"")!
    expect(result).toContain("[user]")
    expect(result).toContain("[after]")
    expect(result).not.toContain("[mcp_servers.old]")
    expect(result).toContain("[mcp_servers.new]")
  })

  test("strips previous-generation markers", () => {
    const existing = [
      "[user]",
      'model = "gpt-4.1"',
      "",
      "# BEGIN compound-plugin Claude Code MCP",
      "[mcp_servers.old]",
      'command = "old"',
      "# END compound-plugin Claude Code MCP",
    ].join("\n")

    const result = mergeCodexConfig(existing, "[mcp_servers.new]\ncommand = \"new\"")!
    expect(result).not.toContain("# BEGIN compound-plugin Claude Code MCP")
    expect(result).not.toContain("[mcp_servers.old]")
    expect(result).toContain("# BEGIN RG Engineering plugin MCP")
    expect(result).toContain("[mcp_servers.new]")
  })

  test("returns cleaned content (no block) when mcpToml is null", () => {
    const existing = [
      "[user]",
      'model = "gpt-4.1"',
      "",
      "# BEGIN RG Engineering plugin MCP -- do not edit this block",
      "[mcp_servers.stale]",
      'command = "stale"',
      "# END RG Engineering plugin MCP",
    ].join("\n")

    const result = mergeCodexConfig(existing, null)!
    expect(result).toContain("[user]")
    expect(result).not.toContain("mcp_servers.stale")
    expect(result).not.toContain("# BEGIN")
  })

  test("strips unmarked legacy format (# Generated by compound-plugin)", () => {
    const existing = [
      "# Generated by compound-plugin",
      "",
      "[mcp_servers.old]",
      'command = "old"',
      "",
    ].join("\n")

    const result = mergeCodexConfig(existing, "[mcp_servers.new]\ncommand = \"new\"")!
    expect(result).not.toContain("# Generated by compound-plugin")
    expect(result).not.toContain("[mcp_servers.old]")
    expect(result).toContain("# BEGIN RG Engineering plugin MCP")
    expect(result).toContain("[mcp_servers.new]")
  })

  test("preserves unmarked legacy content when no MCP servers are incoming", () => {
    const existing = [
      'model = "gpt-5.4"',
      "",
      "# Generated by compound-plugin",
      "",
      "[projects.example]",
      'trust_level = "trusted"',
    ].join("\n")

    const result = mergeCodexConfig(existing, null)!
    expect(result).toContain("# Generated by compound-plugin")
    expect(result).toContain("[projects.example]")
    expect(result).toContain('trust_level = "trusted"')
  })

  test("strips bounded legacy MCP block when no MCP servers are incoming", () => {
    const existing = [
      "[user]",
      'model = "gpt-5.4"',
      "",
      "# MCP servers synced from Claude Code",
      "",
      "[mcp_servers.old]",
      'command = "old"',
    ].join("\n")

    const result = mergeCodexConfig(existing, null)!
    expect(result).toContain("[user]")
    expect(result).not.toContain("# MCP servers synced from Claude Code")
    expect(result).not.toContain("[mcp_servers.old]")
  })

  test("returns existing content byte-for-byte when no MCP servers or managed blocks exist", () => {
    const existing = [
      'model = "gpt-5.4"',
      "",
      "# Generated by compound-plugin",
      "",
      "[projects.example]",
      'trust_level = "trusted"',
      "",
    ].join("\n")

    expect(mergeCodexConfig(existing, null)).toBe(existing)
  })

  test("preserves user config before unmarked legacy format", () => {
    const existing = [
      "[user]",
      'model = "gpt-4.1"',
      "",
      "# Generated by compound-plugin",
      "",
      "[mcp_servers.old]",
      'command = "old"',
    ].join("\n")

    const result = mergeCodexConfig(existing, "[mcp_servers.new]\ncommand = \"new\"")!
    expect(result).toContain("[user]")
    expect(result).not.toContain("# Generated by compound-plugin")
    expect(result).not.toContain("[mcp_servers.old]")
    expect(result).toContain("[mcp_servers.new]")
  })

  test("returns null when no existing content and no mcpToml", () => {
    expect(mergeCodexConfig("", null)).toBeNull()
  })

  test("returns empty string when file was only a managed block and mcpToml is null", () => {
    const existing = [
      "# BEGIN RG Engineering plugin MCP -- do not edit this block",
      "[mcp_servers.stale]",
      'command = "stale"',
      "# END RG Engineering plugin MCP",
    ].join("\n")

    const result = mergeCodexConfig(existing, null)
    expect(result).toBe("")
  })
})

describe("mergeCodexHooks", () => {
  test("writes hooks with _managed index for a new plugin", () => {
    const result = mergeCodexHooks(null, {
      SessionStart: [{ matcher: "*", hooks: [{ type: "command", command: "my-hook" }] }],
    }, "my-plugin")

    const hooks = result.hooks as Record<string, unknown[]>
    expect(hooks.SessionStart).toHaveLength(1)
    expect((hooks.SessionStart[0] as Record<string, unknown>).matcher).toBe("*")
    // No _source field injected into hook entries
    expect((hooks.SessionStart[0] as Record<string, unknown>)._source).toBeUndefined()
    // Managed index tracks ownership
    const managed = result._managed as Record<string, Record<string, number[]>>
    expect(managed["my-plugin"].SessionStart).toEqual([0])
  })

  test("preserves hooks from other plugins", () => {
    const existing = {
      hooks: {
        SessionStart: [{ matcher: "*", hooks: [{ type: "command", command: "other-hook" }] }],
      },
      _managed: { "other-plugin": { SessionStart: [0] } },
    }

    const result = mergeCodexHooks(existing, {
      Stop: [{ matcher: "*", hooks: [{ type: "command", command: "my-stop" }] }],
    }, "my-plugin")

    const hooks = result.hooks as Record<string, unknown[]>
    // Other plugin's hook preserved
    expect(hooks.SessionStart).toHaveLength(1)
    expect((hooks.SessionStart[0] as Record<string, unknown>).command).toBeUndefined()
    // Our hook added
    expect(hooks.Stop).toHaveLength(1)
  })

  test("re-install replaces managed entries idempotently", () => {
    const existing = {
      hooks: {
        SessionStart: [
          { matcher: "*", hooks: [{ type: "command", command: "old-hook" }] },
        ],
      },
      _managed: { "my-plugin": { SessionStart: [0] } },
    }

    const result = mergeCodexHooks(existing, {
      SessionStart: [{ matcher: "*", hooks: [{ type: "command", command: "new-hook" }] }],
    }, "my-plugin")

    const hooks = result.hooks as Record<string, unknown[]>
    expect(hooks.SessionStart).toHaveLength(1)
    // Old hook replaced with new
    const entry = hooks.SessionStart[0] as Record<string, unknown>
    const entryHooks = entry.hooks as Array<Record<string, unknown>>
    expect(entryHooks[0].command).toBe("new-hook")
  })

  test("cleans up managed entries when plugin removes hooks", () => {
    const existing = {
      hooks: {
        SessionStart: [
          { matcher: "*", hooks: [{ type: "command", command: "manual-hook" }] },
          { matcher: "*", hooks: [{ type: "command", command: "plugin-hook" }] },
        ],
      },
      _managed: { "my-plugin": { SessionStart: [1] } },
    }

    const result = mergeCodexHooks(existing, {}, "my-plugin")

    const hooks = result.hooks as Record<string, unknown[]>
    // Manual hook preserved, plugin hook removed
    expect(hooks.SessionStart).toHaveLength(1)
    const entryHooks = (hooks.SessionStart[0] as Record<string, unknown>).hooks as Array<Record<string, unknown>>
    expect(entryHooks[0].command).toBe("manual-hook")
    // Managed index cleaned
    expect((result._managed as Record<string, unknown>)?.["my-plugin"]).toBeUndefined()
  })

  test("preserves untagged manual hook entries", () => {
    const existing = {
      hooks: {
        SessionStart: [
          { matcher: "*", hooks: [{ type: "command", command: "manual" }] },
        ],
      },
      // No _managed — all entries are manual
    }

    const result = mergeCodexHooks(existing, {
      Stop: [{ matcher: "*", hooks: [{ type: "command", command: "plugin-stop" }] }],
    }, "my-plugin")

    const hooks = result.hooks as Record<string, unknown[]>
    expect(hooks.SessionStart).toHaveLength(1)
    expect(hooks.Stop).toHaveLength(1)
  })

  test("cleans up legacy _source-tagged entries from previous format", () => {
    const existing = {
      hooks: {
        SessionStart: [
          { matcher: "*", hooks: [{ type: "command", command: "legacy" }], _source: "my-plugin" },
          { matcher: "*", hooks: [{ type: "command", command: "manual" }] },
        ],
      },
    }

    const result = mergeCodexHooks(existing, {
      SessionStart: [{ matcher: "*", hooks: [{ type: "command", command: "new" }] }],
    }, "my-plugin")

    const hooks = result.hooks as Record<string, unknown[]>
    // Legacy _source entry removed, manual preserved, new added
    expect(hooks.SessionStart).toHaveLength(2)
  })
})
