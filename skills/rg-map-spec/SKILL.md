---
name: rg-map-spec
description: "Structure room-by-room dungeon and site specifications: room numbering, dimensions/grid, lighting, acoustic queues, traps, monster tactics, and battlemap generation prompts."
argument-hint: "[dungeon or site name, e.g. 'The Sunken Tomb of Al-Dahir' or 'Ironfang Keep']"
---

# Dungeon & Map Specification (`rg-map-spec`)

`rg-map-spec` designs modular, room-by-room architectural specifications for dungeons, castles, cavern networks, and adventure sites. It provides the structured key (room catalog) needed to run tactical exploration at the table, along with prompts for battlemap creation tools (Dungeondraft, Inkarnate, or AI image generators).

## When to Use

- When keying a numbered dungeon map.
- When turning an abstract location idea into a tactical environment with grid dimensions, lines of sight, and interactive terrain.

## Room Specification Structure

Every room entry in the catalog follows a rigorous tactical template:

1. **Raum-Nummer & Titel:** E.g. `Raum 04: Die Klagende Zisterne`.
2. **Dimensionen & Beschaffenheit:** E.g. `12x9 m (40x30 ft.), 6 m Deckenhöhe, glatter Basalt, knöcheltiefes fauliges Wasser`.
3. **Lichtverhältnisse & Akustik:** E.g. `Totale Dunkelheit; stetiges hallendes Glucksen aus dem Nordabfluss`.
4. **Vorlesetext (Sensory Box):** Maximal 2–3 prägnante Sätze.
5. **Gefahren & Fallen:** Detail der Mechanik, Erkennung (**DC 14 Perception**) und Entschärfung (**DC 13 Thieves' Tools**).
6. **Begegnung & Monster-Taktik:** Wer ist hier? Wie reagieren sie auf Lärm in Nachbarräumen?
7. **Interaktives Terrain & Beute:** Hebel, geheime Fächer, Schatzkisten.
8. **Map-Prompt:** Fertiger Text-Prompt für Kartentools oder Bildgeneratoren.

## Output Document

Saved to `<paths.locations>/<Dungeon-Name> - Map Spec.md`:

```markdown
---
type: dungeon-spec
location: "<Dungeon Name>"
rooms_count: 5
grid_scale: "5 ft. per square"
status: ready
tags:
  - ttrpg/dungeon
---

# Map Spec: [[<Dungeon Name>]]

## Übersicht & Ökologie
- **Gesamteindruck:** Feuchte Katakomben aus dem 3. Zeitalter.
- **Wandernde Monster (d6 alle 2 Runden bei Lärm):**
  - 1-2: 1d4 Riesenratten
  - 3-4: 2 Ghule

---

### Raum 01: Der Eingangsschacht
- **Dimensionen:** 6x6 m (20x20 ft.), Deckenhöhe 4 m.
- **Licht & Akustik:** Schwaches Dämmerlicht von der Deckenöffnung; modriger Luftzug.
- **Vorlesetext:**
  > *Feuchte Basaltstufen führen hinab in die Dunkelheit. Der Boden ist von schlüpfrigem Moos überzogen, und aus der Tiefe steigt der Geruch von nassem Fell auf.*
- **Gefahren:** Rutschige Stufen (**DC 12 Dexterity** oder Sturz für **1d6 bludgeoning damage**).
- **Begegnung:** Keine.
- **Ausgänge:** Holztür nach Norden zu Raum 02.
- **Map-Prompt:** *Top-down tactical battlemap of a stone dungeon entrance shaft, damp mossy basalt steps, moody dim lighting from above, 5ft grid, fantasy RPG style.*
```
