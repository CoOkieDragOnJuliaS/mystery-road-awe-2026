function sandboxFunction() {
  //Operations and then return a HTML
  //className attributed translates to class in HTML, because class is a reserved word in JS
  const thisIsAnElement = <h2 className="test-element">Test Element</h2>;

  {
    /* JSX follows XML rules, HTML must be closed*/
  }
  const newElement = <input type="text" placeholder="Enter text here" />;

  return (
    <div>
      <h1>Sandbox</h1>
      <p>This is a sandbox for testing and experimenting with code.</p>
      {thisIsAnElement}
      {newElement}
      {/* This is a comment in JSX ! */}
    </div>
  );
}

// Render the sandboxFunction component into the DOM
//What does this do?
/*JSX allows us to write HTML elements in JavaScript and place them in the DOM without any createElement()  and/or appendChild() methods.
JSX converts HTML tags into react elements.*/
createRoot(document.getElementById("sandbox-root")).render(<sandboxFunction />);
