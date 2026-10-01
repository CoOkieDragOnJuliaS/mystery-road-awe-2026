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

- [ ] Install TypeScript and add a `tsconfig.json`. Deliberately choose your strictness settings (don't just copy a default blindly) and be ready to justify at least one setting you turned on or left off.
- [ ] Convert 2–3 of your smallest/utility modules from Exercise 1 (e.g. formatting or lookup helpers) from `.js` to `.ts`, with **no `any`**, and get them compiling with zero errors.
- [ ] Wire TypeScript into your `build`/`dev` scripts from Demo 4 so type errors are actually surfaced by your tooling, not just by your editor.

**Questions** (depend on the tasks above)

- [ ] What does the `strict` option in `tsconfig.json` actually turn on? Name at least two individual checks bundled under it, and say whether you kept it on and why.
- [ ] What is the difference between a compile-time type error and the runtime bugs you fixed in Exercise 1? Could TypeScript alone have caught any of those specific bugs? Why or why not?
- [ ] What does `any` do to TypeScript's checking for a value, and why did you avoid it in this first pass even though it would have been faster to just silence the errors with it?

---

## Demo 6 — Typing the domain data

**Tasks**

- [ ] Define TypeScript types/interfaces for the case's data model (evidence, people, locations, timeline events) that match the shape of `data/*.json`.
- [ ] Convert your data-loading module to use these types instead of untyped `fetch().json()` results.
- [ ] Pick one field that was genuinely ambiguous or inconsistent in the original JavaScript version (for example: something that could be either an id or a display name, or a date stored in more than one format) and show what modeling it as a proper TypeScript type forced you to decide.

**Questions** (depend on the tasks above)

- [ ] Walk through the ambiguous field you picked: how did the JavaScript version get away without deciding on one shape, and what did TypeScript force you to commit to?
- [ ] Is there a data-shape problem in this app that TypeScript's static types **can't** catch on their own, because the actual bad data would only show up at runtime from a JSON file, not from your code? What would you need in addition to types to catch that?
- [ ] What's the difference between an `interface` and a `type` alias for an object shape in TypeScript? Which did you use for your domain models, and does it actually matter here?

---

## Demo 7 — Full migration & resolving type errors across the app

**Tasks**

- [ ] Convert the remaining `.js` modules to `.ts`, and get the **entire app** compiling with zero TypeScript errors under the strictness settings from Demo 5.
- [ ] Find at least 3 real spots where the compiler flagged something you had to actually think about (a union type, a possibly-`undefined` value, an implicit `any`, etc.). For each, decide and record whether it pointed at a real latent bug or was "just" the compiler being pedantic.
- [ ] Confirm the app still behaves identically to the working JavaScript version — a type-safe app that behaves differently is not a successful migration.

**Questions** (depend on the tasks above)

- [ ] Show one specific type error you had to actually think about (not just silence with `any` or the `!` non-null assertion). What did it tell you about your code that plain JS review or testing hadn't?
- [ ] When (if ever) is reaching for `any` the right call during a migration like this, versus a sign you should model the type properly? Where did you draw that line?
- [ ] Did the migration reveal anything that was a genuine, previously-unnoticed bug (as opposed to just noise)? If yes, explain it. If no, explain how you're confident it was only noise.

---

## Demo 8 — GitHub Actions: development workflow

**Tasks**

- [ ] Write a GitHub Actions workflow that triggers on push (and/or pull request), checks out the repo, sets up Node.js at the right version, installs dependencies (with dependency caching), and runs your `lint` and a format-check (e.g. `prettier --check`).
- [ ] Push a commit that deliberately fails lint or format, and show the workflow **failing** in the Actions tab.
- [ ] Fix it and push again, and show the same workflow **passing**.

**Questions** (depend on the tasks above)

- [ ] What is the difference between a workflow, a job, and a step in GitHub Actions? Point to one of each in your workflow file.
- [ ] Why should lint/format run in CI at all, if it already runs (or could run) on every developer's own machine before they push?
- [ ] What is dependency caching doing in your workflow, and what would happen (both correctness- and speed-wise) if you removed it?

---

## Demo 9 — GitHub Actions: deployment workflow

**Tasks**

- [ ] Write a second workflow that, on push to your main branch (or another trigger you choose and can justify), checks out the repo, installs dependencies, lints, builds (`vite build`), and deploys the `dist/` output to GitHub Pages (or an equivalent static host).
- [ ] Confirm the deployed URL actually serves the working app end-to-end, not just that the workflow reports success.
- [ ] Make a real change, push it, and show it going live via the workflow without any manual deployment step.

**Questions** (depend on the tasks above)

- [ ] Why does the deploy workflow re-run lint and build itself, instead of trusting "it already passed on my machine" or reusing Demo 8's workflow's result directly?
- [ ] What is the actual mechanism your deploy workflow uses to publish to GitHub Pages (e.g. a dedicated deploy action publishing an artifact, pushing to a `gh-pages` branch, or something else)? Explain, concretely, what it does.
- [ ] What would you need to change in this workflow if you were deploying to a different static host instead (e.g. Netlify, Vercel, a plain server over SFTP)? What would stay the same?

---

## Demo 10 — Workflow triggers, permissions & failure modes

**Tasks**

- [ ] Deliberately commit a real TypeScript error (or a lint failure) that should block deployment, push it, and show the deploy workflow failing _before_ it reaches the deploy step.
- [ ] Identify exactly what permissions and/or secrets your deploy workflow needs to publish to GitHub Pages, and show where they're configured (repository settings, the `permissions:` key in the workflow file, etc.).
- [ ] Open the run history for both workflows and be ready to read a failed run's logs live and explain, to someone unfamiliar with it, what failed and why.

**Questions** (depend on the tasks above)

- [ ] When your build step fails, does the previously-deployed version of the app stay live, get taken down, or something else? Is that the behavior you want, and why?
- [ ] What GitHub Actions permission(s) or secret(s) does your deploy workflow actually need, and where did you grant/store them? What's the security risk of over-granting permissions here?
- [ ] What's the difference between triggering a workflow `on: push`, `on: pull_request`, and `on: workflow_dispatch`? Which did you use for the development workflow (Demo 8) and which for the deployment workflow (Demo 9), and why is that pairing the right one?

---

## What to bring to class

For each of the 10 demos: your changed code/config (ideally as commits you can diff live), the actual GitHub Actions run history for both workflows (not just the files), and the ticked checkboxes
above reflecting what you can genuinely demonstrate and answer _right now_. Be ready to trigger a real workflow run live (e.g. via a small commit) on request, not just describe
one that ran earlier.
