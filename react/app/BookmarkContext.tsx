import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { saveBookmarksToStorage } from "../../storage/localStorage.ts";
import * as state from "../../state/globalState.ts";
import type { EvidenceId } from "../../types/domain.ts";

interface BookmarkContextValue {
  bookmarkIds: EvidenceId[];
  onToggleBookmark: (id: EvidenceId) => void;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

interface BookmarkProviderProps {
  children: ReactNode;
}

//Exercise 5 - Demo 8: Context distributes bookmark state to the route tree.
export function BookmarkProvider({ children }: BookmarkProviderProps) {
  const [bookmarkIds, setBookmarkIds] = useState<EvidenceId[]>(() =>
    state.getBookmarks(),
  );

  function onToggleBookmark(id: EvidenceId): void {
    const next = bookmarkIds.includes(id)
      ? bookmarkIds.filter((currentId) => currentId !== id)
      : [...bookmarkIds, id];

    setBookmarkIds(next);
    state.setBookmarks(next);
    saveBookmarksToStorage();
  }

  return (
    <BookmarkContext.Provider value={{ bookmarkIds, onToggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextValue {
  const value = useContext(BookmarkContext);

  if (!value) {
    throw new Error("useBookmarks must be used inside BookmarkProvider");
  }

  return value;
}
