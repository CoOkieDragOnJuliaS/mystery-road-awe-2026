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

## The bug for Demo 4 - a silent bug

 > There is still the Promise, which is always there when I first start the app, but I don't know if it is a bug or not or how it should look like
 > There is also an interesting thing about the modal windows in the timeline, I opened 2 or 3 and closed them and watched the console add it up to a counter - which may never go down? Perhaps it is only resetted after I go to the evidenceDetails itself?

 ![alt text](/resources/documentation_images/modal_counter.png)

**How to resolve it**?

 ## Demo 5 walkthrough - maybe Demo 4 or Demo 3 because it is easier to show?

