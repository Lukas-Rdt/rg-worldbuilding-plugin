---
name: rg-configure
description: "Configure or update workspace-local preferences for RG Worldbuilding in .rg-worldbuilding/config.local.yaml (paths, ruleset, link styles, safety tools)."
---

# RG Worldbuilding Interactive Configuration (`rg-configure`)

Guide the DM through configuring or updating their vault configuration file `.rg-worldbuilding/config.local.yaml`.

## Operating Principles

- **Non-Destructive:** Read existing values, prompt the DM before making changes, and preserve existing settings.
- **No Git Dependency:** Operate directly in the Obsidian vault without requiring or executing git commands.
- **Interactive:** Use the platform question tool (`AskUserQuestion` / `request_user_input` / `ask_question`) to present options.

## Workflow

### Step 1: Locate Configuration File

1. Check if `.rg-worldbuilding/config.local.yaml` exists in the vault root.
2. If the file does not exist, recommend running `/rg-init` for full onboarding or offer to initialize with defaults from the template.

### Step 2: Read Current Settings

Read `.rg-worldbuilding/config.local.yaml` and extract active configuration:
- `campaign.name`, `campaign.system`, `campaign.edition`, `campaign.tone`, `campaign.pillars`
- `paths.sessions`, `paths.npcs`, `paths.locations`, `paths.factions`, `paths.lore`, `paths.handouts`
- `vault.link_style`, `vault.use_dataview`, `vault.statblock_format`
- `safety.lines`, `safety.veils`

### Step 3: Interactive Configuration Menu

Prompt the DM with areas they wish to review or modify:

1. **Ruleset & System:**
   - Update TTRPG system (`dnd5e`, `dnd2024`, `pf2e`, `system-agnostic`) or edition.
2. **Folder Mappings:**
   - Modify paths for sessions, NPCs, locations, factions, lore, or handouts to reflect reorganization in Obsidian.
3. **Vault & Note Formatting:**
   - Link style: `wikilinks` (`[[Name|Alias]]`) vs markdown links.
   - Statblock format: `obsidian-5e` code blocks, markdown tables, or JSON.
   - Dataview property compatibility toggle.
4. **Campaign Tone & Pillars:**
   - Adjust theme, narrative tone, or pillar focus (e.g. 50% Social, 30% Exploration, 20% Combat).
5. **Safety Tools (Lines & Veils):**
   - Add or remove content boundaries for the campaign group.

### Step 4: Save Configuration

Merge updated values into `.rg-worldbuilding/config.local.yaml` preserving comments and unedited keys.

### Step 5: Report Status

Display a clean summary of the active configuration:

```text
✅ RG Worldbuilding configuration updated:

  Campaign:   <Campaign Name> (<System> / <Edition>)
  Tone:       <Tone> (<Pillars>)
  NPCs Path:  <NPCs Path>
  Sessions:   <Sessions Path>
  Link Style: <WikiLinks | Markdown>

Saved to .rg-worldbuilding/config.local.yaml
```
