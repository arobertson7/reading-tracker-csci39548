import { useState } from 'react'
import './App.css'
import { type Book, BookCard } from './BookCard'
import SearchBar from './SearchBar'

import oneFishTwoFish from './assets/one-fish-two-fish.jpg'; // temporary for sample book cover
import breakfastOfCHampions from './assets/breakfast-of-champions.jpg' // temporary for sample book cover
import greenwichPark from './assets/greenwich-park.jpg' // temporary for sample book cover
import unbearable from './assets/unbearable.jpg' // temporary for sample book cover

function App() {
  const [displayMode, setDisplayMode] = useState<string>("userLibrary"); // "userLibrary" or "searchBooks"

  const [userBooks] = useState<Book[]>([
    { id: 1, title: "One Fish, Two Fish, Red Fish, Blue Fish", author: "Dr. Seuss", year_published: 1960, cover_url: oneFishTwoFish },
    { id: 2, title: "Breakfast of Champions", author: "Kurt Vonnegut", year_published: 1973, cover_url: breakfastOfCHampions},
    { id: 3, title: "Greenwich Park", author: "Katherine Faulkner", year_published: 2021, cover_url: greenwichPark},
    { id: 4, title: "The Unbearable Lightness of Being", author: "Milan Kundera", year_published: 1984, cover_url: unbearable}
  ]);
  const [queriedBooks] = useState<Book[]>([]);

  // Choose which books to show depending on displayMode
  const displayedBooks = displayMode === "userLibrary" ? userBooks : queriedBooks;

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
        {displayMode === "searchBooks" && <SearchBar />}
        
        <section className='book-collection'>
          <h2>{displayMode === "userLibrary" ? "My Library" : "Library Results"}</h2>
          <div className='book-grid'>
            {displayedBooks.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        </section>
      </main>

      <footer className="mobile-footer">
        <p>&copy;2026 Austin Robertson - Brooklyn, NY</p>
      </footer>
    </div>
  )
}

export default App
