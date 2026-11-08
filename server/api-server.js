import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const port = Number(process.env.PORT) || 3001;
const dataDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
);

const resources = new Map([
  ["/api/case", "case.json"],
  ["/api/evidence", "evidence.json"],
  ["/api/people", "people.json"],
  ["/api/locations", "locations.json"],
  ["/api/timeline", "timeline.json"],
]);

function writeJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  response.end(JSON.stringify(body));
}

function getDelay(searchParams) {
  const requestedDelay = Number(searchParams.get("delay") ?? 0);
  return Number.isFinite(requestedDelay) && requestedDelay > 0
    ? Math.min(Math.floor(requestedDelay), 30_000)
    : 0;
}

//Exercise 6 - Demo 4: a small read-only backend exposes the same JSON
//resources as the frontend data files and provides delay/error controls.
const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  if (request.method !== "GET") {
    writeJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const requestUrl = new URL(
    request.url ?? "/",
    `http://${request.headers.host ?? "localhost"}`,
  );
  const fileName = resources.get(requestUrl.pathname);

  if (!fileName) {
    writeJson(response, 404, { error: "Resource not found" });
    return;
  }

  const delay = getDelay(requestUrl.searchParams);
  const shouldFail = ["1", "true"].includes(
    requestUrl.searchParams.get("error") ?? "",
  );

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  if (shouldFail) {
    writeJson(response, 500, { error: "Deliberate Demo 4 failure" });
    return;
  }

  //Exercise 6 - Demo 6: return a successful empty collection for the
  //frontend empty-state demonstration without changing stored JSON files.
  if (
    ["1", "true"].includes(requestUrl.searchParams.get("empty") ?? "") &&
    fileName !== "case.json"
  ) {
    writeJson(response, 200, []);
    return;
  }

  try {
    const contents = await readFile(path.join(dataDirectory, fileName), "utf8");
    writeJson(response, 200, JSON.parse(contents));
  } catch (error) {
    console.error(`Could not read ${fileName}`, error);
    writeJson(response, 500, { error: "Could not read data resource" });
  }
});

server.listen(port, () => {
  console.log(`ReMotion API listening on http://localhost:${port}`);
});
