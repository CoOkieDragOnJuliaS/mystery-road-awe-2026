# Exercise 2 — Build Tooling, TypeScript & CI/CD

This is the second exercise in Advanced Web Engineering Course (CSDC). It builds directly on
**Exercise 1**, you need the ES-module split from that exercise finished first, since this exercise migrates those modules to TypeScript and puts them through a real build pipeline.

By the end of this exercise the project will: be managed by a package manager instead of a plain
`<script>` tag, run through Vite for both development and production builds, be written in
TypeScript instead of JavaScript, and be linted, formatted, and deployed automatically by GitHub
Actions whenever code is pushed.

**Out of scope for this exercise** (these come later in the course): migrating to a framework (e.g.
React)

Keep a running note of what you changed and why. As in Exercise 1, **commits are the easiest way to
demonstrate a before/after live**, e.g. "workflow fails here, passes after this commit," or "this
compiled fine in JS, here's the TypeScript error it produces and the fix."

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 7, The Build First Mindset** — PDF pp. 55–57
- **Chapter 8, Dependencies, Package Managers, and Vite** — PDF pp. 58–62
- **Chapter 9, Linting, Formatting, and Asset Processing** — PDF pp. 63–66
- **Chapter 10, TypeScript: Static Types for JavaScript** — PDF pp. 67–78
- **Chapter 11, Continuous Integration and Automated Deployment** — PDF pp. 80–83

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate
or answer on the spot, live.**

| #   | Demo                                              | Ready? |
| --- | ------------------------------------------------- | ------ |
| 1   | Initialize the package manager & project metadata | ☐      |
| 2   | Integrate Vite as the dev server                  | ☐      |
| 3   | Production build & preview                        | ☐      |
| 4   | `package.json` scripts: lint & format             | ☐      |
| 5   | TypeScript setup & first conversions              | ☐      |
| 6   | Typing the domain data                            | ☐      |
| 7   | Full migration & resolving type errors            | ☐      |
| 8   | GitHub Actions: development workflow              | ☐      |
| 9   | GitHub Actions: deployment workflow               | ☐      |
| 10  | Workflow triggers, permissions & failure modes    | ☐      |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked. The table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — Initialize the package manager & project metadata

**Tasks**

- [x] Choose **npm** or **pnpm** and record why you picked it over the other.
      pnpm is a space-efficient package manager and would create a separate copy of each package in symlinks. But because I am working on my laptop and PC on a bigger system I don'T need disk-efficiency. I can wait and the project itself is not that large. It is the more traditional way and I know about it - so. yeah
- [x] Initialize `package.json` for the project (name, version, description, etc. filled in properly).
- [x] Add a `.gitignore` entry for `node_modules` (and any other tool output you generate in later demos, e.g. `dist/`).
- [x] Install one real dependency (you'll add more in later demos) and show the resulting lockfile (`package-lock.json` or `pnpm-lock.yaml`) committed to the repo.

**Questions** (depend on the tasks above)

- [x] What problem does a package manager actually solve that "download the library and put it in a folder yourself" doesn't? Be specific.
      It not only downloads but also resolves the dependencies and lets you see current versions the project needs. Also installation is much more efficient than doing it all by ourselves. I would have to track each dependency version, each compatibility and update everything. But more importantly, everyone if I am in a team, has to have the same information and versions installed - which can lead to huge errors in later versions.

- [x] What's the difference between `dependencies` and `devDependencies` in `package.json`? Which
      category will Vite, your linter/formatter, and TypeScript belong to, and why?
      devDependencies are used while developing - testing dependencies to check if they work with the current structures. Dependencies are then used if the application runs without test mode or build mode.
      Vite and Formatters belong definitely to the devDependencies, because in a deployed state it is not important.
      Important is, if a type appears in a declaration file - then I need to place e.g. TypeScript inside dependencies.

- [x] What is a lockfile for, and what could go wrong for your teammates (or CI) if it weren't
      committed to the repo?

            A lockfile is to state the versions used in the dependencies (z.B: package_lock), also if optional or not.
            Teammates could commit a newer version, without knowing it is in the lock_file and cause breaks in the deployment.

- [ ] If you chose pnpm: what does it do differently from npm regarding how `node_modules` is laid out and how disk space/install time is shared across projects? If you chose npm: what would you gain or lose by switching to pnpm on a larger project?

---

## Demo 2 — Integrate Vite as the dev server

**Tasks**

- [x] Install Vite and configure it for this project (restructure files if needed so Vite can find `index.html`/your modules/the `data/` and `assets/` folders correctly).
      --save-dev for devDependencies as mentioned above. Index.html is in the main folder structure
      Configuration is done in package.json - needing to say dev, build or preview to work with vite

- [x] Get `vite`'s dev server running the app with the same functionality it had before. Verify every view still works, not just that the page loads.
      Run with npm run dev --> to start the dev in package.json
      I clicked through and verified, that it has the same state as after Exercise 1 at least, still with some bugs.

- [x] Trigger Hot Module Replacement at least once: change something in the running app's source and observe the update happen without a full page reload.
      Interestingly - the whole page reloads and starts at the beginning. I had a (maybe) a bug, where it didn't reload the page or show anyting when I try to change it first in Evidence. Only if I changed it to Dashboard, made changes, the changes to Evidence e.g. can be shown after switching.

**Questions** (depend on the tasks above)

- [x] What is the difference between how you used to run this app (a plain static file server) and running it through Vite's dev server? Name at least one thing Vite's dev server does that a plain static server doesn't.

            So much easier to see changes right in this second and also if the error is thrown after every save. Usually you change a lot, save and then if you switch to the browser you see that it breaks. But if you forgot to save in-between because you can't see the browser all the time, you see the break/error, but need to find out where it happened. This can be more efficient in changing something or a behaviour to my liking.

            But, another big difference is, that Vite knows the structure of the project (hence why I needed to have index.html at the start). It understand the imports and reports also import errors during the development.

- [x] What is Hot Module Replacement, and what specifically did you observe happen (and _not_ happen, e.g. to app state) when you triggered it?
      Updating the code in the browser without reloading the whole page myself - it automatically changes and reloads the page to show changes. Nothing happened when changing the styles.css or the .js file when I startet in Evidence - changing to Dashboard helped the HMR-method

- [x] Why does an app already split into ES modules (Exercise 1) integrate naturally with a tool like Vite, compared to the original single-`<script>` version?
      Because we have exports and imports - earlier the single script has no structure and Vite has no information how everything is connected. Vite follows dependencies during dev-state so that's why I can update modules in HMR

---

## Demo 3 — Production build & preview

**Tasks**

- [x] Run the production build (`vite build`) and inspect the generated `dist/` folder.
      The /dist folder is generated with index assets and a index.html file
- [x] Serve that build locally with `vite preview` (not the dev server) and confirm the app still works end-to-end from the built output.
      Well, the vite preview only has a loading element with loading case files, nothing else happens. So it does not work without the dev server. So no, it does not work (error log: Unexpected token '<', "html lang"... is not valid JSON)
      After debugging with console - I found out, that it cannot find the .sjon files because it did not move into the dist folder.
      To prevent this I used a public/ folder which is working with vite as well as npm run dev - so both versions work again (vita ses public as the root for static assets)

- [x] Compare the dev-mode source with the built output for at least one file: note what changed (filenames, size, formatting/minification).
      The biggest difference is the generated .js file in assets/ in /dist folder. Vite combines everything and the .js file was without whitespaces, line breaks and does look awful for everyone who tries to read it. It also uses a hash value for the name of it - easily distinguishable

**Questions** (depend on the tasks above)

- [x] Name at least three concrete transformations Vite applied to your source when building for production (e.g. bundling, minification, hashed filenames. Pick the ones you actually observed).

            First and foremost, it bundled everything into one file and combined everything without whitespaces or spaces in between - having only 2 files
            It uses a hash for its name because of file generation and the name changes with every build

            Vite uses the index.html which is in its folder and uses the generated .js and .css assets instead of the original source files.
            I had to use public static files for the root of dist to use the .json, because the data did not work without it - fetch() change was important

- [x] Why do production filenames typically include a content hash? What problem does that solve for real deployments?

            Laut Internet:
            - Hashed filenames help when a browser caches data. If the name is always the same after every build the internet could use the wrong or deprecated file version. So it reference the new file hash version for changed files - for unchanged files they remain cached which can improve loading time

- [x] Why would you never want to deploy the dev server itself (`vite dev`/`vite`) to real users, even though it "works"?
      It has developer functions - so developer oriented code, functions (like HMR as mentioned before) and error handling.
      It is also for a local environment, which means, it should not be used in a internet web server or production server
      You can use dist folder as a production static server information and serve it when deploying - why? Because you can check the build locally and have a preview to see how it would look like on the production server (also if something is buggy after building it)

---

## Demo 4 — `package.json` scripts: lint & format

**Tasks**

- [x] Install and configure a linter (e.g. ESLint) and a formatter (e.g. Prettier) for this TypeScript/JS project.
      using npm install --save-dev eslint @eslint/js globals prettier eslint: linter engine @eslint/js: standard ESLint rule configurations globals: definitions for browser globals such as window, document, and localStorage -- prettier: formatter
- [x] Add these scripts to `package.json`: `dev`, `build`, `lint`, `lint:fix`, `format`. Each one must actually do something real when run, not just print a placeholder
      I tried to use the eslint.config from the page to set lint, lint:fix and format
      Why eslint .? ESLint would not be clearly told which files or directory to lint and, depending on the version/configuration, may fail or not check what you expect
      --fix because --fix: automatically writes safe corrections into the source files. --> for example if a safe fixable problem is detected eslint can change it

- [x] Run `lint` and show it catching at least one real issue in your code (introduce one on purpose if you have to). Run `lint:fix` and/or `format` and show it actually changing a file.
      ![alt text](/resources/documentation_images/oops_eslintConfig.png) --> needed another .config file --> change to .mjs why? Because mjs treats it as a script that eslint can use. The module syntax is then shown in color and if I would use .js the import and exports could create conflicts with the other exports, even though it is an es module syntax. (CommonJS) --> ES modules or CommonJS

            ![alt text](/resources/documentation_images/eslint_errors.png) A lot of errors with run lint
            I like that fix - it loves to disable vars, which I love!
            ![alt text](/resources/documentation_images/var_change.png)

**Questions** (depend on the tasks above)

- [x] What's the difference between what a linter checks/fixes and what a formatter checks/fixes? Give one concrete finding from each tool on this codebase.
      The linter checks and fixes all the unused variables, vars instead of const/let, information that is code-specific. While the formatter checks everything - from .md files to index.html files to everything (except Exercise 2 to be honest) - It looks for spaces, formatting rules that have not been obeyed, changes to classes, methods and unneeded spaces

            ![alt text](/resources/documentation_images/lint_formatter_difference.png)

            So one looks for code quality, mistakes, code-quality rules - while the other looks for the visual bugs a file can have (spacing, line breaks, etc.)

- [x] Why are `lint` and `lint:fix` two separate scripts instead of one script that always auto-fixes? When would you deliberately want the non-fixing version?
      Sometimes you do not want a software to automatically correct your code, why? Because not every lint error needs to be fixed and not every solution is correct. Non-fixing version is the best to see, before I commit a solution to git, if everything is indeed as it seems, if I forgot a var for example. Fixing it lets me see inside the code. I can also inspect the code with lint before I correct it to see what lint detects.

- [x] What does `npm run lint` (or `pnpm lint`) actually do under the hood? Where does npm/pnpm look for the `lint` command, and would it work if your linter weren't installed as a project dependency (only globally on your machine)?

            npm run lint or :fix is the command I use
            It reads the scripts: element in package.json and runs the code behind it, which is eslint . (or with --fix)
            The eslint runs then the .config file to see which files and rules should be used when looking for .js or .ts files.
            Probably through node_modules the package loads the eslint, which was installed through the dependency.
            I think if eslint is globally available, not in project directory (devDependencies) then the global exe could be available through the OS path. The problem is, that it would fail on another developers computer if the environment variables are not set correctly

---

## Demo 5 — TypeScript setup & first conversions

**Tasks**

- [x] Install TypeScript and add a `tsconfig.json`. Deliberately choose your strictness settings (don't just copy a default blindly) and be ready to justify at least one setting you turned on or left off.

            Information from the default  config online:

            - strict converted TypeScript code receives strong checking.
            - allowJs TypeScript modules may coexist with the unconverted JavaScript.
            - checkJs existing JavaScript is not immediately subjected to strict TypeScript checking.
            - noEmit TypeScript checks types, while Vite remains responsible for producing the build.
            - noUncheckedIndexedAccess indexed array access is treated as potentially undefined.

- [x] Convert 2–3 of your smallest/utility modules from Exercise 1 (e.g. formatting or lookup helpers) from `.js` to `.ts`, with **no `any`**, and get them compiling with zero errors.
      I tried to change the lookupHelper to get the badge to export it to a .ts file to learn TypeScript
      Debugging with lint and knowing helped me, that the information in dashboard and evidenceBasic.js needed help because of the new typescript change
      I also added a new typescript file for the dateFormatter, but had to change a lot after searching for the import of the lookup, where the date was handled

- [x] Wire TypeScript into your `build`/`dev` scripts from Demo 4 so type errors are actually surfaced by your tooling, not just by your editor.
      I changed the package.json to get tsc --noEmit into build and dev to work together with eslint

**Questions** (depend on the tasks above)

- [x] What does the `strict` option in `tsconfig.json` actually turn on? Name at least two individual checks bundled under it, and say whether you kept it on and why.
      //Enables all strict type-checking options, which helps catch potential errors and enforce better coding practices -- e.g. noImpliciAny, NullChecks, etc.
      Which means for example that typescript reports variables that would receive an any type and null as well as undefined could be handled explicitly, so separate.

            I kept it on, because I do not trust myself in TypeScript to know wrong from right right now - needing extra strict help and checks to prevent errors
            One example was the badgeClass --> it had to describe EvidenceStatus (the new) | null and | undefined - it threw an any error
            "Argument of type 'undefined' is not assignable to parameter of type 'EvidenceStatus'."

- [x] What is the difference between a compile-time type error and the runtime bugs you fixed in Exercise 1? Could TypeScript alone have caught any of those specific bugs? Why or why not?
      Compile-time error is detected before the application runs, so as the code compiles - e.g. if I have a type string | null or | undefined in TypeScript and want to call the method with a number, the TypeScript compiler can see that it is no a required format and react!

            A Runtime bug does happen while the application is running - e.g. if I click something and a bug happens which I did not see beforehand.
            TypeScript alone could never have found all those bugs, because a valid Typescript argument cannot see that a property is sending a null result if I click on a button for example - which happened with findEvidenceById or findAllEvidence() - Promises could return nothing, but the TypeScript would not check that.
            So if event listeners are working there TypeScript can help before in compile-time and in debugging, but can never replace runtime-debugging with console and explorative testing

- [x] What does `any` do to TypeScript's checking for a value, and why did you avoid it in this first pass even though it would have been faster to just silence the errors with it?
      ANY - is the type that can be almost anything. It can be another type, any type, be called as a function or passed to a function. It is no safety whatsoever what type is used or how the function is called - I could call a string function with a number - it would probably throw errors along the way, but for TypeScript it is working for the check

            So I avoided it in getStatusBadgeClass, because I want to have the value known to me, like unreviewed, reviewed, flagged and catch errors / variables types known to me,like undefined or null

---

## Demo 6 — Typing the domain data

**Tasks**

- [x] Define TypeScript types/interfaces for the case's data model (evidence, people, locations, timeline events) that match the shape of `data/*.json`.
      I created `types/domain.ts` and used interfaces for `CaseData`, `Evidence`, `Person`, `Location`, and `TimelineEvent`. I used type aliases for restricted values like `PersonId`, `EvidenceStatus`, `EvidenceRelevance`, and `TimelineCertainty`.
      Why domain.ts? --> because I tried to add JSON data and information for TypeScript to get from one specific location. EvidenceStatus inside badgeHelper is the class used by the UI, while the EvidenceStatus in domain.ts describes the value in the domain data --> it is defined in two places, but could be changed to be only in domain.ts (single source of truth)

- [x] Convert your data-loading module to use these types instead of untyped `fetch().json()` results.
      I moved the implementation into `data/api.ts` and added a generic `fetchJson<T>()` helper. The loaders now specify their expected results, for example `fetchJson<CaseData>("data/case.json")`, `fetchJson<Person[]>("data/people.json")`, and `fetchJson<TimelineEvent[]>("data/timeline.json")`.
      `data/api.js` is only a compatibility re-export so older imports still reach the same implementation.

- [x] Pick one field that was genuinely ambiguous or inconsistent in the original JavaScript version (for example: something that could be either an id or a display name, or a date stored in more than one format) and show what modeling it as a proper TypeScript type forced you to decide.
      I picked `Evidence.personIds`. One evidence entry stored `"Nova Byte"` (a display name), while the other records store IDs like `"nova-byte"`. I normalized the JSON to `"nova-byte"` and modelled the field as `PersonId[]`. I also normalized the capitalized `"Reviewed"` and `"Unknown"` values to lowercase so they match `EvidenceStatus` and `EvidenceRelevance`.

**Questions** (depend on the tasks above)

- [x] Walk through the ambiguous field you picked: how did the JavaScript version get away without deciding on one shape, and what did TypeScript force you to commit to?
      JavaScript did not enforce what `personIds` contained. It was only an array of strings, so `"nova-byte"` and `"Nova Byte"` were technically both possible. The old `evidenceMentionsPerson` workaround checked both `person.id` and `person.name`, which let the inconsistent data keep working.

      TypeScript forced me to decide what the field means. Because the property is called `personIds`, I committed to person IDs only and modelled it as `PersonId[]`. After normalizing `"Nova Byte"` to `"nova-byte"`, the helper only needs to check `person.id`. This makes the relationship between `evidence.json` and `people.json` clearer and prevents new code from treating names and IDs as interchangeable.

- [x] Is there a data-shape problem in this app that TypeScript's static types **can't** catch on their own, because the actual bad data would only show up at runtime from a JSON file, not from your code? What would you need in addition to types to catch that?
      Yes. The TypeScript types describe the expected shape, but they do not validate the JSON at runtime. `fetchJson<Evidence[]>("data/evidence.json")` tells the compiler that the result should be evidence objects, but `response.json()` itself still only returns unknown external data.

      A JSON file could still contain a missing field, a number instead of a string, `null` instead of an array, or a `personId` that does not exist in `people.json`. TypeScript cannot compare the data files at runtime.

      To catch this automatically, I would need runtime validation, for example a schema library such as Zod/Valibot, JSON Schema validation, or manually written type guards. A separate cross-reference test could also verify that every evidence, person, location, and timeline ID refers to an existing record.

- [x] What's the difference between an `interface` and a `type` alias for an object shape in TypeScript? Which did you use for your domain models, and does it actually matter here?
      Both can describe object shapes. An interface is focused on objects and can be extended or declaration-merged. A type alias is more flexible because it can also describe unions, primitives, tuples, and template-literal types.

      I used interfaces for the main domain objects (`CaseData`, `Evidence`, `Person`, `Location`, and `TimelineEvent`) because they are records with named fields. I used type aliases for the restricted values and IDs (`PersonId`, `EvidenceStatus`, `EvidenceRelevance`, and `TimelineCertainty`) because they are unions of allowed values. For these simple models, `interface` versus `type` does not matter much technically, but using them this way makes the intent clearer.

---

## Demo 7 — Full migration & resolving type errors across the app

**Tasks**

- [x] Convert the remaining `.js` modules to `.ts`, and get the **entire app** compiling with zero TypeScript errors under the strictness settings from Demo 5.
      I converted the active modules to TypeScript: `app.ts`, `state/globalState.ts`, `navigation/router.ts`, `storage/localStorage.ts`, `utils/dom.ts`, `utils/lookupHelpers.ts`, `utils/setup.ts`, and all six `views/*.ts` files. `index.html` now loads `app.ts`.
      The old `.js` files are only thin compatibility `export *` shims so old imports cannot accidentally use stale duplicate implementations. `npx tsc --noEmit`, `npm run lint`, and `npm run build` all complete without TypeScript or lint errors.

- [x] Find at least 3 real spots where the compiler flagged something you had to actually think about (a union type, a possibly-`undefined` value, an implicit `any`, etc.). For each, decide and record whether it pointed at a real latent bug or was "just" the compiler being pedantic. 1. **DOM elements could be `null`.** `document.getElementById(...)` returns `HTMLElement | null`, but the old code immediately accessed `.value`, `.classList`, or `.innerHTML`. This produced `Object is possibly 'null'`. I added `getElement()` and `getRequiredElement()` in `utils/dom.ts`. For elements that must exist in `index.html`, the required helper fails explicitly; for optional containers, the code keeps the early return. This was partly pedantic because the current HTML contains those elements, but it also makes the dependency on the DOM explicit.

      2. **DOM values are only strings.** `dataset.view`, `dataset.evidenceId`, select `.value`, and `dataset.personId` do not automatically have domain types. TypeScript therefore reported errors when those values were passed to functions expecting `ViewName`, `EvidenceId`, or `PersonId`. I added type guards such as `isViewName`, `isEvidenceId`, `isPersonId`, `isEvidenceStatus`, and `isEvidenceRelevance` instead of casting or using `any`. This exposed that the old JavaScript assumed every DOM attribute had a valid domain value.

      3. **Date subtraction is not typed arithmetic.** The old sort code subtracted `Date` objects directly: `new Date(a.timestamp) - new Date(b.timestamp)`. TypeScript requires numeric operands, so I changed it to `.getTime()`. This was mostly pedantic because JavaScript coerces `Date` objects at runtime, but the typed version documents that the intended operation is comparing timestamps as numbers.

      4. **Indexed access can produce `undefined`.** With `noUncheckedIndexedAccess`, expressions like `allEvidence[i]` and `select.options[i]` are `T | undefined`. I converted many indexed loops to `for...of`, `forEach`, or `Array.from(...)` where that made the code safer and clearer. This was mostly pedantic for the loops with bounds checks, but it removed a whole class of potential undefined errors.

      5. **Two real latent issues were made explicit.** `workspace.ts` needed real imports for `navigateTo` and `openEvidenceDetail`; previously those names were only undefined globals. In `evidenceBasic.ts`, bookmark removal assigned a filtered array to a local variable without updating global state, which is why I now call `state.setBookmarks(...)`. The second issue was shown by linting (`no-useless-assignment`) and the typed state API rather than TypeScript directly.

- [x] Confirm the app still behaves identically to the working JavaScript version — a type-safe app that behaves differently is not a successful migration.
      I kept the app's rendering style, hash routing, localStorage keys, loading behavior, and inline event-handler contract. The only intentional behavior corrections are the bookmark state update and explicit imports for the workspace evidence link. `vite build`, `tsc --noEmit`, and `eslint .` all pass. For final visual confirmation, the five views still need a manual click-through in the browser.

**Questions** (depend on the tasks above)

- [x] Show one specific type error you had to actually think about (not just silence with `any` or the `!` non-null assertion). What did it tell you about your code that plain JS review or testing hadn't?
      A representative error was the equivalent of:

      `Argument of type 'string | undefined' is not assignable to parameter of type 'EvidenceId'`

      It occurred where a `data-open-evidence` or `data-evidence-id` attribute was read from the DOM and passed to `openEvidenceDetail()`. In plain JavaScript, the DOM value was simply assumed to be a valid evidence ID. TypeScript forced me to notice that `dataset` gives `string | undefined`: the attribute could be absent, malformed, or any unrelated string.

      I handled it with `isEvidenceId()` and returned early for invalid values. This is more accurate than an `any` parameter or `dataset.id!`, because neither of those checks what is actually present in the DOM. It showed that the app has a real boundary between trusted domain IDs and untrusted string-valued DOM attributes.

- [x] When (if ever) is reaching for `any` the right call during a migration like this, versus a sign you should model the type properly? Where did you draw that line?
      `any` is useful temporarily when an external API has no declarations or when a migration is blocked and the team needs a working intermediate state. It can also appear inside a carefully isolated adapter, as long as the rest of the application receives a better type afterward.

      I did not use `any` in this migration because the problematic values had knowable domain shapes. `JSON.parse()` and `response.json()` were treated as `unknown`, then narrowed with guards or modelled with explicit interfaces. DOM strings were narrowed with `isEvidenceId`, `isPersonId`, `isViewName`, `isEvidenceStatus`, and `isEvidenceRelevance`. This took more work than writing `any`, but it preserved the benefit of TypeScript instead of hiding the uncertainty.

      I would draw the line like this: `any` is acceptable as a temporary bridge in one small, visible place; it is not acceptable for domain models or frequently used helpers. `unknown` plus a type guard is usually the better boundary type because it still forces validation before the value is used.

- [x] Did the migration reveal anything that was a genuine, previously-unnoticed bug (as opposed to just noise)? If yes, explain it. If no, explain how you're confident it was only noise.
      Yes. The migration exposed two concrete issues:

      1. `workspace.js` called `navigateTo` and `openEvidenceDetail` without importing them. In ES-module/strict scope, that is a real `ReferenceError`, not only a style issue. `workspace.ts` now imports both functions explicitly.

      2. `evidenceBasic.js` removed a bookmark by assigning `bookmarks = bookmarks.filter(...)`. That only replaced the local variable; it did not update `state.getBookmarks()`, so the removed bookmark could still be saved from the stale shared array. The typed state API made the intended mutation boundary clearer, and the TypeScript version now calls `state.setBookmarks(...)`.

      The migration also found noise that was not necessarily a bug: DOM elements that always exist in `index.html` still needed null handling, and valid `Date` coercion needed `.getTime()` because TypeScript does not allow arithmetic between `Date` objects directly. Those checks improve clarity even where the old runtime behavior happened to work.

---

## Demo 8 — GitHub Actions: development workflow

**Tasks**

- [ ] Write a GitHub Actions workflow that triggers on push (and/or pull request), checks out the repo, sets up Node.js at the right version, installs dependencies (with dependency caching), and runs your `lint` and a format-check (e.g. `prettier --check`).
- [ ] Push a commit that deliberately fails lint or format, and show the workflow **failing** in the Actions tab.
- [ ] Fix it and push again, and show the same workflow **passing**.

**Questions** (depend on the tasks above)

- [ ] What is the difference between a workflow, a job, and a step in GitHub Actions? Point to one of each in your workflow file.
      A **workflow** is the complete automation definition stored in `.github/workflows/`, for example `.github/workflows/development.yml`. It defines when GitHub should run the automation through `on:` and which jobs it contains.
      A **job** is a named unit inside `jobs:` that runs on one runner. In the development workflow, the job would be the block that runs on `ubuntu-latest`, checks out the repository, installs Node.js and dependencies, and performs the checks.
      A **step** is one command or action inside that job's `steps:` list. Examples would be `uses: actions/checkout@v...` for checking out the repository, `uses: actions/setup-node@v...` for configuring Node.js, and `run: npm run lint` for executing the linter. The hierarchy is workflow → jobs → steps.

- [ ] Why should lint/format run in CI at all, if it already runs (or could run) on every developer's own machine before they push?
      Local checks are helpful, but CI is the shared source of truth. A developer can forget to run `npm run lint` or `prettier --check`, use a different tool version, have an incomplete local checkout, or push code that only works because of uncommitted files.
      Running the checks in GitHub Actions means every `push` and pull request is checked in a clean environment with the same Node.js version and the same locked dependencies. The result is visible to everyone in the Actions tab and can block a broken pull request before it reaches the main branch. It also creates an auditable run history that can be shown in class.

- [ ] What is dependency caching doing in your workflow, and what would happen (both correctness- and speed-wise) if you removed it?
      Dependency caching stores the npm cache between workflow runs. With `actions/setup-node`, the cache is normally keyed from `package-lock.json`, so a new dependency installation reuses previously downloaded packages when the lock file has not changed.
      Removing it should not normally change correctness because `npm ci` still reads `package-lock.json` and installs the dependency versions recorded there. The difference is speed and network usage: every run would have to download the dependency packages again. If `npm ci` were used without a lock file, that would be a correctness problem, but the project has `package-lock.json`, so the main effect of deleting the cache would be slower and more fragile CI runs.

---

## Demo 9 — GitHub Actions: deployment workflow

**Tasks**

- [ ] Write a second workflow that, on push to your main branch (or another trigger you choose and can justify), checks out the repo, installs dependencies, lints, builds (`vite build`), and deploys the `dist/` output to GitHub Pages (or an equivalent static host).
- [ ] Confirm the deployed URL actually serves the working app end-to-end, not just that the workflow reports success.
- [ ] Make a real change, push it, and show it going live via the workflow without any manual deployment step.

**Questions** (depend on the tasks above)

- [ ] Why does the deploy workflow re-run lint and build itself, instead of trusting "it already passed on my machine" or reusing Demo 8's workflow's result directly?
      Deployment is the workflow that publishes real output, so it must verify the exact commit it is about to deploy. A green development workflow on an earlier commit does not prove that the current commit is valid, and GitHub Actions does not automatically hand a passing result or a build artifact from one workflow run to another unrelated deployment run.
      Re-running `npm run lint` and `npm run build` also protects against differences between local machines, missing files, stale `node_modules`, or a manual push that bypassed the pull-request checks. Most importantly, `vite build` creates the `dist/` directory that the deploy step publishes, so the build has to happen inside the deploy workflow anyway.

- [ ] What is the actual mechanism your deploy workflow uses to publish to GitHub Pages (e.g. a dedicated deploy action publishing an artifact, pushing to a `gh-pages` branch, or something else)? Explain, concretely, what it does.
      The intended mechanism is GitHub's official Pages deployment flow with `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`. After `npm run build`, the workflow packages the generated `dist/` directory as a Pages artifact. `actions/upload-pages-artifact` uploads that directory as the site content, and `actions/deploy-pages` publishes the uploaded artifact to the repository's GitHub Pages environment.
      This is different from pushing the generated files to a `gh-pages` branch. The deploy action publishes the artifact through GitHub Pages' deployment API, while the repository itself only needs the workflow file and source code. GitHub Pages also needs to be configured in the repository settings to use **GitHub Actions** as its source.

- [ ] What would you need to change in this workflow if you were deploying to a different static host instead (e.g. Netlify, Vercel, a plain server over SFTP)? What would stay the same?
      The beginning of the workflow would stay almost identical: trigger on the chosen branch, check out the repository, install Node.js, run `npm ci`, run lint/format/type checks, and run `npm run build` to produce `dist/`.
      Only the publication part would change. For Netlify or Vercel, the final steps would use the provider's CLI or a dedicated action and provider-specific secrets such as an API token and site/project ID. For SFTP, the workflow would upload the contents of `dist/` with an SSH/SFTP action or command and would need secrets for the host, username, key/password, and target directory. The build output remains the same, but the credentials, destination, and deploy command are host-specific.

---

## Demo 10 — Workflow triggers, permissions & failure modes

**Tasks**

- [ ] Deliberately commit a real TypeScript error (or a lint failure) that should block deployment, push it, and show the deploy workflow failing _before_ it reaches the deploy step.
- [ ] Identify exactly what permissions and/or secrets your deploy workflow needs to publish to GitHub Pages, and show where they're configured (repository settings, the `permissions:` key in the workflow file, etc.).
- [ ] Open the run history for both workflows and be ready to read a failed run's logs live and explain, to someone unfamiliar with it, what failed and why.

**Questions** (depend on the tasks above)

- [ ] When your build step fails, does the previously-deployed version of the app stay live, get taken down, or something else? Is that the behavior you want, and why?
      With GitHub Pages, a failed build normally leaves the previously deployed version live. The workflow stops before `actions/deploy-pages`, so no new artifact is uploaded or published. GitHub Pages does not take the old site down just because a newer commit failed to build.
      That is the desired behavior for this project: a broken commit should not deploy, but it also should not remove the last working version. The failed workflow run still makes the problem visible, so the broken commit can be fixed and pushed again.

- [ ] What GitHub Actions permission(s) or secret(s) does your deploy workflow actually need, and where did you grant/store them? What's the security risk of over-granting permissions here?
      For the official `actions/deploy-pages` mechanism, the deploy job needs a small `permissions:` block such as `contents: read`, `pages: write`, and `id-token: write`. `contents: read` lets the job read the repository checkout, `pages: write` lets it create the Pages deployment, and `id-token: write` lets GitHub issue the OIDC token used by the Pages deployment flow. GitHub Pages must also be configured in the repository's **Settings → Pages** area to use GitHub Actions.
      No long-lived personal access token is needed for that approach; the workflow uses the short-lived `GITHUB_TOKEN` and the OIDC identity. Over-granting permissions such as `contents: write`, broad `actions` permissions, or storing a powerful personal token as a secret would increase the damage a compromised workflow or dependency could do. With write access to the repository or other resources, malicious workflow code could modify code, releases, or deployments rather than only publishing the current site.

- [ ] What's the difference between triggering a workflow `on: push`, `on: pull_request`, and `on: workflow_dispatch`? Which did you use for the development workflow (Demo 8) and which for the deployment workflow (Demo 9), and why is that pairing the right one?
      `on: push` runs after commits are pushed to the selected branches. `on: pull_request` runs when a pull request is opened or updated, so it checks the proposed merge result before the code reaches the main branch. `on: workflow_dispatch` adds a manual **Run workflow** button, which is useful for demonstrations or a controlled redeploy.
      The development workflow should run on `push` and `pull_request` so both direct commits and proposed changes are checked before they are relied on. The deployment workflow should run on `push` to `main`, optionally with `workflow_dispatch` for a manual redeploy. This pairing is appropriate because pull requests get feedback before merge, while only the accepted `main` branch is published automatically.

---

## What to bring to class

For each of the 10 demos: your changed code/config (ideally as commits you can diff live), the actual GitHub Actions run history for both workflows (not just the files), and the ticked checkboxes
above reflecting what you can genuinely demonstrate and answer _right now_. Be ready to trigger a real workflow run live (e.g. via a small commit) on request, not just describe
one that ran earlier.
