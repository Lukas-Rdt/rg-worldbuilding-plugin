---
name: rg-configure
description: "Configure workspace-local preferences for RG-Engineering, such as automatic commits, work delegation, and output formats."
---

# RG-Engineering Interactive Configuration

Guide the user through configuring or updating their repository-local configuration file `.rg-engineering/config.local.yaml`.

## Operating Principles

- **No guessing:** Display current configuration values and prompt the user before changing anything.
- **Save safely:** Preserve any existing configuration values in the YAML file when writing updates. Do not overwrite other keys (e.g. pulse or sweep settings) unless explicitly requested.
- **Use interactive questions:** Ask each question below using the platform's blocking question tool: `AskUserQuestion` in Claude Code (call `ToolSearch` with `select:AskUserQuestion` first if its schema isn't loaded), `request_user_input` in Codex, `ask_question` in Antigravity CLI (`agy`), `ask_user` in Pi (requires the `pi-ask-user` extension). Fall back to chat selection lists only when no blocking tool is available.

---

## Workflow

### Step 1: Resolve Repository Root and Config File

1. Resolve the repository root:
   ```bash
   git rev-parse --show-toplevel
   ```
   If not inside a git repository, report that configuration is only available inside a git repository and stop.

2. Verify if the config directory and file exist:
   - Config directory: `<repo-root>/.rg-engineering/`
   - Config file: `<repo-root>/.rg-engineering/config.local.yaml`

3. If the config file does not exist:
   - Ask the user if they want to initialize a configuration file for this repository.
   - If they agree, copy `<repo-root>/.rg-engineering/config.local.example.yaml` to `<repo-root>/.rg-engineering/config.local.yaml` if the example exists.
   - If the example file is missing, create a new file with the default template format.
   - Ensure `.rg-engineering/*.local.yaml` is added to `.gitignore` so local settings are not accidentally committed.

### Step 2: Read Current Settings

Read the contents of `<repo-root>/.rg-engineering/config.local.yaml` using the native file-read tool. Parse the active keys (ignoring lines starting with `#`).

Particularly extract:
- `git_allow_auto_commit` (default: `true` if not set or commented)
- `work_delegate` (default: `false` if not set or commented)
- `plan_output` / `brainstorm_output` / `ideate_output` (default: `md` if not set or commented)

### Step 3: Prompt User for Configuration

Present the current settings in chat, then guide the user through the settings:

1. **Automatic Git Commits:**
   Ask: "Do you want to allow RG-Engineering skills (such as rg-code-review and rg-work) to automatically commit verified changes when starting from a clean git working tree?"
   - **Option 1:** "Yes, allow automatic commits (git_allow_auto_commit: true)"
   - **Option 2:** "No, I want to review and commit changes manually (git_allow_auto_commit: false)"

2. **Work Delegation (Codex):**
   Ask: "Do you want to enable automatic work delegation to Codex?"
   - **Option 1:** "Yes, delegate when appropriate (work_delegate: codex)"
   - **Option 2:** "No, run everything locally (work_delegate: false)"

3. **Output Formats:**
   Ask: "Select the preferred output format for generated plans and brainstorm documents:"
   - **Option 1:** "Markdown (.md) for both (standard/simplest)"
   - **Option 2:** "Rich HTML (.html) for both (beautiful human-readable reports)"

### Step 4: Write Configuration

Update/merge the resolved values back into `<repo-root>/.rg-engineering/config.local.yaml` using the native file-write/edit tool.

Ensure:
- Values are written as active YAML keys (e.g. `git_allow_auto_commit: false`).
- Commented examples are preserved.
- Any other keys (such as `pulse_*` or `sweep_*`) are preserved byte-for-byte.

### Step 5: Report Status

Display a clean summary of the saved preferences:
```text
✅ RG-Engineering configuration updated:

  Automatic commits: [Allowed / Manually reviewed]
  Work delegation:   [Enabled / Disabled]
  Output format:     [Markdown / Rich HTML]

Preferences saved to .rg-engineering/config.local.yaml
```
