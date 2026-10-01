import {
  getAllEvidence,
  getAllPeople,
  getAllLocations,
} from "../state/globalState.ts";
import type {
  Evidence,
  EvidenceId,
  Location,
  LocationId,
  Person,
  PersonId,
} from "../types/domain.ts";
// ---------------------------------------------------------------------
// GENERIC LOOKUP HELPERS
// ---------------------------------------------------------------------

export function findEvidenceById(id: EvidenceId): Evidence | null {
  const allEvidence = getAllEvidence();
  return allEvidence.find((evidenceItem) => evidenceItem.id === id) ?? null;
}

export function findPersonById(id: PersonId): Person | null {
  const allPeople = getAllPeople();
  return allPeople.find((person) => person.id === id) ?? null;
}

export function findLocationById(id: LocationId): Location | null {
  const allLocations = getAllLocations();
  return allLocations.find((location) => location.id === id) ?? null;
}

//Demo 6: after modelling Evidence.personIds as PersonId[], only IDs are valid.
// The name-based fallback existed only because E04 stored "Nova Byte" instead of "nova-byte".
export const evidenceMentionsPerson = (
  evidence: Evidence,
  person: Person,
): boolean => {
  return evidence.personIds.includes(person.id);
};
