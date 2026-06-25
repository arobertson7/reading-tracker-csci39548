import { useState } from 'react';
import { type UserLibraryBook } from './Book.tsx'
import './BookCard.css';

interface UserLibraryBookCardProps {
  book: UserLibraryBook;
  onRemoveFromLibrary: (book: UserLibraryBook) => void;
  onChangeReadingStatus: (bookId: string, newReadingStatus: string) => void;
  onChangeRating: (bookId: string, rating: number) => void;
}

function UserLibraryBookCard({ book, onRemoveFromLibrary, onChangeReadingStatus, onChangeRating }: UserLibraryBookCardProps) {
  const [isSelectingRating, setIsSelectingRating] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

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
        {book.readingStatus === 'finished' && (
          <div
            className="rating-badge-container"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsSelectingRating(false);
              }
            }}
          >
            <button
              className={`book-rating-badge ${book.rating ? '' : 'unrated'}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSelectingRating((prev) => !prev);
              }}
              title={
                book.rating
                  ? `User rating: ${book.rating} out of 5. Click to change.`
                  : 'Click to rate this book'
              }
              aria-label={
                book.rating
                  ? `Rating: ${book.rating} out of 5. Click to change.`
                  : 'Rate this book'
              }
            >
              <span className="star-icon">★</span>{' '}
              {book.rating ? `${book.rating}/5` : 'Rate'}
            </button>

            {isSelectingRating && (
              <div className="rating-selector-popover" onClick={(e) => e.stopPropagation()}>
                <div className="rating-selector-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-select-btn ${(hoveredRating ?? (book.rating || 0)) >= star ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => {
                        onChangeRating(book.id, star);
                        setIsSelectingRating(false);
                      }}
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              onChange={(e) => onChangeReadingStatus(book.id, e.target.value)}
            >
              <option value="to-read">📖 To Read</option>
              <option value="reading">⚡ Reading Now</option>
              <option value="finished">✨ Finished</option>
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