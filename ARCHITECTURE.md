# Architecture — React source layout

Exercise 4 Demo 6: the React source is organised **by feature**, not by type.

```text
react/
  main.tsx                  Entry: loads case data, mounts <App/> in <HashRouter>.
  app/                      Application shell
    App.tsx                 <Routes> definition and catch-all redirect
    Header.tsx              Branding + <NavLink> main navigation
  components/               Shared presentational UI used by ≥2 features
    Card.tsx                Generic card shell (children composition)
    Badge.tsx               Shared badge (label + variant)
  features/
    dashboard/              DashboardPage + its private components/
    people-locations/       PeopleLocationsPage (tabs = nested routes),
                            PeopleList, LocationsList, PersonCard,
                            LocationCard, PersonDetailPage
    timeline/               TimelinePage, TimelineFilters, TimelineList,
                            TimelineEventCard
```

## Rules

- **Feature-local by default.** A component lives in the feature folder that
  uses it (e.g. TimelineEventCard stays in features/timeline/).

- **Shared on second real use.** A component is promoted to react/components/
  only when two or more features import it (e.g. Badge is used by
  features/timeline/ and features/dashboard/). No preemptive sharing.
  
- **Presentational vs. feature.** Files that read state/globalState.ts or
  own routing/data selection are feature components (pages, lists);
  files that only turn props into JSX are presentational (cards, Badge,
  Card).

## Routes

| Route                  | Renders                                  |
| ---------------------- | ---------------------------------------- |
| /                      | Dashboard                                |
| /team/people           | People tab (nested route, <Outlet/>)     |
| /team/locations        | Locations tab (nested route)             |
| /team/people/:personId | Single-person detail (route param)       |
| /timeline              | Timeline (?person= seeds initial filter) |
| /evidence, /workspace  | Placeholder until Exercise 5             |
| *                      | Redirect to /                            |
