import { useState } from 'react';
import { type Book } from './Book.tsx'
import './BookCard.css';

interface UserLibraryBookCardProps {
  book: Book;
}

function UserLibraryBookCard({ book }: UserLibraryBookCardProps) {
  // const [inUserLibrary, setInUserLibrary] = useState<boolean>(removedFromLibrary);

  // function handleRemoveFromLibrary() {
  //   setInUserLibrary(!inUserLibrary);
  //   onToggleAddToLibrary(book);
  // }

  return (
    <div className="book-card">

      <div className="book-cover-wrapper">
        <img
          className="book-cover"
          src={book.cover_url}
          alt={`book cover for ${book.title} by ${book.author}`}
        />
        <div className="book-spine-crease"></div>
      </div>

      <div className="book-info">
        <h3 className="book-title" title={`${book.title} (${book.year_published})`}>
          {book.title} <span className="book-year">({book.year_published})</span>
        </h3>
        <p className="book-author">by {book.author}</p>

        {/* <button
          className={`book-card-button ${inUserLibrary ? 'added' : ''}`}
          type="button"
          onClick={handleToggleAddToLibrary}
        >
          {inUserLibrary ? "✓ Added to Library" : "+ Add to Library"}
        </button> */}
        
      </div>

    </div>
  )
}

export { UserLibraryBookCard };