# AGENTS.md — Project ReMotion Investigation Portal

Guidance for AI agents working in this repository.

## What this project is

A **vanilla-JavaScript single-page application** (no frameworks, no bundler, no
`package.json`, no build step, no tests) built for a university course
(Advanced Web Engineering). It presents a fictional investigation case: an
AI-assisted rehabilitation robot loaded the wrong calibration profile and
emergency-stopped. The user browses evidence, people, locations, and a timeline,
and drafts a hypothesis.

**Important context:** this is a deliberately "brownfield" codebase for a
refactoring exercise (`EXERCISE_1.md`). It contains **intentional bugs,
inconsistent patterns, and technical debt** that the student is meant to find
and fix themselves. Do not "clean up" or fix suspicious code unless the user
asks — the bugs are the coursework. `EXERCISE_1.md` is the authoritative spec
for what the exercise expects (ES module split, bug hunts, `async`/`await`,
arrow functions, DevTools usage).

## How to run

The app uses `fetch()` on local JSON files (and, after the module refactor,
ES modules), so it **must be served over HTTP** — `file://` will not work.

```bash
python -m http.server 8080   # or: npx serve .
```

Then open `http://localhost:8080`. VS Code Live Server is preconfigured on
port **5501** (see `.vscode/settings.json`).

## Verification

There is **no test suite, linter, type checker, or build**. Verification is
manual: serve the app, open the browser, click through the five views, and
watch the DevTools console/network tabs. After any change, confirm the app
still loads data and every view renders.

## Repository layout

```
index.html      App shell: header/nav + 5 <section class="view"> containers.
                Views are shown/hidden via the .active class (hash routing).
app.js          ALL application logic (~1085 lines, single file, ES5 style:
                var, function expressions, string-concatenated innerHTML).
styles.css      All styles (~820 lines), organised by /* Section */ comments.
data/           Static JSON fetched at runtime — the entire "backend".
  case.json       Single object: case title, status, summary.
  evidence.json   18 evidence items (see schema below).
  people.json     6 people; avatar paths point into assets/people/.
  locations.json  6 locations (ids L01..L06).
  timeline.json   15 events; evidenceIds cross-reference evidence.
assets/         Used images: logo/logo.svg, people/<person-id>.png avatars.
resources/      LEGACY/UNUSED: duplicate avatars with snake_case names.
                Nothing references this folder — do not wire it in by accident.
EXERCISE_1.md   The course exercise: tasks, theory questions, grading notes.
README.md       User-facing project description.
.vscode/        Live Server port config only.
```

## Architecture of app.js

The file is organised by `// -----` banner comments, in this order:

| Section (approx. lines) | Contents |
|---|---|
| Global state (1–35) | All shared state as top-level `var`s: `allEvidence`, `filteredEvidence`, `selectedEvidence`, `bookmarks`, `allPeople`, `allLocations`, `allTimeline`, `caseData`, `notesStore`, `viewRendered` flags, `currentPage`, plus `STORAGE_KEY_*` constants. |
| Data loading (41–125) | `loadAllData()` → `loadCorePeopleAndLocations()` (deeply nested fetch of case+people+locations), `loadEvidenceData()`, `loadTimelineData()`. Loading overlay hidden after a counted number of steps (`loadingStepsRemaining`). |
| Lookup helpers (131–176) | `findEvidenceById`, `findPersonById`, `findLocationById` (linear scans), `evidenceMentionsPerson`, `formatDate`, badge-class helpers. |
| Navigation (182–226) | Hash routing: `navigateTo()` sets `location.hash`; `handleHashChange()` toggles `.view.active`, updates nav buttons, lazily renders each view once (`viewRendered` flags). Valid views: `dashboard`, `evidence`, `people`, `timeline`, `workspace`. |
| Dashboard (232–296) | `renderDashboard()` computes stats and recent items; pure string-concat HTML into `#dashboardContent`. |
| Evidence catalogue (302–509) | `populateEvidenceDropdowns`, `getFilteredEvidence` (search + type/person/location/status/relevance filters), `renderEvidenceList`, `renderEvidenceCardHTML`, delegated click handler, bookmark toggle, `handleSortChange`, `clearFilters`, fake-async search (`simulateAsyncSearch` + `latestSearchRequestId`). |
| Evidence detail (515–622) | `openEvidenceDetail` / `renderEvidenceDetail` render into `#evidenceDetailSection`; status & relevance `<select>`s **mutate the evidence object in place**; note textarea saved via `saveCurrentNote`. |
| People & locations (628–709) | `switchPeopleTab`, `renderPeople` (cards with avatars, evidence counts, "view" links that pre-set the evidence person filter), `renderLocations`. |
| Timeline (715–842) | `populateTimelineDropdowns`, `renderTimeline` (order + person/location/type filters, sort, per-event "View E.." buttons), `certaintyBadgeClass`, `openEvidenceModal` (quick-view modal created on demand as `#quickViewModal`). |
| Workspace (848–984) | `renderWorkspace` → bookmarks list, notes list (reads `notesStore`), hypothesis form (`populateHypothesisDropdowns`, `saveHypothesis`, `loadHypothesisFromStorage`, `getSelectedOptions`). |
| Storage helpers (990–1028) | localStorage wrappers for bookmarks/notes; `loadNoteAsync` returns an immediately-resolved Promise. |
| Event setup & init (1034–1085) | `setupEventListeners()` wires all controls; `initApp()` on `DOMContentLoaded`: loads storage, wires events, `loadAllData()`, then `handleHashChange()`. |

### Cross-cutting patterns to know before editing

- **Rendering = string-concatenated `innerHTML`.** Render functions rebuild
  entire containers; several re-attach `addEventListener`s after every render
  (a known source of duplicate-listener bugs — this is intentional).
- **Navigation mixes inline `onclick` handlers (in index.html) with
  `addEventListener`.** Functions like `navigateTo`, `switchPeopleTab`,
  `closeEvidenceDetail`, `saveHypothesis`, `saveCurrentNote` must stay global
  (or be re-wired) while inline handlers reference them.
- **State is mutated in place.** E.g. `ev.status = ...` in the detail view,
  `filteredEvidence` aliasing `allEvidence`. Mutation/reference bugs are part
  of the exercise — be careful when asked to "fix" things.
- **Persistence:** three localStorage keys — `remotion_bookmarks` (array of
  evidence ids), `remotion_notes` (object `{evidenceId: text}`),
  `remotion_hypothesis` (draft object). User notes are injected via
  `innerHTML` (deliberate XSS surface — flagged in code comments).
- **Loading gate:** the overlay hides only after `loadingStepsRemaining`
  reaches 0; it is set to 2 and decremented by `loadCorePeopleAndLocations`
  and `loadTimelineData` — evidence loading is *not* part of the count.
- **No `console`-free guarantee:** debug `console.log` calls exist on purpose
  (e.g. modal listener counting, "First note preview" logging a Promise).

## Data model (data/*.json)

```
evidence:  { id:"E01", type, title, timestamp(ISO), summary, content,
             personIds:[...], locationIds:["L01"], tags:[...],
             status: unreviewed|reviewed|flagged,
             relevance: unknown|relevant|irrelevant }
people:    { id:"kebab-case", name, role, speciality,
             responsibilities:[...], statement, background, avatar }
locations: { id:"L01", name, description, contains:[...] }
timeline:  { id:"T01", time(ISO), title, description, type,
             certainty: confirmed|reported|contradictory|...,
             personIds:[...], locationIds:[...], evidenceIds:["E01"] }
case:      single object (caseId, title, status, summary, ...)
```

**Join conventions:** `personIds`/`locationIds`/`evidenceIds` are foreign keys
into the other files. Known **intentional data inconsistencies** exist (e.g.
one evidence item uses the person *name* `"Nova Byte"` instead of the id
`"nova-byte"` — `evidenceMentionsPerson` works around this; `type` casing is
inconsistent like `"Test-Report"` vs `"test-report"` — filters lowercase to
compensate). Preserve this behaviour unless the task is to fix it.

## Where to look / common tasks

| Task | Start here |
|---|---|
| Add/change a view | `index.html` (new `<section class="view">` + nav button), `handleHashChange` + `viewRendered` in app.js, styles.css |
| Change evidence filtering/search | `getFilteredEvidence`, `handleSearchInput`, `populateEvidenceDropdowns` |
| Change a data field | `data/*.json` schema above + every render function that prints it |
| Bookmarks / notes / hypothesis persistence | storage helpers section + `renderWorkspace`, `saveCurrentNote` |
| Styling | `styles.css` — find the `/* Section */` matching the view; class names are descriptive (`.evidence-card`, `.timeline-event`, `.badge-*`) |
| Exercise tasks (module split, bug hunts, async/await) | `EXERCISE_1.md` is the spec; refactor within `app.js`'s existing section boundaries |

## Conventions

- ES5-style code throughout: `var`, `function` expressions, `for` loops,
  string concatenation — the exercise migrates away from this deliberately.
- When refactoring per the exercise, keep behaviour identical (bugs included)
  for the "pure refactor" tasks.
- The user tracks changes in commits/`CHANGES.md`; commit messages should be
  able to serve as before/after demos for the course.
