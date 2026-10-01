import * as state from "../state/globalState.ts";
import {
  findLocationById,
  findEvidenceById,
} from "../utils/lookupHelpers.ts";
import { formatDate } from "../utils/dateHelper.ts";
import { openEvidenceDetail } from "./evidenceDetails.ts";
import { navigateTo } from "../navigation/router.ts";
import { getElement, getRequiredElement } from "../utils/dom.ts";
import {
  isEvidenceId,
  isTimelineCertainty,
  type EvidenceId,
  type TimelineCertainty,
  type TimelineEvent,
} from "../types/domain.ts";
// ---------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------

export function populateTimelineDropdowns(): void {
  const personSelect = getElement<HTMLSelectElement>(
    "timelinePersonFilter",
  );
  const locationSelect = getElement<HTMLSelectElement>(
    "timelineLocationFilter",
  );
  const typeSelect = getElement<HTMLSelectElement>("timelineTypeFilter");
  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';
  for (const person of state.getAllPeople()) {
    personSelect.innerHTML +=
      '<option value="' + person.id + '">' + person.name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (const location of state.getAllLocations()) {
    locationSelect.innerHTML +=
      '<option value="' +
      location.id +
      '">' +
      location.id +
      "</option>";
  }

  const types: string[] = [];
  for (const timelineEvent of state.getAllTimeline()) {
    if (!types.includes(timelineEvent.type)) {
      types.push(timelineEvent.type);
    }
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (const type of types) {
    typeSelect.innerHTML +=
      '<option value="' + type + '">' + type + "</option>";
  }
}

export function renderTimeline(): void {
  const container = getElement<HTMLElement>("timelineContainer");
  if (!container) return;

  const order = getRequiredElement<HTMLSelectElement>("timelineOrder").value;
  const personFilter = getRequiredElement<HTMLSelectElement>(
    "timelinePersonFilter",
  ).value;
  const locationFilter = getRequiredElement<HTMLSelectElement>(
    "timelineLocationFilter",
  ).value;
  const typeFilter = getRequiredElement<HTMLSelectElement>(
    "timelineTypeFilter",
  ).value;

  let events: TimelineEvent[] = [];
  for (const timelineEvent of state.getAllTimeline()) {
    if (
      personFilter &&
      !timelineEvent.personIds.some(
        (personId) => personId === personFilter,
      )
    )
      continue;
    if (
      locationFilter &&
      !timelineEvent.locationIds.some(
        (locationId) => locationId === locationFilter,
      )
    )
      continue;
    if (typeFilter && timelineEvent.type !== typeFilter) continue;
    events.push(timelineEvent);
  }

  events = events.slice().sort(function (a, b) {
    const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
    return order === "desc" ? -diff : diff;
  });

  let html = "";
  for (const item of events) {
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    const eventLocationNames: string[] = [];
    for (const locationId of item.locationIds) {
      const eventLocation = findLocationById(locationId);
      eventLocationNames.push(
        eventLocation ? eventLocation.name : locationId,
      );
    }
    if (eventLocationNames.length > 0) {
      html +=
        '<p class="evidence-meta">Location: ' +
        eventLocationNames.join(", ") +
        "</p>";
    }

    for (const evidenceId of item.evidenceIds) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        evidenceId +
        '">View ' +
        evidenceId +
        "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  // Refactor to arrow function
  const linkButtons = container.querySelectorAll<HTMLElement>(
    ".evidence-link-btn",
  );
  linkButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.currentTarget;
      if (!(target instanceof HTMLElement)) return;

      const evidenceId = target.dataset.evidenceId;
      if (evidenceId && isEvidenceId(evidenceId)) {
        openEvidenceModal(evidenceId);
      }
    });
  });
}

// --- Quick-view modal (used from the timeline) -------------------------
export function openEvidenceModal(evidenceId: EvidenceId): void {
  const evidenceItem = findEvidenceById(evidenceId);
  if (!evidenceItem) return;

  let modal = getElement<HTMLElement>("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    evidenceItem.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    evidenceItem.id +
    " &middot; " +
    evidenceItem.type +
    " &middot; " +
    formatDate(evidenceItem.timestamp) +
    "</p>" +
    "<p>" +
    evidenceItem.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    evidenceItem.id +
    '">Open full evidence</button>' +
    "</div></div>";

  state.incrementModalCloseListenerCount();
  console.log(
    "modal opened, active close listeners:",
    state.getModalCloseListenerCount(),
  );

  //Demo 7: a named Event listener is needed because removeEventListener needs a function reference.
  const handleModalClick = (e: Event): void => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (
      target.classList.contains("modal-close-btn") ||
      target.classList.contains("modal-backdrop")
    ) {
      modal.innerHTML = "";
      // Trying out the counter for modal close listeners bug in Demo 4
      // by passing the event to the removeEventListener function it works as expected
      modal.removeEventListener("click", handleModalClick);
      state.decrementModalCloseListenerCount();
      console.log(
        "modal closed, active close listeners:",
        state.getModalCloseListenerCount(),
      );
      return;
    }

    const openFullId = target.dataset.openFull;
    if (openFullId && isEvidenceId(openFullId)) {
      modal.innerHTML = "";
      navigateTo("evidence");
      setTimeout(function () {
        openEvidenceDetail(openFullId);
      }, 0);
    }
  };

  modal.addEventListener("click", handleModalClick);
}

function certaintyBadgeClass(
  certainty: TimelineCertainty | string,
): string {
  //Demo 7: DOM-facing certainty values are narrowed to the known union.
  const normalizedCertainty = isTimelineCertainty(certainty)
    ? certainty
    : "reported";
  if (normalizedCertainty === "confirmed") return "reviewed";
  if (normalizedCertainty === "contradictory") return "critical";
  if (normalizedCertainty === "reported") return "flagged";
  return "unreviewed";
}
