import {
  getAllEvidence,
  getAllPeople,
  getAllLocations,
} from "../state/globalState.js";
// ---------------------------------------------------------------------
// GENERIC LOOKUP HELPERS
// ---------------------------------------------------------------------


export function findEvidenceById(id) {
  const allEvidence = getAllEvidence();
  for (let i = 0; i < allEvidence.length; i++) {
    if (allEvidence[i].id === id) return allEvidence[i];
  }
  return null;
}

export function findPersonById(id) {
  const allPeople = getAllPeople();
  for (let i = 0; i < allPeople.length; i++) {
    if (allPeople[i].id === id) return allPeople[i];
  }
  return null;
}

export function findLocationById(id) {
  const allLocations = getAllLocations();
  for (let i = 0; i < allLocations.length; i++) {
    if (allLocations[i].id === id) return allLocations[i];
  }
  return null;
}

// Refactor to arrow function
export const evidenceMentionsPerson = (ev, person) => {
  if (!ev.personIds) return false;
  return (
    ev.personIds.indexOf(person.id) !== -1 ||
    ev.personIds.indexOf(person.name) !== -1
  );
};
