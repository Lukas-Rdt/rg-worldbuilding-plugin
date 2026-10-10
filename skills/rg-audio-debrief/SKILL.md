---
name: rg-audio-debrief
description: "Process raw audio transcripts, voice memos, or stream-of-consciousness DM debriefs into structured session notes, NPC improvs, and prep tasks."
argument-hint: "[path to transcript or audio memo, or paste debrief notes]"
---

# Audio & Voice Memo Debrief (`rg-audio-debrief`)

`rg-audio-debrief` bridges the gap between chaotic post-session energy and durable vault lore. After a game, DMs often record quick voice memos while driving home or speaking into phone dictation apps. This skill extracts improvisations, facts, and player reactions from raw text or transcripts into structured notes.

## When to Use

- Right after a game session when the DM has a voice recording, rough dictation, or raw transcript.
- Precedes `/rg-compound-canon` to prepare material for canonization in `WORLD_CANON.md`.

## Debrief Extraction Protocol

1. **Chronological Plot Beat Extraction:**
   - Filter out table banter, pizza orders, and rules lookups.
   - Reconstruct the actual in-world sequence of events.
2. **Spontaneous Improvisation Capture:**
   - Detect newly invented NPCs (names, mannerisms, occupations) improvised on the spot.
   - Detect off-the-cuff promises or lore hints dropped to the players.
3. **Player Theories & Table Sentiment:**
   - Capture what the players speculated ("They think the mayor is secretly a vampire!").
   - Note high-emotion moments (triumphs, near-deaths, character drama).
4. **Immediate Prep Action Items:**
   - What needs to be prepped before next time?

## Output Document

Outputs a clean debrief note saved to `<paths.sessions>/Session-<N>-Debrief.md`:

```markdown
---
type: session-debrief
session: "<N>"
date: YYYY-MM-DD
tags:
  - ttrpg/debrief
---

# Session <N> Debrief

## Kern-Ereignisse (Was geschah wirklich)
- ...

## Spontane Improvisationen (Neue NSCs & Lore)
- **[[Neuer NSC / Ort]]:** Kurzbeschreibung & getroffene Aussage.

## Spieler-Theorien & Dynamik
- ...

## To-Do für nächste Vorbereitung
- [ ] ...
```

Offers to automatically run `/rg-compound-canon` to update NPC notes and faction clocks.
