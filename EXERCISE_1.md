# Exercise 1 — Refactoring the App

This is the first exercise in Advanced Web Engineering Course (CSDC). You will **not add any new
features** in this exercise. The goal is to make the existing application correct and more
maintainable, understand advanced JavaScript topics, and get comfortable with your browser's
developer tools along the way.

**Out of scope for this exercise** (these come later in the course): migrating to TypeScript,
introducing a build tool, splitting into a full separation-of-concerns architecture beyond plain
modules, parallelizing/optimizing the async data loading, and any framework migration. If you
notice things related to those topics while you work, write them down (you'll come back to them).

Keep a running note of what you changed and why (a `CHANGES.md`, or commit messages, your choice!).
Several theory questions ask you to explain a specific change you made, and for bug fixes, **using
real commits is the easiest way to show a before/after live in class**. E.g. commit the reproduction
state (or just note the commit hash before your fix) so you can diff it against your fix on demand.

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class. Every task and every question has its own checkbox — you can't answer a
question convincingly without having actually done its task first.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are
able to present in the Moodle course. **Before class, go through and tick only what you can
genuinely demonstrate or answer on the spot, live.** An unticked box is fine, but remember that you
need to at least tick ~70% of tasks on all exercises for a positive course grade. "I fixed it" is
not enough for any bug-related item: you need to be able to explain *why* it was broken and *why*
your fix works.

| # | Demo | Ready? |
|---|---|---|
| 1 | Split the app into JS modules | x |
| 2 | Bug hunt — mutation/reference bug | ☐ |
| 3 | Bug hunt — an asynchronous/Promise-handling bug | ☐ |
| 4 | Bug hunt — silent (console-only) bug | ☐ |
| 5 | Bug hunt — full walkthrough & reflection | ☐ |
| 6 | Use the JavaScript debugger | ☐ |
| 7 | DevTools tour (Console/Network/Application/Elements) | ☐ |
| 8 | Clean coding: globals, `var`/`let`/`const`, code smells | ☐ |
| 9 | Refactor nested Promises to `async`/`await` | ☐ |
| 10 | Refactor to arrow functions | ☐ |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked — the table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — Split the app into JS modules

`app.js` is currently one file, well over a thousand lines, mixing data loading, global state,
rendering for every view, event handling, and utility functions. Split it into multiple files using
native ES modules (`import`/`export`). No bundler, no build step, just modules the browser loads
directly.

**Tasks**

- [x] Design a module boundary you can justify, and implement it (e.g. data loading, shared state,
      one module per view's rendering, `localStorage` helpers, small formatting/lookup utilities,
      and an entry-point module that wires up navigation and event listeners on startup).
- [x] Update `index.html` to load your entry point with `<script type="module" src="...">` instead
      of the current plain `<script src="app.js">`.
- [x] Do this as a **pure refactor first**: the app must behave identically before and after (bugs
      and all — you are not fixing anything yet in this demo). Re-run the app after every few
      changes and confirm nothing new broke.
- [x] Decide deliberately, function by function, what needs to be exported and what can stay
      private to its module. Not everything needs to be public.

**Questions** (depend on the tasks above)

- [x] What is the difference between a classic `<script>` and a `<script type="module">`? Name at
      least two behavioral differences that are relevant to this app.
      
      > The top-level variables have been var and function declarations become properties of window. Each module has its own scope, so the window declarations inline "onclick" from index.html do not work anymore. Bugfix needed in Demo 2, where the views are really clickable, by being exported or attached to window
      > Namely error:
      >index.html:29 Uncaught ReferenceError: navigateTo is not defined
      >     at HTMLButtonElement.onclick (index.html:29:99)
      >     setup.js:14 Uncaught TypeError: Cannot read properties of undefined (reading 'getAttribute')
      >     at HTMLButtonElement.<anonymous> (setup.js:14:38)

      ![alt text](/resources/documentation_images/error_window_reference.png)

      > By having modules they act with "strict-mode". Meaning, that (like inn DevTool), a typ like missing an l in localStorage.js throws an ReferenceError at the line where it is thrown. No global variables, rather exporting functions and importing function/variables from other modules.

- [x] Before your refactor, `allEvidence` was a global `var`, readable and writable from anywhere in
      `app.js`. After splitting into modules, what has to happen for a different module to read or
      change that value? What error do you get if you forget, and why is that error actually
      useful?

      > What needs to happen is something like in Java - a private, mutable variable that can only be accessed via exported functions to manipulate (or not) the actual element. Getter/Setter behaviour to read and change the value. If I forget, which I did - or because I wrote the name wrong - the error tells me that there is no 
      > I would get a TypeError if I try to assign a value to a variable that is not exported correctly or if I forgot the setter

- [x] What's the difference between a named export and a default export? Point to one place in your
      refactor where you chose one over the other, and explain why.

      > A named export is usually the preference in my view - just because it makes refactoring safer and I can identify where and what I really use and where it comes from.
      > It is imported with the same name inside the braces, e.g. renderDashboard(), which I can import with the given name and use accordingly

      > A default export can be imported with any name I choose, for example a module can have only one default export, which could be an object of the method collection
      > But the problem is, that if I want to export many functions I don't have the named functions that the IDE can help me out with and have to navigate in between the modules to find out what I am looking for

- [x] Why won't `type="module"` scripts run at all if you open `index.html` directly from disk
      (`file://...`) instead of through a local HTTP server? (You already need a server for
      `fetch()` — is this the same reason, a different one, or both?)

      > As stated in the exercise itself, many web APIs cannot operate, because there is no real origin when it comes to file://
      > The browser cannot resolve or fetch the URL e.g. if you want to import specific .js against a document URL
      > http://localhost is at least needed for modules and the JSON fetch to work

---

## Demo 2 — Bug hunt: a mutation/reference bug

The app has several independent defects hidden across its views. Find them the way you would on a real project: by using the app thoroughly,
reading error output, debugging and reasoning about the code once you have a reproducible symptom.

For this demo specifically, find and fix a bug where an array or object gets changed in a place
that surprises you (something is mutated that shouldn't have been, or two things that were supposed
to be independent turn out to be linked).

**Tasks**

- [ ] Reproduce the bug reliably and write down the exact steps.
- [ ] Form a hypothesis for the root cause and confirm it (not just patch the symptom).
- [ ] Fix it, and verify the fix doesn't break anything else nearby.

**Questions** (depend on the task above)

- [ ] Explain — in your own words — the difference between a *reference* and a *copy* in
      JavaScript, and how that distinction explains what you observed.
- [ ] Walk through the exact user actions and system state that trigger the bug. Could you have
      found it by reading the code top-to-bottom without running it? Why or why not?

---

## Demo 3 — Bug hunt: an asynchronous/Promise-handling bug

Find and fix a bug caused by how the app handles a Promise-based operation — for example,
something that should update once an async operation finishes but doesn't, or state that gets
checked before (or without ever) being properly set by an async callback. This does not have to be
flaky or timing-sensitive to reproduce. The point is that you can't explain the root cause without talking about
*when*, relative to a Promise/callback, something did or didn't happen.

**Tasks**

- [ ] Reproduce the bug reliably and write down the exact steps.
- [ ] Form a hypothesis for the root cause, expressed in terms of the async operation involved (what
      was supposed to happen once it resolved, and what actually happened instead), and confirm it.
- [ ] Fix it, and verify the fix actually addresses the async handling rather than papering over the
      symptom (e.g. don't just add a delay or a retry if the real issue is a missing state update).

**Questions** (depend on the task above)

- [ ] Explain the async operation this bug revolves around: what does it fetch/return, and at what
      point in its lifecycle (before it starts, while pending, on success, on failure) does the bug
      actually happen? How did you confirm that, rather than just guessing?

---

## Demo 4 — Bug hunt: a silent bug

Open DevTools *before* you start clicking around, and keep the Console tab visible for your entire
testing session. Find a bug that produces **no visible change in the UI** — only console output
(an error, a warning, or an unexpected logged value).

**Tasks**

- [ ] Reproduce the bug and capture the exact console output.
- [ ] Trace it back to the line(s) of code responsible.
- [ ] Fix it, and confirm the console is clean for that scenario afterward.

**Questions** (depend on the task above)

- [ ] How did you notice this bug in the first place, given that nothing looked broken? Why is
      "nothing looks broken" not the same as "nothing is broken"?


---

## Demo 5 — Bug hunt: full walkthrough & reflection

Use every feature, in every view, more than once. Dashboard stats, evidence search/filter/sort/
bookmark/detail/notes, people & locations tabs and their cross-links, timeline sorting/filtering/
evidence links, and the workspace (bookmarks list, notes, hypothesis form — including reloading the
page afterward to check what persisted). Try things a "well-behaved" user wouldn't, eg click buttons
rapidly, type quickly and delete what you typed, navigate away mid-action, reload at odd times,
resize the window, inspect and hand-edit `localStorage` in DevTools, leave a field empty, select the
same filter twice. Keep going past Demos 2–4 — this app does not have only three bugs.

**Tasks**

- [x] For every bug you find (beyond the three already covered), write down: reproduction steps,
      expected vs. actual behavior, root cause, the fix, and how you verified it.
- [x] Pick one bug from your full list (any of them, including Demos 2–4) and prepare to show it
      live: the broken behavior, then your fix. **Commit the pre-fix state (or note its commit
      hash) so you can diff broken vs. fixed on demand in class.**

**Questions** (depend on the tasks above)

- [ ] For the bug you chose to present: walk through the exact user actions and system state that
      trigger it, live, starting from the pre-fix commit.
- [ ] Across all the bugs you found, did fixing one ever change the symptoms of, reveal, or
      accidentally fix another? If so, explain the relationship. If not, how did you confirm your
      fixes were properly isolated from each other?

---

## Demo 6 — Use the JavaScript debugger

`console.log` is a debugging tool, not *the* debugging tool. This demo is about using the browser's
actual debugger or a VS Code extension for debugging — ideally on one of the bugs from Demos 2–5.

**Tasks**

- [ ] Set at least one real breakpoint (not a `console.log`) inside a function connected to a bug
      you investigated, and step through it line by line.
- [ ] Use "Step over", "Step into", and "Step out" at least once each, on purpose, and notice the
      difference.
- [ ] While paused at a breakpoint, open the Call Stack panel and explain, for a real example, "who
      called this function, and with what."
- [ ] Use a **conditional breakpoint** or a **logpoint** at least once (e.g. only break when a loop
      variable equals a specific value, or a specific ID is being processed).
- [ ] While paused, use the Scope/Watch panel (or hover over variables) to track a value across
      several steps of execution, and edit a variable's value live to test a hypothesis before
      writing the actual code change.

**Questions** (depend on the tasks above)

- [ ] What's the difference between "Step over" and "Step into"? Give a concrete example from this
      app where using the wrong one would waste your time.

      > Step over executes the breakpoint function without entering it - Step into steps right "into" the function and pauses at the first line. I debugged for example the loading and could step into the loading functions of api.js
      > You could easily waste time if you step into everything and go for example into functions that are basic functions of JavaScript, which can be time-consuming and not necessary. Watching the variables, debug call stack can help more than that

- [ ] What is the call stack, and how did reading it help you figure out where a value came from or
      why a function ran when it did?

      > The call stack shows hot the breakpoint is reached, for example called by the function above or by app.js. It helped immensely when I tried to see which was called beforehand after the evidence where not shown when reloading the pages

- [ ] What is a conditional breakpoint, and why is it more efficient than repeatedly hitting
      "resume" to reach the case you care about?

      > conditional --> what if's can be used if you want to set maybe a trigger to see a breakpoint only if a certain area is null or a value you want to expect is really going through the stages and breakpoints as expected

- [ ] What's the difference between a breakpoint you set in the DevTools UI and a `debugger;`
      statement written directly in the source code? When would you prefer one over the other?

      > A debugger statement can be used for specific and long-winding testing throughout big applications - also interesting to use it together with a logger.
      > UI debugging or debugging through clicking and setting the breakpoints is easier to find a certain area - because debugger lines can become "lost" if you forget about them. Sometimes the same with debugging and logging in Java


- [ ] Describe a moment where `console.log` alone would *not* have been enough to find a bug, but
      stepping through with the debugger was. What did the debugger show you that logging couldn't?

      > The console and the Network tab of the DevTool did not show at all why the evidence wasn't loading in correctly or why there was a 0 at the people.
      > Pending did only show for an insignificant amount of time when I set it to e.g. 3G, BUT the debugging shows when and how a method or a loading zone was called - which was more significant for this demo bug. Was searching for a loong time beforehand.. I am not that good with JavaScript 

---

## Demo 7 — DevTools tour: Console, Network, Application, Elements

A guided tour, so you know where things live before you need them.

**Tasks**

- [x] **Console:** filter down to only errors, then only warnings, using the log-level filter. Use
      the text filter box to search for one specific message. Try "Preserve log" and explain what
      it changes.
- [x] **Network:** reload with the Network tab open, find the requests for the app's JSON data
      files, and for one request inspect its status code, response body, and timing. Throttle the
      connection (e.g. "Slow 3G") and reload.
- [x] **Application** (Chrome) / **Storage** (Firefox): find this app's `localStorage` entries,
      inspect their values, edit one directly in DevTools, and reload to see the effect. Replace a
      value with text that isn't valid JSON and see what happens.
- [x] **Elements:** inspect a rendered evidence card or person card in the DOM, and connect what you
      see there back to the code that generated it.

**Questions** (depend on the tasks above)

- [x] What's the practical difference between `console.log`, `console.warn`, and `console.error`,
      beyond just the color?

      > It can be filtered, which makes it waaaay easier if you want to see it in the console of the DevTool during runtime. Logs can often be ignored and the console can fill up quickly if you don't "split" it

- [ ] Using the Network tab, explain what "Status," "Type," and "Time" tell you about one of the
      app's `fetch()` requests. If that request returned a 404 instead of a 200, how would the app
      currently react?

      > Status is e.g. success or failing - type tells you for example if it is a fetch request (which it did a lot) and time shows the duration how long it took, which is interesting to see if you put in 3G.
      > 404 is bad - so the web page would log an error and if not caught the web page could be "broken", unusable

- [ ] List this app's `localStorage` keys and what each one is for. What happens if you manually
      corrupt one of them and reload — and *why* does that happen, according to the code that reads
      it back out?

      > remotion_bookmarks and remotion_notes and remotion_hypothesis are the only ones there is, but I didn't use or see bookmarks, only notes and hypothesis, because I edited them
      > Bookmark, as I can see in the code, are for the bookmarks if set and there is a try catch already there, even before I put in a try catch afterwards through a demo, so nothing would happen - you wouldn't see the bookmarks
      > Invalid notes threw an error /the site was endlessly loading because I didn'T put in a try catch until later - so there would be an error logged and shown - same with the hypothesis
      > which i didn't fix (as I am seeing now)
      The JSON.parse() throws the error if the JSON is invalid, e.g. with a typo

- [ ] After throttling your network and reloading, what did you observe about which parts of the UI
      populate first, last, or briefly show wrong/empty values? Why does the order matter here?

      > The network tab and reloading briefly shows the different stages of loading - but I couldn't see it clearly without the debugger, because my internet, even with 3G, was too fast for the human eye to see a slower "Pending" status

---

## Demo 8 — Clean coding: globals, `var`/`let`/`const`, code smells

**Tasks**

- [x] List every top-level `var` at the top of the original `app.js`. For at least three of them,
      explain what could go wrong if two unrelated pieces of code both tried to use a variable with
      that name — and how your module split from Demo 1 already prevents (or doesn't yet prevent)
      that.
- [x] Go through the codebase and replace `var` with `const` or `let` everywhere it's declared,
      deciding `const` vs. `let` deliberately for each one.
- [x] Identify at least two more "code smells" anywhere in the app, beyond the globals above. Fix
      them, and explain why they were bad and how your fix addresses that.

**Questions** (depend on the tasks above)

- [x] What is the difference between `var`, `let`, and `const` in terms of scope and reassignment?
      Give a concrete example — from this codebase or a hypothetical grounded in a pattern you saw
      — of a bug that `var`'s scoping rules make *possible* and `let` would prevent.

      > var = can be redeclared, but is function scoped
      > let = you can mutate over it, so reassign the value or replace it whole
      > const = does not let you replace/reassign values --> constant value (except arrays and objects / inner)

      > One example is in the old_app.js I would say. The navigation loop has callbacks with eventListeners that share the same variable i. With var, which is function scoped, the index changes according to the whole function
      - if changed to let it has another binding for each go through and has a index that is more reliable?

- [x] What is an "accidental global," and how does non-strict-mode JavaScript allow it to happen by
      simply forgetting a keyword? Now that your code runs as ES modules (which are always strict
      mode), what happens instead if you make that same mistake?

      > Without modules, the accidental global is e.g. created if I assign something without declaring it. Would not throw an error (e.g. evidence assigning a value?)
      > Because of the modules & the strict-mode an ReferenceError is thrown (which is what happened aaa looot in bugfixing the split)


- [x] "The code technically works" and "the code is clean" are not the same bar. Give one concrete
      example from this app of something that worked correctly but was still worth refactoring —
      and explain what real cost the messy version has (bug risk, onboarding time, review
      difficulty...).

      > inline onclick() handlers. Using JavaScript + inline HTML click-handlers is frown upon. Same when coding e.g. in JSF
      > I had errors with window, because it worked before the module split - afterwards I had to change to accomodate the html inline code with assigning the methods to the window handlers
      > Refactored because of Demo 8

      - using the data-view, which already exists through the router.js - only needing to import to setup.js for the router

---

## Demo 9 — Refactor nested Promises to `async`/`await`

**Tasks**

- [x] Find the most deeply nested chain of `.then()` calls in the data-loading code. Before
      touching it, sketch/describe its shape (how many levels deep, and what has to succeed before
      the next level even starts).

- [x] Rewrite it as an `async` function using `await`, preserving its exact current behavior —
      **including** that it currently loads its requests one after another rather than in parallel
      (don't fix that yet, that's a later exercise).

- [x] Do the same conversion for at least one more place in the app that currently uses
      `.then()`/`.catch()`/`.finally()`, making sure any error handling the original had is still
      present.
- [x] Verify with the debugger (a breakpoint inside your new `async` function, stepping through with
      the Call Stack panel open) that the order of operations is unchanged from before your
      refactor.

**Questions** (depend on the tasks above)

- [ ] Explain, in your own words, why the nested `.then()` chain you sketched is harder to reason
      about than the `async`/`await` version — even though they run identically.


      > It is very difficult to read. If I write is exactly like now (which is slower, but readable), I understand what is happening and what comes after what. While as in those nested .then() calls I had to analyze first what stacks are inside those and what is called afterwards.

- [ ] What does the `await` keyword actually do to the execution of the `async` function it's
      inside? What is the rest of the *program* doing while that function is "waiting"?

      > Await is duh, waiting, but for the function to work through - so until the Promise (which is underlying of the function) is finished and the processing of those other async functions can happen

      > The rest of the program tries to wait, sequentially, for a trigger - like the trigger that a Promise is done from one async function and then can work again

- [ ] An `async` function always returns a Promise, even if the code inside it does
      `return someValue;` for a plain value. Prove you understand this: what do you get if you call
      `.then()` on the result of your refactored function, and log it?

      > If I call .then() on the function right now nothing would happen as I understand it - or at least it would not get a return value - beforehand the export had return functions inside of it. But now, there are only await calls inside an async function - without any "return someValue" behind it. 

      > I think if I would log it it would either come as null or undefined, because there is nothing for .then() to process

- [ ] What is the `async`/`await` equivalent of a `.catch()`? What happens at runtime if you forget
      it and the `await`ed operation rejects?

      > A simple try catch condition in JavaScript. The IDE itself automatically wants an try catch if you change the export to export async function - probably am error without it, because a .catch() catches errors

- [ ] Is `async`/`await` code *faster* than the equivalent `.then()` chain? Explain precisely what
      does and doesn't change about execution when you do this kind of refactor.

      > The execution is the same from the order and the movement
      > It should't be faster, because I am still working in sequential order, as ordered in the Demo

- [ ] Deliberately break your own refactor by removing one `await` you just added (leaving the
      function still `async`). What breaks, and how does that relate to a category of bug you may
      have already dealt with in Demos 2–5 (a Promise being treated as if it were already-resolved
      data)?

      > Ahh.. I see, the variable itself is only a Promise and will be logged as such - like the note in the console.log from an earlier demo
      > Instead of the actual variable data I want

---

## Demo 10 — Refactor to arrow functions

**Tasks**

- [ ] Choose at least two functions currently written as `function name(...) { ... }` or
      `function(...) { ... }`, and rewrite them as arrow functions — pick ones that are actually
      good candidates.
- [ ] Convert at least one anonymous `function(e) { ... }` callback passed to `addEventListener`
      into an arrow function.
- [ ] Identify **one** function you deliberately did *not* convert (or would refuse to, if asked),
      and be ready to explain why it would be unsafe or incorrect as an arrow function.

**Questions** (depend on the tasks above)

- [ ] What is different about how arrow functions handle `this` compared to regular functions? Why
      does that make arrow functions risky as object methods, but often preferable as callbacks?
- [ ] Arrow functions can't be used as constructors (no `new`) and have no `arguments` object of
      their own. Did either limitation affect which functions you were able to convert? Which one,
      and how?
- [ ] Function declarations (`function foo() {}`) are hoisted, so you can call them before they
      appear later in the file; a `const`/`let` arrow function is not. Did this matter anywhere in
      your refactor? Explain why or why not.
- [ ] Show a concrete before/after of one function you converted. Is there any behavioral difference
      at runtime, or is this purely a readability/style change? Justify your answer.
- [ ] This codebase mixes function declarations, function expressions, and (after this exercise)
      arrow functions, with no single consistent rule. Propose one rule your team could adopt for
      "when do we use which," and justify it.

---

## What to bring to class

For each of the 10 demos: your changed code (ideally as commits you can diff live), and the ticked
checkboxes above reflecting what you can genuinely demonstrate and answer *right now*. Be ready to
open DevTools live on request, not just describe what you did.
