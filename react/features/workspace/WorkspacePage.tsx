//Exercise 5 - Demo 1 Workspace as a static page

import * as state from "../../../state/globalState.ts";
import { BookmarksList } from "./BookmarksList";
import { HypothesisForm } from "./HypothesisForm.tsx";
import { NotesList } from "./NotesList";
import {
  loadHypothesisFromStorage,
  saveHypothesisDraft,
} from "../../../storage/localStorage.ts";
import type { NotesStore } from "../../../types/domain.ts";
import { useBookmarks } from "../../app/BookmarkContext.tsx";

interface WorkspacePageProps {
  notes: NotesStore;
}

export function WorkspacePage({
  notes,
}: WorkspacePageProps) {
  const { bookmarkIds } = useBookmarks();
  const allEvidence = state.getAllEvidence();
  //Exercise 5 - Demo 8: derive the list from bookmark Context state.
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
            notes={notes}
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
