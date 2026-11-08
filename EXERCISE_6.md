# Exercise 6 — Effects, Data Fetching & a Backend

This is the sixth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 3–5. All 5 views should already be fully working in React, reading their data from the static `data/*.json` files. This exercise replaces those static files with a small **Node.js backend**, and uses that to properly teach effects, loading/error/empty states, and request cancellation. Things that are hard to demonstrate convincingly against files that can only ever be "instant" or
"404."

**Scope of the backend, deliberately kept small:** a minimal Node server (Express or equivalent) that serves the same 5 JSON files as **read-only** REST endpoints. No write endpoints, no persistence. Bookmarks, notes, and the hypothesis draft stay in `localStorage` exactly as before. Only _reading_ the case data moves to the network. **The backend runs locally in development only, it is not deployed.** Exercise 2's GitHub Pages workflow still builds and deploys the static frontend. Wiring up a real deployed backend is out of scope here.

## Corresponding manuscript reading

The closest corresponding sections in the course manuscript:

- **Chapter 6, Promises, `async`/`await`, and Error Flow** — especially error handling, cleanup, cancellation, and relevance, PDF pp. 47–52
- **Chapter 13, Rendering and Navigation Architectures** — “SPA communication flow” and “State in long-lived applications,” PDF pp. 91–93
- **Chapter 15, React Foundations** — “Function components and purity” and “React owns its root DOM,” PDF pp. 104 and 108
- **Chapter 16, React Component Design and Routing** — “Conditional rendering,” PDF p. 110

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.
These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| #   | Demo                                           | Ready? |
| --- | ---------------------------------------------- | ------ |
| 1   | Render logic vs. effects                       | ☐      |
| 2   | `useEffect` mental model & dependency arrays   | [x]    |
| 3   | Cleanup: timers & subscriptions                | [x]    |
| 4   | Build the read-only Node backend               | ☐      |
| 5   | Consume the backend from React                 | [x]    |
| 6   | Loading, error, and empty states               | [x]    |
| 7   | Request races & cancellation                   | ☐      |
| 8   | Extract a reusable custom hook                 | [x]    |
| 9   | Separate UI, application logic, and API access | [x]    |
| 10  | Data-flow wrap-up & a written UX decision      | ☐      |

---

## Demo 1 — Render logic vs. effects

**Tasks**

- [x] Find (or deliberately write, then remove) an example of a **side effect performed directly
      during a component's render**. For example, mutating a variable outside the component,
      calling `console.log` for debugging on every render, or reading `localStorage` inline in the
      function body instead of in an effect, and explain why it's a side effect even though it
      "seems to work."

  What it means: - Render-time side effect happens when a component does more than calculate UI, e.g.
  let renderCount = 0;

        function RecordTitle({ title }: { title: string }) {
        renderCount += 1;
        return <h2>{title}</h2>;
        }

  The component in the example also changes renderCount, which exists outside the component. Rendering changes external states!
  Change was visibleEvidence, and because document.title is a external browser state --> synchronized in effect instead of changed with render. With useEffect the title is returned with the previous one.

  - Component reads its inputs
  - Component returns a description of what the UI should look like
  - React is responsible for DOM changes later

- [x] Write, in your own words, a short rule for what belongs in render versus what belongs in an effect.

  What belongs in render or effect?
  - in Render: Reading props, state and contexts, calculating UI
  - in Effect is used for communicating with external changes, like the document.title I changed in Task 1.

  Short rule:
  Render is for reading inputs and returning JSX calculations, while an effect helps with communicating outside of the React environment?

**Questions** (depend on the tasks above)

- [x] Why can React call a component's render function more than once, or at times you don't
      expect (e.g. in development with Strict Mode)? What would go wrong with the side-effect

  Why? - UI update starts with an initial state and React calls components to calculate the next UI description. - It also compares the current and previous version before commiting DOM changes. - Rendering can happen more than once before the DOM change is commited
  What is a side-effect? - The UI could be correct, but in the background it could have run something twice or more - Rendering can be repeated or interrupted - so it should not depend on being called once - A console.log could be rendered twice (asynchronous work?)

example you found if render ran twice?

- [x] Is calculating a derived value (like the filtered evidence list from Exercise 5) a side
      effect? Why or why not, and how does that distinction inform the rule you wrote?

  - Derived value like the filterEvidence in evidence is not a side effect - i calculate the inputs and return a result.
  - If I store a second state value for the filtered list that would create 2 tates and could have problems updating the second value. Calculating the list from the current inputs avoids that
  - Distinction with the rule?
    Render logic, because my filtering of evidence acts with current inputs. If I would change the DOM or write it to localStorage this is an effect.

---

## Demo 2 — `useEffect` mental model & dependency arrays

**Tasks**

- [x] Write a small `useEffect` example (can be a throwaway one first) with an empty dependency
      array, one with a populated dependency array, and one with no array at all, and observe how
      often each one actually runs.
- [x] Find a real, justified use for `useEffect` you'll need in this app (loading data is coming in Demo 5, so pick something else — e.g. syncing the document title to the current view).

**Questions** (depend on the tasks above)

- [x] What does React actually compare, between renders, to decide whether to re-run an effect with a populated dependency array? What happens if you omit a value your effect actually uses from that array?
- [x] What's the difference, in practice, between `useEffect(fn, [])` and just writing `fn()` directly in the component body? Why doesn't the second one work the way you'd expect for "run once"?

---

## Demo 2 - Completed answers

### Task 1 - Compare the three dependency-array forms

- [x] The throwaway examples are:

  ```tsx
  useEffect(() => {
    console.log("empty dependency array");
  }, []);

  useEffect(() => {
    console.log("populated dependency array", selectedEvidenceId);
  }, [selectedEvidenceId]);

  useEffect(() => {
    console.log("no dependency array");
  });
  ```

- The empty dependency array associates the effect with the component mount.
  In development, `StrictMode` can make effect behavior appear more than once
  during development checks, so the effect must not depend on one exact call.
- The populated dependency array runs the effect again when one of its listed
  values changes between renders. In the example, changing
  `selectedEvidenceId` makes the effect run again.
- No dependency array means that the effect runs after every render. A state
  update or another change that causes a render can therefore run it again.
- The logs make the difference observable. The dependency array describes when
  synchronization is relevant; it does not turn an ordinary function call into
  persistent state.

### Task 2 - Find a justified use of useEffect in this app

- [x] The evidence page synchronizes `document.title` with the current view.
- `document.title` belongs to the browser document, which is external to the
  JSX returned by the component. It is therefore a justified effect instead of
  a render-time assignment.
- The effect stores the previous title, changes the title after rendering, and
  restores the previous title during cleanup. This keeps the external browser
  state owned by the evidence page while that page is mounted.
- The implementation is in
  `react/features/evidence/EvidencePage.tsx` and is marked with
  `//Exercise 6 - Demo 2:`.

### Question 1 - What does React compare for a populated dependency array?

- [x] React compares each current dependency with the corresponding dependency
      from the previous render. The comparison is made for the values listed in
      the dependency array, not for every value in the component.
- If a listed value has changed, React runs the effect again after rendering.
  If the listed values have not changed, React does not repeat that
  synchronization.
- If an effect reads a value but that value is omitted from the dependency
  array, the dependency list no longer describes everything that can make the
  effect relevant. The effect can continue using an older value from the
  render in which its function was created.
- For example, an effect that reads `selectedEvidenceId` but uses `[]` would
  not be scheduled again when the selected evidence changes. The external
  result could remain based on an old selection.
- This matters for asynchronous work from Chapter 6. A late result must still
  be relevant to the current owner and current inputs. Omitting a value can
  prevent the effect from responding when the operation should be restarted or
  synchronized again.

### Question 2 - How is useEffect(fn, []) different from calling fn() directly?

- [x] `useEffect(fn, [])` registers an effect with React. React runs it after
      the component render has completed and uses the empty dependency list to
      describe that it has no changing dependencies.
- Calling `fn()` directly in the component body executes immediately during
  every render. It is not a run-once instruction.
- Components can render again after state updates, parent updates, route
  changes, development checks, or other React work. A direct call would
  therefore run again on those renders.
- The direct call also runs during the render calculation, where the component
  should calculate the UI instead of performing unrelated external work. This
  can cause repeated document changes, requests, logs, or other external
  actions.
- The empty dependency array does not mean React will never call the component
  again. It means that the registered effect has no changing dependencies that
  should cause another ordinary effect run. React can still perform development
  checks, so the effect must remain safe if it is set up and cleaned up more
  than once during development.

---

## Demo 3 — Cleanup: timers & subscriptions

**Tasks**

- [x] Implement at least one effect that sets up something needing cleanup (a `setTimeout`/
      `setInterval`, a `window` event listener, or similar) and returns a proper cleanup function.
- [x] Demonstrate what happens (e.g. via a console log in both the effect and its cleanup) when the component unmounts or the dependencies change, with and without the cleanup function present.

**Questions** (depend on the tasks above)

- [x] What actually calls your cleanup function, and when? Name at least two distinct situations that trigger it.
- [x] What real, observable bug would you get in this app if you set up a subscription/timer in an effect but forgot the cleanup function? Be specific, not just "a memory leak."

## Demo 3 - Completed answers

### Task 1 - Set up an effect that needs cleanup

- [x] `EvidencePage.tsx` now starts a five second timer inside an effect.
- The effect logs when the timer is started.
- The timer callback logs when the delayed operation completes.
- The effect returns a cleanup function.
- The cleanup function calls `window.clearTimeout(timerId)` and logs that the
  cleanup completed.
- The timer is owned by the evidence page. When the page is no longer mounted,
  the timer is cancelled instead of continuing without its owner.
- The changed code is marked with
  `//Exercise 6 - Demo 3:` in
  `react/features/evidence/EvidencePage.tsx`.

### Task 2 - Observe setup and cleanup

- [x] The effect log and cleanup log make the lifecycle observable.
- When the evidence page mounts, the console shows
  `Demo 3: timer effect started`.
- If the page remains mounted for five seconds, the console then shows
  `Demo 3: timer callback completed`.
- If the user leaves the evidence page before five seconds, the cleanup
  function runs and the console shows
  `Demo 3: timer cleanup completed`.
- The callback should not run after the timer has been cleared.
- The unsafe version without cleanup would keep the timer active after the
  page had been removed. It is described here as a comparison and is not left
  in the application.
- In development, `StrictMode` can make setup and cleanup appear during
  development checks. That is useful evidence that the effect must be safe to
  start and stop more than once.

### Question 1 - What calls cleanup and when?

- [x] React calls the cleanup function returned by the effect.
- One situation is component unmounting. When the evidence page is removed
  because navigation changes the rendered route, React calls the cleanup
  function and the timer is cancelled.
- A second situation is a dependency change. If an effect has a populated
  dependency array and one of those dependencies changes, React cleans up the
  previous effect before running the effect again for the new dependency
  values.
- Development checks can also cause an effect to be cleaned up and set up
  again. This checks whether the effect correctly releases what it created.
- Cleanup is therefore connected to ownership and relevance. The code that
  starts a delayed operation also defines how that operation is stopped when
  the owner disappears or the previous operation is no longer current.

### Question 2 - What bug appears without cleanup?

- [x] Without `window.clearTimeout(timerId)`, the timer would remain pending
      after the user navigated away from the evidence page.
- The delayed callback could still log after the evidence page had disappeared.
  In a real application, that callback could also try to update state or
  coordinate with an external system belonging to a page that no longer owns
  the operation.
- Repeated navigation could create multiple pending timers. Each visit could
  start another timer, and the callbacks could later run together. The user
  could see repeated notifications, repeated requests, repeated calculations,
  or logs from views that are no longer visible.
- Without cleanup, an event subscription could similarly remain attached after
  unmounting. Each later mount could add another subscription, so one event
  could be handled multiple times.
- This is more specific than saying only memory leak. The observable bug is
  that late asynchronous work continues after its owner is gone, and repeated
  mounts can multiply the number of callbacks handling the same event.
- Chapter 6 describes this as an ownership and relevance problem. Every
  asynchronous operation needs a clear owner that handles completion, failure,
  cleanup, and obsolescence.

---

---

## Demo 4 - Build the read-only Node backend

<!-- //Exercise 6 - Demo 4: record the backend implementation and its
     development-only verification status directly under this demo. -->

**Tasks**

- [x] Set up a minimal Node.js server (Express or equivalent) with one GET endpoint per data
      resource (case, evidence, people, locations, timeline), each returning the same shape of data
      as the corresponding `data/*.json` file does today.

  - Added `server/api-server.js` using Node's built-in `node:http` server.
  - Added read-only GET endpoints for `/api/case`, `/api/evidence`,
    `/api/people`, `/api/locations`, and `/api/timeline`.
  - Each endpoint reads the matching JSON file from `public/data/` and returns
    its parsed contents without changing the data shape.
  - The implementation is marked with
    `//Exercise 6 - Demo 4:` in `server/api-server.js`.

- [x] Add a way to deliberately simulate real-world conditions for testing later demos: an artificial delay (configurable, e.g. via a query param or env var) on at least one endpoint, and a way to make one endpoint return an error response (e.g. a 500) on demand.

  - Every endpoint accepts `?delay=2000`, which waits before returning.
  - The delay is capped at thirty seconds so the test control remains bounded.
  - Every endpoint accepts `?error=1` or `?error=true` and returns HTTP 500.
  - These controls create pending and failure states for later effect,
    error-handling, and cancellation demonstrations.

- [ ] Confirm the server runs locally alongside `vite dev` and is documented (a README section is enough) as dev-only (not part of the Exercise 2 deploy pipeline).

  - The server uses port `3001` by default and can use `PORT` when supplied.
  - Vite can serve the frontend on its own port while this Node process serves
    the API on port `3001`.
  - The setup instructions and dev-only scope are documented in the
    `Demo 4 development backend` section of `README.md`.
  - No deployment workflow was changed. The backend is intentionally local
    development infrastructure.
  - I did not run the server or Vite because the requested verification commands
    were explicitly left for you.

**Questions** (depend on the tasks above)

- [x] Why does this exercise ask for artificial delay/error controls on the backend, instead of just pointing the frontend at the static JSON files directly (as it already could)? What could you _not_ teach convincingly without them?

  - Static JSON files normally respond too quickly to make the pending state
    visible in a useful way.
  - A deliberate delay creates a real interval between request initiation and
    completion. That makes asynchronous ordering visible.
  - A deliberate error creates a rejected request and a real HTTP failure path.
  - Without these controls, it would be difficult to demonstrate loading
    indicators, error handling, `try` and `catch` behavior, cleanup,
    cancellation, request races, and stale-result protection convincingly.
  - The backend controls let later demos reproduce the same conditions instead
    of waiting for an accidental slow network or accidental server failure.
  - This follows the Chapter 6 distinction between a pending Promise, a
    fulfilled result, and a rejected result. Static data can show the
    fulfilled path, but it does not reliably expose the other paths.

- [x] What is CORS, and did you have to deal with it running your frontend (from Vite's dev server) against this separate backend server? If yes, what did you configure and why? If no, why not?

  - CORS is the browser rule that controls whether a page from one origin may
    read a response from another origin.
  - Vite and the Node backend use different local ports, so they are separate
    origins even when both use `localhost`.
  - The backend sends `Access-Control-Allow-Origin: *` on JSON responses.
  - It also answers `OPTIONS` requests with allowed `GET` and `OPTIONS`
    methods and the `Content-Type` header.
  - This configuration allows the browser frontend to read the API responses
    during local development.
  - The CORS behavior is implemented in `server/api-server.js` and documented
    in `README.md` as part of the Demo 4 local backend.

---

## Demo 5 — Consume the backend from React

**Tasks**

<!-- //Exercise 6 - Demo 5: connect the React application to the local backend
     through an effect-owned asynchronous loading flow. -->

- [x] Replace at least one view's data source (previously the static `data/*.json` fetch/import) with a real `fetch()` call to your new backend, wired up inside a `useEffect`.

  - `App` starts `loadAllData()` inside `useEffect` after the React component
    mounts.
  - The API module performs the real `fetch()` call against the backend
    endpoint instead of reading `data/*.json` directly.
  - The changed React code is marked with
    `//Exercise 6 - Demo 5:` in `react/app/App.tsx`.
  - The backend URL and fetch conversion are marked with
    `//Exercise 6 - Demo 5:` in `data/api.ts`.

- [x] Do the same for the rest of the app's data sources, so the whole app now reads from your backend rather than static files.

  - Case data now comes from `/api/case`.
  - Evidence data now comes from `/api/evidence`.
  - People data now comes from `/api/people`.
  - Location data now comes from `/api/locations`.
  - Timeline data now comes from `/api/timeline`.
  - `react/main.tsx` no longer waits for a static loading call before
    mounting React. `App` owns the backend loading lifecycle.
  - The entry-point change is marked with
    `//Exercise 6 - Demo 5:` in `react/main.tsx`.

**Questions** (depend on the tasks above)

- [x] Walk through exactly what happens, in order, from the component mounting to the data actually being available to render: what does the effect do, when does it run, and what causes the component to re-render once the data arrives?

  - React mounts `App` immediately from `react/main.tsx`.
  - The initial `dataLoadState` is `loading`, so the component renders a
    loading message instead of data-dependent routes.
  - After the first render, the `useEffect` callback starts `loadAllData()`.
  - `loadAllData()` requests the case, people, and locations resources, then
    requests evidence and timeline through the backend API.
  - Each `fetch()` returns a Promise. The response is checked for success and
    then parsed with `response.json()`.
  - The resolved values are placed into the existing global state through the
    typed setters.
  - When the Promise fulfills, the effect calls `setDataLoadState("ready")`.
  - That state update requests a new render of `App`. The ready branch then
    renders the routes, whose components read the populated global state.
  - If a request rejects, the catch branch stores an error message and changes
    the state to `error`, which causes a render of the error message instead.
  - The `finally` branch hides the old loading overlay for both fulfilment and
    rejection.

- [x] What's different about your component now compared to before (when data came from a static
      import/fetch of a local file). Specifically in terms of what state it needs to track that it
      didn't need before?

  - Before Demo 5, the entry point waited for the data-loading Promise before
    mounting the React tree. The component did not need to represent the
    network lifecycle.
  - Now `App` tracks `dataLoadState` with `loading`, `ready`, and `error`
    values.
  - It also tracks `dataLoadError` so a rejected Promise can be shown as an
    error instead of being confused with an empty result.
  - The component needs an effect because the request is asynchronous and
    communicates with the backend outside the render calculation.
  - The effect keeps an `isCurrent` ownership guard so a completion from an
    obsolete effect instance cannot change React state after cleanup.
  - This additional state exists because backend data can remain pending or
    fail. A local static file made those intermediate states much less visible.

---

## Demo 6 — Loading, error, and empty states

**Tasks**

<!-- //Exercise 6 - Demo 6: document the explicit loading, error, and empty
     states implemented across the App and evidence view. -->

- [x] For at least one view, implement all three states explicitly: a loading indicator while the fetch is pending, a real error message if it fails (using your backend's on-demand error endpoint from Demo 4 to trigger it live), and a distinct "no data" empty state if the response is successful but contains nothing.

  - `App` renders a `data-loading` message while `dataLoadState` is
    `loading`.
  - `App` renders a `data-error` message when the backend Promise rejects and
    `dataLoadState` becomes `error`.
  - `EvidenceList` renders an `empty-state` message when the backend
    successfully returns an empty evidence collection.
  - The backend supports `?empty=1` for successful empty array responses.
  - The backend supports `?error=1` for deliberate HTTP 500 responses.
  - Add `?delay=2000`, `?error=1`, or `?empty=1` to the frontend URL,
    for example `http://localhost:5173/?delay=2000`, to demonstrate each
    state through the same React loading flow.

- [x] Make sure these three states are visually and structurally distinguishable from each other, not all three collapsing into "shows nothing."

  - Loading uses the `data-loading` class and `role="status"`.
  - Errors use the `data-error` class and `role="alert"`.
  - Empty evidence uses the `empty-state` class and a separate message.
  - `styles.css` gives the three classes different structure and visual
    treatment.
  - The changed source files contain
    `//Exercise 6 - Demo 6:` comments.

**Questions** (depend on the tasks above)

- [x] Trigger your backend's error endpoint live and show the error state appearing. What state variable(s) are you tracking to distinguish "loading," "error," and "loaded successfully but empty" from each other?

  - Open the frontend with `?error=1` while the backend is running.
  - The API forwards that query parameter to the backend endpoints.
  - The backend returns HTTP 500, `fetchJson` throws, and the `catch` branch
    stores the message in `dataLoadError`.
  - `dataLoadState` distinguishes the states:
    - `loading` means the Promise is still pending.
    - `error` means the Promise rejected.
    - `ready` means the request succeeded.
  - An empty successful result is distinguished by the returned collection
    length. `EvidenceList` renders `empty-state` when `evidence.length === 0`.

- [x] The original vanilla app had a bug where a failed fetch could leave a loading spinner stuck forever because the cleanup/hide-loading step was never called on the error path. Explain specifically how your React version's state management makes that particular mistake
      harder to make (or show that it doesn't, and fix it).

  - The React flow has an explicit `catch` branch that changes
    `dataLoadState` from `loading` to `error`.
  - The `finally` branch calls `hideLoadingOverlay()` for both fulfilled and
    rejected Promises.
  - The visible loading message is controlled by React state, so it is
    replaced by the error message after rejection instead of remaining as the
    only visible state.
  - A successful empty collection is not treated as an error and does not
    leave the loading state active. It reaches `ready`, then the evidence
    list renders its separate empty message.
  - This explicit Promise handling follows Chapter 6: success belongs in the
    fulfilled path, failure belongs in the rejected path, and cleanup that
    must happen for both belongs in `finally`.

---

## Demo 7 — Request races & cancellation

**Tasks**

<!-- //Exercise 6 - Demo 7: document the reload trigger and AbortController
     ownership that prevent obsolete backend results from being applied. -->

- [ ] Using your backend's artificial-delay control, construct a request race: trigger a request, then trigger another one (for the same data) before the first resolves, and observe
      what happens if you do nothing special about it. Does the UI ever show a result from the
      _older_ request after a newer one already resolved?

  - The `Reload case data` button provides the second request trigger.
  - Add `?delay=5000` to the frontend URL so the first Promise remains pending
    long enough to start a second request.
  - The unprotected sequence would be: request one starts, request two starts,
    request two resolves, and request one resolves later.
  - If both results are allowed to commit, the older completion can overwrite
    the result that came from the newer request.
  - The live race has not been run because server and frontend verification
    were left for you.

- [x] Fix it using `AbortController` (or a request-id/"ignore stale response" guard, your choice), so the UI can never show a stale result.

  - `App` now has a `Reload case data` button that starts another load.
  - The effect creates one `AbortController` for each load.
  - The effect cleanup calls `controller.abort()` before the next effect
    instance starts.
  - The API functions pass the signal into every backend `fetch()`.
  - Aborted requests are ignored instead of being shown as errors.
  - The `isCurrent` guard also prevents an obsolete Promise from updating
    React state after cleanup.
  - The changed code is marked with `//Exercise 6 - Demo 7:` in
    `react/app/App.tsx` and `data/api.ts`.

**Questions** (depend on the tasks above)

- [ ] Reproduce the race live (with artificial delay dialed up) before your fix, then show the fix preventing it. What exact sequence of events causes the stale result to win without the fix?

  - To demonstrate the timing, start the backend and frontend with a delayed
    URL such as `?delay=5000`.
  - Click `Reload case data` twice before the first request settles.
  - Without cancellation, the first request can settle after the second
    request and its older result can overwrite the newer result.
  - In the fixed version, the second click causes the first effect cleanup to
    abort the first request before the newer request becomes current.
  - I did not run this live because server and frontend verification were left
    for you.

- [x] `AbortController` cancels the _request_. Does the effect's cleanup function run separately, or is aborting the fetch itself what you're doing inside the cleanup? Explain how the two connect in your implementation.

  - The effect cleanup runs because the component unmounts or because
    `reloadVersion` changes and React replaces the previous effect instance.
  - The cleanup calls `controller.abort()`. Aborting the fetch does not call
    the cleanup by itself.
  - The cleanup owns the decision to abort. The controller then signals the
    fetch that the request is no longer relevant.
  - The rejected AbortError is ignored by the effect catch branch.
  - This connects the two operations: React cleanup identifies that the old
    effect is obsolete, and `AbortController` cancels the asynchronous request
    created by that effect.

---

## Demo 8 — Extract a reusable custom hook

**Tasks**

<!-- //Exercise 6 - Demo 8: document the shared hook and the two component
     call sites that use the same asynchronous lifecycle. -->

- [x] Extract the data-fetching logic (loading/error/empty state, the effect, cancellation) you've built across Demos 5–7 into at least one reusable custom hook (e.g. `useFetch<T>(url)` or a more specific `useEvidence()`), and use it in at least two different places.

  - Added `react/hooks/useBackendData.ts`.
  - The hook owns the effect, loading status, error state, empty collection
    detection, `AbortController`, cleanup, and stale-result guard.
  - `App` uses the hook for the complete case-data load.
  - `EvidencePage` uses the same hook for its optional evidence refresh.
  - The implementation is marked with
    `//Exercise 6 - Demo 8:` in the hook and both call sites.

**Questions** (depend on the tasks above)

- [x] What makes something a legitimate custom hook rather than just a regular helper function? What rule(s) does React enforce about how/where hooks (including your custom one) can be called?

  - `useBackendData` is a custom hook because it is a function named with the
    `use` prefix and it calls React hooks such as `useState` and `useEffect`.
  - It packages reusable React stateful behavior, not only a normal
    calculation. Its result changes as the Promise changes from pending to
    fulfilled, empty, rejected, or cancelled.
  - A custom hook must follow the same Rules of Hooks as built-in hooks.
  - It must be called only at the top level of a React function component or
    another custom hook.
  - It must not be called inside conditions, loops, nested functions, event
    handlers, or ordinary non-React helper functions.
  - Calling hooks in a stable order lets React associate each hook state with
    the correct call between renders.

- [x] Show the two places using your hook. What did extracting it save you from duplicating, and is there anything about the two usages that _couldn't_ be shared and had to stay specific to each call site?

  - `App` calls `useCaseData()` for the initial complete application load and
    the `Reload case data` action.
  - `EvidencePage` calls `useBackendData(loadEvidenceForRefresh, ...)` for
    the user-triggered `Refresh evidence` action.
  - Both call sites share loading, error, empty, cancellation, cleanup, and
    stale-result behavior.
  - The hook prevents the effect and Promise handlers from being duplicated.
  - The loader is specific to each call site. `App` loads all resources and
    populates global state, while `EvidencePage` reloads only evidence.
  - The UI is also specific. `App` controls the application routes, while
    `EvidencePage` controls the evidence refresh button and evidence list.

---

## Demo 9 — Separate UI, application logic, and API access

**Tasks**

<!-- //Exercise 6 - Demo 9: document the separation between raw backend access,
     asynchronous application logic, and React UI components. -->

- [x] Organize your data-fetching code into distinct layers: a thin API-access layer (raw `fetch` calls, knows the backend's URLs/shapes and nothing else), your custom hook(s) from Demo 8 (application logic: loading/error/cancellation), and your components (UI only, no direct `fetch` calls anywhere in a component).

  - `data/api.ts` is the thin API-access layer. It knows the backend base URL,
    endpoint names, response types, response validation, and `fetch`.
  - `react/hooks/useBackendData.ts` owns Promise lifecycle behavior, loading,
    error, empty, cancellation, cleanup, and stale-result handling.
  - `react/hooks/useCaseData.ts` coordinates the API functions and commits the
    complete data bundle to application state.
  - `App` and `EvidencePage` only use hooks and render UI. They do not know
    backend URLs and do not call `fetch`.
  - The old vanilla entry uses `data/legacyLoader.ts` as a compatibility
    path. It is separate from the active React API and hook layers.
  - The changed files contain `//Exercise 6 - Demo 9:` comments.

- [x] Confirm no component in the app calls `fetch` directly anymore.

  - The only active raw `fetch` call is in `data/api.ts`.
  - React components call `useCaseData` or `useBackendData` instead.
  - The hook receives Promise-producing loaders and keeps asynchronous
    control flow outside the component UI.
  - This keeps initiation, completion, rejection, cancellation, and
    relevance decisions out of presentational component code.

**Questions** (depend on the tasks above)

- [x] If your backend's endpoint URLs or response shape changed tomorrow, how many files would you need to touch, and which ones? Would any component need to change?

  - For a URL change or response-shape change, the main active file to update
    would be `data/api.ts`.
  - If the domain shape changed, the related types in `types/domain.ts` might
    also need updating.
  - `react/hooks/useCaseData.ts` would only need changes if the application
    mapping from the new response into global state changed.
  - The reusable lifecycle hook and UI components would not need to know about
    endpoint URLs or raw response shapes.
  - Therefore, no component should need to change for a backend URL change
    alone.

- [x] What's the argument _against_ this separation for a small app like this one? E.g. when would the extra layering be overkill rather than helpful? Do you think it's justified here?

  - The argument against it is additional indirection. A small application
    can be easier to understand when one component performs one request and
    handles its result locally.
  - Extra API modules, hooks, loaders, and type boundaries can make a simple
    request harder to trace.
  - The separation can be overkill when there is only one short-lived view,
    one request, no repeated loading behavior, and no expected backend change.
  - It is justified here because the application has several resources,
    multiple views, delayed and failed requests, cancellation, and repeated
    asynchronous lifecycle behavior.
  - The layers give each concern one owner: API communication, Promise
    lifecycle, application state, and visible UI.

---

## Demo 10 — Data-flow wrap-up & a written UX decision

**Tasks**

<!-- //Exercise 6 - Demo 10: record the complete data path and the UX
     decision that should be explained during the live walkthrough. -->

- [x] Illustrate the full data flow for one piece of data, end to end: the JSON file -> your backend endpoint -> the API-access layer -> your custom hook -> the component -> what's on screen.

  - Example data item: the evidence collection from `public/data/evidence.json`.
  - The Node backend reads the JSON file and serves it through
    `GET /api/evidence`.
  - `data/api.ts` calls the endpoint through `fetchEvidenceData`.
  - `useCaseData` coordinates the evidence request and uses
    `useBackendData`, which starts the request inside `useEffect`, tracks the
    Promise status, and handles cancellation and stale results.
  - `EvidencePage` reads the loaded evidence from application state during the
    normal route flow, or receives the hook result through its refresh flow.
    It combines the evidence with bookmark state and derives `visibleEvidence`.
  - `EvidenceList` maps the visible evidence to cards, so the final result is
    the evidence catalogue on screen.
  - The complete flow is:

    `public/data/evidence.json`
    -> `server/api-server.js`
    -> `data/api.ts`
    -> `useCaseData` / `useBackendData`
    -> `EvidencePage`
    -> `EvidenceList`
    -> evidence cards on screen

  - The flow is marked in the relevant source files with
    `//Exercise 6 - Demo 10:`.

- [x] Explain a short, honest justification for one loading/error/empty-state UX decision you made (e.g. what your loading indicator looks like, how errors are worded, what "empty" looks like) and note one thing you'd do differently with more time.

  - The loading state uses a clear text message, `Loading case data...`, with
    `role="status"` so the user can tell that the application is waiting for a
    Promise to settle.
  - The error state uses a separate alert message with the request error. This
    is more honest than showing an empty list when the backend request failed.
  - The empty state uses `No evidence available.` with a separate dashed panel
    style. This communicates successful loading with zero records.
  - The decision is justified because pending, rejected, and fulfilled-empty
    states represent different facts and should not look identical.
  - With more time, I would improve the error UX with a dedicated retry action
    and more user-focused wording while keeping the technical error available
    for debugging.

**Questions** (depend on the tasks above)

- [ ] Walk through your diagram/illustration live, and for one step, explain what would break (and how you'd notice) if that step silently stopped happening.

  - Walk from left to right through the evidence flow.
  - If the backend stopped serving `/api/evidence`, the API Promise would
    reject with an HTTP error.
  - The hook would move to `error`, and the error UI would appear instead of
    evidence cards.
  - The Network tab would show the failed request, and the API error would
    identify the broken boundary.
  - I did not perform the live walkthrough because runtime verification was
    left for you.

- [x] Across Exercises 3–6, this app went from "read static files instantly" to "fetch from a real, sometimes-slow, sometimes-failing server". What did that change force you to add that wasn't needed before and was any of it needed _conceptually_ even back when the data source was a static file, just less visible?

  - The app needed explicit loading, success, error, and empty states.
  - It needed Promise error propagation instead of treating every result as
    immediately available.
  - It needed ownership for intermediate state while requests were pending.
  - It needed cleanup and cancellation when requests became obsolete.
  - It needed stale-result protection when a newer request superseded an older
    request.
  - It needed a backend API layer and a hook layer so network behavior did not
    become UI code.
  - These concerns were conceptually present even with static files. A static
    file could still fail, be unavailable, return unexpected data, or complete
    later than expected. The backend makes those cases visible and repeatable,
    rather than creating them conceptually for the first time.

---
