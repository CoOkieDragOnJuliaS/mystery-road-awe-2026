# Exercise 3 — React Foundations & First Migration

This is the third exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 1 and 2. This exercise adds
React to that project and migrates the **application shell and one representative view (the Dashboard)** to it. The rest of the app stays vanilla TS for now. You'll migrate more of it in Exercises 4 and 5.

Keep a running note of what you changed and why, and commit as you go. Several theory questions ask you to point at a specific decision or diff you made.

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 12, From Static Documents to Rich Web Applications** — PDF pp. 85–88
- **Chapter 13, Rendering and Navigation Architectures** — PDF pp. 90–95
- **Chapter 14, Hybrid Rendering and Modern Web Architectures** — PDF pp. 96–100
- **Chapter 15, React Foundations** — PDF pp. 102–109

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class. 

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | Historical view of the web | ☐ |
| 2 | SSR vs. CSR | ☐ |
| 3 | The virtual DOM | ☐ |
| 4 | SPA vs. MPA: state & routing | ☐ |
| 5 | React introduction | ☐ |
| 6 | React + TypeScript entry point in the Vite project | ☐ |
| 7 | Component hierarchy for the whole app | ☐ |
| 8 | Architecture Decision Record: why SPA/React | ☐ |
| 9 | Migrate the application shell | ☐ |
| 10 | Migrate the Dashboard view | ☐ |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked — the table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — Historical view of the web

**Tasks**

- [x] Give a concise explanation of how web applications evolved over the years and place the app from the exercises on the timeline. Justify where you put it.

        Web applications went from static HTML web pages (the early era of the web with links to other static HTML pages) - my first webpage was one of those with 
        Gifs, Images, CSS scripts to a full-on colorful degree and small imbedded scripts of early JavaScript

        to Dynamic HTML generated templates (server-rendered) and navigation requests (why dynamic? By rendering the page with data --> filling the template placeholders with data)

        Up to AJAX and DOM requests  [Rich pages and updates after data requests (only parts of the page) with fetch and response.json] --> A lot of logic with event handlers and selectors

        Further on we have client-side routing and application-state component based websites   Later on (Browser requests page route, server loads data and renders HTML, Browser receives the document and navigation replaces the current document)
        
        And later on with server components. (Browser request an application shell, host returns HTML, JS and CSS and the client node renders the current route --> router switches views and APIs return data as needed --> state lives in browser and the views are switched in place
        
        
    - The current app is placed on the timeline I suppose placed on the line between AJAX/DOM requests and the client site-routing/application-state component based webpage
    Why? 
        
        It uses fetch() arguments and updates the DOM in place - currently it uses a lot of innerHTML for rendering and has still window.location routing (hash-based), which is AJAX hybrid. Without innerHTML, it would live more on the AJAX state



**Questions** (depend on the tasks above)

- [x] What specific problem was AJAX (and libraries like jQuery) solving that plain server-rendered pages couldn't? What new problems did that approach introduce, that SPA frameworks then tried to solve?

        Well, AJAX did not replace the server rendering - AJAX solved it in the way that JavaScript began requesting data in the background and updates part of the existing page instead of everything. AJAX is the term for Asynchronous JavaScript and XML --> instead of a complete navigational switch/discard of whole document we have page updates on the information needed, e.g. refreshing a status of an article (if read or not)

        The new problems behind it were the following:
            - With a lot of event handlers and fetches we don't know which regions of the DOM are dependent on the AJAX data
            - Which fetch result was relevant and where it was needed
            - The order of the runs of those fetches (dependent?)
            - How the browser and navigation should show the current view - automatically updated on the spot, be in the background, etc. 

- [x] This app currently uses hash-based routing (`#dashboard`, `#evidence`, ...) with no full page reload between views. Which era does that pattern belong to, and what does it tell you about when this architectural choice became common?

        #dashboard and #evidence belong to hash-based routing.
        The era it belongs to is the Client-Side routing & application-state SPA (4th era) I suppose.
        - It works on static host without a rewrite logic and through the hash it has a client-sided route (not sent to server)
        - It works inside HTML 
        - example in app: router.ts (window.location.hjas and handleHashChange()  where the navigateTo() is set and uses hash-based routing)

---

## Demo 2 — SSR vs. CSR

**Tasks**

- [x] Present a short comparison table for Server-Side Rendering and Client-Side Rendering. Explain what the server sends on first request, what the browser has to do before the user sees content, and what happens on subsequent navigation.

        | Question      | Server-Side Rendering      |  Client-Side Rendering     |
        | :----  | ----:  | ----:  |
        | What is rendered? | Server produces the view's HTML   | JavaScript creates the view's DOM |
        | What does the server send on first request? | HTML of view    | HTML shell with JavaScript and CSS |
        | What must happen before the user sees the content?| Browser displays the HTML, maybe needs JavScript to run | Browser loads data and the HTML shell / creates the intiial DOM |
        | What happens on subsequent navigation?    | Multi-Page application (MPA), navigation requests document --> replacing current document | In a Single-Page application (SPA), router changes URL and view without replacing current document --> cached state?|

        --> Table creation in Markdown document in Visual Studio does not worke - here is the new table made from 
                ![alt text](/resources/documentation_images/table_clientside_serverside.png)


- [x] Pick one real, publicly known website and argue whether it's (primarily) SSR or CSR, using
observable evidence (view source, network tab, etc.).

        Wordpress.com --> Server-side rendered (SSR), because in Network tab while the page is reloaded the response for the HTML document is primarily everything the site has 
        --> like HTML, page-specific content and metadata, classes. 
        There is probably a lot of other things inside the page itself, e.g. menu hovering creates a lot of network traffic, but the primarily used evidence is the SSR

**Questions** (depend on the tasks above)

- [x] Explain why this exercise application is SSR or CSR and why. Walk through, step by step, what happens between the browser requesting the page and the Dashboard actually being visible.

        - This app currently is CSR, why? Because the Browser requests the index.html and uses JS to parse and execute it. After everything is loaded the HTML gets visible
        Step by step (during Vite run):
                1. The load is requesting index.html
                2. The app works with an empty HTML shell and an app.js reference, it calls to it
                3. Browser parses the JavaScript and runs it --> which means app.ts has the init() methods, the loadAllData(), api methods, which fetch and render elements
                4. renderDashboard() runs afterwards and assigns it currently with innerHTML (there is a better solution as we know)
        
- [x] Name one real cost of what the architecture pays for that choice (think about what a user with JavaScript disabled, or a slow connection, or a search engine crawler would see) and why.

        - One problem is, that we server an empty HTML shell during the page load, so the user only sees an empty shell without the javascript data if something goes wrong with JS code
        - How a search engine crawler works I don't know. I suppose it tries to execute JS through the search engine inside the code itself, which should not work with the HTML shell and the JS loading afterwards.

---

## Demo 3 — The virtual DOM

**Tasks**

- [x] In your own words (a few sentences, not a copied definition), explain what the virtual DOM is and what problem it solves.

        - The virtual DOM?.. I suppose, from the information provided in the book and the information about React itself:
        - It is a informational DOM used during an update of the view, the UI? It is not a DOM as known in HTML, but rather a template of the the view should contain (React view?)
        You can also compare it with PL/I and a DCL declare template - which shows what should be contained

        For the problem it solves:
                It checks if something changes on the virtual DOM and only applies the changes to the things that need to be changed, keeping it to a minimum

- [x] Find one concrete example in the *original* vanilla `app.js` (from before Exercise 1) where a small state change (e.g. toggling one bookmark) caused a large chunk of real DOM to be recreated via `innerHTML`, even though only a tiny part of it actually needed to change.

        - I am glad that I saved it under old_app.js, otherwise I would have to struggle through all those commits.

                One concrete example is the renderDashboard() function in old_app.js. It sends a huge html element and sets it to container.innmerhTML.
                Even if only one single element is changed the entire dashboard is recreated via innerHTML. 

**Questions** (depend on the tasks above)

- [x] Using the example you found: how would a virtual-DOM-based approach (conceptually, not necessarily React-specific) avoid recreating the parts that didn't change?

        - Because virtual dom, from the information above, checks if something particular changes and does not recreate the entire DOM it could solve the recreation of the entire dashboard if one thing changes.
        It calculates and compares UI descriptions, much like a difference in git commits and keeps the existing DOM if nothing changes from the properties 

- [x] Is the virtual DOM a "faster" way to update the real DOM than directly calling `innerHTML`? Explain precisely what's actually being traded off (think about the diffing work itself).
        - innerHTML can insert a whole block of HTML, but needs to be recreated more often if you change something small
        - virtual DOM compares the differences of the changes, which may cost more time - but only recreates elements that need to be changed (which saves time?)
       

- [x] Does using a virtual DOM library automatically make your app fast? What could still make a React app slow despite it?
        - It is not faster per se, it updates differently than the direct calling of the innerHTML. If the React app calculates a lot of information of the view, than it can be even slower. The original HTML DOM could be way smaller from the time consuming
        - So if you change a lot of elements inside the DOM, then it would recreate the whole innerHTML more often, which makes virtual DOM a more efficient solution

---

## Demo 4 — SPA vs. MPA: state & routing

**Tasks**

- [x] Diagram or illustrate live how navigation currently works in this app: what triggers a view change, what code runs, and what does *not* happen (that would happen in a classic multi-page site).

        What does not happen?
        - The browser does not fully reload the page, the localStorage and state remain, and it does not get rid of the current document, only changes the active hash element

- [x] List every piece of state in the current app that would be lost on a full page reload, versus what's preserved (hint: check what's in `localStorage` versus what's only in memory).

        - The localStorage, which means remotion_bookmarks, remotion_nbotes and remotion_hypothesis are saved in localStorage even across page reloads

        - The selectedEvidence, filteredEvidence, currentPeopleTab and the flags are not saved for a full page reload - views will render again fully if I close and reopen the app

**Questions** (depend on the tasks above)

- [x] In a traditional multi-page app, where does "the current page's data" live between requests? Where does it live in this SPA instead, and what are the consequences of that difference (for good and for bad)?

        - Current page data in Multi-Page App (MPA): Data lives on the server or is embedded into a HTML doc which is fetched. At navigateTo for example, the browser would forget everything and get new information

        - In SPA (Single-Page App): Data lives inside the browser in memory and in localStorage of course. Faster navigation is a good one, BUT it is difficult to manage the sensible data inside the SPA and the memory needed is much larger.

- [x] This app currently implements routing by hand (`handleHashChange()`, a `switch`-like chain of `if`s, and manually toggling CSS classes). What is a router library actually responsible for that this hand-rolled version does *not* handle?

        - A usual router library (using e.g. React) handles states better and does not only deal with hashes
        - it works with parameters and nested routes (e.g. /evidence/:id)

        ![alt text](/resources/documentation_images/react_routes.png)
        From the book the message was:
                React does not include routing. A router maps URLs to component
                trees and integrates history, links, parameters, query
                values, and missing routes.
                Route parameters normally identify resources, while query
                parameters commonly represent optional view state such as
                filters and sorting.

        In other words: Route redirects and loads per route with parameters and parsing. It reacts if there is no route found and can work with history of the routing to go back to

- [x] If the user hits the browser's back button right now, what happens in this app, and why?

        - With hash routing the back-button also triggers the hashChange event, but it does not re-render the dashboard and thus not show if the reviewed state or the new evidence is shown on the dashboard. But I found a bug while doing it. 
        A full page reload, as mentioned before, also gets rid of the reviewedFlag

        Hash itself works for the back-button, but the rendering is cached (viewRendered.dashboard = true) so it does not rerender and the count does not change



---

## Demo 5 — React introduction

**Tasks**

- [x] Read enough of the React docs (or equivalent) to write, from scratch, a single tiny component (it can live in a throwaway sandbox, not necessarily this project yet) that renders a piece of static data as JSX. No state, no props even, just to prove you can write and reason about JSX.

        - created sandbox.jsx component for testing out the information

- [x] Identify, in your own words, what "component" means in React, and how it differs from a plain JavaScript function that happens to return an HTML string (which is essentially what several functions in the old `app.js` did, e.g. `renderEvidenceCardHTML()`).

        - A component is also like a template for React elements. It can be translated with React to get local states or React based functions
        - React works with state - so as JavaScript functions (e.g. renderEvidenceCardHTML) only do one thing, the method call has to be assigned to innerHTML to work and be viewed by the user

**Questions** (depend on the tasks above)

- [x] What is JSX, actually? What does it compile to?

        - JSX compiles to JavaScript using React elements to create a template to use 
        What is it? A syntax of some sort --> a value in React and at the same time looking like HTML
        - React event handlers are passing functions to JSX (onClick, onChange, etc.) and request changes in response to an user interaction - e.g. getting an HTML component or another component information as a return element from the function
        - JSX ist not interpreted by the browser, but it converts to JavaScript that create React elements --> a middleware of some sorts
        - If we have reusable components and a state-driven rendering we can use react-based frameworks and add runtime code and elements with JSX and TypeScript.

- [x] Compare your tiny component to the old `renderEvidenceCardHTML(ev)` function (string concatenation returning an HTML string). What is fundamentally different about how each one's output becomes real DOM?

        - renderEvidenceCardHTML function --> vice cersa sandbox.jsx
        - The sandbox.jsx returns HTML as a react element -> react compares the current state to the new ony and changes the DOM node (e.g. the elements inside the component)
        - The other function builds a huge html string and returns it. This is then assigned to innerHTML, which replaces everything that was there beforehand.

- [x] What does it mean that "components are just functions" in React? What would break if a
component's function body had a side effect (e.g. mutated a global variable) every time it rendered?

        - Components in react are written as functions (sandbox.jsx). In the book it states that they are seen as pure:
                "Function components should remain pure. The same inputs should produce the same output without side effects during rendering."

        - If a components function body had a side effect (global variable mutated) the mutation could happen multiple times, re-rendering the small elements inside DOM
        The side effects could break the event handlers and the view itself (the output of what we want)

---

## Demo 6 — React + TypeScript entry point in the Vite project

**Tasks**

- [x] Add React and TypeScript support to the existing Vite project from Exercise 2 (the right Vite plugin, `tsx` support, React types).

        - npm install react react-dom
        - npm install -D @types/react @types/react-dom @vitejs/plugin-react
        Added to vite.config.js and tsconfig.json --> need to find out if devDependencies or dependencies

- [x] Create a minimal entry point (e.g. a root `<App />` component mounted into the page) that
renders *something* visible, without removing the working vanilla app yet.

        - created in /react folder - App.tsx and main.tsx
- [x] Decide and document how the two versions coexist during the migration (e.g. a separate route/ flag to view the React version, or a full swap-over. Your call, but be ready to justify it).

        - They got me a few errors because of the Module app and the exports names - also because app is also used by app.js and app.ts - which should be changed I suppose
        - I created a different entry point in index.html so react as well as ts don't fight over the main id="app" and can use separate html containers

**Questions** (depend on the tasks above)

- [x] What did you actually have to install and configure to get JSX compiling through Vite? What is each piece responsible for?

        - react and react-dowm - DOM renderer and runtime information
        - TypeScript definitions to work with react
        - vitejs plugin which is named plugin-react to enable JSX runtime and configuration in vite.config.ts

- [x] How does your `<App />` component get from source code onto the actual page? Trace the path from your `.tsx` file to the DOM.

        - Vites server gets main.tsx and then to app.tsx
        - vite transforms jsx and compiles the .tsx files from typescript also to JavaScript
        - vite then gets the JavaScript to the browser and with createRoot --> we create a React root on the DOM and render the component (which gets me the rendered <App /> and the h1 element)

- [x] What decision did you make about how the vanilla and React versions coexist during migration, and why? What would go wrong with an opposite choice?

        - I made the decision to only have the files co-existent and change the entry point at the end of index.html if needed
        - The rest of the app is still vanlla and if the last entry is changed the app cannot load anything except the preview of the Dahboard, the empty shell, the new react h1 and an endless loading screen

        - If I changed everything onto this, it would break infinitely. Every view needs to be recreated in React until it is usable again. Migrating everything at once is not the goal.

---

## Demo 7 — Component hierarchy for the whole app

**Tasks**

- [x] Design and diagram a proposed component hierarchy for the **entire application**, not just the part you're building this exercise. E.g. pages (one per current view) and the reusable components you expect to extract (cards, badges, buttons, form controls, etc.), even though most of them won't be built until Exercises 4 and 5.

        - Components in react that can be changed independently inside the DOM...
        - I tried to create a diagram using mermaid - i could easily have forgotten some things

- [x] For at least 5 components in your diagram, briefly note what data/props each one would need and where that data comes from.

        - EvidenceCard -> data needed: Evidence itself -> using bookmarks from bookmarks, the status?
        - PersonCard --> Person itself --> and the number of evidences found per person
        - StatusBadge --> The Status of the Evidence, which is shown on the evidence
        - FilterBar --> Information to filter to and the elements to filter
        - DashboardPage --> Gets information about a list of evidences, timelines and statusinformation and summaryCards

**Questions** (depend on the tasks above)

- [x] What criteria did you use to decide something should be its own component versus staying inline inside a bigger one?

        - I extract it if it is needed more than once, for example the status
        - state for each component is needed for each UI element, for example bookmarking an evidence
        - parent-child elements are easier to read nonetheless
        - Isolation of concerns?

- [x] Pick one component in your diagram that appears in more than one place in the app. What made you extract it instead of duplicating its markup, and how does that compare to how the original vanilla app handled (or didn't handle) that same duplication?

        - StatusBadge is inside more than one place - badgeHelper creates it, dashboard and evidence uses it
        - Not only the logic but also how it would be represented could be extracted with React by having a singular component

- [x] Your diagram includes components you won't build until later exercises. Why is it useful to design the whole hierarchy now rather than only diagramming what you're about to build?

        - I can look at the hierarchy and try to re-design it or see if the data-flow or the data-duplication is correct.
        So if any component needs less de-coupling I could redesign it early on and plan accordingly
        - I can plan ahead and don't need to refactor that much later on

---

## Demo 8 — Architecture Decision Record: why SPA/React

**Tasks**

- [x] Argue whether an SPA built with React is actually the right architecture for *this specific app*, given what it does.

        - I don't think that having MPA is bad, but with React it would make the interactive part much more efficient
        - Clicking around with bookmarks, notes, filters and the different views would update the complete view in repeat
        - Initial load is maybe heavier with React, but it could benefit from a lot of changes

        BUT for this small app and the current complexity, changing everything to React would give me components, but a lot of new information and structures that wouldn't be necessary with a goot JavaScript architecture

- [x] Include honest trade-offs or downsides of the SPA/React choice for this app, not just the benefits.

        - I mentioned one trade-off beforehand, but probably there are more

**Questions** (depend on the tasks above)

- [x] What would you lose by keeping this app as server-rendered vanilla HTML/JS instead? What would you lose by choosing React specifically over a *different* SPA approach (e.g. vanilla JS with a router, or a lighter library)?

        - I would loose the view switching and state persistence with React if I stay with HTML/JS, even with AJAX implemented
        - BUT on the other hand I would benefit from not having a lot of complicated files and plugins I needed to install to use tsx, jsx compilation and so on

- [x] If this app needed to support users on very low-end devices or poor connections as a hard requirement, would you stick with SPA or change the architecture? Why or why not?

        - Low-end devices often cannot handle rich react based webpages. Vanilla is lightweight, which means it has less dependencies and works with small rendering.
        - Low internet, low cpu power and so on could really benefit from the current structure

---

## Demo 9 — Migrate the application shell

**Tasks**

- [ ] Build the header/branding, the navigation bar, and a routing skeleton (even a minimal one, a full router library is not required yet) in React + TypeScript.

        - 
- [ ] Wire it up so navigating between (stub) pages actually changes what's rendered, mirroring the current five views even though only the Dashboard will have real content this exercise.

        - 

**Questions** (depend on the tasks above)

- [ ] How does "the current view" get tracked in your React shell? Compare this directly to how `currentPage` and `handleHashChange()` did it in the vanilla version? What's actually different, and what's superficially different but conceptually the same?

        - 
- [ ] What happens in your shell if a user navigates to a view that doesn't exist? How does that compare to the vanilla app's fallback-to-dashboard behavior?

        - 

---

## Demo 10 — Migrate the Dashboard view

**Tasks**

- [ ] Rebuild the Dashboard view as React components (using your hierarchy from Demo 7 as a starting point), rendering the case summary, stat cards, review progress, and the recent
evidence/timeline lists. Reading from the same data your app already loads.

        - 
- [ ] Confirm it renders correctly with real data, and that navigating away and back doesn't lose or corrupt anything.

        - 

**Questions** (depend on the tasks above)

- [ ] Where does the Dashboard's data (case info, evidence, timeline) come from in your React version, and how does it get to the components that render it? Is this the final architecture you intend to keep, or a placeholder you know you'll change in a later exercise?

        - 
- [ ] The old vanilla dashboard had a real bug where it could show stale numbers because it only re-rendered on a view's *first* visit (a manual render-cache flag). Does your React version have an equivalent risk? Why or why not, given how React re-renders?

        - 
- [ ] What, if anything, does your React Dashboard do differently from the vanilla one in terms of *when* it recalculates derived values (like the review-progress percentage)?

        - 

---

## What to bring to class

For each of the 10 demos: your changed code/diagrams/documents (ideally as commits you can show live), and the ticked checkboxes above reflecting what you can genuinely demonstrate and answer *right now*.
