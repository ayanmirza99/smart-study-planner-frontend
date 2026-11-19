---
name: Smart Study Planner
description: A slotted steel planning board on which the scheduling algorithm files difficulty-keyed T-cards into semester columns.
colors:
  frame: "#1f2b36"
  frame-raised: "#2d3b48"
  frame-ink: "#eef2f4"
  frame-muted: "#a9b8c4"
  page: "#dde3dc"
  board: "#cdd5cb"
  groove: "#bcc6ba"
  board-line: "#a8b3a6"
  sheet: "#f7f8f5"
  sheet-recess: "#eceee9"
  sheet-line: "#d0d6ce"
  control-line: "#b3bdb2"
  card: "#fdfdfb"
  ink: "#1b252e"
  ink-2: "#44525f"
  ink-3: "#5f6c78"
  signal: "#f5bd1f"
  signal-deep: "#9a6f00"
  signal-tint: "#fcf0c8"
  fault: "#b3352a"
  fault-deep: "#8a2219"
  fault-tint: "#f9e3de"
  ok: "#2c7550"
  d1-easy: "#2c7550"
  d2-moderate: "#3561aa"
  d3-medium: "#e8b21f"
  d4-hard: "#e2752b"
  d5-very-hard: "#b3352a"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.1
  nav:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
    letterSpacing: "0.06em"
  card-id:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    letterSpacing: "0.02em"
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  control:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  hairline: "2px"
  base: "3px"
  sheet: "4px"
  frame: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.base}"
    padding: "0 14px"
    height: "38px"
  button-hover:
    backgroundColor: "#edf0ea"
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.base}"
    padding: "0 14px"
    height: "38px"
  button-signal-hover:
    backgroundColor: "#ffc934"
  button-danger:
    backgroundColor: "{colors.card}"
    textColor: "{colors.fault}"
    rounded: "{rounded.base}"
    height: "38px"
  button-danger-hover:
    backgroundColor: "{colors.fault-tint}"
  segmented:
    backgroundColor: "{colors.sheet-recess}"
    rounded: "{rounded.base}"
    padding: "3px"
  segmented-option-selected:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.frame-ink}"
    rounded: "{rounded.hairline}"
    height: "32px"
  tab:
    textColor: "{colors.frame-muted}"
    typography: "{typography.nav}"
    padding: "10px 16px 14px"
  tab-active:
    textColor: "{colors.frame-ink}"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "6px 10px"
    height: "38px"
  chip:
    typography: "{typography.card-id}"
    rounded: "{rounded.hairline}"
    padding: "0 8px"
    height: "24px"
  tcard:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
  tcard-tab:
    typography: "{typography.card-id}"
    padding: "0 8px"
    height: "24px"
  column:
    backgroundColor: "{colors.groove}"
    rounded: "{rounded.base}"
    padding: "10px 8px 12px"
  sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "20px"
  caption-bar:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.frame-ink}"
    padding: "14px 18px"
---

# Design System: Smart Study Planner

## Overview

**Creative North Star: "The Planning Board"**

The interface is a piece of operations hardware: a grey-green enamelled steel board held in a dark slate frame, onto which the scheduling algorithm files colored T-cards into semester slots. Every surface belongs to that object. The frame (header, caption bar, the 8px border around the board) is dark slate; the board is enamel with a faint noise grain; semester columns are recessed grooves with printed slot rails; courses are cream T-cards whose colored tab is keyed to difficulty. Text that labels the board is set like a printed placard: Barlow Condensed, uppercase, tracked.

Density is high and meant to be read up close on a laptop. Hierarchy comes from material (frame vs board vs card), not from size jumps: the biggest type in the app is under 2rem. Color is functional twice over: the five-step difficulty key paints every course, and two signal colors carry state (signal yellow for "this is the active step / selected / focus", fault red for errors and cycles). The world refuses the sidebar-and-stat-card SaaS dashboard: there is no sidebar, no KPI tiles, no gradient hero.

Motion is narrow and authored: cards file into their columns during a replay, chips bump in as they unlock, the active tab's signal bar rises from the frame edge. Everything collapses under `prefers-reduced-motion`.

**Key Characteristics:**
- Dark slate frame, enamel board, recessed column grooves, cream T-cards: depth is physical, not decorative.
- Difficulty is always shown as the T-card tab color (D1 green to D5 red), and the same key fills the 18-segment credit gauge.
- Signal yellow means "active / current / selected"; fault red means "broken"; neither is decoration.
- Barlow Condensed uppercase placards label the board; Barlow carries reading text with tabular figures.
- Small radii (2-6px) throughout: stamped steel and card stock, never pills.

## Colors

A restrained slate-and-enamel neutral field with one signal accent, one fault color, and a five-step difficulty key that does the categorical work.

### Primary
- **Signal Yellow** (signal): the active step. Play button, the active tab's under-bar, the current step number in the caption, the outline on the active column and active T-card, the sorted table header, text selection, focus rings on dark surfaces, and the primary "Run benchmark" button.
- **Signal Deep** (signal-deep): signal yellow's legible partner on light surfaces: focus outlines, the border of signal buttons, the unlocked-chip ring on the board, the focused graph node stroke.
- **Signal Tint** (signal-tint): wash for the row being edited, the sorted table column, and an active deferral ghost.

### Secondary
- **Fault Red** (fault): circular-dependency headings, cycle arrows, error status text, danger buttons and the slow series in benchmark charts.
- **Fault Deep** (fault-deep): body text inside fault-tinted panels (backend-offline banner, inline errors).
- **Fault Tint** (fault-tint): the panel wash behind faults and the cycle loop.
- **Running Green** (ok): success status text.

### Tertiary: the difficulty key
- **D1 Easy** (d1-easy), **D2 Moderate** (d2-moderate), **D3 Medium** (d3-medium), **D4 Hard** (d4-hard), **D5 Very hard** (d5-very-hard). Applied through a `.d1`-`.d5` class that sets `--tone` and `--tone-ink`; D1, D2 and D5 take white ink, D3 and D4 take dark ink (ink). D2 Moderate blue doubles as the "fast" series in benchmark charts and the fast Big-O badge.

### Neutral
- **Slate Frame** (frame): header, caption bar, board border, selected segmented option, indegree badges.
- **Raised Slate** (frame-raised): the 4px ledge under the header, tab counters, hover on transport buttons.
- **Frame Ink / Frame Muted** (frame-ink, frame-muted): text on slate; muted for inactive tabs and the brand subtitle.
- **Page Enamel** (page): the page background, with a faint fractal-noise grain.
- **Board Enamel** (board): inside the board shell, graph well and empty board.
- **Groove** (groove): recessed semester columns; **Board Line** (board-line): dividers on the board.
- **Sheet / Sheet Recess / Sheet Line** (sheet, sheet-recess, sheet-line): paper panels laid on the page, their recessed fills (table headers, segmented track) and hairlines.
- **Control Line** (control-line): 1px border of buttons, inputs, segmented controls and scale options.
- **Card Stock** (card): T-card bodies, buttons, the course form.
- **Ink / Ink 2 / Ink 3** (ink, ink-2, ink-3): primary text, secondary text and placards, metadata and hints.

### Named Rules
**The Signal Means Now Rule.** Signal yellow marks the one thing that is active, current or selected (the step, the column, the tab, the sorted key). If two unrelated things glow yellow on one screen, one of them is wrong.

**The Card Colour Is Difficulty Rule.** The five tone colors encode difficulty and nothing else (benchmark series excepted, which reuse D2 blue and fault red as fast/slow). Never use a D-tone as a decorative accent.

**The Yellow Needs Ink Rule.** Text on signal yellow or D3/D4 is always dark ink; on light surfaces, signal shows as signal-deep for any line or text that must be read.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow, sans-serif), weights 500/600/700 via @fontsource
**Body Font:** Barlow (with system-ui, sans-serif), weights 400/500/600 via @fontsource

**Character:** Barlow Condensed is the stencil on the hardware: uppercase placards, course IDs, credit counts, step numbers. Barlow, its wider sibling, keeps reading text calm. Numerals are tabular everywhere so credit totals and timings line up.

### Hierarchy
- **Display** (700, 1.75rem, 1.1, uppercase, 0.01em): the product name in the frame only; 1.4rem under 760px.
- **Headline** (700, 1.65rem, 1.1): sheet headings (h2), 1.45rem on mobile; fault headings set it uppercase in fault red.
- **Title** (700, 1.15rem, 1.1): h3 and sub-headings; benchmark matchup titles step up to 1.4rem.
- **Nav** (600, 1.05rem, 0.06em, uppercase): frame tabs.
- **Card ID** (700, 0.95-1rem, 0.02em): course IDs in chips, T-card tabs, graph nodes, the order strip.
- **Label / Placard** (600, 0.85rem, 0.08em, uppercase): column heads, tray headings, field labels, table headers (0.07em), the "Rank by" control label (0.95rem).
- **Body** (400, 15px, 1.5, tabular figures): reading text; notes cap at 72ch, captions at 90ch.
- **Control** (600, 0.9rem, line-height 1): buttons and segmented options.
- **Meta** (400-500, 0.74-0.85rem): T-card names (0.82rem, two-line clamp) and their P/D/date meta (0.74rem). This is the density floor; do not go smaller.

### Named Rules
**The Placard Rule.** Anything that labels a part of the board (a column, a tray, a field, a table header) is Barlow Condensed, uppercase, tracked 0.06-0.08em, ink-2. Reading text is never set this way.

**The Ranking Underline Rule.** When the plan is ranked by a key, that field on every T-card is shown in ink at 600 with a 2px signal underline. The ranking key is visible on the cards themselves, not just in the control.

## Layout

A single centered column capped at 1440px, page padding 20px 24px (16px under 760px), vertical gap 16px between sections. No sidebar. The frame header holds the brand on the left and tabs on the right, aligned to the bottom edge so the active tab's bar sits on the frame's lower ledge.

The Study Plan screen reads top to bottom: control strip (rank segmented control left; view toggle and CSV right), then the board shell, which is the caption bar (transport + numbered caption) on top of a two-column board: a 168px tray (waiting chips, difficulty key) and a horizontally scrolling rail of semester columns (min 166px each, 12px gap). The Courses tab is a 380px sticky form beside a list sheet, collapsing to one column at 960px.

Spacing runs on a 4px base (4, 8, 12, 16, 20, 24), with 5-7px used inside dense card internals.

At 760px and below: the tabs go full width, controls stack and stretch, the caption bar becomes one column, the tray moves above the rail, columns fix at 200px with scroll-snap and a right-edge fade mask plus a "swipe sideways" placard, the board border thins to 4px, and the courses table turns into stacked records with inline labels.

## Elevation & Depth

Depth is physical and mostly tonal: the frame is darkest, the board is recessed enamel, columns are pressed-in grooves (inset shadow), and cards and sheets sit on top. Shadows are small and cool (rgba of slate, never black at high opacity). Rings, not shadows, signal state: a 2px signal ring marks the active column, active card and current chip.

### Shadow Vocabulary
- **Groove** (`box-shadow: inset 0 2px 4px rgba(30,45,35,0.22), inset 0 -1px 0 rgba(255,255,255,0.4)`): semester columns; the graph well uses a lighter inset.
- **Sheet rest** (`box-shadow: 0 1px 2px rgba(20,30,40,0.06)`): paper sheets on the page.
- **Card lift** (`box-shadow: 0 1px 0 rgba(20,30,40,0.12), 0 2px 6px rgba(20,30,40,0.1)`): T-cards and the course form. Lifts 1px further on hover with a soft 6px/14px shadow. A third soft layer (`0 4px 3px -2px rgba(27,37,46,0.25)`) seats the card in its slot.
- **Active ring** (`0 0 0 2px var(--signal)` plus a soft 16px drop): the active T-card and column.
- **Floating panel** (`0 10px 30px rgba(20,30,40,0.18)`): the call-to-action card over the empty board only.

### Named Rules
**The Rings Not Glows Rule.** State is shown with a crisp 2px signal ring (optionally separated by a 2px gap in the surface color), never with a colored blur glow.

## Shapes

Stamped and cut: small corners everywhere. 2px for chips, tags, segments and badges; 3px (the base radius) for buttons, inputs, sheets, columns and T-cards; 4px for larger panels (course form, fault tag, empty-board card); 6px only for the board shell. The single round shape is the 44px play button in the transport. Borders are 1px hairlines; dashed 1.5px borders mean "not here yet" (deferral ghosts, empty notes). The only patterned edges are hazard stripes on faults: a 45-degree signal/slate stripe atop the cycle fault tag and a fault-red stripe atop the backend-offline banner.

## Components

### Buttons
Plain, firm, card-stock buttons that press down 1px.
- **Shape:** base radius (3px), 38px tall, 14px side padding, 17px icon with 8px gap.
- **Default:** card-stock fill, control-line border, ink text; hover shifts to a faint green-grey fill and darker border.
- **Signal:** signal-yellow fill, signal-deep border, a 2px inset bottom bevel; for the one primary action on a screen (run benchmark, watch it build).
- **Danger:** default button with fault-red text; hover takes the fault tint.
- **Icon button:** 36px square, transparent until hover. On the caption bar they sit in frame-muted, and the play control is the 44px round signal button.
- **Disabled:** 45% opacity, not-allowed cursor.

### Segmented control
A recessed track (sheet-recess, control-line border, 3px padding) with 32px options; the selected option is a slate key (frame fill, frame-ink text, small drop shadow). Used for the ranking key and the Board/Tables view toggle; options stretch to equal width on mobile.

### Chips
Course ID chips filled with their difficulty tone (24px tall, hairline radius, Card ID type). In the replay queue a chip's fate is shown by fill: outlined in its tone while pending, struck through in frame-muted when deferred, ringed in signal when current or unlocked. An indegree counter rides inside the chip as a small slate badge.

### Cards / Containers
- **Sheet:** paper panel, sheet fill, sheet-line border, base radius, 20px padding (16px mobile), sheet-rest shadow.
- **Board shell:** 8px slate frame on three sides with the caption bar as its top, board enamel inside, 6px radius.
- **Column (groove):** groove fill, inset shadow, a placard head with "n/18" credits, the 18-segment gauge, then printed slot rails behind the cards.

### Inputs / Fields
- **Style:** white fill, control-line border, base radius, 38px min height, Barlow 500 0.95rem; placard-style label above (0.85rem uppercase, 5px gap).
- **Focus:** border goes to slate and a 3px translucent signal ring appears.
- **Disabled:** translucent white fill, ink-2 text.
- **Difficulty / priority scale:** five equal 36px tiles; each difficulty tile carries a 4px tone bar on its bottom edge and fills with its tone when chosen.

### Navigation
Frame tabs in Nav type, frame-muted at rest, frame-ink on hover and when current. The current tab rises a 4px signal bar from the frame's bottom edge (scaleY, 240ms ease-out). The Courses tab carries a raised-slate count badge. On mobile the tabs fill the width and scroll horizontally without a scrollbar.

### T-card (signature)
The course as a physical card: a 24px tab in the difficulty tone carrying the course ID (left) and credits (right) in Barlow Condensed, over a card-stock body with a two-line name and a P/D/date meta row. It sits on the card-lift shadow, lifts on hover, and gets a signal ring when it is the card being filed in a replay. The course form is the same object enlarged: its tab recolors live as the difficulty is chosen.

### Credit gauge (signature)
An 18-segment rail under each column head; each filled segment takes the tone of the card that filled it, so a column's difficulty mix reads at a glance.

### Caption bar and replay (signature)
Slate bar above the board: transport controls left, a numbered step ("10/32" in signal) and a plain-language caption with bold figures right, with the queue of chips beneath. During replay cards file in (520ms: from offset, -2deg, slight blur), ghosts and chips bump in (300-420ms). This is the system's one authored motion.

### Fault tag (signature)
The cycle error is a tag pinned to the board: hazard stripe header, uppercase fault-red headline with icon, explanation, the cycle drawn as large tone chips joined by fault-red arrows on a fault-tint well, and recovery actions.

## Do's and Don'ts

### Do:
- **Do** color every course by its difficulty tone (D1-D5), on T-cards, chips, gauge segments, graph nodes and form tiles alike.
- **Do** reserve signal yellow for the single active / current / selected thing, and use signal-deep for any signal line or text on a light surface.
- **Do** label board parts with uppercase Barlow Condensed placards tracked 0.06-0.08em in ink-2.
- **Do** keep radii at 2-4px (6px only for the board shell) and borders at 1px hairlines.
- **Do** show state with 2px rings and fills, and keep motion to the filing and bump vocabulary on `cubic-bezier(0.16, 1, 0.3, 1)`, disabled under reduced motion.
- **Do** keep numerals tabular and show the reasoning in plain captions (counts, credits, deferrals) next to the visual.

### Don't:
- **Don't** introduce a sidebar, stat-card KPI rows or a gradient hero; this is a board in a frame, not a SaaS dashboard.
- **Don't** use a difficulty tone as decoration or for a meaning other than difficulty (outside the fast/slow chart series).
- **Don't** put white text on signal yellow, D3 or D4.
- **Don't** use pills, large radii or colored blur glows.
- **Don't** set text smaller than 0.74rem, or put ink-3 text smaller than 0.85rem directly on board or groove enamel.
