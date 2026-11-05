import type { Evidence } from "../../../types/domain.ts";

/*
 * Exercise 5 Demo 1 - building static bookmarks list component
 */
interface BookmarksListProps {
  bookmarkedItems: Evidence[];
}

//I am getting the bookmarks from the "parent component" and call it with the bookmarked element
export function BookmarksList({ bookmarkedItems }: BookmarksListProps) {
  // Not only bookmarks, but I render them by filtering the evidence with the bookmarks?
  // const bookmarks = state.getBookmarks();

  return (
    <div id="bookmarkslist">
      {bookmarkedItems.length === 0 ? (
        <p>No bookmarked items loaded yet.</p>
      ) : (
        bookmarkedItems.map((item) => (
          <div key={item.id} className="mini-list-item">
            <h4>{item.title}</h4>
          </div>
          //Not a button implemented yet
        ))
      )}
    </div>
  );
}
