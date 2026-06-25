import { useState, useEffect } from 'react';
import { type Book, type UserLibraryBook, type ReadingStatus, type BookRating } from './Book.tsx';
import { UserLibraryBookCard } from './UserLibraryBookCard.tsx';
import { SearchResultBookCard } from './SearchResultBookCard';
import SearchBar from './SearchBar';
import { type OpenLibraryBook } from './OpenLibraryBook';
import noBookCover from './assets/no-cover.png';

import oneFishTwoFish from './assets/one-fish-two-fish.jpg'; // temporary for sample book cover
import breakfastOfCHampions from './assets/breakfast-of-champions.jpg'; // temporary for sample book cover
import greenwichPark from './assets/greenwich-park.jpg'; // temporary for sample book cover
import unbearable from './assets/unbearable.jpg'; // temporary for sample book cover

function App() {
  const [displayMode, setDisplayMode] = useState<string>("userLibrary"); // "userLibrary" or "searchBooks"
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Date Added");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

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
    <div className="flex flex-col min-h-screen w-full md:flex-row md:h-screen md:overflow-hidden bg-[#fcfaf7] dark:bg-[#121110]">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 md:top-6 md:right-8 z-50 p-2.5 rounded-full bg-[#ffffff]/90 dark:bg-[#1a1816]/90 border border-[#e8e2d9] dark:border-[#2e2822] shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#fef3c7] dark:focus:ring-[#451a03] flex items-center justify-center"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5 text-[#f59e0b] transition-transform duration-500 hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-[#b45309] transition-transform duration-500 hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <aside className="bg-[#ffffff] dark:bg-[#1a1816] border-b border-[#e8e2d9] dark:border-[#2e2822] p-6 md:py-10 md:px-7 flex flex-col gap-6 md:gap-10 z-10 md:w-[280px] md:h-full md:border-b-0 md:border-r md:shrink-0">
        <header>
          <h1 className="font-['Lora',_Georgia,_serif] text-[1.8rem] md:text-[2.2rem] font-bold text-[#b45309] dark:text-[#f59e0b] mb-2 tracking-[-0.02em]">
            Reading Tracker
          </h1>
          <p className="text-[0.85rem] text-[#786d63] dark:text-[#b0a59a] leading-[1.4]">
            A book a day keeps the... Wait. <br />A book a day? That's like a lot of time spent reading.
          </p>
        </header>

        <nav className="flex gap-3 mt-2 md:flex-col md:gap-2 md:mt-4 md:grow">
          <button
            className={`flex items-center gap-2 py-[0.6rem] px-4 md:py-3 md:px-4 rounded-lg bg-transparent border border-transparent text-[#786d63] dark:text-[#b0a59a] text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4] md:w-full ${displayMode === "userLibrary" ? "bg-[#fef3c7] dark:bg-[#451a03] text-[#b45309] dark:text-[#f59e0b] border-[#e8e2d9] dark:border-[#2e2822]" : ""
              }`}
            onClick={() => setDisplayMode("userLibrary")}
          >
            <span className="text-[1.1rem]">📚</span> My Library
          </button>
          <button
            className={`flex items-center gap-2 py-[0.6rem] px-4 md:py-3 md:px-4 rounded-lg bg-transparent border border-transparent text-[#786d63] dark:text-[#b0a59a] text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4] md:w-full ${displayMode === "searchBooks" ? "bg-[#fef3c7] dark:bg-[#451a03] text-[#b45309] dark:text-[#f59e0b] border-[#e8e2d9] dark:border-[#2e2822]" : ""
              }`}
            onClick={() => setDisplayMode("searchBooks")}
          >
            <span className="text-[1.1rem]">🔍</span> Search Books
          </button>
        </nav>

        <footer className="hidden md:block md:mt-auto md:text-[0.75rem] md:text-[#a39b92] dark:text-[#85796d] md:leading-[1.5] md:border-t md:border-[#e8e2d9] dark:border-[#2e2822] pt-5">
          <p>&copy;2026 Austin Robertson <br /> Brooklyn, NY</p>
        </footer>
      </aside>

      <main className="flex-1 p-6 md:py-12 md:px-16 flex flex-col gap-8 md:gap-10 max-w-full md:h-full md:overflow-y-auto">
        {displayMode === "searchBooks" && <SearchBar onSearch={fetchSearchResults} />}

        <section>
          <h2 className="font-['Lora',_Georgia,_serif] text-[1.4rem] font-semibold text-[#2b2520] dark:text-[#f2ebe4] mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-10 after:h-[3px] after:bg-[#b45309] dark:after:bg-[#f59e0b] after:rounded-[2px]">
            {displayMode === "userLibrary" ? "My Library" : "Search Results"}
          </h2>

          {/* USER LIBRARY FILTER/SORT BAR */}
          {displayMode === "userLibrary" && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-[#e8e2d9]/60 dark:border-[#2e2822]/60">
              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a39b92] dark:text-[#85796d] mr-1">Filter:</span>
                {["All", "To Read", "Reading", "Finished"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${activeFilter === filter
                        ? "bg-[#fef3c7] dark:bg-[#451a03] text-[#b45309] dark:text-[#f59e0b] border border-[#b45309]/30 dark:border-[#f59e0b]/30 shadow-sm"
                        : "bg-[#ffffff] dark:bg-[#1a1816] text-[#786d63] dark:text-[#b0a59a] border border-[#e8e2d9] dark:border-[#2e2822] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4]"
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown & Order Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a39b92] dark:text-[#85796d] mr-1">Sort by:</span>
                <div className="relative inline-flex items-center bg-[#ffffff] dark:bg-[#1a1816] border border-[#e8e2d9] dark:border-[#2e2822] rounded-lg shadow-sm hover:border-[#b45309]/50 dark:hover:border-[#f59e0b]/50 transition-colors">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent pr-8 pl-3 py-1.5 text-xs md:text-sm font-semibold text-[#786d63] dark:text-[#b0a59a] focus:outline-none cursor-pointer"
                  >
                    <option value="Title" className="bg-[#ffffff] dark:bg-[#1a1816]">Title</option>
                    <option value="Author" className="bg-[#ffffff] dark:bg-[#1a1816]">Author</option>
                    <option value="Date Added" className="bg-[#ffffff] dark:bg-[#1a1816]">Date Added</option>
                  </select>
                  <div className="pointer-events-none absolute right-2.5 flex items-center text-[#786d63] dark:text-[#b0a59a]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-1.5 rounded-lg bg-[#ffffff] dark:bg-[#1a1816] border border-[#e8e2d9] dark:border-[#2e2822] text-[#786d63] dark:text-[#b0a59a] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4] cursor-pointer shadow-sm hover:border-[#b45309]/50 dark:hover:border-[#f59e0b]/50 transition-all flex items-center justify-center"
                  title={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
                >
                  {sortOrder === "asc" ? (
                    <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}


          {/* USER LIBRARY VIEW */}
          {displayMode === "userLibrary" && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6 w-full pt-2 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:gap-8">
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
          )}

          {/* SEARCH BOOKS VIEW */}
          {displayMode === "searchBooks" && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6 w-full pt-2 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:gap-8">
              {searchResultBooks.map((book) => (
                <SearchResultBookCard
                  key={book.id}
                  book={book}
                  onToggleAddToLibrary={toggleAddToUserLibrary}
                  addedToLibrary={inUserLibrary(book.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="text-center p-6 text-[0.75rem] text-[#a39b92] dark:text-[#85796d] border-t border-[#e8e2d9] dark:border-[#2e2822] bg-[#ffffff] dark:bg-[#1a1816] md:hidden">
        <p>&copy;2026 Austin Robertson - Brooklyn, NY</p>
      </footer>
    </div>
  );
}

export default App;
