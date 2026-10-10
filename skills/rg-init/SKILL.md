---
name: rg-init
description: "Interactive onboarding and setup for tabletop RPG Obsidian vaults: scan vault structure, configure campaign system, folder mappings, WikiLinks, and safety tools into config.local.yaml."
disable-model-invocation: true
argument-hint: "[optional path to vault root]"
---

# RG Worldbuilding Vault Onboarding (`rg-init`)

Initialize and configure an existing Obsidian vault for TTRPG campaign prep, worldbuilding, and session compounding.

## Interaction Method

Ask questions step-by-step using the platform's question tool (`AskUserQuestion` / `request_user_input` / `ask_question`). Fall back to chat prompts only when no tool is available. Conduct an interactive interview: present detected defaults and confirm with the DM rather than making unilateral assumptions.

## Phase 1: Automatic Vault Scan (Non-Destructive)

Inspect the current vault directory structure without modifying or deleting any files:

1. **Folder Discovery:** Scan the root and first two levels of subdirectories to locate existing organizational patterns:
   - Sessions / logs (e.g. `Sessions/`, `01 Sessions/`, `Logs/`, `Campaign/Sessions/`)
   - NPCs / characters (e.g. `World/NPCs/`, `NPCs/`, `Characters/`, `People/`)
   - Locations / places (e.g. `World/Locations/`, `Locations/`, `Places/`, `Atlas/`)
   - Factions / organizations (e.g. `World/Factions/`, `Factions/`, `Organizations/`)
   - Lore / history / pantheon (e.g. `World/Lore/`, `Lore/`, `Worldbuilding/`)
   - Handouts / player materials (e.g. `Handouts/`, `Player Handouts/`, `Artifacts/`)
2. **Obsidian Conventions:**
   - Detect if notes predominantly use `[[WikiLinks]]` or standard markdown links (`[Title](https://example.com)`).
   - Check if Dataview frontmatter properties (e.g. `type:`, `tags:`, `aliases:`) or templates exist.
   - Check for community plugin markers (e.g. `obsidian-5e-statblocks`, `fantasy-calendar`, `leaflet`).
3. **Existing Canon:**
   - Check whether `CAMPAIGN_FRAMEWORK.md` or `WORLD_CANON.md` already exist in the root or `World/`.

## Phase 2: Interactive Onboarding Interview

Walk the DM through single-question dialogs:

1. **Campaign Name & System:**
   - Confirm campaign name.
   - Select ruleset: `dnd5e` (2014), `dnd2024` (2024 revision), `pf2e` (Pathfinder 2e), or `system-agnostic`.
2. **Folder Mapping:**
   - Present the detected folder paths for sessions, NPCs, locations, factions, lore, and handouts.
   - Confirm or adjust each path (e.g. "Detected `World/NPCs` for NPCs. Keep this or specify another folder?").
3. **Vault Formatting Preferences:**
   - Link style: `[[WikiLinks]]` (default for Obsidian) vs markdown links.
   - Dataview compatibility: frontmatter tags and properties enabled.
   - Statblock format: `obsidian-5e` code blocks, markdown tables, or raw JSON.
4. **Tone & Pillars of Play:**
   - Campaign tone (e.g. "Heroic Fantasy with Political Intrigue", "Grimdark Survival", "Eldritch Mystery").
   - Pillars of Play balance (e.g. `40/30/30` for Social / Combat / Exploration).
5. **Safety Tools:**
   - Ask if the group uses Lines (hard limits) and Veils (fade to black) to record in the campaign framework.

## Phase 3: Create Local Configuration

Write `.rg-worldbuilding/config.local.yaml` at the vault root using `references/config-template.yaml` as baseline:

```yaml
campaign:
  name: "<Campaign Name>"
  system: "<dnd5e | dnd2024 | pf2e | system-agnostic>"
  edition: "<2024 | 2014 | remaster | agnostic>"
  tone: "<Tone Description>"
  pillars: "<Social/Combat/Exploration ratios>"

paths:
  sessions: "<sessions path>"
  npcs: "<npcs path>"
  locations: "<locations path>"
  factions: "<factions path>"
  lore: "<lore path>"
  handouts: "<handouts path>"

vault:
  link_style: "wikilinks"
  use_dataview: true
  statblock_format: "obsidian-5e"

safety:
  lines: []
  veils: []
```

Ensure `.rg-worldbuilding/` directory is created safely.

## Phase 4: Optional Bootstrapping

Ask the DM if they would like to bootstrap canonical documents:
- **`CAMPAIGN_FRAMEWORK.md`:** Create campaign foundation note if not present (setting pitch, tone, pillars, safety tools, table rules).
- **`WORLD_CANON.md`:** Create index note linking existing major NPCs, factions, and landmarks discovered during the scan.

Present a summary of the configuration and suggest starting prep with `/rg-prep-plan` or generating ideas with `/rg-spark`.
