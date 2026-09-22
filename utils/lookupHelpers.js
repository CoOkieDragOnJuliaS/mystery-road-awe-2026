import { getAllEvidence, getAllPeople, getAllLocations } from "../state/globalState.js";
// ---------------------------------------------------------------------
// GENERIC LOOKUP HELPERS
// ---------------------------------------------------------------------

export function findEvidenceById(id) {
  var allEvidence = getAllEvidence();
  for (var i = 0; i < allEvidence.length; i++) {
    if (allEvidence[i].id === id) return allEvidence[i];
  }
  return null;
}

export function findPersonById(id) {
  var allPeople = getAllPeople();
  for (var i = 0; i < allPeople.length; i++) {
    if (allPeople[i].id === id) return allPeople[i];
  }
  return null;
}

export function findLocationById(id) {
  var allLocations = getAllLocations();
  for (var i = 0; i < allLocations.length; i++) {
    if (allLocations[i].id === id) return allLocations[i];
  }
  return null;
}

// Refactor to arrow function
export const evidenceMentionsPerson = (ev, person) => {
  if (!ev.personIds) return false;
  return ev.personIds.indexOf(person.id) !== -1 ||
   ev.personIds.indexOf(person.name) !== -1;
};

export function formatDate(ts) {
  if (!ts) return "Unknown date";
  var d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

// Refactor to arrow function
export const getStatusBadgeClass = (status) => {
  const s = (status || "").toLowerCase();
 
  if (s === "reviewed") return "badge-reviewed";
  if (s === "flagged") return "badge-flagged";
  
  return "badge-unreviewed";
};

// Refactor to arrow function
export const getRelevanceBadgeClass = (relevance) => {
  const r = (relevance || "").toLowerCase();
  if (r === "relevant") return "badge-relevant";
  return "badge-unreviewed";
};
