# Demo 1 notes

**Information from the book**

The module boundaries are split by responsibility. app.js owns a lot of data - especially helper functions. state is another one (the top-level vars and information that is changed to getters and setters to be used more than once)
- localStorage is moved to storage, as mentioned in the books (serialization)
- api is moved to data, which owns URLs and API calls (fetch functions)
- views own the DOM view
- navigation is for routing
- main.js or app.js composes the modules at startup

!!IMPORTANT: Lower modules NEVER import higher ones!!
Named exports throughout the Demo

## Changes

- Folder changes for creation of data, state, navigation, views, storage and utils
- Bit by bit change from app.js to the different modules
- globalState: let instead of var and encapsulating mutable state behind functions
- last line in index.html changed to work with the new modules (app.js as first entry)

## Problems with the first part:

Difficulty lie therein that I have forgotten how to implement and code with .js and node.
I forgot to test after each change and now I am deep within refactoring to make it work with all the imports and exports needed
- Gone through devTools and bugfix to have it at the state of the beginning - where the imports and exports can communicate with each other
- Live Server works perfectly without any problems. Terminal does what it is supposed to do. I am not sure if the tabs should work, have to see for the other demos


----
# Demo 2 notes

**Where to look**
> For this demo specifically, find and fix a bug where an array or object gets changed in a place
> that surprises you (something is mutated that shouldn't have been, or two things that were supposed
> to be independent turn out to be linked).

Meaning, that I should look somewhere where the original objects could be mutated directly with = through the shared objects.
I have still several undefined references throughout the module split, which are coming up one by one when clicking through the app

![alt text](/resources/documentation_images/reference_errors.png)

Even though the reference errors are showing, the panels, people and their pictures are loading nonetheless
BUT I cannot switch to locations
![alt text](/resources/documentation_images/panel_loading_errors.png)

- had to fix the referenceError to see actual evidence and the correspondent information of the other timeline, people&locations and so on

- endless loading screen on Evidence: ![alt text](/resources/documentation_images/endless_loading_evidence.png)
        
    > Change was made to the loadEvidenceData() in api.js because the evidenceViewLoading was always true - so the loading never stopped

        export function loadEvidenceData() {
        fetch("data/evidence.json")
            .then(function (res) {
            return res.json();
            })
            .then(function (data) {
            state.setAllEvidence(data);
            evidence.applyStoredBookmarkFlags();
            state.setEvidenceViewLoading(false);
            state.getFilteredEvidence();
            renderDashboard();
            populateAllDropdowns();
            if (state.getCurrentPage() === "evidence") evidence.renderEvidenceList();
            })
            .catch(function (err) {
            console.error("Failed to load evidence.json", err);
            alert("Evidence could not be loaded. Some views may be incomplete.");
            });
        }

    > Change was made to the imports, because the import for the badgeClass and relevanceBadgeClass was incorrect (state instead of helper), the spinner stopped and the evidence was shown

        getStatusBadgeClass, getRelevanceBadgeClass } from "../utils/lookupHelpers.js";

## The bug that is actually for Demo 2

Now the real bug-hunting can begin, because the evidences are loading and I can click around!

![alt text](/resources/documentation_images/local_storage_note.png)

- After changing the review status of one evidence and closing the view without saving the note the current status (reviewed) is added to the dashboard. Maybe that is a bug, because I did not save it beforehand?

![alt text](/resources/documentation_images/changed_dashboard_reviews.png)

- After reloading the page the review is gone from the dashboard. So each local storage is immediately gone after reload? Even the flagged E15. The note is still in local storage, but the Flag not
- Is this something where dashboard and the reviewed status of the detailed thing should be independent, but they are linked automatically without saving? Or is the indepence something I want to see?

- Another dependency which should not be is the evidence notes that are seen in the Workspace tab. Even though the Evidence 15 is closed, the note is still showing up in the view.
- And: first and foremost: all my changes locally are still in the text boxes and not cleaned up after I saved a hypothesis draft
- The hypothesis draft is also not showing anywhere except the form in Workspace

**How to resolve it**?


## The bug for Demo 3 - async

 > Important to know is, that I need to find something where the async or the loading of the data does not match with the loading of another data. Maybe if a request is called even though the entry is different?

 - Rendering the workspace (reload) does cancel the note that is usually shown on the upper right corner. After I go to evidence and return back, the note is loaded and appears on the screen

 - Rendering the people & locations (http://127.0.0.1:5501/#people) before anything else does set every evidence they have to 0, even though there are many evidences per person. Which also possibly stems from the different entry call and the loading of data
 - In the network tab all the pages are loading / 304 status, not 200 - but if I render the dashboard first the correct status is inside the people page or the note inside the workspace.

**How to resolve it**?
- Probable root cause: loading workspace and people beforehand uses a fetch without a return, so the callback inside the loading of all data runs too early. The people view and the workspace view renders before the evidence has arrived to the count goes to zero. 
- I could return the evidence data or wait for all operations that they return the Promise before loading everything - so only if everything is loaded into the web page?

- Resolving with return in loadEvidenceData() did not work
- **Resolving with maybe waiting with Promise.all()? worked in api.js**

> evidence.json was pending it's fetch, because loadAllData() rendered the people/workspace with return without waiting for the promise. The empty evidence array was read by them.
> renderPeople() ran in breakpoints before the setAllEvidence() call. By fetching the promise and awaiting everything loads beforehand with Promise.all() (Internetrecherche) the evidence is loaded

## The bug for Demo 4 - a silent bug

 > There is still the Promise, which is always there when I first start the app, but I don't know if it is a bug or not or how it should look like
 > There is also an interesting thing about the modal windows in the timeline, I opened 2 or 3 and closed them and watched the console add it up to a counter - which may never go down? Perhaps it is only resetted after I go to the evidenceDetails itself?

 ![alt text](/resources/documentation_images/modal_counter.png)

**How to resolve it**?

> I should look into the console.log elements to find the cause of the Promise in the console window
> Resolution is by attaching a callback to the app.js right before the console.log of the first note preview

> The modal which is called is attached to the addEventListener, so I have to find it and fix it for the adding up the count
    > > By also removing the event listener with the event passed into and decrement the count the counting works as expected, opening evidence still works
    
         modal.addEventListener("click", function (e) {
        if (e.target.classList.contains("modal-close-btn") || e.target.classList.contains("modal-backdrop")) {
        modal.innerHTML = "";
        // Trying out the counter for modal close listeners bug in Demo 4
        // by passing the event to the removeEventListener function it works as expected
        modal.removeEventListener("click", e);
        state.decrementModalCloseListenerCount();
        console.log("modal closed, active close listeners:", state.getModalCloseListenerCount());

 ## Demo 5 walkthrough - maybe Demo 4 or Demo 3 because it is easier to show?

 > Another bug I found was the rendering of the localStorage information, like the note in the Workspace tab. If changed, the value does not change, except if I reload the entire app and then go back to workspace - the modified value does stay there

 > Expected behaviour: The change should be immediate, instead of after reloading if a localStorage change was made
 > Actual behaviour: The change is not seen until a full reload of the whole webpage (localStorage stays in browser)

- Probable root cause: no automatic synchronization/update with JavaScript memory or the DOM. Load only happens in app.js during initialization (with loadNotes for example)
- I think this cause can also be applied to a lot of other loading zones where storage information is loaded into the web page
- It could also NOT be a bug, but I would prefer instant loading with live synchro rather than manual reload

> New bug found by mistyping the localStorage JSON 
![alt text](/resources/documentation_images/mistyping_bug_JSON.png)

- Root cause: mistyping leads to error, which is not caught by a try/catch clause
- Unfortunately, changing the remotion_notes back leads though to no notes displayed, even if there are more notes and no errors shown, but going to dashboard/evidence and then workspace brings the notes back (except an empty note in E02), as previously stated in another Demo note because of the pre-loading 

- Inserting try-catch will at least not prevent the site from loading in in app.js
- Fixing one bug meant to see another way of enhancing the experience - it solved a specific problem, but there are a lot of bugs inside the app itself when it comes to saving notes, clicking on stuff or synchronizing behaviour. The initial loading and the no-synchronization throws me off a little bit

----------------------------------------------------------------------------------------------------------
# Demo 8 notes

        var allEvidence = [];
        var filteredEvidence = [];
        var selectedEvidence = null;
        var bookmarks = [];
        var currentPage = "dashboard";

        var allPeople = [];
        var allLocations = [];
        var allTimeline = [];
        var caseData = {};

        var currentPeopleTab = "people";
        var loadingStepsRemaining = 2; 

        var evidenceViewLoading = true;

        var viewRendered = {
        dashboard: false,
        evidence: false,
        people: false,
        timeline: false,
        workspace: false
        };

        var notesStore = {}; 
        var modalCloseListenerCount = 0; 

        var STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
        var STORAGE_KEY_NOTES = "remotion_notes";
        var STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

> Question to answer:
> For at least three of them,
> explain what could go wrong if two unrelated 
> pieces of code both tried to use a variable with
> that name — and how your module split from Demo 1 > already prevents (or doesn't yet prevent)
> that.

- One variable which is used in multiple occurrences is currentPage, which is used by api.js, router.js and the evidence.js in my new solution
- - wrong assignment of currentPage could pass the wrong value and render the wrong view

- Another variable is allEvidence, which is used in a looot of code blocks
- -  If it is replaced in a different way than expected, it could affect multiple views, filters or counts

- One more: notesStore
- - It is modified, used for viewing notes and more and could - the viewing of notes could be changed in the workspace because of the direct manipulation at the wrong time

> Module split prevents most collisions, but not all, because each module has its own scope. globalState.js is my state which exports getters and setters in a way that no modifying is done without knowledge of the function access - also easier for debugging (to know which calls the getter/setter methods) - making the variables private and "mutable" with let, but at the same time only accessible via functions

## Changing the variables
> Task:
> Go through the codebase and replace `var` with 
> `const` or `let` everywhere it's declared,
> deciding `const` vs. `let` deliberately for each one.

**One rule could be applied: using const, when the variable is never reassigned, using let when the variable is mutable and could receive a value later. Arrays or objects can be const, even if the value changes! Good to know**

- Even though the rules could be applied to my globalState.js - I didn't do it.
- Because the arrays and objects get "reassigned" instead of added or changed inside the globalState.js (which I would change in the next phase), they need the let because of the changes
- It would have been better to assign const to the arrays and the object and change/replace only the content instead of the whole array or object
- with .push() at arrays and resetting the length or at objects with deleting each element inside

        Example of allEvidence:
        const allEvidence = [];
 
        export function getAllEvidence() {
        return allEvidence; //keeping the original array and returning it
        }
        
        export function setAllEvidence(evidence) {
        const newEvidence = [...evidence];
        
        allEvidence.length = 0; //making a copy and replace the content instead of = evidence
        allEvidence.push(...newEvidence);
        }

- because of setting "= evidence e.g." inside the array it replaces it completely instead of adding or deleting elements inside of the array

        Example of an object:
        const caseData = {};

        export function getCaseData() {
            return caseData; //keeping the original object
        }

        export const setCaseData = (data) => {
            Object.assign(caseData, data);
        }

        //or other version: 
        export function setCaseData(data) {
            const newData = { ...data }; //like in arrays
            Object.keys(caseData).forEach((key) => {    //getting the keys and deleting the elements with their corresponding keys
                delete caseData[key];
            })

            Object.assign(caseData, newData); //Reassigning the data in the object, rather than just plow through it with = data
        }

## Code smells

> One code smell is the exports which are unnecessary. 

- Leaving exports in, even though they are not wanted, can lead to exploiting the details of the method if not needed
- Unwanted access so to speak


> Another code smell: duplication of eventListeners

- I found the same addEventListener() in two different .js files (setup.js and app.js) --> for the hashFunction
- I can safely remove one, because the eventListener is already added and works throughout the application

- An action/event trigger should only be done by one - not more


# Demo 9 - Nested promises

> Find the most deeply nested chain of `.then()`

![alt text](/resources/documentation_images/then_nested_chain.png)
When looking for then(), you get a lot of then() in api.js

The most deeply nested from then was the method loadCorePeopleAndLocations()
- fetch case, then caseRes.json (parsing) -> up to returning again a fetch of people and parsing the json
- Afterwards again --> fetching all locations and then parse those too --> deep in callbacks

Inside everything we hide the loading step, render the dashboard and populateAllDropdowns. Problem with this is, that each operation has to wait for the other one to finish beforehand to be used

> Rewritten in the way that is needed:Rewrite it as an `async` function using `await`, preserving its exact current behavior **including** that it currently loads its requests one after another rather than in parallel

        export async function loadCorePeopleAndLocations() {
        const caseRes = await fetch("data/case.json");
        const caseJson = await caseRes.json();
        state.setCaseData(caseJson);

        //or maybe also refactor it by state.setCaseData(await caseRes.json()) instead of the extra variable? But more readable perhaps with more? I will use more

        const peopleRes = await fetch("data/people.json");
        const peopleJson = await peopleRes.json();
        state.setAllPeople(peopleJson);

        const locationsRes = await fetch("data/locations.json");
        const locationsJson = await locationsRes.json();
        state.setAllLocations(locationsJson);

        hideLoadingStep();
        renderDashboard();
        populateAllDropdowns();
        }

an async function but also no parallel behaviour - so the exact same without the nested chain


# Demo 10 Arrow functions
> All refactored arrow functions have been marked with a comment
> I looked for smaller functions, just because it is easier to distinguish what to do

All other changes and questions answered are in the Exercise.md file!






