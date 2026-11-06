//Exercise 5 - Demo 1 Workspace as a static page

import * as state from "../../../state/globalState.ts";
import { BookmarksList } from "./BookmarksList";
import { HypothesisForm } from "./HypothesisForm.tsx";
import { NotesList } from "./NotesList";
import {
  loadHypothesisFromStorage,
  saveHypothesisDraft,
} from "../../../storage/localStorage.ts";
import type { EvidenceId } from "../../../types/domain.ts";

interface WorkspacePageProps {
  bookmarkIds: EvidenceId[];
}

export function WorkspacePage({ bookmarkIds }: WorkspacePageProps) {
  const allEvidence = state.getAllEvidence();
  //Exercise 5 - Demo 5: derive the list from bookmark props owned by App.
  const bookmarkedItems = allEvidence.filter((item) =>
    bookmarkIds.includes(item.id),
  );
  const hypothesisDraft = loadHypothesisFromStorage();

  return (
    <section id="view-workspace" className="view active">
      <h2>Workspace</h2>

      <div className="workspace-grid">
        <section id="workspace-bookmarks" className="bookmarks-list">
          <BookmarksList bookmarkedItems={bookmarkedItems} />
        </section>

        <section id="workspace-notes" className="notes-list">
          <NotesList
            notes={state.getNotesStore()}
            evidenceItems={allEvidence}
          />
        </section>

        <section id="workspace-hypotheses" className="hypothesis-card">
          <HypothesisForm
            people={state.getAllPeople()}
            evidence={allEvidence}
            hypothesisDraft={hypothesisDraft}
            onSave={saveHypothesisDraft}
          />
        </section>
      </div>
    </section>
  );
}
