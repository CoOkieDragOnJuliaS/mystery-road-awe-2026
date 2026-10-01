import * as state from "../state/globalState.ts";
import { evidenceMentionsPerson } from "../utils/lookupHelpers.ts";
import { navigateTo } from "../navigation/router.ts";
import { renderEvidenceList } from "./evidenceBasic.ts";
import { getElement, getRequiredElement } from "../utils/dom.ts";
import { isPersonId, type Person, type PeopleTab } from "../types/domain.ts";
// ---------------------------------------------------------------------
// PEOPLE & LOCATIONS
// ---------------------------------------------------------------------

export function switchPeopleTab(tab: PeopleTab): void {
  state.setCurrentPeopleTab(tab);
  const peoplePanel = getRequiredElement<HTMLElement>("peoplePanel");
  const locationsPanel = getRequiredElement<HTMLElement>("locationsPanel");
  const peopleTabBtn = getRequiredElement<HTMLElement>("tabPeopleBtn");
  const locationsTabBtn = getRequiredElement<HTMLElement>("tabLocationsBtn");

  if (tab === "people") {
    peoplePanel.classList.remove("hidden");
    locationsPanel.classList.add("hidden");
    peopleTabBtn.classList.add("active");
    locationsTabBtn.classList.remove("active");
  } else {
    peoplePanel.classList.add("hidden");
    locationsPanel.classList.remove("hidden");
    peopleTabBtn.classList.remove("active");
    locationsTabBtn.classList.add("active");
  }
}

export function countEvidenceForPerson(person: Person): number {
  return state
    .getAllEvidence()
    .filter((evidenceItem) => evidenceMentionsPerson(evidenceItem, person))
    .length;
}

export function renderPeople(): void {
  const container = getElement<HTMLElement>("peoplePanel");
  if (!container) return;

  let html = "";
  for (const person of state.getAllPeople()) {
    const count = countEvidenceForPerson(person);

    html += '<div class="person-card">';
    html += '<div class="person-card-header">';
    html +=
      '<img class="person-avatar" src="' +
      person.avatar +
      '" alt="Portrait of ' +
      person.name +
      '">';
    html +=
      "<div><h3>" +
      person.name +
      '</h3><div class="person-role">' +
      person.role +
      "</div></div>";
    html += "</div>";
    html += "<p><strong>Speciality:</strong> " + person.speciality + "</p>";
    html += "<ul>";
    for (const responsibility of person.responsibilities) {
      html += "<li>" + responsibility + "</li>";
    }
    html += "</ul>";
    html +=
      '<div class="person-statement">&ldquo;' +
      person.statement +
      "&rdquo;</div>";
    html +=
      "<p>" +
      count +
      " related evidence item" +
      (count === 1 ? "" : "s") +
      " &mdash; ";
    html +=
      '<button type="button" class="evidence-count-link" data-person-id="' +
      person.id +
      '">view</button></p>';
    html += "</div>";
  }
  container.innerHTML = html;

  const links = container.querySelectorAll<HTMLElement>(".evidence-count-link");
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = e.currentTarget;
      if (!(target instanceof HTMLElement)) return;

      const personId = target.dataset.personId;
      //Demo 7: the data attribute is narrowed before it is used as a PersonId.
      if (!personId || !isPersonId(personId)) return;

      getRequiredElement<HTMLSelectElement>("filterPerson").value = personId;
      navigateTo("evidence");
      setTimeout(function () {
        renderEvidenceList();
      }, 0);
    });
  });
}

export function renderLocations(): void {
  const container = getElement<HTMLElement>("locationsPanel");
  if (!container) return;

  let html = "";
  for (const location of state.getAllLocations()) {
    html += '<div class="location-card">';
    html += "<h3>" + location.id + " &mdash; " + location.name + "</h3>";
    html += "<p>" + location.description + "</p>";
    html += "<p><strong>Contains:</strong></p><ul>";
    for (const item of location.contains) {
      html += "<li>" + item + "</li>";
    }
    html += "</ul></div>";
  }
  container.innerHTML = html;
}
