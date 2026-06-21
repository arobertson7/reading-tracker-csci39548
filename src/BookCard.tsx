import './BookCard.css';

interface Book {
  id: string; // the value of the "key" field in OpenLibrary API which uniquely identifies the Work
  title: string;
  author: string;
  year_published: number;
  cover_url: string;
}

interface BookCardProps {
  book: Book;
  displayMode?: string; // "userLibrary" or "searchBooks"
}

function BookCard({ book, displayMode }: BookCardProps) {

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

        {displayMode === "searchBooks" && (
          <button className="book-card-button" type="button">
            + Add to Library
          </button>
        )}
      </div>

    </div>
  )
}

export { BookCard, type Book };