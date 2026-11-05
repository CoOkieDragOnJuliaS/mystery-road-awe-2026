import {
  isLocationId,
  isPersonId,
  type Evidence,
  type EvidenceFilterValues,
} from "../../../types/domain.ts";

export function filterEvidence(
  evidence: Evidence[],
  filters: EvidenceFilterValues,
): Evidence[] {
  return [...evidence]
    .filter((item) => {
      const searchText = [item.title, item.summary, ...item.tags]
        .join(" ")
        .toLowerCase();

      return (
        searchText.includes(filters.searchTerm.toLowerCase()) &&
        (!filters.type || item.type === filters.type) &&
        (!filters.personId ||
          (isPersonId(filters.personId) &&
            item.personIds.includes(filters.personId))) &&
        (!filters.locationId ||
          (isLocationId(filters.locationId) &&
            item.locationIds.includes(filters.locationId))) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.relevance || item.relevance === filters.relevance)
      );
    })
    .sort((a, b) => {
      if (filters.sortOption === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      if (filters.sortOption === "title-desc") {
        return b.title.localeCompare(a.title);
      }

      const difference =
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();

      return filters.sortOption === "date-asc" ? difference : -difference;
    });
}
