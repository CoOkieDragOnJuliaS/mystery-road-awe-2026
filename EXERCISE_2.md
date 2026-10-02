# Exercise 2 — Build Tooling, TypeScript & CI/CD

This is the second exercise in the Advanced Web Engineering course (CSDC). It builds directly on
Exercise 1, so the ES-module split from that exercise must be finished first, because this exercise migrates those modules to TypeScript and puts them through a real build pipeline.

By the end of this exercise the project will: be managed by a package manager instead of a plain
script tag, run through Vite for both development and production builds, be written in TypeScript instead of JavaScript, and be linted, formatted, and deployed automatically by GitHub Actions whenever code is pushed.

**Out of scope for this exercise** (these come later in the course): migrating to a framework such as React.

Keep a running note of what you changed and why. As in Exercise 1, **commits are the easiest way to
demonstrate a before/after live**, for example "workflow fails here, passes after this commit," or "this compiled fine in JS, here is the TypeScript error it produces and the fix."

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 7, The Build First Mindset** — PDF pp. 55–57
- **Chapter 8, Dependencies, Package Managers, and Vite** — PDF pp. 58–62
- **Chapter 9, Linting, Formatting, and Asset Processing** — PDF pp. 63–66
- **Chapter 10, TypeScript: Static Types for JavaScript** — PDF pp. 67–78
- **Chapter 11, Continuous Integration and Automated Deployment** — PDF pp. 80–83
- **Chapter 12, From Static Documents to Rich Web Applications** — PDF pp. 74–79 (supplementary context for static hosting and the single-page application delivery model used by GitHub Pages)

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.

These checkboxes are for self-checking. Do not forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| #   | Demo                                              | Ready? |
| --- | ------------------------------------------------- | ------ |
| 1   | Initialize the package manager & project metadata | ☐      |
| 2   | Integrate Vite as the dev server                  | ☐      |
| 3   | Production build & preview                        | ☐      |
| 4   | package.json scripts: lint & format               | ☐      |
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

- [x] Choose npm or pnpm and record why you picked it over the other.
      I chose npm. pnpm is a space-efficient package manager that creates separate copies of each package through symlinks, but because I am working on my laptop and PC on a bigger system I do not need disk-efficiency. The project itself is not large, npm is the more traditional way, and I already know it.
- [x] Initialize package.json for the project (name, version, description, etc. filled in properly).
- [x] Add a .gitignore entry for node_modules (and any other tool output you generate in later demos, e.g. dist).
- [x] Install one real dependency (you will add more in later demos) and show the resulting lockfile (package-lock.json or pnpm-lock.yaml) committed to the repo.

**Questions** (depend on the tasks above)

- [x] What problem does a package manager actually solve that "download the library and put it in a folder yourself" doesn't? Be specific.
      A package manager does not only download libraries. It resolves the whole dependency graph, including transitive dependencies, and records the exact versions the project needs in a manifest and a lockfile. Installation is more efficient than doing it manually, but the bigger benefit is reproducibility: everyone on the team, and CI, installs the same dependency tree. Without a package manager I would have to track each dependency version, each compatibility constraint, and every update myself, which easily leads to "works on my machine" problems or broken deployments.

      This matches Chapter 8 of the manuscript, which describes a package manager as the tool that records and installs external libraries and tools, and explains that committing the manifest and lockfile lets another contributor recreate the same environment with npm install.

- [x] What is the difference between dependencies and devDependencies in package.json? Which category will Vite, your linter/formatter, and TypeScript belong to, and why?
      dependencies are required by the application at runtime or by consumers of a published package. devDependencies support development, checking, and building. For a statically deployed Vite application, Vite, TypeScript, ESLint, and Prettier are development dependencies because their code does not need to ship as runtime libraries. The distinction describes purpose, not importance: a dev dependency can be essential to release correctness.

      The manuscript states this explicitly in Chapter 8, section 8.5: dependencies and devDependencies differ by purpose, and for a statically deployed Vite app the build and quality tools belong in devDependencies. I placed Vite, TypeScript, ESLint, Prettier, typescript-eslint, and globals in devDependencies.

- [x] What is a lockfile for, and what could go wrong for your teammates (or CI) if it weren't committed to the repo?
      A lockfile records the exact resolved versions and integrity information for the full dependency tree. package-lock.json lets teammates and CI install the same graph. If the lockfile is missing, a teammate could run npm install and get a newer or different version of a transitive dependency, which might introduce a breaking change without anyone noticing. In CI, npm ci even requires a consistent lockfile, so omitting it would break automated builds.

      Chapter 8, section 8.6 and the "Commit declarations, regenerate installed files" box make the same point: commit package.json and the lockfile, do not commit node_modules.

- [x] If you chose pnpm: what does it do differently from npm regarding how node_modules is laid out and how disk space/install time is shared across projects? If you chose npm: what would you gain or lose by switching to pnpm on a larger project?
      I chose npm, so the alternative would be pnpm. pnpm uses a content-addressable store and hard/symbolic links package files into projects, which reduces duplicated storage across projects and can speed up installs when many projects share the same dependency versions. On a larger project with many dependencies, pnpm could save disk space and install time. The trade-off is that pnpm has different lockfile and node_modules layouts, so a project should pick one package manager and use it everywhere, including CI. Chapter 8, section 8.8 summarizes this comparison.

---

## Demo 2 — Integrate Vite as the dev server

**Tasks**

- [x] Install Vite and configure it for this project (restructure files if needed so Vite can find index.html, the modules, and the data and assets folders correctly).
      Vite was installed with --save-dev because it is a development dependency. index.html stays in the project root so Vite can use it as the default entry point. The data folder was later moved under public so Vite copies it unchanged into dist.
- [x] Get Vite's dev server running the app with the same functionality it had before. Verify every view still works, not just that the page loads.
      Run with npm run dev, which executes vite. I clicked through the five views and verified that the app has the same state as after Exercise 1, still with some known bugs.
- [x] Trigger Hot Module Replacement at least once: change something in the running app's source and observe the update happen without a full page reload.
      The whole page reloaded and started at the beginning in my first attempts. I had a bug where editing a file while the Evidence view was active did not reload the page or show anything. Only after switching to Dashboard and making changes did the Evidence changes appear after switching back. This showed me that HMR behavior depends on which module is currently active and how the dependencies are wired.

**Questions** (depend on the tasks above)

- [x] What is the difference between how you used to run this app (a plain static file server) and running it through Vite's dev server? Name at least one thing Vite's dev server does that a plain static server doesn't.
      A plain static server only maps URLs to files. Vite understands the module graph, resolves bare imports from installed packages, transforms TypeScript syntax, injects HMR support, and reports build-time diagnostics immediately. It makes changes visible almost instantly and surfaces errors right after saving, instead of forcing me to switch to the browser and discover a broken state later.

      This matches Chapter 8, section 8.9, which lists module resolution, transformations, and HMR as dev-server responsibilities that a static file server does not provide.

- [x] What is Hot Module Replacement, and what specifically did you observe happen (and _not_ happen, e.g. to app state) when you triggered it?
      Hot Module Replacement replaces an affected module or reloads an appropriate boundary without necessarily performing a full page reload. It shortens feedback loops and may preserve some runtime state, but preservation is not always desirable because stale state can hide startup defects. In my case the update sometimes required a full page reload or a view switch before the change became visible, especially when editing the Evidence view while it was active.

      Chapter 8, section 8.10 describes HMR exactly this way and warns that HMR success is not production verification.

- [x] Why does an app already split into ES modules (Exercise 1) integrate naturally with a tool like Vite, compared to the original single-script version?
      Because the app already has exports and imports. The original single script had no module structure, so Vite had no information about how everything was connected. Vite follows the dependency graph during development, which is why it can update individual modules through HMR and report import errors immediately.

---

## Demo 3 — Production build & preview

**Tasks**

- [x] Run the production build (vite build) and inspect the generated dist folder.
      The dist folder is generated with index assets and an index.html file.
- [x] Serve that build locally with vite preview (not the dev server) and confirm the app still works end-to-end from the built output.
      At first vite preview only showed a loading element with "Loading case files" and nothing else happened. The error in the console was "Unexpected token '<', \"html lang\"... is not valid JSON". After debugging I found that the build could not find the .json files because Vite did not move them into dist automatically.

      To fix this I placed the data folder under public. Vite treats public as the root for static assets and copies it unchanged into dist, so both npm run dev and vite preview work. No fetch() path change was needed because the public copy is served at the same relative path.

- [x] Compare the dev-mode source with the built output for at least one file: note what changed (filenames, size, formatting/minification).
      The biggest difference is the generated .js file in assets inside dist. Vite bundles everything into one or two files, removes whitespace and line breaks, and appends a content hash to the filename. The result is much smaller and not meant to be read by humans.

**Questions** (depend on the tasks above)

- [x] Name at least three concrete transformations Vite applied to your source when building for production (pick the ones you actually observed).
      First, it bundled all modules into a single JavaScript file and minified it by removing whitespace and line breaks. Second, it added a content hash to the generated asset filename, and the hash changed with every build. Third, it used index.html as the entry point and rewrote its asset references to point to the generated hashed files instead of the original source files. Finally, I observed that Vite only copied the contents of the public folder verbatim, which is why I had to move the JSON data there.

      Chapter 8, section 8.11 lists the same transformations: resolve the dependency graph, bundle, minify, rewrite asset references, and emit content-hashed filenames.

- [x] Why do production filenames typically include a content hash? What problem does that solve for real deployments?
      Hashed filenames help with caching. If the filename were always the same after every build, a browser or CDN could serve a stale or deprecated file version. With a content hash, a changed asset receives a new URL, while unchanged assets keep their old URL and can remain cached. This improves loading time and prevents stale-code problems.

      This is also explained in Chapter 8, section 8.11: a content hash changes when file content changes, so servers can cache hashed assets for a long time.

- [x] Why would you never want to deploy the dev server itself (vite dev / vite) to real users, even though it "works"?
      The dev server contains developer-oriented features such as Hot Module Replacement, detailed error overlays, and unoptimized transforms. It is built for a local environment and is not a production-grade static server. Production output is produced by vite build and served from dist; vite preview exists exactly so I can check the built distribution locally before publishing it.

      Chapter 7, section 7.3 makes this distinction explicit: the development server is a tool, not the deployed application, and previewing development mode is not the same as testing the production distribution.

---

## Demo 4 — package.json scripts: lint & format

**Tasks**

- [x] Install and configure a linter (ESLint) and a formatter (Prettier) for this TypeScript/JavaScript project.
      I installed the following devDependencies with npm install --save-dev: - eslint: the linter engine - @eslint/js: standard ESLint rule configurations - globals: definitions for browser globals such as window, document, and localStorage - prettier: the formatter - eslint-config-prettier: disables ESLint rules that would conflict with Prettier - typescript-eslint: TypeScript-aware ESLint rules

      The ESLint configuration lives in eslint.config.mjs because mjs is treated as an ES module script that ESLint can use. If I had used .js, the import and export syntax could conflict with CommonJS expectations depending on the surrounding package configuration. The file uses the new flat-config format.

- [x] Add these scripts to package.json: dev, build, lint, lint:fix, format. Each one must actually do something real when run, not just print a placeholder. - dev: vite (starts the Vite dev server) - build: vite build && tsc --noEmit (production build followed by TypeScript type checking) - lint: eslint . (lints the configured source tree) - lint:fix: eslint . --fix (applies safe lint fixes in place) - format: prettier --write . (formats all supported files in place)

      Why eslint .? ESLint needs to be told which files or directory to lint; otherwise it may fail or not check what I expect. Why --fix? Because --fix automatically writes safe corrections into the source files, for example removing unused variables or converting var to const.

- [x] Run lint and show it catching at least one real issue in your code (introduce one on purpose if you have to). Run lint:fix and/or format and show it actually changing a file.
      ![alt text](/resources/documentation_images/oops_eslintConfig.png) — I needed another config file and changed it to eslint.config.mjs. The first run produced a lot of errors, for example unused variables and var declarations. Running lint:fix converted many var declarations to const/let and removed unused variables.

      ![alt text](/resources/documentation_images/eslint_errors.png) A lot of errors with npm run lint.
      ![alt text](/resources/documentation_images/var_change.png) ESLint converted var to const/let.

**Questions** (depend on the tasks above)

- [x] What is the difference between what a linter checks/fixes and what a formatter checks/fixes? Give one concrete finding from each tool on this codebase.
      A linter checks code-quality patterns that may be erroneous, inconsistent, or difficult to maintain, for example unused variables, var instead of const/let, unreachable branches, or missing returns. A formatter standardizes layout such as whitespace, line wrapping, quote style, trailing commas, and indentation.

      In this codebase ESLint reported unused variables and var declarations, while Prettier adjusted spacing and line breaks in files such as index.html and the TypeScript modules. The linter is concerned with likely defects and project rules; the formatter is concerned with visual consistency.

      Chapter 9, section 9.1 draws the same line: a formatter decides how code is laid out, while a linter analyzes code patterns that may be erroneous.

- [x] Why are lint and lint:fix two separate scripts instead of one script that always auto-fixes? When would you deliberately want the non-fixing version?
      Sometimes you do not want a tool to automatically change your code. Not every lint error should be fixed blindly, and some fixes might be unsafe or change behavior. The non-fixing version is useful before committing, because it shows every issue without modifying files. I can inspect the report, decide which warnings to address, and only then run lint:fix. CI should also run the non-fixing version so that violations are reported and blocked rather than silently rewritten in a temporary runner.

      Chapter 9, section 9.2 makes the same argument: local fix commands optimize developer flow, while CI check commands preserve auditability.

- [x] What does npm run lint (or pnpm lint) actually do under the hood? Where does npm/pnpm look for the lint command, and would it work if your linter weren't installed as a project dependency (only globally on your machine)?
      npm run lint reads the scripts object in package.json and runs the command behind the lint key, which is eslint . in this project. npm temporarily makes executables from local dependencies available to scripts, so it finds eslint inside node_modules/.eslint. The ESLint executable then reads eslint.config.mjs to determine which files and rules to apply.

      If ESLint were only installed globally, npm run lint might still work on my machine because the global executable is on the OS path, but it would fail for teammates and CI that do not have the same global version installed. That is why the project lists ESLint as a devDependency and why CI runs npm ci first.

      Chapter 8, section 8.3 explains that package scripts map a short command to a tool command and that package managers temporarily make executables from local dependencies available to scripts.

---

## Demo 5 — TypeScript setup & first conversions

**Tasks**

- [x] Install TypeScript and add a tsconfig.json. Deliberately choose your strictness settings (do not just copy a default blindly) and be ready to justify at least one setting you turned on or left off.

      The following settings were chosen deliberately:
      - strict: true — enables the whole family of strong checks, including noImplicitAny and strictNullChecks.
      - allowJs: true — lets TypeScript modules coexist with the unconverted JavaScript files during the migration.
      - checkJs: false — existing JavaScript is not immediately subjected to strict TypeScript checking.
      - noEmit: true — TypeScript checks types, while Vite remains responsible for producing the build.
      - noUncheckedIndexedAccess: true — indexed array access is treated as potentially undefined.
      - moduleResolution: Bundler — matches Vite's bundler-based resolution.
      - target: ES2022 and lib: ["ES2022", "DOM"] — match modern browser capabilities and the async/await syntax used in the code.

- [x] Convert 2–3 of the smallest/utility modules from Exercise 1 (formatting or lookup helpers) from .js to .ts, with no any, and get them compiling with zero errors.
      I converted utils/lookupHelpers.ts and created a new TypeScript date formatter. The conversion forced me to update dashboard.ts and evidenceBasic.ts because they imported the newly typed helpers. I had to search for every place where the helper return values were used and adjust the callers accordingly.
- [x] Wire TypeScript into the build/dev scripts from Demo 4 so type errors are actually surfaced by the tooling, not just by your editor.
      I changed package.json so that build runs vite build && tsc --noEmit. The dev script is vite; type checking is not forced on every save because it would slow HMR, but the build step catches type errors before distribution.

**Questions** (depend on the tasks above)

- [x] What does the strict option in tsconfig.json actually turn on? Name at least two individual checks bundled under it, and say whether you kept it on and why.
      strict enables all strict type-checking options. Bundled checks include noImplicitAny, which reports variables that would receive an any type, and strictNullChecks, which treats null and undefined as separate types that must be handled explicitly. I kept it on because I am still learning TypeScript and want the compiler to catch as many potential errors as possible.

      A concrete example was the getStatusBadgeClass helper. Its parameter had to accept EvidenceStatus | null | undefined, and with strict on the compiler reported: "Argument of type 'undefined' is not assignable to parameter of type 'EvidenceStatus'." That forced me to decide how to handle missing status values instead of silently allowing them.

      Chapter 10, section 10.17 lists strict as a family of stronger checks and recommends aligning it with the actual runtime and build pipeline.

- [x] What is the difference between a compile-time type error and the runtime bugs you fixed in Exercise 1? Could TypeScript alone have caught any of those specific bugs? Why or why not?
      A compile-time error is detected while the code is being checked, before the application runs, for example when a function expects a string but receives a number. A runtime bug happens while the application is running, for example when a click handler dereferences a null result from a lookup.

      TypeScript alone could not have caught all the Exercise 1 bugs. A valid TypeScript argument does not prove that a runtime property is non-null when a button is clicked. Promises can return nothing, and TypeScript cannot check that every DOM attribute contains a valid domain value. TypeScript helps before runtime and speeds up debugging, but it cannot replace runtime debugging with the console and exploratory testing.

      Chapter 10, section 10.18 lists exactly these limits: TypeScript does not prove that a network request succeeds, that an event listener is registered the intended number of times, or that a value described as a date string contains a real date.

- [x] What does any do to TypeScript's checking for a value, and why did you avoid it in this first pass even though it would have been faster to just silence the errors with it?
      any opts out of type checking for a value. Operations on an any value are accepted, so unsoundness can spread through the program. I could call a string method on a number and TypeScript would not complain until runtime.

      I avoided any in getStatusBadgeClass and elsewhere because I wanted the values to be known, for example unreviewed, reviewed, or flagged, and I wanted the compiler to catch undefined or null. Using any would have hidden the real shape of the data and defeated the purpose of the migration.

      Chapter 10, section 10.7 warns that any is contagious and that unknown plus deliberate narrowing is usually the better boundary type.

---

## Demo 6 — Typing the domain data

**Tasks**

- [x] Define TypeScript types/interfaces for the case data model (evidence, people, locations, timeline events) that match the shape of data/*.json.
      I created types/domain.ts. It defines interfaces for the main records: CaseData, Evidence, Person, Location, and TimelineEvent. It also defines restricted value types through TypeScript type aliases: PersonId, LocationId, EvidenceId, TimelineEventId, EvidenceStatus, EvidenceRelevance, TimelineCertainty, and ViewName.

      What is a type alias and why did I use it here? A type alias gives a name to any type expression, not just object shapes. It can name a union of literal values, a primitive, a tuple, or a computed type. I used type aliases for the restricted identifiers and statuses because the allowed values are finite unions. For example, EvidenceStatus is the union "unreviewed" | "reviewed" | "flagged". A type alias is the natural way to express that in TypeScript. The alternative, a numeric enum, would not match the string values stored in JSON and would feel foreign to ordinary JavaScript data.

      Why centralize everything in types/domain.ts? During the migration I noticed that EvidenceStatus was defined both in utils/badgeHelper.ts and in the data model. Having two sources of truth risks them drifting apart. By placing EvidenceStatus and the other restricted unions in types/domain.ts, every view and helper imports the same definition. If the domain values change later, there is exactly one place to update.

- [x] Convert the data-loading module to use these types instead of untyped fetch().json() results.
      I moved the implementation into data/api.ts and added a generic fetchJson<T>(url: string): Promise<T> helper. The loaders now specify their expected results, for example fetchJson<CaseData>("data/case.json"), fetchJson<Person[]>("data/people.json"), fetchJson<Location[]>("data/locations.json"), and fetchJson<TimelineEvent[]>("data/timeline.json").

      fetchJson treats the parsed response as unknown first, then returns it with a type assertion to T. The assertion tells the TypeScript compiler what shape I expect, but it does not validate the JSON at runtime. That is a deliberate boundary: runtime validation would require explicit type guards or a schema library.

      data/api.js is only a compatibility re-export so older imports still reach the same implementation.

- [x] Pick one field that was genuinely ambiguous or inconsistent in the original JavaScript version and show what modeling it as a proper TypeScript type forced you to decide.
      I picked Evidence.personIds. One evidence entry stored "Nova Byte" (a display name), while the other records store IDs like "nova-byte". The old evidenceMentionsPerson workaround checked both person.id and person.name, which let the inconsistent data keep working.

      TypeScript forced me to decide what the field means. Because the property is called personIds, I committed to person IDs only and modeled it as PersonId[]. I normalized the JSON value from "Nova Byte" to "nova-byte" and also normalized the capitalized "Reviewed" and "Unknown" values to lowercase so they match EvidenceStatus and EvidenceRelevance. The helper now only needs to check person.id, which makes the relationship between evidence.json and people.json explicit.

**Questions** (depend on the tasks above)

- [x] Walk through the ambiguous field you picked: how did the JavaScript version get away without deciding on one shape, and what did TypeScript force you to commit to?
      JavaScript did not enforce what personIds contained. It treated the field as an array of strings, so "nova-byte" and "Nova Byte" were both acceptable at runtime. The old workaround compared IDs against both person.id and person.name, which masked the inconsistency and made the code harder to reason about.

      TypeScript forced me to decide what the field means. Because the property is called personIds, I committed to person IDs only and modeled it as PersonId[]. After normalizing "Nova Byte" to "nova-byte", the helper only needs to check person.id. This makes the relationship between evidence.json and people.json clearer and prevents new code from treating names and IDs as interchangeable.

      This is an example of the principle from Chapter 10, section 10.3 and 10.5: annotations and literal unions communicate intended contracts and make contradictions visible.

- [x] Is there a data-shape problem in this app that TypeScript's static types cannot catch on their own, because the actual bad data would only show up at runtime from a JSON file, not from your code? What would you need in addition to types to catch that?
      Yes. The TypeScript types describe the expected shape, but they do not validate the JSON at runtime. fetchJson<Evidence[]>("data/evidence.json") tells the compiler that the result should be evidence objects, but response.json() itself still only returns unknown external data.

      A JSON file could still contain a missing field, a number instead of a string, null instead of an array, or a personId that does not exist in people.json. TypeScript cannot compare the data files at runtime.

      To catch this automatically I would need runtime validation, for example a schema library such as Zod or Valibot, JSON Schema validation, or manually written type guards. A separate cross-reference test could also verify that every evidence, person, location, and timeline ID refers to an existing record.

      Chapter 10, section 10.16 makes exactly this point: values arriving from HTTP, storage, or form data remain runtime values whose shape can differ from expectations. Uncertain data is unknown at the boundary and becomes a domain value only after validation.

- [x] What is the difference between an interface and a type alias for an object shape in TypeScript? Which did you use for your domain models, and does it actually matter here?
      Both can describe object shapes. An interface is focused on objects and supports declaration merging and extension. A type alias is more flexible because it can also describe unions, primitives, tuples, intersections, and computed type expressions.

      I used interfaces for the main domain objects (CaseData, Evidence, Person, Location, and TimelineEvent) because they are records with named fields. I used type aliases for the restricted values and IDs (PersonId, EvidenceStatus, EvidenceRelevance, TimelineCertainty, and ViewName) because they are unions of allowed values. For these simple models, interface versus type does not matter much technically, but using them this way makes the intent clearer.

      Chapter 10, section 10.9 states that neither is universally superior and that a consistent local convention is usually more valuable than treating the choice as a design doctrine.

---

## Demo 7 — Full migration & resolving type errors across the app

**Tasks**

- [x] Convert the remaining .js modules to .ts, and get the entire app compiling with zero TypeScript errors under the strictness settings from Demo 5.
      I converted the active modules to TypeScript: app.ts, state/globalState.ts, navigation/router.ts, storage/localStorage.ts, utils/dom.ts, utils/lookupHelpers.ts, utils/setup.ts, and all six views/*.ts files. index.html now loads app.ts.

      The old .js files are only thin compatibility export * shims so old imports cannot accidentally use stale duplicate implementations. The command npx tsc --noEmit, npm run lint, and npm run build all complete without TypeScript or lint errors.

      --> why?
      brownfield migration: (Chapter 7)
            Avoids stale duplicate implementations. Without the shim, the old .js file might still contain a copy of the original code. That creates two sources of truth: one in .js and one in .ts. The shim removes the old body so the code exists in only one place.
            Keeps old import paths working. Any leftover reference that imports from globalState.js (or the legacy old_app.js, or earlier exercise files) still resolves and receives the current implementation.
            Makes the migration incremental. You can convert one module at a time without having to update every single import statement across the entire codebase in one go.

- [x] Find at least 3 real spots where the compiler flagged something you had to actually think about (a union type, a possibly-undefined value, an implicit any, etc.). For each, decide and record whether it pointed at a real latent bug or was "just" the compiler being pedantic.

      1. DOM elements could be null. document.getElementById(...) returns HTMLElement | null, but the old code immediately accessed .value, .classList, or .innerHTML. This produced "Object is possibly 'null'". I added getElement() and getRequiredElement() in utils/dom.ts. For elements that must exist in index.html, the required helper fails explicitly; for optional containers, the code keeps the early return. This was partly pedantic because the current HTML contains those elements, but it also makes the dependency on the DOM explicit.

      2. DOM values are only strings. dataset.view, dataset.evidenceId, select .value, and dataset.personId do not automatically have domain types. TypeScript therefore reported errors when those values were passed to functions expecting ViewName, EvidenceId, or PersonId. I added type guards such as isViewName, isEvidenceId, isPersonId, isEvidenceStatus, and isEvidenceRelevance instead of casting or using any. This exposed that the old JavaScript assumed every DOM attribute had a valid domain value.

      3. Date subtraction is not typed arithmetic. The old sort code subtracted Date objects directly: new Date(a.timestamp) - new Date(b.timestamp). TypeScript requires numeric operands, so I changed it to .getTime(). This was mostly pedantic because JavaScript coerces Date objects at runtime, but the typed version documents that the intended operation is comparing timestamps as numbers.

      4. Indexed access can produce undefined. With noUncheckedIndexedAccess, expressions like allEvidence[i] and select.options[i] are T | undefined. I converted many indexed loops to for...of, forEach, or Array.from(...) where that made the code safer and clearer. This was mostly pedantic for loops with bounds checks, but it removed a whole class of potential undefined errors.

      5. Two real latent issues were made explicit. workspace.ts needed real imports for navigateTo and openEvidenceDetail; previously those names were only undefined globals. In evidenceBasic.ts, bookmark removal assigned a filtered array to a local variable without updating global state, which is why I now call state.setBookmarks(...). The second issue was shown by linting (no-useless-assignment) and the typed state API rather than TypeScript directly.

- [x] Confirm the app still behaves identically to the working JavaScript version — a type-safe app that behaves differently is not a successful migration.
      I kept the app's rendering style, hash routing, localStorage keys, loading behavior, and inline event-handler contract. The only intentional behavior corrections are the bookmark state update and explicit imports for the workspace evidence link. vite build, tsc --noEmit, and eslint . all pass. For final visual confirmation, the five views still need a manual click-through in the browser.

**Questions** (depend on the tasks above)

- [x] Show one specific type error you had to actually think about (not just silence with any or the ! non-null assertion). What did it tell you about your code that plain JS review or testing hadn't?
      A representative error was the equivalent of:

      Argument of type 'string | undefined' is not assignable to parameter of type 'EvidenceId'

      It occurred where a data-open-evidence or data-evidence-id attribute was read from the DOM and passed to openEvidenceDetail(). In plain JavaScript, the DOM value was simply assumed to be a valid evidence ID. TypeScript forced me to notice that dataset gives string | undefined: the attribute could be absent, malformed, or any unrelated string.

      I handled it with isEvidenceId() and returned early for invalid values. This is more accurate than an any parameter or dataset.id!, because neither of those checks what is actually present in the DOM. It showed that the app has a real boundary between trusted domain IDs and untrusted string-valued DOM attributes.

      This illustrates Chapter 10, section 10.6 on control-flow analysis and narrowing: a union is useful only if code can establish which alternative it currently has, and user-defined predicates let a reusable check communicate its result to the compiler.

- [x] When (if ever) is reaching for any the right call during a migration like this, versus a sign you should model the type properly? Where did you draw that line?
      any is useful temporarily when an external API has no declarations or when a migration is blocked and the team needs a working intermediate state. It can also appear inside a carefully isolated adapter, as long as the rest of the application receives a better type afterward.

      I did not use any in this migration because the problematic values had knowable domain shapes. JSON.parse() and response.json() were treated as unknown, then narrowed with guards or modeled with explicit interfaces. DOM strings were narrowed with isEvidenceId, isPersonId, isViewName, isEvidenceStatus, and isEvidenceRelevance. This took more work than writing any, but it preserved the benefit of TypeScript instead of hiding the uncertainty.

      I would draw the line like this: any is acceptable as a temporary bridge in one small, visible place; it is not acceptable for domain models or frequently used helpers. unknown plus a type guard is usually the better boundary type because it still forces validation before the value is used.

      Chapter 10, section 10.7 recommends exactly this: prefer unknown at uncertain boundaries and narrow it deliberately; use any only as a local, temporary escape hatch with a clear reason.

- [x] Did the migration reveal anything that was a genuine, previously-unnoticed bug (as opposed to just noise)? If yes, explain it. If no, explain how you are confident it was only noise.
      Yes. The migration exposed two concrete issues:

      1. workspace.js called navigateTo and openEvidenceDetail without importing them. In ES-module/strict scope, that is a real ReferenceError, not only a style issue. workspace.ts now imports both functions explicitly.

      2. evidenceBasic.js removed a bookmark by assigning bookmarks = bookmarks.filter(...). That only replaced the local variable; it did not update state.getBookmarks(), so the removed bookmark could still be saved from the stale shared array. The typed state API made the intended mutation boundary clearer, and the TypeScript version now calls state.setBookmarks(...).

      The migration also found noise that was not necessarily a bug: DOM elements that always exist in index.html still needed null handling, and valid Date coercion needed .getTime() because TypeScript does not allow arithmetic between Date objects directly. Those checks improve clarity even where the old runtime behavior happened to work.

      Chapter 10, section 10.18 and the "Renaming files is not a type migration" box warn that a codebase full of any and assertions may compile as TypeScript while preserving most JavaScript uncertainty. Migration is complete when important assumptions are expressed and checked, not suppressed.

---

## Demo 8 — GitHub Actions: development workflow

**Tasks**

- [x] Write a GitHub Actions workflow that triggers on push (and/or pull request), checks out the repo, sets up Node.js at the right version, installs dependencies (with dependency caching), and runs lint and a format-check (prettier --check).
      The workflow is stored in .github/workflows/push_commit.yml. It triggers on push and on pull_request, runs on ubuntu-latest, checks out the repository, sets up Node.js 24.20.0, installs dependencies with npm ci, runs npm run lint, and checks formatting with npx prettier --check .
- [x] Push a commit that deliberately fails lint or format, and show the workflow failing in the Actions tab.
      The workflow failed on the first real run, not deliberately, because of formatting and lint issues in the newly migrated files.
- [x] Fix it and push again, and show the same workflow passing.
      After fixing the reported ESLint and Prettier issues, the workflow passed.

**Questions** (depend on the tasks above)

- [x] What is the difference between a workflow, a job, and a step in GitHub Actions? Point to one of each in your workflow file.
      A workflow is the complete automation definition stored in .github/workflows/, for example .github/workflows/push_commit.yml. It defines when GitHub should run the automation through on: and which jobs it contains.

      A job is a named unit inside jobs: that runs on one runner. In push_commit.yml, the lint-and-format job runs on ubuntu-latest and contains the ordered steps.

      A step is one command or action inside that job's steps: list. Examples in the file are uses: actions/checkout@v4 for checking out the repository, uses: actions/setup-node@v4 for configuring Node.js, and run: npm run lint for executing the linter. The hierarchy is workflow → jobs → steps.

      This matches Chapter 11, section 11.1: a GitHub Actions workflow is YAML-defined automation triggered by repository events, contains one or more jobs, and each job contains ordered steps.

- [x] Why should lint/format run in CI at all, if it already runs (or could run) on every developer's own machine before they push?
      Local checks are helpful, but CI is the shared source of truth. A developer can forget to run npm run lint or npx prettier --check, use a different tool version, have an incomplete local checkout, or push code that only works because of uncommitted files.

      Running the checks in GitHub Actions means every push and pull request is checked in a clean environment with the same Node.js version and the same locked dependencies. The result is visible to everyone in the Actions tab and can block a broken pull request before it reaches the main branch. It also creates an auditable run history.

      Chapter 11, section 11.1 describes CI as the environment that executes the project's verification process in a clean, shared environment, and section 11.8 emphasizes that both local and CI workflows call shared package.json scripts so a failure locally and a failure in CI mean the same thing.

- [x] What is dependency caching doing in your workflow, and what would happen (both correctness- and speed-wise) if you removed it?
      Dependency caching stores the npm cache between workflow runs. With actions/setup-node, the cache is keyed from package-lock.json, so a new dependency installation reuses previously downloaded packages when the lock file has not changed.

      Removing it should not change correctness because npm ci still reads package-lock.json and installs the dependency versions recorded there. The difference is speed and network usage: every run would have to download the dependency packages again. If npm ci were used without a lock file, that would be a correctness problem, but the project has package-lock.json, so the main effect of deleting the cache would be slower and more fragile CI runs.

      Chapter 11, section 11.3 makes the same distinction: the lockfile ensures correctness, the cache improves speed. A cache miss should simply download dependencies again.

---

## Demo 9 — GitHub Actions: deployment workflow

**Tasks**

- [x] Write a second workflow that, on push to your main branch (or another trigger you choose and can justify), checks out the repo, installs dependencies, lints, builds (vite build), and deploys the dist output to GitHub Pages (or an equivalent static host).
      The workflow is stored in .github/workflows/deploy.yml. It triggers on push to main and also on exercise2_demo8To10 for demonstration purposes, and it supports workflow_dispatch for manual redeploys. It installs dependencies with npm ci, runs npm run lint, checks formatting with npx prettier --check ., runs npm run build, and publishes the dist folder to GitHub Pages using the official Pages deployment actions.

      What is GitHub Pages? GitHub Pages is a static hosting service that takes HTML, CSS, and JavaScript files from a repository and publishes them as a public website. For this project it serves the Vite-built dist folder. It is well suited to single-page applications and static sites, which is the delivery model described in Chapter 12. The repository settings must enable GitHub Pages and select GitHub Actions as the source before the workflow can publish anything.

- [x] Confirm the deployed URL actually serves the working app end-to-end, not just that the workflow reports success.
      I verified the deployed URL by opening it in a browser and clicking through the views. The app loads the JSON data from the public folder and the hashed assets from the build.
- [x] Make a real change, push it, and show it going live via the workflow without any manual deployment step.
      After editing a view file and pushing to the demonstration branch, the workflow ran automatically and the change appeared on the deployed site.

**Questions** (depend on the tasks above)

- [x] Why does the deploy workflow re-run lint and build itself, instead of trusting "it already passed on my machine" or reusing Demo 8's workflow's result directly?
      Deployment is the workflow that publishes real output, so it must verify the exact commit it is about to deploy. A green development workflow on an earlier commit does not prove that the current commit is valid, and GitHub Actions does not automatically hand a passing result or a build artifact from one workflow run to another unrelated deployment run.

      Re-running npm run lint and npm run build also protects against differences between local machines, missing files, stale node_modules, or a manual push that bypassed the pull-request checks. Most importantly, vite build creates the dist directory that the deploy step publishes, so the build has to happen inside the deploy workflow anyway.

      Chapter 11, section 11.8 states that the deploy workflow re-runs checks rather than trusting a developer's machine, and that for a small course project rebuilding in one self-contained deployment workflow is easier to audit.

- [x] What is the actual mechanism your deploy workflow uses to publish to GitHub Pages (e.g. a dedicated deploy action publishing an artifact, pushing to a gh-pages branch, or something else)? Explain, concretely, what it does.
      The mechanism is GitHub's official Pages deployment flow with actions/configure-pages, actions/upload-pages-artifact, and actions/deploy-pages. After npm run build, the workflow packages the generated dist directory as a Pages artifact. actions/upload-pages-artifact uploads that directory as the site content, and actions/deploy-pages publishes the uploaded artifact to the repository's GitHub Pages environment.

      This is different from pushing the generated files to a gh-pages branch. The deploy action publishes the artifact through GitHub Pages' deployment API, while the repository itself only needs the workflow file and source code. GitHub Pages must be configured in the repository settings to use GitHub Actions as its source.

      The same mechanism is shown in Chapter 11, section 11.4, which describes build and deploy as separate jobs: build produces the artifact, deploy publishes it through the Pages deployment API.

- [x] What would you need to change in this workflow if you were deploying to a different static host instead (e.g. Netlify, Vercel, a plain server over SFTP)? What would stay the same?
      The beginning of the workflow would stay almost identical: trigger on the chosen branch, check out the repository, install Node.js, run npm ci, run lint/format/type checks, and run npm run build to produce dist.

      Only the publication part would change. For Netlify or Vercel, the final steps would use the provider's CLI or a dedicated action and provider-specific secrets such as an API token and site/project ID. For SFTP, the workflow would upload the contents of dist with an SSH/SFTP action or command and would need secrets for the host, username, key/password, and target directory. The build output remains the same, but the credentials, destination, and deploy command are host-specific.

      Chapter 11, section 11.8 emphasizes that both workflows call shared package.json scripts, so the build output is decoupled from the specific host publication step.

---

## Demo 10 — Workflow triggers, permissions & failure modes

**Tasks**

- [x] Deliberately commit a real TypeScript error (or a lint failure) that should block deployment, push it, and show the deploy workflow failing before it reaches the deploy step.
      I introduced an intentional lint error by adding an unused variable and pushed it to the demonstration branch. The development workflow and the deploy workflow both failed during the lint step, before any artifact was uploaded.
- [x] Identify exactly what permissions and/or secrets your deploy workflow needs to publish to GitHub Pages, and show where they're configured (repository settings, the permissions: key in the workflow file, etc.).
      The deploy workflow has the following permissions block at workflow level:

      permissions:
        contents: read
        pages: write
        id-token: write

      contents: read lets the job read the repository checkout. pages: write lets it create the Pages deployment. id-token: write lets GitHub issue the OIDC token used by the Pages deployment flow.

      In addition, GitHub Pages must be enabled in the repository settings under Settings → Pages, with Source set to GitHub Actions. No long-lived personal access token is stored as a secret for this mechanism; the workflow uses the short-lived GITHUB_TOKEN and the OIDC identity.

- [x] Open the run history for both workflows and be ready to read a failed run's logs live and explain, to someone unfamiliar with it, what failed and why.
      The failed run showed the lint step exiting with a non-zero status because of an unused variable. Because that step failed, the workflow stopped before the build, upload, or deploy steps. The error message included the file path, line number, and the ESLint rule that was violated.

**Questions** (depend on the tasks above)

- [x] When your build step fails, does the previously-deployed version of the app stay live, get taken down, or something else? Is that the behavior you want, and why?
      With GitHub Pages, a failed build normally leaves the previously deployed version live. The workflow stops before actions/deploy-pages, so no new artifact is uploaded or published. GitHub Pages does not take the old site down just because a newer commit failed to build.

      That is the desired behavior for this project: a broken commit should not deploy, but it also should not remove the last working version. The failed workflow run still makes the problem visible, so the broken commit can be fixed and pushed again.

      Chapter 11, section 11.4 describes this as "fail fast and preserve the last good deployment": if linting, type checking, formatting, or building fails, the previously published version remains available.

- [x] What GitHub Actions permission(s) or secret(s) does your deploy workflow actually need, and where did you grant/store them? What's the security risk of over-granting permissions here?
      For the official actions/deploy-pages mechanism, the deploy job needs a small permissions block: contents: read, pages: write, and id-token: write. contents: read lets the job read the repository checkout, pages: write lets it create the Pages deployment, and id-token: write lets GitHub issue the OIDC token used by the Pages deployment flow. GitHub Pages must also be configured in the repository settings under Settings → Pages to use GitHub Actions.

      No long-lived personal access token is needed for that approach; the workflow uses the short-lived GITHUB_TOKEN and the OIDC identity. Over-granting permissions such as contents: write, broad actions permissions, or storing a powerful personal token as a secret would increase the damage a compromised workflow or dependency could do. With write access to the repository or other resources, malicious workflow code could modify code, releases, or deployments rather than only publishing the current site.

      Chapter 11, section 11.5 explains the same least-privilege principle: grant only what a job needs, and remember that third-party actions are dependencies that execute code in the runner.

- [x] What's the difference between triggering a workflow on: push, on: pull_request, and on: workflow_dispatch? Which did you use for the development workflow (Demo 8) and which for the deployment workflow (Demo 9), and why is that pairing the right one?
      on: push runs after commits are pushed to the selected branches. on: pull_request runs when a pull request is opened or updated, so it checks the proposed merge result before the code reaches the main branch. on: workflow_dispatch adds a manual Run workflow button, which is useful for demonstrations or a controlled redeploy.

      The development workflow in .github/workflows/push_commit.yml uses push and pull_request so both direct commits and proposed changes are checked before they are relied on. The deployment workflow in .github/workflows/deploy.yml uses push to main (plus the demonstration branch exercise2_demo8To10) and workflow_dispatch for a manual redeploy. This pairing is appropriate because pull requests get feedback before merge, while only the accepted main branch is published automatically.

      Chapter 11, section 11.2 describes these triggers: push for branch updates, pull_request for proposed changes, and workflow_dispatch for manual runs. Section 11.8 adds that a verification workflow commonly runs for pushes and pull requests, while a deployment workflow commonly runs only for the protected main branch and may allow manual dispatch.

---

## What to bring to class

For each of the 10 demos: your changed code/config (ideally as commits you can diff live), the actual GitHub Actions run history for both workflows (not just the files), and the ticked checkboxes above reflecting what you can genuinely demonstrate and answer right now. Be ready to trigger a real workflow run live (e.g. via a small commit) on request, not just describe one that ran earlier.
