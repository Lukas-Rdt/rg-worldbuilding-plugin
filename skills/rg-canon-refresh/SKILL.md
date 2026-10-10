---
name: rg-canon-refresh
description: "Vault-wide lore maintenance: scans for broken [[WikiLinks]], unlinked mentions, unresolved contradictions, and synchronizes the NPC and entity register in WORLD_CANON.md."
argument-hint: "[optional scope, e.g. 'NPCs' or 'Locations' or blank for full vault]"
---

# Canon & Vault Registry Refresh (`rg-canon-refresh`)

`rg-canon-refresh` audits the entire Obsidian vault for structural and lore hygiene. It detects broken links, catches unindexed notes, highlights orphaned lore, and updates the canonical NPC, faction, and location registers.

## When to Use

- Periodically (e.g., every 3-5 sessions) or after reorganizing vault folders.
- When notes were renamed or moved in Obsidian.
- To refresh the master index in `WORLD_CANON.md`.

## Audit Capabilities

1. **Broken `[[WikiLinks]]` Detection:**
   - Scans all Markdown notes for links pointing to non-existent filenames or misspelled aliases.
   - Suggests near-match corrections (e.g. `[[Lady Elenor]]` -> `[[Lady Eleanor]]`).
2. **Unlinked Mentions Finder:**
   - Identifies occurrences where a canonical NPC, artifact, or landmark is mentioned by name in plain text without a `[[WikiLink]]`.
3. **Orphaned Notes Check:**
   - Lists notes with zero incoming links from session logs or other world notes.
4. **Register Synchronization (`WORLD_CANON.md`):**
   - Automatically crawls the configured folders (`paths.npcs`, `paths.locations`, `paths.factions`, `paths.lore`).
   - Updates alphabetical and categorized index tables in `WORLD_CANON.md` with active status, aliases, and direct links.

## Execution Workflow

1. Crawl the vault root and subfolders, gathering all Markdown files and frontmatter.
2. Build an in-memory graph of all `[[WikiLinks]]` and target notes.
3. Generate a hygiene report:
   - Broken links found and recommended fixes.
   - Unlinked mentions that can be linked.
   - Orphaned notes.
4. Update `WORLD_CANON.md` index tables in-place.
5. Offer the DM to automatically apply link repairs in vault notes.
