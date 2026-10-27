# Exercise 4 — React UI & Component Design

This is the fourth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercise 3. This exercise migrates **two more views — People & Locations, and Timeline** — bringing the running total to 3 of the app's 5 views fully in React. **Evidence Catalogue and Workspace are deliberately not part of this exercise**. They need real interactivity (useState, controlled forms, a reducer) to make sense, and that's Exercise 5.

**This exercise is about structure, not behavior.** Migrate these views as presentational-first, e.g.
reusable components, typed props, lists and conditional content, and (for Timeline) filter controls that are visually complete but not required to be functionally wired to onChange handlers yet. "No state management beyond what is necessary to render the initial view" is the rule. It's fine (expected, even) for Timeline's filter dropdowns to not filter anything yet when changed by the user.

**Hard rules for every component you write in this exercise:**
- [ ] No innerHTML.
- [ ] No manual DOM creation (document.createElement, .appendChild, etc.).
- [ ] No state beyond what's needed to render the initial view (reading a query param once to decide *what* to show initially is fine.

**Out of scope for this exercise**: Evidence Catalogue, Workspace, useState and any interactivity beyond what's needed to render the initial view, forms that actually submit
or validate anything, global/shared state, and accessibility (not covered in this course). 

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 15, React Foundations** — “JSX is JavaScript syntax for UI descriptions” through “The component tree,” PDF pp. 104–106
- **Chapter 16, React Component Design and Routing** — all sections, PDF pp. 110–114

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are presented in class. 

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | JSX, function components, typed props, composition & children | ☐ |
| 2 | Conditional rendering | ☐ |
| 3 | Rendering collections | ☐ |
| 4 | Stable keys and list identity | ☐ |
| 5 | Presentational vs. feature components and component boundaries | ☐ |
| 6 | Feature-oriented folder structure | ☐ |
| 7 | Reusable UI elements | ☐ |
| 8 | Routing: People & Locations as real routes | ☐ |
| 9 | Route parameters | ☐ |
| 10 | Query parameters as URL state + migration wrap-up | ☐ |

---

## Demo 1 — JSX, function components, typed props, composition & children

**Tasks**

- [x] Build at least 3 small components for the People & Locations or Timeline views using JSX,
each with an explicitly typed props interface/type (no untyped or any props).
- [x] Build at least one component that takes children (composition) rather than a data prop, and use it in a real place in the app (e.g. a generic card/panel wrapper).

**Questions** (depend on the tasks above)

- [ ] Show one JSX expression in your code that embeds a JavaScript value or expression (not just static markup). For example {person.name} or a computed value. What can and can't go inside {...} in JSX?

	In TimelineEventCard.tsx the text {formatDate(event.time)} calls a function and puts the result (a nicely formatted date) into the page. The Badge on the same line reads CERTAINTY_VARIANT[event.certainty], so the badge style is computed from the data instead of being written out by hand. In PersonCard.tsx, {evidenceCount === 1 ? "" : "s"} is a small decision inside the markup: it renders "item" for a count of 1 and "items" otherwise.

	The curly braces are JSX's way of saying "evaluate this JavaScript here". Inside them you may put anything that produces a single value: a variable, a function call, arithmetic, a ternary (a ? b : c), an && / || chain, or a .map() that produces more elements. You cannot put whole statements: no if/else blocks, no for-loops, no let/const declarations. Those must happen above the return in the function body. Whatever the expression evaluates to gets rendered: text, numbers, or more elements. The values null, undefined, true and false render as nothing at all — which is exactly why they are used for conditional rendering in Demo 2.

- [ ] For one component's typed props: what would TypeScript catch if you passed the wrong shape of data to it? Demonstrate a real type error by passing something wrong on purpose.

	PersonCard declares its props as interface PersonCardProps { person: Person; evidenceCount: number }. If I write <PersonCard person="nova-byte" evidenceCount={3} />, TypeScript stops me at compile time: Type 'string' is not assignable to type 'Person' — a plain string is not a Person object. If I forget the count (<PersonCard person={person} />), it complains: Property 'evidenceCount' is missing.

	It also catches wrong value types (evidenceCount="5" — a string where a number is required), misspelled or invented prop names (evidence_count={3}), and incomplete objects (something that looks like a person but lacks the responsibilities array). In the old vanilla code, none of this existed: a wrong value was simply concatenated into an HTML string and the page showed "undefined". Typed props turn these silent runtime bugs into compile-time errors that appear before the app even runs.

- [ ] What's the difference between passing data as a named prop versus passing it as children? Why did you choose children for the component you built with it?

	A named prop is a specific, declared input — the component knows exactly what it receives and uses it on purpose. PersonCard takes person: Person and decides where the name, role and responsibilities go. children is different: it is whatever JSX the caller nests between the opening and closing tags, and the component never looks inside it — Card just renders a div and drops {children} into it.

	Card takes children because a card shell should not care what it wraps. The same shell works around a person card, a location card and a timeline event. If Card instead had a named prop like content: Person, it could only ever display people and would need a new version for every kind of content. children keeps the wrapper generic, while the cards inside still use their own typed named props for the data they understand. This is the composition idea from the manuscript: build UIs by nesting components rather than by giving one component more and more props.

- [ ] Why does direct DOM manipulation (as the old vanilla app.js did constantly, e.g. innerHTML, classList.add/remove, manually building elements) conflict with React's rendering model? What assumption does React make about who "owns" the DOM that direct manipulation breaks?

	In React you do not touch the DOM yourself. You describe what the UI should look like (JSX), and React compares your new description with the previous one and updates the real DOM only where it differs. For that to work, React must assume "I am the only one who writes into this part of the page."

	The vanilla code did exactly the things React forbids: views/people.ts built big HTML strings and assigned them to container.innerHTML, switchPeopleTab toggled classes on elements by hand, and openEvidenceModal called document.createElement and appendChild. If such code ran inside a React tree, the changes would be invisible to React — its description of the DOM would no longer match reality. The next render could silently wipe out the manual changes, or reuse an element whose real content no longer matches what React thinks is there, which produces stale or corrupt UI. That is why the hard rule for this exercise is: describe the UI, never poke the DOM.

---

## Demo 2 — Conditional rendering

**Tasks**

- [x] Implement at least two real conditional-rendering cases in the views you're migrating. For example: an empty state (e.g. "no timeline events match" if applicable), and a state-dependent style/label (e.g. the active People/Locations tab, or a certainty badge's variant on a timeline event).
- [x] Use at least two different conditional-rendering techniques (e.g. a ternary, &&, early-return, or a lookup/mapping function) and be ready to justify which you used where.

**Questions** (depend on the tasks above)

- [ ] Show one place where you used condition && <Component />} instead of a ternary. What would go wrong if condition were a number like 0 instead of a boolean and does that risk apply to your actual code?

	In TimelineEventCard.tsx: {locationNames.length > 0 && (<p className="evidence-meta">Location: {locationNames.join(", ")}</p>)} — the location line only appears when there is at least one location.

	React renders whatever is inside the braces, including the result of an && expression. When the left side is "falsy", React renders that falsy value itself. false, null and undefined luckily render as nothing — but 0 and "" are real values React will print on the page. So if I had written locationNames.length && <p>..., an empty list would show a literal 0 in the UI. My code is safe because length > 0 always produces a real true/false, but I wrote it that way on purpose because of this trap. For the same reason TimelineList uses events.length === 0 instead of relying on truthiness.

- [ ] Why might returning null from a component be preferable to returning an empty <div> in some cases? Did you use either, and why?

	null produces no DOM node at all — nothing ends up in the page. An empty <div> is still a real element: it can carry margins, padding or a border, take up a cell in a grid, or confuse CSS selectors like :empty or :nth-child. So "render nothing" is usually better expressed by returning null than by rendering an empty container.

	In TimelineList I applied the same idea: when events.length === 0 it returns only the message <p>No timeline events match…</p> instead of an empty .timeline-container wrapper that would still occupy space. An empty container would only make sense if you deliberately wanted to reserve space in the layout.

---

## Demo 3 — Rendering collections

**Tasks**

- [x] Render the people list, the locations list, and the timeline events list, each as a mapped collection of components, each with a proper `key` prop.

**Questions** (depend on the tasks above)

- [ ] What does React actually use `key` for internally?

	When React re-renders a list it has to match the new items to the ones it rendered before — this matching step is called reconciliation. The key is the identity it matches on: React builds a lookup of the old children by key, then for each new element asks "have I seen this key before?". A match means "same item, just update its props and keep its DOM node"; no match means "this is new, build it — and anything left over was removed."

	With stable keys (key={person.id}, key={location.id}, key={event.id}) React can tell that an item moved rather than was deleted and recreated, so it reorders the existing DOM nodes instead of rebuilding them. Without keys React simply matches children by their position in the array, which is exactly what makes the Demo 4 bug possible.

---

## Demo 4 — Stable keys and list identity

**Tasks**

- [x] Deliberately use key={index} in one throwaway example, then demonstrate (e.g. by reordering or filtering the underlying array) a case where it produces a visibly wrong result, before replacing it with a real stable id.

**Questions** (depend on the tasks above)

- [ ] What goes wrong, concretely, when keys are missing, duplicated, or based on array index for a list that can reorder or filter?

	Missing keys: React falls back to matching by position (the index) and prints a warning in development — so it behaves exactly like key={index}. Duplicated keys: two siblings claim the same identity and React cannot tell which update belongs to which element, so it applies changes to the wrong one.

	Index keys on a list that can reorder or filter: React believes "position 0 is still the same item". After sorting, the item that used to be first is now fifth, but position 0 still gets the old DOM node — so anything attached to the node rather than to the data (typed text in an input, focus, an expanded section) stays glued to the position while the data moved away. The list also does more work than needed, because a move looks like "deleted here, created there" instead of "moved".

- [ ] The *original* vanilla version of this app had a real bug where one feature used an array index as an identifier instead of a stable id. Would that same mistake, ported directly into React as key={index}, have caused a symptom a user could notice, or only a console warning? Explain why.

	A symptom the user can see. key={index} triggers no warning at all — the console stays quiet, so the code looks perfectly fine. The failure shows up in the UI itself.

	In the throwaway demo, each timeline card contained an input. With index keys, the text I typed into the first card's input stayed on the first card's slot after I changed the sort order — the note now appeared to belong to a completely different event. That is the same class of bug as the vanilla index-as-identifier bug: the position was used as if it were the identity of the thing. In React it is even sneakier, because the mis-association only becomes visible the moment the list actually reorders or filters.

- [ ] All of this app's real data (people, locations, timeline events) already has stable ids. Is there ever a legitimate reason to use key={index} anyway? When?

	Only for truly static lists: items that are never reordered, filtered, inserted or deleted, and that carry no internal state of their own — for example a fixed set of navigation labels or a hard-coded set of layout columns. If positions never change, positional matching can never go wrong.

	That does not apply anywhere in this app: people, locations, timeline events and evidence all come with real stable ids (PersonId, LocationId, TimelineEventId, EvidenceId), so the real ids are always the right key.

---

## Demo 5 — Presentational vs. feature components and component boundaries

**Tasks**

- [x] Classify every component you've built so far as either "presentational" or "feature/container". Explain why.
- [x] Find at least one component that's currently doing more than one job, and split it into two components with a clear boundary between them.

**Questions** (depend on the tasks above)

- [ ] For the component you split: what was the single responsibility of each half after the split? If an implementation detail in one half changed, would that change affect the other half? Why or why not?

	The vanilla renderTimeline() did everything in one function: fetch events, read filter values, filter, sort, look up location names, and build markup. I split that into TimelinePage (the feature/container component) on one side and TimelineList + TimelineEventCard (presentational) on the other. The page's single responsibility is deciding which events to show and in what order — it reads globalState, reads the ?person= query parameter, filters and sorts. The cards' single responsibility is deciding how one event looks — they only turn the props they receive (event, locationNames) into markup.

	After the split, a change in one half cannot leak into the other: redesigning the card never touches the filtering/sorting code, and changing the sort order or adding a filter never touches the card. They are isolated because the only thing between them is a small typed props contract — TimelineList just receives events: TimelineEvent[] and neither side can see how the other works internally.

- [ ] Give one concrete rule you used to decide "this belongs in a presentational component" versus "this belongs in a feature component."

	The rule: does the code need to know where data comes from or how it is selected — does it call state.getAllPeople(), read route or query parameters, or compute derived data (counts, filtering, sorting)? Then it belongs in a feature component. Does the code only turn the props it was handed into JSX? Then it is presentational.

	Concrete example: computing evidenceCount from the evidence array lives in PeopleList and PersonDetailPage (feature side), while PersonCard just displays whatever evidenceCount: number it is given. The card would render exactly the same in any other context that hands it a count — that reusability is the point of the split.

---

## Demo 6 — Feature-oriented folder structure

**Tasks**

- [x] Reorganize your React source into a feature-oriented structure (e.g. grouping by
people-locations/, timeline/, dashboard/, shared components/, rather than one flat
folder of files). Including the Dashboard and shell from Exercise 3.
- [x] Document the structure you landed on (a short ARCHITECTURE.md section or README snippet is enough) and the rule you used to decide what's "shared" versus "feature-local."

**Questions** (depend on the tasks above)

- [ ] What's the difference between organizing files "by type" (all components in one folder, all hooks in another) and "by feature"? What made you choose the structure you chose for this app specifically?

	"By type" groups files by their technical role — one folder for all cards, one for all pages — so the pieces of a single feature get scattered and unrelated things end up next to each other (a dashboard StatCard beside a TimelineEventCard that have nothing to do with each other). "By feature" groups everything one view needs in one place: features/timeline/ contains the page, its filters, its list and its card. A feature becomes something you can find, understand, change or delete as a single unit.

	For this app the choice was natural because the views are independent of each other — the timeline, the team page and the dashboard share no component-specific logic. The folder structure simply mirrors the app's navigation structure.

- [ ] Where did you draw the line between a component that lives inside one feature folder and one that belongs in a shared/common folder? Give one real example of each from your own structure.

	The rule, documented in ARCHITECTURE.md: a component starts inside its feature folder and is only moved to react/components/ when a second feature actually imports it — no sharing "just in case".

	Feature-local example: TimelineEventCard is used only by the timeline feature, so it lives in features/timeline/ — if that view were ever removed, the card would be removed with it. Shared example: Badge is imported by two different features (timeline for the certainty badge, dashboard for the case-status badge in CaseSummaryCard), so it was promoted to react/components/. The same applies to Card, which is used by person, location and timeline cards.

---

## Demo 7 — Reusable UI elements

**Tasks**

- [x] Extract at least one presentational component that is genuinely reused in **two or more different places** in the app (e.g. a badge, a card shell, a button variant), with a typed props API that makes it flexible enough for both uses without becoming a special-cased mess.

**Questions** (depend on the tasks above)

- [ ] Show the two (or more) places your reusable component is used. What varies between them via props, and what stays fixed inside the component itself? How did you decide where that line goes?

	Badge is used in TimelineEventCard (the certainty badge — the certainty value is translated to a variant: confirmed→reviewed, reported→flagged, contradictory→critical) and in CaseSummaryCard on the dashboard (the case status badge). Card is a second example: PersonCard, LocationCard and TimelineEventCard all wrap their content in it.

	What varies through props: the text the badge shows (label) and which variant it is (variant) — for Card, the className and whatever goes inside as children. What stays fixed inside the component: the markup itself — the span, the way the badge-… class is assembled, the base styles. The line I chose: the caller decides *what the badge says and which semantic kind it is*; the component decides *how a badge is built and looks*. Variant names are semantic words ("reviewed", "critical"), not raw CSS class strings, so a caller cannot assemble a broken class name — passing a wrong variant is a TypeScript error, not a styling bug.

- [ ] The original vanilla app had duplicated HTML-template code (the same card markup written out twice, slightly differently, in two functions). Compare that directly to what you just built. What does a reusable component give you that copy-pasted template strings didn't?

	In the vanilla code, functions like renderPeople, renderLocations and renderTimeline each concatenated the same badge and card fragments into HTML strings by hand — copies that could drift apart (fix one place, forget the other) with no error to warn you.

	A reusable component gives you one source of truth: change Badge once and every place that uses it updates automatically; consistency is guaranteed by the structure, not by remembering to keep copies in sync. It also gives you safety — the typed props mean a wrong variant or a forgotten label is caught by TypeScript instead of silently producing broken markup. And it makes call sites readable: <Badge label=… variant=…/> visibly *is* a badge, while a fragment buried in a long html += chain is not.

---

## Demo 8 — Routing: People & Locations as real routes

**Tasks**

- [x] Install a routing library (React Router or an equivalent of your choice, justified) and
replace the shell's placeholder navigation from Exercise 3 with real routes for at least Dashboard, People & Locations, and Timeline.
- [x] Convert the People/Locations tab toggle from local component state into two real,
navigable, bookmarkable routes (e.g. /team/people and /team/locations) instead of a click handler that only changes what's shown without changing the URL.

**Questions** (depend on the tasks above)

- [ ] Why does making the People/Locations tab a real route (versus keeping it as internal
component state) matter for the user? Name a concrete capability the user gains.

	The tab choice is now part of the URL, so the user can bookmark /#/team/locations or send the link to someone else and land directly on the Locations tab — before, every visit started on People because the tab existed only in memory.

	A second concrete gain: browser back/forward works between the tabs as real history entries. When the tab was internal state, the address bar never changed, so "back" would leave the page entirely instead of returning to the other tab, and reloading forgot the tab choice.

- [ ] What does your router do when the URL doesn't match any route you've defined? Compare this to how the vanilla app's handleHashChange() fell back to the dashboard for an invalid hash.

	There is a catch-all route (path="*") that renders <Navigate to="/" replace /> — any unmatched URL is redirected to the dashboard, and replace means the broken URL does not get stuck in the browser history.

	The vanilla handleHashChange() did essentially the same thing: it checked whether the hash was a known view name and otherwise fell back to "dashboard". The difference is that the router expresses this as one declarative rule in one place instead of imperative logic that runs on every hash change — and it is easy to upgrade to a real "not found" page later by swapping the Navigate for a component. (I chose React Router because it is the standard library for this, with a declarative <Route> API and hooks like useParams/useSearchParams, and NavLink handles the active styling for free. I used HashRouter specifically so the app keeps its existing #/… URLs and needs no server-side rewrite configuration.)

---

## Demo 9 — Route parameters

**Tasks**

- [x] Add at least one route that takes a parameter (e.g. a person or location id in the URL, such as /team/people/:personId), and use that parameter inside the corresponding component to determine what to render.
- [x] Make at least one place in the app link to that parameterized route (not just typing the URL by hand). For example, a person's name in a related-evidence context, or a "view on team page" link.

**Questions** (depend on the tasks above)

- [ ] How do you read a route parameter's value inside your component, and what type is it as far as TypeScript is concerned by default? What did you have to do to use it safely (e.g. what if the id in the URL doesn't match any real person)?

	In PersonDetailPage I call useParams() and destructure it: const { personId } = useParams(). To TypeScript this is just string | undefined — a raw piece of the URL, not the restricted PersonId type our data model uses.

	To use it safely I narrow it first with the existing isPersonId(personId) type guard before looking the person up with findPersonById — the same guard idea the vanilla code applied to dataset.personId when reading IDs out of the DOM. If the URL contains an id that matches no real person (a typo or a stale link), person comes back null and the component renders a "Person not found" message with a link back to the people list, instead of crashing or showing an empty card.

- [ ] What's the practical difference, for the user, between /team/people/nova-byte (a route
param) and /team/people?person=nova-byte (a query param)? Why is one more appropriate than
the other for this specific case?

	A path parameter makes the id part of the address of the thing itself — /team/people/nova-byte reads as "the page for nova-byte": one specific resource, in a clean hierarchy (team → people → this person). A query parameter reads as a modifier on a collection — ?person=nova-byte means "the people page, but filtered/highlighted by nova-byte".

	The detail page is a resource, so the path param is the right choice: it is the canonical, shareable address of that one person. The query-param form stays appropriate for what it genuinely is — a filter on a list — which is why Demo 10 uses /timeline?person=… to pre-select a filter on the timeline rather than identifying a timeline "thing".

---

## Demo 10 — Query parameters as URL state + migration wrap-up

**Tasks**

- [ ] On the Timeline view, read a query parameter (e.g. ?person=...) when the page loads, and use it to determine the *initial* rendered list (for example, pre-selecting a person filter if the app is opened via a link that includes one). Remember, the filter controls themselves don't need to be interactive yet. This is about parameterizing the initial render from the URL, not wiring onChange.
- [ ] Do a final pass confirming: Dashboard, People & Locations, and Timeline are fully React, none of them use innerHTML or manual DOM creation anywhere, and all three are reachable via real, bookmarkable routes.

**Questions** (depend on the tasks above)

- [ ] Why is reading a query parameter once, on initial render, still consistent with this exercise's "no state beyond what's necessary to render the initial view" rule? What would cross the line into "real interactivity" that's out of scope until Exercise 5?

	The rule forbids state that can change after render — not inputs that shape the first render. useSearchParams().get("person") is read while the component renders; the component stays a pure function of "props + current URL". There is no useState, no update cycle, nothing that re-renders because the user did something. The URL simply acts like an extra prop delivered through the address bar.

	The line into "real interactivity" is crossed the moment an onChange handler writes a new value into state (useState or setSearchParams) and the list re-renders as a reaction to the user. That user-driven update loop is exactly the topic of Exercise 5, so the selects are rendered visually complete but deliberately unwired.

- [ ] What would you need to add to make Timeline's filters *actually* filter the list when a user changes them? (You don't have to build it. Just name the concept you'd need)

	Component state — useState (or a reducer / setSearchParams) holding the currently selected order, person, location and type values. An onChange on each select would update that state, React would re-render, and the filter/sort pipeline already present in TimelinePage would then run against the new values instead of the fixed initial ones.

	Optionally that state could live in the URL itself (setSearchParams), which would make every filtered view shareable — but the core missing ingredient is simply: state that responds to user input.

- [ ] Across the 3 views you've now fully migrated, what's one piece of duplicated logic or markup you noticed but didn't extract yet? Why didn't you, and would you if you had more time?

	The "N related evidence items" count is computed in two places — PeopleList and PersonDetailPage both run the same evidence.filter(...).length logic — and the meta-line pattern (formatted date plus badge in a header row) is similar between TimelineEventCard and the dashboard's recent-lists.

	I did not extract it because it is a two-line duplication at exactly two call sites — at the boundary of the "share on second real use" rule, and a wrapper around two lines adds more indirection than it saves. With more time I would extract the logic as a small countEvidenceForPerson(person) helper in lookupHelpers.ts — reusing the computation itself rather than prematurely inventing a shared component for the markup.

---
