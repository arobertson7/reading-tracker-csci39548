import type { UserLibraryBook } from "./Book";

function getFilterEmptyStateInfo(filter: string) {
  switch (filter) {
    case "To Read":
      return {
        icon: "📖",
        title: "No Books to Read",
        description: "Your reading list is empty. Find your next great read and add it here!"
      };
    case "Reading":
      return {
        icon: "⚡",
        title: "No Books in Progress",
        description: "You aren't reading any books right now. Start reading a book from your library to track your progress!"
      };
    case "Finished":
      return {
        icon: "✨",
        title: "No Finished Books",
        description: "You haven't completed any books yet. Keep reading, you'll reach the finish line soon!"
      };
    default:
      return {
        icon: "🔍",
        title: "No Books Found",
        description: `No books in your library match the "${filter}" filter.`
      };
  }
};

function getAverageBookRating(books: UserLibraryBook[]) {
  const rated_books = books.filter((book) => book.rating)
  const avg_rating = (
    rated_books.reduce((acc, book) => {
      return book.rating ? acc + book.rating : 0
    }, 0)
  ) / rated_books.length

  return avg_rating.toFixed(1)
}

export { getFilterEmptyStateInfo, getAverageBookRating };