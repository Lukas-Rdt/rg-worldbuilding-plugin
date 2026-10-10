---
name: rg-teaser
description: "Generate atmospheric session recaps and cliffhanger teasers ('Previously on...' / 'In the next session...') optimized for Discord or WhatsApp."
argument-hint: "[session number or notes path, e.g. 'Session 14' or 'Sessions/Session-14.md']"
---

# Session Recaps & Teasers (`rg-teaser`)

`rg-teaser` turns dry session notes into thrilling, evocative recaps and cliffhangers designed to be shared with players on Discord, WhatsApp, or campaign journals between game nights.

## When to Use

- A few days before game night to build player excitement and refresh their memories.
- Right after an epic cliffhanger session.

## Output Formats

### 1. "Was bisher geschah..." (The Cinematic Recap)
- 2–3 gripping paragraphs summarizing the party's triumphs, shocking revelations, and critical dilemmas from last session.
- Highlights individual heroics and memorable player roleplay moments.

### 2. "In der nächsten Sitzung..." (The Hook / Teaser)
- 1 atmospheric teaser hook:
  - A dramatic in-world rumor or ominous quote.
  - The immediate sensory reality where the upcoming session begins.
  - A central question hanging over the party's heads.

### 3. Messaging Optimization
- Uses Discord/WhatsApp-friendly Markdown formatting (`**bold**`, `*italics*`, `> blockquotes`).
- Sensitive secrets or player-specific whispers wrapped in Discord spoiler tags (`||geheim||`).

## Workflow

1. Read the target session note or debrief note.
2. Extract the emotional climax and the cliffhanger ending.
3. Generate the teaser in the campaign's established tone (`CAMPAIGN_FRAMEWORK.md`).
4. Present the text ready to copy-paste.
