# AGENTS.md — Project ReMotion Investigation Portal

Guidance for AI agents working in this repository.

## What this project is

An investigation portal for a university course (Advanced Web Engineering). It
presents a fictional case: an AI-assisted rehabilitation robot loaded the wrong
calibration profile and emergency-stopped. The user browses evidence, people,
locations, and a timeline, and drafts a hypothesis.

The project started as a deliberately brownfield vanilla-JavaScript exercise in
`EXERCISE_1.md`, was modularised and migrated to TypeScript with Vite, ESLint
and Prettier in `EXERCISE_2.md`, got a React shell + Dashboard in
`EXERCISE_3.md`, and in `EXERCISE_4.md` the People & Locations and Timeline
views were migrated to React with React Router for navigation. The Evidence
Catalogue and Workspace views are placeholder routes until `EXERCISE_5.md`;
their legacy vanilla code remains under `views/` for reference.

## How to run

The app uses React 19, TypeScript, React Router (`react-router-dom`,
`HashRouter`), and Vite. Serve it through npm:

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

Then click through the routes: `/` (Dashboard), `/team/people`,
`/team/locations`, `/team/people/<personId>` (route param, e.g.
`/team/people/nova-byte`), `/timeline` and `/timeline?person=nova-byte`
(query param seeds the initial person filter), plus the `/evidence` and
`/workspace` placeholders. An unmatched URL should redirect to `/`. Watch the
DevTools console/network tabs.

## Repository layout

```text
index.html              App shell: loading overlay, #root mount point, footer.
                        Entry script is react/main.tsx.
react/
  main.tsx              React entry: loads case data, mounts <App/> inside
                        <HashRouter> and <StrictMode>.
  app/
    App.tsx             <Routes> definition, nested /team routes, catch-all.
    Header.tsx          Branding + <NavLink> main navigation.
  components/           Shared presentational UI used by ≥2 features.
    Card.tsx            Generic card shell via children composition.
    Badge.tsx           Shared badge (label + typed variant).
  features/
    dashboard/
      DashboardPage.tsx Statistics, progress, recent-items panels.
      components/       CaseSummaryCard, StatCard, Progress,
                        RecentEvidenceList, RecentTimelineList.
    people-locations/
      PeopleLocationsPage.tsx  Tab bar; tabs are nested routes via <Outlet/>.
      PeopleList.tsx           Feature list: computes evidence counts.
      LocationsList.tsx        Feature list of LocationCard.
      PersonCard.tsx           Presentational person card (links to detail).
      LocationCard.tsx         Presentational location card.
      PersonDetailPage.tsx     /team/people/:personId route-param page.
    timeline/
      TimelinePage.tsx         Reads ?person= once; filters + orders events.
      TimelineFilters.tsx      Visually complete selects (unwired, Ex. 5).
      TimelineList.tsx         Mapped collection; empty-state ternary.
      TimelineEventCard.tsx    One event; certainty Badge variant map.
data/api.ts             Typed JSON loading and loading-overlay orchestration.
data/api.js             Compatibility re-export for old imports.
navigation/router.ts    Legacy hash router — dead code for migrated views.
state/globalState.ts    Typed shared state getters/setters.
storage/localStorage.ts Typed localStorage wrappers for bookmarks/notes/hypothesis.
types/domain.ts         Shared domain interfaces, ID unions, and type guards.
utils/
  badgeHelper.ts        Status/relevance badge class helpers (legacy views).
  dateHelper.ts         Timestamp formatting.
  dom.ts                Typed DOM lookup helpers (legacy views only).
  lookupHelpers.ts      Evidence/person/location lookup helpers.
  setup.ts              Event-listener wiring for legacy views.
views/
  dashboard.ts          Legacy; superseded by features/dashboard/.
  evidenceBasic.ts      Evidence catalogue (legacy; migration = Exercise 5).
  evidenceDetails.ts    Detail panel, status/relevance mutation, notes.
  people.ts             Legacy; superseded by features/people-locations/.
  timeline.ts           Legacy; superseded by features/timeline/.
  workspace.ts          Bookmarks, notes, hypothesis (legacy; Exercise 5).
public/data/            JSON fetched at runtime and copied unchanged to dist/.
assets/                 Used images, including logo and person avatars.
styles.css              All styles (shared by React views).
old_app.js              Legacy pre-refactor monolith; excluded from TypeScript.
*.js compatibility      Thin `export *` shims left next to migrated `.ts` modules.
app.ts                  Legacy vanilla entry; superseded by react/main.tsx.
ARCHITECTURE.md         Feature-oriented React structure and sharing rules.
EXERCISE_1.md … _4.md   Course exercises (module refactor, tooling, React
                        shell + Dashboard, React migration + routing).
```

## Routing

- React Router (`react-router-dom`, `HashRouter`) owns navigation. Routes:
  `/` → Dashboard; `/team/people` and `/team/locations` → nested routes inside
  `PeopleLocationsPage` (the former tab toggle is now two real, bookmarkable
  routes rendered via `<Outlet/>`); `/team/people/:personId` → person detail;
  `/timeline` → Timeline; `/evidence` and `/workspace` → placeholders until
  Exercise 5. `path="*"` redirects to `/`.
- `Header` and the People/Locations tab bar use `<NavLink>`; the router
  applies the `active` class — no manual view state or `navigateTo`.
- Route params arrive as `string | undefined` from `useParams()`; narrow them
  with `isPersonId`/`isLocationId` before use and render a not-found state
  for unmatched ids.
- Query params (`useSearchParams`) may be read once to parameterize the
  initial render (e.g. `/timeline?person=nova-byte` pre-selects and
  pre-filters by a person). Interactive filter changes need `useState` —
  Exercise 5 scope.

## TypeScript architecture

Domain types are centralized in `types/domain.ts`:

- `CaseData`, `Evidence`, `Person`, `Location`, `TimelineEvent`
- restricted identifiers such as `PersonId`, `LocationId`, `EvidenceId`
- restricted values such as `EvidenceStatus`, `EvidenceRelevance`, and
  `TimelineCertainty`
- UI state types such as `ViewName`, `PeopleTab`, `ViewRendered`, `NotesStore`,
  and `HypothesisDraft`
- runtime type guards such as `isPersonId`, `isEvidenceId`, `isViewName`,
  `isTimelineCertainty`, `isLocationId`

`fetchJson<T>()` in `data/api.ts` declares the expected domain type. It checks
HTTP status, but it is still only a type assertion of runtime JSON, not schema
validation. Runtime validation would require explicit type guards or a schema
library.

## React architecture

- **Feature-oriented folders**: code lives in `react/features/<feature>/`.
  A component is feature-local unless used by two or more features, in which
  case it is promoted to `react/components/`. Documented in `ARCHITECTURE.md`.
- **Presentational vs. feature components**: feature components (pages, lists)
  read `state/globalState.ts`, derive data (counts, ordering, filtering) and
  pass finished values down; presentational components (`PersonCard`,
  `LocationCard`, `TimelineEventCard`, `Badge`, `Card`) only turn typed props
  into JSX. Every component has an explicit props type — no `any`.
- **No DOM escape hatches** in React code: no `innerHTML`, no
  `document.createElement`/`appendChild`, no `classList` toggling, no
  `querySelector`. Conditional classes are computed in `className` template
  strings; conditional content uses ternaries/`&&`/lookup maps.
- **Lists use stable keys** (`person.id`, `location.id`, `event.id`), never
  the array index.
- **Minimal state**: migrated views hold no state beyond the initial render
  (Exercise 4 scope). Reading a route/query param once is allowed;
  `useState`-driven filtering is Exercise 5.

## Cross-cutting patterns

- **Legacy code retained.** `app.ts`, `navigation/router.ts`, `utils/setup.ts`
  and `views/*.ts` are superseded for Dashboard/People/Timeline but kept for
  reference and for the Exercise 5 migration of Evidence and Workspace.
- **DOM values require narrowing** in legacy code (`dataset.*`, select
  `.value`); in React code the same narrowing applies to `useParams()` and
  `useSearchParams()` strings via the guards in `types/domain.ts`.
- **JSON IDs are normalized.** `personIds` contains `PersonId` values. The
  former `"Nova Byte"` name entry was normalized to `"nova-byte"`. Evidence
  status/relevance values are lowercase.
- **Persistence keys:** `remotion_bookmarks`, `remotion_notes`, and
  `remotion_hypothesis` (legacy storage, reused by Exercise 5).
- **User notes still flow into `innerHTML`** in the legacy Workspace code.
  This intentional XSS surface is documented; do not sanitize unless the
  task asks for it.

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

| Task                          | Start here                                                                  |
| ----------------------------- | --------------------------------------------------------------------------- |
| Add/change a React view       | `react/features/<feature>/`, routes in `react/app/App.tsx`, `styles.css`    |
| Add/change a shared component | `react/components/` (only if used by ≥2 features)                           |
| Add/change a route or nav     | `react/app/App.tsx` and `react/app/Header.tsx`                              |
| Legacy Evidence/Workspace     | `views/evidenceBasic.ts`, `views/evidenceDetails.ts`, `views/workspace.ts`  |
| Change loaded data/schema     | `types/domain.ts`, `public/data/*.json`, `data/api.ts`                      |
| Bookmarks/notes/hypothesis    | `storage/localStorage.ts`, `views/workspace.ts`, `views/evidenceDetails.ts` |
| Global state                  | `state/globalState.ts`                                                      |
| Legacy event wiring           | `utils/setup.ts`, plus window declarations in `app.ts`                      |
| Exercise demos                | `EXERCISE_1.md` … `EXERCISE_4.md`                                           |

## Conventions

- Active source files are TypeScript (`.ts`/`.tsx`); remaining `.js` files are
  compatibility re-export shims or legacy files.
- Avoid `any`; prefer explicit interfaces, union types, `unknown`, and type
  guards — including typed props interfaces on every component.
- New view code is React in `react/features/`; preserve intentionally
  demonstrated legacy behaviour unless the task explicitly asks to fix it.
- Keep `//Demo N:` / `//Exercise 4 Demo N:` comments where they explain a
  change useful for course presentation.
