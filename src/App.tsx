import { useState, useEffect } from 'react';
import { type Book, type UserLibraryBook, type ReadingStatus, type BookRating, type OpenLibraryBook } from './types.ts';
import { UserLibraryBookCard } from './components/UserLibraryBookCard.tsx';
import { SearchResultBookCard } from './components/SearchResultBookCard';
import SearchBar from './components/SearchBar';
import noBookCover from './assets/no-cover.png';
import { getFilterEmptyStateInfo, getAverageBookRating } from './helpers.tsx'
import { useLibraryBooks } from './hooks/useLibraryBooks.tsx';
import { useDarkMode } from './hooks/useDarkMode.tsx';

const OPEN_LIBRARY_URL = "https://openlibrary.org/search.json?q="; // simply append the query to the end

export default function App() {
  const { userLibraryBooks, inUserLibrary, removeFromUserLibrary, toggleAddToUserLibrary, updateBookReadingStatus, updateBookRating} = useLibraryBooks();

  const [searchResultBooks, setSearchResultBooks] = useState<Book[]>([]);
  const [fetchingSearchResults, setFetchingSearchResults] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [mostRecentSearch, setMostRecentSearch] = useState<string>("");
  const [searchError, setSearchError] = useState<string | null>(null);

  const [displayMode, setDisplayMode] = useState<string>("userLibrary"); // "userLibrary" or "searchBooks"
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Date Added");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { darkMode, setDarkMode } = useDarkMode();


  const filteredAndSortedLibraryBooks = userLibraryBooks
    .filter((book) => (
      activeFilter === "All" || book.readingStatus === activeFilter.toLowerCase().split(' ').join('-')
    ))
    .toSorted((a: UserLibraryBook, b: UserLibraryBook) => {
      let valA = (sortBy === "Date Added") ? a.dateAdded : (sortBy === "Title" ? a.title.toLowerCase() : a.author.toLowerCase())
      let valB = (sortBy === "Date Added") ? b.dateAdded : (sortBy === "Title" ? b.title.toLowerCase() : b.author.toLowerCase())

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;

      return 0;
    });

  async function fetchSearchResults(query: string) {
    setHasSearched(true);
    setFetchingSearchResults(true);
    setSearchError(null);
    try {
      const url = OPEN_LIBRARY_URL + query + "&limit=20";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
      setSearchError("Unable to fetch search results. Please check your network connection or try again.");
    } finally {
      setFetchingSearchResults(false);
      setMostRecentSearch(query);
    }
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
            A book a day keeps the... Wait. <br />A book a day? That's like a lot of reading.
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
            {displayMode === "userLibrary" ? (
              "My Library"
            ) : !hasSearched ? (
              "Discover Books"
            ) : fetchingSearchResults ? (
              "Searching..."
            ) : (
              <>
                Search Results
                {mostRecentSearch && (
                  <>
                    {" for "}
                    <span className="text-[#b45309] dark:text-[#f59e0b] italic font-serif font-bold">
                      "{decodeURIComponent(mostRecentSearch)}"
                    </span>
                  </>
                )}
              </>
            )}
          </h2>

          {/* USER LIBRARY FILTER/SORT BAR */}
          {displayMode === "userLibrary" && userLibraryBooks.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-[#e8e2d9]/60 dark:border-[#2e2822]/60">
              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a39b92] dark:text-[#85796d] mr-1">Filter:</span>
                {["All", "To Read", "Reading", "Finished"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer inline-flex items-center ${activeFilter === filter
                      ? "bg-[#fef3c7] dark:bg-[#451a03] text-[#b45309] dark:text-[#f59e0b] border border-[#b45309]/30 dark:border-[#f59e0b]/30 shadow-sm"
                      : "bg-[#ffffff] dark:bg-[#1a1816] text-[#786d63] dark:text-[#b0a59a] border border-[#e8e2d9] dark:border-[#2e2822] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4]"
                      }`}
                  >
                    <span>
                      {filter} ({filter === "All"
                        ? userLibraryBooks.length
                        : userLibraryBooks.filter((book) => book.readingStatus === filter.toLowerCase().split(' ').join('-')).length
                      })
                    </span>
                    {filter === "Finished" && userLibraryBooks.filter((book) => book.rating).length > 0 && (
                      <span className={`ml-1.5 text-[10px] md:text-xs font-medium ${activeFilter === "Finished"
                        ? "text-[#b45309]/75 dark:text-[#f59e0b]/75"
                        : "text-[#786d63]/70 dark:text-[#b0a59a]/70"
                        }`}>
                        Avg <span className="text-[#d97706] dark:text-[#fbbf24]">★</span>{getAverageBookRating(userLibraryBooks)}
                      </span>
                    )}
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
            userLibraryBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[#e8e2d9] dark:border-[#2e2822] rounded-2xl bg-[#ffffff] dark:bg-[#1a1816] max-w-md mx-auto my-4 shadow-[0_4px_12px_rgba(43,37,32,0.02)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-[#b45309]/40 dark:hover:border-[#f59e0b]/40">
                <div className="w-16 h-16 rounded-full bg-[#fef3c7] dark:bg-[#451a03] flex items-center justify-center text-3xl mb-5 shadow-inner">
                  <span className="animate-pulse">📚</span>
                </div>
                <h3 className="font-['Lora',_Georgia,_serif] text-xl font-bold text-[#2b2520] dark:text-[#f2ebe4] mb-2">
                  Your Library is Empty
                </h3>
                <p className="text-sm text-[#786d63] dark:text-[#b0a59a] mb-6 max-w-[280px] leading-relaxed">
                  Add books to your collection!
                </p>
                <button
                  onClick={() => setDisplayMode("searchBooks")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#b45309] dark:bg-[#f59e0b] text-[#ffffff] dark:text-[#121110] font-semibold text-xs md:text-sm shadow-md hover:bg-[#92400e] dark:hover:bg-[#d97706] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#fef3c7]"
                >
                  <span>🔍</span> Search Books
                </button>
              </div>
            ) : filteredAndSortedLibraryBooks.length === 0 ? (
              (() => {
                const filterInfo = getFilterEmptyStateInfo(activeFilter);
                return (
                  <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[#e8e2d9] dark:border-[#2e2822] rounded-2xl bg-[#ffffff] dark:bg-[#1a1816] max-w-md mx-auto my-4 shadow-[0_4px_12px_rgba(43,37,32,0.02)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-[#b45309]/40 dark:hover:border-[#f59e0b]/40">
                    <div className="w-16 h-16 rounded-full bg-[#fef3c7] dark:bg-[#451a03] flex items-center justify-center text-3xl mb-5 shadow-inner">
                      <span>{filterInfo.icon}</span>
                    </div>
                    <h3 className="font-['Lora',_Georgia,_serif] text-xl font-bold text-[#2b2520] dark:text-[#f2ebe4] mb-2">
                      {filterInfo.title}
                    </h3>
                    <p className="text-sm text-[#786d63] dark:text-[#b0a59a] mb-6 max-w-[280px] leading-relaxed">
                      {filterInfo.description}
                    </p>
                    <button
                      onClick={() => setActiveFilter("All")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ffffff] dark:bg-[#1a1816] text-[#b45309] dark:text-[#f59e0b] border border-[#b45309]/30 dark:border-[#f59e0b]/30 font-semibold text-xs md:text-sm shadow-sm hover:bg-[#fef3c7] dark:hover:bg-[#451a03] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#fef3c7]"
                    >
                      Show All Books
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6 w-full pt-2 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:gap-8">
                {filteredAndSortedLibraryBooks.map((book) => (
                  <UserLibraryBookCard
                    key={book.id}
                    book={book}
                    onRemoveFromLibrary={removeFromUserLibrary}
                    onChangeReadingStatus={updateBookReadingStatus}
                    onChangeRating={updateBookRating}
                  />
                ))}
              </div>
            )
          )}

          {/* SEARCH BOOKS VIEW */}
          {displayMode === "searchBooks" && (
            !hasSearched ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[#e8e2d9] dark:border-[#2e2822] rounded-2xl bg-[#ffffff] dark:bg-[#1a1816] max-w-lg mx-auto my-4 shadow-[0_4px_12px_rgba(43,37,32,0.02)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-[#b45309]/40 dark:hover:border-[#f59e0b]/40">
                <div className="w-16 h-16 rounded-full bg-[#fef3c7] dark:bg-[#451a03] flex items-center justify-center text-3xl mb-5 shadow-inner">
                  <span className="animate-bounce">🔍</span>
                </div>
                <h3 className="font-['Lora',_Georgia,_serif] text-xl font-bold text-[#2b2520] dark:text-[#f2ebe4] mb-2">
                  Discover New Books
                </h3>
                <p className="text-sm text-[#786d63] dark:text-[#b0a59a] max-w-sm leading-relaxed">
                  Search by title, author, or subject to find books and add them to your reading library.
                </p>
              </div>
            ) : fetchingSearchResults ? (
              <div className="flex flex-col items-center justify-center py-20 w-full">
                <div className="w-12 h-12 border-4 border-[#e8e2d9] dark:border-[#2e2822] border-t-[#b45309] dark:border-t-[#f59e0b] rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-semibold text-[#786d63] dark:text-[#b0a59a] animate-pulse">Fetching books from Open Library...</p>
              </div>
            ) : searchError ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[#fecaca] dark:border-[#450a0a] rounded-2xl bg-[#ffffff] dark:bg-[#1a1816] max-w-md mx-auto my-4 shadow-[0_4px_12px_rgba(43,37,32,0.02)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-[#ef4444]/40">
                <div className="w-16 h-16 rounded-full bg-[#fee2e2] dark:bg-[#7f1d1d] flex items-center justify-center text-3xl mb-5 shadow-inner">
                  <span>⚠️</span>
                </div>
                <h3 className="font-['Lora',_Georgia,_serif] text-xl font-bold text-[#b91c1c] dark:text-[#f87171] mb-2">
                  Search Failed
                </h3>
                <p className="text-sm text-[#786d63] dark:text-[#b0a59a] mb-6 max-w-[280px] leading-relaxed">
                  {searchError}
                </p>
                <button
                  onClick={() => fetchSearchResults(mostRecentSearch)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ef4444] dark:bg-[#dc2626] text-[#ffffff] font-semibold text-xs md:text-sm shadow-md hover:bg-[#dc2626] dark:hover:bg-[#b91c1c] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#fee2e2]"
                >
                  Try Again
                </button>
              </div>
            ) : searchResultBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[#e8e2d9] dark:border-[#2e2822] rounded-2xl bg-[#ffffff] dark:bg-[#1a1816] max-w-md mx-auto my-4 shadow-[0_4px_12px_rgba(43,37,32,0.02)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-[#b45309]/40 dark:hover:border-[#f59e0b]/40">
                <div className="w-16 h-16 rounded-full bg-[#fef3c7] dark:bg-[#451a03] flex items-center justify-center text-3xl mb-5 shadow-inner">
                  <span>🧐</span>
                </div>
                <h3 className="font-['Lora',_Georgia,_serif] text-xl font-bold text-[#2b2520] dark:text-[#f2ebe4] mb-2">
                  No Results Found
                </h3>
                <p className="text-sm text-[#786d63] dark:text-[#b0a59a] max-w-[280px] leading-relaxed">
                  We couldn't find any books matching your search query. Try checking your spelling or using different keywords.
                </p>
              </div>
            ) : (
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
            )
          )}
        </section>
      </main>

      <footer className="text-center p-6 text-[0.75rem] text-[#a39b92] dark:text-[#85796d] border-t border-[#e8e2d9] dark:border-[#2e2822] bg-[#ffffff] dark:bg-[#1a1816] md:hidden">
        <p>&copy;2026 Austin Robertson - Brooklyn, NY</p>
      </footer>
    </div>
  );
}