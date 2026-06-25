import { useState } from 'react'
import './App.css'
import { type Book, type UserLibraryBook, type ReadingStatus, type BookRating } from './Book.tsx'
import { UserLibraryBookCard } from './UserLibraryBookCard.tsx'
import { SearchResultBookCard } from './SearchResultBookCard'
import SearchBar from './SearchBar'
import { type OpenLibraryBook } from './OpenLibraryBook'
import noBookCover from './assets/no-cover.png'

import oneFishTwoFish from './assets/one-fish-two-fish.jpg'; // temporary for sample book cover
import breakfastOfCHampions from './assets/breakfast-of-champions.jpg' // temporary for sample book cover
import greenwichPark from './assets/greenwich-park.jpg' // temporary for sample book cover
import unbearable from './assets/unbearable.jpg' // temporary for sample book cover

function App() {
  const [displayMode, setDisplayMode] = useState<string>("userLibrary"); // "userLibrary" or "searchBooks"

  const [userLibraryBooks, setUserLibraryBooks] = useState<UserLibraryBook[]>([
    { id: "1", title: "One Fish, Two Fish, Red Fish, Blue Fish", author: "Dr. Seuss", year_published: 1960, cover_url: oneFishTwoFish, readingStatus: 'finished', rating: 4, dateAdded: new Date() },
    { id: "2", title: "Breakfast of Champions", author: "Kurt Vonnegut", year_published: 1973, cover_url: breakfastOfCHampions, readingStatus: 'to-read', rating: 4, dateAdded: new Date() },
    { id: "3", title: "Greenwich Park", author: "Katherine Faulkner", year_published: 2021, cover_url: greenwichPark, readingStatus: 'to-read', dateAdded: new Date() },
    { id: "4", title: "The Unbearable Lightness of Being", author: "Milan Kundera", year_published: 1984, cover_url: unbearable, readingStatus: 'to-read', dateAdded: new Date() }
  ]);
  const [searchResultBooks, setSearchResultBooks] = useState<Book[]>([]);

  const OPEN_LIBRARY_URL = "https://openlibrary.org/search.json?q="; // simply append the query to the end

  async function fetchSearchResults(query: string) {
    try {
      const url = OPEN_LIBRARY_URL + query + "&limit=10";
      const response = await fetch(url);
      const data = await response.json();

      const book_results = data.docs as OpenLibraryBook[];
      const updatedsearchResultBooks: Book[] = book_results.map((book_data) => ({
        id: book_data.key,
        title: book_data.title,
        author: book_data.author_name ? book_data.author_name.join(", ") : "Unknown Author",
        year_published: book_data.first_publish_year,
        cover_url: book_data.cover_i ? `https://covers.openlibrary.org/b/id/${book_data.cover_i}-M.jpg` : noBookCover
      }));

      setSearchResultBooks(updatedsearchResultBooks);

    } catch (error) {
      console.error("Error fetching library results:", error);
      setSearchResultBooks([]);
    }
  }

  function inUserLibrary(bookId: string) {
    for (const userLibraryBook of userLibraryBooks) {
      if (userLibraryBook.id === bookId) return true;
    }
    return false;
  }

  function toggleAddToUserLibrary(book: Book) {
    if (inUserLibrary(book.id)) { // remove from library
      removeFromUserLibrary(book);
    } else { // else add to library
      addToUserLibrary(book);
    }
  }

  function addToUserLibrary(book: Book) {
    setUserLibraryBooks([...userLibraryBooks, {
      id: book.id,
      title: book.title,
      author: book.author,
      year_published: book.year_published,
      cover_url: book.cover_url,
      readingStatus: 'to-read',
      dateAdded: new Date()
    }]);
  }

  function removeFromUserLibrary(book: Book) {
    setUserLibraryBooks(userLibraryBooks.filter((userLibraryBook) => userLibraryBook.id !== book.id));
  }

  function updateBookReadingStatus(bookId: string, newReadingStatus: string) {
    if (newReadingStatus !== 'to-read' && newReadingStatus !== 'reading' && newReadingStatus !== 'finished') {
      return; // double check that newReadingStatus is a valid ReadingStatus before changing
    }
    setUserLibraryBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? {
          ...book, readingStatus: newReadingStatus as ReadingStatus,
          rating: undefined // any change in reading status would logically reset the rating
        } : book
      )
    )
  }

  function updateBookRating(bookId: string, rating: number) {
    setUserLibraryBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, rating: rating as BookRating } : book
      )
    )
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <header className="sidebar-header">
          <h1>Reading Tracker</h1>
          <p className="tagline">A book a day keeps the... Wait. <br />A book a day? That's like a lot of time spent reading.</p>
        </header>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${displayMode === "userLibrary" ? "active" : ""}`}
            onClick={() => setDisplayMode("userLibrary")}
          >
            <span className="nav-icon">📚</span> My Library
          </button>
          <button
            className={`nav-item ${displayMode === "searchBooks" ? "active" : ""}`}
            onClick={() => setDisplayMode("searchBooks")}
          >
            <span className="nav-icon">🔍</span> Search Books
          </button>
        </nav>

        <footer className="sidebar-footer">
          <p>&copy;2026 Austin Robertson <br /> Brooklyn, NY</p>
        </footer>
      </aside>

      <main className="main-content">
        {displayMode === "searchBooks" && <SearchBar onSearch={fetchSearchResults} />}

        <section className='book-collection'>
          <h2>{displayMode === "userLibrary" ? "My Library" : "Search Results"}</h2>

          {/* USER LIBRARY VIEW */}
          {displayMode === "userLibrary"
            && <div className='book-grid'>
              {userLibraryBooks.map((book) => (
                <UserLibraryBookCard
                  key={book.id}
                  book={book}
                  onRemoveFromLibrary={removeFromUserLibrary}
                  onChangeReadingStatus={updateBookReadingStatus}
                  onChangeRating={updateBookRating}
                />
              ))}
            </div>
          }
          {/* SEARCH BOOKS VIEW */}
          {displayMode === "searchBooks"
            && <div className='book-grid'>
              {searchResultBooks.map((book) => (
                <SearchResultBookCard
                  key={book.id}
                  book={book}
                  onToggleAddToLibrary={toggleAddToUserLibrary}
                  addedToLibrary={inUserLibrary(book.id)}
                />
              ))}
            </div>
          }
        </section>

      </main>

      <footer className="mobile-footer">
        <p>&copy;2026 Austin Robertson - Brooklyn, NY</p>
      </footer>
    </div>
  )
}

export default App
