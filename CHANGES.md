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

## Problems with the first part:

Difficulty lie therein that I have forgotten how to implement and code with .js and node.
I forgot to test after each change and now I am deep within refactoring to make it work with all the imports and exports needed
- Gone through devTools and bugfix to have it at the state of the beginning - where the imports and exports can communicate with each other
- Live Server works perfectly without any problems. Terminal does what it is supposed to do. I am not sure if the tabs should work, have to see for the other demos



