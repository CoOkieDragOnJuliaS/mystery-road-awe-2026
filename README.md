# Project ReMotion – Investigation Portal

Investigate the failure of an AI-assisted rehabilitation robot.

## About

Project ReMotion is a browser-based investigation platform built around a fictional incident.
During a pre-demonstration calibration test, the AI-assisted rehabilitation robot **ReMotion**
loaded the wrong calibration profile and triggered its emergency stop. This application lets an
investigator review the evidence, people, locations, and timeline surrounding the incident, and
build up a working hypothesis about what happened.

This repository contains an existing vanilla-JavaScript (no frameworks used) investigation application. The system is
functional but has accumulated technical debt and inconsistent implementation decisions. Your task
during the course will be to analyse, maintain, refactor, migrate, and extend it.

## Running the application

This application uses `fetch()` to load its case data from local JSON files, so it must be served
over HTTP — opening `index.html` directly from the filesystem (`file://`) will not work in most
browsers.

Any static file server will do. For example, from the project root:

```bash
# Python 3
python -m http.server 8080

# Node.js (no install required)
npx serve .

# VS Code
# Use the "Live Server" extension
```

Then open `http://localhost:8080` (or whatever port your server prints) in your browser.

## Demo 4 development backend

<!-- //Exercise 6 - Demo 4: document the local backend separately from the
     static frontend deployment. -->

The read-only Demo 4 backend is a local development server and is not part of
the Exercise 2 GitHub Pages deployment. Start it from the project root with:

```bash
node server/api-server.js
```

It listens on `http://localhost:3001` and exposes:

- `GET /api/case`
- `GET /api/evidence`
- `GET /api/people`
- `GET /api/locations`
- `GET /api/timeline`

The endpoints read the matching JSON files from `public/data/` and do not
provide write operations or persistence. For later effect and request demos,
append `?delay=2000` to delay a response or `?error=1` to return a deliberate
HTTP 500 response. The server allows cross-origin requests from the Vite
frontend through its CORS response headers.

## Features

- **Dashboard** — case summary and key statistics calculated from the loaded case data.
- **Evidence catalogue** — search, filter (by type, person, location, status, relevance), sort,
  bookmark, and open detailed evidence records.
- **People & Locations** — profile cards for the investigation team and the six key locations.
- **Timeline** — chronological view of case events with filtering and links to related evidence.
- **Investigator workspace** — bookmarked evidence, personal notes, and a hypothesis draft form.
  Workspace data is saved to your browser's local storage and will still be there when you reload
  the page.

## Browser requirements

A recent version of any evergreen desktop browser (Chrome, Firefox, Edge, Safari). JavaScript must
be enabled. The layout targets common desktop and tablet widths.

## Project status

This is an existing brownfield application, not a fresh scaffold. It works for everyday use, but
you should expect to find rough edges, inconsistent patterns, and a handful of bugs as you work
with it — that discovery process is part of the course.
