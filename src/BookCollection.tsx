import { BookCard, type Book } from './BookCard.tsx';
import './BookCollection.css';

function BookCollection({ books }: { books: Book[] }) {
  // const [books, setBooks] = useState<>()

  return (

    <section className="book-collection">
      <h3>My Library</h3>
      <div className="books-container">
        {books.map((book) => <BookCard key={book.id} book={book} />)}
      </div>
    </section>

  )

}

export default BookCollection;