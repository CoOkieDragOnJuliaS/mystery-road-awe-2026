import { useSearchParams } from "react-router-dom";
import * as state from "../../../state/globalState.ts";
import { isPersonId } from "../../../types/domain.ts";
import { TimelineFilters } from "./TimelineFilters.tsx";
import { TimelineList } from "./TimelineList.tsx";

//Exercise 4 Demo 5: feature/container component — owns data selection
// (query param, filtering, ordering) and hands finished arrays down to the
// presentational TimelineFilters/TimelineList.
export function TimelinePage() {
  //Exercise 4 Demo 10: read the ?person= query parameter once to parameterize
  // the initial render. useSearchParams().get() returns string | null, so the
  // value is narrowed with isPersonId before it is used as a PersonId.
  const [searchParams] = useSearchParams();
  const rawPerson = searchParams.get("person");
  const initialPerson =
    rawPerson && isPersonId(rawPerson) ? rawPerson : undefined;

  //Ordering replaces the sort in renderTimeline() (asc = "Oldest first").
  //The person filter is applied only for the initial render from the URL;
  //interactive filter changes are Exercise 5 scope.
  const events = [...state.getAllTimeline()]
    .filter(
      (event) => !initialPerson || event.personIds.includes(initialPerson),
    )
    .sort((a, b) => +new Date(a.time) - +new Date(b.time));

  return (
    <section id="view-timeline" className="view active">
      <h2>Investigation Timeline</h2>
      <TimelineFilters initialPerson={initialPerson} />
      <TimelineList events={events} />
    </section>
  );
}
