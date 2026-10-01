export const PERSON_IDS = [
  "signal-scholar",
  "kernel-colt",
  "nova-byte",
  "patch-vector",
  "refactor-rex",
  "root-harbor",
] as const;

export type PersonId = (typeof PERSON_IDS)[number];

export const LOCATION_IDS = ["L01", "L02", "L03", "L04", "L05", "L06"] as const;
export type LocationId = (typeof LOCATION_IDS)[number];

export type EvidenceId = `E${number}`;
export type TimelineEventId = `T${number}`;

export function isPersonId(value: string): value is PersonId {
  return (PERSON_IDS as readonly string[]).includes(value);
}

export function isLocationId(value: string): value is LocationId {
  return (LOCATION_IDS as readonly string[]).includes(value);
}

export function isEvidenceId(value: string): value is EvidenceId {
  return /^E\d+$/.test(value);
}

export type CaseStatus = "open";
//Demo 6: JSON had one capitalized pair ("Reviewed"/"Unknown"); the domain uses lowercase.
export const EVIDENCE_STATUSES = ["unreviewed", "reviewed", "flagged"] as const;
export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];
export const EVIDENCE_RELEVANCES = [
  "unknown",
  "relevant",
  "irrelevant",
] as const;
export type EvidenceRelevance = (typeof EVIDENCE_RELEVANCES)[number];
export const TIMELINE_CERTAINTIES = [
  "confirmed",
  "reported",
  "contradictory",
] as const;
export type TimelineCertainty = (typeof TIMELINE_CERTAINTIES)[number];

export function isEvidenceStatus(value: string): value is EvidenceStatus {
  return (EVIDENCE_STATUSES as readonly string[]).includes(value);
}

export function isEvidenceRelevance(value: string): value is EvidenceRelevance {
  return (EVIDENCE_RELEVANCES as readonly string[]).includes(value);
}

export function isTimelineCertainty(value: string): value is TimelineCertainty {
  return (TIMELINE_CERTAINTIES as readonly string[]).includes(value);
}

export interface CaseData {
  caseId: string;
  title: string;
  subtitle: string;
  status: CaseStatus;
  opened: string;
  summary: string;
  location: string;
  leadInvestigator: string;
  notes: string;
}

export interface Evidence {
  id: EvidenceId;
  type: string;
  title: string;
  timestamp: string;
  summary: string;
  content: string;
  //Demo 6: this field is normalized to IDs only; E04 previously stored the name "Nova Byte".
  personIds: PersonId[];
  locationIds: LocationId[];
  tags: string[];
  status: EvidenceStatus;
  relevance: EvidenceRelevance;
  bookmarked?: boolean;
}

export interface Person {
  id: PersonId;
  name: string;
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string;
}

export interface Location {
  id: LocationId;
  name: string;
  description: string;
  contains: string[];
}

export interface TimelineEvent {
  id: TimelineEventId;
  time: string;
  title: string;
  description: string;
  type: string;
  certainty: TimelineCertainty;
  personIds: PersonId[];
  locationIds: LocationId[];
  evidenceIds: EvidenceId[];
}

//Demo 7: these UI/state types keep navigation and storage values restricted.
export const VIEW_NAMES = [
  "dashboard",
  "evidence",
  "people",
  "timeline",
  "workspace",
] as const;
export type ViewName = (typeof VIEW_NAMES)[number];

export function isViewName(value: string): value is ViewName {
  return (VIEW_NAMES as readonly string[]).includes(value);
}
export type PeopleTab = "people" | "locations";
export type NotesStore = Partial<Record<EvidenceId, string>>;

export interface ViewRendered {
  dashboard: boolean;
  evidence: boolean;
  people: boolean;
  timeline: boolean;
  workspace: boolean;
}

export interface HypothesisDraft {
  suspectId: PersonId | "";
  nature: string;
  evidenceIds: EvidenceId[];
  confidence: number;
  explanation: string;
  alternative: string;
  savedAt?: string;
}
