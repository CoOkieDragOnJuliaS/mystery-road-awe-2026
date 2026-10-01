# AGENTS.md — Project ReMotion Investigation Portal

Guidance for AI agents working in this repository.

## What this project is

A framework-free investigation portal for a university course (Advanced Web
Engineering). It presents a fictional case: an AI-assisted rehabilitation robot
loaded the wrong calibration profile and emergency-stopped. The user browses
evidence, people, locations, and a timeline, and drafts a hypothesis.

The project started as a deliberately brownfield vanilla-JavaScript exercise in
`EXERCISE_1.md`. In `EXERCISE_2.md` it has since been split into modules and
migrated to TypeScript with Vite, ESLint, and Prettier.

## How to run

The active app uses ES modules, TypeScript, and Vite. Serve it through npm:

```bash
npm install
npm run dev
```

Open the URL shown by Vite.

Production commands:

```bash
npm run build
npm run preview
```

Other commands:

```bash
npm run lint
npm run lint:fix
npm run format
```

`build` runs Vite and then `tsc --noEmit`. TypeScript performs type checking;
Vite performs transpilation and bundling.

## Verification

There is no automated test suite yet. Verify with:

```bash
npm run lint
npm run build
npm run preview
```

Then click through all five views: Dashboard, Evidence, People & Locations,
Timeline, and Workspace. Check evidence search/filter/sort/bookmark/detail/notes,
timeline links/modals, hypothesis persistence, and the DevTools console/network
tabs.

## Repository layout

```text
index.html              App shell, five view sections, module entry point.
app.ts                  Entry point: storage init, event setup, data loading.
data/api.ts             Typed JSON loading and loading-overlay orchestration.
data/api.js             Compatibility re-export for old imports.
navigation/router.ts    Hash routing and lazy view rendering.
state/globalState.ts    Typed shared state getters/setters.
storage/localStorage.ts Typed localStorage wrappers for bookmarks/notes/hypothesis.
types/domain.ts         Shared domain interfaces, ID unions, and type guards.
utils/
  badgeHelper.ts        Status/relevance badge class helpers.
  dateHelper.ts         Timestamp formatting.
  dom.ts                Typed DOM lookup helpers.
  lookupHelpers.ts      Evidence/person/location lookup helpers.
  setup.ts              Event-listener wiring.
views/
  dashboard.ts          Dashboard statistics and recent items.
  evidenceBasic.ts      Evidence catalogue, filters, sort, bookmarks, search.
  evidenceDetails.ts    Detail panel, status/relevance mutation, notes.
  people.ts             People/location cards and evidence-count links.
  timeline.ts           Timeline filters, rendering, evidence modal.
  workspace.ts          Bookmarks, notes, and hypothesis dropdowns.
public/data/            JSON fetched at runtime and copied unchanged to dist/.
assets/                 Used images, including logo and person avatars.
styles.css              All styles.
old_app.js              Legacy pre-refactor monolith; excluded from TypeScript.
*.js compatibility      Thin `export *` shims left next to migrated `.ts` modules.
EXERCISE_1.md           Original module/refactoring/debugging exercise.
EXERCISE_2.md           Tooling, TypeScript, CI/CD exercise.
```

## TypeScript architecture

Domain types are centralized in `types/domain.ts`:

- `CaseData`, `Evidence`, `Person`, `Location`, `TimelineEvent`
- restricted identifiers such as `PersonId`, `LocationId`, `EvidenceId`
- restricted values such as `EvidenceStatus`, `EvidenceRelevance`, and
  `TimelineCertainty`
- UI state types such as `ViewName`, `PeopleTab`, `ViewRendered`, `NotesStore`,
  and `HypothesisDraft`
- runtime type guards such as `isPersonId`, `isEvidenceId`, and `isViewName`

`fetchJson<T>()` in `data/api.ts` declares the expected domain type. It checks
HTTP status, but it is still only a type assertion of runtime JSON, not schema
validation. Runtime validation would require explicit type guards or a schema
library.

## Cross-cutting patterns

- **Rendering remains string-concatenated `innerHTML`.** The migration added
  types but preserved the exercise's rendering approach.
- **Inline handlers still exist in `index.html`.** `app.ts` declares and assigns
  global window functions such as `navigateTo`, `switchPeopleTab`,
  `saveHypothesis`, `saveCurrentNote`, and `closeEvidenceDetail`.
- **DOM values require narrowing.** `dataset.*`, select `.value`, and
  `getElementById()` return strings or `null`; helpers in `utils/dom.ts` and
  guards in `types/domain.ts` handle this.
- **JSON IDs are normalized.** `personIds` now contains `PersonId` values. The
  former `"Nova Byte"` name entry was normalized to `"nova-byte"`. Evidence
  status/relevance values are lowercase.
- **Persistence keys:** `remotion_bookmarks`, `remotion_notes`, and
  `remotion_hypothesis`.
- **User notes still flow into `innerHTML`.** This intentional XSS surface is
  documented in the code; do not sanitize unless the task asks for it.

## Data model

```text
evidence:  { id:"E01", type, title, timestamp(ISO), summary, content,
             personIds:[PersonId], locationIds:[LocationId], tags:[...],
             status: unreviewed|reviewed|flagged,
             relevance: unknown|relevant|irrelevant }
people:    { id:PersonId, name, role, speciality,
             responsibilities:[...], statement, background, avatar }
locations: { id:LocationId, name, description, contains:[...] }
timeline:  { id:"T01", time(ISO), title, description, type,
             certainty: confirmed|reported|contradictory,
             personIds:[PersonId], locationIds:[LocationId],
             evidenceIds:[EvidenceId] }
case:      single CaseData object
```

`personIds`, `locationIds`, and `evidenceIds` are foreign-key relationships.
Types describe the intended shape but do not validate data at runtime.

## Common tasks

| Task                       | Start here                                                                  |
| -------------------------- | --------------------------------------------------------------------------- |
| Add/change a view          | `index.html`, `navigation/router.ts`, relevant `views/*.ts`, `styles.css`   |
| Change filtering/search    | `views/evidenceBasic.ts` and `utils/lookupHelpers.ts`                       |
| Change loaded data/schema  | `types/domain.ts`, `public/data/*.json`, `data/api.ts`                      |
| Bookmarks/notes/hypothesis | `storage/localStorage.ts`, `views/workspace.ts`, `views/evidenceDetails.ts` |
| Global state               | `state/globalState.ts`                                                      |
| Event wiring               | `utils/setup.ts`, plus window declarations in `app.ts`                      |
| Exercise demos             | `EXERCISE_1.md`, `EXERCISE_2.md`                                            |

## Conventions

- Active source files are TypeScript; remaining `.js` files are compatibility
  re-export shims or legacy files.
- Avoid `any`; prefer explicit interfaces, union types, `unknown`, and type
  guards.
- Preserve intentionally demonstrated app behavior unless the task explicitly
  asks to fix it.
- Keep `//Demo N:` comments where they explain a change useful for course
  presentation.
