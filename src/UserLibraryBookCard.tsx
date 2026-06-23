import { useState } from 'react';
import { type UserLibraryBook } from './Book.tsx'
import './BookCard.css';

interface UserLibraryBookCardProps {
  book: UserLibraryBook;
  onRemoveFromLibrary: (book: UserLibraryBook) => void;
}

function UserLibraryBookCard({ book, onRemoveFromLibrary }: UserLibraryBookCardProps) {

  function handleRemoveFromLibrary() {
    onRemoveFromLibrary(book);
  }

  return (
    <div className="book-card user-library-card">

      <div className="book-cover-wrapper">
        <img
          className="book-cover"
          src={book.cover_url}
          alt={`book cover for ${book.title} by ${book.author}`}
        />
        <div className="book-spine-crease"></div>
        {book.rating && (
          <div className="book-rating-badge" title={`User rating: ${book.rating} out of 5`}>
            <span className="star-icon">★</span> {book.rating}/5
          </div>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title" title={`${book.title} (${book.year_published})`}>
          {book.title} <span className="book-year">({book.year_published})</span>
        </h3>
        <p className="book-author">by {book.author}</p>

        <div className="library-controls">
          <div className="status-selector-wrapper">
            <select
              className="status-select"
              defaultValue={book.readingStatus || 'to-read'}
              aria-label="Reading status"
            >
              <option value="to-read">📖 Want to Read</option>
              <option value="reading">⚡ Reading</option>
              <option value="finished">✨ Completed</option>
            </select>
          </div>

          <button
            className="remove-from-library-btn"
            type="button"
            aria-label="Remove book from library"
            title="Remove from library"
            onClick={handleRemoveFromLibrary}
          >
            <span className="trash-icon">🗑️</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export { UserLibraryBookCard };